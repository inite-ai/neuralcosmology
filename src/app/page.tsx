"use client";
import React, { ReactNode, useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import HeroSection from "@/components/sections/HeroSection";
import WhatIsSection from "@/components/sections/WhatIsSection";
import CorePrinciplesSection from "@/components/sections/CorePrinciplesSection";
import TabletSection from "@/components/sections/TabletSection";
import PracticesSection from "@/components/sections/PracticesSection";
import LecturesSection from "@/components/sections/LecturesSection";
import CallToClaritySection from "@/components/sections/CallToClaritySection";

// Deep cosmic background with stars and animated gradient
function DeepCosmicBackground() {
  return (
    <div className="fixed inset-0 -z-10 w-full h-full bg-gradient-to-br from-[#0a1026] via-[#1a1a2e] to-[#232946]">
      {/* Animated subtle gradient overlay */}
      <motion.div 
        initial={{ backgroundPosition: "0% 50%" }}
        animate={{ backgroundPosition: "100% 50%" }}
        transition={{ repeat: Infinity, duration: 24, ease: "linear" }}
        style={{ 
          backgroundSize: "200% 200%",
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          backgroundImage: "radial-gradient(ellipse at top left, #3a3a7c 40%, transparent 80%), radial-gradient(ellipse at bottom right, #7f5af0 30%, transparent 80%)",
          opacity: 0.4
        }}
      />
      {/* Stars overlay */}
      <div className="absolute inset-0 w-full h-full bg-[url('/stars.svg')] opacity-40 mix-blend-screen pointer-events-none" />
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 w-full h-full bg-[url('data:image/svg+xml;utf8,<svg width=\'80\' height=\'80\' viewBox=\'0 0 80 80\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'><rect x=\'0.5\' y=\'0.5\' width=\'79\' height=\'79\' rx=\'7.5\' fill=\'none\' stroke=\'%233a3a7c\' stroke-opacity=\'0.12\'/></svg>')] opacity-20" />
    </div>
  );
}

// Section wrapper with optional glass highlight
function Section({ children, className = "", glass = false, ...props }: { children: ReactNode; className?: string; glass?: boolean }) {
  return (
    <section className={`relative w-full flex justify-center py-16 px-4 ${className}`} {...props}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.25, 0.4, 0.25, 1] }}
        style={{ 
          position: "relative",
          zIndex: 10,
          maxWidth: "48rem",
          width: "100%",
          borderRadius: "1rem",
          padding: "2.5rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          ...(glass ? {
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
          } : {})
        }}
      >
        {children}
      </motion.div>
    </section>
  );
}

const sections = [
  { id: "hero", label: "Hero" },
  { id: "what-is", label: "What is it" },
  { id: "core-principles", label: "Core Principles" },
  { id: "tablet", label: "Tablet" },
  { id: "practices", label: "Practices" },
  { id: "lectures", label: "Lectures" },
  { id: "call-to-clarity", label: "Call to Clarity" }
];

