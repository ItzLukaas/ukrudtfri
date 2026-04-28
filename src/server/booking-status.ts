"use server";

import { format } from "date-fns";
import { da } from "date-fns/locale";
import { BookingStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { sendBookingReminderEmail, sendBookingStatusEmail } from "@/lib/mail";

export async function setBookingStatus(
  bookingId: string,
  status: BookingStatus,
  options?: { notifyCustomer?: boolean },
) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { slot: true },
  });
  if (!booking) return { ok: false as const, message: "Booking blev ikke fundet." };

  if (booking.status === status) return { ok: true as const, booking };

  const updated = await prisma.booking.update({
    where: { id: bookingId },
    data: { status },
    include: { slot: true },
  });

  const notifyCustomer = options?.notifyCustomer !== false;
  if (notifyCustomer) {
    const whenLabel = format(updated.slot.startsAt, "PPP 'kl.' p", { locale: da });
    const addressLabel = `${updated.addressLine}, ${updated.postalCode} ${updated.city}`;
    await sendBookingStatusEmail({
      to: updated.customerEmail,
      customerName: updated.customerName,
      status,
      whenLabel,
      addressLabel,
      squareMeters: updated.squareMeters,
      totalPriceDkk: Number(updated.totalPrice),
    });
  }

  return { ok: true as const, booking: updated };
}

/**
 * Finder bekræftede bookinger hvor starttidspunktet ligger ca. **2 timer ude i fremtiden**,
 * og sender påmindelse én gang (`remindedAt`).
 *
 * Vi bruger et **bredt vindue** (ca. 1h40–2h20 før start), så en cron der kører hvert 10.–15. min
 * stadig fanger alle tider — et snævert 10-min-vindue går let glip af bookings ved sjældnere kald.
 */
export async function sendDueBookingReminders(now = new Date()) {
  const from = new Date(now.getTime() + 100 * 60 * 1000);
  const to = new Date(now.getTime() + 140 * 60 * 1000);

  const due = await prisma.booking.findMany({
    where: {
      status: "CONFIRMED",
      remindedAt: null,
      slot: {
        startsAt: { gte: from, lte: to },
      },
    },
    include: { slot: true },
    take: 200,
  });

  for (const booking of due) {
    const whenLabel = format(booking.slot.startsAt, "PPP 'kl.' p", { locale: da });
    const addressLabel = `${booking.addressLine}, ${booking.postalCode} ${booking.city}`;
    await sendBookingReminderEmail({
      to: booking.customerEmail,
      customerName: booking.customerName,
      whenLabel,
      addressLabel,
      squareMeters: booking.squareMeters,
      totalPriceDkk: Number(booking.totalPrice),
    });
    await prisma.booking.update({
      where: { id: booking.id },
      data: { remindedAt: new Date() },
    });
  }

  return { ok: true as const, count: due.length };
}
