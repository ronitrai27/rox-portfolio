"use client";

import Link from "next/link";
import React, { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "lucide-react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface ProjectItem {
  id: string;
  number: string;
  title: string;
  imageUrl: string;
  description: string;
  tech: string[];
}

const projectsData: ProjectItem[] = [
  {
    id: "wekraft",
    number: "01",
    title: "wekraft",
    imageUrl: "/wekraft.png",
    description:
      "AI-powered project execution platform bridging Devs & PMs with bidirectional GitHub sync and third-party MCP integrations.",
    tech: ["LangGraph", "MCP", "Ably"],
  },
  {
    id: "clarioo",
    number: "02",
    title: "clarioo",
    imageUrl: "/clarioo.png",
    description:
      "Personalized career acceleration platform for students & professionals, featuring tailored roadmaps and AI-proctored mock interviews.",
    tech: ["Next.js", "Vapi", "Supabase"],
  },
  {
    id: "looma",
    number: "03",
    title: "looma",
    imageUrl: "/looma.png",
    description:
      "Real-time collaborative canvas enabling teams to sketch, design, and instantly generate live deployable web applications.",
    tech: ["Vercel AI", "Firecrawl", "Liveblocks"],
  },
  {
    id: "aria",
    number: "04",
    title: "Aria",
    imageUrl: "/aria.png",
    description:
      "Intelligent personal productivity operating system connecting Gmail, Slack, and Discord to turn daily chaos into automated action.",
    tech: ["LangGraph", "FastAPI", "Composio"],
  },
  {
    id: "enterprise-sales-agent",
    number: "05",
    title: "Enterprise sales agent",
    imageUrl: "/pan-agent.png",
    description:
      "Enterprise-grade bilingual sales agent architected with semantic caching, strict guardrails, background jobs, and persistent memory.",
    tech: ["LangGraph", "Hybrid RAG", "Temporal.io"],
  },
  {
    id: "vocalx",
    number: "06",
    title: "vocalx",
    imageUrl: "/vocalx.png",
    description:
      "Next-gen AI recruitment engine that automates JD parsing, question generation, and real-time proctored voice interviews with analytics.",
    tech: ["Vapi", "Next.js 16", "React 19"],
  },
];

interface ProjectsSectionProps {
  className?: string;
  onNavigate?: (section: "HOME" | "WORKS" | "ABOUT") => void;
}

