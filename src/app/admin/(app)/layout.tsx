import { AdminShell } from "@/components/admin/admin-shell";

export default function AdminAppLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
