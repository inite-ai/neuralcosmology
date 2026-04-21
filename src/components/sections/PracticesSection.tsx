"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Particles, initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useEffect, useState } from "react";

import type { SupportedLocale } from "@/lib/get-locale";
import { getDict } from "@/lib/i18n";

export default function PracticesSection({ locale }: { locale: SupportedLocale }) {
  const t = getDict(locale).home.practices;
  const practices = t.list;
  const [init, setInit] = useState(false);

  useEffect(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setInit(true));
  }, []);

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-[#10182a] via-[#232946] to-[#181c2e] overflow-hidden">
      {/* Dense particle cloud effect */}
      {init && (
        <Particles
          id="practices-particles"
          options={{
            fullScreen: false,
            background: { color: "transparent" },
            fpsLimit: typeof window !== 'undefined' && window.innerWidth < 768 ? 30 : 60,
            particles: {
              number: { value: typeof window !== 'undefined' && window.innerWidth < 768 ? 70 : 180 },
              color: { 
                value: ["#3b82f6", "#1e40af", "#f97316", "#0c4a6e"] 
              },
              shape: { type: "circle" },
              opacity: { value: { min: 0.1, max: 0.8 } },
              size: { value: { min: 1, max: 4 } },
              move: {
                enable: true,
                speed: 1,
                direction: "none",
                random: true,
                straight: false,
                outModes: { default: "out" }
              },
              zIndex: {
                value: {
                  min: 0,
                  max: 100
                },
                opacityRate: 0.5
              }
            },
            detectRetina: true
          }}
          className="absolute inset-0 w-full h-full z-0 pointer-events-none"
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        />
      )}
      
      {/* Dark gradient overlay at bottom for better transition */}
      <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-[#10182a] via-[#10182a]/80 to-transparent z-10"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
        style={{
          position: 'relative',
          zIndex: 20,
          maxWidth: '48rem',
          width: '100%',
          margin: '0 auto',
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          borderRadius: '0.75rem',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          willChange: "transform, opacity"
        }}
        className="sm:rounded-2xl sm:p-10"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 sm:mb-8 text-transparent bg-gradient-to-r from-blue-300 via-white to-purple-300 bg-clip-text">
          {t.title}
        </h2>
        <ol className="w-full space-y-3 sm:space-y-4">
          {practices.map((practice, i) => (
            <li
              key={i}
              className="flex gap-3 sm:gap-4 items-start text-left rounded-lg border border-white/5 bg-white/[0.02] px-3 sm:px-4 py-3 sm:py-3.5 transition-colors hover:bg-white/[0.04] hover:border-white/10"
            >
              <span className="flex-shrink-0 mt-0.5 w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-purple-300/30 bg-purple-500/10 text-purple-200/90 font-mono text-xs sm:text-sm flex items-center justify-center tracking-tight">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="flex-1 text-sm sm:text-base md:text-lg text-white/85 leading-relaxed pt-1">
                {practice}
              </span>
            </li>
          ))}
        </ol>
        <Button asChild className="mt-4 sm:mt-6 md:mt-8 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 hover:brightness-110 text-white font-bold text-sm sm:text-base md:text-lg px-6 sm:px-8 py-2.5 sm:py-3 rounded-full shadow-lg border-2 border-white/20 backdrop-blur-md transition-all duration-300 hover:scale-105 touch-manipulation">
          <a href="https://t.me/neuralcosmology" target="_blank" rel="noopener noreferrer">
            {t.cta} →
          </a>
        </Button>
      </motion.div>
    </section>
  );
} 