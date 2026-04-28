import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BadgeCheck } from "lucide-react";
import { SITE_BRAND, SITE_URL } from "@/lib/site-config";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Om os: certificeret plænesprøjtning lokalt",
  description:
    "Lær Ukrudtfri.dk at kende. Vi leverer certificeret plænesprøjtning med personlig service i Give, Grindsted, Brande og Vejle.",
  alternates: { canonical: `${SITE_URL}/om-os` },
  openGraph: {
    url: `${SITE_URL}/om-os`,
    title: `Om os: certificeret plænesprøjtning lokalt · ${SITE_BRAND}`,
    description:
      "Lær Ukrudtfri.dk at kende. Vi leverer certificeret plænesprøjtning med personlig service i Give, Grindsted, Brande og Vejle.",
  },
};

const highlights = [
  "Certificeret udførelse med godkendte midler",
  "Personlig kontakt før, under og efter behandling",
  "Lokal dækning i Give, Grindsted, Brande, Vejle og nærliggende byer",
  "Pris fra 1,5 kr./m² og betaling efter udført arbejde",
] as const;

export default function AboutPage() {
  return (
    <main className="bg-background">
      <section className="border-b border-border/60 bg-muted/25">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Om os</p>
          <h1 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">Lokal service med faglig kvalitet</h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {SITE_BRAND} er en mindre, privat forretning med fokus på grundig og certificeret behandling af græsplæner i
            Jylland.
          </p>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-10 sm:py-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="space-y-5">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Det får du hos os</h2>
          <ul className="space-y-2">
            {highlights.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-base text-muted-foreground">
                <BadgeCheck className="mt-1 size-4 shrink-0 text-primary" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/kontakt" className={cn(buttonVariants({ variant: "outline" }), "min-h-11 rounded-lg px-6")}>
              Kontakt os
            </Link>
            <Link href="/booking" className={cn(buttonVariants(), "min-h-11 rounded-lg px-6")}>
              Book din tid
            </Link>
          </div>
        </div>
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-border/70 bg-muted">
          <Image src="/images/image-5.webp" alt="Tæt og grøn græsplæne" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 45vw" />
        </div>
      </section>
    </main>
  );
}
