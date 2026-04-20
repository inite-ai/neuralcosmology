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

export default function LecturesSection({ locale }: { locale: SupportedLocale }) {
  const t = getDict(locale).home.lectures;
  const [init, setInit] = useState(false);

  useEffect(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setInit(true));
  }, []);

  return (
    <section className="relative w-full h-full flex items-center justify-center px-4 bg-gradient-to-br from-[#232946] via-[#181c2e] to-[#10182a] overflow-hidden">
      {/* Cinematic light rays effect */}
      {init && (
        <Particles
          id="lectures-particles"
          options={{
            fullScreen: false,
            background: { color: "transparent" },
            fpsLimit: typeof window !== 'undefined' && window.innerWidth < 768 ? 30 : 60,
            particles: {
              number: { value: typeof window !== 'undefined' && window.innerWidth < 768 ? 30 : 70 },
              color: { value: ["#fcd34d", "#ffffff", "#c4b5fd"] },
              shape: { type: "circle" },
              opacity: { value: { min: 0.2, max: 0.6 } },
              size: { value: { min: 1, max: 3 } },
              move: {
                enable: true,
                speed: 0.5,
                direction: "top",
                random: true,
                straight: false,
                outModes: { default: "out" }
              }
            },
            detectRetina: true
          }}
          className="absolute inset-0 w-full h-full z-0 pointer-events-none"
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        />
      )}
      
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
        style={{
          position: "relative",
          zIndex: 20,
          maxWidth: "38rem",
          width: "100%",
          margin: "0 auto",
          willChange: "transform, opacity",
        }}
        className="text-center px-4"
      >
        <div className="text-[10px] sm:text-xs font-mono tracking-[0.3em] uppercase text-blue-300/70 mb-6 sm:mb-8">
          {t.title}
        </div>
        <div className="mx-auto mb-6 sm:mb-8 w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-dashed border-white/15 flex items-center justify-center text-white/40 text-xl sm:text-2xl">
          ◷
        </div>
        <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-white/90 mb-3 sm:mb-4 leading-tight">
          <MultiLine text={t.headline} />
        </p>
        <p className="text-sm sm:text-base text-blue-200/75 mb-6 sm:mb-8 leading-relaxed max-w-md mx-auto">
          {t.sub}
        </p>
        <Button className="bg-white/5 hover:bg-white/10 text-blue-100 text-xs sm:text-sm px-5 sm:px-6 py-2 sm:py-2.5 rounded-full border border-white/15 backdrop-blur-md transition-all duration-300 touch-manipulation">
          {t.cta} →
        </Button>
      </motion.div>
    </section>
  );
} 