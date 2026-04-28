import { NextResponse } from "next/server";
import { verifyBookingDecisionParams } from "@/lib/booking-decision-link";
import { setBookingStatus } from "@/server/booking-status";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const bookingId = url.searchParams.get("bookingId") ?? "";
  const action = url.searchParams.get("action") ?? "";
  const expiresAt = url.searchParams.get("expiresAt") ?? "";
  const signature = url.searchParams.get("signature") ?? "";

  const verified = verifyBookingDecisionParams({ bookingId, action, expiresAt, signature });
  if (!verified.ok) {
    return NextResponse.json({ ok: false, message: "Linket er ugyldigt eller udløbet." }, { status: 400 });
  }

  const status = verified.action === "confirm" ? "CONFIRMED" : "REJECTED";
  const result = await setBookingStatus(bookingId, status);
  if (!result.ok) {
    return NextResponse.json({ ok: false, message: result.message }, { status: 404 });
  }

  const html = `
    <html>
      <body style="font-family:Arial,sans-serif;background:#f3f7f4;padding:24px;">
        <div style="max-width:640px;margin:0 auto;background:#fff;border:1px solid #d7e4db;border-radius:12px;padding:20px;">
          <h1 style="margin:0 0 10px;font-size:22px;color:#25382e;">
            Booking ${status === "CONFIRMED" ? "bekræftet" : "afvist"}
          </h1>
          <p style="margin:0;color:#374151;">
            Status er opdateret. Ændringen vises også i admin-panelet.
          </p>
        </div>
      </body>
    </html>
  `;

  return new NextResponse(html, {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}
