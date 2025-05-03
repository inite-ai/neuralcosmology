"use client";
import { motion } from "framer-motion";

const axioms = [
  "Five axioms. No debate.",
  "Consciousness is not in the brain. It unfolds space.",
  "Reality is not external. It responds to you.",
  "Memory is not a storage. It's a dynamic interface.",
  "Intent is not a wish. It's a vector that reprograms the field.",
  "Branches are real. You switch timelines by choices you barely notice."
];

export default function CorePrinciplesSection() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-[#10182a] via-[#181c2e] to-[#232946] overflow-hidden scroll-snap-align-start">
      {/* Subtle cosmic timeline line */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-400/30 to-purple-400/0 opacity-40 rounded-full -z-10" />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.25, 0.4, 0.25, 1] }}
        className="relative z-10 max-w-3xl w-full bg-white/5 backdrop-blur-md border border-white/10 shadow-xl rounded-2xl p-10 flex flex-col items-center text-center"
      >
        <h2 className="text-4xl sm:text-5xl font-bold mb-8 text-transparent bg-gradient-to-r from-blue-300 via-white to-purple-300 bg-clip-text">
          Core Principles
        </h2>
        <div className="w-full flex flex-col gap-0.5">
          {axioms.map((axiom, i) => (
            <div key={i} className="w-full">
              <div className="text-lg sm:text-xl font-semibold text-transparent bg-gradient-to-r from-blue-200 via-white to-purple-200 bg-clip-text py-4 px-2">
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