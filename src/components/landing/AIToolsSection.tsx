"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

const aiTools = [
  { name: "Cursor", src: "/ai-tools/cursor.jpeg" },
  { name: "ChatGPT", src: "/ai-tools/chatgpt.webp" },
  { name: "Claude", src: "/ai-tools/claude.png" },
  { name: "Gemini", src: "/ai-tools/gemini.webp" },
  { name: "Copilot", src: "/ai-tools/copilot.png" },
  { name: "DeepSeek", src: "/ai-tools/deepseek.png" },
  { name: "Windsurf", src: "/ai-tools/windsurf.jpg" },
  { name: "Grok", src: "/ai-tools/grok.jpg" },
];

export function AIToolsSection() {
  const t = useTranslations("Landing.aiTools");

  return (
    <section className="py-24 bg-base-200">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Fireship logo + codebase label */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <span className="absolute -top-6 -right-16 text-success text-sm font-mono">
                codebase
              </span>
              <div className="flex items-center gap-3">
                <Image
                  src="/logo.png"
                  alt="Fireship"
                  width={48}
                  height={48}
                  className="rounded-xl"
                />
                <span className="text-3xl font-bold text-base-content">FireShip</span>
              </div>
            </div>
          </div>

          {/* Plus sign */}
          <div className="text-4xl text-base-content/50 my-8">+</div>

          {/* AI Tools grid with AI label */}
          <div className="relative mb-8">
            <span className="absolute -top-6 -right-4 md:right-16 text-success text-sm font-mono">
              AI
            </span>
            <div className="flex flex-wrap justify-center gap-3">
              {aiTools.map((tool) => (
                <div
                  key={tool.name}
                  className="w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden bg-base-300 border border-neutral hover:border-primary/50 transition-colors"
                >
                  <Image
                    src={tool.src}
                    alt={tool.name}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Equals sign */}
          <div className="text-4xl text-base-content/50 my-8">=</div>

          {/* Result headline */}
          <h2 className="text-3xl md:text-5xl font-extrabold text-base-content mb-4">
            {t("headline")}
            <span className="ml-3 px-4 py-1 bg-secondary text-secondary-content rounded-lg">
              {t("highlight")}
            </span>
          </h2>

          <p className="text-base-content/60 text-lg max-w-xl mx-auto whitespace-pre-wrap">
            {t("description")}
          </p>
        </div>
      </div>
    </section>
  );
}
