import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck, Leaf, ShieldCheck, Sprout } from "lucide-react";
import { SITE_BRAND, SITE_URL } from "@/lib/site-config";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Fordele ved certificeret plænesprøjtning",
  description:
    "Se fordelene ved certificeret plænesprøjtning med godkendte midler. Vi hjælper kunder i Give, Grindsted, Brande og Vejle med en tættere, grønnere plæne.",
  alternates: { canonical: `${SITE_URL}/fordele` },
  openGraph: {
    url: `${SITE_URL}/fordele`,
    title: `Fordele ved certificeret plænesprøjtning · ${SITE_BRAND}`,
    description:
      "Se fordelene ved certificeret plænesprøjtning med godkendte midler. Vi hjælper kunder i Give, Grindsted, Brande og Vejle med en tættere, grønnere plæne.",
  },
};

const benefits = [
  {
    icon: Sprout,
    title: "Målrettet bekæmpelse af ukrudt",
    text: "Vi behandler de ukrudtstyper, der typisk tager over i plænen, så græsset igen får plads til at vokse tæt.",
  },
  {
    icon: Leaf,
    title: "Flottere og mere ensartet plæne",
    text: "Tidlig og korrekt behandling giver en grønnere plæne gennem sæsonen og mindre behov for løbende nødindsatser.",
  },
  {
    icon: ShieldCheck,
    title: "Godkendte midler og ansvarlig udførelse",
    text: "Vi arbejder med godkendte produkter og følger gældende regler, så behandlingen bliver både effektiv og skånsom.",
  },
  {
    icon: BadgeCheck,
    title: "Certificeret faglighed",
    text: "Sprøjtecertifikat og praktisk erfaring sikrer en stabil proces fra første kontakt til udført behandling.",
  },
] as const;

export default function BenefitsPage() {
  return (
    <main className="bg-background">
      <section className="border-b border-border/60 bg-muted/25">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Fordele</p>
          <h1 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">Hvorfor vælge Ukrudtfri.dk?</h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Vi hjælper kunder i Give, Grindsted, Brande, Vejle og omegn med en professionel og certificeret løsning mod
            ukrudt i græsplænen.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-14">
        <div className="grid gap-5 md:grid-cols-2">
          {benefits.map(({ icon: Icon, title, text }) => (
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
          <Link href="/proces" className={cn(buttonVariants({ variant: "outline" }), "min-h-11 rounded-lg px-6")}>
            Se processen
          </Link>
          <Link href="/booking" className={cn(buttonVariants(), "min-h-11 rounded-lg px-6")}>
            Book din tid
          </Link>
        </div>
      </section>
    </main>
  );
}
