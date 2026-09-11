"use client";

import React, { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "lucide-react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

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
          className="absolute top-1/2 -translate-y-1/2 left-0 flex items-center gap-6 sm:gap-8 md:gap-10 pl-[8vw] pr-[16vw] z-20 will-change-transform"
        >
          {projectsData.map((project) => (
            <article
              key={project.id}
              className="project-card group relative flex-shrink-0 w-[290px] sm:w-[350px] md:w-[410px] lg:w-[440px] h-[430px] sm:h-[500px] md:h-[550px] rounded-[28px] sm:rounded-[36px] overflow-hidden bg-neutral-900 shadow-[0_22px_60px_rgba(0,0,0,0.18)] border border-black/10 transition-all duration-500 hover:shadow-[0_30px_70px_rgba(0,0,0,0.28)] hover:-translate-y-2 cursor-pointer will-change-transform"
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
