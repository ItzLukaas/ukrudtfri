"use client";

import { Fragment, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HomeSectionLink } from "@/components/home-section-link";
import { SiteMobileNav } from "@/components/site-mobile-nav";
import { CalendarCheck2, Mail, MapPin, Phone, X } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SiteHeader({ baseLabel, baseLatitude, baseLongitude }: { baseLabel: string; baseLatitude: number; baseLongitude: number }) {
  const [topbarOpen, setTopbarOpen] = useState(true);
  const topbarAddress = baseLabel === "Give, Danmark" ? "Hyldevang 44, Give" : baseLabel;
  const mapHref = `https://maps.google.com/?q=${encodeURIComponent(`${baseLatitude},${baseLongitude} (${topbarAddress})`)}`;

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90">
      {topbarOpen ? (
        <div className="relative border-b border-[#174430] bg-[#082e1e]">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-2 pr-12 text-xs text-[#d7e3da] sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:pr-14 sm:text-sm">
          <Link
            href="/kontakt#kontakt-form"
            className="min-w-0 text-pretty leading-snug text-[#d7e3da] transition-colors hover:text-white"
          >
            Book sprøjtning af din græsplæne på under 2 min
          </Link>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] sm:shrink-0 sm:gap-x-4 sm:text-sm">
            <a
              href="tel:+4541820046"
              className="inline-flex min-h-10 items-center gap-1 text-[#d7e3da] transition-colors hover:text-white"
            >
              <Phone className="size-3.5 shrink-0 text-[#d7e3da]" aria-hidden />
              +45 41 82 00 46
            </a>
            <a
              href="/kontakt#kontakt-form"
              className="inline-flex min-h-10 min-w-0 items-center gap-1 whitespace-nowrap text-[#d7e3da] transition-colors hover:text-white"
            >
              <Mail className="size-3.5 shrink-0 text-[#d7e3da]" aria-hidden />
              <span className="truncate">Skriv til os</span>
            </a>
            <a
              href={mapHref}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden min-h-10 min-w-0 items-center gap-1 whitespace-nowrap text-[#d7e3da] transition-colors hover:text-white sm:inline-flex"
            >
              <MapPin className="size-3.5 shrink-0 text-[#d7e3da]" aria-hidden />
              <span className="truncate">{topbarAddress}</span>
            </a>
          </div>
        </div>
          <button
            type="button"
            onClick={() => setTopbarOpen(false)}
            aria-label="Luk topbar"
            className="absolute right-2 top-1/2 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full text-[#d7e3da]/90 transition-colors hover:bg-white/10 hover:text-white sm:right-3"
          >
            <X className="size-3.5" aria-hidden />
          </button>
        </div>
      ) : null}
      <div className="mx-auto flex w-full max-w-6xl items-center gap-2 px-4 py-3 sm:gap-3 md:gap-4">
        <Link href="/" className="min-w-0 shrink-0" aria-label="Ukrudtfri">
          <Image
            src="/images/logo.png"
            alt="Ukrudtfri"
            width={280}
            height={76}
            priority
            className="h-14 w-auto scale-110 object-contain sm:h-16"
          />
        </Link>

        <nav
          className="mx-auto hidden min-w-0 flex-1 flex-wrap items-center justify-center gap-y-2 text-sm text-muted-foreground md:flex"
          aria-label="Sektioner på forsiden"
        >
          {(
            [
              ["/", "Hjem"],
              ["/#fordele", "Fordele"],
              ["/#proces", "Proces"],
              ["/#om-os", "Om os"],
              ["/kontakt", "Kontakt os"],
              ["/#faq", "FAQ"],
            ] as const
          ).map(([href, label], i) => (
            <Fragment key={href}>
              {i > 0 ? (
                <span className="select-none px-3 text-muted-foreground/25 sm:px-4 lg:px-5" aria-hidden>
                  ·
                </span>
              ) : null}
              <HomeSectionLink href={href} className="whitespace-nowrap transition-colors hover:text-foreground">
                {label}
              </HomeSectionLink>
            </Fragment>
          ))}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <SiteMobileNav />
          <Link
            className={cn(
              buttonVariants({ size: "lg", variant: "outline" }),
              "hidden min-h-11 rounded-full border-[2px] border-primary bg-background px-5 text-base font-semibold text-primary shadow-sm hover:bg-primary/5 lg:inline-flex",
            )}
            href="tel:+4541820046"
          >
            <Phone className="size-4" aria-hidden />
            41 82 00 46
          </Link>
          <Link
            className={cn(
              buttonVariants({ size: "lg" }),
              "hidden min-h-11 rounded-full bg-primary px-6 text-base font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 sm:inline-flex",
            )}
            href="/booking"
          >
            <CalendarCheck2 className="size-4" aria-hidden />
            Book din tid
          </Link>
        </div>
      </div>
    </header>
  );
}

