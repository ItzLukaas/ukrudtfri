"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { da } from "date-fns/locale";
import { BookingStatus } from "@prisma/client";
import { toast } from "sonner";
import type { AdminDashboardPayload } from "@/lib/admin-payload-types";
import {
  cancelBookingAction,
  cancelBookingWithTemplateAction,
  sendTemplateToBookingAction,
  updateBookingStatusAction,
} from "@/server/admin-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

function statusBadgeVariant(status: BookingStatus): "default" | "secondary" | "destructive" {
  if (status === "CONFIRMED") return "default";
  if (status === "PENDING") return "secondary";
  return "destructive";
}

function statusLabel(status: BookingStatus) {
  if (status === "PENDING") return "Afventer";
  if (status === "CONFIRMED") return "Bekræftet";
  if (status === "REJECTED") return "Afvist";
  return "Annulleret";
}

export function AdminBookingsClient({
  initial,
}: { initial: Pick<AdminDashboardPayload, "bookings" | "emailTemplates"> }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [templateByBooking, setTemplateByBooking] = useState<Record<string, string>>({});
  const [notifyOnCancel, setNotifyOnCancel] = useState(true);

  const bookings = initial.bookings;
  const templates = initial.emailTemplates;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Bookinger</h1>
        <p className="text-sm text-muted-foreground">
          Godkend, afvis eller annullér. Brug skabeloner under Mail til aflysning uden standard status-mail.
        </p>
      </div>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>Alle bookinger</CardTitle>
          <CardDescription>
            Ved <strong>Annullér</strong> sendes kunden automatisk en kort status-mail, medmindre du slår den fra.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={notifyOnCancel}
                onChange={(e) => setNotifyOnCancel(e.target.checked)}
                className="rounded border-input"
              />
              Send standard-mail ved annullering
            </label>
          </div>
          <Separator />
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tid</TableHead>
                  <TableHead>Kunde</TableHead>
                  <TableHead>Adresse</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">m²</TableHead>
                  <TableHead className="text-right">Pris</TableHead>
                  <TableHead className="min-w-[280px]">Handling</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell className="whitespace-nowrap text-xs">
                      {format(new Date(b.slotStartsAt), "d. MMM HH:mm", { locale: da })}
                    </TableCell>
                    <TableCell className="text-xs">
                      <div className="font-medium">{b.customerName}</div>
                      <div className="text-muted-foreground">{b.customerEmail}</div>
                      <div className="text-muted-foreground">{b.customerPhone}</div>
                    </TableCell>
                    <TableCell className="max-w-[220px] text-xs">
                      {b.addressLine}, {b.postalCode} {b.city}
                    </TableCell>
                    <TableCell className="text-xs">
                      <Badge variant={statusBadgeVariant(b.status)}>{statusLabel(b.status)}</Badge>
                    </TableCell>
                    <TableCell className="text-right text-xs">{b.squareMeters}</TableCell>
                    <TableCell className="text-right text-xs">{b.totalPrice.toLocaleString("da-DK")} kr</TableCell>
                    <TableCell className="align-top text-xs">
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-wrap gap-1">
                          {b.status === "PENDING" ? (
                            <>
                              <Button
                                size="sm"
                                disabled={isPending}
                                onClick={() => {
                                  startTransition(async () => {
                                    const res = await updateBookingStatusAction(b.id, "CONFIRMED");
                                    if (!res.ok) toast.error(res.message);
                                    else {
                                      toast.success("Booking bekræftet");
                                      router.refresh();
                                    }
                                  });
                                }}
                              >
                                Godkend
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                disabled={isPending}
                                onClick={() => {
                                  startTransition(async () => {
                                    const res = await updateBookingStatusAction(b.id, "REJECTED");
                                    if (!res.ok) toast.error(res.message);
                                    else {
                                      toast.success("Booking afvist");
                                      router.refresh();
                                    }
                                  });
                                }}
                              >
                                Afvis
                              </Button>
                            </>
                          ) : null}
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={isPending}
                            onClick={() => {
                              startTransition(async () => {
                                await cancelBookingAction(b.id, { notifyCustomer: notifyOnCancel });
                                toast.success("Booking annulleret");
                                router.refresh();
                              });
                            }}
                          >
                            Annullér
                          </Button>
                        </div>
                        {templates.length > 0 ? (
                          <div className="flex flex-col gap-1 rounded-md border border-border/60 bg-muted/20 p-2">
                            <Label className="text-[10px] uppercase text-muted-foreground">Skabelon</Label>
                            <select
                              className="h-8 w-full rounded-md border border-input bg-background px-2 text-xs"
                              value={templateByBooking[b.id] ?? templates[0]?.slug ?? ""}
                              onChange={(e) => setTemplateByBooking((m) => ({ ...m, [b.id]: e.target.value }))}
                            >
                              {templates.map((t) => (
                                <option key={t.slug} value={t.slug}>
                                  {t.name}
                                </option>
                              ))}
                            </select>
                            <div className="flex flex-wrap gap-1">
                              <Button
                                size="sm"
                                variant="secondary"
                                className="text-xs"
                                disabled={isPending}
                                onClick={() => {
                                  const slug = templateByBooking[b.id] ?? templates[0]?.slug;
                                  if (!slug) return;
                                  startTransition(async () => {
                                    const res = await sendTemplateToBookingAction(b.id, slug);
                                    if (!res.ok) toast.error(res.message);
                                    else toast.success("Mail sendt");
                                  });
                                }}
                              >
                                Send mail
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs"
                                disabled={isPending}
                                onClick={() => {
                                  const slug = templateByBooking[b.id] ?? templates[0]?.slug;
                                  if (!slug) return;
                                  startTransition(async () => {
                                    const res = await cancelBookingWithTemplateAction(b.id, slug);
                                    if (!res.ok) toast.error(res.message);
                                    else {
                                      toast.success("Annulleret — skabelon sendt");
                                      router.refresh();
                                    }
                                  });
                                }}
                              >
                                Annullér + skabelon
                              </Button>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
