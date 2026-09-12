"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight, Download, Mic, Send, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { NoiseBackground } from "@/components/ui/noise-background";
import { SpinningText } from "@/components/ui/spinning-text";

gsap.registerPlugin(useGSAP);

interface HeroProps {
  isLoaded?: boolean;
}

interface ChatMessage {
  role: "assistant" | "user";
  text: string;
}

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

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text: "Hey! I'm Roxy, ROX's AI Agent. Ask me anything about his projects, experience, or tech stack!",
    },
  ]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue.trim();
    const newMessages = [
      ...messages,
      { role: "user" as const, text: userText },
    ];
    setMessages(newMessages);
    setInputValue("");

    // Smart contextual response
    setTimeout(() => {
      const lower = userText.toLowerCase();
      let reply =
        "ROX is a Full-Stack AI Engineer & Builder architecting intelligent distributed systems, high-performance web applications, and real-time AI agents.";

      if (
        lower.includes("stack") ||
        lower.includes("tech") ||
        lower.includes("skills")
      ) {
        reply =
          "ROX works with Next.js, React, TypeScript, Python, PyTorch, LangGraph, GSAP, Tailwind CSS, Three.js, and multi-agent workflows.";
      } else if (lower.includes("project") || lower.includes("work")) {
        reply =
          "ROX's top projects include Pegasus Solar, Ovula Design System, Aether AI Assistant, and Cognitive Swarm OS. Check out the Works page for more details!";
      } else if (
        lower.includes("contact") ||
        lower.includes("email") ||
        lower.includes("hire")
      ) {
        reply =
          "You can reach out directly to ROX via email at ronitrai1237@gmail.com or connect on LinkedIn and GitHub!";
      }

      setMessages([
        ...newMessages,
        { role: "assistant" as const, text: reply },
      ]);
    }, 450);
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
          className="text-[112px] font-serif tracking-wider italic font-light absolute top-16 left-[40%] -translate-x-1/2 will-change-transform"
        >
          AI ENGINEER
        </h1>
        <div
          ref={taglineRef}
          className="absolute top-1/3 mt-14 left-1/2 will-change-transform"
        >
          <h2
            ref={title2Ref}
            className="text-7xl font-sans leading-7 tracking-normal font-semibold"
          >
            & BUILDER
          </h2>
          <p className="mt-10">
            <span className="text-lg tracking-tight leading-0 font-sans font-medium">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit,
              facere! <br />
              Lorem ipsum dolor, sit amet consectetur adipisicing.
            </span>
          </p>

          <div className="flex items-center gap-3 mt-6 ml-10">
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
                className="h-full w-full cursor-pointer rounded-full bg-linear-to-r from-neutral-100 via-neutral-100 to-white px-5 py-2.5 text-xs sm:text-sm font-semibold text-black shadow-[0px_2px_0px_0px_var(--color-neutral-50)_inset,0px_0.5px_1px_0px_var(--color-neutral-400)] transition-all duration-100 active:scale-98 flex items-center gap-2"
              >
                <Download className="w-4 h-4 text-black" />
                <span>Download CV</span>
              </button>
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
                className="h-full w-full cursor-pointer rounded-full bg-linear-to-r from-neutral-100 via-neutral-100 to-white px-5 py-2.5 text-xs sm:text-sm font-semibold text-black shadow-[0px_2px_0px_0px_var(--color-neutral-50)_inset,0px_0.5px_1px_0px_var(--color-neutral-400)] transition-all duration-100 active:scale-98 flex items-center gap-2"
              >
                <span>See my Blogs</span>
                <ArrowUpRight className="w-4 h-4 text-black" />
              </button>
            </NoiseBackground>
          </div>
        </div>
      </div>

      {/* User Image: Grounded at bottom of screen, positioned to the left, behind bottom controls */}
      <div
        ref={imageRef}
        className="absolute bottom-0 left-[24%] sm:left-[28%] md:left-[32%] -translate-x-1/2 z-20 w-[90vw] max-w-[380px] sm:max-w-[460px] md:max-w-[540px] lg:max-w-[620px] xl:max-w-[660px] h-[68vh] sm:h-[70vh] md:h-[74vh] lg:h-[77vh] flex items-end justify-center pointer-events-none will-change-transform"
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
        className="fixed sm:absolute right-0 top-1/2 z-30 bg-white/95 backdrop-blur-md border-l border-y border-black/10 py-4 px-2 rounded-l-xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] flex items-center justify-center cursor-pointer hover:bg-white transition-all duration-300 group hover:translate-x-[-3px]"
      >
        <div
          className="flex items-center gap-2"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          <span className="w-5 h-5 flex items-center justify-center rounded-full text-xs bg-[#c5eb35] ">
            R
          </span>
          <span className="font-sans text-[11px] font-semibold tracking-wider text-neutral-800 group-hover:text-black uppercase whitespace-nowrap">
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
              className="fixed right-0 top-1/2 -translate-y-1/2 z-50 w-[92vw] sm:w-[380px] md:w-[420px] h-[540px] sm:h-[600px] max-h-[90vh] bg-white rounded-l-3xl shadow-[0_20px_60px_rgba(0,0,0,0.18)] border-l border-y border-black/10 flex flex-col overflow-hidden"
            >
              {/* Top Header */}
              <div className="p-4 sm:p-5 border-b border-black/8 flex items-center justify-between bg-neutral-50/70">
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

                <button
                  type="button"
                  onClick={() => setIsChatOpen(false)}
                  className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Close chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body Space: Chat Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs sm:text-sm font-sans">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl leading-relaxed ${
                        msg.role === "user"
                          ? "bg-[#c5eb35] text-[#141b16] font-medium rounded-br-xs"
                          : "bg-neutral-100 text-neutral-800 rounded-bl-xs"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
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
                    className="w-full pl-3.5 pr-10 py-2.5 text-xs sm:text-sm bg-white border border-black/10 rounded-full focus:outline-hidden focus:border-[#c5eb35] focus:ring-1 focus:ring-[#c5eb35] transition-all text-neutral-900 placeholder:text-neutral-400"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setInputValue(
                        "Tell me about ROX's tech stack and experience!",
                      );
                    }}
                    className="absolute right-2.5 p-1 text-neutral-400 hover:text-neutral-800 transition-colors cursor-pointer"
                    title="Voice input / suggestion"
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#c5eb35] hover:bg-[#b5e024] disabled:opacity-50 disabled:cursor-not-allowed text-[#141b16] flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95 shrink-0"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
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
            href="https://github.com"
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
            href="https://linkedin.com"
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
            href="https://x.com"
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
