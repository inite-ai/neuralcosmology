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
    <section className="relative w-full h-full flex items-center justify-center px-4 bg-gradient-to-br from-[#232946] via-[#181c2e] to-[#10182a] overflow-hidden">
      {/* Cinematic light rays effect */}
      {init && (
        <Particles
          id="lectures-particles"
          options={{
            fullScreen: false,
            background: { color: "transparent" },
            fpsLimit: 60,
            particles: {
              number: { value: 120 },
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
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        />
      )}
      
      {/* Dark gradient overlay at bottom for better transition */}
      <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-[#10182a] via-[#10182a]/80 to-transparent z-10"></div>
      
      {/* Glassy cosmic card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.25, 0.4, 0.25, 1] }}
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
          borderRadius: '1rem',
          padding: '2.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}
      >
        <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-transparent bg-gradient-to-r from-blue-300 via-white to-purple-300 bg-clip-text">
          Videos / Lectures
        </h2>
        <p className="font-extrabold text-lg sm:text-xl mb-2 text-blue-100">
          You don't need more information.<br />You need alignment.
        </p>
        <p className="text-md sm:text-lg text-blue-200 mb-8">
          Watch not to learn — but to remember.
        </p>
        <Button className="mt-2 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 hover:brightness-110 text-white px-8 py-3 rounded-full border-2 border-white/20 backdrop-blur-md shadow-lg transition-all duration-300 hover:scale-105">
          Watch Lectures
        </Button>
      </motion.div>
    </section>
  );
} 