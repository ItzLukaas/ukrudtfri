"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";

type Props = Omit<ComponentProps<typeof Link>, "href"> & { href: string };

/** Smooth scroll til sektion når man allerede er på forsiden; ellers normal navigation. */
export function HomeSectionLink({ href, onClick, ...props }: Props) {
  const pathname = usePathname();

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    onClick?.(e);
    if (e.defaultPrevented || pathname !== "/" || !href.startsWith("/#")) return;
    const id = href.slice(2);
    if (!id) return;
    e.preventDefault();
    requestAnimationFrame(() => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      document.getElementById(id)?.scrollIntoView({
        behavior: reduce ? "auto" : "smooth",
        block: "start",
      });
    });
    window.history.pushState(null, "", href);
  }

  return <Link href={href} scroll={false} onClick={handleClick} {...props} />;
}
