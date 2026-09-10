"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Hero from "../../modules/web/Hero";
import Overlay from "../../modules/web/Overlay";
import LoadingScreen from "../../modules/web/LoadingScreen";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroWrapperRef = useRef<HTMLDivElement>(null);
  const overlayWrapperRef = useRef<HTMLDivElement>(null);
  const overlaySectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (
        !containerRef.current ||
        !heroWrapperRef.current ||
        !overlayWrapperRef.current
      ) {
        return;
      }

      // Initial state: overlay starts positioned completely below viewport
      gsap.set(overlayWrapperRef.current, { yPercent: 100 });
      if (overlaySectionRef.current) {
        gsap.set(overlaySectionRef.current, {
          borderTopLeftRadius: 40,
          borderTopRightRadius: 40,
        });
      }

      // Master scroll timeline: pins hero while overlay smoothly slides over it
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=100%", // Exactly 1 viewport of scroll to complete the takeover
          pin: true,
          pinSpacing: true,
          scrub: 1, // Smooth fluid catch-up
          anticipatePin: 1,
        },
      });

      // 1. Hero goes lightly down (background behind matches hero's #eaeae8)
      tl.to(
        heroWrapperRef.current,
        {
          y: 65,
          ease: "none",
        },
        0,
      );

      // 2. Dark green overlay page comes above and completely takes over the hero
      tl.to(
        overlayWrapperRef.current,
        {
          yPercent: 0,
          ease: "none",
        },
        0,
      );

      // 3. As overlay reaches the top, flatten corners to 0 to cover whole corners completely
      if (overlaySectionRef.current) {
        tl.to(
          overlaySectionRef.current,
          {
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            ease: "power1.in",
          },
          0.5,
        );
      }
    },
    { scope: containerRef },
  );

  const handleLoadingComplete = () => {
    ScrollTrigger.refresh();
  };

  return (
    <main className="relative w-full min-h-screen bg-[#eaeae8] text-black overflow-x-hidden">
      {/* Engaging Green Lemon Loading Screen */}
      <LoadingScreen onComplete={handleLoadingComplete} />

      {/* Pinned Transition Container */}
      <div
        ref={containerRef}
        className="relative w-full h-screen overflow-hidden bg-[#eaeae8]"
      >
        {/* Hero Page (matching #eaeae8 background) */}
        <div
          ref={heroWrapperRef}
          className="absolute inset-0 w-full h-full z-10 bg-[#eaeae8] will-change-transform"
        >
          <Hero />
        </div>

        {/* Overlay Page taking over */}
        <div
          ref={overlayWrapperRef}
          className="absolute inset-0 w-full h-full z-30 will-change-transform pointer-events-auto"
        >
          <Overlay ref={overlaySectionRef} />
        </div>
      </div>
    </main>
  );
}
