"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { ContactForm } from "./ContactForm";

function getTextContent(msg: { parts?: Array<{ type: string; text?: string }>; content?: string }): string {
  if (msg.content) return msg.content;
  return msg.parts?.filter((p) => p.type === "text").map((p) => p.text ?? "").join("") ?? "";
}

interface ChatModalProps {
  sessionId: string;
  language: string;
  visitorContext: Record<string, unknown>;
  greeting: string;
  brandColor?: string;
  onClose: () => void;
}

export function ChatModal({
  sessionId,
  language,
  visitorContext,
  greeting,
  brandColor = "oklch(var(--p))",
  onClose,
}: ChatModalProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");

  const [transport] = useState(
    () =>
      new DefaultChatTransport({
        api: "/api/chatbot",
        body: { sessionId, language, visitorContext },
      })
  );

  const { messages: chatMessages, sendMessage, status } = useChat({
    transport,
  });

  const greetingMessage = {
    id: "greeting",
    role: "assistant" as const,
    content: greeting,
    parts: [{ type: "text" as const, text: greeting }],
  };

  const messages = [greetingMessage, ...chatMessages];

  // 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const isStreaming = status === "streaming" || status === "submitted";

  // 리드 수집 트리거 감지 (AI가 연락처 관련 키워드 언급 시)
  const CONTACT_TRIGGERS = [
    "이메일",
    "email",
    "연락처",
    "contact",
    "이름",
    "name",
    "전화",
    "phone",
  ];
  const lastBotMsg = [...messages]
    .reverse()
    .find((m) => m.role === "assistant");
  const showContactForm =
    lastBotMsg &&
    messages.length >= 4 &&
    CONTACT_TRIGGERS.some((kw) =>
      getTextContent(lastBotMsg).toLowerCase().includes(kw)
    );

  return (
    <div className="fixed bottom-24 right-6 z-[999] w-[380px] max-h-[560px] flex flex-col bg-base-100 border border-neutral rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ backgroundColor: brandColor }}
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="font-semibold text-black text-sm">
            AI Assistant
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-black/60 hover:text-black transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-[300px] max-h-[380px]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "rounded-br-sm text-black"
                  : "bg-base-200 text-base-content rounded-bl-sm"
              }`}
              style={
                msg.role === "user"
                  ? { backgroundColor: brandColor }
                  : undefined
              }
            >
              {getTextContent(msg)}
            </div>
          </div>
        ))}

        {isStreaming && messages[messages.length - 1]?.role === "user" && (
          <div className="flex justify-start">
            <div className="bg-base-200 rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-base-content/30 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-base-content/30 rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-2 h-2 bg-base-content/30 rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}

        {/* 리드 수집 폼 */}
        {showContactForm && (
          <ContactForm
            sessionId={sessionId}
            brandColor={brandColor}
            language={language}
          />
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (input.trim()) {
            sendMessage({ text: input });
            setInput("");
          }
        }}
        className="border-t border-neutral px-3 py-2 flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            language === "ko"
              ? "메시지를 입력하세요..."
              : "Type a message..."
          }
          className="flex-1 bg-transparent text-sm text-base-content placeholder:text-base-content/40 outline-none"
          disabled={isStreaming}
        />
        <button
          type="submit"
          disabled={!input.trim() || isStreaming}
          className="p-1.5 rounded-lg transition-colors disabled:opacity-30"
          style={{ color: brandColor }}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </form>
    </div>
  );
}
