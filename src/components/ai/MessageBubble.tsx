// @ts-nocheck
"use client";

import { UIMessage } from "ai";
import { User, Bot } from "lucide-react";
import { marked } from "marked";
import { useMemo } from "react";

interface MessageBubbleProps {
  message: UIMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  const htmlContent = useMemo(() => {
    if (isUser) return null;
    const text = message.parts
      ?.filter((part): part is Extract<typeof part, { type: "text" }> => part.type === "text")
      .map((part) => part.text)
      .join("") ?? "";
    return marked.parse(text) as string;
  }, [message.parts, isUser]);

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser
            ? "bg-primary text-primary-content"
            : "bg-base-200 text-base-content"
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-primary text-primary-content"
            : "bg-base-200 text-base-content"
        }`}
      >
        {isUser ? (
          <p className="text-sm whitespace-pre-wrap">
            {message.parts
              ?.filter((part): part is Extract<typeof part, { type: "text" }> => part.type === "text")
              .map((part) => part.text)
              .join("") ?? ""}
          </p>
        ) : (
          <div
            className="prose prose-invert prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: htmlContent ?? "" }}
          />
        )}
      </div>
    </div>
  );
}