function SectionNav() {
  const [activeSection, setActiveSection] = useState("hero");

  // Scroll to section function - define early to avoid dependency loops
  const scrollToSection = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element) {
      // Set active section immediately for better user feedback
      setActiveSection(id);
      // Smooth scroll to the section
      element.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  // Add keyboard navigation support
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const sectionId = (e.target as HTMLElement).getAttribute('data-section-id');
      if (sectionId) {
        scrollToSection(sectionId);
      }
    }
  }, [scrollToSection]);

  // Function to determine which section is in view
  const determineActiveSection = useCallback(() => {
    // Use a smaller offset from the top to detect sections sooner
    const scrollPosition = window.scrollY + (window.innerHeight * 0.2);
    
    // Find the section that's currently most visible
    for (const section of sections) {
      const element = document.getElementById(section.id);
      if (!element) continue;
      
      const rect = element.getBoundingClientRect();
      // Check if the element is significantly in view
      if (rect.top <= window.innerHeight * 0.4 && rect.bottom >= window.innerHeight * 0.3) {
        return section.id;
      }
    }
    
    // Fallback to checking based on scroll position
    for (const section of sections) {
      const element = document.getElementById(section.id);
      if (!element) continue;
      
      const { offsetTop, offsetHeight } = element;
      if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
        return section.id;
      }
    }
    
    // Default to first section if none match
    return "hero";
  }, []);

  // Update active section when scrolling
  useEffect(() => {
    const handleScroll = () => {
      const newActiveSection = determineActiveSection();
      if (newActiveSection !== activeSection) {
        setActiveSection(newActiveSection);
      }
    };

    // Call once on mount to set initial active section
    handleScroll();
    
    // Create an IntersectionObserver to observe sections
    const observerOptions = {
      root: null,
      rootMargin: "-40% 0px -40% 0px",
      threshold: 0.1
    };
    
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);
    
    // Observe all sections
    sections.forEach(section => {
      const element = document.getElementById(section.id);
      if (element) sectionObserver.observe(element);
    });
    
    // Add a scroll listener as a fallback
    let isScrolling = false;
    const scrollListener = () => {
      if (!isScrolling) {
        window.requestAnimationFrame(() => {
          handleScroll();
          isScrolling = false;
        });
        isScrolling = true;
      }
    };

    window.addEventListener("scroll", scrollListener, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", scrollListener);
      // Disconnect observer
      sections.forEach(section => {
        const element = document.getElementById(section.id);
        if (element) sectionObserver.unobserve(element);
      });
      sectionObserver.disconnect();
    };
  }, [activeSection, determineActiveSection]);

  return (
    <div className="section-nav">
      {sections.map(section => (
        <div
          key={section.id}
          className={`section-nav-dot ${activeSection === section.id ? 'active' : ''}`}
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

export default function Page() {
  // Track when user is manually scrolling vs. programmatic scrolling
  const [isUserScrolling, setIsUserScrolling] = useState(true);
  
  // Add scroll event listeners to detect manual scrolling
  useEffect(() => {
    const handleUserScroll = () => {
      if (!isUserScrolling) {
        setIsUserScrolling(true);
      }
    };
    
    window.addEventListener('wheel', handleUserScroll, { passive: true });
    window.addEventListener('touchmove', handleUserScroll, { passive: true });
    
    return () => {
      window.removeEventListener('wheel', handleUserScroll);
      window.removeEventListener('touchmove', handleUserScroll);
    };
  }, [isUserScrolling]);

  return (
    <main 
      className="min-h-screen h-screen flex flex-col items-center justify-between relative text-white font-sans overflow-y-auto scroll-snap-container"
      id="main-container"
    >
      <DeepCosmicBackground />
      <SectionNav />
      
      <section id="hero" className="w-full min-h-screen flex items-center justify-center">
        <HeroSection />
      </section>
      
      <section id="what-is" className="w-full min-h-screen flex items-center justify-center">
        <WhatIsSection />
      </section>
      
      <section id="core-principles" className="w-full min-h-screen flex items-center justify-center">
        <CorePrinciplesSection />
      </section>
      
      <section id="tablet" className="w-full min-h-screen flex items-center justify-center">
        <TabletSection />
      </section>
      
      <section id="practices" className="w-full min-h-screen flex items-center justify-center">
        <PracticesSection />
      </section>
      
      <section id="lectures" className="w-full min-h-screen flex items-center justify-center">
        <LecturesSection />
      </section>
      
      <section id="call-to-clarity" className="w-full min-h-screen flex items-center justify-center">
        <CallToClaritySection />
      </section>
      
      {/* Footer - Cosmic Closure */}
      <footer className="w-full text-center text-blue-200 py-8 text-sm opacity-90 mt-8 border-t border-blue-400/10 bg-gradient-to-t from-[#10182a]/80 via-transparent to-transparent shadow-inner backdrop-blur-md">
        <div className="font-bold tracking-widest text-blue-100/90 text-base mb-1">neuralcosmology.com</div>
        <div className="text-blue-300/80">© 2025. Presence is enough.</div>
      </footer>
    </main>
  );
}
