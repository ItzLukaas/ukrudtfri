"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { da } from "date-fns/locale";
import { Calculator, CalendarClock, Mail, MapPin, Phone, User } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { calculateTotalDkk } from "@/lib/pricing";
import { checkServiceArea } from "@/server/public-booking";
import { createManualBookingAction } from "@/server/admin-actions";

type ManualBookingProps = {
  settings: {
    pricePerSquareMeter: number;
    minimumPrice: number;
    serviceRadiusKm: number;
    baseLabel: string;
  };
  availableSlots: Array<{
    id: string;
    startsAt: string;
    endsAt: string;
  }>;
};

export function AdminManualBookingClient({ settings, availableSlots }: ManualBookingProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [squareMeters, setSquareMeters] = useState("250");
  const [timeMode, setTimeMode] = useState<"existing" | "new">("existing");
  const [slotId, setSlotId] = useState(availableSlots[0]?.id ?? "");
  const [newStartsAt, setNewStartsAt] = useState("");
  const [newDurationMinutes, setNewDurationMinutes] = useState("120");
  const [createCustomerEmails, setCreateCustomerEmails] = useState(true);
  const [geoPreview, setGeoPreview] = useState<{ latitude: number; longitude: number } | null>(null);

  const sqmValue = Number(squareMeters.replaceAll(",", "."));
  const estimatedPrice = Number.isFinite(sqmValue)
    ? calculateTotalDkk(sqmValue, settings.pricePerSquareMeter, settings.minimumPrice)
    : settings.minimumPrice;

  const addressQuery = [addressLine, postalCode, city].filter(Boolean).join(", ");
  const mapEmbedUrl = geoPreview
    ? `https://maps.google.com/maps?q=${encodeURIComponent(`${geoPreview.latitude},${geoPreview.longitude}`)}&t=k&z=18&output=embed`
    : addressQuery
      ? `https://maps.google.com/maps?q=${encodeURIComponent(addressQuery)}&t=k&z=17&output=embed`
      : null;

  const selectedSlotLabel = useMemo(() => {
    if (!slotId) return null;
    const slot = availableSlots.find((s) => s.id === slotId);
    if (!slot) return null;
    return `${format(new Date(slot.startsAt), "EEE d. MMM yyyy 'kl.' HH:mm", { locale: da })} - ${format(new Date(slot.endsAt), "HH:mm")}`;
  }, [availableSlots, slotId]);

  function onCheckAddress() {
    startTransition(async () => {
      const res = await checkServiceArea({ addressLine, postalCode, city });
      if (!res.ok) {
        setGeoPreview(null);
        toast.error(res.message);
        return;
      }
      setGeoPreview({ latitude: res.latitude, longitude: res.longitude });
      toast.success("Adresse godkendt i serviceområdet.");
    });
  }

  function onCreateBooking() {
    startTransition(async () => {
      const result = await createManualBookingAction({
        customerName,
        customerEmail,
        customerPhone,
        addressLine,
        postalCode,
        city,
        squareMeters: sqmValue,
        timeMode,
        slotId: timeMode === "existing" ? slotId : undefined,
        newStartsAt: timeMode === "new" ? newStartsAt : undefined,
        newDurationMinutes: timeMode === "new" ? Number(newDurationMinutes.replaceAll(",", ".")) : undefined,
        createCustomerEmails,
      });

      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      toast.success("Manuel booking oprettet.");
      router.push("/admin/bookings");
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Booking af kunde manuelt</h1>
        <p className="text-sm text-muted-foreground">
          Brug denne formular når en kunde ringer ind. Du kan vælge en eksisterende ledig tid eller oprette en ny tid med det samme.
        </p>
      </div>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>Manuel booking</CardTitle>
          <CardDescription>
            Når <strong>Opret kunde til automatiske mails</strong> er valgt, inkluderer det bekræftelsesmail nu og påmindelse cirka 2 timer før.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="mb-name">Kunde navn</Label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
                <Input id="mb-name" className="pl-10" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="mb-email">Kunde mail</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
                <Input
                  id="mb-email"
                  type="email"
                  className="pl-10"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="mb-phone">Kunde telefonnummer</Label>
              <div className="relative">
                <Phone className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
                <Input id="mb-phone" className="pl-10" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="mb-size">Størrelse af græsplæne (m²)</Label>
              <Input id="mb-size" inputMode="decimal" value={squareMeters} onChange={(e) => setSquareMeters(e.target.value)} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="mb-address">Kunde adresse</Label>
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
                <Input id="mb-address" className="pl-10" value={addressLine} onChange={(e) => setAddressLine(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="mb-zip">Postnummer</Label>
              <Input id="mb-zip" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mb-city">By</Label>
              <Input id="mb-city" value={city} onChange={(e) => setCity(e.target.value)} />
            </div>
          </div>

          {mapEmbedUrl ? (
            <div className="space-y-2">
              <Label>Satellit billede af kundens adresse</Label>
              <div className="overflow-hidden rounded-xl border border-border/60 bg-muted/20">
                <iframe
                  title="Satellit preview"
                  src={mapEmbedUrl}
                  loading="lazy"
                  className="h-56 w-full border-0"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          ) : null}

          <div className="flex flex-wrap items-center gap-3">
            <Button type="button" variant="outline" onClick={onCheckAddress} disabled={isPending}>
              Tjek adresse
            </Button>
            <p className="text-xs text-muted-foreground">Serviceområde: {settings.serviceRadiusKm.toLocaleString("da-DK")} km fra {settings.baseLabel}</p>
          </div>

          <div className="space-y-3 rounded-xl border border-border/60 p-4">
            <p className="text-sm font-medium">Vælg tidspunkt</p>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="time-mode"
                checked={timeMode === "existing"}
                onChange={() => setTimeMode("existing")}
              />
              Vælg en oprettet ledig tid
            </label>
            {timeMode === "existing" ? (
              <div className="space-y-2">
                <select
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  value={slotId}
                  onChange={(e) => setSlotId(e.target.value)}
                >
                  {availableSlots.length === 0 ? <option value="">Ingen ledige tider</option> : null}
                  {availableSlots.map((s) => (
                    <option key={s.id} value={s.id}>
                      {format(new Date(s.startsAt), "EEE d. MMM yyyy 'kl.' HH:mm", { locale: da })} - {format(new Date(s.endsAt), "HH:mm")}
                    </option>
                  ))}
                </select>
                {selectedSlotLabel ? <p className="text-xs text-muted-foreground">{selectedSlotLabel}</p> : null}
              </div>
            ) : null}

            <label className="flex items-center gap-2 text-sm">
              <input type="radio" name="time-mode" checked={timeMode === "new"} onChange={() => setTimeMode("new")} />
              Opret ny tid nu
            </label>
            {timeMode === "new" ? (
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="mb-new-start">Starttidspunkt</Label>
                  <Input
                    id="mb-new-start"
                    type="datetime-local"
                    value={newStartsAt}
                    onChange={(e) => setNewStartsAt(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mb-new-duration">Varighed (minutter)</Label>
                  <div className="relative">
                    <CalendarClock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
                    <Input
                      id="mb-new-duration"
                      inputMode="numeric"
                      className="pl-10"
                      value={newDurationMinutes}
                      onChange={(e) => setNewDurationMinutes(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-muted-foreground">Estimeret pris til kunden</span>
              <span className="inline-flex items-center gap-1 text-xl font-semibold text-primary">
                <Calculator className="size-4" aria-hidden />
                {estimatedPrice.toLocaleString("da-DK")} kr
              </span>
            </div>
          </div>

          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={createCustomerEmails}
              onChange={(e) => setCreateCustomerEmails(e.target.checked)}
              className="rounded border-input"
            />
            Opret kunde til automatiske mails
          </label>

          <div className="rounded-lg border border-emerald-300/50 bg-emerald-500/5 px-3 py-2 text-xs text-emerald-900 dark:text-emerald-200">
            Inkluderer en bekræftelse mail med booking af tid samt påmindelse mail cirka to timer før booking.
          </div>

          <div className="flex justify-end">
            <Button type="button" className="min-w-[12rem]" onClick={onCreateBooking} disabled={isPending}>
              {isPending ? "Opretter..." : "Opret manuel booking"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
