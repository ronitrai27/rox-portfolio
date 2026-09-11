"use client";

import React, { forwardRef, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "lucide-react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface OverlayProps {
  className?: string;
  onVideoClick?: () => void;
}

interface ProjectItem {
  id: string;
  number: string;
  tag: string;
  title: string;
  category: string;
  imageUrl: string;
  description: string;
  tech: string[];
}

const projectsData: ProjectItem[] = [
  {
    id: "project-1",
    number: "01",
    tag: "MOBILE APP",
    title: "Aether AI Assistant",
    category: "Intelligent Interface",
    imageUrl:
      "https://images.unsplash.com/photo-1556656793-08538906a9f8?auto=format&fit=crop&w=1000&q=80",
    description:
      "Voice-first multimodal agent interface for next-generation mobile interactions.",
    tech: ["Next.js", "WebRTC", "LLMs"],
  },
  {
    id: "project-2",
    number: "02",
    tag: "3D HARDWARE",
    title: "Edition Spatial Canvas",
    category: "Hardware & Platform",
    imageUrl:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80",
    description:
      "Minimalist studio architecture and precision industrial workstation platform.",
    tech: ["Three.js", "WebGL", "Rust"],
  },
  {
    id: "project-3",
    number: "03",
    tag: "EDITORIAL",
    title: "Ovula Design System",
    category: "Brand & Identity",
    imageUrl:
      "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1000&q=80",
    description:
      "Contemporary editorial aesthetic, typography guidelines, and fluid web experiences.",
    tech: ["GSAP", "Tailwind", "Figma"],
  },
  {
    id: "project-4",
    number: "04",
    tag: "AI WORKSPACE",
    title: "Cognitive Swarm OS",
    category: "Multi-Agent System",
    imageUrl:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80",
    description:
      "Autonomous collaborative AI agents executing distributed workflows in real-time.",
    tech: ["Python", "MCP", "LangGraph"],
  },
  {
    id: "project-5",
    number: "05",
    tag: "SPATIAL CANVAS",
    title: "Sanctuary Architecture",
    category: "Spatial Environment",
    imageUrl:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80",
    description:
      "Modernist concrete sanctuary studio designed for deep focus and digital craftsmanship.",
    tech: ["ArchViz", "Blender", "Unreal"],
  },
  {
    id: "project-6",
    number: "06",
    tag: "NEURAL STUDIO",
    title: "Vortex Generative Engine",
    category: "Creative Computation",
    imageUrl:
      "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1000&q=80",
    description:
      "Diffusion models pipeline streaming dynamic generative branding in real-time.",
    tech: ["PyTorch", "CUDA", "FastAPI"],
  },
];

