"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarDays, Menu } from "lucide-react";
import { HomeSectionLink } from "@/components/home-section-link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SECTION_LINKS = [
  ["/", "Hjem"],
  ["/#fordele", "Fordele"],
  ["/#proces", "Proces"],
  ["/#om-os", "Om os"],
  ["/kontakt", "Kontakt os"],
  ["/#faq", "FAQ"],
] as const;

const navLinkClass =
  "flex min-h-12 items-center rounded-lg px-4 text-base font-medium text-foreground transition-colors hover:bg-muted";

export function SiteMobileNav() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-11 shrink-0 md:hidden"
            aria-label="Åbn navigation"
          />
        }
      >
        <Menu className="size-5" aria-hidden />
      </SheetTrigger>
      <SheetContent side="right" className="w-[min(100%,20rem)] gap-0 p-0 sm:max-w-sm">
        <SheetHeader className="border-b border-border px-4 py-4 text-left">
          <SheetTitle>Navigation</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 p-3" aria-label="Mobil navigation">
          {SECTION_LINKS.map(([href, label]) => (
            <HomeSectionLink key={href} href={href} className={navLinkClass} onClick={close}>
              {label}
            </HomeSectionLink>
          ))}
          <Link
            href="/booking"
            className={cn(
              buttonVariants({ size: "lg" }),
              "mt-2 min-h-12 w-full justify-center rounded-xl font-semibold shadow-sm",
            )}
            onClick={close}
          >
            <CalendarDays className="size-4" aria-hidden />
            Book tid
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
