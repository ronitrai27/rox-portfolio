"use client";

import React, { forwardRef, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  Briefcase,
  Workflow,
  Coffee,
  MapPin,
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

        // Smooth subtle entrance without initial opacity blocking
        gsap.from(".qa-card", {
          y: 30,
          stagger: 0.12,
          duration: 0.7,
          ease: "power2.out",
          clearProps: "transform",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
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
        {/* Ambient top light gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-[#f6f6f4] to-[#efefe9] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 md:px-14 lg:px-16 pt-16 sm:pt-24 pb-28">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-10 sm:pb-14 border-b border-black/8">
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
              A deeper look into my role, engineering process, and what drives my work forward.
            </p>
          </div>

          {/* Main 2-Column Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 mt-10 sm:mt-14 items-start">
            {/* Left Column: Portrait & Details */}
            <div
              ref={imageCardRef}
              className="lg:col-span-5 flex flex-col gap-5 sticky top-12"
            >
              {/* Image Container */}
              <div className="relative w-full aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] rounded-[28px] overflow-hidden bg-gradient-to-b from-[#eaeae6] to-[#dbdbd5] border border-black/8 shadow-[0_12px_36px_rgba(0,0,0,0.06)] flex items-end justify-center group">
                {/* Top Badges */}
                <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-10">
                  <span className="px-3 py-1 rounded-full bg-white/85 backdrop-blur-md border border-black/6 text-[11px] font-mono uppercase tracking-wider text-[#141b16] flex items-center gap-1.5 shadow-sm">
                    <Terminal className="w-3 h-3 text-[#141b16]" />
                    AI Engineer
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/85 backdrop-blur-md border border-black/6 text-[11px] font-mono tracking-wider text-[#5a625b] flex items-center gap-1.5 shadow-sm">
                    <MapPin className="w-3 h-3 text-red-500" />
                    India
                  </span>
                </div>

                {/* Portrait Image */}
                <div className="relative w-full h-full">
                  <Image
                    src="/rox_study.png"
                    alt="ROX Portrait"
                    fill
                    className="object-contain object-bottom transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                    priority
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                </div>
              </div>

              {/* Quick Info Cards */}
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
              className="lg:col-span-7 flex flex-col gap-6"
            >
              {/* Question 1: In my current role */}
              <div className="qa-card p-6 sm:p-8 rounded-[24px] bg-white border border-black/6 shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] transition-all duration-300">
                <div className="flex items-center gap-3 mb-3.5">
                  <div className="w-8 h-8 rounded-full bg-[#d8f966] text-[#1c2411] flex items-center justify-center shrink-0">
                    <Briefcase className="w-4 h-4 stroke-[2]" />
                  </div>
                  <h3 className="font-sans text-lg sm:text-xl font-bold tracking-tight text-[#141b16]">
                    In my current role
                  </h3>
                </div>
                <p className="font-sans text-sm sm:text-[15px] leading-relaxed text-[#4e5550] font-normal">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                </p>
                <div className="mt-4 pt-3.5 border-t border-black/6 flex flex-wrap gap-2 text-[11px] font-mono text-[#5a625b]">
                  <span className="px-2.5 py-1 rounded-md bg-[#f0f0ed]">AI Systems</span>
                  <span className="px-2.5 py-1 rounded-md bg-[#f0f0ed]">Full-Stack</span>
                  <span className="px-2.5 py-1 rounded-md bg-[#f0f0ed]">Architecture</span>
                </div>
              </div>

              {/* Question 2: My process of doing */}
              <div className="qa-card p-6 sm:p-8 rounded-[24px] bg-white border border-black/6 shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] transition-all duration-300">
                <div className="flex items-center gap-3 mb-3.5">
                  <div className="w-8 h-8 rounded-full bg-[#ff7640] text-white flex items-center justify-center shrink-0">
                    <Workflow className="w-4 h-4 stroke-[2]" />
                  </div>
                  <h3 className="font-sans text-lg sm:text-xl font-bold tracking-tight text-[#141b16]">
                    My process of doing
                  </h3>
                </div>
                <p className="font-sans text-sm sm:text-[15px] leading-relaxed text-[#4e5550] font-normal">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida. Duis aute irure dolor in reprehenderit.
                </p>
                <div className="mt-4 pt-3.5 border-t border-black/6 flex flex-wrap gap-2 text-[11px] font-mono text-[#5a625b]">
                  <span className="px-2.5 py-1 rounded-md bg-[#f0f0ed]">First-Principles</span>
                  <span className="px-2.5 py-1 rounded-md bg-[#f0f0ed]">Prototyping</span>
                  <span className="px-2.5 py-1 rounded-md bg-[#f0f0ed]">Execution</span>
                </div>
              </div>

              {/* Question 3: When I'm not working */}
              <div className="qa-card p-6 sm:p-8 rounded-[24px] bg-white border border-black/6 shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] transition-all duration-300">
                <div className="flex items-center gap-3 mb-3.5">
                  <div className="w-8 h-8 rounded-full bg-[#90caff] text-[#09284a] flex items-center justify-center shrink-0">
                    <Coffee className="w-4 h-4 stroke-[2]" />
                  </div>
                  <h3 className="font-sans text-lg sm:text-xl font-bold tracking-tight text-[#141b16]">
                    When I&apos;m not working
                  </h3>
                </div>
                <p className="font-sans text-sm sm:text-[15px] leading-relaxed text-[#4e5550] font-normal">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum. Cras venenatis euismod malesuada. Pellentesque eget nisi vel elit congue pulvinar. Mauris non erat justo. Nullam id dolor id nibh ultricies vehicula ut id elit.
                </p>
                <div className="mt-4 pt-3.5 border-t border-black/6 flex flex-wrap gap-2 text-[11px] font-mono text-[#5a625b]">
                  <span className="px-2.5 py-1 rounded-md bg-[#f0f0ed]">Research</span>
                  <span className="px-2.5 py-1 rounded-md bg-[#f0f0ed]">Exploration</span>
                  <span className="px-2.5 py-1 rounded-md bg-[#f0f0ed]">Craft</span>
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
