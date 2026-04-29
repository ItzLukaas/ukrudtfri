const DANISH_TIME_ZONE = "Europe/Copenhagen";

const DATE_LABEL_FORMATTER = new Intl.DateTimeFormat("da-DK", {
  weekday: "long",
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: DANISH_TIME_ZONE,
});

const TIME_LABEL_FORMATTER = new Intl.DateTimeFormat("da-DK", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: DANISH_TIME_ZONE,
});

const DAY_KEY_FORMATTER = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  timeZone: DANISH_TIME_ZONE,
});

function localDayKey(value: Date) {
  return DAY_KEY_FORMATTER.format(value);
}

export function formatBookingDateTimeDa(value: Date) {
  return `${DATE_LABEL_FORMATTER.format(value)} kl. ${TIME_LABEL_FORMATTER.format(value)}`;
}

export function formatBookingSlotRangeDa(startsAt: Date, endsAt: Date) {
  if (localDayKey(startsAt) === localDayKey(endsAt)) {
    return `${DATE_LABEL_FORMATTER.format(startsAt)} kl. ${TIME_LABEL_FORMATTER.format(startsAt)}-${TIME_LABEL_FORMATTER.format(endsAt)}`;
  }

  return `${formatBookingDateTimeDa(startsAt)} - ${formatBookingDateTimeDa(endsAt)}`;
}
