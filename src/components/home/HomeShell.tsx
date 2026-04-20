"use client";
import React, { useEffect, useState, useCallback } from "react";
import HeroSection from "@/components/sections/HeroSection";
import WhatIsSection from "@/components/sections/WhatIsSection";
import CorePrinciplesSection from "@/components/sections/CorePrinciplesSection";
import TabletSection from "@/components/sections/TabletSection";
import PracticesSection from "@/components/sections/PracticesSection";
import LecturesSection from "@/components/sections/LecturesSection";
import CallToClaritySection from "@/components/sections/CallToClaritySection";
import DirectionsSection from "@/components/sections/DirectionsSection";
import type { SupportedLocale } from "@/lib/get-locale";

const sections = [
  { id: "hero", label: "Hero" },
  { id: "directions", label: "Directions" },
  { id: "what-is", label: "What is it" },
  { id: "core-principles", label: "Core Principles" },
  { id: "tablet", label: "Tablet" },
  { id: "practices", label: "Practices" },
  { id: "lectures", label: "Lectures" },
  { id: "call-to-clarity", label: "Call to Clarity" },
];

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

export type RecentLecture = {
  slug: string;
  title: string;
  date: string;
  durationMinutes?: number;
  thumbnail: string | null;
};

export default function HomeShell({
  locale,
  recentLectures = [],
}: {
  locale: SupportedLocale;
  recentLectures?: RecentLecture[];
}) {
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
        <LecturesSection locale={locale} recent={recentLectures} />
      </section>

      <section id="call-to-clarity" className="w-full min-h-screen flex items-center justify-center py-4 sm:py-0">
        <CallToClaritySection locale={locale} />
      </section>
    </main>
  );
}