const Overlay = forwardRef<HTMLDivElement, OverlayProps>(
  ({ className = "", onVideoClick }, ref) => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Projects elements
    const projectsStageRef = useRef<HTMLDivElement>(null);
    const stageBgRef = useRef<HTMLDivElement>(null);
    const projectsTitleRef = useRef<HTMLHeadingElement>(null);
    const projectsSubtitleRef = useRef<HTMLParagraphElement>(null);
    const cardsTrackRef = useRef<HTMLDivElement>(null);

    const [activeTab, setActiveTab] = useState<"HOME" | "WORKS" | "ABOUT">(
      "ABOUT",
    );
    const [quickInfoOpen, setQuickInfoOpen] = useState<boolean>(false);

    // Combine forwarded ref and internal ref
    const setRefs = (node: HTMLDivElement | null) => {
      sectionRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }
    };

    // Ensure video always plays muted and in a loop
    useEffect(() => {
      const vid = videoRef.current;
      if (vid) {
        vid.muted = true;
        vid.play().catch(() => {});
      }
    }, []);

    // 1. GSAP animation: About Me text highlights line by line (100% PRESERVED)
    useGSAP(
      () => {
        if (!sectionRef.current) return;

        const lines = gsap.utils.toArray<HTMLElement>(
          ".overlay-headline-line",
          sectionRef.current,
        );

        // Initial state: dim/translucent text and subtle offsets
        gsap.set(lines, {
          color: "rgba(255, 255, 255, 0.22)",
          opacity: 0.35,
          y: 8,
        });
        gsap.set(".overlay-kicker", { autoAlpha: 0, y: 10 });
        gsap.set(".overlay-subtext", { autoAlpha: 0, y: 16 });
        gsap.set(".overlay-video-capsule-wrapper", {
          autoAlpha: 0,
          scale: 0.95,
          y: 20,
        });

        const textTl = gsap.timeline({ paused: true });

        textTl.to(".overlay-kicker", {
          autoAlpha: 1,
          y: 0,
          duration: 0.45,
          ease: "power2.out",
        });

        textTl.to(
          lines,
          {
            color: "#ffffff",
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.28,
            ease: "power2.out",
          },
          "-=0.15",
        );

        textTl.to(
          ".overlay-subtext",
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out",
          },
          "-=0.25",
        );

        textTl.to(
          ".overlay-video-capsule-wrapper",
          {
            autoAlpha: 1,
            scale: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.4",
        );

        let hasPlayed = false;

        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top 75%",
          onEnter: () => {
            if (!hasPlayed) {
              hasPlayed = true;
              textTl.play();
            }
          },
          onLeaveBack: () => {
            hasPlayed = false;
            textTl.reverse();
          },
        });

        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting && !hasPlayed) {
                hasPlayed = true;
                textTl.play();
              }
            });
          },
          { threshold: 0.2 },
        );

        observer.observe(sectionRef.current);

        return () => {
          observer.disconnect();
        };
      },
      { scope: sectionRef },
    );

    // 2. GSAP animation: Projects Stage below video
    // - Pinned on scroll
    // - Background transitions from green #123826 to white #eaeae8
    // - "Projects" changes from white to Lemon green #96cc14 and STAYS IN CENTER
    // - As user scrolls more: project cards glide in from the right side ONE BY ONE on scroll only!
    useGSAP(
      () => {
        if (
          !projectsStageRef.current ||
          !cardsTrackRef.current ||
          !stageBgRef.current
        )
          return;

        const stage = projectsStageRef.current;
        const bg = stageBgRef.current;
        const track = cardsTrackRef.current;
        const title = projectsTitleRef.current;
        const subtitle = projectsSubtitleRef.current;

        // Set initial states
        gsap.set(bg, { backgroundColor: "#123826" });
        gsap.set(title, { color: "#ffffff", autoAlpha: 1 });
        gsap.set(subtitle, { color: "rgba(255, 255, 255, 0.7)" });

        // Cards start COMPLETELY OFF-SCREEN TO THE RIGHT
        gsap.set(track, {
          x: () => window.innerWidth + 80,
        });

        // Master pinned scrubbed timeline
        const projectsTl = gsap.timeline({
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: "+=3400",
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (self.progress > 0.08) {
                setActiveTab("WORKS");
              } else {
                setActiveTab("ABOUT");
              }
            },
          },
        });

        // PHASE 1 (0 -> 1.0):
        // As user scrolls more from the centered white Projects on green:
        // - Background changes to white (#eaeae8)
        // - "Projects" text changes to Lemon green (#96cc14)
        // - "Projects" STAYS in the center! (y is NOT moved)
        projectsTl.to(
          bg,
          {
            backgroundColor: "#eaeae8",
            duration: 1.0,
            ease: "power2.inOut",
          },
          "colorShift",
        );

        projectsTl.to(
          title,
          {
            color: "#96cc14", // Vibrant Lemon Green
            duration: 1.0,
            ease: "power2.inOut",
          },
          "colorShift",
        );

        projectsTl.to(
          subtitle,
          {
            color: "#383f3a", // Charcoal subtitle matching reference
            duration: 0.8,
            ease: "power2.inOut",
          },
          "colorShift",
        );

        // Hold briefly so user sees the centered Lemon green "Projects" on white
        projectsTl.to({}, { duration: 0.3 });

        // PHASE 2 (1.3 -> 5.0):
        // Projects cards glide in from the right side ONE BY ONE strictly on scroll!
        // Ease must be "none" for 1:1 scroll responsiveness
        projectsTl.to(
          track,
          {
            x: () => {
              const trackWidth = track.scrollWidth;
              const viewportWidth = window.innerWidth;
              return -(trackWidth - viewportWidth + 160);
            },
            duration: 3.7,
            ease: "none",
          },
          ">",
        );

        // Trigger refresh after setup
        ScrollTrigger.refresh();
      },
      { scope: sectionRef },
    );

    const handleNavClick = (tab: "HOME" | "WORKS" | "ABOUT") => {
      setActiveTab(tab);
      if (tab === "HOME") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (tab === "ABOUT") {
        sectionRef.current?.scrollIntoView({ behavior: "smooth" });
      } else if (tab === "WORKS") {
        projectsStageRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    };

    return (
      <section
        ref={setRefs}
        aria-label="Overlay Section — About & Projects"
        className={`relative w-full bg-[#123826] text-white select-none ${className}`}
      >
        {/* ==================================================================== */}
        {/* STAGE 1: ABOUT ME & VIDEO CAPSULE (100% PRESERVED CONTENT & DESIGN)  */}
        {/* ==================================================================== */}
        <div className="relative min-h-screen w-full flex flex-col justify-between items-center px-4 sm:px-6 md:px-12 py-12 sm:py-16 md:py-20 rounded-t-[36px] sm:rounded-t-[48px] shadow-[0_-30px_70px_rgba(0,0,0,0.55)] overflow-hidden bg-[#123826]">
          {/* Subtle radial emerald background ambient glow that fades completely before the bottom */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 75% 45% at 50% 25%, rgba(34, 110, 72, 0.35) 0%, rgba(18, 56, 38, 0) 100%)",
            }}
          />

          {/* Film grain noise overlay */}
          <div className="absolute inset-0 bg-noise opacity-15 pointer-events-none mix-blend-overlay" />

          {/* Top/Center: About Me Content */}
          <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center text-center pt-2 sm:pt-6">
            {/* Top Category Badge */}
            <div className="overlay-kicker flex items-center gap-2 px-8 py-1.5 rounded-full bg-white/25 border border-white/10 backdrop-blur-sm mb-5 sm:mb-7">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c5eb35]" />
              <span className="font-sans text-sm tracking-wide">ABOUT ME</span>
            </div>

            {/* 1. Center Bold Big About Me (Exact 5 Lines) */}
            <h1 className="font-sans font-normal tracking-tight text-2xl sm:text-4xl md:text-[2.75rem] lg:text-[3.25rem] xl:text-[3.6rem] leading-[1.12] sm:leading-[1.16] text-center max-w-5xl mx-auto flex flex-col items-center">
              {/* Line 1 */}
              <span className="overlay-headline-line block transition-colors duration-300">
                I am ROX, an experienced
              </span>

              {/* Line 2 with elegant editorial serif italic accent matching Image 2 */}
              <span className="overlay-headline-line block transition-colors duration-300">
                <span className="font-serif italic font-normal text-inherit tracking-normal px-1">
                  Full-Stack AI Engineer
                </span>{" "}
                who
              </span>

              {/* Line 3 */}
              <span className="overlay-headline-line block transition-colors duration-300">
                architects intelligent systems,
              </span>

              {/* Line 4 */}
              <span className="overlay-headline-line block transition-colors duration-300">
                builds at scale, ships relentlessly,
              </span>

              {/* Line 5 */}
              <span className="overlay-headline-line block transition-colors duration-300">
                breaks boundaries, and builds again.
              </span>
            </h1>

            {/* Subtext below it */}
            <p className="overlay-subtext font-sans text-xs sm:text-sm md:text-[15px] lg:text-base text-neutral-300 font-normal max-w-2xl sm:max-w-3xl mx-auto leading-relaxed mt-6 sm:mt-12 px-4">
              I work across AI/ML, LLMs, RAG, multi-agent systems, MCP,
              distributed architectures, cloud infrastructure, and full-stack
              engineering — turning ambitious ideas into production-grade systems
              built to scale.
            </p>
          </div>

          {/* Bottom: Wide Video Capsule */}
          <div className="relative z-10 w-full flex flex-col items-center mt-auto pt-14 sm:pt-18 md:pt-22 pb-2 sm:pb-4">
            <div className="overlay-video-capsule-wrapper w-full flex justify-center px-2 sm:px-4">
              <button
                type="button"
                onClick={onVideoClick}
                aria-label="Know more about me reel"
                className="group relative cursor-pointer block rounded-full p-[2px] hover:from-[#c5eb35]/90 hover:via-white/40 hover:to-[#c5eb35]/40 transition-all duration-500 w-full max-w-[720px] sm:max-w-[880px] md:max-w-[1020px] lg:max-w-[900px]"
              >
                <div className="relative w-full h-[105px] sm:h-[135px] md:h-[200px] lg:h-[245px] rounded-full overflow-hidden flex items-center justify-center">
                  <video
                    ref={videoRef}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    className="absolute inset-0 w-full h-full object-cover brightness-[0.95] contrast-[1.05] group-hover:scale-106 transition-transform duration-700 ease-out"
                  >
                    <source
                      src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_202655_a7f5aca0-2f80-4bc9-bcb5-96ac95662003.mp4"
                      type="video/mp4"
                    />
                  </video>

                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/15 transition-colors duration-500 pointer-events-none" />

                  <div className="relative z-10 flex items-center justify-center gap-3 px-6 pointer-events-none select-none">
                    <span className="font-serif font-semibold text-white text-lg sm:text-2xl md:text-3xl lg:text-4xl tracking-[0.10em] sm:tracking-[0.16em] uppercase drop-shadow-[0_4px_20px_rgba(0,0,0,0.95)] transition-transform duration-300 group-hover:scale-102">
                      Know more about me
                    </span>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* STAGE 2: PROJECTS BELOW VIDEO (EXTENDED INSIDE SAME OVERLAY)          */}
        {/* "Projects" stays in center, turns Lemon green, cards come from right  */}
        {/* ==================================================================== */}
        <div
          ref={projectsStageRef}
          className="relative w-full h-screen overflow-hidden flex items-center justify-center select-none"
        >
          {/* Stage Background: transitions from #123826 to #eaeae8 */}
          <div
            ref={stageBgRef}
            className="absolute inset-0 w-full h-full will-change-[background-color]"
            style={{ backgroundColor: "#123826" }}
          />

          {/* Film grain noise overlay */}
          <div className="absolute inset-0 bg-noise opacity-10 pointer-events-none mix-blend-overlay" />

          {/* Centered "Projects" & "Recent works" — STAYS IN CENTER! */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 px-4 text-center">
            <h2
              ref={projectsTitleRef}
              className="font-sans font-medium tracking-tight text-6xl sm:text-7xl md:text-8xl lg:text-[7.5rem] leading-none will-change-[color]"
            >
              Projects
            </h2>
            <p
              ref={projectsSubtitleRef}
              className="font-sans text-base sm:text-xl md:text-2xl font-normal tracking-tight mt-3 sm:mt-4 will-change-[color]"
            >
              Recent works
            </p>
          </div>

          {/* Horizontal Project Photo Cards: Starts offscreen to the right, glides across on scroll */}
          <div
            ref={cardsTrackRef}
            className="absolute top-1/2 -translate-y-1/2 left-0 flex items-center gap-6 sm:gap-8 md:gap-10 pl-8 pr-16 z-20 will-change-transform"
          >
            {projectsData.map((project) => (
              <article
                key={project.id}
                className="group relative flex-shrink-0 w-[290px] sm:w-[350px] md:w-[410px] lg:w-[440px] h-[430px] sm:h-[500px] md:h-[550px] rounded-[28px] sm:rounded-[36px] overflow-hidden bg-neutral-900 shadow-[0_22px_60px_rgba(0,0,0,0.18)] border border-black/10 transition-all duration-500 hover:shadow-[0_30px_70px_rgba(0,0,0,0.28)] hover:-translate-y-2 cursor-pointer will-change-transform"
              >
                {/* Project Image */}
                <div className="relative w-full h-full overflow-hidden">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    loading="lazy"
                    className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-700 ease-out brightness-[0.96] contrast-[1.04]"
                  />

                  {/* Gradient Scrim for Top & Bottom Metadata */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/40 pointer-events-none" />

                  {/* Top Tag & Number */}
                  <div className="absolute top-5 left-5 right-5 flex justify-between items-center z-10">
                    <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/15 text-[11px] font-sans font-semibold tracking-wider text-white uppercase">
                      {project.tag}
                    </span>

                    <span className="font-mono text-xs font-medium text-white/80 tracking-widest">
                      {project.number}
                    </span>
                  </div>

                  {/* Bottom Card Content */}
                  <div className="absolute bottom-6 left-6 right-6 z-10 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] font-sans font-medium text-[#c5eb35] tracking-wide uppercase">
                        {project.category}
                      </span>

                      {/* External arrow button */}
                      <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:bg-[#c5eb35] group-hover:text-black group-hover:rotate-45 transition-all duration-300">
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </div>

                    <h3 className="font-sans font-semibold text-xl sm:text-2xl text-white tracking-tight leading-tight">
                      {project.title}
                    </h3>

                    <p className="font-sans text-xs sm:text-sm text-neutral-300 line-clamp-2 leading-relaxed mt-1">
                      {project.description}
                    </p>

                    {/* Tech Pills */}
                    <div className="flex items-center gap-1.5 mt-2">
                      {project.tech.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-mono text-neutral-200"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
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
                      className="text-xs font-semibold uppercase px-3 py-1 rounded-full bg-black/5 hover:bg-black/10 cursor-pointer text-black"
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
                        AI/ML, Multi-Agent Architecture, Distributed Systems, Cloud
                        Infrastructure, Interactive Web.
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
        </div>
      </section>
    );
  },
);

Overlay.displayName = "Overlay";

export default Overlay;
