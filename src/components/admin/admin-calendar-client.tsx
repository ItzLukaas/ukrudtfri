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
import { ChevronLeft, ChevronRight, Copy } from "lucide-react";
import { toast } from "sonner";
import type { AdminDashboardPayload } from "@/lib/admin-payload-types";
import { deleteOpenSlotAction } from "@/server/admin-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { formatSlotRangeDa } from "@/lib/admin-calendar-utils";

type SlotD = AdminDashboardPayload["slotsDetailed"][number];
type BlockD = AdminDashboardPayload["blocks"][number];

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
}: Pick<AdminDashboardPayload, "slotsDetailed" | "blocks" | "icalFeedUrl">) {
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

      {icalFeedUrl ? (
        <Card className="border-border/60 border-primary/20 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Synkronisér med Google eller iPhone</CardTitle>
            <CardDescription>
              Kopiér linket og tilføj det som <strong>abonnement på kalender</strong> (Google Kalender → Indstillinger →
              Tilføj kalender → Fra URL). iPhone: Indstillinger → Kalender → Konti → Tilføj abonnement.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <code className="min-w-0 flex-1 truncate rounded-md border border-border/60 bg-background px-2 py-1.5 text-xs">
              {icalFeedUrl}
            </code>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="shrink-0 gap-1.5"
              onClick={() => {
                void navigator.clipboard.writeText(icalFeedUrl);
                toast.success("Link kopieret");
              }}
            >
              <Copy className="size-3.5" aria-hidden />
              Kopiér
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-border/60 border-amber-500/30 bg-amber-500/5">
          <CardHeader>
            <CardTitle className="text-base">iCal-feed ikke aktivt</CardTitle>
            <CardDescription>
              Sæt <code className="rounded bg-muted px-1">ADMIN_ICAL_TOKEN</code> og{" "}
              <code className="rounded bg-muted px-1">NEXT_PUBLIC_SITE_URL</code> i miljøvariabler for at få et
              abonnementslink.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

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
