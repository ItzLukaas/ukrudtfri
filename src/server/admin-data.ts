import { addDays, format, startOfMonth, startOfWeek, subDays } from "date-fns";
import { da } from "date-fns/locale";
import { BookingStatus } from "@prisma/client";
import type { AdminDashboardPayload } from "@/lib/admin-payload-types";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/settings";

export type { AdminDashboardPayload } from "@/lib/admin-payload-types";

function emptyByStatus(): Record<BookingStatus, number> {
  return {
    PENDING: 0,
    CONFIRMED: 0,
    REJECTED: 0,
    CANCELLED: 0,
  };
}

function getIcalFeedUrl() {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/$/, "");
  const token = process.env.ADMIN_ICAL_TOKEN;
  return siteUrl && token ? `${siteUrl}/api/admin/calendar/ics?token=${encodeURIComponent(token)}` : null;
}

export async function getAdminOverviewData(): Promise<Pick<AdminDashboardPayload, "stats">> {
  const today = new Date();
  const monthStart = startOfMonth(today);
  const histogramFrom = subDays(today, 56);

  const [statusGroups, revenueAgg, bookingsForHistogram, upcomingBookings] = await Promise.all([
    prisma.booking.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),
    prisma.booking.aggregate({
      where: {
        status: "CONFIRMED",
        createdAt: { gte: monthStart },
      },
      _sum: { totalPrice: true },
    }),
    prisma.booking.findMany({
      where: { createdAt: { gte: histogramFrom } },
      select: { createdAt: true },
    }),
    prisma.booking.findMany({
      where: {
        status: { in: ["PENDING", "CONFIRMED"] },
        slot: { startsAt: { gte: today } },
      },
      orderBy: { slot: { startsAt: "asc" } },
      take: 12,
      include: { slot: true },
    }),
  ]);

  const byStatus = emptyByStatus();
  for (const row of statusGroups) {
    byStatus[row.status] = row._count._all;
  }

  const weekBuckets = new Map<string, number>();
  for (const b of bookingsForHistogram) {
    const key = format(startOfWeek(b.createdAt, { weekStartsOn: 1 }), "yyyy-MM-dd");
    weekBuckets.set(key, (weekBuckets.get(key) ?? 0) + 1);
  }

  return {
    stats: {
      byStatus,
      revenueMonthDkk: Number(revenueAgg._sum.totalPrice ?? 0),
      bookingsLastWeeks: Array.from(weekBuckets.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-10)
        .map(([weekKey, count]) => ({
          weekKey,
          weekLabel: format(new Date(weekKey + "T12:00:00"), "d. MMM", { locale: da }),
          count,
        })),
      upcomingVisits: upcomingBookings.map((b) => ({
        bookingId: b.id,
        customerName: b.customerName,
        addressLine: b.addressLine,
        postalCode: b.postalCode,
        city: b.city,
        slotStartsAt: b.slot.startsAt.toISOString(),
        status: b.status,
      })),
    },
  };
}

export async function getAdminCalendarData(): Promise<
  Pick<AdminDashboardPayload, "slotsDetailed" | "blocks" | "icalFeedUrl">
> {
  const [slots, blocks] = await Promise.all([
    prisma.openSlot.findMany({
      orderBy: { startsAt: "asc" },
      take: 400,
      include: { booking: true },
    }),
    prisma.blockedWindow.findMany({ orderBy: { startsAt: "asc" }, take: 200 }),
  ]);

  return {
    slotsDetailed: slots.map((s) => ({
      id: s.id,
      startsAt: s.startsAt.toISOString(),
      endsAt: s.endsAt.toISOString(),
      booking: s.booking
        ? {
            id: s.booking.id,
            customerName: s.booking.customerName,
            customerEmail: s.booking.customerEmail,
            customerPhone: s.booking.customerPhone,
            addressLine: s.booking.addressLine,
            postalCode: s.booking.postalCode,
            city: s.booking.city,
            squareMeters: s.booking.squareMeters,
            totalPrice: Number(s.booking.totalPrice),
            status: s.booking.status,
          }
        : null,
    })),
    blocks: blocks.map((b) => ({
      id: b.id,
      startsAt: b.startsAt.toISOString(),
      endsAt: b.endsAt.toISOString(),
      note: b.note,
    })),
    icalFeedUrl: getIcalFeedUrl(),
  };
}

