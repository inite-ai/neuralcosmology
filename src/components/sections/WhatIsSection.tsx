"use client";
import { motion } from "framer-motion";
import { Particles, initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useEffect, useState, useRef, Fragment } from "react";
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

export default function WhatIsSection({ locale }: { locale: SupportedLocale }) {
  const t = getDict(locale).home.whatIs;
  const [init, setInit] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setInit(true));
  }, []);

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-[#0c0c20] via-[#151530] to-[#1e1a40] overflow-hidden">
      {/* Nebula-like cosmic particles with fluid motion */}
      {init && (
        <Particles
          id="what-is-particles"
          options={{
            fullScreen: false,
            background: { color: "transparent" },
            fpsLimit: typeof window !== 'undefined' && window.innerWidth < 768 ? 30 : 60,
            particles: {
              number: { value: typeof window !== 'undefined' && window.innerWidth < 768 ? 60 : 160 },
              color: { 
                value: [
                  "#9c59ff", // bright purple
                  "#99ccff", // light blue
                  "#c991ff", // lavender
                  "#ffffff", // white
                  "#b794f6", // soft purple
                  "#b4f4ff"  // light cyan
                ] 
              },
              shape: { type: "circle" },
              opacity: { 
                value: { min: 0.1, max: 0.8 },
                animation: {
                  enable: true,
                  speed: 0.8,
                  startValue: "random",
                  sync: false
                }
              },
              size: { 
                value: { min: 1, max: 8 },
                animation: {
                  enable: true,
                  speed: 3,
                  sync: false
                }
              },
              move: {
                enable: true,
                speed: 1,
                direction: "none",
                random: true,
                straight: false,
                outModes: { default: "out" },
                path: {
                  enable: true,
                  delay: {
                    value: 0.1
                  },
                  options: {
                    size: 20,
                    draw: false,
                    increment: 0.002
                  },
                  generator: "curvesPathGenerator"
                }
              },
              rotate: {
                value: { min: 0, max: 360 },
                direction: "random",
                animation: {
                  enable: true,
                  speed: 2
                }
              },
              blur: {
                value: 1,
                enable: true
              },
              zIndex: {
                value: { min: 0, max: 100 },
                opacityRate: 0.5
              }
            },
            interactivity: {
              detectsOn: "canvas",
              events: {
                onHover: {
                  enable: true,
                  mode: "bubble"
                },
                onClick: {
                  enable: true,
                  mode: "push"
                }
              },
              modes: {
                bubble: {
                  distance: 200,
                  size: 20,
                  duration: 2,
                  opacity: 0.8
                },
                push: {
                  quantity: 6
                }
              }
            },
            detectRetina: true
          }}
          className="absolute inset-0 w-full h-full z-0 pointer-events-none"
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        />
      )}
      
      {/* Animated Nebula glow effect (reduced) */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full opacity-50 z-[5] pointer-events-none">
        <motion.div
          animate={{
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.1, 1],
            x: [0, 20, 0],
            y: [0, -10, 0]
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          style={{
            position: 'absolute',
            top: '20%',
            left: '25%',
            width: '40%',
            height: '40%',
            borderRadius: '50%',
            background: 'rgba(168, 85, 247, 0.28)',
            filter: 'blur(90px)',
            willChange: 'opacity, transform'
          }}
        />
        <motion.div
          animate={{
            opacity: [0.2, 0.4, 0.2],
            scale: [1, 1.15, 1],
            x: [0, -15, 0],
            y: [0, 15, 0]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          style={{
            position: 'absolute',
            bottom: '20%',
            right: '15%',
            width: '32%',
            height: '32%',
            borderRadius: '50%',
            background: 'rgba(96, 165, 250, 0.24)',
            filter: 'blur(70px)',
            willChange: 'opacity, transform'
          }}
        />
      </div>

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
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 25px rgba(123, 97, 255, 0.15)',
          borderRadius: '0.75rem',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          willChange: 'transform, opacity'
        }}
        className="sm:rounded-2xl sm:p-10"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 text-transparent bg-gradient-to-r from-blue-300 via-white to-purple-300 bg-clip-text">
          {t.title}
        </h2>
        <p className="font-extrabold text-base sm:text-lg md:text-xl mb-2 text-blue-100 px-2">
          <MultiLine text={t.lead1} />
        </p>
        <p className="text-sm sm:text-base md:text-lg text-blue-200 mb-3 sm:mb-4 px-2">
          <MultiLine text={t.lead2} />
        </p>
        <p className="text-sm sm:text-base md:text-lg text-blue-300/80 px-2">
          <MultiLine text={t.lead3} />
        </p>
      </motion.div>
    </section>
  );
} 