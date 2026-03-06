"use client";

import { useState } from "react";
import { Video, Loader2, AlertCircle } from "lucide-react";
import { MediaGrid } from "./MediaGrid";
import { Button } from "@/components/ui/button";
import type { AIVideoResult } from "@/types/ai";
import { useTranslations } from "next-intl";

interface VideoGeneratorProps {
  videoEnabled: boolean;
}

export function VideoGenerator({ videoEnabled }: VideoGeneratorProps) {
  const t = useTranslations("AI.video");
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [duration, setDuration] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<AIVideoResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  if (!videoEnabled) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-base-content/40">
        <AlertCircle className="w-12 h-12 mb-4" />
        <p className="text-lg font-medium">{t("unavailable")}</p>
        <p className="text-sm mt-2 text-center max-w-md">
          {t("unavailableDescription")}
        </p>
      </div>
    );
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError(null);

    try {
      const res = await fetch("/api/ai/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, aspectRatio, duration }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to generate video");
      }

      const data: AIVideoResult = await res.json();
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

        <div className="flex flex-wrap gap-3 items-end">
          <div className="form-control">
            <label className="label">
              <span className="label-text text-base-content/60">
                {t("aspectRatio")}
              </span>
            </label>
            <select
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value)}
              className="select select-bordered select-sm bg-base-200 border-neutral"
            >
              <option value="16:9">16:9</option>
              <option value="9:16">9:16</option>
              <option value="1:1">1:1</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text text-base-content/60">
                {t("duration")}
              </span>
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="select select-bordered select-sm bg-base-200 border-neutral"
            >
              <option value={3}>3s</option>
              <option value={5}>5s</option>
              <option value={10}>10s</option>
            </select>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            size="sm"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Video className="w-4 h-4 mr-2" />
            )}
            {t("generate")}
          </Button>
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
            <Loader2 className="w-12 h-12 animate-spin mb-4" />
            <p className="text-lg font-medium">{t("generating")}</p>
            <p className="text-sm mt-1">
              {t("generatingWait")}
            </p>
          </div>
        )}

        {results.length > 0 ? (
          <MediaGrid
            items={results.map((r) => ({
              type: "video" as const,
              src: r.url || `data:video/mp4;base64,${r.base64}`,
              prompt: r.prompt,
            }))}
          />
        ) : (
          !isGenerating && (
            <div className="flex flex-col items-center justify-center h-full text-base-content/40">
              <Video className="w-12 h-12 mb-4" />
              <p className="text-lg font-medium">{t("noVideos")}</p>
              <p className="text-sm mt-1">{t("generateFirst")}</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
