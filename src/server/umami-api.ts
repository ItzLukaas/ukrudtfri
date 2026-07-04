/**
 * Server-side Umami API (bruges kun i admin — aldrig eksponér UMAMI_PASSWORD til klienten).
 * Kræver samme Umami-instans som SiteAnalytics (NEXT_PUBLIC_UMAMI_URL + website id).
 */

const TOKEN_TTL_MS = 50 * 60 * 1000;

let tokenCache: { token: string; exp: number } | null = null;

function baseUrl() {
  const raw = (process.env.UMAMI_API_URL ?? process.env.NEXT_PUBLIC_UMAMI_URL)?.trim().replace(/\/$/, "");
  return raw && raw.length > 0 ? raw : null;
}

function websiteId() {
  return (process.env.UMAMI_WEBSITE_ID ?? process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID)?.trim() || null;
}

function credentials() {
  const username = process.env.UMAMI_USERNAME?.trim();
  const password = process.env.UMAMI_PASSWORD?.trim();
  if (!username || !password) return null;
  return { username, password };
}

async function getBearerToken(): Promise<string | null> {
  const base = baseUrl();
  const cred = credentials();
  if (!base || !cred) return null;

  if (tokenCache && Date.now() < tokenCache.exp) {
    return tokenCache.token;
  }

  const res = await fetch(`${base}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ username: cred.username, password: cred.password }),
    cache: "no-store",
  });

  if (!res.ok) {
    tokenCache = null;
    return null;
  }

  const data = (await res.json()) as { token?: string };
  if (!data.token) {
    tokenCache = null;
    return null;
  }

  tokenCache = { token: data.token, exp: Date.now() + TOKEN_TTL_MS };
  return data.token;
}

export function umamiEnvStatus(): "missing_url" | "missing_id" | "missing_credentials" | "ready" {
  if (!baseUrl()) return "missing_url";
  if (!websiteId()) return "missing_id";
  if (!credentials()) return "missing_credentials";
  return "ready";
}

export type UmamiStatsSummary = {
  pageviews: { value: number; prev: number };
  visitors: { value: number; prev: number };
  visits: { value: number; prev: number };
  bounces: { value: number; prev: number };
  totaltime: { value: number; prev: number };
};

export type UmamiPageviewsSeries = {
  pageviews: { x: string; y: number }[];
  sessions: { x: string; y: number }[];
};

export type UmamiMetricRow = { x: string; y: number };

async function umamiGet<T>(pathWithQuery: string): Promise<{ ok: true; data: T } | { ok: false; status: number; message: string }> {
  const base = baseUrl();
  const id = websiteId();
  if (!base || !id) {
    return { ok: false, status: 0, message: "Mangler Umami-URL eller website-id." };
  }

  const token = await getBearerToken();
  if (!token) {
    return { ok: false, status: 401, message: "Umami-login mislykkedes (tjek UMAMI_USERNAME / UMAMI_PASSWORD)." };
  }

  const path = pathWithQuery.startsWith("/") ? pathWithQuery : `/${pathWithQuery}`;
  const url = `${base}${path}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return {
      ok: false,
      status: res.status,
      message: text ? `Umami API ${res.status}: ${text.slice(0, 200)}` : `Umami API fejl (${res.status}).`,
    };
  }

  return { ok: true, data: (await res.json()) as T };
}

export async function fetchUmamiDashboardPayload() {
  const id = websiteId();
  if (!id) {
    return { ok: false as const, code: "missing_id" as const, message: "Mangler website-id." };
  }

  const endAt = Date.now();
  const startAt = endAt - 30 * 24 * 60 * 60 * 1000;
  const start14 = endAt - 14 * 24 * 60 * 60 * 1000;
  const q = (extra: Record<string, string>) => {
    const p = new URLSearchParams({
      startAt: String(startAt),
      endAt: String(endAt),
      ...extra,
    });
    return `?${p.toString()}`;
  };
  const q14 = new URLSearchParams({
    startAt: String(start14),
    endAt: String(endAt),
    unit: "day",
    timezone: "Europe/Copenhagen",
  }).toString();

  const [stats, pageviews, topPages, active] = await Promise.all([
    umamiGet<UmamiStatsSummary>(`/api/websites/${id}/stats${q({})}`),
    umamiGet<UmamiPageviewsSeries>(`/api/websites/${id}/pageviews?${q14}`),
    umamiGet<unknown>(`/api/websites/${id}/metrics?${new URLSearchParams({
      startAt: String(startAt),
      endAt: String(endAt),
      type: "url",
      limit: "12",
    }).toString()}`),
    umamiGet<{ visitors: number }>(`/api/websites/${id}/active`),
  ]);

  if (!stats.ok) return { ok: false as const, code: "api" as const, message: stats.message, status: stats.status };
  if (!pageviews.ok) return { ok: false as const, code: "api" as const, message: pageviews.message, status: pageviews.status };
  if (!topPages.ok) return { ok: false as const, code: "api" as const, message: topPages.message, status: topPages.status };
  if (!active.ok) return { ok: false as const, code: "api" as const, message: active.message, status: active.status };

  const rawMetrics = topPages.data;
  const topPagesList: UmamiMetricRow[] = Array.isArray(rawMetrics)
    ? rawMetrics
    : Array.isArray((rawMetrics as { data?: unknown }).data)
      ? ((rawMetrics as { data: UmamiMetricRow[] }).data ?? [])
      : [];

  return {
    ok: true as const,
    stats: stats.data,
    pageviews: pageviews.data,
    topPages: topPagesList,
    activeVisitors: active.data.visitors,
    rangeLabel: "Seneste 30 dage (sammenlignet med forrige periode i Umami)",
  };
}
