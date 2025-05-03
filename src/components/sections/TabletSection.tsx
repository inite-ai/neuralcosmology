"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { initParticlesEngine } from "@tsparticles/react";
import { Engine } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";

// Particle configuration
const particlesConfig = {
  fullScreen: false,
  background: { color: "transparent" },
  fpsLimit: 60,
  particles: {
    number: { value: 200 },
    color: { value: ["#a78bfa", "#818cf8", "#c084fc", "#2563eb", "#ffffff"] },
    shape: { type: "circle" },
    opacity: { value: 0.8 },
    size: { value: { min: 2, max: 12 } },
    move: {
      enable: true,
      speed: 0.5,
      direction: "none" as const,
      random: true,
      straight: false,
      outModes: { default: "out" as const },
      attract: { enable: false }
    },
    life: {
      duration: { value: 5 },
      count: 1
    },
    tilt: {
      enable: true,
      value: { min: 0, max: 360 },
      animation: {
        enable: true, 
        speed: 30
      }
    },
    roll: {
      enable: true,
      speed: 15
    },
    wobble: {
      enable: true,
      distance: 10,
      speed: 10
    }
  },
  detectRetina: true
};

// Global particles instance - COMPLETELY outside React
let globalEngine: Engine | null = null;
let isInitializing = false;
let isInitialized = false;

// Initialize particles once at module level
async function initializeParticlesOnce() {
  if (isInitialized || isInitializing) return;
  
  isInitializing = true;
  
  try {
    await initParticlesEngine(async (engine) => {
      globalEngine = engine;
      await loadSlim(engine);
    });
    
    isInitialized = true;
    console.log('Global particles engine initialized');
    
    // Load the particles into the container if it exists
    const container = document.getElementById('tablet-particles-container');
    if (container && globalEngine) {
      try {
        await globalEngine.load({
          id: "tablet-particles",
          element: container,
          options: particlesConfig
        });
        console.log('Particles loaded into container');
      } catch (err) {
        console.error('Error loading particles:', err);
      }
    } else {
      console.log('Container not found or engine not ready');
    }
  } catch (error) {
    console.error('Failed to initialize particles engine:', error);
  } finally {
    isInitializing = false;
  }
}

// Function to attach particles to DOM element
async function attachParticlesToElement(elementId: string) {
  if (!isInitialized || !globalEngine) {
    console.log('Engine not ready, cannot attach particles');
    return;
  }
  
  try {
    const container = document.getElementById(elementId);
    if (container) {
      // Check if particles already exist for this container
      const existingContainer = document.getElementById(elementId);
      const hasParticles = existingContainer?.querySelector('canvas') !== null;
      
      if (!hasParticles) {
        // No existing particles, create new ones
        await globalEngine.load({
          id: elementId,
          element: container,
          options: particlesConfig
        });
        console.log(`Particles loaded into container ${elementId}`);
      } else {
        console.log(`Particles already loaded in ${elementId}`);
      }
    }
  } catch (err) {
    console.error('Error attaching particles:', err);
  }
}

// Call this at module initialization time - outside of any component
if (typeof window !== 'undefined') {
  // Only run in browser environment
  initializeParticlesOnce();
  
  // Setup a global MutationObserver to watch for the container being added to DOM
  setTimeout(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          const container = document.getElementById('tablet-particles-container');
          if (container && isInitialized && globalEngine) {
            attachParticlesToElement('tablet-particles-container');
            observer.disconnect(); // Once found, no need to keep observing
          }
        }
      });
    });
    
    // Start observing the document body for DOM changes
    observer.observe(document.body, { childList: true, subtree: true });
  }, 100);
}

