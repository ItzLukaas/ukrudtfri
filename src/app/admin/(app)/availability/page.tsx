import { AdminAvailabilityClient } from "@/components/admin/admin-availability-client";
import { getAdminAvailabilityData } from "@/server/admin-data";

export const dynamic = "force-dynamic";

export default async function AdminAvailabilityPage() {
  const data = await getAdminAvailabilityData();
  return <AdminAvailabilityClient initial={data} />;
}
