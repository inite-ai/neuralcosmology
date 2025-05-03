"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Particles, initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useEffect, useState } from "react";

const practices = [
  "Spot your loops.",
  "Notice the shift in resonance.",
  "Align your state before choosing.",
  "Pause before the false.",
  "Speak only when the field is listening.",
  "Return when you feel lost."
];

export default function PracticesSection() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setInit(true));
  }, []);

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-[#10182a] via-[#232946] to-[#181c2e] overflow-hidden scroll-snap-align-start">
      {/* Dense particle cloud effect */}
      {init && (
        <Particles
          id="practices-particles"
          options={{
            fullScreen: false,
            background: { color: "transparent" },
            fpsLimit: 120,
            particles: {
              number: { value: 600, density: { enable: true, area: 1000 } },
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
                outModes: { default: "out" },
                trail: {
                  enable: true,
                  length: 4,
                  fillColor: "#000"
                }
              },
              zIndex: {
                value: {
                  min: 0,
                  max: 100
                },
                opacityRate: 0.5,
                sizeRate: 1,
                velocityRate: 2
              }
            },
            detectRetina: true
          }}
          className="absolute inset-0 w-full h-full -z-20 pointer-events-none"
        />
      )}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.25, 0.4, 0.25, 1] }}
        className="relative z-10 max-w-3xl w-full bg-white/5 backdrop-blur-md border border-white/10 shadow-xl rounded-2xl p-10 flex flex-col items-center text-center"
      >
        <h2 className="text-4xl sm:text-5xl font-bold mb-8 text-transparent bg-gradient-to-r from-blue-300 via-white to-purple-300 bg-clip-text">
          Practices
        </h2>
        <div className="w-full flex flex-col gap-0.5 relative">
          {/* Subtle vertical glowing line */}
          <div className="absolute left-0 top-4 bottom-4 w-1 bg-gradient-to-b from-blue-400/10 via-purple-400/10 to-blue-400/0 rounded-full blur-[1px]" style={{left: '-16px'}} />
          {practices.map((practice, i) => (
            <div key={i} className="w-full">
              <div className="text-lg sm:text-xl font-semibold text-transparent bg-gradient-to-r from-blue-200 via-white to-purple-200 bg-clip-text py-4 px-2 text-left">
                {practice}
              </div>
              {i < practices.length - 1 && (
                <div className="w-2/3 mx-auto h-px bg-gradient-to-r from-blue-400/10 via-white/10 to-purple-400/10 blur-[1px]" />
              )}
            </div>
          ))}
        </div>
        <Button className="mt-8 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 hover:brightness-110 text-white font-bold text-lg px-8 py-3 rounded-full shadow-lg border-2 border-white/20 backdrop-blur-md">View the Practices</Button>
      </motion.div>
    </section>
  );
} 