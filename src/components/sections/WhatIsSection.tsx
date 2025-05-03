"use client";
import { motion } from "framer-motion";
import { Particles, initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useEffect, useState, useRef } from "react";

export default function WhatIsSection() {
  const [init, setInit] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
            fpsLimit: 60,
            particles: {
              number: { value: 160 },
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
      
      {/* Animated cosmic dust overlay */}
      <motion.div 
        initial={{ opacity: 0.1 }}
        animate={{ 
          opacity: [0.1, 0.2, 0.1],
          backgroundPosition: ["0% 0%", "100% 100%"]
        }}
        transition={{ 
          duration: 25, 
          repeat: Infinity, 
          repeatType: "reverse" 
        }}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 5,
          mixBlendMode: 'screen',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 0.4 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: '150% 150%'
        }}
      />
      
      {/* Animated Star field overlay */}
      <motion.div 
        initial={{ opacity: 0.2 }}
        animate={{ 
          opacity: [0.2, 0.4, 0.2],
          scale: [1, 1.05, 1],
          rotate: [0, 1, 0]
        }}
        transition={{ 
          duration: 20, 
          repeat: Infinity, 
          repeatType: "reverse" 
        }}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'black',
          opacity: 0.3,
          zIndex: 5,
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          transformOrigin: 'center'
        }}
      />
      
      {/* Animated Nebula glow effect */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full opacity-40 z-5">
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
            top: '25%',
            left: '33%',
            width: '33%',
            height: '33%',
            borderRadius: '50%',
            background: 'rgba(168, 85, 247, 0.3)',
            filter: 'blur(80px)'
          }}
        />
        <motion.div 
          animate={{ 
            opacity: [0.2, 0.4, 0.2],
            scale: [1, 1.15, 1],
            x: [0, -15, 0],
            y: [0, 15, 0],
            filter: ["hue-rotate(0deg)", "hue-rotate(15deg)", "hue-rotate(0deg)"]
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity, 
            repeatType: "reverse" 
          }}
          style={{
            position: 'absolute',
            bottom: '33%',
            right: '25%',
            width: '25%',
            height: '25%',
            borderRadius: '50%',
            background: 'rgba(96, 165, 250, 0.3)',
            filter: 'blur(60px)'
          }}
        />
        <motion.div 
          animate={{ 
            opacity: [0.3, 0.5, 0.3],
            y: [0, -15, 0],
            filter: ["hue-rotate(0deg)", "hue-rotate(-15deg)", "hue-rotate(0deg)"]
          }}
          transition={{ 
            duration: 12, 
            repeat: Infinity, 
            repeatType: "reverse" 
          }}
          style={{
            position: 'absolute',
            top: '50%',
            right: '33%',
            width: '20%',
            height: '20%',
            borderRadius: '50%',
            background: 'rgba(99, 102, 241, 0.3)',
            filter: 'blur(50px)'
          }}
        />
        <motion.div 
          animate={{ 
            opacity: [0.2, 0.4, 0.2],
            scale: [1, 1.2, 1],
            x: [0, 10, 0],
            filter: ["hue-rotate(0deg)", "hue-rotate(30deg)", "hue-rotate(0deg)"]
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            repeatType: "reverse" 
          }}
          style={{
            position: 'absolute',
            bottom: '50%',
            left: '25%',
            width: '16.6%',
            height: '16.6%',
            borderRadius: '50%',
            background: 'rgba(34, 211, 238, 0.2)',
            filter: 'blur(40px)'
          }}
        />
        <motion.div 
          animate={{ 
            opacity: [0.1, 0.2, 0.1],
            rotate: [0, 360],
            scale: [0.95, 1.05, 0.95]
          }}
          transition={{ 
            duration: 60, 
            repeat: Infinity, 
            repeatType: "loop" 
          }}
          style={{
            position: 'absolute',
            top: '33%',
            right: '25%',
            width: '40%',
            height: '40%',
            borderRadius: '50%',
            background: 'rgba(217, 70, 239, 0.1)',
            filter: 'blur(100px)'
          }}
        />
      </div>
      
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
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 25px rgba(123, 97, 255, 0.15)',
          borderRadius: '1rem',
          padding: '2.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}
      >
        <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-transparent bg-gradient-to-r from-blue-300 via-white to-purple-300 bg-clip-text">
          What is it
        </h2>
        <p className="font-extrabold text-lg sm:text-xl mb-2 text-blue-100">
          Neuralcosmology is not a belief.<br />It's a recognition.
        </p>
        <p className="text-md sm:text-lg text-blue-200 mb-4">
          It's what happens when you stop pretending the world is linear.<br />When you realize every "coincidence" is a signal, every emotion a coordinate, and every repeated situation — a branching point you missed.
        </p>
        <p className="text-md sm:text-lg text-blue-300/80">
          Neuralcosmology is a living philosophy.<br />Built not on theories — but on resonance.
        </p>
      </motion.div>
    </section>
  );
} 