export async function getAdminBookingsData(): Promise<Pick<AdminDashboardPayload, "bookings" | "emailTemplates">> {
  const [bookings, emailTemplates] = await Promise.all([
    prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
      take: 150,
      include: { slot: true },
    }),
    prisma.emailTemplate.findMany({ orderBy: { slug: "asc" } }),
  ]);

  return {
    bookings: bookings.map((b) => ({
      id: b.id,
      createdAt: b.createdAt.toISOString(),
      customerName: b.customerName,
      customerEmail: b.customerEmail,
      customerPhone: b.customerPhone,
      addressLine: b.addressLine,
      postalCode: b.postalCode,
      city: b.city,
      squareMeters: b.squareMeters,
      totalPrice: Number(b.totalPrice),
      status: b.status,
      slotStartsAt: b.slot.startsAt.toISOString(),
      slotEndsAt: b.slot.endsAt.toISOString(),
    })),
    emailTemplates: emailTemplates.map((t) => ({
      id: t.id,
      slug: t.slug,
      name: t.name,
      subject: t.subject,
      bodyHtml: t.bodyHtml,
      updatedAt: t.updatedAt.toISOString(),
    })),
  };
}

export async function getAdminAvailabilityData(): Promise<Pick<AdminDashboardPayload, "uiDefaults" | "slots">> {
  const today = new Date();
  const slots = await prisma.openSlot.findMany({
    orderBy: { startsAt: "asc" },
    take: 400,
    include: { booking: true },
  });

  return {
    uiDefaults: {
      bulkStartDate: format(today, "yyyy-MM-dd"),
      bulkEndDate: format(addDays(today, 14), "yyyy-MM-dd"),
    },
    slots: slots.map((s) => ({
      id: s.id,
      startsAt: s.startsAt.toISOString(),
      endsAt: s.endsAt.toISOString(),
      hasBooking: Boolean(s.booking),
    })),
  };
}

export async function getAdminBlocksData(): Promise<Pick<AdminDashboardPayload, "blocks">> {
  const blocks = await prisma.blockedWindow.findMany({ orderBy: { startsAt: "asc" }, take: 200 });
  return {
    blocks: blocks.map((b) => ({
      id: b.id,
      startsAt: b.startsAt.toISOString(),
      endsAt: b.endsAt.toISOString(),
      note: b.note,
    })),
  };
}

export async function getAdminSettingsData(): Promise<Pick<AdminDashboardPayload, "settings">> {
  const settings = await getSiteSettings();
  return {
    settings: {
      pricePerSquareMeter: Number(settings.pricePerSquareMeter),
      minimumPrice: Number(settings.minimumPrice),
      serviceRadiusKm: Number(settings.serviceRadiusKm),
      baseLabel: settings.baseLabel,
      baseLatitude: settings.baseLatitude,
      baseLongitude: settings.baseLongitude,
    },
  };
}

