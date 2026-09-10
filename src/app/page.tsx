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
  const heroContentRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!heroContentRef.current || !overlayRef.current) return;

    // Hero gently glides down as the overlay scrolls up over it
    gsap.to(heroContentRef.current, {
      y: 75,
      ease: "none",
      scrollTrigger: {
        trigger: overlayRef.current,
        start: "top bottom",
        end: "top top",
        scrub: true,
      },
    });
  });

  const handleLoadingComplete = () => {
    ScrollTrigger.refresh();
  };

  return (
    <main className="relative w-full bg-[#eaeae8] text-black">
      {/* Engaging Green Lemon Loading Screen */}
      <LoadingScreen onComplete={handleLoadingComplete} />

      {/* Sticky Hero Page: outer handles sticky, inner glides down smoothly without flicker */}
      <div className="sticky top-0 w-full h-screen overflow-hidden z-10 bg-[#eaeae8]">
        <div
          ref={heroContentRef}
          className="w-full h-full will-change-transform"
        >
          <Hero />
        </div>
      </div>

      {/* Overlay Section: clean rounded top gliding over hero */}
      <Overlay ref={overlayRef} className="relative z-20" />
    </main>
  );
}
