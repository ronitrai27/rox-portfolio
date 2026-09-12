"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "lucide-react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface WorkProject {
  id: string;
  number: string;
  title: string;
  category: string;
  image: string;
  alignment: "left" | "right";
  aspectRatio: string;
}

const projects: WorkProject[] = [
  {
    id: "pegasus-solar",
    number: "01",
    title: "Pegasus Solar",
    category: "Web design · Branding",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80",
    alignment: "left",
    aspectRatio: "aspect-[16/11]",
  },
  {
    id: "ovula",
    number: "02",
    title: "Ovula",
    category: "Strategy · Branding",
    image: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1000&q=80",
    alignment: "right",
    aspectRatio: "aspect-[4/5]",
  },
  {
    id: "aether-ai",
    number: "03",
    title: "Aether AI Assistant",
    category: "Intelligent Interface · Mobile",
    image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?auto=format&fit=crop&w=1200&q=80",
    alignment: "left",
    aspectRatio: "aspect-[16/11]",
  },
  {
    id: "cognitive-swarm",
    number: "04",
    title: "Cognitive Swarm OS",
    category: "Multi-Agent System · Cloud",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80",
    alignment: "right",
    aspectRatio: "aspect-[4/5]",
  },
  {
    id: "sanctuary-architecture",
    number: "05",
    title: "Sanctuary Architecture",
    category: "Spatial Environment · 3D",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    alignment: "left",
    aspectRatio: "aspect-[16/11]",
  },
  {
    id: "vortex-engine",
    number: "06",
    title: "Vortex Generative Engine",
    category: "Creative Computation · Diffusion",
    image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1000&q=80",
    alignment: "right",
    aspectRatio: "aspect-[4/5]",
  },
];

