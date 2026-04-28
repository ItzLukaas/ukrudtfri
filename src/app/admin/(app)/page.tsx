import { AdminOverviewClient } from "@/components/admin/admin-overview-client";
import { getAdminOverviewData } from "@/server/admin-data";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const data = await getAdminOverviewData();
  return <AdminOverviewClient data={data} />;
}
