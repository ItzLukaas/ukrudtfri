import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getBookingSummaryPublic } from "@/server/public-booking";
import { formatBookingSlotRangeDa } from "@/lib/booking-datetime";

export const metadata: Metadata = {
  title: "Booking modtaget til certificeret plænesprøjtning",
  robots: { index: false, follow: true },
};

export const dynamic = "force-dynamic";

export default async function BookingReceiptPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id } = await searchParams;
  if (!id) notFound();

  const booking = await getBookingSummaryPublic(id);
  if (!booking) notFound();

  const whenLabel = formatBookingSlotRangeDa(booking.slot.startsAt, booking.slot.endsAt);

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12">
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>Tak, vi har modtaget din booking</CardTitle>
          <CardDescription>
            Vi sender en mail med alle oplysninger. Din booking afventer manuel bekræftelse, før tiden er endeligt låst.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="grid gap-2 rounded-lg border border-border/60 bg-muted/20 p-4">
            <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4">
              <span className="text-muted-foreground">Tid</span>
              <span className="font-medium sm:text-right">{whenLabel}</span>
            </div>
            <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4">
              <span className="text-muted-foreground">Adresse</span>
              <span className="font-medium sm:text-right">
                {booking.addressLine}, {booking.postalCode} {booking.city}
              </span>
            </div>
            <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4">
              <span className="text-muted-foreground">Areal</span>
              <span className="font-medium sm:text-right">{booking.squareMeters} m²</span>
            </div>
            <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4">
              <span className="text-muted-foreground">Pris</span>
              <span className="font-medium sm:text-right">{Number(booking.totalPrice).toLocaleString("da-DK")} kr</span>
            </div>
          </div>

          <div className="rounded-lg border border-border/60 bg-muted/20 p-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              Betaling sker først efter arbejdet er udført. Hvis du skal ændre eller aflyse, skal det ske senest 24 timer
              før aftalt tidspunkt.
            </p>
            <p className="mt-2">
              Kontakt os via{" "}
              <Link className="font-medium text-foreground underline underline-offset-4 hover:no-underline" href="/kontakt#kontakt-form">
                kontaktformularen
              </Link>{" "}
              eller telefon{" "}
              <a className="font-medium text-foreground" href="tel:+4541820046">+45 41 82 00 46</a>.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Link className={cn(buttonVariants(), "inline-flex justify-center")} href="/">
              Til forsiden
            </Link>
            <Link className={cn(buttonVariants({ variant: "outline" }), "inline-flex justify-center")} href="/booking">
              Ny booking
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
