"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface TypewriterTextProps {
  texts: string[];
  className?: string;
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
}

export function TypewriterText({
  texts,
  className = "",
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseDuration = 2000,
}: TypewriterTextProps) {
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [textIndex, setTextIndex] = useState(0);
  const cursorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Cursor blink animation
    if (cursorRef.current) {
      gsap.to(cursorRef.current, {
        opacity: 0,
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });
    }
  }, []);

  useEffect(() => {
    // Prevent index out of bounds if texts array changes
    if (texts.length === 0) return;

    const currentText = texts[textIndex % texts.length];
    let timeout: NodeJS.Timeout;

    if (!isDeleting) {
      // Typing
      if (displayText.length < currentText.length) {
        timeout = setTimeout(() => {
          setDisplayText(currentText.slice(0, displayText.length + 1));
        }, typingSpeed);
      } else {
        // Pause before deleting
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, pauseDuration);
      }
    } else {
      // Deleting
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, deletingSpeed);
      } else {
        // Move to next text
        timeout = setTimeout(() => {
          setIsDeleting(false);
          setTextIndex((prev) => (prev + 1) % texts.length);
        }, 100);
      }
    }

    return () => clearTimeout(timeout);
  }, [
    displayText,
    isDeleting,
    textIndex,
    texts,
    typingSpeed,
    deletingSpeed,
    pauseDuration,
  ]);

  return (
    <span className={className}>
      {displayText}
      <span
        ref={cursorRef}
        className="inline-block w-[3px] h-[1em] bg-current ml-1 align-middle"
      />
    </span>
  );
}
