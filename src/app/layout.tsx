import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { SmoothCursor } from "@/components/ui/smooth-cursor";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "ROX — Full-Stack AI Engineer",
  description:
    "Full-Stack AI Engineer & Builder architecting intelligent systems and shipping at scale.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("antialiased", "font-sans", geist.variable)}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital,wght@0,400;1,400&family=Inter:wght@300;400;500;600;700;800;900&family=Silkscreen:wght@400;700&family=Almarai:wght@300;400;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-white text-neutral-900 selection:bg-[#c5eb35] selection:text-black">
        <SmoothCursor />
        {children}
      </body>
    </html>
  );
}
