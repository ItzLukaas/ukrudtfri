import { NextResponse } from "next/server";
import { BookingStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { buildBookingsIcs } from "@/lib/ics-build";

export const dynamic = "force-dynamic";

const FEED_STATUSES: BookingStatus[] = ["PENDING", "CONFIRMED"];

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token");
  const secret = process.env.ADMIN_ICAL_TOKEN;
  if (!secret || token !== secret) {
    return new NextResponse("Uautoriseret", { status: 401 });
  }

  const bookings = await prisma.booking.findMany({
    where: { status: { in: FEED_STATUSES } },
    include: { slot: true },
    orderBy: { slot: { startsAt: "asc" } },
    take: 500,
  });

  const configuredSiteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "").trim();
  let uidDomain = "ukrudtfri.dk";
  if (configuredSiteUrl) {
    try {
      uidDomain = new URL(configuredSiteUrl).host || uidDomain;
    } catch {
      // Keep fallback domain when NEXT_PUBLIC_SITE_URL is invalid.
    }
  } else {
    uidDomain = new URL(request.url).host || uidDomain;
  }

  const ics = buildBookingsIcs(
    bookings.map((b) => ({
      id: b.id,
      startsAt: b.slot.startsAt,
      endsAt: b.slot.endsAt,
      summary: `Græsservice — ${b.customerName}`,
      location: `${b.addressLine}, ${b.postalCode} ${b.city}`,
      status: b.status,
      descriptionLines: [
        `Kunde: ${b.customerName}`,
        `Status: ${b.status}`,
        `Areal: ${b.squareMeters} m2`,
        `Pris: ${Number(b.totalPrice).toLocaleString("da-DK")} kr`,
        `Adresse: ${b.addressLine}, ${b.postalCode} ${b.city}`,
        `Booking-id: ${b.id}`,
      ],
    })),
    { uidDomain },
  );

  return new NextResponse(ics, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
