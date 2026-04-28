"use client";

import rough from "roughjs";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/** Samme grøn som hero-understregning (`globals.css` --primary) */
const PRIMARY_HEX = "#5b8931";

const FRAME_SEED = 91423;

/** Afrundet rektangel (kvadratiske hjørner) — rough.js gør den håndtegnet. */
function roundedRectPath(w: number, h: number, cornerRadius: number, inset: number) {
  const x = inset;
  const y = inset;
  const ww = w - inset * 2;
  const hh = h - inset * 2;
  const cr = Math.max(0, Math.min(cornerRadius, ww / 2 - 0.5, hh / 2 - 0.5));
  if (cr <= 0) {
    return `M ${x} ${y} H ${x + ww} V ${y + hh} H ${x} Z`;
  }
  return [
    `M ${x + cr} ${y}`,
    `H ${x + ww - cr}`,
    `Q ${x + ww} ${y} ${x + ww} ${y + cr}`,
    `V ${y + hh - cr}`,
    `Q ${x + ww} ${y + hh} ${x + ww - cr} ${y + hh}`,
    `H ${x + cr}`,
    `Q ${x} ${y + hh} ${x} ${y + hh - cr}`,
    `V ${y + cr}`,
    `Q ${x} ${y} ${x + cr} ${y}`,
    "Z",
  ].join(" ");
}

/** Håndtegnet ramme med bløde hjørner (rough.js), samme grøn som hero-understregning. */
export function SketchGreenFrame({ children, className }: { children: React.ReactNode; className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const svg = svgRef.current;
    if (!wrap || !svg) return;

    const draw = () => {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      if (w < 4 || h < 4) return;

      while (svg.firstChild) {
        svg.removeChild(svg.firstChild);
      }

      svg.setAttribute("width", String(w));
      svg.setAttribute("height", String(h));
      svg.setAttribute("viewBox", `0 0 ${w} ${h}`);

      const corner = Math.min(32, Math.max(14, Math.min(w, h) * 0.07));
      const inset = 1;
      const d = roundedRectPath(w, h, corner, inset);

      const rc = rough.svg(svg);
      const node = rc.path(d, {
        stroke: PRIMARY_HEX,
        strokeWidth: 2,
        roughness: 1.05,
        bowing: 0.45,
        fill: "none",
        seed: FRAME_SEED,
      });
      svg.appendChild(node);
    };

    const mountId = window.setTimeout(draw, 0);
    let resizeTimer: ReturnType<typeof setTimeout>;
    const ro = new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(draw, 80);
    });
    ro.observe(wrap);

    return () => {
      clearTimeout(mountId);
      clearTimeout(resizeTimer);
      ro.disconnect();
    };
  }, []);

  return (
    <div ref={wrapRef} className={cn("relative", className)}>
      {children}
      <svg
        ref={svgRef}
        className="pointer-events-none absolute inset-0 overflow-visible"
        aria-hidden
      />
    </div>
  );
}
