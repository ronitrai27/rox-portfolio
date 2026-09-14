"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  ArrowUpRight,
  CheckCircle2,
  Download,
  Loader2,
  LucideBrain,
  Mic,
  RotateCcw,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { NoiseBackground } from "@/components/ui/noise-background";
import { SpinningText } from "@/components/ui/spinning-text";
import { useRoxyAgent } from "@/modules/roxy-agent/use-roxy-agent";

gsap.registerPlugin(useGSAP);

interface HeroProps {
  isLoaded?: boolean;
}

const STARTER_SUGGESTIONS = [
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

export default function Hero({ isLoaded = false }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const topNavRef = useRef<HTMLDivElement>(null);
  const title1Ref = useRef<HTMLHeadingElement>(null);
  const title2Ref = useRef<HTMLHeadingElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const bottomArrowRef = useRef<HTMLDivElement>(null);
  const bottomSocialsRef = useRef<HTMLDivElement>(null);
  const quickInfoRef = useRef<HTMLButtonElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const { messages, toolStatus, isStreaming, sendMessage, stop, clear } =
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

  // Set initial states for clean GSAP entrance
  useGSAP(
    () => {
      const safeSet = (
        targets: (Element | null | undefined)[] | Element | null | undefined,
        vars: gsap.TweenVars,
      ) => {
        const valid = Array.isArray(targets)
          ? targets.filter((el): el is Element => Boolean(el))
          : targets
            ? [targets]
            : [];
        if (valid.length > 0) {
          gsap.set(valid, vars);
        }
      };

      safeSet(topNavRef.current, { autoAlpha: 0, y: -25 });
      safeSet([title1Ref.current, title2Ref.current], { autoAlpha: 0, y: 55 });
      safeSet(taglineRef.current, { autoAlpha: 0, y: 30 });
      safeSet(imageRef.current, { autoAlpha: 0, y: 110, scale: 0.95 });
      safeSet(
        [
          bottomArrowRef.current,
          bottomSocialsRef.current,
          quickInfoRef.current,
        ],
        {
          autoAlpha: 0,
          scale: 0.85,
        },
      );
    },
    { scope: containerRef },
  );

  // Trigger smooth entrance animation as soon as the loading screen finishes
  useEffect(() => {
    if (!isLoaded) return;

    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
    });

    // 1. Top bar fades down
    if (topNavRef.current) {
      tl.to(
        topNavRef.current,
        {
          autoAlpha: 1,
          y: 0,
          duration: 1.0,
          ease: "power2.out",
        },
        0,
      );
    }

    // 2. Large Serif Italic Titles rise into place slowly
    const titles = [title1Ref.current, title2Ref.current].filter(
      (el): el is HTMLHeadingElement => Boolean(el),
    );
    if (titles.length > 0) {
      tl.to(
        titles,
        {
          autoAlpha: 1,
          y: 0,
          duration: 1.3,
          stagger: 0.18,
          ease: "power3.out",
        },
        0.1,
      );
    }

    // 3. User image rises into place from bottom with smooth fade
    if (imageRef.current) {
      tl.to(
        imageRef.current,
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 1.6,
          ease: "power2.out",
        },
        0.15,
      );
    }

    // 4. Tagline & buttons fade in
    if (taglineRef.current) {
      tl.to(
        taglineRef.current,
        {
          autoAlpha: 1,
          y: 0,
          duration: 1.2,
          ease: "power2.out",
        },
        0.35,
      );
    }

    // 5. Left circular arrow, right socials, and quick-info tab appear
    const bottomControls = [
      bottomArrowRef.current,
      bottomSocialsRef.current,
      quickInfoRef.current,
    ].filter((el): el is HTMLButtonElement | HTMLDivElement => Boolean(el));

    if (bottomControls.length > 0) {
      tl.to(
        bottomControls,
        {
          autoAlpha: 1,
          scale: 1,
          duration: 0.9,
          stagger: 0.1,
          ease: "back.out(1.4)",
        },
        0.5,
      );
    }
  }, [isLoaded]);

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full bg-[#eaeae8] text-black overflow-hidden flex flex-col justify-between px-6 py-6 select-none"
    >
      {/* Top Header Bar */}
      <header
        ref={topNavRef}
        className="relative z-30 w-full flex justify-between items-center max-w-7xl mx-auto"
      >
        {/* Name / Brand */}
        <span className="font-sans font-semibold text-lg sm:text-xl tracking-tight text-[#141b16]">
          ROX
        </span>

        {/* Contact Pill Button */}
        <button
          type="button"
          onClick={() => {
            const aboutEl = document.getElementById("about-section");
            if (aboutEl) {
              aboutEl.scrollIntoView({ behavior: "smooth" });
            }
          }}
          className="group bg-[#c5eb35] hover:bg-[#b5e024] text-[#141b16] font-sans font-semibold text-xs sm:text-sm px-6 py-2.5 rounded-full flex items-center gap-2 transition-all duration-300 shadow-sm hover:scale-105 active:scale-95 cursor-pointer"
        >
          <span>Contact</span>
          <span className="w-5 h-5 rounded-full bg-black/10 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
            <ArrowUpRight className="w-3.5 h-3.5 text-[#141b16]" />
          </span>
        </button>
      </header>

      {/* Main Center Stage */}
      <div className="relative w-full h-full! z-20">
        <h1
          ref={title1Ref}
          className="text-5xl sm:text-7xl md:text-[112px] font-serif tracking-wider italic font-light absolute top-20 sm:top-20 md:top-24 left-1/2 md:left-[40%] -translate-x-1/2 whitespace-nowrap will-change-transform"
        >
          AI ENGINEER
        </h1>
        <div
          ref={taglineRef}
          className="absolute top-36 sm:top-40 md:top-1/3 md:mt-14 left-1/2 -translate-x-1/2 md:translate-x-0 w-full max-w-xs sm:max-w-md md:max-w-none text-center md:text-left will-change-transform px-4 md:px-0"
        >
          <h2
            ref={title2Ref}
            className="text-4xl sm:text-5xl md:text-7xl font-sans leading-tight md:leading-7 tracking-tight font-semibold"
          >
            WHO SHIPS
          </h2>
          <p className="mt-4 sm:mt-6 md:mt-10">
            <span className="text-sm sm:text-base md:text-lg tracking-tight capitalize leading-relaxed md:leading-0 font-sans font-medium">
              code is the medium.
              <br />
              building the impossible is the point.
            </span>
          </p>

          <div className="flex items-center justify-center md:justify-start gap-2.5 sm:gap-3 mt-5 sm:mt-6 ml-0 md:ml-10">
            <NoiseBackground
              containerClassName="w-fit p-1 rounded-full"
              gradientColors={[
                "rgb(197, 235, 53)",
                "rgb(181, 224, 36)",
                "rgb(220, 252, 70)",
              ]}
            >
              <a
                href="/resume.pdf"
                download="Ronit_Rai_Resume.pdf"
                className="h-full w-full cursor-pointer rounded-full bg-linear-to-r from-neutral-100 via-neutral-100 to-white px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-black shadow-[0px_2px_0px_0px_var(--color-neutral-50)_inset,0px_0.5px_1px_0px_var(--color-neutral-400)] transition-all duration-100 active:scale-98 flex items-center gap-1.5 sm:gap-2 whitespace-nowrap"
              >
                <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black" />
                <span>Download CV</span>
              </a>
            </NoiseBackground>

            <NoiseBackground
              containerClassName="w-fit p-1 rounded-full"
              gradientColors={[
                "rgb(197, 235, 53)",
                "rgb(181, 224, 36)",
                "rgb(220, 252, 70)",
              ]}
            >
              <button
                type="button"
                onClick={() => {
                  const worksEl = document.getElementById("works-stage");
                  if (worksEl) {
                    worksEl.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="h-full w-full cursor-pointer rounded-full bg-linear-to-r from-neutral-100 via-neutral-100 to-white px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-black shadow-[0px_2px_0px_0px_var(--color-neutral-50)_inset,0px_0.5px_1px_0px_var(--color-neutral-400)] transition-all duration-100 active:scale-98 flex items-center gap-1.5 sm:gap-2 whitespace-nowrap"
              >
                <span>See my Blogs</span>
                <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black" />
              </button>
            </NoiseBackground>
          </div>
        </div>
      </div>

      {/* User Image: Grounded at bottom of screen, positioned to the left, behind bottom controls */}
      <div
        ref={imageRef}
        className="absolute bottom-0 left-1/2 md:left-[32%] -translate-x-1/2 z-10 md:z-20 w-[85vw] max-w-[320px] sm:max-w-[460px] md:max-w-[540px] lg:max-w-[620px] xl:max-w-[660px] h-[46vh] sm:h-[60vh] md:h-[74vh] lg:h-[77vh] flex items-end justify-center pointer-events-none will-change-transform"
      >
        <div className="relative w-full h-full">
          <Image
            src="/rox_sofa.png"
            alt="ROX"
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 680px"
            className="object-contain object-bottom"
          />
        </div>
      </div>

      {/* Ask anything Tab (Right Screen Edge) */}
      <button
        ref={quickInfoRef}
        type="button"
        aria-label="Ask anything"
        onClick={() => setIsChatOpen(true)}
        className="fixed sm:absolute right-0 top-1/2 z-30 bg-white/95 backdrop-blur-md border-l border-y border-black/10 py-2 sm:py-4 px-1 sm:px-2 rounded-l-lg sm:rounded-l-xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] flex items-center justify-center cursor-pointer hover:bg-white transition-all duration-300 group hover:translate-x-[-3px]"
      >
        <div
          className="flex items-center gap-1 sm:gap-2"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          <span className="w-3.5 h-3.5 sm:w-5 sm:h-5 flex items-center justify-center rounded-full text-[9px] sm:text-xs bg-[#c5eb35]">
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
              className="fixed right-0 top-1/2 -translate-y-1/2 z-50 w-[86vw] sm:w-[380px] md:w-[420px] h-[440px] sm:h-[600px] max-h-[82vh] bg-white rounded-l-2xl sm:rounded-l-3xl shadow-[0_20px_60px_rgba(0,0,0,0.18)] border-l border-y border-black/10 flex flex-col overflow-hidden"
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
                className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs sm:text-sm font-sans"
              >
                {messages.length === 0 ? (
                  <div className="flex flex-col gap-3 py-2">
                    <div className="px-1">
                      <p className="text-sm font-mono uppercase tracking-wide mb-1">
                        <LucideBrain className="inline ml-2 size-5" /> Quick
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
                className="p-3 sm:p-4 border-t border-black/8 bg-neutral-50/50 flex items-center gap-2"
              >
                <div className="relative flex-1 flex items-center">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask anything..."
                    disabled={isStreaming}
                    className="w-full pl-3.5 pr-10 py-2.5 text-xs sm:text-sm bg-white border border-black/10 rounded-full focus:outline-hidden focus:border-[#c5eb35] focus:ring-1 focus:ring-[#c5eb35] transition-all text-neutral-900 placeholder:text-neutral-400 disabled:opacity-60"
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
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#c5eb35] hover:bg-[#b5e024] disabled:opacity-50 disabled:cursor-not-allowed text-[#141b16] flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95 shrink-0"
                  aria-label="Send message"
                >
                  {isStreaming ? (
                    <Loader2 className="w-4 h-4 animate-spin text-[#141b16]" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </form>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Bottom Controls Bar */}
      <footer className="relative z-30 w-full max-w-7xl mx-auto flex justify-between items-center mt-2 sm:mt-4">
        {/* Bottom Left: Spinning Text Scroll Indicator */}
        <div
          ref={bottomArrowRef}
          onClick={() =>
            window.scrollTo({
              top: window.innerHeight,
              behavior: "smooth",
            })
          }
          className="relative flex items-center justify-center cursor-pointer select-none group w-14 h-14 sm:w-16 sm:h-16"
          aria-label="Scroll down"
        >
          <SpinningText
            radius={4.2}
            duration={12}
            className="font-sans text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.2em] text-[#141b16] opacity-80 group-hover:opacity-100 transition-opacity"
          >
            • SCROLL DOWN • DISCOVER MORE
          </SpinningText>
          <div className="w-2 h-2 rounded-full bg-[#141b16]/40 group-hover:bg-[#141b16] group-hover:scale-125 transition-all duration-300" />
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom Right: Social Icons (GitHub, LinkedIn, X) */}
        <div
          ref={bottomSocialsRef}
          className="flex items-center gap-2 sm:gap-3 text-[#141b16]"
        >
          {/* GitHub */}
          <a
            href="https://github.com/ronitrai27"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-black/5 hover:scale-110 transition-all text-[#141b16]"
          >
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              />
            </svg>
          </a>

          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/in/rox-aa53a1300/"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-black/5 hover:scale-110 transition-all text-[#141b16]"
          >
            <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.45 1.45 0 1 0 0-2.9 1.45 1.45 0 0 0 0 2.9m1.4 9.74V9.97H5.06v8.53h2.8z" />
            </svg>
          </a>

          {/* X / Twitter */}
          <a
            href="https://x.com/roxrai0027"
            target="_blank"
            rel="noreferrer"
            aria-label="X"
            className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-black/5 hover:scale-110 transition-all text-[#141b16]"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
        </div>
      </footer>
    </section>
  );
}
