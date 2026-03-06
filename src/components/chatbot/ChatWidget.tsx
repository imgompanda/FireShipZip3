"use client";

import { useState, useEffect, useMemo } from "react";
import { ChatModal } from "./ChatModal";
import { ChatBubble } from "./ChatBubble";

interface ChatWidgetProps {
  greeting?: string;
  language?: string;
  brandColor?: string;
}

export function ChatWidget({
  greeting,
  language = "ko",
  brandColor = "#FFBE1A",
}: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showBubble, setShowBubble] = useState(false);

  // 15초 후 인사 말풍선 표시
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) setShowBubble(true);
    }, 15000);
    return () => clearTimeout(timer);
  }, [isOpen]);

  // 세션 ID 생성 (탭별 고유)
  const sessionId = useMemo(() => {
    if (typeof window === "undefined") return "";
    const key = "chatbot_session_id";
    let id = sessionStorage.getItem(key);
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem(key, id);
    }
    return id;
  }, []);

  // 방문자 컨텍스트
  const visitorContext = useMemo(() => {
    if (typeof window === "undefined") return {};
    const params = new URLSearchParams(window.location.search);
    return {
      referrer: document.referrer,
      page_url: window.location.href,
      page_path: window.location.pathname,
      utm_source: params.get("utm_source"),
      utm_medium: params.get("utm_medium"),
      utm_campaign: params.get("utm_campaign"),
      device_type: window.innerWidth < 768 ? "mobile" : "desktop",
      started_at: new Date().toISOString(),
    };
  }, []);

  const defaultGreeting =
    language === "ko"
      ? "안녕하세요! 궁금한 점이 있으시면 편하게 물어보세요."
      : "Hi! Feel free to ask me anything.";

  return (
    <>
      {/* 채팅 모달 */}
      {isOpen && (
        <ChatModal
          sessionId={sessionId}
          language={language}
          visitorContext={visitorContext}
          greeting={greeting || defaultGreeting}
          brandColor={brandColor}
          onClose={() => setIsOpen(false)}
        />
      )}

      {/* 인사 말풍선 */}
      {showBubble && !isOpen && (
        <div
          className="fixed bottom-24 right-6 z-[999] max-w-[260px] animate-fade-in cursor-pointer"
          onClick={() => {
            setShowBubble(false);
            setIsOpen(true);
          }}
        >
          <div className="bg-base-200 border border-neutral rounded-2xl rounded-br-sm px-4 py-3 text-sm text-base-content shadow-lg">
            {greeting || defaultGreeting}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowBubble(false);
            }}
            className="absolute -top-2 -right-2 w-5 h-5 bg-base-300 rounded-full text-xs flex items-center justify-center hover:bg-base-content/20"
          >
            &times;
          </button>
        </div>
      )}

      {/* 챗봇 버튼 */}
      <ChatBubble
        isOpen={isOpen}
        brandColor={brandColor}
        onClick={() => {
          setShowBubble(false);
          setIsOpen(!isOpen);
        }}
      />
    </>
  );
}
