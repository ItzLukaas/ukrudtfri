"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { AdminDashboardPayload } from "@/lib/admin-payload-types";
import { updateSiteSettingsAction } from "@/server/admin-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AdminSettingsClient({ initial }: { initial: AdminDashboardPayload["settings"] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [settings, setSettings] = useState(initial);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Priser & område</h1>
        <p className="text-sm text-muted-foreground">Bruges til live prisberegning og radius-check ved booking.</p>
      </div>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>Indstillinger</CardTitle>
          <CardDescription>Gem ændringer for at slå igennem på booking-siden.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="ppm">Pris pr. m² (DKK)</Label>
            <Input
              id="ppm"
              inputMode="decimal"
              value={String(settings.pricePerSquareMeter)}
              onChange={(e) => setSettings((s) => ({ ...s, pricePerSquareMeter: Number(e.target.value) }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="minp">Minimumspris (DKK)</Label>
            <Input
              id="minp"
              inputMode="numeric"
              value={String(settings.minimumPrice)}
              onChange={(e) => setSettings((s) => ({ ...s, minimumPrice: Number(e.target.value) }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rad">Service radius (km)</Label>
            <Input
              id="rad"
              inputMode="decimal"
              value={String(settings.serviceRadiusKm)}
              onChange={(e) => setSettings((s) => ({ ...s, serviceRadiusKm: Number(e.target.value) }))}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="baseLabel">Baselokation (label)</Label>
            <Input
              id="baseLabel"
              value={settings.baseLabel}
              onChange={(e) => setSettings((s) => ({ ...s, baseLabel: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lat">Base latitude</Label>
            <Input
              id="lat"
              inputMode="decimal"
              value={String(settings.baseLatitude)}
              onChange={(e) => setSettings((s) => ({ ...s, baseLatitude: Number(e.target.value) }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lon">Base longitude</Label>
            <Input
              id="lon"
              inputMode="decimal"
              value={String(settings.baseLongitude)}
              onChange={(e) => setSettings((s) => ({ ...s, baseLongitude: Number(e.target.value) }))}
            />
          </div>

          <div className="md:col-span-2">
            <Button
              disabled={isPending}
              onClick={() => {
                startTransition(async () => {
                  const res = await updateSiteSettingsAction(settings);
                  if (!res.ok) toast.error(res.message);
                  else {
                    toast.success("Indstillinger gemt");
                    router.refresh();
                  }
                });
              }}
            >
              Gem indstillinger
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
