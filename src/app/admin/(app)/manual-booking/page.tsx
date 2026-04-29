import { AdminManualBookingClient } from "@/components/admin/admin-manual-booking-client";
import { getAdminManualBookingData } from "@/server/admin-data";

export const dynamic = "force-dynamic";

export default async function AdminManualBookingPage() {
  const data = await getAdminManualBookingData();
  return <AdminManualBookingClient settings={data.settings} availableSlots={data.availableSlots} />;
}
