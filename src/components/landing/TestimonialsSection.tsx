"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Star } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function TestimonialsSection() {
  const t = useTranslations("Landing.testimonials");
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const items = t.raw("items") as Array<{ content: string; name: string }>;

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (cardsRef.current) {
        gsap.fromTo(
          cardsRef.current.children,
          { opacity: 0, y: 50, scale: 0.95 },
          {
            opacity: 1, y: 0, scale: 1,
            duration: 0.6, stagger: 0.15,
            ease: "back.out(1.2)",
            scrollTrigger: { trigger: cardsRef.current, start: "top 75%", toggleActions: "play none none reverse" },
          }
        );
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="testimonials" className="py-16 md:py-24 bg-base-200">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-2xl md:text-5xl font-extrabold text-base-content mb-3 md:mb-4">{t("title")}</h2>
          <div className="flex items-center justify-center gap-2 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-6 h-6 fill-primary text-primary" />
            ))}
          </div>
          <p className="text-base-content/60 text-sm md:text-lg">{t("subtitle")}</p>
        </div>
        <div ref={cardsRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {items.map((item, i) => (
            <div key={i} className="p-4 md:p-6 rounded-2xl bg-base-100 border border-neutral hover:border-primary/30 transition-colors">
              <div className="flex text-primary mb-3 md:mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-primary" />
                ))}
              </div>
              <p className="text-sm md:text-base text-base-content/70 mb-3 md:mb-4 leading-relaxed">"{item.content}"</p>
              <p className="text-sm md:text-base font-bold text-base-content">— {item.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
