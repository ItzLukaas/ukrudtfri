"use client";

import { useEffect, useState } from "react";

const WORDS = ["velplejet", "ensartet", "velholdt", "naturlig"] as const;

export function HeroTitle() {
  const [wordIndex, setWordIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const cycleId = window.setInterval(() => {
      setIsVisible(false);
      window.setTimeout(() => {
        setWordIndex((i) => (i + 1) % WORDS.length);
        setIsVisible(true);
      }, 220);
    }, 2200);

    return () => clearInterval(cycleId);
  }, []);

  const currentWord = WORDS[wordIndex];

  return (
    <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
      <span className="block">
        Få en flot, tæt og
      </span>
      <span className="mt-1 block text-[0.88em] text-primary sm:text-[0.9em]">
        <span
          className={
            isVisible
              ? "inline-block whitespace-nowrap align-baseline transition-all duration-200 ease-out opacity-100 translate-y-0"
              : "inline-block whitespace-nowrap align-baseline transition-all duration-200 ease-out opacity-0 translate-y-1"
          }
        >
          {currentWord} græsplæne
        </span>
      </span>
    </h1>
  );
}