// Commandments data
const commandments = [
  {
    title: "Do not create a Line",
    desc: [
      "Linear life is fiction.",
      "Every moment is a fork.",
      "Choose through awareness — not inertia."
    ]
  },
  {
    title: "Honor the Portal within",
    desc: [
      "No outer sign matters if your inner state is off.",
      "Your resonance is the gateway.",
      "You are the threshold."
    ]
  },
  {
    title: "Cleanse Memory of Noise",
    desc: [
      "You don't carry the past.",
      "You loop it.",
      "Until you extract the pattern and cut the echo."
    ]
  },
  {
    title: "Discern the Guides",
    desc: [
      "Not all who shine, lead.",
      "True guides activate your clarity.",
      "False ones amplify your confusion."
    ]
  },
  {
    title: "Break the Shell",
    desc: [
      "When it cracks — it's not failure.",
      "It's the signal.",
      "Step out before your identity becomes your tomb."
    ]
  },
  {
    title: "Hold through the Transition",
    desc: [
      "Don't rush to reconstruct.",
      "The silence after destruction is sacred.",
      "Sit in it until you hear the next signal."
    ]
  },
  {
    title: "Listen to the Repeats",
    desc: [
      "The same situation again?",
      "That's not punishment.",
      "That's precision.",
      "Resolve it — or relive it."
    ]
  },
  {
    title: "Permit the Cut",
    desc: [
      "Not all endings come with closure.",
      "Some come with clarity.",
      "Let go.",
      "Without fixing, apologizing, or performing."
    ]
  },
  {
    title: "Call yourself forth",
    desc: [
      "Your next version is waiting for your signal.",
      "Don't wait for permission.",
      "Name it.",
      "Act from it.",
      "Live into it."
    ]
  },
  {
    title: "Gather yourself — or be shattered by your own frequency",
    desc: [
      "A fractured self cannot hold a coherent field.",
      "Unify.",
      "Or disintegrate.",
      "There is no middle."
    ]
  }
];

