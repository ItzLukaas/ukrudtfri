"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { changeAdminPasswordAction } from "@/server/admin-account-actions";

export function AdminAccountClient() {
  const [pending, startTransition] = useTransition();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Konto</h1>
        <p className="text-sm text-muted-foreground">Skift adgangskode for din admin-konto.</p>
      </div>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>Skift adgangskode</CardTitle>
          <CardDescription>Kræver nuværende adgangskode.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="current-password">Nuværende adgangskode</Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">Ny adgangskode</Label>
              <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} autoComplete="new-password" />
            </div>
          </div>
          <Button
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                try {
                  const res = await changeAdminPasswordAction({ currentPassword, newPassword });
                  if (!res.ok) toast.error(res.message);
                  else {
                    setCurrentPassword("");
                    setNewPassword("");
                    toast.success("Adgangskode opdateret.");
                  }
                } catch {
                  toast.error("Kunne ikke opdatere adgangskode.");
                }
              })
            }
          >
            Opdater adgangskode
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
