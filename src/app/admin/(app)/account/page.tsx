import { AdminAccountClient } from "@/components/admin/admin-account-client";
import { getAdminAccountData } from "@/server/admin-account-actions";

export const dynamic = "force-dynamic";

export default async function AdminAccountPage() {
  const data = await getAdminAccountData();
  return <AdminAccountClient initial={data} />;
}