export default function WorkPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinnedStageRef = useRef<HTMLDivElement>(null);
  const centerTitleRef = useRef<HTMLHeadingElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      if (!pinnedStageRef.current || !centerTitleRef.current) return;

      // Master ScrollTrigger timeline pinned across scroll
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=5000",
          pin: pinnedStageRef.current,
          pinSpacing: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // 1. Initial scroll: Center text becomes very light (from neutral-800 to neutral-300 / opacity 0.3)
      tl.to(
        centerTitleRef.current,
        {
          color: "#c9c9c7",
          duration: 0.6,
          ease: "power2.out",
        },
        0
      );

      // 2. Animate 6 project cards sequentially alternating left and right
      const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
      const cardStep = 1.35;

      cards.forEach((card, i) => {
        // Set initial GPU transform offscreen below
        gsap.set(card, {
          yPercent: 125,
          autoAlpha: 0,
          scale: 0.94,
        });

        const startTime = 0.4 + i * cardStep;
        const holdDuration = 0.7;
        const exitDuration = 0.85;

        // Enter from bottom
        tl.to(
          card,
          {
            yPercent: 0,
            autoAlpha: 1,
            scale: 1,
            duration: 0.95,
            ease: "power2.out",
          },
          startTime
        );

        // Exit towards top
        tl.to(
          card,
          {
            yPercent: -125,
            autoAlpha: 0,
            scale: 0.94,
            duration: exitDuration,
            ease: "power2.in",
          },
          startTime + 0.95 + holdDuration
        );
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="relative w-full bg-white text-[#141b16]">
      {/* Pinned Stage Viewport (h-screen) */}
      <div
        ref={pinnedStageRef}
        className="relative h-screen w-full bg-white text-[#141b16] overflow-hidden flex flex-col justify-between p-6 select-none"
      >
        {/* Top Header Bar */}
        <header className="relative z-40 w-full flex justify-between items-center max-w-7xl mx-auto">
          {/* Top Left - ROX */}
          <Link
            href="/"
            className="font-sans font-semibold text-lg sm:text-xl tracking-tight text-[#141b16] hover:opacity-80 transition-opacity"
          >
            ROX
          </Link>

          {/* Top Right - Contact */}
          <Link
            href="/#about-section"
            className="group bg-[#c5eb35] hover:bg-[#b5e024] text-[#141b16] font-sans font-semibold text-xs sm:text-sm px-6 py-2.5 rounded-full flex items-center gap-2 transition-all duration-300 shadow-sm hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>Contact</span>
            <span className="w-5 h-5 rounded-full bg-black/10 flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
              <ArrowUpRight className="w-3.5 h-3.5 text-[#141b16]" />
            </span>
          </Link>
        </header>

        {/* Background Center Title - Top Loved Works (stays firmly behind cards) */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none px-4 select-none"
          style={{ zIndex: 1 }}
        >
          <h1
            ref={centerTitleRef}
            className="font-serif font-medium text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight text-neutral-800 text-center leading-none will-change-[color,opacity] transition-colors"
          >
            Top Loved Works
          </h1>
        </div>

        {/* Foreground Floating Cards Layer (Alternating Bottom-Left & Bottom-Right) */}
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center"
          style={{ zIndex: 20 }}
        >
          <div className="relative w-full h-full max-w-7xl mx-auto px-4 sm:px-6">
            {projects.map((project, index) => {
              const isLeft = project.alignment === "left";

              return (
                <div
                  key={project.id}
                  ref={(el) => {
                    cardRefs.current[index] = el;
                  }}
                  style={{ zIndex: 30 }}
                  className={`absolute pointer-events-auto will-change-transform ${
                    isLeft
                      ? "left-4 sm:left-8 md:left-12 lg:left-14 bottom-16 sm:bottom-20 w-[84vw] sm:w-[380px] md:w-[460px] lg:w-[500px]"
                      : "right-4 sm:right-8 md:right-12 lg:right-14 bottom-16 sm:bottom-20 w-[78vw] sm:w-[320px] md:w-[380px] lg:w-[410px]"
                  }`}
                >
                  <div className="group bg-white rounded-2xl sm:rounded-3xl p-2 sm:p-2.5 transition-transform duration-300 shadow-[0_12px_40px_rgba(0,0,0,0.06)] border border-black/5">
                    {/* Project Image */}
                    <div
                      className={`relative w-full ${project.aspectRatio} overflow-hidden rounded-xl sm:rounded-2xl bg-neutral-100 shadow-[0_10px_35px_rgba(0,0,0,0.08)]`}
                    >
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        sizes="(max-width: 768px) 85vw, 500px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        priority={index < 2}
                      />
                    </div>

                    {/* Project Meta Info */}
                    <div className="flex items-center justify-between mt-3 px-1.5 text-neutral-800">
                      <span className="font-sans text-sm sm:text-base font-medium tracking-tight">
                        {project.title}
                      </span>
                      <span className="font-sans text-xs sm:text-sm text-neutral-500 font-normal">
                        {project.category}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Empty bottom spacer to maintain layout structure */}
        <div
          className="relative z-30 w-full max-w-7xl mx-auto pointer-events-none opacity-0 select-none"
          aria-hidden="true"
        >
          <span className="text-xs">ROX</span>
        </div>

        {/* Floating Bottom Navigation */}
        <nav
          aria-label="Main Navigation"
          className="fixed bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-50 bg-white/95 backdrop-blur-md shadow-[0_12px_40px_rgba(0,0,0,0.18)] border border-black/8 rounded-full p-1.5 flex items-center gap-1 sm:gap-1.5 transition-all duration-300 select-none"
        >
          <Link
            href="/"
            className="px-4 sm:px-5 py-2 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer text-[#5a625b] hover:text-[#141b16] hover:bg-black/5"
          >
            HOME
          </Link>

          <button
            type="button"
            className="px-4 sm:px-5 py-2 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer bg-[#c5eb35] text-[#141b16] shadow-sm scale-[1.02]"
          >
            WORKS
          </button>

          <Link
            href="/#about-section"
            className="px-4 sm:px-5 py-2 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer text-[#5a625b] hover:text-[#141b16] hover:bg-black/5"
          >
            ABOUT
          </Link>
        </nav>
      </div>
    </div>
  );
}
