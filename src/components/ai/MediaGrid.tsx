"use client";

import { Download } from "lucide-react";

interface MediaItem {
  type: "image" | "video";
  src: string;
  prompt: string;
}

interface MediaGridProps {
  items: MediaItem[];
}

export function MediaGrid({ items }: MediaGridProps) {
  const handleDownload = (item: MediaItem) => {
    const a = document.createElement("a");
    a.href = item.src;
    a.download = `ai-${item.type}-${Date.now()}.${item.type === "image" ? "png" : "mp4"}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {items.map((item, index) => (
        <div key={index} className="group relative rounded-lg overflow-hidden bg-base-200">
          {item.type === "image" ? (
            <img
              src={item.src}
              alt={item.prompt}
              className="w-full h-auto object-cover"
            />
          ) : (
            <video
              src={item.src}
              controls
              className="w-full h-auto"
            />
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs truncate">{item.prompt}</p>
            </div>
            <button
              onClick={() => handleDownload(item)}
              className="btn btn-circle btn-sm btn-ghost text-white ml-2"
              title="Download"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
