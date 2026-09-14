// src/modules/roxy-agent/roxy-stream.ts

export type StreamEvent =
  | { type: "start" }
  | { type: "start-step" }
  | { type: "finish-step" }
  | { type: "finish"; finishReason: string }
  | { type: "text-start"; id: string }
  | { type: "text-delta"; id: string; delta: string }
  | { type: "text-end"; id: string }
  | { type: "tool-input-start"; toolCallId: string; toolName: string }
  | { type: "tool-input-delta"; toolCallId: string; inputTextDelta: string }
  | {
      type: "tool-input-available";
      toolCallId: string;
      toolName: string;
      input: Record<string, unknown>;
    }
  | { type: "tool-output-available"; toolCallId: string; output: unknown };

export interface RoxyStreamCallbacks {
  onText?: (delta: string) => void;
  onTextDone?: (fullText: string) => void;
  onToolStart?: (toolName: string) => void;
  onToolDone?: (toolName: string, output: unknown) => void;
  onFinish?: () => void;
  onError?: (err: Error) => void;
}

export async function streamRoxyAgent(
  body: { messages: unknown[] },
  callbacks: RoxyStreamCallbacks,
  signal?: AbortSignal
) {
  const res = await fetch("/api/roxy-agent", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
    },
    body: JSON.stringify(body),
    signal,
  });

  if (!res.ok || !res.body) {
    const errText = await res.text().catch(() => "");
    let friendlyMessage = errText || `HTTP ${res.status}`;
    try {
      const parsed = JSON.parse(errText);
      if (parsed.error) friendlyMessage = parsed.error;
    } catch {
      // Not JSON, use raw text
    }
    callbacks.onError?.(new Error(friendlyMessage));
    return;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  const textBlocks = new Map<string, string>();
  const toolNames = new Map<string, string>();

  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const raw = line.slice("data: ".length).trim();
      if (raw === "[DONE]") {
        callbacks.onFinish?.();
        return;
      }

      let event: StreamEvent;
      try {
        event = JSON.parse(raw);
      } catch {
        continue;
      }

      switch (event.type) {
        case "text-start":
          textBlocks.set(event.id, "");
          break;

        case "text-delta":
          textBlocks.set(
            event.id,
            (textBlocks.get(event.id) ?? "") + event.delta
          );
          callbacks.onText?.(event.delta);
          break;

        case "text-end":
          callbacks.onTextDone?.(textBlocks.get(event.id) ?? "");
          textBlocks.delete(event.id);
          break;

        case "tool-input-start":
          toolNames.set(event.toolCallId, event.toolName);
          callbacks.onToolStart?.(event.toolName);
          break;

        case "tool-output-available":
          callbacks.onToolDone?.(
            toolNames.get(event.toolCallId) ?? "unknown",
            event.output
          );
          toolNames.delete(event.toolCallId);
          break;
      }
    }
  }
}
