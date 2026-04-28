import { createHmac, timingSafeEqual } from "crypto";
import { SITE_URL } from "@/lib/site-config";

export type BookingDecisionAction = "confirm" | "reject";

function signingSecret() {
  return process.env.BOOKING_LINK_SECRET ?? process.env.NEXTAUTH_SECRET ?? "ukrudtfri-booking-secret";
}

function sign(payload: string) {
  return createHmac("sha256", signingSecret()).update(payload).digest("hex");
}

export function createBookingDecisionUrl(bookingId: string, action: BookingDecisionAction, validHours = 48) {
  const expiresAt = Date.now() + validHours * 60 * 60 * 1000;
  const payload = `${bookingId}.${action}.${expiresAt}`;
  const signature = sign(payload);
  return `${SITE_URL}/api/booking-decision?bookingId=${encodeURIComponent(bookingId)}&action=${action}&expiresAt=${expiresAt}&signature=${signature}`;
}

export function verifyBookingDecisionParams(params: {
  bookingId: string;
  action: string;
  expiresAt: string;
  signature: string;
}) {
  const action = params.action === "confirm" || params.action === "reject" ? params.action : null;
  const expiresAt = Number(params.expiresAt);
  if (!action || !Number.isFinite(expiresAt) || expiresAt < Date.now()) return { ok: false as const };

  const payload = `${params.bookingId}.${action}.${expiresAt}`;
  const expected = sign(payload);
  const a = Buffer.from(expected);
  const b = Buffer.from(params.signature);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return { ok: false as const };

  return { ok: true as const, action };
}
