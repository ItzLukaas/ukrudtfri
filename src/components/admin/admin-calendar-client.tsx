"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  addMonths,
  eachDayOfInterval,
  endOfDay,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { da } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import type { AdminDashboardPayload } from "@/lib/admin-payload-types";
import { deleteOpenSlotAction } from "@/server/admin-actions";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { formatSlotRangeDa } from "@/lib/admin-calendar-utils";

type SlotD = AdminDashboardPayload["slotsDetailed"][number];
type BlockD = AdminDashboardPayload["blocks"][number];

function AppleCalendarIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M16.365 12.155c.017 1.796 1.577 2.395 1.594 2.404-.013.042-.249.86-.822 1.704-.495.73-1.008 1.458-1.817 1.473-.795.015-1.05-.47-1.96-.47-.91 0-1.194.456-1.944.485-.78.03-1.373-.78-1.871-1.507-1.014-1.468-1.787-4.149-.748-5.955.516-.898 1.44-1.468 2.443-1.483.765-.015 1.487.514 1.96.514.473 0 1.358-.635 2.289-.542.39.016 1.486.157 2.189 1.186-.056.034-1.307.761-1.313 2.191Zm-1.474-4.953c.414-.502.693-1.2.617-1.895-.598.024-1.321.398-1.751.9-.384.443-.72 1.153-.63 1.833.667.052 1.35-.34 1.764-.838Z" />
    </svg>
  );
}

function GoogleCalendarIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <path fill="#4285F4" d="M22 12.245v7.182a2.57 2.57 0 0 1-2.572 2.573H4.572A2.57 2.57 0 0 1 2 19.427V12.245h20Z" />
      <path fill="#34A853" d="M22 9.714H2V4.572A2.57 2.57 0 0 1 4.572 2h14.856A2.57 2.57 0 0 1 22 4.572v5.142Z" />
      <path fill="#FBBC04" d="M17.143 18.286H6.857a1.714 1.714 0 1 1 0-3.429h10.286a1.714 1.714 0 1 1 0 3.429Z" />
      <path fill="#EA4335" d="M8.143 11.714H5.571V7.429h2.572v4.285Zm10.286 0h-2.572V7.429h2.572v4.285Z" />
      <path
        fill="currentColor"
        d="M5.571 2.857a.857.857 0 0 1 1.715 0V5a.857.857 0 0 1-1.715 0V2.857Zm11.143 0a.857.857 0 1 1 1.715 0V5a.857.857 0 1 1-1.715 0V2.857Z"
      />
    </svg>
  );
}

function overlapsDay(rangeStart: Date, rangeEnd: Date, day: Date) {
  const d0 = startOfDay(day);
  const d1 = endOfDay(day);
  return rangeStart < d1 && rangeEnd > d0;
}

function statusLabel(s: string) {
  if (s === "PENDING") return "Afventer";
  if (s === "CONFIRMED") return "Bekræftet";
  if (s === "REJECTED") return "Afvist";
  if (s === "CANCELLED") return "Annulleret";
  return s;
}

