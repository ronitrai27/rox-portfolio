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

export async function POST(req: Request) {
  try {
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
