"use client";

import * as React from "react";
import { MoveRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface HeroProps {
  title?: string;
  subtitle?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

const Hero = React.forwardRef<HTMLElement, HeroProps>(
  (
    {
      title = "Neuralcosmology",
      subtitle = "You're not in the world. You are the structure.",
      description = "Explore the intersection of neural networks and cosmic structures. Discover how the patterns of the universe mirror the patterns of consciousness.",
      ctaLabel = "Enter the Line",
      ctaHref = "#",
      className,
    },
    ref
  ) => {
    return (
      <section
        ref={ref}
        className={cn(
          "relative z-0 flex min-h-[90vh] w-full flex-col items-center justify-center overflow-hidden rounded-md bg-background",
          className
        )}
      >
        <div className="absolute top-0 isolate z-0 flex w-screen flex-1 items-start justify-center">
          <div className="absolute top-0 z-50 h-48 w-screen bg-transparent opacity-10 backdrop-blur-md" />

          {/* Main glow */}
          <div className="absolute inset-auto z-50 h-36 w-[28rem] -translate-y-[-30%] rounded-full bg-primary/60 opacity-80 blur-3xl" />

          {/* Lamp effect - replaced motion.div with div */}
          <div className="absolute top-0 z-30 h-36 -translate-y-[20%] rounded-full bg-primary/60 blur-2xl w-[16rem]" />

          {/* Top line - replaced motion.div with div */}
          <div className="absolute inset-auto z-50 h-0.5 -translate-y-[-10%] bg-primary/60 w-[30rem]" />

          {/* Left gradient cone - replaced motion.div with div */}
          <div
            style={{
              backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
            }}
            className="absolute inset-auto right-1/2 h-56 overflow-visible w-[30rem] bg-gradient-conic from-primary/60 via-transparent to-transparent [--conic-position:from_70deg_at_center_top]"
          >
            <div className="absolute w-[100%] left-0 bg-background h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
            <div className="absolute w-40 h-[100%] left-0 bg-background bottom-0 z-20 [mask-image:linear-gradient(to_right,white,transparent)]" />
          </div>

          {/* Right gradient cone - replaced motion.div with div */}
          <div
            style={{
              backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
            }}
            className="absolute inset-auto left-1/2 h-56 w-[30rem] bg-gradient-conic from-transparent via-transparent to-primary/60 [--conic-position:from_290deg_at_center_top]"
          >
            <div className="absolute w-40 h-[100%] right-0 bg-background bottom-0 z-20 [mask-image:linear-gradient(to_left,white,transparent)]" />
            <div className="absolute w-[100%] right-0 bg-background h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
          </div>
        </div>

        {/* Content container - replaced motion.div with div */}
        <div className="relative z-50 container flex justify-center flex-1 flex-col px-5 md:px-10 gap-4 -translate-y-10">
          <div className="flex flex-col items-center text-center space-y-6">
            <Badge variant="outline" className="mb-4">
              neuralcosmology.com
            </Badge>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xl md:text-2xl text-muted-foreground max-w-[600px] italic">
                {subtitle}
              </p>
            )}
            {description && (
              <p className="text-lg text-muted-foreground max-w-[600px]">
                {description}
              </p>
            )}
            <div className="flex gap-4 mt-8">
              <Button size="lg" asChild>
                <Link href={ctaHref}>
                  {ctaLabel} <MoveRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }
);

Hero.displayName = "Hero";

function HeroDemo() {
  return <Hero />;
}

export default HeroDemo; 