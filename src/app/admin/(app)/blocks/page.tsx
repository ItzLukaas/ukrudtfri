import { AdminBlocksClient } from "@/components/admin/admin-blocks-client";
import { getAdminDashboardPayload } from "@/server/admin-data";

export const dynamic = "force-dynamic";

export default async function AdminBlocksPage() {
  const data = await getAdminDashboardPayload();
  return <AdminBlocksClient initial={data.blocks} />;
}
