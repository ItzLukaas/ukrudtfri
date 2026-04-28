"use client";

import { useEffect, useMemo, useState, startTransition, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { da } from "date-fns/locale";
import {
  Building2,
  Calculator,
  Calendar,
  Check,
  ChevronRight,
  Clock,
  Home,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Ruler,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { calculateTotalDkk } from "@/lib/pricing";
import { checkServiceArea, createBookingRequest, type AddressCheckResult } from "@/server/public-booking";
import { cn } from "@/lib/utils";

type SlotDTO = { id: string; startsAt: string; endsAt: string };
type FeedbackTone = "error" | "success" | "info";

const STEPS = [
  { n: 1 as const, label: "Adresse", short: "Hvor", icon: MapPin },
  { n: 2 as const, label: "Areal", short: "m²", icon: Ruler },
  { n: 3 as const, label: "Tid", short: "Vælg", icon: Calendar },
  { n: 4 as const, label: "Kontakt", short: "Dig", icon: User },
];

const SQM_PRESETS = [150, 250, 400, 600, 1000];

function StepShell({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="overflow-hidden border-border/60">
      <CardHeader className="border-b border-border/50 bg-card pb-6">
        <div className="flex items-start gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-muted text-primary">
            <Icon className="size-6" aria-hidden />
          </span>
          <div className="space-y-1 pt-0.5">
            <CardTitle className="text-xl font-semibold tracking-tight sm:text-2xl">{title}</CardTitle>
            <CardDescription className="text-base leading-relaxed">{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 p-6 sm:p-8">{children}</CardContent>
    </Card>
  );
}

export function BookingWizard({
  pricing,
  initialSlots,
}: {
  pricing: { pricePerSquareMeter: number; minimumPrice: number; serviceRadiusKm: number; baseLabel: string };
  initialSlots: SlotDTO[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, runTransition] = useTransition();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const [addressLine, setAddressLine] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");

  const [geo, setGeo] = useState<Extract<AddressCheckResult, { ok: true }> | null>(null);

  const [squareMeters, setSquareMeters] = useState<number>(250);

  useEffect(() => {
    const raw = searchParams.get("sqm");
    if (!raw) return;
    const n = Number.parseInt(raw, 10);
    if (Number.isFinite(n) && n > 0 && n <= 250_000) {
      startTransition(() => {
        setSquareMeters(n);
      });
    }
  }, [searchParams]);

  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [feedback, setFeedback] = useState<{ tone: FeedbackTone; message: string } | null>(null);

  const totalPrice = useMemo(() => {
    return calculateTotalDkk(squareMeters || 0, pricing.pricePerSquareMeter, pricing.minimumPrice);
  }, [pricing.minimumPrice, pricing.pricePerSquareMeter, squareMeters]);

  const selectedSlot = useMemo(
    () => initialSlots.find((s) => s.id === selectedSlotId) ?? null,
    [initialSlots, selectedSlotId],
  );

  const progressPct = ((step - 1) / (STEPS.length - 1)) * 100;

  function onValidateAddress() {
    runTransition(async () => {
      const res = await checkServiceArea({ addressLine, postalCode, city });
      if (!res.ok) {
        setGeo(null);
        setFeedback({ tone: "error", message: res.message });
        return;
      }
      setGeo(res);
      setFeedback({ tone: "success", message: "Adressen er godkendt inden for serviceområdet." });
      setStep(2);
    });
  }

  function onConfirmArea() {
    if (!geo) {
      setFeedback({ tone: "error", message: "Tjek først adressen." });
      return;
    }
    if (!Number.isFinite(squareMeters) || squareMeters <= 0) {
      setFeedback({ tone: "error", message: "Angiv et gyldigt areal." });
      return;
    }
    if (initialSlots.length === 0) {
      setFeedback({ tone: "info", message: "Ingen ledige tider lige nu. Prøv igen senere." });
      return;
    }
    setFeedback(null);
    setStep(3);
  }

  function onConfirmSlot() {
    if (!selectedSlotId) {
      setFeedback({ tone: "error", message: "Vælg en tid." });
      return;
    }
    setFeedback(null);
    setStep(4);
  }

  function onSubmitBooking() {
    if (!geo || !selectedSlotId) return;
    runTransition(async () => {
      const res = await createBookingRequest({
        slotId: selectedSlotId,
        customerName,
        customerEmail,
        customerPhone,
        addressLine,
        postalCode,
        city,
        squareMeters,
        latitude: geo.latitude,
        longitude: geo.longitude,
      });

      if (!res.ok) {
        setFeedback({ tone: "error", message: res.message });
        return;
      }

      setFeedback({ tone: "success", message: "Booking oprettet." });
      router.push(`/booking/bekraeftelse?id=${res.bookingId}`);
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start lg:gap-10">
      <div className="space-y-8">
        {/* Progress + stepper */}
        <div className="space-y-4">
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out" style={{ width: `${progressPct}%` }} />
          </div>
          <ol className="grid grid-cols-4 gap-2 sm:gap-3" aria-label="Booking trin">
            {STEPS.map((s) => {
              const done = step > s.n;
              const active = step === s.n;
              const Icon = s.icon;
              return (
                <li key={s.n} className="min-w-0">
                  <div
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-xl border px-1.5 py-3 text-center transition sm:px-2 sm:py-4",
                      active && "border-primary/40 bg-primary/8",
                      done && !active && "border-primary/25 bg-primary/5",
                      !active && !done && "border-border/60 bg-background",
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-9 items-center justify-center rounded-full border-2 text-[0.65rem] font-semibold sm:size-10",
                        active && "border-primary bg-primary text-primary-foreground",
                        done && !active && "border-primary bg-primary text-primary-foreground",
                        !active && !done && "border-muted-foreground/25 bg-muted/40 text-muted-foreground",
                      )}
                    >
                      {done ? <Check className="size-4 sm:size-5" strokeWidth={2.5} aria-hidden /> : <Icon className="size-4 sm:size-4" aria-hidden />}
                    </span>
                    <span className="hidden w-full truncate text-[0.65rem] font-medium text-muted-foreground sm:block sm:text-xs">{s.label}</span>
                    <span className="w-full truncate text-[0.65rem] font-semibold sm:hidden">{s.short}</span>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
        {feedback ? (
          <div
            className={cn(
              "rounded-lg border px-4 py-3 text-sm",
              feedback.tone === "error" && "border-red-200 bg-red-50 text-red-700",
              feedback.tone === "success" && "border-emerald-200 bg-emerald-50 text-emerald-700",
              feedback.tone === "info" && "border-border/70 bg-muted/30 text-muted-foreground",
            )}
          >
            {feedback.message}
          </div>
        ) : null}

        {step === 1 && (
          <StepShell
            icon={Home}
            title="Hvor skal vi køre hen?"
            description={`Vi dækker en radius på ${pricing.serviceRadiusKm} km fra Give.`}
          >
            <div className="space-y-2">
              <Label htmlFor="addr" className="text-sm font-medium">
                Vej og husnummer
              </Label>
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
                <Input
                  id="addr"
                  className="h-11 pl-10"
                  placeholder="Fx Søndergade 12"
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  autoComplete="street-address"
                />
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="zip" className="text-sm font-medium">
                  Postnummer
                </Label>
                <div className="relative">
                  <Home className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
                  <Input
                    id="zip"
                    className="h-11 pl-10"
                    placeholder="7323"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    autoComplete="postal-code"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="city" className="text-sm font-medium">
                  By
                </Label>
                <div className="relative">
                  <Building2 className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
                  <Input
                    id="city"
                    className="h-11 pl-10"
                    placeholder="Give"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    autoComplete="address-level2"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-end">
              <Button className="h-11 gap-2 px-6" onClick={onValidateAddress} disabled={isPending}>
                {isPending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <ChevronRight className="size-4" aria-hidden />}
                Tjek adresse & fortsæt
              </Button>
            </div>
          </StepShell>
        )}

        {step === 2 && (
          <StepShell
            icon={Ruler}
            title="Hvor stort er arealet?"
            description={`Pris beregnes som m² × ${pricing.pricePerSquareMeter.toLocaleString("da-DK")} kr. Minimum ${pricing.minimumPrice.toLocaleString("da-DK")} kr.`}
          >
            <div className="space-y-3">
              <Label htmlFor="sqm" className="text-sm font-medium">
                Græsplæne (m²)
              </Label>
              <div className="relative max-w-md">
                <Ruler className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
                <Input
                  id="sqm"
                  className="h-12 pl-10 text-lg font-medium tabular-nums"
                  inputMode="decimal"
                  value={Number.isFinite(squareMeters) ? String(squareMeters) : ""}
                  onChange={(e) => {
                    const raw = e.target.value.replaceAll(",", ".").trim();
                    if (!raw) {
                      setSquareMeters(0);
                      return;
                    }
                    const n = Number(raw);
                    setSquareMeters(Number.isFinite(n) ? n : 0);
                  }}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="mr-1 self-center text-xs font-medium text-muted-foreground">Hurtigvalg:</span>
                {SQM_PRESETS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setSquareMeters(p)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs font-medium transition",
                      squareMeters === p
                        ? "border-primary bg-primary/12 text-primary"
                        : "border-border/70 bg-muted/30 text-muted-foreground hover:border-primary/30 hover:bg-primary/5",
                    )}
                  >
                    {p} m²
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col justify-between gap-4 rounded-2xl border border-border/60 bg-muted/20 p-5 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-xl bg-muted text-primary">
                  <Calculator className="size-5" aria-hidden />
                </span>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Din pris lige nu</p>
                  <p className="text-2xl font-semibold tabular-nums tracking-tight sm:text-3xl">
                    {totalPrice.toLocaleString("da-DK")}{" "}
                    <span className="text-lg font-medium text-muted-foreground">kr</span>
                  </p>
                </div>
              </div>
              <p className="max-w-xs text-xs leading-relaxed text-muted-foreground sm:text-right">
                Vejledende pris ved booking. Endelig betaling sker først når arbejdet er udført.
              </p>
            </div>

            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-between">
              <Button variant="outline" className="h-11" onClick={() => setStep(1)} disabled={isPending}>
                Tilbage
              </Button>
              <Button className="h-11 gap-2 px-6" onClick={onConfirmArea} disabled={isPending}>
                Vælg tid
                <ChevronRight className="size-4" aria-hidden />
              </Button>
            </div>
          </StepShell>
        )}

        {step === 3 && (
          <StepShell
            icon={Calendar}
            title="Vælg tidspunkt"
            description="Vælg den tid der passer dig bedst."
          >
            {initialSlots.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border/80 bg-muted/20 px-6 py-12 text-center">
                <Calendar className="mx-auto size-10 text-muted-foreground/60" aria-hidden />
                <p className="mt-3 font-medium">Ingen ledige tider lige nu</p>
                <p className="mt-1 text-sm text-muted-foreground">Kom tilbage senere, eller kontakt os direkte.</p>
              </div>
            ) : (
              <ul className="grid gap-3 sm:grid-cols-2">
                {initialSlots.map((s) => {
                  const active = s.id === selectedSlotId;
                  const start = new Date(s.startsAt);
                  const end = new Date(s.endsAt);
                  return (
                    <li key={s.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedSlotId(s.id)}
                        className={cn(
                          "group flex w-full flex-col gap-3 rounded-2xl border p-4 text-left transition-all sm:p-5",
                          active
                            ? "border-primary bg-primary/6 ring-1 ring-primary/20"
                            : "border-border/60 bg-card hover:border-primary/25 hover:bg-muted/30",
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-primary/80">
                              {format(start, "EEEE", { locale: da })}
                            </p>
                            <p className="text-lg font-semibold tabular-nums tracking-tight">
                              {format(start, "d. MMM", { locale: da })}
                            </p>
                          </div>
                          <span
                            className={cn(
                              "flex size-8 shrink-0 items-center justify-center rounded-full border-2 transition",
                              active ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/20 bg-background",
                            )}
                          >
                            {active ? <Check className="size-4" strokeWidth={2.5} aria-hidden /> : null}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="size-4 shrink-0 text-primary/70" aria-hidden />
                          <span className="font-medium text-foreground">
                            {format(start, "HH:mm")} – {format(end, "HH:mm")}
                          </span>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}

            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-between">
              <Button variant="outline" className="h-11" onClick={() => setStep(2)} disabled={isPending}>
                Tilbage
              </Button>
              <Button className="h-11 gap-2 px-6" onClick={onConfirmSlot} disabled={isPending || initialSlots.length === 0}>
                Fortsæt til kontakt
                <ChevronRight className="size-4" aria-hidden />
              </Button>
            </div>
          </StepShell>
        )}

        {step === 4 && (
          <StepShell
            icon={User}
            title="Dine oplysninger"
            description="Vi bruger dem til bookingmail og opfølgning på din booking."
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Fulde navn
                </Label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
                  <Input id="name" className="h-11 pl-10" value={customerName} onChange={(e) => setCustomerName(e.target.value)} autoComplete="name" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
                  <Input
                    id="email"
                    type="email"
                    className="h-11 pl-10"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">
                  Telefon
                </Label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
                  <Input id="phone" type="tel" className="h-11 pl-10" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} autoComplete="tel" />
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-between">
              <Button variant="outline" className="h-11" onClick={() => setStep(3)} disabled={isPending}>
                Tilbage
              </Button>
              <div className="flex flex-col items-start gap-2 sm:items-end">
                <Button className="h-11 gap-2 px-6" onClick={onSubmitBooking} disabled={isPending}>
                  {isPending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Check className="size-4" aria-hidden />}
                  Send booking
                </Button>
                <p className="text-xs text-muted-foreground sm:text-right">
                  Ved booking accepterer du{" "}
                  <Link href="/aftalebetingelser" className="font-semibold text-[#1f6b3c] underline decoration-[#1f6b3c]/40 underline-offset-4 hover:text-[#184f2d]">
                    Aftalebetingelserne
                  </Link>
                  .
                </p>
              </div>
            </div>
          </StepShell>
        )}
      </div>

      {/* Sticky order summary */}
      <aside className="lg:sticky lg:top-24">
        <Card className="overflow-hidden border-border/60 bg-card">
          <CardHeader className="border-b border-border/50 bg-card pb-4">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <Calculator className="size-4 text-primary" aria-hidden />
              Din booking
            </CardTitle>
            <CardDescription>Opdateres mens du udfylder felterne.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-0 divide-y divide-border/50 p-0">
            <SummaryRow icon={MapPin} label="Serviceområde" value={`${pricing.serviceRadiusKm} km fra Give`} />
            <SummaryRow
              icon={Home}
              label="Adresse"
              value={geo ? "Inden for område" : "Afventer tjek"}
              hint={geo?.displayName}
              positive={Boolean(geo)}
            />
            <SummaryRow
              icon={Ruler}
              label="Areal"
              value={Number.isFinite(squareMeters) && squareMeters > 0 ? `${squareMeters.toLocaleString("da-DK")} m²` : "—"}
            />
            <SummaryRow
              icon={Calendar}
              label="Tid"
              value={
                selectedSlot
                  ? `${format(new Date(selectedSlot.startsAt), "EEE d. MMM", { locale: da })} · ${format(new Date(selectedSlot.startsAt), "HH:mm")}–${format(new Date(selectedSlot.endsAt), "HH:mm")}`
                  : "—"
              }
            />
            <SummaryRow icon={Check} label="Status" value="Afventer manuel bekræftelse" />
            <div className="flex items-center justify-between gap-3 bg-muted/20 px-5 py-5">
              <span className="text-sm font-medium text-muted-foreground">Total</span>
              <span className="text-2xl font-bold tabular-nums tracking-tight text-primary">
                {totalPrice.toLocaleString("da-DK")} <span className="text-base font-semibold">kr</span>
              </span>
            </div>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}

function SummaryRow({
  icon: Icon,
  label,
  value,
  hint,
  positive,
}: {
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  label: string;
  value: string;
  hint?: string;
  positive?: boolean;
}) {
  return (
    <div className="flex gap-3 px-5 py-4">
      <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted/80 text-muted-foreground">
        <Icon className="size-4" aria-hidden />
      </span>
      <div className="min-w-0 flex-1 space-y-1">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className={cn("text-sm font-semibold leading-snug", positive && "text-emerald-700 dark:text-emerald-400")}>{value}</p>
        {hint ? <p className="line-clamp-2 text-xs text-muted-foreground">{hint}</p> : null}
      </div>
    </div>
  );
}
