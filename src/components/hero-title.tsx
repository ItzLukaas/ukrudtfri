"use client";

import { useEffect, useRef, useState } from "react";

const WORDS = ["velplejet", "ensartet", "velholdt", "naturlig"] as const;

export function HeroTitle() {
  const firstLineRef = useRef<HTMLSpanElement>(null);
  const [lineWidth, setLineWidth] = useState<number | null>(null);
  const [wordIndex, setWordIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const el = firstLineRef.current;
    if (!el) return;

    const measure = () => setLineWidth(el.getBoundingClientRect().width);
    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

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
      <span ref={firstLineRef} className="block">
        Få en flot, tæt og
      </span>
      <span className="mt-1 block text-[0.88em] text-primary sm:text-[0.9em]" style={lineWidth ? { width: `${lineWidth}px` } : undefined}>
        <span
          className="inline-block whitespace-nowrap align-baseline transition-all duration-200 ease-out"
          style={{ opacity: isVisible ? 1 : 0, transform: `translateY(${isVisible ? "0" : "4px"})` }}
        >
          {currentWord} græsplæne
        </span>
      </span>
    </h1>
  );
}
