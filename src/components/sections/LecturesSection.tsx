"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Particles, initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useEffect, useState } from "react";

export default function LecturesSection() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setInit(true));
  }, []);

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-[#232946] via-[#181c2e] to-[#10182a] overflow-hidden scroll-snap-align-start">
      {/* Cinematic light rays effect */}
      {init && (
        <Particles
          id="lectures-particles"
          options={{
            fullScreen: false,
            background: { color: "transparent" },
            fpsLimit: 60,
            particles: {
              number: { value: 120, density: { enable: true, area: 800 } },
              color: { value: ["#fcd34d", "#ffffff", "#f0c2a3", "#c4b5fd", "#ffe4c4"] },
              shape: { type: "circle" },
              opacity: { 
                value: 0.9,
                animation: {
                  enable: true,
                  speed: 0.5,
                  sync: false
                }
              },
              size: { 
                value: { min: 2, max: 12 },
                animation: {
                  enable: true,
                  speed: 6,
                  sync: false
                }
              },
              move: {
                enable: true,
                speed: 1.5,
                direction: "top",
                random: true,
                straight: false,
                outModes: { default: "out" }
              },
              tilt: {
                enable: true,
                value: { min: 0, max: 360 },
                animation: {
                  enable: true,
                  speed: 30
                }
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
        />
      )}
      {/* Glassy cosmic card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.25, 0.4, 0.25, 1] }}
        className="relative z-10 max-w-3xl w-full bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl rounded-2xl p-10 flex flex-col items-center text-center"
      >
        <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-transparent bg-gradient-to-r from-blue-300 via-white to-purple-300 bg-clip-text">
          Videos / Lectures
        </h2>
        <p className="font-extrabold text-lg sm:text-xl mb-2 text-blue-100">
          You don't need more information.<br />You need alignment.
        </p>
        <p className="text-md sm:text-lg text-blue-200 mb-4">
          Watch not to learn — but to remember.
        </p>
        <Button className="mt-2 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 hover:brightness-110 text-white px-8 py-3 rounded-full border-2 border-white/20 backdrop-blur-md">Watch Lectures</Button>
      </motion.div>
    </section>
  );
} 