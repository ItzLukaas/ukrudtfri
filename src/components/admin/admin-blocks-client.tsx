"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { da } from "date-fns/locale";
import { toast } from "sonner";
import type { AdminDashboardPayload } from "@/lib/admin-payload-types";
import { createBlockedWindowAction, deleteBlockedWindowAction } from "@/server/admin-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function toLocalDatetimeValue(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function AdminBlocksClient({ initial }: { initial: AdminDashboardPayload["blocks"] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [block, setBlock] = useState(() => {
    const start = new Date();
    const end = new Date(Date.now() + 2 * 3600000);
    return { startsAt: toLocalDatetimeValue(start), endsAt: toLocalDatetimeValue(end), note: "" };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Blokeringer</h1>
        <p className="text-sm text-muted-foreground">Skjul ledige tider i valgte perioder.</p>
      </div>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>Blokér tidsperioder</CardTitle>
          <CardDescription>Overlappende ledige slots vises ikke for kunder.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="bs">Start</Label>
            <Input id="bs" type="datetime-local" value={block.startsAt} onChange={(e) => setBlock((b) => ({ ...b, startsAt: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="be">Slut</Label>
            <Input id="be" type="datetime-local" value={block.endsAt} onChange={(e) => setBlock((b) => ({ ...b, endsAt: e.target.value }))} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="bn">Note (valgfri)</Label>
            <Input id="bn" value={block.note} onChange={(e) => setBlock((b) => ({ ...b, note: e.target.value }))} />
          </div>
          <div className="md:col-span-2">
            <Button
              disabled={isPending}
              onClick={() => {
                startTransition(async () => {
                  const res = await createBlockedWindowAction(block);
                  if (!res.ok) toast.error(res.message);
                  else {
                    toast.success("Blokering oprettet");
                    router.refresh();
                  }
                });
              }}
            >
              Tilføj blokering
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>Aktive blokeringer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {initial.length === 0 ? <p className="text-sm text-muted-foreground">Ingen blokeringer.</p> : null}
          {initial.map((b) => (
            <div key={b.id} className="flex flex-col gap-2 rounded-lg border border-border/60 p-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm">
                <div className="font-medium">
                  {format(new Date(b.startsAt), "PPP p", { locale: da })} → {format(new Date(b.endsAt), "PPP p", { locale: da })}
                </div>
                {b.note ? <div className="text-xs text-muted-foreground">{b.note}</div> : null}
              </div>
              <Button
                size="sm"
                variant="outline"
                disabled={isPending}
                onClick={() => {
                  startTransition(async () => {
                    await deleteBlockedWindowAction(b.id);
                    toast.success("Blokering slettet");
                    router.refresh();
                  });
                }}
              >
                Slet
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
