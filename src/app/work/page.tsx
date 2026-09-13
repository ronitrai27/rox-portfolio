"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "lucide-react";
import Footer from "../../../modules/web/Footer";
import { SpinningText } from "@/components/ui/spinning-text";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface WorkProject {
  id: string;
  number: string;
  title: string;
  tech: string[];
  description: string;
  image: string;
  alignment: "left" | "right";
  githubUrl?: string;
  liveUrl?: string;
  displayUrl?: string;
}

const projects: WorkProject[] = [
  {
    id: "wekraft",
    number: "01",
    title: "wekraft",
    tech: ["LangGraph", "MCP", "Ably", "Inngest", "AWS"],
    description:
      "AI-powered project execution platform bridging Devs & PMs with bidirectional GitHub sync and third-party MCP integrations.",
    image: "/wekraft.png",
    alignment: "left",
    githubUrl: "https://github.com/Wekraft-collaboration-platform",
    liveUrl: "https://www.wekraft.xyz",
  },
  {
    id: "clarioo",
    number: "02",
    title: "clarioo",
    tech: ["Next.js", "Vapi", "Supabase", "Unsloth", "React Flow"],
    description:
      "Personalized career acceleration platform for students & professionals, featuring tailored roadmaps and AI-proctored mock interviews.",
    image: "/clarioo.png",
    alignment: "right",
    githubUrl: "https://github.com/ronitrai27/clario-career_platform",
    liveUrl: "https://www.clarioo.live",
  },
  {
    id: "looma",
    number: "03",
    title: "looma",
    tech: ["Vercel AI", "Firecrawl", "Liveblocks", "tldraw", "Convex"],
    description:
      "Real-time collaborative canvas enabling teams to sketch, design, and instantly generate live deployable web applications.",
    image: "/looma.png",
    alignment: "left",
    githubUrl: "https://github.com/ronitrai27/looma-sketch_collaborate_deploy",
    liveUrl: "https://looma-sketch-collaborate-deploy.vercel.app/",
  },
  {
    id: "aria",
    number: "04",
    title: "Aria",
    tech: ["LangGraph", "FastAPI", "Composio"],
    description:
      "Intelligent personal productivity operating system connecting Gmail, Slack, and Discord to turn daily chaos into automated action.",
    image: "/aria.png",
    alignment: "right",
    githubUrl: "https://github.com/ronitrai27/aria-hackathon",
    liveUrl: "https://aria-hackathon-topaz.vercel.app/",
  },
  {
    id: "enterprise-sales-agent",
    number: "05",
    title: "Enterprise sales agent",
    tech: ["LangGraph", "Hybrid RAG", "Temporal.io", "Guardrails", "Cohere"],
    description:
      "Enterprise-grade bilingual sales agent architected with semantic caching, strict guardrails, background jobs, and persistent memory.",
    image: "/pan-agent.png",
    alignment: "left",
    githubUrl: "https://github.com/ronitrai27/customer_agent_punjabi",
    displayUrl: "http://localhost:3000",
  },
  {
    id: "vocalx",
    number: "06",
    title: "vocalx",
    tech: ["Vapi", "Next.js 16", "React 19"],
    description:
      "Next-gen AI recruitment engine that automates JD parsing, question generation, and real-time proctored voice interviews with analytics.",
    image: "/vocalx.png",
    alignment: "right",
    githubUrl: "https://github.com/ronitrai27/AI-VOICE-APP",
    liveUrl: "https://www.vocalx.xyz",
  },
];

