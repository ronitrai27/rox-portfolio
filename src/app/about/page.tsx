"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import PlayfulPhysicsCanvas from "../../../modules/about/PlayfulPhysicsCanvas";
import KnowMeBetterSection from "../../../modules/about/KnowMeBetterSection";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function AboutPage() {
  const heroContentRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);

  useGSAP(() => {
    // Entrance animations for hero texts
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.from(badgeRef.current, {
      y: -20,
      opacity: 0,
      duration: 0.8,
      delay: 0.1,
    })
      .from(
        headlineRef.current,
        {
          y: 30,
          opacity: 0,
          duration: 1,
        },
        "-=0.5"
      )
      .from(
        subRef.current,
        {
          y: 20,
          opacity: 0,
          duration: 0.8,
        },
        "-=0.6"
      );

    // Parallax glide down as the "Know me better" overlay scrolls over it
    if (heroContentRef.current && overlayRef.current) {
      gsap.to(heroContentRef.current, {
        y: 85,
        ease: "none",
        scrollTrigger: {
          trigger: overlayRef.current,
          start: "top bottom",
          end: "top top",
          scrub: true,
        },
      });
    }
  });

  return (
    <main className="relative w-full bg-[#fafafa] text-[#141b16]">
      {/* Sticky Hero Section with Interactive Physics Badges */}
      <div className="sticky top-0 w-full h-screen overflow-hidden z-10 bg-[#fafafa]">
        {/* Hero Content Section (Behind the physics canvas: z-10) */}
        <div
          ref={heroContentRef}
          className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center px-6 sm:px-10 max-w-5xl mx-auto pointer-events-none mt-[-3vh] will-change-transform"
        >
          {/* Profile / Avatar Greeting Badge */}
          <div
            ref={badgeRef}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-black/8 shadow-[0_2px_12px_rgba(0,0,0,0.06)] mb-6 sm:mb-8 pointer-events-auto hover:scale-105 transition-transform duration-300"
          >
            <div className="relative w-6 h-6 rounded-full overflow-hidden border border-black/10 shrink-0">
              <Image
                src="/rox_circle.png"
                alt="Avatar"
                fill
                className="object-cover"
                priority
              />
            </div>
            <span className="text-xs sm:text-sm font-medium text-[#404741] tracking-tight">
              Hello 👋 <span className="font-semibold text-[#141b16]">I&apos;m ROX</span>
            </span>
          </div>

          {/* Big Editorial Headline */}
          <h1
            ref={headlineRef}
            style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
            className="text-[44px] sm:text-[66px] md:text-[80px] lg:text-[92px] leading-[1.06] tracking-[-0.025em] text-[#141b16] font-normal"
          >
            I design products that <em className="italic font-normal">feel</em>{" "}
            simple, even when they&apos;re not.
          </h1>

          {/* Editorial Subtitle */}
          <p
            ref={subRef}
            className="mt-6 sm:mt-8 text-sm sm:text-base md:text-lg text-[#616862] max-w-2xl leading-relaxed tracking-tight"
          >
            Currently architecting{" "}
            <strong className="font-bold text-[#141b16]">
              complex AI workflows
            </strong>{" "}
            and an autonomous multi-agent{" "}
            <strong className="font-bold text-[#141b16]">
              design &amp; engineering system
            </strong>
            .
          </p>
        </div>

        {/* Interactive 2D Rigid-Body Physics Simulation (On Top of Text: z-20) */}
        <PlayfulPhysicsCanvas className="z-20" />
      </div>

      {/* "Know me better" Overlay Section that glides over the hero */}
      <KnowMeBetterSection ref={overlayRef} className="relative z-20" />

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

        <Link
          href="/work"
          className="px-4 sm:px-5 py-2 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer text-[#5a625b] hover:text-[#141b16] hover:bg-black/5"
        >
          WORKS
        </Link>

        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="px-4 sm:px-5 py-2 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer bg-[#c5eb35] text-[#141b16] shadow-sm scale-[1.02]"
        >
          ABOUT
        </button>
      </nav>
    </main>
  );
}