export async function getAdminDashboardPayload(): Promise<AdminDashboardPayload> {
  const today = new Date();
  const monthStart = startOfMonth(today);
  const histogramFrom = subDays(today, 56);

  const icalFeedUrl = getIcalFeedUrl();

  const [
    settings,
    slots,
    bookings,
    blocks,
    emailTemplates,
    statusGroups,
    revenueAgg,
    bookingsForHistogram,
    upcomingBookings,
  ] = await Promise.all([
    getSiteSettings(),
    prisma.openSlot.findMany({
      orderBy: { startsAt: "asc" },
      take: 400,
      include: { booking: true },
    }),
    prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
      take: 150,
      include: { slot: true },
    }),
    prisma.blockedWindow.findMany({ orderBy: { startsAt: "asc" }, take: 200 }),
    prisma.emailTemplate.findMany({ orderBy: { slug: "asc" } }),
    prisma.booking.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),
    prisma.booking.aggregate({
      where: {
        status: "CONFIRMED",
        createdAt: { gte: monthStart },
      },
      _sum: { totalPrice: true },
    }),
    prisma.booking.findMany({
      where: { createdAt: { gte: histogramFrom } },
      select: { createdAt: true },
    }),
    prisma.booking.findMany({
      where: {
        status: { in: ["PENDING", "CONFIRMED"] },
        slot: { startsAt: { gte: today } },
      },
      orderBy: { slot: { startsAt: "asc" } },
      take: 12,
      include: { slot: true },
    }),
  ]);

  const byStatus = emptyByStatus();
  for (const row of statusGroups) {
    byStatus[row.status] = row._count._all;
  }

  const revenueMonthDkk = Number(revenueAgg._sum.totalPrice ?? 0);

  const weekBuckets = new Map<string, number>();
  for (const b of bookingsForHistogram) {
    const key = format(startOfWeek(b.createdAt, { weekStartsOn: 1 }), "yyyy-MM-dd");
    weekBuckets.set(key, (weekBuckets.get(key) ?? 0) + 1);
  }
  const bookingsLastWeeks = Array.from(weekBuckets.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-10)
    .map(([weekKey, count]) => ({
      weekKey,
      weekLabel: format(new Date(weekKey + "T12:00:00"), "d. MMM", { locale: da }),
      count,
    }));

  return {
    uiDefaults: {
      bulkStartDate: format(today, "yyyy-MM-dd"),
      bulkEndDate: format(addDays(today, 14), "yyyy-MM-dd"),
    },
    settings: {
      pricePerSquareMeter: Number(settings.pricePerSquareMeter),
      minimumPrice: Number(settings.minimumPrice),
      serviceRadiusKm: Number(settings.serviceRadiusKm),
      baseLabel: settings.baseLabel,
      baseLatitude: settings.baseLatitude,
      baseLongitude: settings.baseLongitude,
    },
    policies: {
      termsPolicyText: settings.termsPolicyText,
      cancellationPolicyText: settings.cancellationPolicyText,
      privacyPolicyText: settings.privacyPolicyText,
      mailFooterExtraHtml: settings.mailFooterExtraHtml,
    },
    stats: {
      byStatus,
      revenueMonthDkk,
      bookingsLastWeeks,
      upcomingVisits: upcomingBookings.map((b) => ({
        bookingId: b.id,
        customerName: b.customerName,
        addressLine: b.addressLine,
        postalCode: b.postalCode,
        city: b.city,
        slotStartsAt: b.slot.startsAt.toISOString(),
        status: b.status,
      })),
    },
    slots: slots.map((s) => ({
      id: s.id,
      startsAt: s.startsAt.toISOString(),
      endsAt: s.endsAt.toISOString(),
      hasBooking: Boolean(s.booking),
    })),
    slotsDetailed: slots.map((s) => ({
      id: s.id,
      startsAt: s.startsAt.toISOString(),
      endsAt: s.endsAt.toISOString(),
      booking: s.booking
        ? {
            id: s.booking.id,
            customerName: s.booking.customerName,
            customerEmail: s.booking.customerEmail,
            customerPhone: s.booking.customerPhone,
            addressLine: s.booking.addressLine,
            postalCode: s.booking.postalCode,
            city: s.booking.city,
            squareMeters: s.booking.squareMeters,
            totalPrice: Number(s.booking.totalPrice),
            status: s.booking.status,
          }
        : null,
    })),
    bookings: bookings.map((b) => ({
      id: b.id,
      createdAt: b.createdAt.toISOString(),
      customerName: b.customerName,
      customerEmail: b.customerEmail,
      customerPhone: b.customerPhone,
      addressLine: b.addressLine,
      postalCode: b.postalCode,
      city: b.city,
      squareMeters: b.squareMeters,
      totalPrice: Number(b.totalPrice),
      status: b.status,
      slotStartsAt: b.slot.startsAt.toISOString(),
      slotEndsAt: b.slot.endsAt.toISOString(),
    })),
    blocks: blocks.map((b) => ({
      id: b.id,
      startsAt: b.startsAt.toISOString(),
      endsAt: b.endsAt.toISOString(),
      note: b.note,
    })),
    emailTemplates: emailTemplates.map((t) => ({
      id: t.id,
      slug: t.slug,
      name: t.name,
      subject: t.subject,
      bodyHtml: t.bodyHtml,
      updatedAt: t.updatedAt.toISOString(),
    })),
    icalFeedUrl,
  };
}

