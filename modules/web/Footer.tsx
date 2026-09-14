"use client";

import React, { forwardRef, useState } from "react";
import Image from "next/image";
import { Check, Copy } from "lucide-react";
import RoxyChatWidget from "@/modules/roxy-agent/RoxyChatWidget";

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

        {/* Ask anything Tab (Right Screen Edge) */}
        <RoxyChatWidget positionClass="absolute right-0 top-1/2 z-30" />

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
          <div className="flex items-center gap-2 sm:gap-3 text-white">
            {/* GitHub */}
            <a
              href="https://github.com/ronitrai27"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/10 hover:scale-110 transition-all text-white"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6 fill-current" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/rox-aa53a1300/"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/10 hover:scale-110 transition-all text-white"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6 fill-current" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.45 1.45 0 1 0 0-2.9 1.45 1.45 0 0 0 0 2.9m1.4 9.74V9.97H5.06v8.53h2.8z" />
              </svg>
            </a>

            {/* X / Twitter */}
            <a
              href="https://x.com/roxrai0027"
              target="_blank"
              rel="noreferrer"
              aria-label="X"
              className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/10 hover:scale-110 transition-all text-white"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24">
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
