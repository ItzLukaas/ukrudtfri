import { AdminBookingsClient } from "@/components/admin/admin-bookings-client";
import { getAdminDashboardPayload } from "@/server/admin-data";

export const dynamic = "force-dynamic";

export default async function AdminBookingsPage() {
  const data = await getAdminDashboardPayload();
  return <AdminBookingsClient initial={data} />;
}
