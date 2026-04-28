/** Minimal RFC 5545 escaping for TEXT fields. */
export function icsEscapeText(s: string) {
  return s
    .replaceAll("\\", "\\\\")
    .replaceAll("\n", "\\n")
    .replaceAll(";", "\\;")
    .replaceAll(",", "\\,");
}

function toIcsUtc(d: Date) {
  const iso = d.toISOString().replace(/\.\d{3}Z$/, "Z");
  return iso.replace(/[-:]/g, "");
}

export type IcsBookingEvent = {
  id: string;
  startsAt: Date;
  endsAt: Date;
  summary: string;
  location: string;
  status: "PENDING" | "CONFIRMED" | "REJECTED" | "CANCELLED";
  descriptionLines: string[];
};

function mapBookingStatusToIcs(status: IcsBookingEvent["status"]) {
  if (status === "CONFIRMED") return "CONFIRMED";
  if (status === "CANCELLED" || status === "REJECTED") return "CANCELLED";
  return "TENTATIVE";
}

export function buildBookingsIcs(
  events: IcsBookingEvent[],
  opts?: {
    uidDomain?: string;
  },
) {
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Ukrudtfri//Admin//DA",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-TIMEZONE:UTC",
    "X-WR-CALNAME:Ukrudtfri bookinger",
  ];

  const stamp = toIcsUtc(new Date());
  const uidDomain = opts?.uidDomain ?? "ukrudtfri";

  for (const ev of events) {
    lines.push("BEGIN:VEVENT");
    lines.push(`UID:booking-${ev.id}@${icsEscapeText(uidDomain)}`);
    lines.push(`DTSTAMP:${stamp}`);
    lines.push(`DTSTART:${toIcsUtc(ev.startsAt)}`);
    lines.push(`DTEND:${toIcsUtc(ev.endsAt)}`);
    lines.push(`SUMMARY:${icsEscapeText(ev.summary)}`);
    lines.push(`LOCATION:${icsEscapeText(ev.location)}`);
    lines.push(`STATUS:${mapBookingStatusToIcs(ev.status)}`);
    lines.push(`DESCRIPTION:${icsEscapeText(ev.descriptionLines.join("\n"))}`);
    lines.push("END:VEVENT");
  }

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}