const ProjectsSection = React.forwardRef<HTMLDivElement, ProjectsSectionProps>(
  ({ className = "", onNavigate }, forwardedRef) => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const bgLayerRef = useRef<HTMLDivElement>(null);
    const darkVignetteRef = useRef<HTMLDivElement>(null);
    const titleWrapperRef = useRef<HTMLDivElement>(null);
    const titleTextRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);
    const cardsTrackRef = useRef<HTMLDivElement>(null);

    // Combine internal ref with forwarded ref
    const setRefs = (node: HTMLDivElement | null) => {
      sectionRef.current = node;
      if (typeof forwardedRef === "function") {
        forwardedRef(node);
      } else if (forwardedRef) {
        (
          forwardedRef as React.MutableRefObject<HTMLDivElement | null>
        ).current = node;
      }
    };

    const [activeTab, setActiveTab] = useState<"HOME" | "WORKS" | "ABOUT">(
      "WORKS",
    );
    const [quickInfoOpen, setQuickInfoOpen] = useState<boolean>(false);

    useGSAP(
      () => {
        if (!sectionRef.current || !cardsTrackRef.current) return;

        const track = cardsTrackRef.current;
        const titleWrapper = titleWrapperRef.current;
        const titleText = titleTextRef.current;
        const subtitle = subtitleRef.current;
        const bgLayer = bgLayerRef.current;
        const darkVignette = darkVignetteRef.current;
        const cards = gsap.utils.toArray<HTMLElement>(
          ".project-card",
          sectionRef.current,
        );

        // 1. Initial states
        gsap.set(bgLayer, { backgroundColor: "#123826" });
        gsap.set(darkVignette, { opacity: 1 });
        gsap.set(titleWrapper, { autoAlpha: 0, y: 120, scale: 0.95 });
        gsap.set(titleText, { color: "#ffffff" });
        gsap.set(subtitle, { color: "rgba(255, 255, 255, 0.7)" });

        // Cards start off-screen to the left: "Phots from left side starts comign on scroll"
        gsap.set(cards, {
          x: -550,
          autoAlpha: 0,
          scale: 0.94,
        });

        gsap.set(track, { x: 0 });

        // 2. Master pinned scrubbed timeline
        const masterTl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=3800",
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            onUpdate: (self) => {
              if (self.progress > 0.15) {
                setActiveTab("WORKS");
              }
            },
          },
        });

        // ----------------------------------------------------
        // PHASE 1 (0 -> 0.8): "Projects in center will come from down"
        // Background is dark green (#123826), text is white (#ffffff)
        // ----------------------------------------------------
        masterTl.to(
          titleWrapper,
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: "power2.out",
          },
          0,
        );

        // Hold briefly to appreciate the centered white "Projects" on green
        masterTl.to({}, { duration: 0.25 });

        // ----------------------------------------------------
        // PHASE 2 (1.05 -> 2.05): "whole green color chnages to white
        // and Projects that was written in white becomes Lemon green"
        // ----------------------------------------------------
        masterTl.to(
          bgLayer,
          {
            backgroundColor: "#eaeae8",
            duration: 1.0,
            ease: "power2.inOut",
          },
          "colorShift",
        );

        masterTl.to(
          darkVignette,
          {
            opacity: 0,
            duration: 0.8,
            ease: "power2.inOut",
          },
          "colorShift",
        );

        masterTl.to(
          titleText,
          {
            color: "#96cc14", // Lemon green with crisp contrast on #eaeae8
            duration: 1.0,
            ease: "power2.inOut",
          },
          "colorShift",
        );

        masterTl.to(
          subtitle,
          {
            color: "#383f3a", // Charcoal subtitle matching Image 2 "Recent works"
            duration: 0.8,
            ease: "power2.inOut",
          },
          "colorShift",
        );

        // Hold briefly so user clearly sees Image 2 state (Recent works / Projects in Lemon green)
        masterTl.to({}, { duration: 0.3 });

        // ----------------------------------------------------
        // PHASE 3A (2.35 -> 3.6): "and then Phots from left side starts comign on scroll"
        // Cards enter from the left side onto the screen (matching Image 3)
        // ----------------------------------------------------
        masterTl.to(
          titleWrapper,
          {
            y: -window.innerHeight * 0.38,
            scale: 0.62,
            duration: 1.0,
            ease: "power2.out",
          },
          "cardsEnterLeft",
        );

        masterTl.to(
          cards,
          {
            x: 0,
            autoAlpha: 1,
            scale: 1,
            stagger: 0.2,
            duration: 1.2,
            ease: "power2.out",
          },
          "cardsEnterLeft",
        );

        // ----------------------------------------------------
        // PHASE 3B (3.6 -> 6.2): Continuous horizontal scroll
        // Track slides horizontally so all remaining projects glide smoothly across
        // ----------------------------------------------------
        masterTl.to(
          track,
          {
            x: () => {
              const trackWidth = track.scrollWidth;
              const viewportWidth = window.innerWidth;
              return -(trackWidth - viewportWidth + 180);
            },
            duration: 2.8,
            ease: "none", // REQUIRED by GSAP ScrollTrigger for 1:1 scroll responsiveness
          },
          ">",
        );
      },
      { scope: sectionRef },
    );

    const handleNavClick = (tab: "HOME" | "WORKS" | "ABOUT") => {
      setActiveTab(tab);
      if (onNavigate) {
        onNavigate(tab);
        return;
      }
      if (tab === "HOME") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (tab === "ABOUT") {
        window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
      }
    };

    return (
      <section
        ref={setRefs}
        id="projects-section"
        aria-label="Projects Showcase"
        className={`relative w-full h-screen overflow-hidden select-none z-20 ${className}`}
      >
        {/* Background layer: transitions smoothly from deep green #123826 to light #eaeae8 */}
        <div
          ref={bgLayerRef}
          className="absolute inset-0 w-full h-full will-change-[background-color]"
          style={{ backgroundColor: "#123826" }}
        />

        {/* Dark vignette overlay: active during dark green stage, fades away during color transition */}
        <div
          ref={darkVignetteRef}
          className="absolute inset-0 pointer-events-none transition-opacity will-change-opacity"
          style={{
            background:
              "radial-gradient(ellipse 75% 55% at 50% 50%, rgba(34, 110, 72, 0.45) 0%, rgba(18, 56, 38, 0.95) 75%, #0d2e1f 100%)",
          }}
        />

        {/* Film grain noise overlay */}
        <div className="absolute inset-0 bg-noise opacity-10 pointer-events-none mix-blend-overlay" />

        {/* Center Stage Title: "Projects" & "Recent works" */}
        <div
          ref={titleWrapperRef}
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 px-4 will-change-transform"
        >
          <div className="flex flex-col items-center text-center">
            {/* Main Headline: "Projects" */}
            <h2
              ref={titleTextRef}
              className="font-sans font-medium tracking-tight text-5xl sm:text-7xl md:text-8xl lg:text-[7.2rem] leading-none will-change-[color]"
            >
              Projects
            </h2>

            {/* Subtitle: "Recent works" matching Image 2 */}
            <p
              ref={subtitleRef}
              className="font-sans text-base sm:text-xl md:text-2xl font-normal tracking-tight mt-3 sm:mt-4 will-change-[color]"
            >
              Top Most Loved Works
            </p>
          </div>
        </div>

        {/* Horizontal Cards Track: Glides in from left across the screen */}
        <div
          ref={cardsTrackRef}
          className="absolute top-1/2 -translate-y-1/2 left-0 flex items-center gap-6 sm:gap-8 md:gap-9 pl-[8vw] pr-[16vw] z-20 will-change-transform"
        >
          {projectsData.map((project) => (
            <Link
              key={project.id}
              href="/work"
              className="project-card group relative flex-shrink-0 w-[320px] sm:w-[420px] md:w-[510px] lg:w-[610px] xl:w-[650px] h-[260px] sm:h-[320px] md:h-[380px] lg:h-[425px] xl:h-[445px] rounded-2xl sm:rounded-xl overflow-hidden bg-transparent shadow-[0_16px_45px_rgba(0,0,0,0.12)] border border-black/10 transition-all duration-500 hover:shadow-[0_24px_55px_rgba(0,0,0,0.22)] hover:-translate-y-1.5 cursor-pointer will-change-transform block"
            >
              {/* Project Screenshot — Clean & Natural */}
              <div className="relative w-full h-full overflow-hidden bg-neutral-100">
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  loading="lazy"
                  className="w-full h-full object-cover object-top group-hover:scale-104 transition-transform duration-700 ease-out"
                />

                {/* Subtle bottom-only shade strictly to make text readable */}
                <div className="absolute bottom-0 inset-x-0 h-36 sm:h-44 md:h-52 bg-gradient-to-t from-black/90 via-black/45 to-transparent pointer-events-none" />

                {/* Top Number & External Arrow with Frosted Glass Badges */}
                <div className="absolute top-3.5 sm:top-4 left-3.5 sm:left-4 right-3.5 sm:right-4 flex justify-between items-center z-10">
                  <span className="px-2.5 py-0.5 rounded-full bg-black/35 backdrop-blur-md border border-white/20 text-[11px] sm:text-xs font-mono font-medium text-white tracking-widest shadow-xs">
                    {project.number}
                  </span>

                  <div className="w-8 h-8 rounded-full bg-black/35 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:bg-[#c5eb35] group-hover:text-black group-hover:rotate-45 transition-all duration-300 shadow-xs">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Bottom Project Info */}
                <div className="absolute bottom-3.5 sm:bottom-4 left-3.5 sm:left-5 right-3.5 sm:right-5 z-10 flex flex-col gap-1 sm:gap-1.5">
                  <h3 className="font-sans font-bold text-lg sm:text-xl md:text-2xl text-white tracking-tight leading-tight drop-shadow-sm">
                    {project.title}
                  </h3>

                  <p className="font-sans text-xs sm:text-[13px] text-neutral-100/95 line-clamp-2 leading-relaxed drop-shadow-xs">
                    {project.description}
                  </p>

                  {/* Tech Pills */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-0.5 rounded-full bg-[#c5eb35] text-[10px] sm:text-[11px] font-mono  text-[#141b16] shadow-xs"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Floating Quick Info Tab on Right Screen Edge (Matching Image 3) */}
        <aside
          aria-label="Quick Info"
          onClick={() => setQuickInfoOpen((prev) => !prev)}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-40 bg-white/95 backdrop-blur-md border-l border-y border-black/10 py-3.5 px-2 rounded-l-xl shadow-lg flex items-center gap-1.5 cursor-pointer hover:bg-white hover:scale-102 transition-all duration-300 group"
        >
          <span className="w-1.5 h-6 rounded-full bg-[#c5eb35] mr-1" />
          <span
            className="font-sans text-[11px] font-semibold tracking-wider text-neutral-700 group-hover:text-black uppercase whitespace-nowrap"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            Quick info
          </span>
        </aside>

        {/* Quick Info Drawer Modal */}
        {quickInfoOpen && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setQuickInfoOpen(false)}
          >
            <div
              className="w-full max-w-sm h-full bg-[#eaeae8] p-8 shadow-2xl flex flex-col justify-between"
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                <div className="flex items-center justify-between border-b border-black/10 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#c5eb35]" />
                    <h4 className="font-sans font-bold text-sm tracking-wider uppercase text-black">
                      Quick Info
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => setQuickInfoOpen(false)}
                    className="text-xs font-semibold uppercase px-3 py-1 rounded-full bg-black/5 hover:bg-black/10 cursor-pointer"
                  >
                    Close
                  </button>
                </div>

                <div className="mt-8 space-y-6">
                  <div>
                    <span className="font-mono text-xs text-neutral-500 uppercase">
                      Role
                    </span>
                    <p className="font-sans font-semibold text-lg text-black mt-1">
                      Full-Stack AI Engineer & Builder
                    </p>
                  </div>

                  <div>
                    <span className="font-mono text-xs text-neutral-500 uppercase">
                      Core Focus
                    </span>
                    <p className="font-sans text-sm text-neutral-700 mt-1 leading-relaxed">
                      AI/ML, Multi-Agent Architecture, Distributed Systems,
                      Cloud Infrastructure, Interactive Web.
                    </p>
                  </div>

                  <div>
                    <span className="font-mono text-xs text-neutral-500 uppercase">
                      Availability
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="w-2 h-2 rounded-full bg-[#c5eb35] animate-pulse" />
                      <span className="font-sans text-sm font-medium text-black">
                        Open for Select High-Impact Roles & Projects
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="font-mono text-xs text-neutral-500 uppercase">
                      Location
                    </span>
                    <p className="font-sans text-sm font-medium text-black mt-1">
                      Global / Remote
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-black/10 pt-4">
                <a
                  href="mailto:contact@rox.ai"
                  className="w-full py-3 rounded-full bg-[#c5eb35] hover:bg-[#b8e528] text-black font-sans font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>Initiate Contact</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Floating Bottom Navigation Bar (Exact Match to Image 2 & 3) */}
        <nav
          aria-label="Main Navigation"
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 bg-white/95 backdrop-blur-md shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-black/8 rounded-full p-1.5 flex items-center gap-1 sm:gap-2 transition-all duration-300"
        >
          <button
            type="button"
            onClick={() => handleNavClick("HOME")}
            className={`px-5 sm:px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
              activeTab === "HOME"
                ? "bg-[#c5eb35] text-[#141b16] shadow-sm scale-[1.02]"
                : "text-[#5a625b] hover:text-[#141b16] hover:bg-black/5"
            }`}
          >
            HOME
          </button>

          <button
            type="button"
            onClick={() => handleNavClick("WORKS")}
            className={`px-5 sm:px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
              activeTab === "WORKS"
                ? "bg-[#c5eb35] text-[#141b16] shadow-sm scale-[1.02]"
                : "text-[#5a625b] hover:text-[#141b16] hover:bg-black/5"
            }`}
          >
            WORKS
          </button>

          <button
            type="button"
            onClick={() => handleNavClick("ABOUT")}
            className={`px-5 sm:px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
              activeTab === "ABOUT"
                ? "bg-[#c5eb35] text-[#141b16] shadow-sm scale-[1.02]"
                : "text-[#5a625b] hover:text-[#141b16] hover:bg-black/5"
            }`}
          >
            ABOUT
          </button>
        </nav>
      </section>
    );
  },
);

ProjectsSection.displayName = "ProjectsSection";

export default ProjectsSection;
