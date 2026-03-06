"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function generateBoxShadowStars(n: number) {
  let value = "";
  for (let i = 0; i < n; i++) {
    const x = Math.floor(Math.random() * 2000);
    const y = Math.floor(Math.random() * 2000);
    value += `${x}px ${y}px var(--star-color)${i < n - 1 ? ", " : ""}`;
  }
  return value;
}

export function ParallaxBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const starsSmallRef = useRef<HTMLDivElement>(null);
  const starsMediumRef = useRef<HTMLDivElement>(null);
  const starsLargeRef = useRef<HTMLDivElement>(null);

  const [smallStars, setSmallStars] = useState("");
  const [mediumStars, setMediumStars] = useState("");
  const [largeStars, setLargeStars] = useState("");

  useEffect(() => {
    setSmallStars(generateBoxShadowStars(700));
    setMediumStars(generateBoxShadowStars(200));
    setLargeStars(generateBoxShadowStars(100));

    const ctx = gsap.context(() => {
      // ... rest of the code
      // Create a timeline for the scroll parallax
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
        },
      });

      // Small stars move slowly (far away)
      if (starsSmallRef.current) {
        tl.to(
          starsSmallRef.current,
          {
            y: -200,
            ease: "none",
          },
          0
        );
      }

      // Medium stars move faster
      if (starsMediumRef.current) {
        tl.to(
          starsMediumRef.current,
          {
            y: -400,
            ease: "none",
          },
          0
        );
      }

      // Large stars move fastest (foreground)
      if (starsLargeRef.current) {
        tl.to(
          starsLargeRef.current,
          {
            y: -600,
            ease: "none",
          },
          0
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-base-100 transition-colors duration-500"
      style={
        { "--star-color": "rgba(100, 100, 100, 0.8)" } as React.CSSProperties
      }
    >
      <style jsx global>{`
        .dark {
          --star-color: #ffffff;
        }
      `}</style>

      {/* Gradient Overlay for Depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-primary/5 z-10" />

      {/* Small Stars */}
      <div
        ref={starsSmallRef}
        className="absolute w-[1px] h-[1px] bg-transparent rounded-full"
        style={{ boxShadow: smallStars }}
      />

      {/* Medium Stars */}
      <div
        ref={starsMediumRef}
        className="absolute w-[2px] h-[2px] bg-transparent rounded-full"
        style={{ boxShadow: mediumStars }}
      />

      {/* Large Stars (Planets/Bright Stars) */}
      <div
        ref={starsLargeRef}
        className="absolute w-[3px] h-[3px] bg-transparent rounded-full"
        style={{ boxShadow: largeStars }}
      />

      {/* Nebulas/Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-secondary/10 blur-[150px] rounded-full mix-blend-screen animate-pulse-slow" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-primary/10 blur-[150px] rounded-full mix-blend-screen animate-pulse-slow" />
    </div>
  );
}
