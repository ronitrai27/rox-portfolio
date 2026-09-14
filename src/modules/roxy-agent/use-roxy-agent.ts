// src/modules/roxy-agent/use-roxy-agent.ts
"use client";

import { useState, useCallback, useRef } from "react";
import { streamRoxyAgent } from "./roxy-stream";

export interface RoxyMessage {
  id: string;
  role: "user" | "assistant" | "tool";
  text: string;
  toolName?: string;
  toolStatus?: "running" | "done";
  toolOutput?: any;
}

export interface RoxyToolStatus {
  toolName: string;
  status: "running" | "done";
  output?: unknown;
}

export function useRoxyAgent() {
  const [messages, setMessages] = useState<RoxyMessage[]>([]);
  const [toolStatus, setToolStatus] = useState<RoxyToolStatus | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const assistantIdRef = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const stop = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);
    setToolStatus(null);
  }, []);

  const clear = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setMessages([]);
    setIsStreaming(false);
    setToolStatus(null);
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim()) return;

      // Cancel any active stream before starting a new one
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      // 1. Add user message
      const userMsg: RoxyMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        text,
      };
      setMessages((prev) => [...prev, userMsg]);

      // 2. Prepare empty assistant bubble
      const assistantId = `assistant-${++assistantIdRef.current}`;
      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: "assistant", text: "" },
      ]);
      setIsStreaming(true);
      setToolStatus(null);

      // 3. Build messages array in UIMessage parts format
      const allMessages = [...messages, userMsg]
        .filter((m) => m.role === "user" || m.role === "assistant")
        .map((m) => ({
          id: m.id,
          role: m.role,
          parts: [{ type: "text", text: m.text }],
        }));

      try {
        await streamRoxyAgent(
          { messages: allMessages },
          {
            onText: (delta: string) => {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, text: m.text + delta } : m
                )
              );
            },
            onToolStart: (toolName: string) => {
              setToolStatus({ toolName, status: "running" });
              setMessages((prev) => [
                ...prev,
                {
                  id: `tool-${toolName}-${Date.now()}`,
                  role: "tool",
                  text: "",
                  toolName,
                  toolStatus: "running",
                },
              ]);
            },
            onToolDone: (toolName: string, output: any) => {
              setToolStatus({ toolName, status: "done", output });
              setMessages((prev) =>
                prev.map((m) =>
                  m.role === "tool" &&
                  m.toolName === toolName &&
                  m.toolStatus === "running"
                    ? { ...m, toolStatus: "done", toolOutput: output }
                    : m
                )
              );
            },
            onFinish: () => {
              setIsStreaming(false);
              setToolStatus(null);
              abortControllerRef.current = null;
            },
            onError: (err: any) => {
              if (
                err.name !== "AbortError" &&
                err.message !== "The user aborted a request."
              ) {
                console.error("[Roxy Agent] Stream error:", err);
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId
                      ? {
                          ...m,
                          text: `⚠️ Error: ${err.message || "An error occurred."}`,
                        }
                      : m
                  )
                );
              }
              setIsStreaming(false);
              setToolStatus(null);
              abortControllerRef.current = null;
            },
          },
          controller.signal
        );
      } catch (err: any) {
        if (
          err.name !== "AbortError" &&
          err.message !== "The user aborted a request."
        ) {
          console.error("[Roxy Agent] Fetch error:", err);
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? {
                    ...m,
                    text: `⚠️ Error: ${err.message || "Failed to connect to the server."}`,
                  }
                : m
            )
          );
        }
        setIsStreaming(false);
        setToolStatus(null);
        abortControllerRef.current = null;
      }
    },
    [messages]
  );

  return { messages, toolStatus, isStreaming, sendMessage, stop, clear };
}
