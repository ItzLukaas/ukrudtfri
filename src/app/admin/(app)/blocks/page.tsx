import { AdminBlocksClient } from "@/components/admin/admin-blocks-client";
import { getAdminBlocksData } from "@/server/admin-data";

export const dynamic = "force-dynamic";

export default async function AdminBlocksPage() {
  const data = await getAdminBlocksData();
  return <AdminBlocksClient initial={data.blocks} />;
}