export function AdminCalendarClient({
  slotsDetailed,
  blocks,
  icalFeedUrl,
  icalWebcalUrl,
  icalFeedMissingEnv,
}: Pick<AdminDashboardPayload, "slotsDetailed" | "blocks" | "icalFeedUrl" | "icalWebcalUrl" | "icalFeedMissingEnv">) {
  const router = useRouter();
  const [cursor, setCursor] = useState(() => startOfMonth(new Date()));
  const [open, setOpen] = useState(false);
  const [panel, setPanel] = useState<{ kind: "slot"; slot: SlotD } | { kind: "block"; block: BlockD } | null>(null);
  const [isPending, startTransition] = useTransition();

  const monthStart = startOfMonth(cursor);
  const monthEnd = endOfMonth(cursor);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = useMemo(
    () => eachDayOfInterval({ start: gridStart, end: gridEnd }),
    [gridStart, gridEnd],
  );

  function openSlot(s: SlotD) {
    setPanel({ kind: "slot", slot: s });
    setOpen(true);
  }

  function openBlock(b: BlockD) {
    setPanel({ kind: "block", block: b });
    setOpen(true);
  }

  const weekdayLabels = ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"];
  const hasCalendarFeed = Boolean(icalFeedUrl);
  const appleCalendarUrl = icalWebcalUrl ?? icalFeedUrl ?? "";
  const googleCalendarAddByUrl = icalFeedUrl
    ? `https://calendar.google.com/calendar/u/0/r/settings/addbyurl?cid=${encodeURIComponent(icalFeedUrl)}`
    : "";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Kalender</h1>
          <p className="text-sm text-muted-foreground">Ledige tider, bookinger og blokeringer i månedsvisning.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="icon-sm" onClick={() => setCursor((c) => addMonths(c, -1))}>
            <ChevronLeft className="size-4" aria-hidden />
            <span className="sr-only">Forrige måned</span>
          </Button>
          <span className="min-w-[10rem] text-center text-sm font-medium capitalize">
            {format(cursor, "MMMM yyyy", { locale: da })}
          </span>
          <Button type="button" variant="outline" size="icon-sm" onClick={() => setCursor((c) => addMonths(c, 1))}>
            <ChevronRight className="size-4" aria-hidden />
            <span className="sr-only">Næste måned</span>
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border/60">
        <div className="min-w-[720px]">
          <div className="grid grid-cols-7 border-b border-border/60 bg-muted/30 text-center text-xs font-medium text-muted-foreground">
            {weekdayLabels.map((d) => (
              <div key={d} className="px-1 py-2">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 divide-x divide-border/60">
            {days.map((day) => {
              const inMonth = isSameMonth(day, cursor);
              const slotHits = slotsDetailed.filter((s) =>
                overlapsDay(new Date(s.startsAt), new Date(s.endsAt), day),
              );
              const blockHits = blocks.filter((b) =>
                overlapsDay(new Date(b.startsAt), new Date(b.endsAt), day),
              );

              return (
                <div
                  key={day.toISOString()}
                  className={`min-h-[112px] border-b border-border/60 p-1 ${inMonth ? "bg-background" : "bg-muted/15"}`}
                >
                  <div
                    className={`mb-1 text-right text-xs font-medium ${inMonth ? "text-foreground" : "text-muted-foreground"}`}
                  >
                    {format(day, "d")}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    {blockHits.map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => openBlock(b)}
                        className="truncate rounded border border-dashed border-muted-foreground/40 bg-muted/50 px-1 py-0.5 text-left text-[10px] text-muted-foreground hover:bg-muted"
                      >
                        Blok {format(new Date(b.startsAt), "HH:mm")}
                      </button>
                    ))}
                    {slotHits.slice(0, 4).map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => openSlot(s)}
                        className={`truncate rounded px-1 py-0.5 text-left text-[10px] font-medium ${
                          s.booking
                            ? s.booking.status === "CONFIRMED"
                              ? "bg-primary/15 text-primary"
                              : s.booking.status === "PENDING"
                                ? "bg-amber-500/15 text-amber-900 dark:text-amber-200"
                                : "bg-muted text-muted-foreground"
                            : "bg-emerald-500/12 text-emerald-900 dark:text-emerald-200"
                        }`}
                      >
                        {s.booking ? s.booking.customerName.split(" ")[0] : "Ledig"}{" "}
                        {format(new Date(s.startsAt), "HH:mm")}
                      </button>
                    ))}
                    {slotHits.length > 4 ? (
                      <span className="text-[10px] text-muted-foreground">+{slotHits.length - 4}</span>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="grid gap-2 sm:grid-cols-2">
          <Button
            type="button"
            size="sm"
            className="justify-start gap-2"
            disabled={!hasCalendarFeed}
            onClick={() => {
              if (!hasCalendarFeed) return;
              window.location.href = appleCalendarUrl;
            }}
          >
            <AppleCalendarIcon />
            Tilføj til din iOS kalender
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="justify-start gap-2"
            disabled={!hasCalendarFeed}
            onClick={() => {
              if (!hasCalendarFeed) return;
              window.location.href = googleCalendarAddByUrl;
            }}
          >
            <GoogleCalendarIcon />
            Tilføj til din Google kalender
          </Button>
        </div>
        {!hasCalendarFeed ? (
          <p className="text-xs text-muted-foreground">
            Kalenderfeed mangler ({icalFeedMissingEnv.length > 0 ? icalFeedMissingEnv.join(", ") : "ADMIN_ICAL_TOKEN, NEXT_PUBLIC_SITE_URL"}).
          </p>
        ) : null}
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          {panel?.kind === "slot" ? (
            <>
              <SheetHeader>
                <SheetTitle>Tid</SheetTitle>
                <SheetDescription>{formatSlotRangeDa(panel.slot.startsAt, panel.slot.endsAt)}</SheetDescription>
              </SheetHeader>
              {panel.slot.booking ? (
                <div className="space-y-3 px-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Status</span>
                    <Badge variant={panel.slot.booking.status === "CONFIRMED" ? "default" : "secondary"}>
                      {statusLabel(panel.slot.booking.status)}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Kunde</p>
                    <p className="font-medium">{panel.slot.booking.customerName}</p>
                    <p className="text-muted-foreground">{panel.slot.booking.customerEmail}</p>
                    <p className="text-muted-foreground">{panel.slot.booking.customerPhone}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Adresse</p>
                    <p>
                      {panel.slot.booking.addressLine}, {panel.slot.booking.postalCode} {panel.slot.booking.city}
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">m²</p>
                      <p className="font-medium">{panel.slot.booking.squareMeters}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Pris</p>
                      <p className="font-medium">{panel.slot.booking.totalPrice.toLocaleString("da-DK")} kr</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">Booking-id: {panel.slot.booking.id}</p>
                </div>
              ) : (
                <div className="space-y-4 px-4">
                  <p className="text-sm text-muted-foreground">Ledig tid — du kan slette slotttet fra fanen Tider.</p>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isPending}
                    onClick={() => {
                      startTransition(async () => {
                        await deleteOpenSlotAction(panel.slot.id);
                        toast.success("Slot slettet");
                        setOpen(false);
                        router.refresh();
                      });
                    }}
                  >
                    Slet dette slot
                  </Button>
                </div>
              )}
            </>
          ) : panel?.kind === "block" ? (
            <>
              <SheetHeader>
                <SheetTitle>Blokering</SheetTitle>
                <SheetDescription>
                  {format(new Date(panel.block.startsAt), "PPP p", { locale: da })} →{" "}
                  {format(new Date(panel.block.endsAt), "PPP p", { locale: da })}
                </SheetDescription>
              </SheetHeader>
              <div className="px-4 text-sm">
                {panel.block.note ? <p className="text-muted-foreground">{panel.block.note}</p> : <p>Ingen note.</p>}
                <p className="mt-2 text-xs text-muted-foreground">Slet blokering under fanen Blokeringer.</p>
              </div>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}