// Actual component
export default function TabletSection() {
  const [active, setActive] = useState(4);
  const [initialRender, setInitialRender] = useState(true);
  
  // Create container ref
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Setup the container once when component mounts
  useEffect(() => {
    // Set initial render to false after component mounts
    setInitialRender(false);
    
    // Create a container specifically for the particles
    const particlesContainer = document.getElementById('tablet-particles-container');
    
    if (!particlesContainer && containerRef.current) {
      // Create the particles container if it doesn't exist
      const newContainer = document.createElement('div');
      newContainer.id = 'tablet-particles-container';
      newContainer.style.position = 'absolute';
      newContainer.style.inset = '0';
      newContainer.style.width = '100%';
      newContainer.style.height = '100%';
      newContainer.style.zIndex = '0';
      newContainer.style.pointerEvents = 'none';
      
      // Append it to our section container
      containerRef.current.appendChild(newContainer);
      
      // Attempt to load particles into it
      if (isInitialized && globalEngine) {
        attachParticlesToElement('tablet-particles-container');
      } else {
        // If engine not ready, initialize it
        initializeParticlesOnce().then(() => {
          attachParticlesToElement('tablet-particles-container');
        });
      }
    }
    
    // Cleanup - nothing to do, we want particles to persist
    return () => {};
  }, []);
  
  // Add keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      setActive((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "ArrowRight") {
      setActive((prev) => Math.min(prev + 1, commandments.length - 1));
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handlePrev = () => setActive((prev) => Math.max(prev - 1, 0));
  const handleNext = () => setActive((prev) => Math.min(prev + 1, commandments.length - 1));

  return (
    <section 
      ref={containerRef}
      className="relative w-full min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-[#181c2e] via-[#232946] to-[#10182a] overflow-hidden scroll-snap-align-start"
    >
      {/* No particles component here - it's handled via DOM manipulation */}
      
      {/* Glassy cosmic slab */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.25, 0.4, 0.25, 1] }}
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '48rem', 
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}
      >
        <h2 className="text-4xl sm:text-5xl font-bold mb-2 text-transparent bg-gradient-to-r from-blue-300 via-white to-purple-300 bg-clip-text">
          The Neuralcosmologist's Tablet
        </h2>
        <p className="text-lg text-blue-200 mb-2 font-semibold tracking-wide">10 Commandments for Navigating a Living Reality</p>
        <p className="text-md text-blue-300/80 mb-6 italic max-w-xl mx-auto">
          This is not a doctrine.<br />This is not philosophy.<br />This is what remains when the illusions are gone.
        </p>
        
        {/* Carousel with a simpler, more reliable positioning approach */}
        <div className="relative w-full max-w-5xl mx-auto h-[500px] flex items-center justify-center overflow-hidden px-10">
          {/* Left navigation button */}
          <div className="absolute left-4 z-30">
            {active > 0 && (
              <button
                onClick={handlePrev}
                className="p-3 rounded-full bg-white/5 hover:bg-white/20 text-blue-200 backdrop-blur-md border border-white/10 shadow-lg transition-all group"
                aria-label="Previous"
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 animate-pulse-glow"></div>
                <ChevronLeft size={26} className="group-hover:scale-110 transition-transform" />
              </button>
            )}
          </div>

          {/* Card container */}
          <div className="relative" style={{ perspective: 1500, width: "100%", maxWidth: "480px", height: "100%" }}>
            {commandments.map((cmd, i) => {
              // Only render visible cards (current and adjacent)
              const offset = i - active;
              if (Math.abs(offset) > 2) return null;
              
              // Card positioning and styling
              const x = offset * 120; // Increased horizontal offset for more spacing
              const scale = 1 - Math.abs(offset) * 0.15; // Scale: 1 for current, 0.85 for adjacent, 0.7 for further
              const rotateY = offset * 25; // Rotation: -25deg for prev, 0 for current, 25deg for next
              
              // Immediately set opacity based on whether card is active
              const opacity = offset === 0 ? 1 : 0.3;
              
              const zIndex = 10 - Math.abs(offset); // Z-Index: 10 for current, 9 for adjacent, 8 for further
              
              // Apply a vertical offset to cards on the side to create a staggered effect
              const y = Math.abs(offset) > 0 ? 15 : 0;
              
              // Use separate variants for transition behavior based on initial render
              const transitionConfig = initialRender ? {
                duration: 0
              } : {
                duration: 0.5,
                ease: "easeInOut"
              };
              
              return (
                <motion.div
                  key={i}
                  initial={false}
                  animate={{
                    x,
                    y,
                    scale,
                    rotateY,
                    opacity,
                    zIndex
                  }}
                  transition={transitionConfig}
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    marginLeft: "-200px", // Half of card width
                    marginTop: "-150px", // Adjusted for better vertical alignment
                    width: "400px",
                    transformStyle: "preserve-3d",
                    willChange: "transform, opacity",
                    transform: "translateZ(0)" // For GPU acceleration
                  }}
                >
                  <div className="bg-gradient-to-br from-blue-900/40 via-white/5 to-purple-900/30 border border-blue-400/20 shadow-xl rounded-2xl p-6 flex flex-col items-start text-left backdrop-blur-md">
                    <div className="flex items-start gap-3 mb-3">
                      <span className="text-2xl font-extrabold text-blue-200 drop-shadow-md">{i + 1}.</span>
                      <span className="text-xl font-bold text-blue-100 bg-gradient-to-r from-blue-200 via-white to-purple-200 bg-clip-text text-transparent">
                        {cmd.title}
                      </span>
                    </div>
                    <ul className="pl-2 space-y-2 text-blue-200/90">
                      {cmd.desc.map((line, j) => (
                        <li key={j} className="list-disc ml-4">{line}</li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right navigation button */}
          <div className="absolute right-4 z-30">
            {active < commandments.length - 1 && (
              <button
                onClick={handleNext}
                className="p-3 rounded-full bg-white/5 hover:bg-white/20 text-blue-200 backdrop-blur-md border border-white/10 shadow-lg transition-all group"
                aria-label="Next"
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 animate-pulse-glow"></div>
                <ChevronRight size={26} className="group-hover:scale-110 transition-transform" />
              </button>
            )}
          </div>
        </div>

        {/* Page dots indicator - responsive size based on viewport */}
        <div className="flex gap-0.5 sm:gap-1 mt-4 sm:mt-6 justify-center">
          {commandments.map((_, i) => (
            <button
              key={i}
              className={`
                transition-all rounded-full
                ${i === active 
                  ? 'bg-blue-300 sm:w-4 w-3 sm:h-2 h-1.5' 
                  : 'bg-blue-300/30 sm:w-2 w-1.5 sm:h-2 h-1.5'}
              `}
              onClick={() => setActive(i)}
              aria-label={`Go to commandment ${i+1}`}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
} 