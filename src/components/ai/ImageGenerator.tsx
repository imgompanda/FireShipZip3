"use client";

import { useState } from "react";
import { ImageIcon, Loader2 } from "lucide-react";
import { MediaGrid } from "./MediaGrid";
import type { AIImageResult } from "@/types/ai";

export function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [size, setSize] = useState("1024x1024");
  const [quality, setQuality] = useState("standard");
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
        body: JSON.stringify({ prompt, size, quality }),
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
    <div className="flex flex-col h-[calc(100vh-16rem)]">
      {/* Controls */}
      <div className="p-4 border-b border-neutral space-y-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the image you want to generate..."
          className="textarea textarea-bordered w-full min-h-[80px] bg-base-200 text-base-content border-neutral focus:border-primary"
        />

        <div className="flex flex-wrap gap-3 items-end">
          <div className="form-control">
            <label className="label">
              <span className="label-text text-base-content/60">Size</span>
            </label>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="select select-bordered select-sm bg-base-200 border-neutral"
            >
              <option value="1024x1024">1024 x 1024</option>
              <option value="1536x1024">1536 x 1024</option>
              <option value="1024x1536">1024 x 1536</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text text-base-content/60">Quality</span>
            </label>
            <select
              value={quality}
              onChange={(e) => setQuality(e.target.value)}
              className="select select-bordered select-sm bg-base-200 border-neutral"
            >
              <option value="standard">Standard</option>
              <option value="hd">HD</option>
            </select>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="btn btn-primary btn-sm"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ImageIcon className="w-4 h-4" />
            )}
            Generate
          </button>
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
            <p className="mt-4 text-sm">Generating image...</p>
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
              <p className="text-lg font-medium">No images yet</p>
              <p className="text-sm mt-1">Generate your first image above</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
