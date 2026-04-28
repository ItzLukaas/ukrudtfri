"use server";

import { prisma } from "@/lib/prisma";
import { geocodeDanishAddress } from "@/lib/geocoding";
import { haversineKm } from "@/lib/geo";
import { calculateTotalDkk } from "@/lib/pricing";
import { getSiteSettings } from "@/lib/settings";
import { listAvailableOpenSlots } from "@/lib/slots";
import { createBookingDecisionUrl } from "@/lib/booking-decision-link";
import { sendAdminBookingNotificationEmail, sendBookingConfirmationEmail } from "@/lib/mail";
import { z } from "zod";
import { format } from "date-fns";
import { da } from "date-fns/locale";

const addressSchema = z.object({
  addressLine: z.string().trim().min(3, "Adresse er for kort."),
  postalCode: z.string().trim().min(3, "Postnummer er for kort."),
  city: z.string().trim().min(2, "By er for kort."),
});

const bookingSchema = z.object({
  slotId: z.string().min(1),
  customerName: z.string().trim().min(2, "Navn er for kort."),
  customerEmail: z.string().trim().email("Ugyldig email."),
  customerPhone: z.string().trim().min(6, "Telefonnummer er for kort."),
  addressLine: z.string().trim().min(3),
  postalCode: z.string().trim().min(3),
  city: z.string().trim().min(2),
  squareMeters: z.coerce.number().int().positive().max(250_000),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
});

export type AddressCheckResult =
  | {
      ok: true;
      displayName: string;
      distanceKm: number;
      latitude: number;
      longitude: number;
      radiusKm: number;
    }
  | {
      ok: false;
      message: string;
      reason: "validation" | "geocode" | "outside_radius";
    };

export async function checkServiceArea(input: z.infer<typeof addressSchema>): Promise<AddressCheckResult> {
  const parsed = addressSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Ugyldig adresse.",
      reason: "validation",
    };
  }

  const settings = await getSiteSettings();
  const base = { lat: settings.baseLatitude, lon: settings.baseLongitude };

  const hit = await geocodeDanishAddress(parsed.data, { base });
  if (!hit) {
    return {
      ok: false,
      message: "Vi kunne ikke finde adressen. Prøv at være mere præcis.",
      reason: "geocode",
    };
  }
  const customer = { lat: hit.lat, lon: hit.lon };
  const distanceKm = haversineKm(base, customer);
  const radiusKm = Number(settings.serviceRadiusKm);

  if (distanceKm > radiusKm) {
    return {
      ok: false,
      message: `Adressen ligger ca. ${distanceKm.toFixed(1)} km fra vores base — uden for serviceområdet (${radiusKm} km).`,
      reason: "outside_radius",
    };
  }

  return {
    ok: true,
    displayName: hit.displayName,
    distanceKm,
    latitude: hit.lat,
    longitude: hit.lon,
    radiusKm,
  };
}

export async function getPublicPricing() {
  const settings = await getSiteSettings();
  return {
    pricePerSquareMeter: Number(settings.pricePerSquareMeter),
    minimumPrice: Number(settings.minimumPrice),
    serviceRadiusKm: Number(settings.serviceRadiusKm),
    baseLabel: settings.baseLabel,
    baseLatitude: settings.baseLatitude,
    baseLongitude: settings.baseLongitude,
  };
}

export async function getAvailableSlotsForPublic() {
  return listAvailableOpenSlots(new Date());
}

export async function getBookingSummaryPublic(bookingId: string) {
  return prisma.booking.findUnique({
    where: { id: bookingId },
    include: { slot: true },
  });
}

export async function createBookingRequest(raw: unknown) {
  const parsed = bookingSchema.safeParse(raw);
  if (!parsed.success) return { ok: false as const, message: parsed.error.issues[0]?.message ?? "Ugyldig booking." };

  const settings = await getSiteSettings();
  const data = parsed.data;

  const base = { lat: settings.baseLatitude, lon: settings.baseLongitude };
  const customer = { lat: data.latitude, lon: data.longitude };
  const distanceKm = haversineKm(base, customer);
  const radiusKm = Number(settings.serviceRadiusKm);
  if (distanceKm > radiusKm) {
    return { ok: false as const, message: "Adressen er uden for serviceområdet." };
  }

  const pricePerSquareMeter = Number(settings.pricePerSquareMeter);
  const minimumPrice = Number(settings.minimumPrice);
  const totalPrice = calculateTotalDkk(data.squareMeters, pricePerSquareMeter, minimumPrice);

  try {
    const booking = await prisma.$transaction(async (tx) => {
      const slot = await tx.openSlot.findFirst({
        where: { id: data.slotId, booking: null, startsAt: { gte: new Date() } },
      });
      if (!slot) throw new Error("SLOT_TAKEN");

      const blocks = await tx.blockedWindow.findMany();
      const blocked = blocks.some((b) => slot.startsAt < b.endsAt && b.startsAt < slot.endsAt);
      if (blocked) throw new Error("SLOT_BLOCKED");

      return tx.booking.create({
        data: {
          slotId: slot.id,
          customerName: data.customerName,
          customerEmail: data.customerEmail,
          customerPhone: data.customerPhone,
          addressLine: data.addressLine,
          postalCode: data.postalCode,
          city: data.city,
          latitude: data.latitude,
          longitude: data.longitude,
          squareMeters: data.squareMeters,
          totalPrice,
          status: "PENDING",
        },
        include: { slot: true },
      });
    });

    const whenLabel = format(booking.slot.startsAt, "PPP 'kl.' p", { locale: da });
    const addressLabel = `${booking.addressLine}, ${booking.postalCode} ${booking.city}`;

    await sendBookingConfirmationEmail({
      to: booking.customerEmail,
      customerName: booking.customerName,
      whenLabel,
      addressLabel,
      squareMeters: booking.squareMeters,
      totalPriceDkk: Number(booking.totalPrice),
      bookingId: booking.id,
    });

    await sendAdminBookingNotificationEmail({
      bookingId: booking.id,
      customerName: booking.customerName,
      customerEmail: booking.customerEmail,
      customerPhone: booking.customerPhone,
      whenLabel,
      addressLabel,
      squareMeters: booking.squareMeters,
      totalPriceDkk: Number(booking.totalPrice),
      confirmUrl: createBookingDecisionUrl(booking.id, "confirm"),
      rejectUrl: createBookingDecisionUrl(booking.id, "reject"),
    });

    return { ok: true as const, bookingId: booking.id };
  } catch (e) {
    if (e instanceof Error && (e.message === "SLOT_TAKEN" || e.message === "SLOT_BLOCKED")) {
      return {
        ok: false as const,
        message: e.message === "SLOT_BLOCKED" ? "Tiden er blokeret." : "Tiden er ikke længere ledig.",
      };
    }
    console.error(e);
    return { ok: false as const, message: "Der opstod en fejl. Prøv igen om lidt." };
  }
}
