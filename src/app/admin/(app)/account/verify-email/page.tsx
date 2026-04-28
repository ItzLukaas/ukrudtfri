import Link from "next/link";
import { consumeAdminEmailChangeTokenAction } from "@/server/admin-account-actions";

export const dynamic = "force-dynamic";

export default async function VerifyAdminEmailPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  const result = await consumeAdminEmailChangeTokenAction(token ?? "");

  return (
    <div className="mx-auto max-w-xl space-y-4 rounded-xl border border-border/60 bg-card p-6">
      <h1 className="text-2xl font-semibold tracking-tight">Bekræft email</h1>
      <p className={result.ok ? "text-emerald-700 dark:text-emerald-400" : "text-red-700 dark:text-red-400"}>
        {result.ok ? "Din admin-email er nu opdateret." : result.message}
      </p>
      <Link href="/admin/account" className="text-sm font-medium text-primary underline underline-offset-4">
        Tilbage til kontoindstillinger
      </Link>
    </div>
  );
}
