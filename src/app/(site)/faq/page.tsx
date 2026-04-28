import type { Metadata } from "next";
import Link from "next/link";
import { SITE_BRAND, SITE_URL } from "@/lib/site-config";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "FAQ om certificeret plænesprøjtning",
  description:
    "Læs svar om priser, sæson og godkendte midler ved certificeret plænesprøjtning i Give, Grindsted, Brande og Vejle.",
  alternates: { canonical: `${SITE_URL}/faq` },
  openGraph: {
    url: `${SITE_URL}/faq`,
    title: `FAQ om certificeret plænesprøjtning · ${SITE_BRAND}`,
    description:
      "Læs svar om priser, sæson og godkendte midler ved certificeret plænesprøjtning i Give, Grindsted, Brande og Vejle.",
  },
};

const questions = [
  {
    q: "Hvornår på året starter behandlingerne?",
    a: "Vi starter typisk, når jordtemperaturen ligger omkring 8 grader. Her giver en tidlig indsats mod ukrudt bedst effekt.",
  },
  {
    q: "Hvordan beregnes prisen?",
    a: "Prisen beregnes efter areal. Standardpris er fra 1,5 kr./m² med en minimumspris på 300 kr.",
  },
  {
    q: "Hvilket område dækker I?",
    a: "Vi dækker blandt andet Give, Grindsted, Brande, Vejle og nærliggende byer. Vi bekræfter altid adressen ved booking.",
  },
  {
    q: "Bruger I godkendte produkter?",
    a: "Ja. Vi bruger godkendte midler og udfører behandlingen med de nødvendige certificeringer.",
  },
] as const;

export default function FaqPage() {
  return (
    <main className="bg-background">
      <section className="border-b border-border/60 bg-muted/30">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">FAQ</p>
          <h1 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">Ofte stillede spørgsmål</h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Her finder du hurtige svar om behandling, pris, dækning og booking.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-4xl px-4 py-10 sm:py-14">
        <div className="space-y-3">
          {questions.map((item) => (
            <details key={item.q} className="group rounded-xl border border-border bg-background px-5 py-4">
              <summary className="cursor-pointer list-none text-base font-semibold text-foreground marker:hidden">
                <span className="flex min-h-12 items-center justify-between gap-4 py-1">
                  {item.q}
                  <span className="shrink-0 text-muted-foreground transition-transform group-open:rotate-45" aria-hidden>
                    +
                  </span>
                </span>
              </summary>
              <p className="mt-3 pr-8 text-sm leading-relaxed text-muted-foreground sm:text-base">{item.a}</p>
            </details>
          ))}
        </div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/kontakt" className={cn(buttonVariants({ variant: "outline" }), "min-h-11 rounded-lg px-6")}>
            Kontakt os
          </Link>
          <Link href="/booking" className={cn(buttonVariants(), "min-h-11 rounded-lg px-6")}>
            Book din tid
          </Link>
        </div>
      </section>
    </main>
  );
}
