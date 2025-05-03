"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function CallToClaritySection() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-[#10182a] via-[#232946] to-[#181c2e] overflow-hidden scroll-snap-align-start">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.25, 0.4, 0.25, 1] }}
        className="relative z-10 max-w-3xl w-full rounded-2xl p-10 flex flex-col items-center text-center"
      >
        <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-transparent bg-gradient-to-r from-blue-300 via-white to-purple-300 bg-clip-text">
          Call to clarity
        </h2>
        <p className="font-extrabold text-lg sm:text-xl mb-2 text-blue-100">
          You are not alone.<br />But those who see — speak less.
        </p>
        <p className="text-md sm:text-lg text-blue-200 mb-4">
          No community.<br />No "movement".<br />Only presence in the field.<br /><br />If this vibrates inside you —<br />you're already in the structure.<br />Act accordingly.
        </p>
        <Button className="mt-2 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 hover:brightness-110 text-white px-8 py-3 rounded-full border-2 border-white/20 backdrop-blur-md">Enter the Portal</Button>
      </motion.div>
    </section>
  );
} 