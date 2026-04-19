"use client";
import { motion } from "framer-motion";
import { Particles, initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useEffect, useState } from "react";

import type { SupportedLocale } from "@/lib/get-locale";
import { getDict } from "@/lib/i18n";

export default function CorePrinciplesSection({ locale }: { locale: SupportedLocale }) {
  const t = getDict(locale).home.corePrinciples;
  const axioms = t.axioms;
  const [init, setInit] = useState(false);

  useEffect(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setInit(true));
  }, []);

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-[#10182a] via-[#181c2e] to-[#232946] overflow-hidden scroll-snap-align-start">
      {/* Constellation network particle effect */}
      {init && (
        <Particles
          id="core-particles"
          options={{
            fullScreen: false,
            background: { color: "transparent" },
            fpsLimit: typeof window !== 'undefined' && window.innerWidth < 768 ? 30 : 60,
            particles: {
              number: { value: typeof window !== 'undefined' && window.innerWidth < 768 ? 30 : 70, density: { enable: true, value: 800 } },
              color: { value: ["#ffffff", "#a5b4fc", "#4f56ff", "#c4b5fd"] },
              shape: { type: "circle" },
              opacity: { value: 0.9 },
              size: { value: { min: 1.5, max: 4 } },
              move: {
                enable: true,
                speed: 0.5,
                direction: "none",
                random: false,
                straight: false,
                outModes: { default: "bounce" },
                attract: { enable: false }
              },
              links: {
                enable: true,
                distance: 180,
                color: "#6366f1",
                opacity: 0.4,
                width: 1.2,
                triangles: {
                  enable: true,
                  color: "#4f56ff",
                  opacity: 0.05
                }
              }
            },
            interactivity: {
              events: {
                onHover: {
                  enable: true,
                  mode: "grab"
                },
                onClick: {
                  enable: true,
                  mode: "push"
                }
              },
              modes: {
                grab: {
                  distance: 180,
                  links: {
                    opacity: 0.8
                  }
                },
                push: {
                  quantity: 4
                }
              }
            },
            detectRetina: true
          }}
          className="absolute inset-0 w-full h-full z-0 pointer-events-auto"
        />
      )}
      {/* Subtle cosmic timeline line */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-400/30 to-purple-400/0 opacity-40 rounded-full -z-10" />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
        className="relative z-10 max-w-3xl w-full bg-white/[0.04] backdrop-blur-xl border border-white/10 shadow-xl rounded-xl sm:rounded-2xl p-5 sm:p-8 md:p-10"
        style={{ willChange: "transform, opacity" }}
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-5 text-center text-transparent bg-gradient-to-r from-blue-300 via-white to-purple-300 bg-clip-text">
          {t.title}
        </h2>
        {axioms[0] && (
          <p className="text-sm sm:text-base md:text-lg text-blue-200/80 leading-relaxed text-center mb-6 sm:mb-8 max-w-xl mx-auto">
            {axioms[0]}
          </p>
        )}
        <ol className="w-full space-y-3 sm:space-y-4">
          {axioms.slice(1).map((axiom, i) => (
            <li
              key={i}
              className="flex gap-3 sm:gap-4 items-start text-left rounded-lg border border-white/5 bg-white/[0.02] px-3 sm:px-4 py-3 sm:py-3.5 transition-colors hover:bg-white/[0.04] hover:border-white/10"
            >
              <span className="flex-shrink-0 mt-0.5 w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-blue-300/30 bg-blue-500/10 text-blue-200/90 font-mono text-xs sm:text-sm flex items-center justify-center tracking-tight">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="flex-1 text-sm sm:text-base md:text-lg text-white/85 leading-relaxed pt-1">
                {axiom}
              </span>
            </li>
          ))}
        </ol>
      </motion.div>
    </section>
  );
} 