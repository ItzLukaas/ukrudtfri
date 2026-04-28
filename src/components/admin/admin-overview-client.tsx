"use client";

import Link from "next/link";
import { format } from "date-fns";
import { da } from "date-fns/locale";
import type { AdminDashboardPayload } from "@/lib/admin-payload-types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function statusDa(s: string) {
  if (s === "PENDING") return "Afventer";
  if (s === "CONFIRMED") return "Bekræftet";
  if (s === "REJECTED") return "Afvist";
  if (s === "CANCELLED") return "Annulleret";
  return s;
}

export function AdminOverviewClient({ data }: { data: AdminDashboardPayload }) {
  const { stats } = data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Overblik</h1>
        <p className="text-sm text-muted-foreground">En simpel oversigt over kommende bookinger.</p>
      </div>

      <Card className="border-border/60">
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle>Kommende bookinger</CardTitle>
            <CardDescription>Viser de næste bookinger, hvis der er nogen.</CardDescription>
          </div>
          <Link href="/admin/bookings" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
            Se alle
          </Link>
        </CardHeader>
        <CardContent className="space-y-3">
          {stats.upcomingVisits.length === 0 ? (
            <p className="text-sm text-muted-foreground">Ingen bookinger endnu.</p>
          ) : (
            stats.upcomingVisits.map((v) => (
              <div key={v.bookingId} className="rounded-lg border border-border/60 p-3 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium">{v.customerName}</span>
                  <Badge variant={v.status === "CONFIRMED" ? "default" : "secondary"}>{statusDa(v.status)}</Badge>
                </div>
                <p className="mt-1 text-muted-foreground">
                  {format(new Date(v.slotStartsAt), "EEE d. MMM yyyy 'kl.' HH:mm", { locale: da })}
                </p>
                <p className="text-xs text-muted-foreground">
                  {v.addressLine}, {v.postalCode} {v.city}
                </p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
