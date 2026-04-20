"use client";
import { motion } from "framer-motion";
import { Particles, initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useEffect, useState, Fragment } from "react";
import { CheckCircle2, AlertCircle, Send } from "lucide-react";
import type { SupportedLocale } from "@/lib/get-locale";
import { getDict } from "@/lib/i18n";

function MultiLine({ text }: { text: string }) {
  const parts = text.split("\n");
  return (
    <>
      {parts.map((p, i) => (
        <Fragment key={i}>
          {p}
          {i < parts.length - 1 && <br />}
        </Fragment>
      ))}
    </>
  );
}

export default function CallToClaritySection({ locale }: { locale: SupportedLocale }) {
  const t = getDict(locale).home.callToClarity;
  const f = t.form;
  const [init, setInit] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setStatus("idle");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("send failed");
      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      console.error("Contact submit error:", err);
      setStatus("error");
    } finally {
      setSubmitting(false);
      setTimeout(() => setStatus("idle"), 8000);
    }
  };

  useEffect(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setInit(true));
  }, []);

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-[#10182a] via-[#232946] to-[#181c2e] overflow-hidden">
      {/* Cosmic portal/vortex effect */}
      {init && (
        <Particles
          id="portal-particles"
          options={{
            fullScreen: false,
            background: { color: "transparent" },
            fpsLimit: typeof window !== 'undefined' && window.innerWidth < 768 ? 30 : 60,
            particles: {
              number: { value: typeof window !== 'undefined' && window.innerWidth < 768 ? 50 : 120 },
              color: { value: ["#60a5fa", "#ffffff", "#93c5fd", "#38bdf8"] },
              shape: { type: "circle" },
              opacity: { value: { min: 0.2, max: 0.7 } },
              size: { value: { min: 1, max: 3 } },
              move: {
                enable: true,
                speed: 0.6,
                direction: "none",
                random: true,
                straight: false,
                outModes: { default: "out" }
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
      
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
        style={{
          position: 'relative',
          zIndex: 20,
          maxWidth: '42rem',
          width: '100%',
          margin: '0 auto',
          background: 'rgba(255, 255, 255, 0.04)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          borderRadius: '0.75rem',
          padding: '1.75rem',
          willChange: "transform, opacity"
        }}
        className="sm:rounded-2xl sm:p-10 md:p-12"
      >
        <div className="text-[10px] sm:text-xs font-mono tracking-[0.3em] uppercase text-blue-300/70 mb-4 sm:mb-6">
          {t.title}
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold leading-tight mb-4 sm:mb-5 text-transparent bg-gradient-to-r from-blue-200 via-white to-purple-200 bg-clip-text">
          <MultiLine text={t.headline} />
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-blue-100/85 mb-6 sm:mb-8 leading-relaxed">
          <MultiLine text={t.body} />
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs text-blue-200/70 mb-1.5 tracking-wide">
                {f.name}
              </label>
              <input
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder={f.namePlaceholder}
                required
                disabled={submitting}
                className="w-full rounded-lg bg-white/[0.04] border border-white/10 focus:border-indigo-400/50 focus:bg-white/[0.06] px-3 py-2.5 text-sm text-white placeholder-white/30 outline-none transition-colors disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-xs text-blue-200/70 mb-1.5 tracking-wide">
                {f.email}
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={f.emailPlaceholder}
                required
                disabled={submitting}
                className="w-full rounded-lg bg-white/[0.04] border border-white/10 focus:border-indigo-400/50 focus:bg-white/[0.06] px-3 py-2.5 text-sm text-white placeholder-white/30 outline-none transition-colors disabled:opacity-50"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-blue-200/70 mb-1.5 tracking-wide">
              {f.message}
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder={f.messagePlaceholder}
              required
              disabled={submitting}
              rows={4}
              className="w-full rounded-lg bg-white/[0.04] border border-white/10 focus:border-indigo-400/50 focus:bg-white/[0.06] px-3 py-2.5 text-sm text-white placeholder-white/30 outline-none transition-colors disabled:opacity-50 resize-y min-h-[7rem]"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm sm:text-base px-6 sm:px-7 py-2.5 sm:py-3 rounded-full border-2 border-white/20 backdrop-blur-md shadow-lg transition-all duration-300 hover:scale-[1.02] touch-manipulation"
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{f.sending}</span>
                </>
              ) : (
                <>
                  <span>{f.submit}</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
            <div className="text-xs text-blue-300/60 font-mono">
              {f.directEmail}{" "}
              <a
                href="mailto:info@neuralcosmology.com"
                className="text-blue-300/80 hover:text-white transition-colors"
              >
                info@neuralcosmology.com
              </a>
            </div>
          </div>

          {status === "success" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-2 text-sm text-emerald-300 bg-emerald-400/10 border border-emerald-400/20 rounded-lg p-3"
            >
              <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{f.success}</span>
            </motion.div>
          )}
          {status === "error" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-2 text-sm text-rose-300 bg-rose-400/10 border border-rose-400/20 rounded-lg p-3"
            >
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{f.error}</span>
            </motion.div>
          )}
        </form>
      </motion.div>
    </div>
  );
} 