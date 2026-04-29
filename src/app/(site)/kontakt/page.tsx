import type { Metadata } from "next";
import Link from "next/link";
import { SITE_BRAND, SITE_URL } from "@/lib/site-config";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Kontakt os om certificeret plænesprøjtning",
  description: `Kontakt ${SITE_BRAND} om ukrudtsbekæmpelse og sprøjtning af græsplæner. Få hurtige svar om pris, dækning og booking i lokalområdet.`,
  alternates: { canonical: `${SITE_URL}/kontakt` },
  openGraph: {
    url: `${SITE_URL}/kontakt`,
    title: `Kontakt os om certificeret plænesprøjtning · ${SITE_BRAND}`,
    description: `Kontakt ${SITE_BRAND} om ukrudtsbekæmpelse og sprøjtning af græsplæner. Få hurtige svar om pris, dækning og booking i lokalområdet.`,
  },
};

export default async function ContactPage() {
  return (
    <main className="bg-background">
      <section className="border-b border-border/60 bg-muted/30">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Kontakt</p>
          <h1 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Kontakt os om ukrudtsbekæmpelse af græsplænen
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Udfyld formularen, og få svar på pris, dækning og næste ledige tid til professionel sprøjtning af græsplæner.
          </p>
        </div>
      </section>

      <section id="kontakt-form" className="mx-auto w-full max-w-3xl px-4 py-10 md:py-14">
        <Card className="border-border/80 py-0 shadow-sm">
          <CardHeader className="space-y-1 pb-2">
            <CardTitle>Send en forespørgsel</CardTitle>
            <CardDescription>Udfyld felterne, så vender vi tilbage hurtigst muligt.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pb-6">
            <form className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Navn</Label>
                  <Input id="name" placeholder="Dit navn" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefon</Label>
                  <Input id="phone" placeholder="+45 ..." />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" placeholder="din@email.dk" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Adresse (valgfrit)</Label>
                <Input id="address" placeholder="Vejnavn og by" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Besked</Label>
                <Textarea id="message" placeholder="Skriv dit spørgsmål..." className="min-h-28" />
              </div>
              <button type="button" className={cn(buttonVariants({ size: "lg" }), "min-h-11 w-full rounded-lg text-base font-semibold")}>
                Send forespørgsel
              </button>
            </form>
            <p className="text-xs text-muted-foreground">
              Vil du booke en tid med det samme?{" "}
              <Link href="/booking" className="font-medium text-primary underline-offset-4 hover:underline">
                Gå til booking
              </Link>
              .
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
