import type { BookingStatus } from "@prisma/client";

export type AdminDashboardPayload = {
  uiDefaults: {
    bulkStartDate: string;
    bulkEndDate: string;
  };
  settings: {
    pricePerSquareMeter: number;
    minimumPrice: number;
    serviceRadiusKm: number;
    baseLabel: string;
    baseLatitude: number;
    baseLongitude: number;
  };
  policies: {
    termsPolicyText: string;
    cancellationPolicyText: string;
    privacyPolicyText: string;
    mailFooterExtraHtml: string;
  };
  stats: {
    byStatus: Record<BookingStatus, number>;
    revenueMonthDkk: number;
    bookingsLastWeeks: { weekKey: string; weekLabel: string; count: number }[];
    upcomingVisits: Array<{
      bookingId: string;
      customerName: string;
      addressLine: string;
      postalCode: string;
      city: string;
      slotStartsAt: string;
      status: BookingStatus;
    }>;
  };
  slots: Array<{ id: string; startsAt: string; endsAt: string; hasBooking: boolean }>;
  slotsDetailed: Array<{
    id: string;
    startsAt: string;
    endsAt: string;
    booking:
      | null
      | {
          id: string;
          customerName: string;
          customerEmail: string;
          customerPhone: string;
          addressLine: string;
          postalCode: string;
          city: string;
          squareMeters: number;
          totalPrice: number;
          status: BookingStatus;
        };
  }>;
  bookings: Array<{
    id: string;
    createdAt: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    addressLine: string;
    postalCode: string;
    city: string;
    squareMeters: number;
    totalPrice: number;
    status: BookingStatus;
    slotStartsAt: string;
    slotEndsAt: string;
  }>;
  blocks: Array<{ id: string; startsAt: string; endsAt: string; note: string | null }>;
  emailTemplates: Array<{ id: string; slug: string; name: string; subject: string; bodyHtml: string; updatedAt: string }>;
  icalFeedUrl: string | null;
  icalWebcalUrl: string | null;
  icalFeedMissingEnv: string[];
};
