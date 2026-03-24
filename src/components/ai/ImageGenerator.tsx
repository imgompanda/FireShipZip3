"use client";

import { useState } from "react";
import { ImageIcon, Loader2 } from "lucide-react";
import { MediaGrid } from "./MediaGrid";
import { Button } from "@/components/ui/button";
import type { AIImageResult } from "@/types/ai";
import { useTranslations } from "next-intl";

export function ImageGenerator() {
  const t = useTranslations("AI.image");
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<AIImageResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError(null);

    try {
      const res = await fetch("/api/ai/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to generate image");
      }

      const data: AIImageResult = await res.json();
      setResults((prev) => [data, ...prev]);
      setPrompt("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Controls */}
      <div className="p-4 border-b border-neutral space-y-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={t("placeholder")}
          className="textarea textarea-bordered w-full min-h-[80px] bg-base-200 text-base-content border-neutral focus:border-primary"
        />

        <div className="flex flex-wrap gap-3 items-center">
          <Button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            size="sm"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <ImageIcon className="w-4 h-4 mr-2" />
            )}
            {t("generate")}
          </Button>
          <span className="text-[11px] text-base-content/30">
            Powered by <span className="font-medium">gemini-2.5-flash-image</span>
          </span>
        </div>

        {error && (
          <div className="alert alert-error text-sm">
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto p-4">
        {isGenerating && (
          <div className="flex flex-col items-center justify-center py-12 text-base-content/40">
            <div className="w-full max-w-sm aspect-square bg-base-200 rounded-lg animate-pulse" />
            <p className="mt-4 text-sm">{t("generating")}</p>
          </div>
        )}

        {results.length > 0 ? (
          <MediaGrid
            items={results.map((r) => ({
              type: "image" as const,
              src: r.url || `data:image/png;base64,${r.base64}`,
              prompt: r.prompt,
            }))}
          />
        ) : (
          !isGenerating && (
            <div className="flex flex-col items-center justify-center h-full text-base-content/40">
              <ImageIcon className="w-12 h-12 mb-4" />
              <p className="text-lg font-medium">{t("noImages")}</p>
              <p className="text-sm mt-1">{t("generateFirst")}</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
