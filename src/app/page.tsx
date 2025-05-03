"use client";
import React, { ReactNode } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import HeroSection from "@/components/sections/HeroSection";
import WhatIsSection from "@/components/sections/WhatIsSection";
import CorePrinciplesSection from "@/components/sections/CorePrinciplesSection";
import TabletSection from "@/components/sections/TabletSection";
import PracticesSection from "@/components/sections/PracticesSection";
import LecturesSection from "@/components/sections/LecturesSection";
import CallToClaritySection from "@/components/sections/CallToClaritySection";

// Deep cosmic background with stars and animated gradient
function DeepCosmicBackground() {
  return (
    <div className="fixed inset-0 -z-10 w-full h-full bg-gradient-to-br from-[#0a1026] via-[#1a1a2e] to-[#232946]">
      {/* Animated subtle gradient overlay */}
      <motion.div
        initial={{ backgroundPosition: "0% 50%" }}
        animate={{ backgroundPosition: "100% 50%" }}
        transition={{ repeat: Infinity, duration: 24, ease: "linear" }}
        className="absolute inset-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_#3a3a7c_40%,_transparent_80%),radial-gradient(ellipse_at_bottom_right,_#7f5af0_30%,_transparent_80%)] opacity-40"
        style={{ backgroundSize: "200% 200%" }}
      />
      {/* Stars overlay */}
      <div className="absolute inset-0 w-full h-full bg-[url('/stars.svg')] opacity-40 mix-blend-screen pointer-events-none" />
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 w-full h-full bg-[url('data:image/svg+xml;utf8,<svg width=\'80\' height=\'80\' viewBox=\'0 0 80 80\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'><rect x=\'0.5\' y=\'0.5\' width=\'79\' height=\'79\' rx=\'7.5\' fill=\'none\' stroke=\'%233a3a7c\' stroke-opacity=\'0.12\'/></svg>')] opacity-20" />
    </div>
  );
}

// Section wrapper with optional glass highlight
function Section({ children, className = "", glass = false, ...props }: { children: ReactNode; className?: string; glass?: boolean }) {
  return (
    <section className={`relative w-full flex justify-center py-16 px-4 ${className}`} {...props}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.25, 0.4, 0.25, 1] }}
        className={`relative z-10 max-w-3xl w-full ${glass ? "bg-white/5 backdrop-blur-md border border-white/10 shadow-xl" : ""} rounded-2xl p-10 flex flex-col items-center text-center`}
      >
        {children}
      </motion.div>
    </section>
  );
}

export default function Page() {
  return (
    <main className="min-h-screen h-screen flex flex-col items-center justify-between relative text-white font-sans overflow-y-auto scroll-snap-y-mandatory">
      <DeepCosmicBackground />
      <HeroSection />
      <WhatIsSection />
      <CorePrinciplesSection />
      <TabletSection />
      <PracticesSection />
      <LecturesSection />
      <CallToClaritySection />
      {/* Footer - Cosmic Closure */}
      <footer className="w-full text-center text-blue-200 py-8 text-sm opacity-90 mt-8 bg-gradient-to-t from-[#10182a]/90 via-[#181c2e]/80 to-transparent shadow-none backdrop-blur-md">
        <div className="font-bold tracking-widest text-blue-100/90 text-base mb-1">neuralcosmology.com</div>
        <div className="text-blue-300/80">© 2025. Presence is enough.</div>
      </footer>
    </main>
  );
}
