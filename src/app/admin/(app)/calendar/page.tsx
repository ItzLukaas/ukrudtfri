import { AdminCalendarClient } from "@/components/admin/admin-calendar-client";
import { getAdminDashboardPayload } from "@/server/admin-data";

export const dynamic = "force-dynamic";

export default async function AdminCalendarPage() {
  const data = await getAdminDashboardPayload();
  return (
    <AdminCalendarClient slotsDetailed={data.slotsDetailed} blocks={data.blocks} icalFeedUrl={data.icalFeedUrl} />
  );
}
