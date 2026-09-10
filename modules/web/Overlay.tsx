"use client";

import React, { forwardRef, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface OverlayProps {
  className?: string;
  onVideoClick?: () => void;
}

const Overlay = forwardRef<HTMLDivElement, OverlayProps>(
  ({ className = "", onVideoClick }, ref) => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

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

    // GSAP animation: as this page comes into viewport, auto make text whiter one by one
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

        // Simple, performant GSAP timeline that turns text white one by one
        const textTl = gsap.timeline({ paused: true });

        // 1. Kicker appears
        textTl.to(".overlay-kicker", {
          autoAlpha: 1,
          y: 0,
          duration: 0.45,
          ease: "power2.out",
        });

        // 2. Highlights each line into pure bright white one by one
        textTl.to(
          lines,
          {
            color: "#ffffff",
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.28, // highlights one by one!
            ease: "power2.out",
          },
          "-=0.15",
        );

        // 3. Subtext smoothly appears
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

        // 4. Video capsule scales and reveals in
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

        // Trigger 1: ScrollTrigger when entering viewport
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top 75%", // as this page comes into viewport
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

        // Trigger 2: IntersectionObserver fallback for instant reliable execution
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

    return (
      <section
        ref={setRefs}
        aria-label="Overlay Section — About ROX"
        className={`relative min-h-screen w-full bg-[#123826] text-white flex flex-col justify-between items-center px-4 sm:px-6 md:px-12 py-12 sm:py-16 md:py-20 select-none overflow-hidden rounded-t-[36px] sm:rounded-t-[48px] shadow-[0_-30px_70px_rgba(0,0,0,0.55)] ${className}`}
      >
        {/* Subtle radial emerald background ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 35%, rgba(34, 110, 72, 0.4) 0%, rgba(18, 56, 38, 0.95) 75%, #0f3020 100%)",
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

        {/* Bottom: Wide Video Capsule moved to more bottom with much more width */}
        <div className="relative z-10 w-full flex flex-col items-center mt-auto pt-14 sm:pt-18 md:pt-22 pb-2 sm:pb-4">
          <div className="overlay-video-capsule-wrapper w-full flex justify-center px-2 sm:px-4">
            <button
              type="button"
              onClick={onVideoClick}
              aria-label="Know more about me reel"
              className="group relative cursor-pointer block rounded-full p-[2px]  hover:from-[#c5eb35]/90 hover:via-white/40 hover:to-[#c5eb35]/40 transition-all duration-500 w-full max-w-[720px] sm:max-w-[880px] md:max-w-[1020px] lg:max-w-[900px]"
            >
              {/* Wide Pill Container matching Image 3 with grand width */}
              <div className="relative w-full h-[105px] sm:h-[135px] md:h-[200px] lg:h-[245px] rounded-full overflow-hidden flex items-center justify-center">
                {/* Background Video Looping Muted Always */}
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

                {/* Subtle dark gradient overlay for text readability */}
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/15 transition-colors duration-500 pointer-events-none" />

                {/* Centered Overwritten Text matching Image 3 */}
                <div className="relative z-10 flex items-center justify-center gap-3 px-6 pointer-events-none select-none">
                  <span className="font-serif font-semibold text-white text-lg sm:text-2xl md:text-3xl lg:text-4xl tracking-[0.10em] sm:tracking-[0.16em] uppercase drop-shadow-[0_4px_20px_rgba(0,0,0,0.95)] transition-transform duration-300 group-hover:scale-102">
                    Know more about me
                  </span>
                </div>
              </div>
            </button>
          </div>
        </div>
      </section>
    );
  },
);

Overlay.displayName = "Overlay";

export default Overlay;
