"use client";

import React, { forwardRef, useState } from "react";
import Image from "next/image";
import { Check, Copy } from "lucide-react";

interface FooterProps {
  className?: string;
}

const Footer = forwardRef<HTMLDivElement, FooterProps>(
  ({ className = "" }, ref) => {
    const [copied, setCopied] = useState(false);
    const email = "ronitrai1237@gmail.com";

    const handleCopyEmail = () => {
      navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    return (
      <footer
        ref={ref}
        id="footer-section"
        aria-label="Footer Section"
        className={`absolute inset-0 w-full h-full min-h-screen bg-[#123826] text-white flex flex-col justify-between p-6 sm:p-10 md:p-14 select-none overflow-hidden z-10 ${className}`}
      >
        {/* Subtle radial emerald background glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% 50%, rgba(34, 110, 72, 0.45) 0%, rgba(18, 56, 38, 0.95) 80%, #0d2e1f 100%)",
          }}
        />

        {/* Film grain noise overlay */}
        <div className="absolute inset-0 bg-noise opacity-15 pointer-events-none mix-blend-overlay" />

        {/* Top spacer */}
        <div className="w-full h-8 sm:h-12" />

        {/* Center Stage Content */}
        <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center text-center my-auto">
          {/* Main Headline with Centered Circle Photo */}
          <div className="relative flex flex-col items-center">
            {/* Top Line: White */}
            <h2 className="font-sans font-medium text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] tracking-tight text-white leading-none">
              YOU FOUND <span className="font-serif italic font-light">ME.</span>
            </h2>

            {/* Overlapping Circle Avatar */}
            <div className="relative z-20 my-[-18px] sm:my-[-26px] md:my-[-34px] w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-[3px] sm:border-4 border-[#123826] shadow-[0_10px_35px_rgba(0,0,0,0.5)] bg-neutral-900 transition-transform duration-500 hover:scale-105">
              <Image
                src="/rox_circle.png"
                alt="ROX"
                fill
                priority
                sizes="(max-width: 768px) 112px, 144px"
                className="object-cover object-center"
              />
            </div>

            {/* Bottom Line: Lemon Green */}
            <h2 className="font-sans font-medium text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] tracking-tight text-[#c5eb35] leading-none">
              NOW LET’S <span className="font-serif italic font-light">BUILD SOMETHING.</span>
            </h2>
          </div>

          {/* Email Section */}
          <div className="flex flex-col items-center mt-10 sm:mt-14">
            <span className="font-sans text-xs sm:text-sm text-neutral-300 font-normal tracking-wide">
              Drop me an email:
            </span>

            <div className="flex items-center gap-2.5 sm:gap-3 mt-2">
              <a
                href={`mailto:${email}`}
                className="font-sans font-medium text-lg sm:text-2xl md:text-3xl text-white hover:text-[#c5eb35] transition-colors tracking-tight"
              >
                {email}
              </a>

              <button
                type="button"
                onClick={handleCopyEmail}
                aria-label="Copy email address"
                title={copied ? "Copied!" : "Copy email"}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-md sm:rounded-lg bg-[#c5eb35] hover:bg-[#b5e024] text-[#141b16] flex items-center justify-center transition-all duration-200 active:scale-90 cursor-pointer shadow-sm"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
                ) : (
                  <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar: ©2026 on Left, Social Icons on Right */}
        <div className="relative z-10 w-full max-w-7xl mx-auto flex justify-between items-center pt-6 pb-2 text-xs sm:text-sm text-neutral-300">
          {/* Left: Copyright */}
          <div className="font-sans tracking-wide">
            ©2026
          </div>

          {/* Right: Social Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Instagram */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/10 hover:scale-110 transition-all text-white"
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
              className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/10 hover:scale-110 transition-all text-white"
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
              className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/10 hover:scale-110 transition-all text-white"
            >
              <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    );
  },
);

Footer.displayName = "Footer";

export default Footer;
