import { formatBookingDateTimeDa, formatBookingSlotRangeDa } from "@/lib/booking-datetime";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

type BookingForVars = {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  addressLine: string;
  postalCode: string;
  city: string;
  squareMeters: number;
  totalPrice: number;
  status: string;
  slot: { startsAt: Date; endsAt: Date };
};

export function bookingToTemplateVars(booking: BookingForVars): Record<string, string> {
  const whenLabel = formatBookingSlotRangeDa(booking.slot.startsAt, booking.slot.endsAt);
  const slotEndLabel = formatBookingDateTimeDa(booking.slot.endsAt);
  const addressLabel = `${booking.addressLine}, ${booking.postalCode} ${booking.city}`;
  const price = `${booking.totalPrice.toLocaleString("da-DK")} kr`;

  return {
    bookingId: escapeHtml(booking.id),
    customerName: escapeHtml(booking.customerName),
    customerEmail: escapeHtml(booking.customerEmail),
    customerPhone: escapeHtml(booking.customerPhone),
    addressLine: escapeHtml(booking.addressLine),
    postalCode: escapeHtml(booking.postalCode),
    city: escapeHtml(booking.city),
    addressLabel: escapeHtml(addressLabel),
    whenLabel: escapeHtml(whenLabel),
    slotEndLabel: escapeHtml(slotEndLabel),
    squareMeters: escapeHtml(String(booking.squareMeters)),
    totalPrice: escapeHtml(price),
    status: escapeHtml(booking.status),
  };
}
