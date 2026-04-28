import { AdminBookingsClient } from "@/components/admin/admin-bookings-client";
import { getAdminBookingsData } from "@/server/admin-data";

export const dynamic = "force-dynamic";

export default async function AdminBookingsPage() {
  const data = await getAdminBookingsData();
  return <AdminBookingsClient initial={data} />;
}
