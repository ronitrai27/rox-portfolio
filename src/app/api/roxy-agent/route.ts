// src/app/api/roxy-agent/route.ts
import { createOpenAI } from "@ai-sdk/openai";
import {
  convertToModelMessages,
  type InferUITools,
  stepCountIs,
  streamText,
  type UIDataTypes,
  type UIMessage,
} from "ai";
import { ROXY_SYSTEM_PROMPT } from "@/lib/roxy-agent/roxy-knowledge";
import { roxyTools } from "@/lib/roxy-agent/roxy-tools";

export type RoxyTools = InferUITools<typeof roxyTools>;
export type RoxyUIMessage = UIMessage<never, UIDataTypes, RoxyTools>;

// ============================================================================
// RATE LIMITER CONFIG: Max 3 requests per IP per minute
// ============================================================================
const RATE_LIMIT_MAX_REQUESTS = 3;
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 60 seconds

const ipRequestMap = new Map<string, number[]>();

function getClientIp(req: Request): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  return (
    req.headers.get("x-real-ip") ||
    req.headers.get("cf-connecting-ip") ||
    "127.0.0.1"
  );
}

function checkRateLimit(ip: string): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const timestamps = (ipRequestMap.get(ip) || []).filter((t) => t > windowStart);

  if (timestamps.length >= RATE_LIMIT_MAX_REQUESTS) {
    const oldest = timestamps[0];
    const retryAfter = Math.ceil((oldest + RATE_LIMIT_WINDOW_MS - now) / 1000);
    return { allowed: false, retryAfterSeconds: Math.max(1, retryAfter) };
  }

  timestamps.push(now);
  ipRequestMap.set(ip, timestamps);

  // Periodically prune stale entries to prevent memory growth
  if (ipRequestMap.size > 2000) {
    for (const [key, list] of ipRequestMap.entries()) {
      const valid = list.filter((t) => t > windowStart);
      if (valid.length === 0) ipRequestMap.delete(key);
      else ipRequestMap.set(key, valid);
    }
  }

  return { allowed: true, retryAfterSeconds: 0 };
}

export async function POST(req: Request) {
  try {
    // 1. Check Rate Limit
    const clientIp = getClientIp(req);
    const { allowed, retryAfterSeconds } = checkRateLimit(clientIp);

    if (!allowed) {
      return new Response(
        JSON.stringify({
          error: `Rate limit reached: Max 3 requests allowed per minute. Please try again in ${retryAfterSeconds}s.`,
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": String(retryAfterSeconds),
          },
        }
      );
    }

    let body: any;
    try {
      body = await req.json();
    } catch {
      return new Response("Invalid JSON payload", { status: 400 });
    }

    const { messages }: { messages: RoxyUIMessage[] } = body;

    if (!Array.isArray(messages)) {
      return new Response("messages must be an array", { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return new Response("OPENAI_API_KEY is not configured", { status: 500 });
    }

    const customOpenai = createOpenAI({
      apiKey,
    });

    const result = streamText({
      model: customOpenai("gpt-4o-mini"),
      system: ROXY_SYSTEM_PROMPT,
      messages: await convertToModelMessages(messages),
      tools: roxyTools,
      toolChoice: "auto",
      stopWhen: stepCountIs(3),
      onFinish: async ({ text }) => {
        console.log(
          "[Roxy Agent] Finished generation:",
          text ? text.slice(0, 40) + "..." : "Tool execution completed"
        );
      },
    });

    return result.toUIMessageStreamResponse({
      sendReasoning: false,
      sendSources: false,
    });
  } catch (error: any) {
    console.error("[Roxy Agent] API Route Error:", error);
    return new Response(error?.message || "Internal Server Error", {
      status: 500,
    });
  }
}
