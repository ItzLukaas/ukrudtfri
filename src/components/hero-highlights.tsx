"use client";

import { useEffect, useRef, useState } from "react";
import { Leaf, MapPin, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function formatDa(n: number) {
  return new Intl.NumberFormat("da-DK").format(n);
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

function CountingValue({
  target,
  suffix,
  durationMs,
  started,
  reducedMotion,
  startDelayMs,
  staticText,
}: {
  target: number;
  suffix: string;
  durationMs: number;
  started: boolean;
  reducedMotion: boolean;
  startDelayMs: number;
  staticText?: string;
}) {
  if (staticText) {
    return <p className="text-[2.15rem] font-semibold leading-none tracking-tight tabular-nums sm:text-[2.25rem]">{staticText}</p>;
  }

  const [value, setValue] = useState(0);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (!started) return;
    if (reducedMotion) {
      setValue(target);
      setArmed(true);
      return;
    }
    const id = window.setTimeout(() => setArmed(true), startDelayMs);
    return () => clearTimeout(id);
  }, [started, target, reducedMotion, startDelayMs]);

  useEffect(() => {
    if (!armed) return;
    if (reducedMotion) {
      setValue(target);
      return;
    }

    let raf = 0;
    const t0 = performance.now();

    const tick = (now: number) => {
      const elapsed = now - t0;
      const p = Math.min(elapsed / durationMs, 1);
      const eased = easeOutCubic(p);
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setValue(target);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [armed, target, durationMs, reducedMotion]);

  const text = `${formatDa(value)}${suffix}`;

  return (
    <p className="text-[2.15rem] font-semibold leading-none tracking-tight tabular-nums sm:text-[2.25rem]" aria-live="polite">
      {text}
    </p>
  );
}

const STATS = [
  {
    target: 0,
    suffix: "",
    staticText: "Lokal",
    label: "Service i Vejle og omegn",
    durationMs: 0,
    delayMs: 0,
    icon: <MapPin className="size-7" aria-hidden />,
  },
  {
    target: 100,
    suffix: "%",
    label: "Tilfredshedsgaranti",
    durationMs: 1200,
    delayMs: 120,
    icon: <ShieldCheck className="size-7" aria-hidden />,
  },
  {
    target: 0,
    suffix: "",
    staticText: "Tryg",
    label: "Godkendte produkter",
    durationMs: 0,
    delayMs: 240,
    icon: <Leaf className="size-7" aria-hidden />,
  },
] as const;

export function HeroHighlights({ className }: { className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    if (reducedMotion) {
      setStarted(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setStarted(true);
            io.disconnect();
            break;
          }
        }
      },
      { root: null, rootMargin: "0px 0px -10% 0px", threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reducedMotion]);

  return (
    <div ref={rootRef} className={cn("grid gap-3.5 md:grid-cols-3", className)}>
      {STATS.map((item) => (
        <div
          key={item.label}
          className="reveal-up flex min-h-28 items-center justify-between rounded-lg border border-[#aec9b6] bg-[#c7ddcd] px-7 py-5 text-[#1f3a27] shadow-[0_1px_0_rgba(0,0,0,0.03)]"
        >
          <div>
            <CountingValue
              target={item.target}
              suffix={item.suffix}
              durationMs={item.durationMs}
              started={started}
              reducedMotion={reducedMotion}
              startDelayMs={item.delayMs}
              staticText={"staticText" in item ? item.staticText : undefined}
            />
            <p className="mt-1.5 text-sm text-[#1f3a27]/75">{item.label}</p>
          </div>
          <span className="text-[#2f6a3a]/90">{item.icon}</span>
        </div>
      ))}
    </div>
  );
}
