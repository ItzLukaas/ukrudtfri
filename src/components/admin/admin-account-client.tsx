"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  changeAdminPasswordAction,
  requestAdminEmailChangeAction,
  updateAdminAvatarAction,
} from "@/server/admin-account-actions";

export function AdminAccountClient({ initial }: { initial: { email: string; avatarUrl: string } }) {
  const [pending, startTransition] = useTransition();
  const [email, setEmail] = useState(initial.email);
  const [avatarUrl, setAvatarUrl] = useState(initial.avatarUrl);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Konto</h1>
        <p className="text-sm text-muted-foreground">Skift email, adgangskode og avatar for din admin-konto.</p>
      </div>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>Skift email</CardTitle>
          <CardDescription>Du modtager en bekræftelsesmail på den nye adresse.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="account-email">Ny email</Label>
            <Input id="account-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          </div>
          <Button
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                const res = await requestAdminEmailChangeAction({ newEmail: email });
                if (!res.ok) toast.error(res.message);
                else toast.success("Bekraeftelsesmail sendt.");
              })
            }
          >
            Send bekræftelsesmail
          </Button>
        </CardContent>
      </Card>

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
                const res = await changeAdminPasswordAction({ currentPassword, newPassword });
                if (!res.ok) toast.error(res.message);
                else {
                  setCurrentPassword("");
                  setNewPassword("");
                  toast.success("Adgangskode opdateret.");
                }
              })
            }
          >
            Opdater adgangskode
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>Avatar</CardTitle>
          <CardDescription>Angiv en offentlig URL til dit profilbillede.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="avatar-url">Avatar URL</Label>
            <Input id="avatar-url" type="url" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} placeholder="https://..." />
          </div>
          <Button
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                const res = await updateAdminAvatarAction({ avatarUrl });
                if (!res.ok) toast.error(res.message);
                else toast.success("Avatar opdateret.");
              })
            }
          >
            Gem avatar
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
