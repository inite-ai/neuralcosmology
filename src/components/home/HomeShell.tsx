"use client";
import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import HeroSection from "@/components/sections/HeroSection";
import WhatIsSection from "@/components/sections/WhatIsSection";
import CorePrinciplesSection from "@/components/sections/CorePrinciplesSection";
import TabletSection from "@/components/sections/TabletSection";
import PracticesSection from "@/components/sections/PracticesSection";
import LecturesSection from "@/components/sections/LecturesSection";
import CallToClaritySection from "@/components/sections/CallToClaritySection";
import type { SupportedLocale } from "@/lib/get-locale";
import { getDict } from "@/lib/i18n";

const sections = [
  { id: "hero", label: "Hero" },
  { id: "what-is", label: "What is it" },
  { id: "core-principles", label: "Core Principles" },
  { id: "tablet", label: "Tablet" },
  { id: "practices", label: "Practices" },
  { id: "lectures", label: "Lectures" },
  { id: "call-to-clarity", label: "Call to Clarity" },
];

function DirectionsSection({ locale }: { locale: SupportedLocale }) {
  const dict = getDict(locale);
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
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 flex flex-col items-center">
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
                  "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 25px rgba(123, 97, 255, 0.08)",
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
  );
}

function SectionNav() {
  const [activeSection, setActiveSection] = useState("hero");

  const scrollToSection = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element) {
      setActiveSection(id);
      element.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const sectionId = (e.target as HTMLElement).getAttribute("data-section-id");
        if (sectionId) scrollToSection(sectionId);
      }
    },
    [scrollToSection],
  );

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-40% 0px -40% 0px",
      threshold: 0.1,
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) sectionObserver.observe(element);
    });

    return () => {
      sectionObserver.disconnect();
    };
  }, []);

  return (
    <div className="section-nav">
      {sections.map((section) => (
        <div
          key={section.id}
          className={`section-nav-dot ${activeSection === section.id ? "active" : ""}`}
          onClick={() => scrollToSection(section.id)}
          onKeyDown={handleKeyDown}
          title={section.label}
          data-section-id={section.id}
          role="button"
          aria-label={`Go to ${section.label} section`}
          tabIndex={0}
        />
      ))}
    </div>
  );
}

export default function HomeShell({ locale }: { locale: SupportedLocale }) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "End") {
        document.getElementById("footer")?.scrollIntoView({ behavior: "smooth" });
      } else if (e.key === "Home") {
        document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <main
      className="w-full min-h-screen flex flex-col items-center relative text-white font-sans"
      id="main-container"
    >
      <SectionNav />

      <section id="hero" className="w-full min-h-screen flex items-center justify-center py-4 sm:py-0">
        <HeroSection locale={locale} />
      </section>

      <section id="directions" className="w-full min-h-screen flex items-center justify-center py-4 sm:py-0">
        <DirectionsSection locale={locale} />
      </section>

      <section id="what-is" className="w-full min-h-screen flex items-center justify-center py-4 sm:py-0">
        <WhatIsSection locale={locale} />
      </section>

      <section id="core-principles" className="w-full min-h-screen flex items-center justify-center py-4 sm:py-0">
        <CorePrinciplesSection locale={locale} />
      </section>

      <section id="tablet" className="w-full min-h-screen flex items-center justify-center py-4 sm:py-0">
        <TabletSection locale={locale} />
      </section>

      <section id="practices" className="w-full min-h-screen flex items-center justify-center py-4 sm:py-0">
        <PracticesSection locale={locale} />
      </section>

      <section id="lectures" className="w-full min-h-screen flex items-center justify-center py-4 sm:py-0">
        <LecturesSection locale={locale} />
      </section>

      <section id="call-to-clarity" className="w-full min-h-screen flex items-center justify-center py-4 sm:py-0">
        <CallToClaritySection locale={locale} />
      </section>
    </main>
  );
}
