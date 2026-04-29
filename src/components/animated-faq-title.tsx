"use client";

import { useEffect, useRef, useState } from "react";

export function AnimatedFaqTitle() {
  const ref = useRef<HTMLSpanElement>(null);
  const [showLine, setShowLine] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShowLine(true);
            io.disconnect();
            break;
          }
        }
      },
      { root: null, threshold: 0.35, rootMargin: "0px 0px -10% 0px" },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <span ref={ref} className="relative inline-block pb-2">
      Ofte stillede spørgsmål
      <span
        aria-hidden
        className={`absolute bottom-0 left-0 h-[3px] w-full origin-left rounded-full bg-primary/80 transition-transform duration-500 ease-out ${
          showLine ? "scale-x-100" : "scale-x-0"
        }`}
      />
    </span>
  );
}
