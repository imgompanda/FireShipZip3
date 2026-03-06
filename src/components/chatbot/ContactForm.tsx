"use client";

import { useState } from "react";

interface ContactFormProps {
  sessionId?: string;
  brandColor?: string;
  language?: string;
}

export function ContactForm({
  brandColor = "var(--color-primary)",
  language = "ko",
}: ContactFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    // AI가 collect_contact tool을 통해 처리하므로
    // 여기서는 UI 상태만 관리
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-base-200 rounded-xl p-3 text-center">
        <span className="text-sm text-base-content/60">
          {language === "ko"
            ? "감사합니다! 곧 연락드릴게요."
            : "Thank you! We'll be in touch soon."}
        </span>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-base-200 rounded-xl p-3 space-y-2"
    >
      <p className="text-xs text-base-content/60 mb-1">
        {language === "ko"
          ? "연락처를 남겨주시면 더 자세히 안내해드릴게요"
          : "Leave your contact info for personalized help"}
      </p>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={language === "ko" ? "이름" : "Name"}
        className="w-full bg-base-100 border border-neutral rounded-lg px-3 py-1.5 text-sm text-base-content placeholder:text-base-content/40 outline-none"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={language === "ko" ? "이메일" : "Email"}
        required
        className="w-full bg-base-100 border border-neutral rounded-lg px-3 py-1.5 text-sm text-base-content placeholder:text-base-content/40 outline-none"
      />
      <button
        type="submit"
        className="w-full py-1.5 rounded-lg text-sm font-medium text-primary-content transition-opacity hover:opacity-90"
        style={{ backgroundColor: brandColor }}
      >
        {language === "ko" ? "보내기" : "Submit"}
      </button>
    </form>
  );
}
