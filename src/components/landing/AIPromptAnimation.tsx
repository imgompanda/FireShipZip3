"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Sparkles, User } from "lucide-react";
import { useTranslations } from "next-intl";

export function AIPromptAnimation() {
  const t = useTranslations("Landing.features.aiAnimation");

  // Animation states
  const [typedPrompt, setTypedPrompt] = useState("");
  const [showResponse, setShowResponse] = useState(false);
  const [typedResponse, setTypedResponse] = useState("");
  const [isTypingPrompt, setIsTypingPrompt] = useState(true);

  const fullPrompt = t("prompt");
  const fullResponse = t("response");

  // Typewriter effect logic
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (isTypingPrompt) {
      if (typedPrompt.length < fullPrompt.length) {
        timeout = setTimeout(() => {
          setTypedPrompt(fullPrompt.slice(0, typedPrompt.length + 1));
        }, 50); // Typing speed for prompt
      } else {
        // Finished typing prompt, wait before showing response
        timeout = setTimeout(() => {
          setIsTypingPrompt(false);
          setShowResponse(true);
        }, 800);
      }
    } else if (showResponse) {
      if (typedResponse.length < fullResponse.length) {
        timeout = setTimeout(() => {
          setTypedResponse(fullResponse.slice(0, typedResponse.length + 1));
        }, 30); // Typing speed for response (faster)
      } else {
        // Finished cycle, wait and restart
        timeout = setTimeout(() => {
          // Optional: Restart loop or keep static.
          // For now, let's keep it static to not be distracting, or restart after a long pause.
          // Let's restart after 5 seconds to show it again to new visitors scrolling by.
          setTimeout(() => {
            setTypedPrompt("");
            setTypedResponse("");
            setIsTypingPrompt(true);
            setShowResponse(false);
          }, 5000);
        }, 1000);
      }
    }

    return () => clearTimeout(timeout);
  }, [
    typedPrompt,
    isTypingPrompt,
    showResponse,
    typedResponse,
    fullPrompt,
    fullResponse,
  ]);

  return (
    <div className="w-full max-w-3xl mx-auto mb-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="rounded-xl overflow-hidden bg-base-200 border border-neutral shadow-2xl shadow-primary/10"
      >
        {/* Terminal Header */}
        <div className="bg-base-300 px-4 py-2 flex items-center justify-between border-b border-neutral">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <div className="text-xs text-base-content/50 font-mono flex items-center gap-1.5">
            <Terminal className="w-3 h-3" />
            <span>AI Onboarding Manager</span>
          </div>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>

        {/* Terminal Content */}
        <div className="p-6 font-mono text-sm md:text-base min-h-[200px] flex flex-col gap-6">
          {/* User Prompt Line */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 mt-1">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
            </div>
            <div className="flex-1 space-y-1">
              <div className="text-xs text-base-content/50 font-bold mb-1">
                {t("user")}
              </div>
              <div className="text-base-content">
                {typedPrompt}
                {isTypingPrompt && (
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="inline-block w-2 h-4 bg-primary ml-1 align-middle"
                  />
                )}
              </div>
            </div>
          </div>

          {/* AI Response Line */}
          <AnimatePresence>
            {showResponse && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-4"
              >
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-secondary" />
                  </div>
                </div>
                <div className="flex-1 space-y-1">
                  <div className="text-xs text-secondary font-bold mb-1 flex items-center gap-1">
                    {t("ai")}
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-secondary/20 border border-secondary/30">
                      Thinking...
                    </span>
                  </div>
                  <div className="text-base-content/70 leading-relaxed">
                    {typedResponse}
                    {!isTypingPrompt &&
                      showResponse &&
                      typedResponse.length < fullResponse.length && (
                        <motion.span
                          animate={{ opacity: [1, 0] }}
                          transition={{ repeat: Infinity, duration: 0.8 }}
                          className="inline-block w-2 h-4 bg-secondary ml-1 align-middle"
                        />
                      )}
                  </div>

                  {/* File Attachment Visualization (appears after response starts) */}
                  {typedResponse.length > 10 && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 flex items-center gap-2 p-2 rounded bg-neutral border border-base-content/20 w-fit"
                    >
                      <div className="w-6 h-6 bg-primary/30 rounded flex items-center justify-center text-xs font-bold text-primary">
                        MD
                      </div>
                      <span className="text-xs text-base-content/50">docs/llm.md</span>
                      <span className="text-[10px] text-success ml-2">
                        ● Loaded
                      </span>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
