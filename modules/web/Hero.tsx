"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowDown, ArrowUpRight, Download } from "lucide-react";
import { NoiseBackground } from "@/components/ui/noise-background";

gsap.registerPlugin(useGSAP);

interface HeroProps {
  isLoaded?: boolean;
}

export default function Hero({ isLoaded = false }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const topNavRef = useRef<HTMLDivElement>(null);
  const title1Ref = useRef<HTMLHeadingElement>(null);
  const title2Ref = useRef<HTMLHeadingElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const bottomArrowRef = useRef<HTMLButtonElement>(null);
  const bottomSocialsRef = useRef<HTMLDivElement>(null);
  const quickInfoRef = useRef<HTMLDivElement>(null);

  // Set initial states for clean GSAP entrance
  useGSAP(
    () => {
      const safeSet = (
        targets: (Element | null | undefined)[] | Element | null | undefined,
        vars: gsap.TweenVars,
      ) => {
        const valid = Array.isArray(targets)
          ? targets.filter((el): el is Element => Boolean(el))
          : targets
            ? [targets]
            : [];
        if (valid.length > 0) {
          gsap.set(valid, vars);
        }
      };

      safeSet(topNavRef.current, { autoAlpha: 0, y: -25 });
      safeSet([title1Ref.current, title2Ref.current], { autoAlpha: 0, y: 55 });
      safeSet(taglineRef.current, { autoAlpha: 0, y: 30 });
      safeSet(imageRef.current, { autoAlpha: 0, y: 110, scale: 0.95 });
      safeSet(
        [
          bottomArrowRef.current,
          bottomSocialsRef.current,
          quickInfoRef.current,
        ],
        {
          autoAlpha: 0,
          scale: 0.85,
        },
      );
    },
    { scope: containerRef },
  );

  // Trigger smooth entrance animation as soon as the loading screen finishes
  useEffect(() => {
    if (!isLoaded) return;

    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
    });

    // 1. Top bar fades down
    if (topNavRef.current) {
      tl.to(
        topNavRef.current,
        {
          autoAlpha: 1,
          y: 0,
          duration: 1.0,
          ease: "power2.out",
        },
        0,
      );
    }

    // 2. Large Serif Italic Titles rise into place slowly
    const titles = [title1Ref.current, title2Ref.current].filter(
      (el): el is HTMLHeadingElement => Boolean(el),
    );
    if (titles.length > 0) {
      tl.to(
        titles,
        {
          autoAlpha: 1,
          y: 0,
          duration: 1.3,
          stagger: 0.18,
          ease: "power3.out",
        },
        0.1,
      );
    }

    // 3. User image rises into place from bottom with smooth fade
    if (imageRef.current) {
      tl.to(
        imageRef.current,
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 1.6,
          ease: "power2.out",
        },
        0.15,
      );
    }

    // 4. Tagline & buttons fade in
    if (taglineRef.current) {
      tl.to(
        taglineRef.current,
        {
          autoAlpha: 1,
          y: 0,
          duration: 1.2,
          ease: "power2.out",
        },
        0.35,
      );
    }

    // 5. Left circular arrow, right socials, and quick-info tab appear
    const bottomControls = [
      bottomArrowRef.current,
      bottomSocialsRef.current,
      quickInfoRef.current,
    ].filter((el): el is Element => Boolean(el));

    if (bottomControls.length > 0) {
      tl.to(
        bottomControls,
        {
          autoAlpha: 1,
          scale: 1,
          duration: 0.9,
          stagger: 0.1,
          ease: "back.out(1.4)",
        },
        0.5,
      );
    }
  }, [isLoaded]);

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full bg-[#eaeae8] text-black overflow-hidden flex flex-col justify-between px-6 py-6 select-none"
    >
      {/* Top Header Bar */}
      <header
        ref={topNavRef}
        className="relative z-30 w-full flex justify-between items-center max-w-7xl mx-auto"
      >
        {/* Name / Brand */}
        <span className="font-sans font-semibold text-lg sm:text-xl tracking-tight text-[#141b16]">
          ROX
        </span>

        {/* Contact Pill Button */}
        <button
          type="button"
          onClick={() => {
            const aboutEl = document.getElementById("about-section");
            if (aboutEl) {
              aboutEl.scrollIntoView({ behavior: "smooth" });
            }
          }}
          className="group bg-[#c5eb35] hover:bg-[#b5e024] text-[#141b16] font-sans font-semibold text-xs sm:text-sm px-6 py-2.5 rounded-full flex items-center gap-2 transition-all duration-300 shadow-sm hover:scale-105 active:scale-95 cursor-pointer"
        >
          <span>Contact</span>
          <span className="w-5 h-5 rounded-full bg-black/10 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
            <ArrowUpRight className="w-3.5 h-3.5 text-[#141b16]" />
          </span>
        </button>
      </header>

      {/* Main Center Stage */}
      <div className="relative w-full h-full! z-20">
        <h1
          ref={title1Ref}
          className="text-[112px] font-serif tracking-wider italic font-light absolute top-16 left-[40%] -translate-x-1/2 will-change-transform"
        >
          AI ENGINEER
        </h1>
        <div ref={taglineRef} className="absolute top-1/3 mt-14 left-1/2 will-change-transform">
          <h2
            ref={title2Ref}
            className="text-7xl font-sans leading-7 tracking-normal font-semibold"
          >
            & BUILDER
          </h2>
          <p className="mt-10">
            <span className="text-lg tracking-tight leading-0 font-sans font-medium">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit,
              facere! <br />
              Lorem ipsum dolor, sit amet consectetur adipisicing.
            </span>
          </p>

          <div className="flex items-center gap-3 mt-6">
            <NoiseBackground
              containerClassName="w-fit p-1 rounded-full"
              gradientColors={[
                "rgb(197, 235, 53)",
                "rgb(181, 224, 36)",
                "rgb(220, 252, 70)",
              ]}
            >
              <button
                type="button"
                className="h-full w-full cursor-pointer rounded-full bg-linear-to-r from-neutral-100 via-neutral-100 to-white px-5 py-2.5 text-xs sm:text-sm font-semibold text-black shadow-[0px_2px_0px_0px_var(--color-neutral-50)_inset,0px_0.5px_1px_0px_var(--color-neutral-400)] transition-all duration-100 active:scale-98 flex items-center gap-2"
              >
                <Download className="w-4 h-4 text-black" />
                <span>Download CV</span>
              </button>
            </NoiseBackground>

            <NoiseBackground
              containerClassName="w-fit p-1 rounded-full"
              gradientColors={[
                "rgb(197, 235, 53)",
                "rgb(181, 224, 36)",
                "rgb(220, 252, 70)",
              ]}
            >
              <button
                type="button"
                onClick={() => {
                  const worksEl = document.getElementById("works-stage");
                  if (worksEl) {
                    worksEl.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="h-full w-full cursor-pointer rounded-full bg-linear-to-r from-neutral-100 via-neutral-100 to-white px-5 py-2.5 text-xs sm:text-sm font-semibold text-black shadow-[0px_2px_0px_0px_var(--color-neutral-50)_inset,0px_0.5px_1px_0px_var(--color-neutral-400)] transition-all duration-100 active:scale-98 flex items-center gap-2"
              >
                <span>See my Blogs</span>
                <ArrowUpRight className="w-4 h-4 text-black" />
              </button>
            </NoiseBackground>
          </div>
        </div>
      </div>

      {/* User Image: Grounded at bottom of screen, positioned to the left, behind bottom controls */}
      <div
        ref={imageRef}
        className="absolute bottom-0 left-[24%] sm:left-[28%] md:left-[32%] -translate-x-1/2 z-20 w-[90vw] max-w-[380px] sm:max-w-[460px] md:max-w-[540px] lg:max-w-[620px] xl:max-w-[660px] h-[68vh] sm:h-[75vh] md:h-[78vh] lg:h-[80vh] flex items-end justify-center pointer-events-none will-change-transform"
      >
        <div className="relative w-full h-full">
          <Image
            src="/rox.png"
            alt="ROX"
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 680px"
            className="object-contain object-bottom"
          />
        </div>
      </div>

      {/* Floating Quick Info Tab (Right Screen Edge) */}
      <aside
        ref={quickInfoRef}
        aria-label="Quick Info"
        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/95 backdrop-blur-sm border-l border-y border-black/10 py-3.5 px-1.5 rounded-l-md shadow-sm flex items-center justify-center cursor-pointer hover:bg-white transition-all duration-300 group"
      >
        <span
          className="font-sans text-[11px] font-medium tracking-wider text-neutral-600 group-hover:text-black uppercase whitespace-nowrap"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          Quick info
        </span>
      </aside>

      {/* Bottom Controls Bar */}
      <footer className="relative z-30 w-full max-w-7xl mx-auto flex justify-between items-center mt-2 sm:mt-4">
        {/* Bottom Left: Circular Down Arrow Button */}
        <button
          ref={bottomArrowRef}
          type="button"
          aria-label="Scroll down"
          onClick={() =>
            window.scrollTo({
              top: window.innerHeight,
              behavior: "smooth",
            })
          }
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/90 hover:bg-white border border-black/10 shadow-sm flex items-center justify-center text-[#141b16] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
        >
          <ArrowDown className="w-4 h-4 text-[#141b16]" />
        </button>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom Right: Social Icons Matching Reference */}
        <div
          ref={bottomSocialsRef}
          className="flex items-center gap-2 sm:gap-3 text-[#141b16]"
        >
          {/* Instagram */}
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-black/5 hover:scale-110 transition-all text-[#141b16]"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </a>
          {/* Pinterest */}
          <a
            href="https://pinterest.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Pinterest"
            className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-black/5 hover:scale-110 transition-all text-[#141b16]"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.332 1.357-.053.211-.174.256-.402.154-1.498-.697-2.435-2.887-2.435-4.647 0-3.784 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
            </svg>
          </a>
          {/* X / Twitter */}
          <a
            href="https://x.com"
            target="_blank"
            rel="noreferrer"
            aria-label="X"
            className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-black/5 hover:scale-110 transition-all text-[#141b16]"
          >
            <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
        </div>
      </footer>
    </section>
  );
}
