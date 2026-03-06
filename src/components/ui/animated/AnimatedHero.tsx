"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";
import { ArrowRight, Zap } from "lucide-react";

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
  imageSrc?: string;
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
  className,
}: AnimatedHeroProps) {
  const containerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (contentRef.current) {
        gsap.fromTo(
          contentRef.current.children,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: "power3.out",
            delay: 0.1,
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className={cn(
        "relative min-h-[90vh] flex items-center pt-20 pb-20 overflow-hidden bg-base-100",
        className
      )}
    >
      {/* Subtle top gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_-10%,color-mix(in_oklch,var(--color-primary)_8%,transparent),transparent)] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div
          ref={contentRef}
          className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-6"
        >
          {/* Badge */}
          {badge && (
            <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-neutral bg-base-200 text-base-content/60 text-sm font-medium">
              <Zap className="mr-2 h-3.5 w-3.5 text-primary" />
              {badge}
            </div>
          )}

          {/* Headline */}
          <div className="space-y-3">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-base-content leading-[1.1]">
              {title1}
            </h1>
            {(title2Prefix || title2Highlight) && (
              <div className="text-3xl md:text-5xl lg:text-6xl font-bold text-base-content/60 flex flex-wrap items-center justify-center gap-3">
                {title2Prefix && <span>{title2Prefix}</span>}
                {title2Highlight && (
                  <span className="text-primary">
                    {title2Highlight}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Description */}
          <p className="text-lg md:text-xl text-base-content/60 leading-relaxed max-w-2xl">
            {description}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href={primaryCta.href}
              className="inline-flex items-center justify-center text-lg font-semibold h-12 px-8 rounded-xl bg-primary text-primary-content hover:brightness-110 transition-all duration-200 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30"
            >
              <Zap className="mr-2 h-5 w-5 fill-current" />
              {primaryCta.text}
            </a>
            {secondaryCta && (
              <a
                href={secondaryCta.href}
                className="inline-flex items-center justify-center text-lg font-semibold h-12 px-8 rounded-xl border border-neutral text-base-content/60 hover:border-base-content/30 hover:text-base-content bg-base-100 transition-all duration-200"
              >
                {secondaryCta.text}
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            )}
          </div>

          {/* Social Proof */}
          <div className="pt-6 flex items-center gap-4 text-sm text-base-content/60">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-base-100 bg-neutral"
                />
              ))}
            </div>
            <p>Trusted by 100+ creative developers</p>
          </div>
        </div>
      </div>
    </section>
  );
}
