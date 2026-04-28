import { AdminSettingsClient } from "@/components/admin/admin-settings-client";
import { getAdminDashboardPayload } from "@/server/admin-data";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const data = await getAdminDashboardPayload();
  return <AdminSettingsClient initial={data.settings} />;
}
