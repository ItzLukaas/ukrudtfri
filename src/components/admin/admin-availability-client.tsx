"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { da } from "date-fns/locale";
import { toast } from "sonner";
import type { AdminDashboardPayload } from "@/lib/admin-payload-types";
import { bulkCreateOpenSlotsAction, deleteOpenSlotAction } from "@/server/admin-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function toLocalDatetimeValue(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const weekdayOptions = [
  { v: 1, label: "Man" },
  { v: 2, label: "Tir" },
  { v: 3, label: "Ons" },
  { v: 4, label: "Tor" },
  { v: 5, label: "Fre" },
  { v: 6, label: "Lør" },
  { v: 0, label: "Søn" },
] as const;

export function AdminAvailabilityClient({ initial }: { initial: AdminDashboardPayload }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [bulk, setBulk] = useState({
    startDate: initial.uiDefaults.bulkStartDate,
    endDate: initial.uiDefaults.bulkEndDate,
    dailyStartHHmm: "09:00",
    dailyEndHHmm: "16:00",
    slotMinutes: 120,
    weekdays: new Set<number>([1, 2, 3, 4, 5]),
  });

  const slots = useMemo(() => initial.slots, [initial.slots]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Tider</h1>
        <p className="text-sm text-muted-foreground">Opret ledige slots og fjern ledige tider.</p>
      </div>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>Opret ledige tider (bulk)</CardTitle>
          <CardDescription>Generér bookbare slots i Europa/København-tidszone.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="sd">Startdato</Label>
              <Input id="sd" type="date" value={bulk.startDate} onChange={(e) => setBulk((b) => ({ ...b, startDate: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ed">Slutdato</Label>
              <Input id="ed" type="date" value={bulk.endDate} onChange={(e) => setBulk((b) => ({ ...b, endDate: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ds">Daglig start (HH:mm)</Label>
              <Input id="ds" value={bulk.dailyStartHHmm} onChange={(e) => setBulk((b) => ({ ...b, dailyStartHHmm: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="de">Daglig slut (HH:mm)</Label>
              <Input id="de" value={bulk.dailyEndHHmm} onChange={(e) => setBulk((b) => ({ ...b, dailyEndHHmm: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sm">Slotlængde (min)</Label>
              <Input
                id="sm"
                inputMode="numeric"
                value={String(bulk.slotMinutes)}
                onChange={(e) => setBulk((b) => ({ ...b, slotMinutes: Number(e.target.value) }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Ugedage</Label>
            <div className="flex flex-wrap gap-2">
              {weekdayOptions.map((w) => {
                const active = bulk.weekdays.has(w.v);
                return (
                  <Button
                    key={w.v}
                    type="button"
                    size="sm"
                    variant={active ? "default" : "outline"}
                    onClick={() => {
                      setBulk((b) => {
                        const next = new Set(b.weekdays);
                        if (next.has(w.v)) next.delete(w.v);
                        else next.add(w.v);
                        return { ...b, weekdays: next };
                      });
                    }}
                  >
                    {w.label}
                  </Button>
                );
              })}
            </div>
          </div>

          <Button
            disabled={isPending}
            onClick={() => {
              startTransition(async () => {
                const res = await bulkCreateOpenSlotsAction({
                  startDate: bulk.startDate,
                  endDate: bulk.endDate,
                  dailyStartHHmm: bulk.dailyStartHHmm,
                  dailyEndHHmm: bulk.dailyEndHHmm,
                  slotMinutes: bulk.slotMinutes,
                  weekdays: Array.from(bulk.weekdays),
                });
                if (!res.ok) toast.error(res.message);
                else {
                  toast.success(`Oprettede ${res.created} slots`);
                  router.refresh();
                }
              });
            }}
          >
            Generér slots
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>Eksisterende slots</CardTitle>
          <CardDescription>Slet kun ledige slots (uden booking).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-2">
            {slots.slice(0, 80).map((s) => (
              <div key={s.id} className="flex flex-col gap-2 rounded-lg border border-border/60 p-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm">
                  <div className="font-medium">
                    {format(new Date(s.startsAt), "PPP", { locale: da })} · {format(new Date(s.startsAt), "HH:mm")}–
                    {format(new Date(s.endsAt), "HH:mm")}
                  </div>
                  <div className="text-xs text-muted-foreground">{s.id}</div>
                </div>
                <div className="flex items-center gap-2">
                  {s.hasBooking ? <Badge>Booket</Badge> : <Badge variant="secondary">Ledig</Badge>}
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={isPending || s.hasBooking}
                    onClick={() => {
                      startTransition(async () => {
                        await deleteOpenSlotAction(s.id);
                        toast.success("Slot slettet");
                        router.refresh();
                      });
                    }}
                  >
                    Slet
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
