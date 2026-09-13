"use client";

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Hero from "../../modules/web/Hero";
import Overlay from "../../modules/web/Overlay";
import LoadingScreen from "../../modules/web/LoadingScreen";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Module-level variable persists across client navigation but resets on page refresh (F5)
let hasShownLoaderInSession = false;

export default function Home() {
  const heroContentRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(() => !hasShownLoaderInSession);

  // Lock scrolling while loading
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isLoading]);

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
    hasShownLoaderInSession = true;
    setIsLoading(false);
    ScrollTrigger.refresh();
  };

  return (
    <main className="relative w-full bg-[#eaeae8] text-black">
      {/* Engaging Green Lemon Loading Screen - Only on first visit */}
      {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}

      {/* Sticky Hero Page */}
      <div className="sticky top-0 w-full h-screen overflow-hidden z-10 bg-[#eaeae8]">
        <div
          ref={heroContentRef}
          className="w-full h-full will-change-transform"
        >
          <Hero isLoaded={!isLoading} />
        </div>
      </div>

      {/* Extended Overlay Section */}
      <Overlay
        ref={overlayRef}
        className="relative z-20"
      />

      {/* Floating Bottom Navigation */}
      {!isLoading && (
        <nav
          aria-label="Main Navigation"
          className="fixed bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 z-50 bg-white/95 backdrop-blur-md shadow-[0_12px_40px_rgba(0,0,0,0.18)] border border-black/8 rounded-full p-1.5 flex items-center gap-1 sm:gap-1.5 transition-all duration-300 select-none"
        >
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="px-4 sm:px-5 py-2 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer bg-[#c5eb35] text-[#141b16] shadow-sm scale-[1.02]"
          >
            HOME
          </button>

          <Link
            href="/work"
            className="px-4 sm:px-5 py-2 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer text-[#5a625b] hover:text-[#141b16] hover:bg-black/5"
          >
            WORKS
          </Link>

          <Link
            href="/about"
            className="px-4 sm:px-5 py-2 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer text-[#5a625b] hover:text-[#141b16] hover:bg-black/5"
          >
            ABOUT
          </Link>
        </nav>
      )}
    </main>
  );
}

