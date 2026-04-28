import { AdminOverviewClient } from "@/components/admin/admin-overview-client";
import { getAdminDashboardPayload } from "@/server/admin-data";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const data = await getAdminDashboardPayload();
  return <AdminOverviewClient data={data} />;
}
