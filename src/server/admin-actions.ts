"use server";

import { auth } from "@/auth";
import { BookingStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { generateCandidateSlots, type GenerateSlotsInput } from "@/lib/slot-generator";
import { substituteTemplateVars } from "@/lib/email-template-vars";
import { sendTemplatedCustomerEmail } from "@/lib/mail";
import { setBookingStatus } from "@/server/booking-status";
import { bookingToTemplateVars } from "@/server/email-template-helpers";
import { revalidatePath } from "next/cache";
import { z } from "zod";

function revalidateAdmin() {
  const paths = [
    "/admin",
    "/admin/calendar",
    "/admin/bookings",
    "/admin/availability",
    "/admin/blocks",
    "/admin/settings",
    "/admin/policies",
    "/admin/mail",
  ];
  for (const p of paths) revalidatePath(p);
  revalidatePath("/booking");
}

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.email) throw new Error("UNAUTHORIZED");
  return session;
}

const settingsSchema = z.object({
  pricePerSquareMeter: z.coerce.number().positive().max(1000),
  minimumPrice: z.coerce.number().positive().max(100_000),
  serviceRadiusKm: z.coerce.number().positive().max(250),
  baseLabel: z.string().trim().min(2).max(120),
  baseLatitude: z.coerce.number().min(-90).max(90),
  baseLongitude: z.coerce.number().min(-180).max(180),
});

export async function updateSiteSettingsAction(raw: unknown) {
  await requireAdmin();
  const parsed = settingsSchema.safeParse(raw);
  if (!parsed.success) return { ok: false as const, message: parsed.error.issues[0]?.message ?? "Ugyldige indstillinger." };

  await prisma.siteSettings.update({
    where: { id: "global" },
    data: {
      pricePerSquareMeter: parsed.data.pricePerSquareMeter,
      minimumPrice: parsed.data.minimumPrice,
      serviceRadiusKm: parsed.data.serviceRadiusKm,
      baseLabel: parsed.data.baseLabel,
      baseLatitude: parsed.data.baseLatitude,
      baseLongitude: parsed.data.baseLongitude,
    },
  });

  revalidateAdmin();
  return { ok: true as const };
}

const bulkSlotsSchema = z.object({
  startDate: z.string().min(10),
  endDate: z.string().min(10),
  dailyStartHHmm: z.string().min(4),
  dailyEndHHmm: z.string().min(4),
  slotMinutes: z.coerce.number().int().min(15).max(720),
  weekdays: z.array(z.coerce.number().int().min(0).max(6)).min(1),
});

export async function bulkCreateOpenSlotsAction(raw: unknown) {
  await requireAdmin();
  const parsed = bulkSlotsSchema.safeParse(raw);
  if (!parsed.success) return { ok: false as const, message: parsed.error.issues[0]?.message ?? "Ugyldig input." };

  const gen = generateCandidateSlots(parsed.data as GenerateSlotsInput);
  if (!gen.ok) return { ok: false as const, message: gen.error };

  const blocks = await prisma.blockedWindow.findMany();
  const existing = await prisma.openSlot.findMany({ select: { startsAt: true, endsAt: true } });

  const overlaps = (aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) => aStart < bEnd && bStart < aEnd;

  const toCreate = gen.slots.filter((s) => {
    if (s.startsAt < new Date()) return false;
    if (blocks.some((b) => overlaps(s.startsAt, s.endsAt, b.startsAt, b.endsAt))) return false;
    if (existing.some((e) => overlaps(s.startsAt, s.endsAt, e.startsAt, e.endsAt))) return false;
    return true;
  });

  if (toCreate.length === 0) return { ok: true as const, created: 0 };

  await prisma.$transaction(
    toCreate.map((s) =>
      prisma.openSlot.create({
        data: { startsAt: s.startsAt, endsAt: s.endsAt },
      }),
    ),
  );

  revalidateAdmin();
  return { ok: true as const, created: toCreate.length };
}

export async function deleteOpenSlotAction(slotId: string) {
  await requireAdmin();
  await prisma.openSlot.deleteMany({
    where: { id: slotId, booking: null },
  });
  revalidateAdmin();
  return { ok: true as const };
}

const blockedSchema = z.object({
  startsAt: z.string().min(1),
  endsAt: z.string().min(1),
  note: z.string().trim().max(200).optional(),
});

export async function createBlockedWindowAction(raw: unknown) {
  await requireAdmin();
  const parsed = blockedSchema.safeParse(raw);
  if (!parsed.success) return { ok: false as const, message: parsed.error.issues[0]?.message ?? "Ugyldig periode." };

  const startsAt = new Date(parsed.data.startsAt);
  const endsAt = new Date(parsed.data.endsAt);
  if (!Number.isFinite(startsAt.getTime()) || !Number.isFinite(endsAt.getTime())) {
    return { ok: false as const, message: "Ugyldige datoer." };
  }
  if (endsAt <= startsAt) return { ok: false as const, message: "Sluttid skal være efter starttid." };

  await prisma.blockedWindow.create({
    data: {
      startsAt,
      endsAt,
      note: parsed.data.note || null,
    },
  });

  revalidateAdmin();
  return { ok: true as const };
}

export async function deleteBlockedWindowAction(id: string) {
  await requireAdmin();
  await prisma.blockedWindow.deleteMany({ where: { id } });
  revalidateAdmin();
  return { ok: true as const };
}

export async function cancelBookingAction(bookingId: string, options?: { notifyCustomer?: boolean }) {
  await requireAdmin();
  await setBookingStatus(bookingId, "CANCELLED", {
    notifyCustomer: options?.notifyCustomer !== false,
  });
  revalidateAdmin();
  return { ok: true as const };
}

