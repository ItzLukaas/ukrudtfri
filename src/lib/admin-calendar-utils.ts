import { format } from "date-fns";
import { da } from "date-fns/locale";

export function formatSlotRangeDa(startsAt: string, endsAt: string) {
  const s = new Date(startsAt);
  const e = new Date(endsAt);
  return `${format(s, "d. MMM", { locale: da })} ${format(s, "HH:mm")}–${format(e, "HH:mm")}`;
}
