"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  Loader2,
  LucideBrain,
  Mic,
  RotateCcw,
  Send,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useRoxyAgent } from "./use-roxy-agent";

export const STARTER_SUGGESTIONS = [
  {
    label: "Who is ROX & what does he do?",
    prompt: "Who is Ronit Rai (ROX) and what is his background?",
  },
  {
    label: "What are ROX's top projects?",
    prompt: "Tell me about ROX's top projects and what technologies he used.",
  },
  {
    label: "What is ROX's core tech stack?",
    prompt: "What is ROX's core technical stack and engineering expertise?",
  },
  {
    label: "Email me ROX's resume & links",
    prompt:
      "Can you send ROX's complete portfolio details, resume, and links to my email?",
  },
  {
    label: "Leave a message for Ronit",
    prompt: "I would like to send a project inquiry / message to Ronit Rai.",
  },
];

interface RoxyChatWidgetProps {
  buttonRef?: React.RefObject<HTMLButtonElement | null>;
  positionClass?: string;
}

export default function RoxyChatWidget({
  buttonRef,
  positionClass = "fixed sm:absolute right-0 top-1/2 z-30",
}: RoxyChatWidgetProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const chatScrollRef = useRef<HTMLDivElement>(null);

  const { messages, toolStatus, isStreaming, sendMessage, clear } =
    useRoxyAgent();

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, toolStatus, isStreaming]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() || isStreaming) return;

    const text = inputValue.trim();
    setInputValue("");
    sendMessage(text);
  };

  return (
    <>
      {/* Ask anything Tab (Right Screen Edge) */}
      <button
        ref={buttonRef as any}
        type="button"
        aria-label="Ask anything"
        onClick={() => setIsChatOpen(true)}
        className={`${positionClass} bg-white/95 backdrop-blur-md border-l border-y border-black/10 py-2 sm:py-4 px-1 sm:px-2 rounded-l-lg sm:rounded-l-xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] flex items-center justify-center cursor-pointer hover:bg-white transition-all duration-300 group hover:translate-x-[-3px]`}
      >
        <div
          className="flex items-center gap-1 sm:gap-2"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          <span className="w-3.5 h-3.5 sm:w-5 sm:h-5 flex items-center justify-center rounded-full text-[9px] sm:text-xs bg-[#c5eb35] font-bold text-[#141b16]">
            R
          </span>
          <span className="font-sans text-[8px] sm:text-[11px] font-semibold tracking-wider text-neutral-800 group-hover:text-black uppercase whitespace-nowrap">
            Ask anything
          </span>
        </div>
      </button>

      {/* Right Side AI Agent Popup */}
      <AnimatePresence>
        {isChatOpen && (
          <>
            {/* Backdrop for mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsChatOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-50 sm:hidden"
            />

            {/* Right-Side Popup Panel */}
            <motion.aside
              initial={{ x: "100%", opacity: 0.5 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed right-0 top-1/2 -translate-y-1/2 z-50 w-[86vw] sm:w-[380px] md:w-[420px] h-[440px] sm:h-[600px] max-h-[82vh] bg-white text-black rounded-l-2xl sm:rounded-l-3xl shadow-[0_20px_60px_rgba(0,0,0,0.18)] border-l border-y border-black/10 flex flex-col overflow-hidden"
            >
              {/* Top Header */}
              <div className="p-3 sm:p-5 border-b border-black/8 flex items-center justify-between bg-neutral-50/70">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#c5eb35] flex items-center justify-center font-sans font-bold text-xs text-[#141b16] shadow-xs">
                    R
                  </div>
                  <div>
                    <h3 className="font-sans font-semibold text-sm sm:text-base text-neutral-900 tracking-tight flex items-center gap-2">
                      Roxy - AI Agent
                      <span className="w-2 h-2 rounded-full bg-[#c5eb35] animate-pulse" />
                    </h3>
                    <p className="text-[11px] text-neutral-500 font-sans">
                      ROX Personal Assistant
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {messages.length > 0 && (
                    <button
                      type="button"
                      onClick={clear}
                      className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center transition-colors cursor-pointer"
                      title="Clear chat"
                      aria-label="Clear chat"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setIsChatOpen(false)}
                    className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="Close chat"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Body Space: Chat Messages or Starter Suggestions */}
              <div
                ref={chatScrollRef}
                className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-3.5 text-xs sm:text-sm font-sans"
              >
                {messages.length === 0 ? (
                  <div className="flex flex-col gap-3 py-2">
                    <div className="px-1">
                      <p className="text-xs sm:text-sm font-mono uppercase tracking-wide mb-1 flex items-center gap-2">
                        <LucideBrain className="size-4 sm:size-5" /> Quick
                        Suggestions
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 pt-1">
                      {STARTER_SUGGESTIONS.map((item, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => sendMessage(item.prompt)}
                          className="w-full text-left p-2.5 rounded-xl border border-black/6 bg-neutral-50/80 hover:bg-[#c5eb35]/20 hover:border-[#c5eb35]/50 transition-all duration-200 group flex items-center justify-between gap-2 cursor-pointer shadow-2xs"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="text-xs text-neutral-700 group-hover:text-neutral-900 font-medium truncate">
                              {item.label}
                            </span>
                          </div>
                          <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-900 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    {messages.map((msg, i) => (
                      <React.Fragment key={msg.id || i}>
                        {msg.role === "user" && (
                          <div className="flex justify-end">
                            <div className="max-w-[84%] px-3.5 py-2.5 rounded-2xl leading-relaxed bg-[#c5eb35] text-[#141b16] font-medium rounded-br-xs text-xs sm:text-sm shadow-2xs">
                              {msg.text}
                            </div>
                          </div>
                        )}

                        {msg.role === "assistant" && (
                          <div className="flex justify-start">
                            <div className="max-w-[88%] px-3.5 py-2.5 rounded-2xl leading-relaxed bg-neutral-100 text-neutral-800 rounded-bl-xs text-xs sm:text-[13px]">
                              {msg.text ? (
                                <div className="prose prose-xs max-w-none text-neutral-800 [&>p]:mb-2 [&>p:last-child]:mb-0 [&>ul]:pl-4 [&>ul]:list-disc [&>ul]:mb-2 [&>li]:mb-1 [&>ol]:pl-4 [&>ol]:list-decimal [&>strong]:font-semibold [&>a]:text-emerald-700 [&>a]:underline">
                                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {msg.text}
                                  </ReactMarkdown>
                                </div>
                              ) : isStreaming ? (
                                <div className="flex items-center gap-1.5 py-1 text-neutral-500">
                                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce" />
                                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce [animation-delay:0.15s]" />
                                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce [animation-delay:0.3s]" />
                                </div>
                              ) : null}
                            </div>
                          </div>
                        )}

                        {msg.role === "tool" && (
                          <div className="w-full my-1">
                            {msg.toolStatus === "running" ? (
                              <div className="rounded-xl border border-amber-300/70 bg-amber-50/80 p-2.5 flex items-center gap-2 text-amber-900 text-xs">
                                <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600 shrink-0" />
                                <span className="font-medium">
                                  {msg.toolName === "contactRoxy"
                                    ? "Sending your message to Ronit's inbox..."
                                    : "Dispatching ROX's details to your email..."}
                                </span>
                              </div>
                            ) : (
                              <div className="rounded-xl border border-emerald-300/70 bg-emerald-50/80 p-2.5 flex items-start gap-2 text-emerald-900 text-xs">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                <div className="leading-relaxed font-normal">
                                  {msg.toolOutput?.message ||
                                    "Action completed successfully."}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                  </>
                )}
              </div>

              {/* Bottom Input Bar with Mic Icon & Send Button */}
              <form
                onSubmit={handleSendMessage}
                className="p-2.5 sm:p-4 border-t border-black/8 bg-neutral-50/50 flex items-center gap-2"
              >
                <div className="relative flex-1 flex items-center">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask anything..."
                    disabled={isStreaming}
                    className="w-full pl-3.5 pr-10 py-2 sm:py-2.5 text-xs sm:text-sm bg-white border border-black/10 rounded-full focus:outline-hidden focus:border-[#c5eb35] focus:ring-1 focus:ring-[#c5eb35] transition-all text-neutral-900 placeholder:text-neutral-400 disabled:opacity-60"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setInputValue(
                        "Tell me about ROX's tech stack and experience!",
                      );
                    }}
                    className="absolute right-2.5 p-1 text-neutral-400 hover:text-neutral-800 transition-colors cursor-pointer"
                    title="Suggestion"
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={!inputValue.trim() || isStreaming}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#c5eb35] hover:bg-[#b5e024] disabled:opacity-50 disabled:cursor-not-allowed text-[#141b16] flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95 shrink-0"
                  aria-label="Send message"
                >
                  {isStreaming ? (
                    <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin text-[#141b16]" />
                  ) : (
                    <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  )}
                </button>
              </form>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
