"use client";
import { motion } from "framer-motion";
import { Particles, initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useEffect, useState } from "react";

const axioms = [
  "Five axioms. No debate.",
  "Consciousness is not in the brain. It unfolds space.",
  "Reality is not external. It responds to you.",
  "Memory is not a storage. It's a dynamic interface.",
  "Intent is not a wish. It's a vector that reprograms the field.",
  "Branches are real. You switch timelines by choices you barely notice."
];

export default function CorePrinciplesSection() {
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
        className="relative z-10 max-w-3xl w-full bg-white/5 backdrop-blur-md border border-white/10 shadow-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-10 flex flex-col items-center text-center"
        style={{ willChange: "transform, opacity" }}
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 md:mb-8 text-transparent bg-gradient-to-r from-blue-300 via-white to-purple-300 bg-clip-text">
          Core Principles
        </h2>
        <div className="w-full flex flex-col gap-0.5">
          {axioms.map((axiom, i) => (
            <div key={i} className="w-full">
              <div className="text-base sm:text-lg md:text-xl font-semibold text-transparent bg-gradient-to-r from-blue-200 via-white to-purple-200 bg-clip-text py-2 sm:py-3 md:py-4 px-2">
                {axiom}
              </div>
              {i < axioms.length - 1 && (
                <div className="w-2/3 mx-auto h-px bg-gradient-to-r from-blue-400/10 via-white/10 to-purple-400/10 blur-[1px]" />
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
} 