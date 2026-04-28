"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { da } from "date-fns/locale";
import { toast } from "sonner";
import type { AdminDashboardPayload } from "@/lib/admin-payload-types";
import { sendTemplateTestAction, upsertEmailTemplateAction } from "@/server/admin-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const PLACEHOLDERS = [
  "{{customerName}}",
  "{{customerEmail}}",
  "{{customerPhone}}",
  "{{addressLine}}",
  "{{postalCode}}",
  "{{city}}",
  "{{addressLabel}}",
  "{{whenLabel}}",
  "{{slotEndLabel}}",
  "{{squareMeters}}",
  "{{totalPrice}}",
  "{{bookingId}}",
  "{{status}}",
].join(", ");

type EditingRow = AdminDashboardPayload["emailTemplates"][number] | {
  slug: string;
  name: string;
  subject: string;
  bodyHtml: string;
};

export function AdminMailClient({ initial }: { initial: AdminDashboardPayload["emailTemplates"] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [editing, setEditing] = useState<EditingRow>(() =>
    initial[0] ?? {
      slug: "min_skabelon",
      name: "Min skabelon",
      subject: "Hej {{customerName}}",
      bodyHtml: "<p>Tilpas denne skabelon og gem.</p>",
    },
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Mail-skabeloner</h1>
        <p className="text-sm text-muted-foreground">
          Redigér HTML og emne. Variabler: {PLACEHOLDERS}. Brug slug <code className="rounded bg-muted px-1">kun_små_bogstaver_og_</code>.
        </p>
      </div>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>Vælg eller opret</CardTitle>
          <CardDescription>Klik på en skabelon for at indlæse den i formularen.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {initial.map((t) => (
            <Button key={t.id} type="button" size="sm" variant="outline" onClick={() => setEditing({ ...t })}>
              {t.name}
              <span className="ml-1 text-[10px] text-muted-foreground">
                ({format(new Date(t.updatedAt), "d. MMM", { locale: da })})
              </span>
            </Button>
          ))}
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => setEditing({ slug: "ny_skabelon", name: "Ny skabelon", subject: "Hej {{customerName}}", bodyHtml: "<p>Skriv HTML her…</p>" })}
          >
            + Ny
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>Redigér skabelon</CardTitle>
          <CardDescription>Gem opretter eller overskriver efter slug.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-1">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={editing.slug}
              onChange={(e) => setEditing((x) => ({ ...x, slug: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "") }))}
              className="font-mono text-sm"
            />
          </div>
          <div className="space-y-2 md:col-span-1">
            <Label htmlFor="name">Visningsnavn</Label>
            <Input id="name" value={editing.name} onChange={(e) => setEditing((x) => ({ ...x, name: e.target.value }))} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="subj">Emne</Label>
            <Input id="subj" value={editing.subject} onChange={(e) => setEditing((x) => ({ ...x, subject: e.target.value }))} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="body">HTML-indhold</Label>
            <Textarea
              id="body"
              rows={14}
              value={editing.bodyHtml}
              onChange={(e) => setEditing((x) => ({ ...x, bodyHtml: e.target.value }))}
              className="font-mono text-xs md:text-sm"
            />
          </div>
          <div className="flex flex-wrap gap-2 md:col-span-2">
            <Button
              disabled={isPending || !editing.slug}
              onClick={() => {
                startTransition(async () => {
                  const res = await upsertEmailTemplateAction({
                    slug: editing.slug,
                    name: editing.name,
                    subject: editing.subject,
                    bodyHtml: editing.bodyHtml,
                  });
                  if (!res.ok) toast.error(res.message);
                  else {
                    toast.success("Skabelon gemt");
                    router.refresh();
                  }
                });
              }}
            >
              Gem skabelon
            </Button>
            <Button
              variant="outline"
              disabled={isPending || !editing.slug}
              onClick={() => {
                startTransition(async () => {
                  const res = await sendTemplateTestAction(editing.slug);
                  if (!res.ok) toast.error(res.message ?? "Fejl");
                  else toast.success("Testmail sendt til din admin-mail");
                });
              }}
            >
              Send test til mig
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
