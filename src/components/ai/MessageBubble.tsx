"use client";

import { UIMessage } from "ai";
import { User, Sparkles } from "lucide-react";
import { marked } from "marked";
import { useMemo } from "react";

interface MessageBubbleProps {
  message: UIMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  const text = useMemo(() => {
    return message.parts
      ?.filter((part): part is Extract<typeof part, { type: "text" }> => part.type === "text")
      .map((part) => part.text)
      .join("") ?? "";
  }, [message.parts]);

  const htmlContent = useMemo(() => {
    if (isUser) return null;
    return marked.parse(text) as string;
  }, [text, isUser]);

  return (
    <div className="flex gap-3">
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-0.5 ${
          isUser
            ? "bg-primary text-primary-content"
            : "bg-base-300 text-base-content"
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-base-content/50 mb-1">
          {isUser ? "You" : "AI Assistant"}
        </p>
        {isUser ? (
          <p className="text-sm text-base-content leading-relaxed whitespace-pre-wrap">
            {text}
          </p>
        ) : (
          <div
            className="prose prose-sm max-w-none text-base-content prose-headings:text-base-content prose-p:text-base-content/90 prose-strong:text-base-content prose-code:text-primary prose-code:bg-base-300 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-pre:bg-base-300 prose-pre:border prose-pre:border-neutral"
            dangerouslySetInnerHTML={{ __html: htmlContent ?? "" }}
          />
        )}
      </div>
    </div>
  );
}
