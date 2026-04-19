"use client";
import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
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
    <div className="w-full max-w-6xl mx-auto grid gap-5 sm:grid-cols-3 px-4 sm:px-0">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="group rounded-2xl border border-white/10 bg-white/5 hover:bg-white/[0.08] hover:border-white/20 transition-colors p-6 text-left"
        >
          <div className="text-xs uppercase tracking-[0.2em] text-indigo-300/80 mb-2">
            {item.eyebrow}
          </div>
          <div className="text-lg font-semibold text-white mb-2 tracking-tight">
            {item.title}
          </div>
          <p className="text-sm text-white/70 leading-relaxed">{item.blurb}</p>
          <div className="mt-4 text-xs text-indigo-300/80 group-hover:text-indigo-200 transition-colors">
            {dict.hero.exploreCta} →
          </div>
        </Link>
      ))}
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
        <HeroSection />
      </section>

      <section id="directions" className="w-full py-16 sm:py-24 flex items-center justify-center">
        <DirectionsSection locale={locale} />
      </section>

      <section id="what-is" className="w-full min-h-screen flex items-center justify-center py-4 sm:py-0">
        <WhatIsSection />
      </section>

      <section id="core-principles" className="w-full min-h-screen flex items-center justify-center py-4 sm:py-0">
        <CorePrinciplesSection />
      </section>

      <section id="tablet" className="w-full min-h-screen flex items-center justify-center py-4 sm:py-0">
        <TabletSection />
      </section>

      <section id="practices" className="w-full min-h-screen flex items-center justify-center py-4 sm:py-0">
        <PracticesSection />
      </section>

      <section id="lectures" className="w-full min-h-screen flex items-center justify-center py-4 sm:py-0">
        <LecturesSection />
      </section>

      <section id="call-to-clarity" className="w-full min-h-screen flex items-center justify-center py-4 sm:py-0">
        <CallToClaritySection />
      </section>
    </main>
  );
}
