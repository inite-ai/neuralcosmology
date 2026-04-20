"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Particles, initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useEffect, useState, Fragment } from "react";
import type { SupportedLocale } from "@/lib/get-locale";
import { getDict } from "@/lib/i18n";

function MultiLine({ text }: { text: string }) {
  const parts = text.split("\n");
  return (
    <>
      {parts.map((p, i) => (
        <Fragment key={i}>
          {p}
          {i < parts.length - 1 && <br />}
        </Fragment>
      ))}
    </>
  );
}

export default function CallToClaritySection({ locale }: { locale: SupportedLocale }) {
  const t = getDict(locale).home.callToClarity;
  const [init, setInit] = useState(false);

  useEffect(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setInit(true));
  }, []);

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-[#10182a] via-[#232946] to-[#181c2e] overflow-hidden">
      {/* Cosmic portal/vortex effect */}
      {init && (
        <Particles
          id="portal-particles"
          options={{
            fullScreen: false,
            background: { color: "transparent" },
            fpsLimit: typeof window !== 'undefined' && window.innerWidth < 768 ? 30 : 60,
            particles: {
              number: { value: typeof window !== 'undefined' && window.innerWidth < 768 ? 50 : 120 },
              color: { value: ["#60a5fa", "#ffffff", "#93c5fd", "#38bdf8"] },
              shape: { type: "circle" },
              opacity: { value: { min: 0.2, max: 0.7 } },
              size: { value: { min: 1, max: 3 } },
              move: {
                enable: true,
                speed: 0.6,
                direction: "none",
                random: true,
                straight: false,
                outModes: { default: "out" }
              }
            },
            interactivity: {
              events: {
                onHover: {
                  enable: true,
                  mode: "repulse"
                },
                onClick: {
                  enable: true,
                  mode: "push"
                }
              },
              modes: {
                repulse: {
                  distance: 150
                },
                push: {
                  quantity: 10
                }
              }
            },
            detectRetina: true
          }}
          className="absolute inset-0 w-full h-full z-0 pointer-events-auto"
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        />
      )}
      
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
        style={{
          position: 'relative',
          zIndex: 20,
          maxWidth: '42rem',
          width: '100%',
          margin: '0 auto',
          background: 'rgba(255, 255, 255, 0.04)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          borderRadius: '0.75rem',
          padding: '1.75rem',
          willChange: "transform, opacity"
        }}
        className="sm:rounded-2xl sm:p-10 md:p-12"
      >
        <div className="text-[10px] sm:text-xs font-mono tracking-[0.3em] uppercase text-blue-300/70 mb-4 sm:mb-6">
          {t.title}
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold leading-tight mb-4 sm:mb-5 text-transparent bg-gradient-to-r from-blue-200 via-white to-purple-200 bg-clip-text">
          <MultiLine text={t.headline} />
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-blue-100/85 mb-6 sm:mb-8 leading-relaxed">
          <MultiLine text={t.body} />
        </p>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
          <Button asChild className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 hover:brightness-110 text-white text-sm sm:text-base px-6 sm:px-8 py-2.5 sm:py-3 rounded-full border-2 border-white/20 backdrop-blur-md shadow-lg transition-all duration-300 hover:scale-[1.03] touch-manipulation">
            <a href="mailto:info@neuralcosmology.com">{t.cta} →</a>
          </Button>
          <a
            href="mailto:info@neuralcosmology.com"
            className="text-xs sm:text-sm font-mono text-blue-300/70 hover:text-white transition-colors tracking-tight"
          >
            info@neuralcosmology.com
          </a>
        </div>
      </motion.div>
    </div>
  );
} 