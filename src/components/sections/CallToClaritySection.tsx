"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Particles, initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useEffect, useState } from "react";

export default function CallToClaritySection() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setInit(true));
  }, []);

  return (
    <div className="relative w-full min-h-[90vh] flex items-center justify-center px-4 bg-gradient-to-br from-[#10182a] via-[#232946] to-[#181c2e] overflow-hidden">
      {/* Cosmic portal/vortex effect */}
      {init && (
        <Particles
          id="portal-particles"
          options={{
            fullScreen: false,
            background: { color: "transparent" },
            fpsLimit: 60,
            particles: {
              number: { value: 300 },
              color: { value: ["#60a5fa", "#ffffff", "#93c5fd", "#1e40af", "#38bdf8"] },
              shape: { type: "circle" },
              opacity: { value: { min: 0.3, max: 0.9 } },
              size: { value: { min: 1.5, max: 4 } },
              move: {
                enable: true,
                speed: 2,
                direction: "none",
                random: false,
                straight: false,
                outModes: { default: "out" },
                path: {
                  enable: true,
                  delay: {
                    value: 0.1
                  },
                  options: {
                    size: 5,
                    draw: false,
                    increment: 0.001
                  },
                  generator: "curvesPathGenerator"
                },
                attract: {
                  enable: true,
                  distance: 100,
                  rotate: { x: 600, y: 1200 }
                }
              },
              zIndex: {
                value: {
                  min: 0,
                  max: 50
                },
                opacityRate: 0.5
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
      
      {/* Dark gradient overlay at bottom for better transition */}
      <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-[#10182a] via-[#10182a]/80 to-transparent z-10"></div>
      
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
          Call to clarity
        </h2>
        <p className="font-extrabold text-lg sm:text-xl mb-2 text-blue-100">
          You are not alone.<br />But those who see — speak less.
        </p>
        <p className="text-md sm:text-lg text-blue-200 mb-8">
          No community.<br />No "movement".<br />Only presence in the field.<br /><br />If this vibrates inside you —<br />you're already in the structure.<br />Act accordingly.
        </p>
        <Button className="mt-2 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 hover:brightness-110 text-white px-8 py-3 rounded-full border-2 border-white/20 backdrop-blur-md shadow-lg transition-all duration-300 hover:scale-105">
          Enter the Portal
        </Button>
      </motion.div>
    </div>
  );
} 