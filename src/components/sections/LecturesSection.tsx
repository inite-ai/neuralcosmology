"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function LecturesSection() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-[#232946] via-[#181c2e] to-[#10182a] overflow-hidden scroll-snap-align-start">
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