export default function WorkPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinnedStageRef = useRef<HTMLDivElement>(null);
  const projectsStageRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const centerTitleRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      if (
        !pinnedStageRef.current ||
        !projectsStageRef.current ||
        !centerTitleRef.current
      )
        return;

      // Master ScrollTrigger timeline pinned across scroll
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=7200",
          pin: pinnedStageRef.current,
          pinSpacing: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // 1. Initial scroll: Center title & scroll prompt smoothly fade out as projects arrive
      tl.to(
        centerTitleRef.current,
        {
          autoAlpha: 0.08,
          scale: 0.95,
          duration: 0.8,
          ease: "power2.out",
        },
        0,
      );

      // 2. Animate each project item: as 1 goes up, next comes up simultaneously with zero collision
      const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
      const transitionDuration = 1.0;
      const holdDuration = 1.2;
      const step = transitionDuration + holdDuration;

      cards.forEach((card, i) => {
        // Initial GPU offscreen state below
        gsap.set(card, {
          yPercent: 135,
          autoAlpha: 0,
          scale: 0.95,
        });

        const startTime = i * step;

        // Enter from bottom into center
        tl.to(
          card,
          {
            yPercent: 0,
            autoAlpha: 1,
            scale: 1,
            duration: transitionDuration,
            ease: "power1.inOut",
          },
          startTime,
        );

        // Exit towards top simultaneously with matching ease and speed as the next project enters
        if (i < cards.length - 1) {
          tl.to(
            card,
            {
              yPercent: -135,
              autoAlpha: 0,
              scale: 0.95,
              duration: transitionDuration,
              ease: "power1.inOut",
            },
            startTime + transitionDuration + holdDuration,
          );
        }
      });

      // 3. After the 6th project (vocalx) is viewed, glide the projects panel UPWARD
      // to seamlessly reveal the emerald green Footer sitting underneath!
      const lastProjectEndTime =
        (cards.length - 1) * step + transitionDuration + holdDuration;

      // Exit card 6
      if (cards.length > 0) {
        tl.to(
          cards[cards.length - 1],
          {
            yPercent: -135,
            autoAlpha: 0,
            scale: 0.95,
            duration: transitionDuration,
            ease: "power1.inOut",
          },
          lastProjectEndTime,
        );
      }

      // Curtain Lift: Projects Stage slides up off-screen
      tl.to(
        projectsStageRef.current,
        {
          yPercent: -100,
          duration: 1.6,
          ease: "power1.inOut",
        },
        lastProjectEndTime + 0.1,
      );
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-[#123826] text-[#141b16]"
    >
      {/* Pinned Stage Viewport (h-screen) */}
      <div
        ref={pinnedStageRef}
        className="relative h-screen w-full overflow-hidden select-none bg-[#123826]"
      >
        {/* Layer 0 (Underneath): Footer Section */}
        <Footer ref={footerRef} />

        {/* Layer 1 (On Top): White Projects Stage — Glides UPWARD on scroll after project 6! */}
        <div
          ref={projectsStageRef}
          className="absolute inset-0 w-full h-full bg-[#fafafa] text-[#141b16] z-20 overflow-hidden flex flex-col justify-between p-6 will-change-transform shadow-[0_25px_60px_rgba(0,0,0,0.3)]"
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

          {/* Background Center Title - Top Loved Works & scroll prompt */}
          <div
            ref={centerTitleRef}
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-4 select-none will-change-[opacity,transform]"
            style={{ zIndex: 1 }}
          >
            <h1 className="font-serif font-medium text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight text-[#141b16] text-center leading-none">
              Top Loved Works
            </h1>
            <p className="font-sans text-xs sm:text-sm md:text-base text-neutral-600 font-medium tracking-wide mt-3 sm:mt-5 flex items-center gap-1.5">
              <span>scroll down to see work</span>
              <span className="inline-block animate-bounce">↓</span>
            </p>
          </div>

          {/* Foreground Floating Projects Layer (Alternating Image/Text Split Screen) */}
          <div
            className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center"
            style={{ zIndex: 20 }}
          >
            {projects.map((project, index) => {
              const isLeft = project.alignment === "left";
              const targetUrl = project.liveUrl || project.githubUrl;
              const displayUrl =
                project.displayUrl ||
                (project.liveUrl
                  ? project.liveUrl
                      .replace(/^https?:\/\//, "")
                      .replace(/\/$/, "")
                  : "http://localhost:3000");

              return (
                <div
                  key={project.id}
                  ref={(el) => {
                    cardRefs.current[index] = el;
                  }}
                  style={{ zIndex: 30 }}
                  className="absolute inset-0 flex items-center justify-center px-4 sm:px-8 md:px-12 pointer-events-none will-change-transform"
                >
                  <div className="pointer-events-auto w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 md:gap-10 items-center">
                    {isLeft ? (
                      <>
                        {/* Left Side: Minimal Mac Browser Mockup Frame with Bezels */}
                        <div className="lg:col-span-7 group relative w-full aspect-[16/10.5] rounded-2xl sm:rounded-3xl overflow-hidden bg-neutral-100 shadow-[0_22px_60px_rgba(0,0,0,0.14)] border border-black/10 flex flex-col transition-transform duration-500 hover:scale-[1.02]">
                          {/* Mac Browser Top Chrome / Header Bar */}
                          <div className="h-8 sm:h-9 w-full bg-neutral-100 border-b border-black/8 px-3 sm:px-3.5 flex items-center justify-between shrink-0 select-none gap-2">
                            {/* Left: Traffic Lights + Sidebar + Back/Forward Arrows */}
                            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                              {/* Traffic Light Dots */}
                              <div className="flex items-center gap-1.5">
                                <span className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-[#ff5f56] border border-black/10 shadow-xs" />
                                <span className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-[#ffbd2e] border border-black/10 shadow-xs" />
                                <span className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-[#27c93f] border border-black/10 shadow-xs" />
                              </div>

                              {/* Sidebar Toggle */}
                              <div className="hidden sm:flex items-center gap-0.5 text-neutral-600">
                                <svg
                                  className="w-3.5 h-3.5"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <rect
                                    width="18"
                                    height="18"
                                    x="3"
                                    y="3"
                                    rx="3"
                                  />
                                  <path d="M9 3v18" />
                                </svg>
                                <svg
                                  className="w-2 h-2"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2.5"
                                >
                                  <path d="m6 9 6 6 6-6" />
                                </svg>
                              </div>

                              {/* Navigation Chevrons */}
                              <div className="hidden md:flex items-center gap-1 text-neutral-600">
                                <svg
                                  className="w-3 h-3"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="m15 18-6-6 6-6" />
                                </svg>
                                <svg
                                  className="w-3 h-3 text-neutral-600"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="m9 18 6-6-6-6" />
                                </svg>
                              </div>
                            </div>

                            {/* Center: Minimal Safari Address Bar Pill */}
                            <div className="flex-1 max-w-[210px] sm:max-w-[260px] md:max-w-[300px] mx-auto px-2.5 sm:px-3 py-1 rounded-md bg-neutral-200 border border-black/5 text-[10px] sm:text-[11px] font-mono text-neutral-800 flex items-center justify-between gap-1.5 shadow-2xs">
                              <div className="flex items-center gap-1.5 truncate">
                                <svg
                                  className="w-2.5 h-2.5 text-neutral-600 shrink-0"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2.5"
                                >
                                  <rect
                                    width="18"
                                    height="11"
                                    x="3"
                                    y="11"
                                    rx="2"
                                    ry="2"
                                  />
                                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </svg>
                                <span className="truncate">{displayUrl}</span>
                              </div>
                              <svg
                                className="w-2.5 h-2.5 text-neutral-600 shrink-0 opacity-60"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                                <path d="M3 3v5h5" />
                              </svg>
                            </div>

                            {/* Right: Mac Browser Action Icons (Share, New Tab, Tab Grid) */}
                            <div className="flex items-center gap-1.5 sm:gap-2 text-neutral-600 shrink-0">
                              {/* Share */}
                              <svg
                                className="w-3 sm:w-3.5 h-3 sm:h-3.5 cursor-default hover:text-neutral-600 transition-colors"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                                <polyline points="16 6 12 2 8 6" />
                                <line x1="12" x2="12" y1="2" y2="15" />
                              </svg>
                              {/* Plus / New Tab */}
                              <svg
                                className="w-3 sm:w-3.5 h-3 sm:h-3.5 cursor-default hover:text-neutral-600 transition-colors"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <line x1="12" x2="12" y1="5" y2="19" />
                                <line x1="5" x2="19" y1="12" y2="12" />
                              </svg>
                              {/* Grid / Tab Overview */}
                              <svg
                                className="hidden sm:block w-3 sm:w-3.5 h-3 sm:h-3.5 cursor-default hover:text-neutral-600 transition-colors"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <rect width="7" height="7" x="3" y="3" rx="1" />
                                <rect
                                  width="7"
                                  height="7"
                                  x="14"
                                  y="3"
                                  rx="1"
                                />
                                <rect
                                  width="7"
                                  height="7"
                                  x="14"
                                  y="14"
                                  rx="1"
                                />
                                <rect
                                  width="7"
                                  height="7"
                                  x="3"
                                  y="14"
                                  rx="1"
                                />
                              </svg>
                            </div>
                          </div>

                          {/* Inner Screenshot Container with Left, Right, Bottom Bezels */}
                          <div className="flex-1 w-full p-2 sm:p-2.5 pt-1.5 flex flex-col min-h-0">
                            <div className="relative w-full h-full rounded-xl sm:rounded-2xl overflow-hidden bg-neutral-900 border border-black/10 shadow-2xs">
                              {targetUrl ? (
                                <a
                                  href={targetUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="relative block w-full h-full cursor-pointer"
                                  title={`Open ${project.title}`}
                                >
                                  <Image
                                    src={project.image}
                                    alt={project.title}
                                    fill
                                    sizes="(max-width: 1024px) 90vw, 650px"
                                    className="object-cover object-top transition-transform duration-700 group-hover:scale-103"
                                    priority={index === 0}
                                  />
                                </a>
                              ) : (
                                <Image
                                  src={project.image}
                                  alt={project.title}
                                  fill
                                  sizes="(max-width: 1024px) 90vw, 650px"
                                  className="object-cover object-top transition-transform duration-700 group-hover:scale-103"
                                  priority={index === 0}
                                />
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Right Side: Description & Info */}
                        <div className="lg:col-span-5 flex flex-col justify-center gap-3 sm:gap-4 pl-0 lg:pl-4">
                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1 rounded-full bg-black/5 font-mono text-xs font-semibold text-neutral-800">
                              {project.number}
                            </span>
                          </div>

                          <h2 className="font-sans font-bold text-2xl sm:text-3xl md:text-4xl text-[#141b16] tracking-tight">
                            {project.title}
                          </h2>

                          {/* Darkened, high-contrast readable description */}
                          <p className="font-sans text-xs sm:text-sm md:text-[15px] text-neutral-800 font-normal leading-relaxed">
                            {project.description}
                          </p>

                          {/* Tech Stack Pills */}
                          <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                            {project.tech.map((t) => (
                              <span
                                key={t}
                                className="px-3 py-1 rounded-full bg-[#c5eb35] text-xs font-mono font-semibold text-[#141b16] shadow-xs"
                              >
                                {t}
                              </span>
                            ))}
                          </div>

                          {/* Links: GitHub & Live Demo */}
                          <div className="flex items-center gap-2.5 mt-2">
                            {project.githubUrl && (
                              <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/5 hover:bg-black/10 border border-black/10 text-xs font-semibold text-[#141b16] transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-2xs"
                                title="View Source on GitHub"
                              >
                                <svg
                                  className="w-3.5 h-3.5 fill-current"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                                  />
                                </svg>
                                <span>GitHub</span>
                              </a>
                            )}

                            {project.liveUrl && (
                              <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-black/5 hover:bg-black/10 border border-black/10 text-xs font-semibold text-[#141b16] transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-2xs"
                                title="Open Live Site"
                              >
                                <span>Live Demo</span>
                                <ArrowUpRight className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Left Side: Description & Info */}
                        <div className="lg:col-span-5 flex flex-col justify-center gap-3 sm:gap-4 pr-0 lg:pr-4 order-2 lg:order-1">
                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1 rounded-full bg-black/5 font-mono text-xs font-semibold text-neutral-800">
                              {project.number}
                            </span>
                          </div>

                          <h2 className="font-sans font-bold text-2xl sm:text-3xl md:text-4xl text-[#141b16] tracking-tight">
                            {project.title}
                          </h2>

                          {/* Darkened, high-contrast readable description */}
                          <p className="font-sans text-xs sm:text-sm md:text-[15px] text-neutral-800 font-normal leading-relaxed">
                            {project.description}
                          </p>

                          {/* Tech Stack Pills */}
                          <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                            {project.tech.map((t) => (
                              <span
                                key={t}
                                className="px-3 py-1 rounded-full bg-[#c5eb35] text-xs font-mono font-semibold text-[#141b16] shadow-xs"
                              >
                                {t}
                              </span>
                            ))}
                          </div>

                          {/* Links: GitHub & Live Demo */}
                          <div className="flex items-center gap-2.5 mt-2">
                            {project.githubUrl && (
                              <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/5 hover:bg-black/10 border border-black/10 text-xs font-semibold text-[#141b16] transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-2xs"
                                title="View Source on GitHub"
                              >
                                <svg
                                  className="w-3.5 h-3.5 fill-current"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                                  />
                                </svg>
                                <span>GitHub</span>
                              </a>
                            )}

                            {project.liveUrl && (
                              <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-black/5 hover:bg-black/10 border border-black/10 text-xs font-semibold text-[#141b16] transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-2xs"
                                title="Open Live Site"
                              >
                                <span>Live Demo</span>
                                <ArrowUpRight className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Right Side: Minimal Mac Browser Mockup Frame with Bezels */}
                        <div className="lg:col-span-7 group relative w-full aspect-[16/10.5] rounded-2xl sm:rounded-3xl overflow-hidden bg-neutral-100 shadow-[0_22px_60px_rgba(0,0,0,0.14)] border border-black/10 order-1 lg:order-2 flex flex-col transition-transform duration-500 hover:scale-[1.02]">
                          {/* Mac Browser Top Chrome / Header Bar */}
                          <div className="h-8 sm:h-9 w-full bg-neutral-100 border-b border-black/8 px-3 sm:px-3.5 flex items-center justify-between shrink-0 select-none gap-2">
                            {/* Left: Traffic Lights + Sidebar + Back/Forward Arrows */}
                            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                              {/* Traffic Light Dots */}
                              <div className="flex items-center gap-1.5">
                                <span className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-[#ff5f56] border border-black/10 shadow-xs" />
                                <span className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-[#ffbd2e] border border-black/10 shadow-xs" />
                                <span className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-[#27c93f] border border-black/10 shadow-xs" />
                              </div>

                              {/* Sidebar Toggle */}
                              <div className="hidden sm:flex items-center gap-0.5 text-neutral-600">
                                <svg
                                  className="w-3.5 h-3.5"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <rect
                                    width="18"
                                    height="18"
                                    x="3"
                                    y="3"
                                    rx="3"
                                  />
                                  <path d="M9 3v18" />
                                </svg>
                                <svg
                                  className="w-2 h-2"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2.5"
                                >
                                  <path d="m6 9 6 6 6-6" />
                                </svg>
                              </div>

                              {/* Navigation Chevrons */}
                              <div className="hidden md:flex items-center gap-1 text-neutral-600">
                                <svg
                                  className="w-3 h-3"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="m15 18-6-6 6-6" />
                                </svg>
                                <svg
                                  className="w-3 h-3 text-neutral-600"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="m9 18 6-6-6-6" />
                                </svg>
                              </div>
                            </div>

                            {/* Center: Minimal Safari Address Bar Pill */}
                            <div className="flex-1 max-w-[210px] sm:max-w-[260px] md:max-w-[300px] mx-auto px-2.5 sm:px-3 py-1 rounded-md bg-neutral-200 border border-black/5 text-[10px] sm:text-[11px] font-mono text-neutral-800 flex items-center justify-between gap-1.5 shadow-2xs">
                              <div className="flex items-center gap-1.5 truncate">
                                <svg
                                  className="w-2.5 h-2.5 text-neutral-600 shrink-0"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2.5"
                                >
                                  <rect
                                    width="18"
                                    height="11"
                                    x="3"
                                    y="11"
                                    rx="2"
                                    ry="2"
                                  />
                                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </svg>
                                <span className="truncate">{displayUrl}</span>
                              </div>
                              <svg
                                className="w-2.5 h-2.5 text-neutral-600 shrink-0 opacity-60"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                                <path d="M3 3v5h5" />
                              </svg>
                            </div>

                            {/* Right: Mac Browser Action Icons (Share, New Tab, Tab Grid) */}
                            <div className="flex items-center gap-1.5 sm:gap-2 text-neutral-600 shrink-0">
                              {/* Share */}
                              <svg
                                className="w-3 sm:w-3.5 h-3 sm:h-3.5 cursor-default hover:text-neutral-600 transition-colors"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                                <polyline points="16 6 12 2 8 6" />
                                <line x1="12" x2="12" y1="2" y2="15" />
                              </svg>
                              {/* Plus / New Tab */}
                              <svg
                                className="w-3 sm:w-3.5 h-3 sm:h-3.5 cursor-default hover:text-neutral-600 transition-colors"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <line x1="12" x2="12" y1="5" y2="19" />
                                <line x1="5" x2="19" y1="12" y2="12" />
                              </svg>
                              {/* Grid / Tab Overview */}
                              <svg
                                className="hidden sm:block w-3 sm:w-3.5 h-3 sm:h-3.5 cursor-default hover:text-neutral-600 transition-colors"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <rect width="7" height="7" x="3" y="3" rx="1" />
                                <rect
                                  width="7"
                                  height="7"
                                  x="14"
                                  y="3"
                                  rx="1"
                                />
                                <rect
                                  width="7"
                                  height="7"
                                  x="14"
                                  y="14"
                                  rx="1"
                                />
                                <rect
                                  width="7"
                                  height="7"
                                  x="3"
                                  y="14"
                                  rx="1"
                                />
                              </svg>
                            </div>
                          </div>

                          {/* Inner Screenshot Container with Left, Right, Bottom Bezels */}
                          <div className="flex-1 w-full p-2 sm:p-2.5 pt-1.5 flex flex-col min-h-0">
                            <div className="relative w-full h-full rounded-xl sm:rounded-2xl overflow-hidden bg-neutral-900 border border-black/10 shadow-2xs">
                              {targetUrl ? (
                                <a
                                  href={targetUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="relative block w-full h-full cursor-pointer"
                                  title={`Open ${project.title}`}
                                >
                                  <Image
                                    src={project.image}
                                    alt={project.title}
                                    fill
                                    sizes="(max-width: 1024px) 90vw, 650px"
                                    className="object-cover object-top transition-transform duration-700 group-hover:scale-103"
                                    priority={index === 1}
                                  />
                                </a>
                              ) : (
                                <Image
                                  src={project.image}
                                  alt={project.title}
                                  fill
                                  sizes="(max-width: 1024px) 90vw, 650px"
                                  className="object-cover object-top transition-transform duration-700 group-hover:scale-103"
                                  priority={index === 1}
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty bottom spacer to maintain layout structure */}
          <div
            className="relative z-30 w-full max-w-7xl mx-auto pointer-events-none opacity-0 select-none"
            aria-hidden="true"
          >
            <span className="text-xs">ROX</span>
          </div>
        </div>

        {/* Bottom Left: Fixed Spinning Text Design Indicator */}
        <div
          className="fixed bottom-6 sm:bottom-8 left-6 sm:left-10 z-40 flex items-center justify-center cursor-default select-none w-14 h-14 sm:w-16 sm:h-16"
          aria-label="Scroll to explore"
        >
          <SpinningText
            radius={4.2}
            duration={12}
            className="font-sans text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.2em] text-[#141b16] opacity-80"
          >
            • SCROLL DOWN • SELECTED WORKS
          </SpinningText>
          <div className="w-2 h-2 rounded-full bg-[#141b16]/60" />
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
            href="/about"
            className="px-4 sm:px-5 py-2 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer text-[#5a625b] hover:text-[#141b16] hover:bg-black/5"
          >
            ABOUT
          </Link>
        </nav>
      </div>
    </div>
  );
}
