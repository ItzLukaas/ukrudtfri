import { AdminCalendarClient } from "@/components/admin/admin-calendar-client";
import { getAdminCalendarData } from "@/server/admin-data";

export const dynamic = "force-dynamic";

export default async function AdminCalendarPage() {
  const data = await getAdminCalendarData();
  return (
    <AdminCalendarClient slotsDetailed={data.slotsDetailed} blocks={data.blocks} icalFeedUrl={data.icalFeedUrl} />
  );
}
