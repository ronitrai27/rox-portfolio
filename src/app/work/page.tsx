"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "lucide-react";
import Footer from "../../../modules/web/Footer";

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
      if (!pinnedStageRef.current || !projectsStageRef.current || !centerTitleRef.current) return;

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
          autoAlpha: 0.12,
          scale: 0.95,
          duration: 0.8,
          ease: "power2.out",
        },
        0
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
          startTime
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
            startTime + transitionDuration + holdDuration
          );
        }
      });

      // 3. After the 6th project (vocalx) is viewed, glide the projects panel UPWARD
      // to seamlessly reveal the emerald green Footer sitting underneath!
      const lastProjectEndTime = (cards.length - 1) * step + transitionDuration + holdDuration;

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
          lastProjectEndTime
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
        lastProjectEndTime + 0.1
      );
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="relative w-full bg-[#123826] text-[#141b16]">
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
            <p className="font-sans text-xs sm:text-sm md:text-base text-neutral-500 font-medium tracking-wide mt-3 sm:mt-5 flex items-center gap-1.5 opacity-80">
              <span>scroll down to see work</span>
              <span className="inline-block animate-bounce">↓</span>
            </p>
          </div>

          {/* Foreground Floating Projects Layer (Alternating Image/Text Split Screen) */}
          <div
            className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center"
            style={{ zIndex: 20 }}
          >
            <div className="relative w-full h-full max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-center">
              {projects.map((project, index) => {
                const isLeft = project.alignment === "left";
                const targetUrl = project.liveUrl || project.githubUrl;

                return (
                  <div
                    key={project.id}
                    ref={(el) => {
                      cardRefs.current[index] = el;
                    }}
                    style={{ zIndex: 30 }}
                    className="absolute inset-x-4 sm:inset-x-8 md:inset-x-12 top-1/2 -translate-y-1/2 pointer-events-auto will-change-transform flex items-center justify-center"
                  >
                    <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 md:gap-10 items-center">
                      {isLeft ? (
                        <>
                          {/* Left Side: Image Card */}
                          <div className="lg:col-span-7 group relative w-full aspect-[16/10] rounded-2xl sm:rounded-3xl overflow-hidden bg-neutral-100 shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-black/10">
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

                          {/* Right Side: Description & Info */}
                          <div className="lg:col-span-5 flex flex-col justify-center gap-3 sm:gap-4 pl-0 lg:pl-4">
                            <div className="flex items-center gap-2">
                              <span className="px-3 py-1 rounded-full bg-black/5 font-mono text-xs font-semibold text-neutral-700">
                                {project.number}
                              </span>
                            </div>

                            <h2 className="font-sans font-bold text-2xl sm:text-3xl md:text-4xl text-[#141b16] tracking-tight">
                              {project.title}
                            </h2>

                            <p className="font-sans text-xs sm:text-sm md:text-base text-neutral-600 leading-relaxed">
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
                                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
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
                              <span className="px-3 py-1 rounded-full bg-black/5 font-mono text-xs font-semibold text-neutral-700">
                                {project.number}
                              </span>
                            </div>

                            <h2 className="font-sans font-bold text-2xl sm:text-3xl md:text-4xl text-[#141b16] tracking-tight">
                              {project.title}
                            </h2>

                            <p className="font-sans text-xs sm:text-sm md:text-base text-neutral-600 leading-relaxed">
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
                                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
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

                          {/* Right Side: Image Card */}
                          <div className="lg:col-span-7 group relative w-full aspect-[16/10] rounded-2xl sm:rounded-3xl overflow-hidden bg-neutral-100 shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-black/10 order-1 lg:order-2">
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
                        </>
                      )}
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