export async function cancelBookingWithTemplateAction(bookingId: string, templateSlug: string) {
  await requireAdmin();
  const [booking, template] = await Promise.all([
    prisma.booking.findUnique({ where: { id: bookingId }, include: { slot: true } }),
    prisma.emailTemplate.findUnique({ where: { slug: templateSlug } }),
  ]);
  if (!booking) return { ok: false as const, message: "Booking blev ikke fundet." };
  if (!template) return { ok: false as const, message: "Skabelonen findes ikke." };

  const vars = bookingToTemplateVars({ ...booking, totalPrice: Number(booking.totalPrice) });
  const subject = substituteTemplateVars(template.subject, vars);
  const bodyHtml = substituteTemplateVars(template.bodyHtml, vars);
  await sendTemplatedCustomerEmail({
    to: booking.customerEmail,
    subject,
    bodyHtmlFragment: bodyHtml,
  });
  await setBookingStatus(bookingId, "CANCELLED", { notifyCustomer: false });
  revalidateAdmin();
  return { ok: true as const };
}

export async function updateBookingStatusAction(bookingId: string, status: BookingStatus) {
  await requireAdmin();
  if (!["PENDING", "CONFIRMED", "REJECTED", "CANCELLED"].includes(status)) {
    return { ok: false as const, message: "Ugyldig status." };
  }
  await setBookingStatus(bookingId, status);
  revalidateAdmin();
  return { ok: true as const };
}

const policiesSchema = z.object({
  termsPolicyText: z.string().max(120_000).optional(),
  cancellationPolicyText: z.string().max(80_000).optional(),
  privacyPolicyText: z.string().max(80_000).optional(),
  mailFooterExtraHtml: z.string().max(40_000).optional(),
});

export async function updatePoliciesAction(raw: unknown) {
  await requireAdmin();
  const parsed = policiesSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false as const, message: parsed.error.issues[0]?.message ?? "Ugyldig data." };
  }

  await prisma.siteSettings.update({
    where: { id: "global" },
    data: {
      termsPolicyText: parsed.data.termsPolicyText ?? "",
      cancellationPolicyText: parsed.data.cancellationPolicyText ?? "",
      privacyPolicyText: parsed.data.privacyPolicyText ?? "",
      mailFooterExtraHtml: parsed.data.mailFooterExtraHtml ?? "",
    },
  });
  revalidateAdmin();
  return { ok: true as const };
}

const emailTemplateSchema = z.object({
  slug: z.string().trim().regex(/^[a-z0-9_]+$/).max(64),
  name: z.string().trim().min(1).max(120),
  subject: z.string().trim().min(1).max(200),
  bodyHtml: z.string().min(1).max(100_000),
});

export async function upsertEmailTemplateAction(raw: unknown) {
  await requireAdmin();
  const parsed = emailTemplateSchema.safeParse(raw);
  if (!parsed.success) return { ok: false as const, message: parsed.error.issues[0]?.message ?? "Ugyldig skabelon." };

  await prisma.emailTemplate.upsert({
    where: { slug: parsed.data.slug },
    create: {
      slug: parsed.data.slug,
      name: parsed.data.name,
      subject: parsed.data.subject,
      bodyHtml: parsed.data.bodyHtml,
    },
    update: {
      name: parsed.data.name,
      subject: parsed.data.subject,
      bodyHtml: parsed.data.bodyHtml,
    },
  });
  revalidateAdmin();
  return { ok: true as const };
}

export async function sendTemplateTestAction(templateSlug: string) {
  const session = await requireAdmin();
  const emailTo = session.user?.email;
  if (!emailTo) return { ok: false as const, message: "Ingen email på session." };

  const template = await prisma.emailTemplate.findUnique({ where: { slug: templateSlug } });
  if (!template) return { ok: false as const, message: "Skabelon findes ikke." };

  const dummy: Record<string, string> = {
    bookingId: "demo-booking-id",
    customerName: "Demo Kunde",
    customerEmail: emailTo,
    customerPhone: "+45 12 34 56 78",
    addressLine: "Demo vej 1",
    postalCode: "7323",
    city: "Give",
    addressLabel: "Demo vej 1, 7323 Give",
    whenLabel: "mandag den 1. jan. 2030 kl. 10:00",
    slotEndLabel: "mandag den 1. jan. 2030 kl. 12:00",
    squareMeters: "500",
    totalPrice: "2.250 kr",
    status: "CONFIRMED",
  };

  const subject = substituteTemplateVars(template.subject, dummy);
  const bodyHtml = substituteTemplateVars(template.bodyHtml, dummy);
  await sendTemplatedCustomerEmail({ to: emailTo, subject, bodyHtmlFragment: bodyHtml });
  return { ok: true as const };
}

export async function sendTemplateToBookingAction(bookingId: string, templateSlug: string) {
  await requireAdmin();
  const booking = await prisma.booking.findUnique({ where: { id: bookingId }, include: { slot: true } });
  if (!booking) return { ok: false as const, message: "Booking blev ikke fundet." };
  const template = await prisma.emailTemplate.findUnique({ where: { slug: templateSlug } });
  if (!template) return { ok: false as const, message: "Skabelon findes ikke." };

  const vars = bookingToTemplateVars({ ...booking, totalPrice: Number(booking.totalPrice) });
  const subject = substituteTemplateVars(template.subject, vars);
  const bodyHtml = substituteTemplateVars(template.bodyHtml, vars);
  await sendTemplatedCustomerEmail({
    to: booking.customerEmail,
    subject,
    bodyHtmlFragment: bodyHtml,
  });
  return { ok: true as const };
}
