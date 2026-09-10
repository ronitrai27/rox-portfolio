"use client";

import React, { forwardRef } from "react";

interface OverlayProps {
  className?: string;
}

const Overlay = forwardRef<HTMLDivElement, OverlayProps>(
  ({ className = "" }, ref) => {
    return (
      <section
        ref={ref}
        aria-label="Overlay Section"
        className={`relative h-screen w-full bg-[#123826] text-white overflow-hidden shadow-[0_-25px_60px_rgba(0,0,0,0.35)] select-none ${className}`}
        style={{
          borderTopLeftRadius: "40px",
          borderTopRightRadius: "40px",
        }}
      >
        {/* Empty dark green section */}
      </section>
    );
  },
);

Overlay.displayName = "Overlay";

export default Overlay;
