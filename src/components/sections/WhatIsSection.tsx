"use client";
import { motion } from "framer-motion";

export default function WhatIsSection() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-[#10182a] via-[#181c2e] to-[#232946] overflow-hidden scroll-snap-align-start">
      {/* Subtle cosmic grid overlay */}
      <div className="absolute inset-0 w-full h-full bg-[url('data:image/svg+xml;utf8,<svg width=\\'80\\' height=\\'80\\' viewBox=\\'0 0 80 80\\' fill=\\'none\\' xmlns=\\'http://www.w3.org/2000/svg\\'><rect x=\\'0.5\\' y=\\'0.5\\' width=\\'79\\' height=\\'79\\' rx=\\'7.5\\' fill=\\'none\\' stroke=\\'%233a3a7c\\' stroke-opacity=\\'0.12\\'/></svg>')] opacity-20 pointer-events-none -z-10" />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.25, 0.4, 0.25, 1] }}
        className="relative z-10 max-w-3xl w-full bg-white/5 backdrop-blur-md border border-white/10 shadow-xl rounded-2xl p-10 flex flex-col items-center text-center"
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