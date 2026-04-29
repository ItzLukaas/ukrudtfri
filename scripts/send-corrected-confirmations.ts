import { BookingStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { formatBookingSlotRangeDa } from "@/lib/booking-datetime";
import { sendCorrectedBookingConfirmationEmail } from "@/lib/mail";

function parseBookingIds() {
  const raw = process.env.BOOKING_IDS?.trim();
  if (!raw) return [];
  return raw
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
}

async function listRecentConfirmed() {
  const rows = await prisma.booking.findMany({
    where: { status: BookingStatus.CONFIRMED },
    orderBy: { createdAt: "desc" },
    take: 10,
    select: {
      id: true,
      customerName: true,
      customerEmail: true,
      slot: { select: { startsAt: true, endsAt: true } },
    },
  });

  console.log("Seneste bekræftede bookinger:");
  for (const row of rows) {
    const when = formatBookingSlotRangeDa(row.slot.startsAt, row.slot.endsAt);
    console.log(`- ${row.id} | ${row.customerName} | ${row.customerEmail} | ${when}`);
  }
}

async function main() {
  const ids = parseBookingIds();
  const overrideTo = process.env.OVERRIDE_TO?.trim();

  if (ids.length === 0) {
    console.log("Ingen BOOKING_IDS angivet.");
    console.log("Sæt fx: $env:BOOKING_IDS='id1,id2,id3'");
    await listRecentConfirmed();
    process.exit(1);
  }

  const bookings = await prisma.booking.findMany({
    where: { id: { in: ids }, status: BookingStatus.CONFIRMED },
    select: {
      id: true,
      customerName: true,
      customerEmail: true,
      addressLine: true,
      postalCode: true,
      city: true,
      squareMeters: true,
      totalPrice: true,
      slot: { select: { startsAt: true, endsAt: true } },
    },
  });

  if (bookings.length === 0) {
    console.log("Ingen bekræftede bookinger fundet for de angivne IDs.");
    process.exit(1);
  }

  for (const booking of bookings) {
    const whenLabel = formatBookingSlotRangeDa(booking.slot.startsAt, booking.slot.endsAt);
    const addressLabel = `${booking.addressLine}, ${booking.postalCode} ${booking.city}`;
    const totalPriceDkk = Number(booking.totalPrice);

    const targetEmail = overrideTo || booking.customerEmail;

    const result = await sendCorrectedBookingConfirmationEmail({
      to: targetEmail,
      customerName: booking.customerName,
      whenLabel,
      addressLabel,
      squareMeters: booking.squareMeters,
      totalPriceDkk,
    });

    console.log(
      JSON.stringify({
        bookingId: booking.id,
        name: booking.customerName,
        originalEmail: booking.customerEmail,
        sentTo: targetEmail,
        whenLabel,
        status: result.skipped ? "skipped" : "sent",
      }),
    );
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
