"use client";

import { useChat } from "@ai-sdk/react";
import { useRef, useEffect } from "react";
import { Send, Square, MessageSquare } from "lucide-react";
import { MessageBubble } from "./MessageBubble";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export function ChatInterface() {
  const t = useTranslations("AI.chat");
  const { messages, input, handleInputChange, handleSubmit, status, stop } =
    useChat({
      api: "/api/ai/chat",
    });

  const scrollRef = useRef<HTMLDivElement>(null);

  const isStreaming = status === "streaming";
  const isLoading = status === "submitted";

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input?.trim()) {
        handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto min-h-0 p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-base-content/40">
            <MessageSquare className="w-12 h-12 mb-4" />
            <p className="text-lg font-medium">{t("startConversation")}</p>
            <p className="text-sm mt-1">{t("typeToBegin")}</p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        )}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-base-200 flex items-center justify-center">
              <span className="loading loading-dots loading-xs" />
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-neutral p-4">
        <form onSubmit={handleSubmit} className="flex gap-2 items-end">
          <textarea
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={t("placeholder")}
            className="textarea textarea-bordered flex-1 min-h-[44px] max-h-[120px] resize-none bg-base-200 text-base-content border-neutral focus:border-primary"
            rows={1}
          />
          {isStreaming ? (
            <Button
              type="button"
              onClick={stop}
              variant="destructive"
              size="icon"
              className="h-11 w-11"
              title={t("stopGenerating")}
            >
              <Square className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={!input?.trim() || isLoading}
              size="icon"
              className="h-11 w-11"
            >
              <Send className="w-4 h-4" />
            </Button>
          )}
        </form>
      </div>
    </div>
  );
}
