"use client";

import { useState } from "react";
import { MessageSquare, ImageIcon, Video } from "lucide-react";
import { useTranslations } from "next-intl";
import { ChatInterface } from "./ChatInterface";
import { ImageGenerator } from "./ImageGenerator";
import { VideoGenerator } from "./VideoGenerator";
import type { AIMode } from "@/types/ai";

interface AILayoutProps {
  videoEnabled: boolean;
}

export function AILayout({ videoEnabled }: AILayoutProps) {
  const t = useTranslations("AI");
  const [activeTab, setActiveTab] = useState<AIMode>("chat");

  const tabs: { id: AIMode; label: string; icon: React.ReactNode; disabled?: boolean }[] = [
    { id: "chat", label: t("tabs.chat"), icon: <MessageSquare className="w-4 h-4" /> },
    { id: "image", label: t("tabs.image"), icon: <ImageIcon className="w-4 h-4" /> },
    {
      id: "video",
      label: t("tabs.video"),
      icon: <Video className="w-4 h-4" />,
      disabled: !videoEnabled,
    },
  ];

  return (
    <div className="bg-base-100 rounded-xl border border-neutral overflow-hidden">
      {/* Tab Header */}
      <div className="flex border-b border-neutral bg-base-200/50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === tab.id
                ? "border-primary text-primary"
                : tab.disabled
                  ? "border-transparent text-base-content/30 cursor-not-allowed"
                  : "border-transparent text-base-content/60 hover:text-base-content hover:border-base-content/20"
            }`}
            disabled={tab.disabled}
          >
            {tab.icon}
            {tab.label}
            {tab.disabled && (
              <span className="badge badge-xs badge-neutral">{t("setupNeeded")}</span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "chat" && <ChatInterface />}
        {activeTab === "image" && <ImageGenerator />}
        {activeTab === "video" && (
          <VideoGenerator videoEnabled={videoEnabled} />
        )}
      </div>
    </div>
  );
}
