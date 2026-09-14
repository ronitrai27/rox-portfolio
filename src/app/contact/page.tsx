"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, CheckCircle2, Copy, Loader2, Send } from "lucide-react";
import { NoiseBackground } from "@/components/ui/noise-background";
import RoxyChatWidget from "@/modules/roxy-agent/RoxyChatWidget";

export default function ContactPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [copied, setCopied] = useState(false);

  const directEmail = "ronitrai1237@gmail.com";

  const handleCopy = () => {
    navigator.clipboard.writeText(directEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !message.trim() || isLoading) return;

    setIsLoading(true);
    setStatus("idle");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), message: message.trim() }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || "Failed to send message. Please try again.");
      }

      setStatus("success");
      setEmail("");
      setMessage("");
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen w-full bg-[#eaeae8] text-[#141b16] flex flex-col justify-between p-6 sm:p-10 md:p-14 selection:bg-[#c5eb35] selection:text-black overflow-x-hidden">
      {/* Ask anything Tab on right edge */}
      <RoxyChatWidget positionClass="fixed right-0 top-1/2 -translate-y-1/2 z-30" />

      {/* Top Header */}
      <header className="relative z-20 w-full max-w-4xl mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 group text-[#141b16] hover:opacity-75 transition-opacity"
        >
          <span className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center group-hover:-translate-x-0.5 transition-transform">
            <ArrowLeft className="w-4 h-4" />
          </span>
          <span className="font-sans font-bold text-lg tracking-tight">ROX</span>
        </Link>

        {/* Quick Email Pill */}
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 hover:bg-white border border-black/8 shadow-xs text-xs font-semibold transition-all cursor-pointer hover:scale-102 active:scale-98"
        >
          <span className="text-[#5a625b]">{directEmail}</span>
          <span className="w-4 h-4 rounded-full bg-[#c5eb35] flex items-center justify-center text-[#141b16]">
            {copied ? (
              <CheckCircle2 className="w-3 h-3 text-[#141b16]" />
            ) : (
              <Copy className="w-2.5 h-2.5" />
            )}
          </span>
        </button>
      </header>

      {/* Center Stage: Minimal Contact Form */}
      <div className="relative z-10 w-full max-w-2xl mx-auto my-auto py-10 sm:py-14 flex flex-col items-center">
        {/* Editorial Title */}
        <div className="text-center mb-8 sm:mb-10">
          <span className="inline-block font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#5a625b] mb-3">
            • Get In Touch •
          </span>
          <h1
            style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
            className="text-5xl sm:text-6xl md:text-7xl leading-tight font-normal tracking-tight text-[#141b16]"
          >
            Let&apos;s build something <em className="italic">extraordinary.</em>
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-[#616862] max-w-md mx-auto leading-relaxed">
            Drop your email and project details below. Your message lands straight in Ronit&apos;s inbox.
          </p>
        </div>

        {/* Contact Form Card */}
        <div className="w-full bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-black/8">
          {status === "success" ? (
            <div className="py-8 flex flex-col items-center text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-[#c5eb35] flex items-center justify-center text-[#141b16] shadow-sm">
                <CheckCircle2 className="w-7 h-7 stroke-[2.2]" />
              </div>
              <h2 className="font-sans font-bold text-xl sm:text-2xl text-neutral-900 tracking-tight">
                Message Dispatched!
              </h2>
              <p className="font-sans text-xs sm:text-sm text-neutral-600 max-w-sm leading-relaxed">
                Thank you for reaching out. Ronit has received your email and will get back to you shortly.
              </p>
              <button
                type="button"
                onClick={() => setStatus("idle")}
                className="mt-4 px-6 py-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold transition-all cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              {/* Email Input */}
              <div>
                <label
                  htmlFor="email"
                  className="block font-sans text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2"
                >
                  Your Email <span className="text-emerald-700">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  disabled={isLoading}
                  className="w-full px-4 py-3 sm:py-3.5 rounded-2xl bg-neutral-50/80 border border-black/10 focus:outline-hidden focus:bg-white focus:border-[#c5eb35] focus:ring-2 focus:ring-[#c5eb35]/40 text-sm font-sans transition-all text-neutral-900 placeholder:text-neutral-400 disabled:opacity-50"
                />
              </div>

              {/* Message Input */}
              <div>
                <label
                  htmlFor="message"
                  className="block font-sans text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2"
                >
                  Message <span className="text-emerald-700">*</span>
                </label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell me about your project, idea, or inquiry..."
                  disabled={isLoading}
                  className="w-full px-4 py-3 sm:py-3.5 rounded-2xl bg-neutral-50/80 border border-black/10 focus:outline-hidden focus:bg-white focus:border-[#c5eb35] focus:ring-2 focus:ring-[#c5eb35]/40 text-sm font-sans transition-all text-neutral-900 placeholder:text-neutral-400 disabled:opacity-50 resize-none"
                />
              </div>

              {/* Error Alert */}
              {status === "error" && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                  {errorMessage}
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <NoiseBackground
                  containerClassName="w-full p-1 rounded-full"
                  gradientColors={[
                    "rgb(197, 235, 53)",
                    "rgb(181, 224, 36)",
                    "rgb(220, 252, 70)",
                  ]}
                >
                  <button
                    type="submit"
                    disabled={isLoading || !email.trim() || !message.trim()}
                    className="w-full py-3.5 sm:py-4 px-6 rounded-full bg-linear-to-r from-neutral-100 via-neutral-100 to-white hover:from-white hover:to-white text-[#141b16] font-sans font-bold text-xs sm:text-sm tracking-wide uppercase transition-all duration-150 active:scale-98 cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-[#141b16]" />
                        <span>Sending to Ronit...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send className="w-3.5 h-3.5 text-[#141b16]" />
                      </>
                    )}
                  </button>
                </NoiseBackground>
              </div>
            </form>
          )}
        </div>
      </div>

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

        <Link
          href="/about"
          className="px-4 sm:px-5 py-2 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer text-[#5a625b] hover:text-[#141b16] hover:bg-black/5"
        >
          ABOUT
        </Link>

        <button
          type="button"
          className="px-4 sm:px-5 py-2 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer bg-[#c5eb35] text-[#141b16] shadow-sm scale-[1.02]"
        >
          CONTACT
        </button>
      </nav>
    </main>
  );
}
