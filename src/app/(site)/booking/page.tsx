import type { Metadata } from "next";
import { Suspense } from "react";
import { BookingWizard } from "@/components/booking/booking-wizard";
import { SITE_BRAND, SITE_URL } from "@/lib/site-config";
import { getAvailableSlotsForPublic, getPublicPricing } from "@/server/public-booking";

export const metadata: Metadata = {
  title: "Book tid til certificeret plænesprøjtning",
  description:
    "Book online på få minutter: tjek område, se pris efter areal og vælg ledig tid. Certificeret plænesprøjtning i Give, Grindsted, Brande og Vejle.",
  alternates: { canonical: `${SITE_URL}/booking` },
  openGraph: {
    url: `${SITE_URL}/booking`,
    title: `Book tid til certificeret plænesprøjtning · ${SITE_BRAND}`,
    description:
      "Book online på få minutter: tjek område, se pris efter areal og vælg ledig tid. Certificeret plænesprøjtning i Give, Grindsted, Brande og Vejle.",
  },
};

export const dynamic = "force-dynamic";

export default async function BookingPage() {
  const [pricing, slots] = await Promise.all([getPublicPricing(), getAvailableSlotsForPublic()]);

  return (
    <main className="min-h-[calc(100vh-8rem)] bg-background">
      <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8 sm:pt-12">
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">Book en tid hos Ukrudtfri</h1>
            <p className="text-pretty text-base text-muted-foreground sm:text-lg">
              Udfyld formularen og send din booking på få minutter.
            </p>
          </div>
        </div>

        <Suspense fallback={<div className="min-h-[28rem] w-full animate-pulse rounded-xl bg-muted" aria-hidden />}>
          <BookingWizard
            pricing={pricing}
            initialSlots={slots.map((s) => ({
              id: s.id,
              startsAt: s.startsAt.toISOString(),
              endsAt: s.endsAt.toISOString(),
            }))}
          />
        </Suspense>
      </div>
    </main>
  );
}
