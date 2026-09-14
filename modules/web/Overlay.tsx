"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { forwardRef, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "lucide-react";
import Footer from "./Footer";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface OverlayProps {
  className?: string;
  onVideoClick?: () => void;
}

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

const Overlay = forwardRef<HTMLDivElement, OverlayProps>(
  ({ className = "", onVideoClick }, ref) => {
    const router = useRouter();
    const sectionRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Projects & Curtain Lift elements
    const stageContainerRef = useRef<HTMLDivElement>(null);
    const projectsPanelRef = useRef<HTMLDivElement>(null);
    const stageBgRef = useRef<HTMLDivElement>(null);
    const projectsTitleRef = useRef<HTMLHeadingElement>(null);
    const projectsSubtitleRef = useRef<HTMLParagraphElement>(null);
    const cardsTrackRef = useRef<HTMLDivElement>(null);

    // Footer underlying element
    const footerRef = useRef<HTMLDivElement>(null);

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

    // 1. GSAP animation: About Me text highlights line by line
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

    // 2. GSAP animation: Pinned Projects Stage + Curtain Lift to reveal Achievements
    // - Pinned on scroll
    // - Phase 1: Background transitions from green #123826 to light grey #eaeae8
    // - Phase 2: Project cards glide in horizontally from right side
    // - Phase 3 (Curtain Lift): Entire Projects panel glides UPWARD (yPercent: -100),
    //   unmasking the underlying green Achievements section that was sitting there all along!
    useGSAP(
      () => {
        if (
          !stageContainerRef.current ||
          !projectsPanelRef.current ||
          !cardsTrackRef.current ||
          !stageBgRef.current
        )
          return;

        const stage = stageContainerRef.current;
        const panel = projectsPanelRef.current;
        const bg = stageBgRef.current;
        const track = cardsTrackRef.current;
        const title = projectsTitleRef.current;
        const subtitle = projectsSubtitleRef.current;

        // Set initial states
        gsap.set(bg, { backgroundColor: "#123826" });
        gsap.set(title, { color: "#ffffff", autoAlpha: 1 });
        gsap.set(subtitle, { color: "rgba(255, 255, 255, 0.7)" });
        gsap.set(panel, { yPercent: 0 });

        // Cards start off-screen to the right
        gsap.set(track, {
          x: () => window.innerWidth + 80,
        });

        // Master pinned scrubbed timeline
        const masterTl = gsap.timeline({
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: "+=4600",
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // PHASE 1 (0 -> 1.0): Color Shift
        // Background changes to light grey (#eaeae8), "Projects" turns Lemon green (#96cc14)
        masterTl.to(
          bg,
          {
            backgroundColor: "#eaeae8",
            duration: 1.0,
            ease: "power2.inOut",
          },
          "colorShift",
        );

        masterTl.to(
          title,
          {
            color: "#96cc14",
            duration: 1.0,
            ease: "power2.inOut",
          },
          "colorShift",
        );

        masterTl.to(
          subtitle,
          {
            color: "#383f3a",
            duration: 0.8,
            ease: "power2.inOut",
          },
          "colorShift",
        );

        // Hold briefly so user sees centered Lemon green Projects
        masterTl.to({}, { duration: 0.3 });

        // PHASE 2 (1.3 -> 5.0): Horizontal Project Cards Slide Across
        masterTl.to(
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

        // Hold cards briefly
        masterTl.to({}, { duration: 0.4 });

        // PHASE 3 (5.4 -> 7.2): CURTAIN LIFT OVERLAY TRANSITION
        // As you scroll further, the Projects panel glides UPWARD off the screen,
        // perfectly uncovering the green Achievements page resting underneath!
        masterTl.to(
          panel,
          {
            yPercent: -100,
            duration: 1.8,
            ease: "power1.inOut",
          },
          ">",
        );

        // Trigger refresh after setup
        ScrollTrigger.refresh();
      },
      { scope: sectionRef },
    );

    return (
      <section
        ref={setRefs}
        aria-label="Overlay Section — About, Projects & Footer"
        className={`relative w-full bg-[#123826] text-white select-none ${className}`}
      >
        {/* ==================================================================== */}
        {/* STAGE 1: ABOUT ME & VIDEO CAPSULE (NO ROUNDED TOP CORNERS)           */}
        {/* ==================================================================== */}
        <div
          id="about-section"
          className="relative min-h-screen w-full flex flex-col justify-between items-center px-4 sm:px-6 md:px-12 py-12 sm:py-16 md:py-20 overflow-hidden bg-[#123826] rounded-t-none z-20"
        >
          {/* Subtle radial emerald background ambient glow */}
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

            {/* Center Bold Big About Me */}
            <h1 className="font-sans font-normal tracking-tight text-2xl sm:text-4xl md:text-[2.75rem] lg:text-[3.25rem] xl:text-[3.6rem] leading-[1.12] sm:leading-[1.16] text-center max-w-5xl mx-auto flex flex-col items-center">
              <span className="overlay-headline-line block transition-colors duration-300">
                I am ROX, an experienced
              </span>

              <span className="overlay-headline-line block transition-colors duration-300">
                <span className="font-serif italic font-normal text-inherit tracking-normal px-1">
                  Full-Stack AI Engineer
                </span>{" "}
                who
              </span>

              <span className="overlay-headline-line block transition-colors duration-300">
                architects intelligent systems,
              </span>

              <span className="overlay-headline-line block transition-colors duration-300">
                builds at scale, ships relentlessly,
              </span>

              <span className="overlay-headline-line block transition-colors duration-300">
                breaks boundaries, and builds again.
              </span>
            </h1>

            {/* Subtext below it */}
            <p className="overlay-subtext font-sans text-xs sm:text-sm md:text-[15px] lg:text-base text-neutral-300 font-normal max-w-2xl sm:max-w-3xl mx-auto leading-relaxed mt-6 sm:mt-12 px-4">
              I work across AI/ML, LLMs, RAG, multi-agent systems, MCP,
              distributed architectures, cloud infrastructure, and full-stack
              engineering — turning ambitious ideas into production-grade
              systems built to scale.
            </p>
          </div>

          {/* Bottom: Wide Video Capsule */}
          <div className="relative z-30 w-full flex flex-col items-center mt-auto pt-14 sm:pt-18 md:pt-22 pb-2 sm:pb-4 pointer-events-auto">
            <div className="overlay-video-capsule-wrapper w-full flex justify-center px-2 sm:px-4">
              <Link
                href="/about"
                onClick={() => router.push("/about")}
                aria-label="Know more about me"
                className="group relative cursor-pointer block rounded-full p-[2px] hover:from-[#c5eb35]/90 hover:via-white/40 hover:to-[#c5eb35]/40 transition-all duration-500 w-full max-w-[720px] sm:max-w-[880px] md:max-w-[1020px] lg:max-w-[900px] z-30 pointer-events-auto"
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
              </Link>
            </div>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* STAGE 2 & 3 PINNED CONTAINER: PROJECTS WITH CURTAIN LIFT REVEAL     */}
        {/* ==================================================================== */}
        <div
          ref={stageContainerRef}
          id="works-stage"
          className="relative w-full h-screen overflow-hidden select-none z-20"
        >
          {/* Layer 0 (Underneath): Footer Section */}
          <Footer ref={footerRef} />

          {/* Layer 1 (On Top): Projects Panel — Slides UPWARD on scroll! */}
          <div
            ref={projectsPanelRef}
            className="absolute inset-0 w-full h-full z-20 overflow-hidden rounded-b-xl sm:rounded-b-2xl will-change-transform"
          >
            {/* Stage Background: transitions from #123826 to #eaeae8 */}
            <div
              ref={stageBgRef}
              className="absolute inset-0 w-full h-full will-change-[background-color]"
              style={{ backgroundColor: "#123826" }}
            />

            {/* Film grain noise overlay */}
            <div className="absolute inset-0 bg-noise opacity-10 pointer-events-none mix-blend-overlay" />

            {/* Centered "Projects" & "Top Loved Works" */}
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
                Top Loved Works
              </p>
            </div>

            {/* Horizontal Project Photo Cards */}
            <div
              ref={cardsTrackRef}
              className="absolute top-1/2 -translate-y-1/2 left-0 flex items-center gap-6 sm:gap-8 md:gap-9 pl-8 pr-20 z-20 will-change-transform"
            >
              {projectsData.map((project) => (
                <Link
                  key={project.id}
                  href="/work"
                  className="group relative flex-shrink-0 w-[320px] sm:w-[420px] md:w-[510px] lg:w-[610px] xl:w-[650px] h-[260px] sm:h-[320px] md:h-[380px] lg:h-[410px]  rounded-2xl sm:rounded-3xl overflow-hidden bg-transparent shadow-[0_16px_45px_rgba(0,0,0,0.12)] border border-black/10 transition-all duration-500 hover:shadow-[0_24px_55px_rgba(0,0,0,0.22)] hover:-translate-y-1.5 cursor-pointer will-change-transform block"
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
                            className="px-2.5 py-0.5 rounded-full bg-[#c5eb35] text-[10px] sm:text-[11px] font-mono font-semibold text-[#141b16] shadow-xs"
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
          </div>
        </div>
      </section>
    );
  },
);

Overlay.displayName = "Overlay";

export default Overlay;
