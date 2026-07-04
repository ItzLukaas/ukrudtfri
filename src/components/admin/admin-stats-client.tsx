"use client";

import { format, parseISO } from "date-fns";
import { da } from "date-fns/locale";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { UmamiMetricRow, UmamiPageviewsSeries, UmamiStatsSummary } from "@/server/umami-api";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

function pctChange(current: number, prev: number) {
  if (prev === 0) return current > 0 ? "+100%" : "0%";
  const p = Math.round(((current - prev) / prev) * 1000) / 10;
  const sign = p > 0 ? "+" : "";
  return `${sign}${p}%`;
}

function StatCard({
  title,
  value,
  prev,
  suffix,
}: {
  title: string;
  value: number;
  prev: number;
  suffix?: string;
}) {
  return (
    <Card className="border-border/60">
      <CardHeader className="pb-2">
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-2xl tabular-nums">
          {value.toLocaleString("da-DK")}
          {suffix ? <span className="text-base font-medium text-muted-foreground">{suffix}</span> : null}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Badge variant="secondary" className="font-normal">
          vs. forrige periode: {pctChange(value, prev)}
        </Badge>
      </CardContent>
    </Card>
  );
}

export function AdminStatsClient({
  stats,
  pageviews,
  topPages,
  activeVisitors,
  rangeLabel,
}: {
  stats: UmamiStatsSummary;
  pageviews: UmamiPageviewsSeries;
  topPages: UmamiMetricRow[];
  activeVisitors: number;
  rangeLabel: string;
}) {
  const chartData = pageviews.pageviews.map((row) => {
    let label = row.x;
    try {
      const d = parseISO(row.x.replace(" ", "T"));
      if (!Number.isNaN(d.getTime())) label = format(d, "d. MMM", { locale: da });
    } catch {
      /* keep raw */
    }
    return { label, pageviews: row.y, sessions: pageviews.sessions.find((s) => s.x === row.x)?.y ?? 0 };
  });

  const totalMinutes = Math.round(stats.totaltime.value / 60);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Statistik</h1>
        <p className="text-sm text-muted-foreground">{rangeLabel}</p>
        <p className="mt-2 text-xs text-muted-foreground">
          Aktive besøgende lige nu (ca. sidste 5 min. i Umami):{" "}
          <span className="font-semibold text-foreground">{activeVisitors}</span>
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Sidevisninger" value={stats.pageviews.value} prev={stats.pageviews.prev} />
        <StatCard title="Unikke besøgende" value={stats.visitors.value} prev={stats.visitors.prev} />
        <StatCard title="Besøg (sessioner)" value={stats.visits.value} prev={stats.visits.prev} />
        <StatCard title="Afvisninger (ét side-besøg)" value={stats.bounces.value} prev={stats.bounces.prev} />
      </div>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>Tid på siden</CardTitle>
          <CardDescription>Summeret besøgstid i den valgte periode (fra Umami).</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold tabular-nums">{totalMinutes.toLocaleString("da-DK")} min</p>
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>Sidevisninger pr. dag</CardTitle>
          <CardDescription>Seneste 14 dage · Europe/Copenhagen</CardDescription>
        </CardHeader>
        <CardContent className="h-[280px] w-full min-w-0 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/60" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} className="text-muted-foreground" />
              <YAxis width={36} tick={{ fontSize: 11 }} className="text-muted-foreground" allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  border: "1px solid hsl(var(--border))",
                  background: "hsl(var(--card))",
                }}
                labelFormatter={(l) => String(l)}
              />
              <Line type="monotone" dataKey="pageviews" name="Sidevisninger" stroke="#2d6a3a" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>Mest besøgte sider</CardTitle>
          <CardDescription>Top URL’er i perioden (efter antal besøgende i Umami).</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Side</TableHead>
                  <TableHead className="text-right">Besøgende</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topPages.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} className="text-muted-foreground">
                      Ingen data endnu.
                    </TableCell>
                  </TableRow>
                ) : (
                  topPages.map((row) => (
                    <TableRow key={row.x}>
                      <TableCell className="max-w-[280px] truncate font-mono text-xs">{row.x || "/"}</TableCell>
                      <TableCell className="text-right tabular-nums">{row.y.toLocaleString("da-DK")}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
