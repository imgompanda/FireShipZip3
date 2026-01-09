"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, Zap } from "lucide-react";
import Image from "next/image";

interface AnimatedHeroProps {
  badge?: string;
  title1: string;
  title2Prefix?: string;
  title2Highlight?: string | React.ReactNode;
  description: string;
  primaryCta: {
    text: string;
    href: string;
  };
  secondaryCta?: {
    text: string;
    href: string;
  };
  imageSrc?: string; // Optional right-side tech stack image or whatever
  className?: string;
}

export function AnimatedHero({
  badge,
  title1,
  title2Prefix,
  title2Highlight,
  description,
  primaryCta,
  secondaryCta,
  imageSrc,
  className,
}: AnimatedHeroProps) {
  const containerRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Fade in text elements stagger
      if (textRef.current) {
        gsap.fromTo(
          textRef.current.children,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            delay: 0.1,
          }
        );
      }

      // 2. Floating image animation
      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          { opacity: 0, x: 50, rotateY: -10 },
          {
            opacity: 1,
            x: 0,
            rotateY: 0,
            duration: 1,
            ease: "power3.out",
            delay: 0.4,
          }
        );

        // Continuous float
        gsap.to(imageRef.current, {
          y: -15,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className={cn(
        "relative min-h-[90vh] flex items-center pt-20 pb-20 overflow-hidden bg-background",
        className
      )}
      style={{ perspective: "1000px" }}
    >
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.1),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(255,255,255,0.05),transparent)] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div ref={textRef} className="space-y-6 max-w-2xl">
            {badge && (
              <div className="inline-flex items-center px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 text-sm font-medium">
                <span className="mr-2">✨</span> {badge}
              </div>
            )}

            <div className="space-y-2">
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1]">
                {title1}
              </h1>
              {(title2Prefix || title2Highlight) && (
                <div className="text-3xl md:text-5xl font-bold text-muted-foreground flex flex-wrap items-center gap-2">
                  <span>{title2Prefix}</span>
                  {title2Highlight && (
                    <span className="text-foreground bg-primary/10 px-2 rounded-lg text-primary">
                      {title2Highlight}
                    </span>
                  )}
                </div>
              )}
            </div>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg">
              {description}
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Button
                size="lg"
                className="text-lg h-12 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all"
                asChild
              >
                <a href={primaryCta.href}>
                  <Zap className="mr-2 h-5 w-5 fill-current" />
                  {primaryCta.text}
                </a>
              </Button>
              {secondaryCta && (
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg h-12 px-8 rounded-xl bg-background/50 backdrop-blur-sm"
                  asChild
                >
                  <a href={secondaryCta.href}>
                    {secondaryCta.text} <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                </Button>
              )}
            </div>

            {/* Simple Social Proof */}
            <div className="pt-6 flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-background bg-zinc-200 dark:bg-zinc-800"
                  />
                ))}
              </div>
              <p>Trusted by 100+ creative developers</p>
            </div>
          </div>

          {/* Right Image / Visual */}
          <div
            ref={imageRef}
            className="hidden lg:block relative perspective-1000"
          >
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt="Hero Visual"
                width={600}
                height={600}
                className="object-contain drop-shadow-2xl"
              />
            ) : (
              /* Default abstract visual if no image provided */
              <div className="w-full h-[500px] bg-gradient-to-tr from-primary/20 via-primary/5 to-transparent rounded-3xl border border-white/10 backdrop-blur-3xl shadow-2xl flex items-center justify-center p-8 relative overflow-hidden group">
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px]" />
                <div className="w-32 h-32 bg-primary/30 rounded-full blur-3xl absolute top-10 right-10 animate-pulse" />
                <div className="w-48 h-48 bg-purple-500/20 rounded-full blur-3xl absolute bottom-10 left-10" />

                <div className="relative z-10 text-center space-y-4 p-6 bg-background/40 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl transform transition-transform group-hover:scale-105 duration-500">
                  <div className="w-16 h-16 bg-primary rounded-2xl mx-auto flex items-center justify-center shadow-lg mb-4">
                    <Zap className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold">State of the Art</h3>
                  <p className="text-muted-foreground">
                    Your SaaS deserves a<br />
                    stunning landing page.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
