import { NextResponse } from "next/server";
import { sendDueBookingReminders } from "@/server/booking-status";

function authorize(request: Request) {
  const auth = request.headers.get("authorization");
  const token = auth?.replace(/^Bearer\s+/i, "") ?? "";
  /** Vercel Cron sender `CRON_SECRET`; vi understøtter også `REMINDER_CRON_SECRET` til manuelle kald. */
  const expected =
    process.env.CRON_SECRET ?? process.env.REMINDER_CRON_SECRET ?? "";
  return Boolean(expected && token === expected);
}

export async function GET(request: Request) {
  if (!authorize(request)) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }
  const result = await sendDueBookingReminders();
  return NextResponse.json(result);
}

export async function POST(request: Request) {
  if (!authorize(request)) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const result = await sendDueBookingReminders();
  return NextResponse.json(result);
}
