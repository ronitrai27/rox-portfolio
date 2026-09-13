"use client";

import React, { forwardRef, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  Sparkles,
  Cpu,
  Workflow,
  Coffee,
  ArrowUpRight,
  MapPin,
  Briefcase,
  Terminal,
} from "lucide-react";
import Footer from "../web/Footer";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface KnowMeBetterProps {
  className?: string;
}

const KnowMeBetterSection = forwardRef<HTMLDivElement, KnowMeBetterProps>(
  ({ className = "" }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const imageCardRef = useRef<HTMLDivElement>(null);
    const contentListRef = useRef<HTMLDivElement>(null);

    // Combine forwarded ref and internal ref
    const setRefs = (node: HTMLDivElement | null) => {
      containerRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }
    };

    useGSAP(
      () => {
        if (!containerRef.current) return;

        // Animate left image card
        gsap.from(imageCardRef.current, {
          y: 60,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: imageCardRef.current,
            start: "top 80%",
          },
        });

        // Animate right Q&A blocks with stagger
        const qaBlocks = gsap.utils.toArray<HTMLElement>(
          ".qa-block",
          containerRef.current
        );
        gsap.from(qaBlocks, {
          y: 45,
          opacity: 0,
          stagger: 0.18,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: contentListRef.current,
            start: "top 78%",
          },
        });
      },
      { scope: containerRef }
    );

    return (
      <section
        ref={setRefs}
        id="know-me-better"
        className={`relative z-20 w-full bg-[#f6f6f4] text-[#141b16] rounded-t-[36px] sm:rounded-t-[52px] shadow-[0_-24px_60px_rgba(0,0,0,0.08)] border-t border-black/5 overflow-hidden ${className}`}
      >
        {/* Subtle background texture / ambient lighting */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-[#f6f6f4] to-[#f0f0ec] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 md:px-14 lg:px-16 pt-20 sm:pt-28 pb-32">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-12 sm:pb-16 border-b border-black/8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 text-[#5a625b] text-[11px] font-mono uppercase tracking-[0.15em] mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3fd89f]" />
                01 / Background &amp; Philosophy
              </div>
              <h2
                style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
                className="text-4xl sm:text-6xl md:text-7xl text-[#141b16] font-normal tracking-[-0.02em] leading-[1.05]"
              >
                Know me <span className="italic font-normal">better</span>.
              </h2>
            </div>

            <p className="text-sm sm:text-base text-[#616862] max-w-md leading-relaxed font-sans font-normal">
              A deeper look into how I think, build scalable AI architectures, and explore technology beyond the screen.
            </p>
          </div>

          {/* Main 2-Column Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 mt-12 sm:mt-16 items-start">
            {/* Left Column: Portrait & Highlights Card */}
            <div
              ref={imageCardRef}
              className="lg:col-span-5 flex flex-col gap-6"
            >
              {/* Image Container */}
              <div className="relative w-full aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] rounded-[28px] overflow-hidden bg-gradient-to-b from-[#e7e7e3] to-[#d8d8d3] border border-black/8 shadow-[0_12px_36px_rgba(0,0,0,0.06)] flex items-end justify-center group">
                {/* Background ambient badge glow */}
                <div className="absolute top-8 left-8 right-8 flex justify-between items-center z-10">
                  <span className="px-3 py-1 rounded-full bg-white/80 backdrop-blur-md border border-black/5 text-[11px] font-mono uppercase tracking-wider text-[#141b16] flex items-center gap-1.5 shadow-sm">
                    <Terminal className="w-3 h-3 text-[#141b16]" />
                    AI Engineer
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/80 backdrop-blur-md border border-black/5 text-[11px] font-mono tracking-wider text-[#5a625b] flex items-center gap-1.5 shadow-sm">
                    <MapPin className="w-3 h-3 text-red-500" />
                    India
                  </span>
                </div>

                {/* Portrait Photo */}
                <div className="relative w-full h-full">
                  <Image
                    src="/rox_study.png"
                    alt="ROX Study & Building"
                    fill
                    className="object-contain object-bottom transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                    priority
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                </div>
              </div>

              {/* Quick Info Pill Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-white/90 border border-black/6 shadow-sm">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-[#7a827b]">
                    Focus
                  </div>
                  <div className="mt-1 font-sans text-xs sm:text-sm font-semibold text-[#141b16]">
                    Autonomous AI Agents &amp; Systems
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-white/90 border border-black/6 shadow-sm">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-[#7a827b]">
                    Mindset
                  </div>
                  <div className="mt-1 font-sans text-xs sm:text-sm font-semibold text-[#141b16]">
                    Build • Ship • Scale
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: 3 Question / Answer Story Blocks */}
            <div
              ref={contentListRef}
              className="lg:col-span-7 flex flex-col gap-6 sm:gap-8"
            >
              {/* Question 1: In my current role */}
              <div className="qa-block p-7 sm:p-9 rounded-[28px] bg-white border border-black/6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-[#d8f966] text-[#1c2411] flex items-center justify-center shrink-0">
                    <Briefcase className="w-4 h-4 stroke-[2]" />
                  </div>
                  <h3 className="font-sans text-lg sm:text-xl font-bold tracking-tight text-[#141b16]">
                    In my current role
                  </h3>
                </div>
                <p className="font-sans text-sm sm:text-[15px] leading-relaxed text-[#4e5550] font-normal">
                  I architect and build intelligent full-stack systems and autonomous agent workflows from the ground up. My day-to-day involves orchestrating complex multi-agent graphs with LangGraph, designing low-latency RAG architectures with hybrid search, optimizing real-time streaming interfaces, and ensuring rock-solid production reliability across cloud infrastructure.
                </p>
                <div className="mt-5 pt-4 border-t border-black/6 flex flex-wrap gap-2 text-[11px] font-mono text-[#5a625b]">
                  <span className="px-2.5 py-1 rounded-md bg-[#f0f0ed]">Multi-Agent Workflows</span>
                  <span className="px-2.5 py-1 rounded-md bg-[#f0f0ed]">Enterprise RAG</span>
                  <span className="px-2.5 py-1 rounded-md bg-[#f0f0ed]">Next.js / Fast API</span>
                  <span className="px-2.5 py-1 rounded-md bg-[#f0f0ed]">Cloud Scale</span>
                </div>
              </div>

              {/* Question 2: My process of doing */}
              <div className="qa-block p-7 sm:p-9 rounded-[28px] bg-white border border-black/6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-[#ff7640] text-white flex items-center justify-center shrink-0">
                    <Workflow className="w-4 h-4 stroke-[2]" />
                  </div>
                  <h3 className="font-sans text-lg sm:text-xl font-bold tracking-tight text-[#141b16]">
                    My process of doing
                  </h3>
                </div>
                <p className="font-sans text-sm sm:text-[15px] leading-relaxed text-[#4e5550] font-normal">
                  I believe exceptional software is born at the intersection of first-principles systems design and ruthless execution. I decompose fuzzy product requirements into deterministic state machines, benchmark model trade-offs (cost vs. latency vs. reasoning capability), and build tight feedback loops with end-users. Quality to me is buttery 60fps micro-interactions backed by unbreakable backend contracts.
                </p>
                <div className="mt-5 pt-4 border-t border-black/6 flex flex-wrap gap-2 text-[11px] font-mono text-[#5a625b]">
                  <span className="px-2.5 py-1 rounded-md bg-[#f0f0ed]">First-Principles</span>
                  <span className="px-2.5 py-1 rounded-md bg-[#f0f0ed]">Rapid Prototyping</span>
                  <span className="px-2.5 py-1 rounded-md bg-[#f0f0ed]">Deterministic Guardrails</span>
                  <span className="px-2.5 py-1 rounded-md bg-[#f0f0ed]">High Polish</span>
                </div>
              </div>

              {/* Question 3: When I'm not working */}
              <div className="qa-block p-7 sm:p-9 rounded-[28px] bg-white border border-black/6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-[#90caff] text-[#09284a] flex items-center justify-center shrink-0">
                    <Coffee className="w-4 h-4 stroke-[2]" />
                  </div>
                  <h3 className="font-sans text-lg sm:text-xl font-bold tracking-tight text-[#141b16]">
                    When I&apos;m not working
                  </h3>
                </div>
                <p className="font-sans text-sm sm:text-[15px] leading-relaxed text-[#4e5550] font-normal">
                  When I step away from code, I&apos;m usually reading the latest AI/ML papers on arXiv, tinkering with experimental developer tooling and MCP servers, brewing fresh coffee, or analyzing modern visual design and typography trends. I&apos;m continually fascinated by systems that make complex technology feel effortlessly human.
                </p>
                <div className="mt-5 pt-4 border-t border-black/6 flex flex-wrap gap-2 text-[11px] font-mono text-[#5a625b]">
                  <span className="px-2.5 py-1 rounded-md bg-[#f0f0ed]">AI Research &amp; ArXiv</span>
                  <span className="px-2.5 py-1 rounded-md bg-[#f0f0ed]">Open Source</span>
                  <span className="px-2.5 py-1 rounded-md bg-[#f0f0ed]">Design &amp; Type</span>
                  <span className="px-2.5 py-1 rounded-md bg-[#f0f0ed]">Specialty Coffee</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Underlying Footer Section */}
        <div className="relative w-full h-screen min-h-[640px]">
          <Footer />
        </div>
      </section>
    );
  }
);

KnowMeBetterSection.displayName = "KnowMeBetterSection";

export default KnowMeBetterSection;
