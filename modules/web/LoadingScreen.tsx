"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface LoadingScreenProps {
  onComplete?: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const centerContentRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  const [typedText, setTypedText] = useState("");
  const [isDone, setIsDone] = useState(false);

  const fullText = "Hy I'm ROX";

  // Prevent scroll and scrollbar while loading
  useEffect(() => {
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
    };
  }, []);

  // Typewriter effect in center
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index++;
      setTypedText(fullText.slice(0, index));
      if (index >= fullText.length) {
        clearInterval(interval);
      }
    }, 120);

    return () => clearInterval(interval);
  }, []);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        onComplete: () => {
          setIsDone(true);
          if (onComplete) onComplete();
        },
      });

      const counter = { val: 0 };

      // 1. Number loading smoothly from 0 to 99
      tl.to(counter, {
        val: 99,
        duration: 2.7,
        ease: "power1.inOut",
        onUpdate: () => {
          if (numberRef.current) {
            numberRef.current.textContent = Math.floor(counter.val).toString();
          }
        },
      })
        // 2. Hit 100 right after 99
        .to(counter, {
          val: 100,
          duration: 0.18,
          ease: "none",
          onUpdate: () => {
            if (numberRef.current) {
              numberRef.current.textContent = "100";
            }
          },
        })
        // 3. Brief micro-pause at 100 so it registers cleanly
        .to({}, { duration: 0.25 })
        // 4. Subtle center content lift right before swipe
        .to(
          [centerContentRef.current, footerRef.current],
          {
            y: -25,
            opacity: 0.6,
            duration: 0.45,
            ease: "power2.in",
          },
          "-=0.1",
        )
        // 5. Swipe up smoothly
        .to(
          containerRef.current,
          {
            yPercent: -100,
            duration: 1.0,
            ease: "power4.inOut",
          },
          "-=0.15",
        );
    },
    { scope: containerRef },
  );

  if (isDone) return null;

  return (
    <aside
      ref={containerRef}
      aria-label="Loading Screen"
      className="fixed inset-0 z-50 w-screen h-screen bg-[#c5eb35] text-[#121814] flex flex-col justify-between p-8 sm:p-12 md:p-16 select-none overflow-hidden touch-none"
      style={{ willChange: "transform" }}
    >
      {/* Subtle background noise texture */}
      <div className="absolute inset-0 bg-noise opacity-[0.05] pointer-events-none" />

      {/* Top spacer (top text removed as requested) */}
      <div className="w-full h-8" />

      {/* Center Section: "Hy I'm ROX" (Instrument Serif) */}
      <main
        ref={centerContentRef}
        className="relative z-10 my-auto flex flex-col items-center justify-center text-center px-4"
      >
        <div className="flex items-center justify-center flex-wrap">
          <h1 className="font-serif text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] tracking-tight text-black leading-none">
            {typedText}
          </h1>

          {/* Typewriter cursor */}
          <span
            className="inline-block w-3 h-12 sm:w-4 sm:h-16 md:w-5 md:h-20 lg:w-6 lg:h-24 bg-[#121814] animate-[pulse_0.75s_infinite] ml-2 align-middle"
            style={{ verticalAlign: "middle" }}
          />
        </div>

        {/* Subtitle in Inter (rest font) */}
        <p className="font-sans font-medium text-xs sm:text-sm md:text-base text-[#121814]/75 mt-6 tracking-widest uppercase">
          AI Engineer &amp; Builder
        </p>
      </main>

      {/* Bottom Footer: Number loading in Silk, status in Inter (No progress bar) */}
      <footer
        ref={footerRef}
        className="relative z-10 w-full flex justify-between items-end"
      >
        {/* Status in Inter */}
        <div className="font-sans text-xs sm:text-sm font-medium tracking-wide text-black">
          Loading Experience
        </div>

        {/* Number in Silkscreen (0 to 99, hits 100, then swipes up) */}
        <div className="text-right">
          <span
            ref={numberRef}
            className="font-silkscreen text-3xl sm:text-5xl md:text-6xl text-[#121814] font-bold tracking-tight block leading-none"
          >
            0
          </span>
        </div>
      </footer>
    </aside>
  );
}
