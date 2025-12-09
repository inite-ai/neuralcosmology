"use client";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Particles, initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useEffect, useState } from "react";

export default function HeroSection() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    // Reduce particles on mobile for better performance
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setInit(true));
  }, []);

  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center px-4 text-center overflow-hidden bg-gradient-to-br from-[#0a1026] via-[#1a1a2e] to-[#232946] scroll-snap-align-start">
      {/* Animated cosmic particle background */}
      {init && (
        <Particles
          id="hero-particles"
          options={{
            fullScreen: false,
            background: { color: "transparent" },
            fpsLimit: typeof window !== 'undefined' && window.innerWidth < 768 ? 30 : 60,
            particles: {
              number: { 
                value: typeof window !== 'undefined' && window.innerWidth < 768 ? 100 : 300, 
                density: { enable: true, area: 800 } 
              },
              color: { value: ["#8a7ffa", "#4c6bff", "#ffffff", "#c89bff"] },
              shape: { type: "circle" },
              opacity: { 
                value: 0.8,
                animation: { enable: true, speed: 0.5, sync: false }
              },
              size: { 
                value: { min: 1, max: 6 },
                animation: { enable: true, speed: 1, sync: false }
              },
              move: {
                enable: true,
                speed: typeof window !== 'undefined' && window.innerWidth < 768 ? 0.5 : 0.8,
                direction: "none",
                random: true,
                straight: false,
                outModes: { default: "out" },
                attract: { enable: true, rotate: 500 }
              },
              links: {
                enable: typeof window !== 'undefined' && window.innerWidth >= 768,
                distance: 150,
                color: "#8a7ffa",
                opacity: 0.3,
                width: 1
              },
              twinkle: {
                particles: {
                  enable: typeof window !== 'undefined' && window.innerWidth >= 768,
                  frequency: 0.05,
                  opacity: 1
                }
              }
            },
            detectRetina: true
          }}
          className="absolute inset-0 w-full h-full z-0 pointer-events-none"
        />
      )}
      {/* Animated cosmic gradient overlay */}
      <motion.div
        initial={{ backgroundPosition: "0% 50%" }}
        animate={{ backgroundPosition: "100% 50%" }}
        transition={{ repeat: Infinity, duration: 24, ease: "linear" }}
        className="absolute inset-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_#3a3a7c_40%,_transparent_80%),radial-gradient(ellipse_at_bottom_right,_#7f5af0_30%,_transparent_80%)] opacity-40 -z-10"
        style={{ backgroundSize: "200% 200%", willChange: "background-position" }}
      />
      {/* Stars overlay */}
      <div className="absolute inset-0 w-full h-full bg-[url('/stars.svg')] opacity-40 mix-blend-screen pointer-events-none -z-10" />
      {/* Animated orbit lines */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none -z-10 hidden sm:block">
        <div className="w-[300px] h-[300px] sm:w-[600px] sm:h-[600px] border border-blue-400/10 rounded-full absolute animate-spin-slow" />
        <div className="w-[200px] h-[200px] sm:w-[400px] sm:h-[400px] border border-purple-400/10 rounded-full absolute animate-spin-reverse-slower" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
        className="relative z-10 flex flex-col items-center gap-4 sm:gap-8 px-4"
        style={{ willChange: "transform, opacity" }}
      >
        <Badge variant="outline" className="mb-2 text-xs sm:text-base px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 border-white/20 text-blue-200 shadow-lg tracking-widest uppercase">
          neuralcosmology.com
        </Badge>
        <h1 className="text-4xl sm:text-6xl md:text-8xl font-extrabold tracking-tight text-transparent bg-gradient-to-r from-blue-300 via-white to-purple-400 bg-clip-text drop-shadow-[0_8px_32px_rgba(60,60,180,0.25)] leading-tight">
          Neuralcosmology
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-lg sm:text-2xl md:text-3xl max-w-2xl mx-auto text-blue-100 font-medium drop-shadow-lg px-2"
        >
          You're not in the world. You are the structure.
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-sm sm:text-lg md:text-xl max-w-xl mx-auto text-blue-200 font-normal mt-2 px-2"
        >
          A new layer of perception. A system of reality navigation through states, memory, and attention.<br />
          <span className="block mt-2 text-blue-300/80">No fluff. No mysticism. Just presence, pattern, and decision.</span>
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <Button size="lg" className="mt-4 sm:mt-6 shadow-xl bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 hover:brightness-110 text-white text-sm sm:text-lg px-6 sm:px-10 py-3 sm:py-4 rounded-full border-2 border-white/20 backdrop-blur-md touch-manipulation">
            Enter the Line
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
} 