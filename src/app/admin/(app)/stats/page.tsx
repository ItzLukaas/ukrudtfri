import Link from "next/link";
import { BarChart3 } from "lucide-react";
import { AdminStatsClient } from "@/components/admin/admin-stats-client";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchUmamiDashboardPayload, umamiEnvStatus } from "@/server/umami-api";

export const dynamic = "force-dynamic";

export default async function AdminStatsPage() {
  const env = umamiEnvStatus();

  if (env !== "ready") {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Statistik</h1>
          <p className="text-sm text-muted-foreground">Umami-data i samme look som resten af admin — beskyttet af dit sædvanlige login.</p>
        </div>
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="size-5" aria-hidden />
              Opsætning mangler
            </CardTitle>
            <CardDescription>
              Tilføj følgende i Vercel (eller <code className="rounded bg-muted px-1">.env</code>) og deploy igen:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <ul className="list-inside list-disc space-y-2">
              <li>
                <code className="text-foreground">NEXT_PUBLIC_UMAMI_URL</code> — fx <code>https://stats.ukrudtfri.dk</code>
              </li>
              <li>
                <code className="text-foreground">NEXT_PUBLIC_UMAMI_WEBSITE_ID</code> — website UUID fra Umami
              </li>
              <li>
                <code className="text-foreground">UMAMI_USERNAME</code> og <code className="text-foreground">UMAMI_PASSWORD</code>{" "}
                — en Umami-bruger der må læse statistik (ofte samme admin som i Umami, eller en dedikeret bruger)
              </li>
            </ul>
            <p>
              Valgfrit: <code className="rounded bg-muted px-1">UMAMI_API_URL</code> hvis API-base afviger fra den offentlige
              script-URL.
            </p>
            <p className="text-xs">
              Dit normale admin-login på ukrudtfri.dk styrer kun adgang til denne side. Umami-login ligger kun som
              hemmelige server-variabler og bruges til at hente tal fra Umami API.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const payload = await fetchUmamiDashboardPayload();

  if (!payload.ok) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Statistik</h1>
          <p className="text-sm text-muted-foreground">Kunne ikke hente data fra Umami.</p>
        </div>
        <Card className="border-destructive/40">
          <CardHeader>
            <CardTitle>
              Fejl{" "}
              {"status" in payload && typeof payload.status === "number" ? `(${payload.status})` : ""}
            </CardTitle>
            <CardDescription>{payload.message}</CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href={process.env.NEXT_PUBLIC_UMAMI_URL ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "inline-flex")}
            >
              Åbn Umami-dashboard
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <AdminStatsClient
      stats={payload.stats}
      pageviews={payload.pageviews}
      topPages={payload.topPages}
      activeVisitors={payload.activeVisitors}
      rangeLabel={payload.rangeLabel}
    />
  );
}
