import type { Metadata } from "next";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { CITY_PAGE_CONFIGS } from "@/lib/city-pages";
import { SITE_BRAND, SITE_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: `Byer vi dækker | ${SITE_BRAND}`,
  description:
    "Se alle byer vi dækker med professionel ukrudtsbekæmpelse af græsplæner, og find den lokale byside med prisinformation og booking.",
  alternates: { canonical: `${SITE_URL}/byer` },
  openGraph: {
    url: `${SITE_URL}/byer`,
    title: `Byer vi dækker | ${SITE_BRAND}`,
    description:
      "Se alle byer vi dækker med professionel ukrudtsbekæmpelse af græsplæner, og find den lokale byside med prisinformation og booking.",
  },
};

export default function CitiesPage() {
  const sortedCities = [...CITY_PAGE_CONFIGS].sort((a, b) => a.city.localeCompare(b.city, "da-DK"));

  return (
    <main className="bg-background">
      <section className="border-b border-border/60 bg-muted/20">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:py-14">
          <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">Byer vi dækker</h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Her finder du lokale sider om ukrudtsbekæmpelse og sprøjtning af græsplæner i de byer, vi dækker fast.
          </p>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Hver byside beskriver pris pr. m², lokal dækning, bookingforløb og typiske spørgsmål, så du hurtigt kan vurdere næste skridt.
          </p>
        </div>
      </section>

      <section className="bg-background">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:py-14">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {sortedCities.map((city) => (
              <Link
                key={city.slug}
                href={`/byer/${city.slug}`}
                className="inline-flex items-center gap-2 px-1 py-2 text-base font-medium text-foreground transition-colors hover:text-primary"
              >
                <MapPin className="size-4 text-muted-foreground" aria-hidden />
                {city.city}
              </Link>
            ))}
          </div>
          <div className="mt-8">
            <p className="text-base font-semibold text-foreground">Er din by ikke her?</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
              <Link href="/booking" className="font-medium text-primary underline underline-offset-4 hover:no-underline">
                Tjek om vi kører ud til dig her.
              </Link>
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Har du spørgsmål om dækning eller pris, kan du også{" "}
              <Link href="/kontakt" className="font-medium text-primary underline underline-offset-4 hover:no-underline">
                kontakte os direkte her
              </Link>
              .
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Se også vores side om{" "}
              <Link
                href="/ukrudtsbekaempelse-grindsted"
                className="font-medium text-primary underline underline-offset-4 hover:no-underline"
              >
                ukrudtsbekæmpelse i Grindsted
              </Link>{" "}
              for et konkret eksempel på service, pris og proces.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
