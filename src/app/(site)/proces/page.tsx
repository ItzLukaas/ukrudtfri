import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck, CalendarDays, ClipboardCheck, Leaf } from "lucide-react";
import { SITE_BRAND, SITE_URL } from "@/lib/site-config";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Proces for certificeret plænesprøjtning",
  description:
    "Se processen fra booking til behandling med certificeret plænesprøjtning. Vi dækker Give, Grindsted, Brande og Vejle med en enkel, professionel tilgang.",
  alternates: { canonical: `${SITE_URL}/proces` },
  openGraph: {
    url: `${SITE_URL}/proces`,
    title: `Proces for certificeret plænesprøjtning · ${SITE_BRAND}`,
    description:
      "Se processen fra booking til behandling med certificeret plænesprøjtning. Vi dækker Give, Grindsted, Brande og Vejle med en enkel, professionel tilgang.",
  },
};

const steps = [
  {
    icon: CalendarDays,
    title: "1. Du booker online",
    text: "Du vælger en tid og sender de vigtigste oplysninger om adresse og areal.",
  },
  {
    icon: ClipboardCheck,
    title: "2. Vi gennemgår din booking",
    text: "Vi kontrollerer oplysningerne, vurderer opgaven og bekræfter tidspunktet.",
  },
  {
    icon: BadgeCheck,
    title: "3. Behandlingen planlægges",
    text: "Vi forbereder den rette indsats baseret på sæson, ukrudtstryk og plænens behov.",
  },
  {
    icon: Leaf,
    title: "4. Vi udfører behandlingen",
    text: "Din plæne behandles professionelt med godkendte midler og certificeret udførelse.",
  },
] as const;

export default function ProcessPage() {
  return (
    <main className="bg-background">
      <section className="border-b border-border/60 bg-muted/25">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Proces</p>
          <h1 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">En enkel proces fra start til slut</h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Vi gør det let at komme i gang med professionel ukrudtsbekæmpelse i Give, Grindsted, Brande, Vejle og
            nærliggende områder.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-14">
        <div className="grid gap-5 md:grid-cols-2">
          {steps.map(({ icon: Icon, title, text }) => (
            <Card key={title} className="border-border/70 py-0 shadow-sm">
              <CardHeader className="pb-2 pt-5">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Icon className="size-5 text-primary" aria-hidden />
                  {title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-6 text-base leading-relaxed text-muted-foreground">{text}</CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/faq" className={cn(buttonVariants({ variant: "outline" }), "min-h-11 rounded-lg px-6")}>
            Læs FAQ
          </Link>
          <Link href="/booking" className={cn(buttonVariants(), "min-h-11 rounded-lg px-6")}>
            Book din tid
          </Link>
        </div>
      </section>
    </main>
  );
}
