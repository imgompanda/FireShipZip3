"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useRef, useEffect, useState } from "react";
import { Send, Square, Sparkles, ArrowUp } from "lucide-react";
import { MessageBubble } from "./MessageBubble";
import { useTranslations } from "next-intl";

const chatTransport = new DefaultChatTransport({
  api: "/api/ai/chat",
});

export function ChatInterface() {
  const t = useTranslations("AI.chat");
  const { messages, sendMessage, status, stop } =
    useChat({
      transport: chatTransport,
    });

  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isStreaming = status === "streaming";
  const isLoading = status === "submitted";

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 200) + "px";
    }
  }, [input]);

  const handleSend = () => {
    if (input.trim()) {
      sendMessage({ text: input });
      setInput("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {!hasMessages ? (
          /* Empty State - ChatGPT style centered */
          <div className="flex flex-col items-center justify-center h-full px-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
              <Sparkles className="w-7 h-7 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold text-base-content mb-2">
              {t("startConversation")}
            </h2>
            <p className="text-base-content/50 text-sm mb-8">
              {t("typeToBegin")}
            </p>

            {/* Suggestion chips */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg w-full">
              {[
                "Tell me about this project",
                "Help me write a component",
                "Explain how authentication works",
                "Generate a landing page idea",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    setInput(suggestion);
                    textareaRef.current?.focus();
                  }}
                  className="text-left px-4 py-3 rounded-xl border border-neutral bg-base-200/50 text-sm text-base-content/70 hover:bg-base-200 hover:border-base-content/20 transition-all"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Messages - centered column like ChatGPT */
          <div className="max-w-3xl mx-auto w-full px-4 py-6 space-y-6">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-base-300 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                </div>
                <div className="bg-base-200 rounded-2xl px-4 py-3">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 bg-base-content/30 rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-base-content/30 rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-2 h-2 bg-base-content/30 rounded-full animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>
        )}
      </div>

      {/* Input Area - ChatGPT style floating input */}
      <div className="border-t border-neutral bg-base-100">
        <div className="max-w-3xl mx-auto w-full px-4 py-4">
          <div className="relative flex items-end gap-2 bg-base-200 rounded-2xl border border-neutral focus-within:border-primary/50 transition-colors px-4 py-3">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t("placeholder")}
              className="flex-1 bg-transparent text-base-content placeholder:text-base-content/40 resize-none outline-none text-sm leading-relaxed min-h-[24px] max-h-[200px]"
              rows={1}
            />
            {isStreaming ? (
              <button
                type="button"
                onClick={stop}
                className="flex-shrink-0 w-8 h-8 rounded-lg bg-error text-error-content flex items-center justify-center hover:brightness-110 transition-all"
                title={t("stopGenerating")}
              >
                <Square className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary text-primary-content flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:brightness-110 transition-all"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            )}
          </div>
          <p className="text-[11px] text-base-content/30 text-center mt-2">
            AI can make mistakes. Check important info.
          </p>
        </div>
      </div>
    </div>
  );
}
