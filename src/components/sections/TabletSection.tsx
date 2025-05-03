"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Particles, initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const commandments = [
  {
    title: "Do not create a Line",
    desc: [
      "Linear life is fiction.",
      "Every moment is a fork.",
      "Choose through awareness — not inertia."
    ]
  },
  {
    title: "Honor the Portal within",
    desc: [
      "No outer sign matters if your inner state is off.",
      "Your resonance is the gateway.",
      "You are the threshold."
    ]
  },
  {
    title: "Cleanse Memory of Noise",
    desc: [
      "You don't carry the past.",
      "You loop it.",
      "Until you extract the pattern and cut the echo."
    ]
  },
  {
    title: "Discern the Guides",
    desc: [
      "Not all who shine, lead.",
      "True guides activate your clarity.",
      "False ones amplify your confusion."
    ]
  },
  {
    title: "Break the Shell",
    desc: [
      "When it cracks — it's not failure.",
      "It's the signal.",
      "Step out before your identity becomes your tomb."
    ]
  },
  {
    title: "Hold through the Transition",
    desc: [
      "Don't rush to reconstruct.",
      "The silence after destruction is sacred.",
      "Sit in it until you hear the next signal."
    ]
  },
  {
    title: "Listen to the Repeats",
    desc: [
      "The same situation again?",
      "That's not punishment.",
      "That's precision.",
      "Resolve it — or relive it."
    ]
  },
  {
    title: "Permit the Cut",
    desc: [
      "Not all endings come with closure.",
      "Some come with clarity.",
      "Let go.",
      "Without fixing, apologizing, or performing."
    ]
  },
  {
    title: "Call yourself forth",
    desc: [
      "Your next version is waiting for your signal.",
      "Don't wait for permission.",
      "Name it.",
      "Act from it.",
      "Live into it."
    ]
  },
  {
    title: "Gather yourself — or be shattered by your own frequency",
    desc: [
      "A fractured self cannot hold a coherent field.",
      "Unify.",
      "Or disintegrate.",
      "There is no middle."
    ]
  }
];

export default function TabletSection() {
  const [active, setActive] = useState(4);
  const [init, setInit] = useState(false);
  const visibleCount = 3; // center + 2 neighbors

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setInit(true));
  }, []);

  const handlePrev = () => setActive((prev) => Math.max(prev - 1, 0));
  const handleNext = () => setActive((prev) => Math.min(prev + 1, commandments.length - 1));

  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-[#181c2e] via-[#232946] to-[#10182a] overflow-hidden scroll-snap-align-start">
      {/* Cosmic aurora/nebula effect */}
      {init && (
        <Particles
          id="tablet-particles"
          options={{
            fullScreen: false,
            background: { color: "transparent" },
            fpsLimit: 60,
            particles: {
              number: { value: 200, density: { enable: true, area: 900 } },
              color: { value: ["#a78bfa", "#818cf8", "#c084fc", "#2563eb", "#ffffff"] },
              shape: { type: "circle" },
              opacity: { value: 0.8 },
              size: { value: { min: 2, max: 12 } },
              move: {
                enable: true,
                speed: 0.5,
                direction: "none",
                random: true,
                straight: false,
                outModes: { default: "out" },
                attract: { enable: false }
              },
              life: {
                duration: { value: 5 },
                count: 1
              },
              tilt: {
                enable: true,
                value: { min: 0, max: 360 },
                animation: {
                  enable: true,
                  speed: 30
                }
              },
              roll: {
                enable: true,
                speed: 15
              },
              wobble: {
                enable: true,
                distance: 10,
                speed: 10
              }
            },
            detectRetina: true,
          }}
          className="absolute inset-0 w-full h-full z-0 pointer-events-none"
        />
      )}
      {/* Glassy cosmic slab */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.25, 0.4, 0.25, 1] }}
        className="relative z-10 max-w-4xl w-full flex flex-col items-center text-center"
      >
        <h2 className="text-4xl sm:text-5xl font-bold mb-2 text-transparent bg-gradient-to-r from-blue-300 via-white to-purple-300 bg-clip-text">
          The Neuralcosmologist's Tablet
        </h2>
        <p className="text-lg text-blue-200 mb-2 font-semibold tracking-wide">10 Commandments for Navigating a Living Reality</p>
        <p className="text-md text-blue-300/80 mb-6 italic max-w-xl mx-auto">
          This is not a doctrine.<br />This is not philosophy.<br />This is what remains when the illusions are gone.
        </p>
        <div className="relative flex items-center justify-center w-full">
          <button
            onClick={handlePrev}
            disabled={active === 0}
            className="absolute left-0 z-20 p-2 rounded-full bg-white/10 hover:bg-white/20 text-blue-200 disabled:opacity-30 disabled:pointer-events-none transition"
            aria-label="Previous"
          >
            <ChevronLeft size={32} />
          </button>
          <div className="flex items-center justify-center w-full gap-0 md:gap-8" style={{ perspective: 1200 }}>
            {commandments.map((cmd, i) => {
              // Coverflow math
              const offset = i - active;
              let scale = 0.7;
              let rotateY = 0;
              let zIndex = 10 - Math.abs(offset);
              let opacity = 0.3;
              let blur = "blur-sm";
              if (offset === 0) {
                scale = 1;
                rotateY = 0;
                opacity = 1;
                blur = "";
              } else if (Math.abs(offset) === 1) {
                scale = 0.85;
                rotateY = offset * 25;
                opacity = 0.7;
                blur = "blur-[1.5px]";
              } else if (Math.abs(offset) === 2) {
                scale = 0.7;
                rotateY = offset * 40;
                opacity = 0.3;
                blur = "blur-sm";
              }
              if (Math.abs(offset) > 2) return null;
              return (
                <motion.div
                  key={i}
                  className={`relative ${blur}`}
                  style={{
                    zIndex,
                    transform: `scale(${scale}) rotateY(${rotateY}deg)`,
                    opacity,
                    transition: "all 0.5s cubic-bezier(.25,.4,.25,1)",
                  }}
                  animate={{
                    scale,
                    rotateY,
                    opacity,
                  }}
                  transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
                >
                  <div className="min-w-[320px] max-w-xs md:min-w-[400px] md:max-w-md bg-gradient-to-br from-blue-900/40 via-white/5 to-purple-900/30 border border-blue-400/20 shadow-xl rounded-2xl p-6 flex flex-col items-start text-left backdrop-blur-md">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl font-extrabold text-blue-200 drop-shadow-md">{i + 1}.</span>
                      <span className="text-xl font-bold text-blue-100 bg-gradient-to-r from-blue-200 via-white to-purple-200 bg-clip-text text-transparent">
                        {cmd.title}
                      </span>
                    </div>
                    <ul className="pl-2 space-y-1 text-blue-200/90">
                      {cmd.desc.map((line, j) => (
                        <li key={j} className="list-disc ml-4">{line}</li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </div>
          <button
            onClick={handleNext}
            disabled={active === commandments.length - 1}
            className="absolute right-0 z-20 p-2 rounded-full bg-white/10 hover:bg-white/20 text-blue-200 disabled:opacity-30 disabled:pointer-events-none transition"
            aria-label="Next"
          >
            <ChevronRight size={32} />
          </button>
        </div>
      </motion.div>
    </section>
  );
} 