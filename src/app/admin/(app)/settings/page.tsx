import { AdminSettingsClient } from "@/components/admin/admin-settings-client";
import { getAdminSettingsData } from "@/server/admin-data";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const data = await getAdminSettingsData();
  return <AdminSettingsClient initial={data.settings} />;
}
