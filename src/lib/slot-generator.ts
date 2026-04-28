import { DateTime } from "luxon";

const ZONE = "Europe/Copenhagen";

export type GenerateSlotsInput = {
  startDate: string; // yyyy-MM-dd
  endDate: string; // yyyy-MM-dd
  dailyStartHHmm: string; // HH:mm
  dailyEndHHmm: string; // HH:mm
  slotMinutes: number;
  /** JS weekday: 0 = søndag ... 6 = lørdag */
  weekdays: number[];
};

function parseHHmm(value: string) {
  const [h, m] = value.split(":").map((x) => Number(x));
  if (!Number.isFinite(h) || !Number.isFinite(m)) return null;
  if (h < 0 || h > 23 || m < 0 || m > 59) return null;
  return { h, m };
}

export function generateCandidateSlots(input: GenerateSlotsInput) {
  const start = DateTime.fromISO(input.startDate, { zone: ZONE }).startOf("day");
  const end = DateTime.fromISO(input.endDate, { zone: ZONE }).startOf("day");
  if (!start.isValid || !end.isValid) return { ok: false as const, error: "Ugyldig dato." };
  if (end < start) return { ok: false as const, error: "Slutdato skal være efter startdato." };

  const startParts = parseHHmm(input.dailyStartHHmm);
  const endParts = parseHHmm(input.dailyEndHHmm);
  if (!startParts || !endParts) return { ok: false as const, error: "Ugyldigt klokkeslæt (brug HH:mm)." };

  if (input.slotMinutes < 15 || input.slotMinutes > 12 * 60) {
    return { ok: false as const, error: "Slotlængde skal være mellem 15 og 720 minutter." };
  }

  const weekdaySet = new Set(input.weekdays);
  if (weekdaySet.size === 0) return { ok: false as const, error: "Vælg mindst én ugedag." };

  const slots: { startsAt: Date; endsAt: Date }[] = [];

  for (let d = start; d.toMillis() <= end.toMillis(); d = d.plus({ days: 1 })) {
    // Luxon: 1=man ... 6=lør, 7=søn → JS: 0=søn ... 6=lør
    const jsWeekday = d.weekday === 7 ? 0 : d.weekday;
    if (!weekdaySet.has(jsWeekday)) continue;

    const dayStart = d.set({ hour: startParts.h, minute: startParts.m, second: 0, millisecond: 0 });
    const dayEnd = d.set({ hour: endParts.h, minute: endParts.m, second: 0, millisecond: 0 });

    if (dayEnd <= dayStart) {
      return { ok: false as const, error: "Daglig sluttid skal være efter starttid." };
    }

    let cursor = dayStart;
    while (true) {
      const slotEnd = cursor.plus({ minutes: input.slotMinutes });
      if (slotEnd > dayEnd) break;
      slots.push({ startsAt: cursor.toJSDate(), endsAt: slotEnd.toJSDate() });
      cursor = slotEnd;
    }
  }

  return { ok: true as const, slots };
}
