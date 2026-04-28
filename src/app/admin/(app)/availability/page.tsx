import { AdminAvailabilityClient } from "@/components/admin/admin-availability-client";
import { getAdminDashboardPayload } from "@/server/admin-data";

export const dynamic = "force-dynamic";

export default async function AdminAvailabilityPage() {
  const data = await getAdminDashboardPayload();
  return <AdminAvailabilityClient initial={data} />;
}
