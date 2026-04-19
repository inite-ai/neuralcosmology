"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Particles, initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { SupportedLocale } from "@/lib/get-locale";
import { getDict } from "@/lib/i18n";

export default function DirectionsSection({ locale }: { locale: SupportedLocale }) {
  const dict = getDict(locale);
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setInit(true));
  }, []);

  const items = [
    {
      href: `/${locale}/books`,
      eyebrow: dict.hero.directionsEyebrow.books,
      title: dict.hero.directionsTitle.books,
      blurb: dict.hero.directionsBlurb.books,
    },
    {
      href: `/${locale}/science`,
      eyebrow: dict.hero.directionsEyebrow.science,
      title: dict.hero.directionsTitle.science,
      blurb: dict.hero.directionsBlurb.science,
    },
    {
      href: `/${locale}/essays`,
      eyebrow: dict.hero.directionsEyebrow.essays,
      title: dict.hero.directionsTitle.essays,
      blurb: dict.hero.directionsBlurb.essays,
    },
  ];

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-[#0b0a24] via-[#15132e] to-[#1c1840] overflow-hidden">
      {/* Drifting particles */}
      {init && (
        <Particles
          id="directions-particles"
          options={{
            fullScreen: false,
            background: { color: "transparent" },
            fpsLimit: typeof window !== "undefined" && window.innerWidth < 768 ? 30 : 60,
            particles: {
              number: {
                value: typeof window !== "undefined" && window.innerWidth < 768 ? 50 : 120,
              },
              color: { value: ["#a5b4fc", "#c4b5fd", "#f0abfc", "#e0e7ff", "#ffffff"] },
              shape: { type: "circle" },
              opacity: {
                value: { min: 0.15, max: 0.75 },
                animation: { enable: true, speed: 0.6, startValue: "random", sync: false },
              },
              size: {
                value: { min: 0.8, max: 3.5 },
                animation: { enable: true, speed: 2, sync: false },
              },
              move: {
                enable: true,
                speed: 0.5,
                direction: "none",
                random: true,
                straight: false,
                outModes: { default: "out" },
              },
              zIndex: { value: { min: 0, max: 40 }, opacityRate: 0.6 },
            },
            interactivity: {
              detectsOn: "canvas",
              events: { onHover: { enable: true, mode: "bubble" } },
              modes: { bubble: { distance: 160, size: 6, duration: 2, opacity: 0.9 } },
            },
            detectRetina: true,
          }}
          className="absolute inset-0 w-full h-full z-0 pointer-events-none"
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
        />
      )}

      {/* Animated nebula blobs */}
      <div className="absolute inset-0 w-full h-full opacity-60 pointer-events-none z-[1]">
        <motion.div
          animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.12, 1], x: [0, 25, 0], y: [0, -10, 0] }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
          style={{
            position: "absolute",
            top: "10%",
            left: "8%",
            width: "42%",
            height: "42%",
            borderRadius: "50%",
            background: "rgba(129, 140, 248, 0.28)",
            filter: "blur(90px)",
            willChange: "opacity, transform",
          }}
        />
        <motion.div
          animate={{ opacity: [0.2, 0.42, 0.2], scale: [1, 1.18, 1], x: [0, -20, 0], y: [0, 15, 0] }}
          transition={{ duration: 18, repeat: Infinity, repeatType: "reverse" }}
          style={{
            position: "absolute",
            bottom: "8%",
            right: "6%",
            width: "36%",
            height: "36%",
            borderRadius: "50%",
            background: "rgba(192, 132, 252, 0.26)",
            filter: "blur(80px)",
            willChange: "opacity, transform",
          }}
        />
        <motion.div
          animate={{ opacity: [0.18, 0.32, 0.18], y: [0, -20, 0] }}
          transition={{ duration: 14, repeat: Infinity, repeatType: "reverse" }}
          style={{
            position: "absolute",
            top: "40%",
            right: "28%",
            width: "22%",
            height: "22%",
            borderRadius: "50%",
            background: "rgba(244, 114, 182, 0.22)",
            filter: "blur(60px)",
            willChange: "opacity, transform",
          }}
        />
      </div>

      {/* Subtle starfield grid */}
      <div className="absolute inset-0 bg-[url('/stars.svg')] opacity-25 mix-blend-screen pointer-events-none z-[2]" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 flex flex-col items-center py-12 sm:py-20">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-12 text-center text-transparent bg-gradient-to-r from-blue-300 via-white to-purple-300 bg-clip-text"
        >
          {dict.hero.directionsSectionTitle}
        </motion.h2>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
          }}
          className="w-full grid gap-5 sm:grid-cols-3"
        >
          {items.map((item) => (
            <motion.div
              key={item.href}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.6, ease: [0.25, 0.4, 0.25, 1] },
                },
              }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group"
              style={{ willChange: "transform, opacity" }}
            >
              <Link
                href={item.href}
                className="relative block h-full p-6 sm:p-8 text-left rounded-xl sm:rounded-2xl overflow-hidden"
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  backdropFilter: "blur(16px)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  boxShadow:
                    "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 25px rgba(123, 97, 255, 0.1)",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-transparent to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-500 pointer-events-none" />
                <div className="relative">
                  <div className="text-xs uppercase tracking-[0.2em] text-blue-200/80 mb-3">
                    {item.eyebrow}
                  </div>
                  <div className="text-xl sm:text-2xl font-semibold mb-3 tracking-tight text-transparent bg-gradient-to-r from-blue-200 via-white to-purple-200 bg-clip-text">
                    {item.title}
                  </div>
                  <p className="text-sm sm:text-base text-blue-200/90 leading-relaxed">
                    {item.blurb}
                  </p>
                  <div className="mt-5 text-xs uppercase tracking-widest text-blue-300/80 group-hover:text-purple-200 transition-colors">
                    {dict.hero.exploreCta} →
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
