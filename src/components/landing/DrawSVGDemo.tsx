"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(DrawSVGPlugin, ScrollTrigger);

export function DrawSVGDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rocketRef = useRef<SVGSVGElement>(null);
  const checkRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Rocket drawing animation
      if (rocketRef.current) {
        const paths = rocketRef.current.querySelectorAll("path, line, circle");
        gsap.fromTo(
          paths,
          { drawSVG: "0%" },
          {
            drawSVG: "100%",
            duration: 2,
            stagger: 0.1,
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: rocketRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Checkmark drawing animation
      if (checkRef.current) {
        const path = checkRef.current.querySelector("path");
        gsap.fromTo(
          path,
          { drawSVG: "0%" },
          {
            drawSVG: "100%",
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: checkRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center gap-16 py-12"
    >
      {/* Rocket SVG */}
      <div className="text-center">
        <svg
          ref={rocketRef}
          width="120"
          height="120"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-amber-500"
        >
          {/* Rocket body */}
          <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
          <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
          <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
          <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
          {/* Flame */}
          <line x1="3" y1="21" x2="3" y2="21" />
        </svg>
        <p className="mt-4 text-sm text-zinc-400">Rocket (DrawSVG)</p>
      </div>

      {/* Checkmark SVG */}
      <div className="text-center">
        <svg
          ref={checkRef}
          width="120"
          height="120"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-emerald-500"
        >
          <path d="M20 6L9 17l-5-5" />
        </svg>
        <p className="mt-4 text-sm text-zinc-400">Checkmark (DrawSVG)</p>
      </div>

      {/* Circle progress */}
      <div className="text-center">
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          className="text-purple-500"
        >
          {/* Background circle */}
          <circle
            cx="60"
            cy="60"
            r="50"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            opacity="0.2"
          />
          {/* Animated circle */}
          <circle
            cx="60"
            cy="60"
            r="50"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            style={{
              strokeDasharray: 314,
              strokeDashoffset: 314,
              animation: "drawCircle 2s ease-in-out forwards",
            }}
          />
        </svg>
        <p className="mt-4 text-sm text-zinc-400">Circle Progress</p>

        <style jsx>{`
          @keyframes drawCircle {
            to {
              stroke-dashoffset: 0;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
