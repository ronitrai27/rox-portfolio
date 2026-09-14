"use client";

import React, { forwardRef, useRef, useState } from "react";
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
  ChevronDown,
  Sparkles,
} from "lucide-react";
import Footer from "../web/Footer";
import TechStackSkills from "./TechStackSkills";
import GitHubActivitySection from "./GitHubActivitySection";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface KnowMeBetterProps {
  className?: string;
}

interface FaqStory {
  id: string;
  number: string;
  title: string;
  iconBg: string;
  iconColor: string;
  icon: typeof Briefcase;
  content: string;
}

const faqStories: FaqStory[] = [
  {
    id: "role",
    number: "01",
    title: "In my current role",
    iconBg: "bg-[#d8f966]",
    iconColor: "text-[#1c2411]",
    icon: Briefcase,
    content:
      "As Founder of VRSA Analytics, I own end-to-end product engineering and system design for e-commerce, B2B, and B2C platforms. I lead architecture, client delivery, and technical execution — shipping production systems (including inventory platforms and AI chatbots) while generating ₹3.5L+ in revenue. I also take on selective freelance work building multi-tenant SaaS products with strong focus on reliability, cost-efficient LLM usage, and clean CI/CD.",
  },
  {
    id: "process",
    number: "02",
    title: "My process of doing",
    iconBg: "bg-[#ff7640]",
    iconColor: "text-white",
    icon: Workflow,
    content:
      "I start with deep requirement discovery, then design systems that stay simple on the surface even when the internals are complex. Most of my work revolves around multi-agent architectures (LangGraph supervisor patterns, Temporal durable workflows, MCP tool integrations, Redis checkpointing, and layered guardrails). I obsess over observability, fault tolerance, and measurable outcomes — then ship the whole thing end-to-end from architecture to production.",
  },
  {
    id: "hobbies",
    number: "03",
    title: "When I'm not working",
    iconBg: "bg-[#90caff]",
    iconColor: "text-[#09284a]",
    icon: Coffee,
    content:
      "I love good food, short trips to new places, and spending hours experimenting with the latest open-source tools and AI frameworks. Whether it's trying a new cuisine, exploring a different city, or tinkering with the newest agent libraries just for fun — that's how I recharge.",
  },
];

const KnowMeBetterSection = forwardRef<HTMLDivElement, KnowMeBetterProps>(
  ({ className = "" }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const imageCardRef = useRef<HTMLDivElement>(null);
    const contentListRef = useRef<HTMLDivElement>(null);

    // Default open first FAQ item (#0)
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleStory = (index: number) => {
      setOpenIndex((prev) => (prev === index ? null : index));
    };

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
      { scope: containerRef },
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
              A deeper look into my role, engineering process, and what drives
              my work forward.
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
            </div>

            {/* Right Column: Interactive FAQ Accordion Story Blocks */}
            <div
              ref={contentListRef}
              className="lg:col-span-7 flex flex-col gap-4 sm:gap-5"
            >
              {faqStories.map((story, index) => {
                const isOpen = openIndex === index;
                const IconComponent = story.icon;

                return (
                  <div
                    key={story.id}
                    className={`qa-card rounded-[26px] transition-all duration-300 border overflow-hidden ${
                      isOpen
                        ? "bg-white border-black/12 shadow-[0_16px_40px_rgba(0,0,0,0.08)] ring-1 ring-black/5"
                        : "bg-white/80 hover:bg-white border-black/6 shadow-xs hover:shadow-sm"
                    }`}
                  >
                    {/* Accordion Header Button */}
                    <button
                      type="button"
                      onClick={() => toggleStory(index)}
                      className="w-full p-5 sm:p-7 flex items-center justify-between gap-4 text-left cursor-pointer select-none transition-colors"
                      aria-expanded={isOpen}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div
                          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-xs transition-transform duration-300 ${
                            story.iconBg
                          } ${story.iconColor} ${
                            isOpen ? "scale-105" : "scale-100"
                          }`}
                        >
                          <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2]" />
                        </div>

                        <div className="truncate">
                          <h3 className="font-sans text-base sm:text-lg md:text-xl font-bold tracking-tight text-[#141b16] truncate">
                            {story.title}
                          </h3>
                        </div>
                      </div>

                      {/* Right Toggle Icon */}
                      <div
                        className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300 ${
                          isOpen
                            ? "bg-[#141b16] text-[#c5eb35] border-transparent rotate-180 shadow-xs"
                            : "bg-black/[0.04] text-[#5a625b] border-black/6 hover:bg-black/8 rotate-0"
                        }`}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </button>

                    {/* Smooth Collapsible Body via CSS Grid Transition */}
                    <div
                      className={`grid transition-all duration-300 ease-in-out ${
                        isOpen
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="px-5 sm:px-7 pb-6 sm:pb-7 pt-1 border-t border-black/5">
                          <p className="font-sans text-sm sm:text-[15px] leading-relaxed text-[#4e5550] font-normal">
                            {story.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 02 / Tech Stack & Skills Grid */}
          <TechStackSkills />

          {/* 03 / GitHub Activity & Stats Heatmap */}
          <GitHubActivitySection />
        </div>

        {/* Underlying Footer Section */}
        <div className="relative w-full h-screen min-h-[640px]">
          <Footer />
        </div>
      </section>
    );
  },
);

KnowMeBetterSection.displayName = "KnowMeBetterSection";

export default KnowMeBetterSection;
