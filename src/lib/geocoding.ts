import { haversineKm } from "@/lib/geo";

export type GeocodeHit = {
  displayName: string;
  lat: number;
  lon: number;
};

export type DanishAddressInput = {
  addressLine: string;
  postalCode: string;
  city: string;
};

type NominatimRow = {
  lat: string;
  lon: string;
  display_name: string;
  importance?: number;
};

function nominatimUserAgent() {
  const contact = process.env.NOMINATIM_CONTACT_EMAIL ?? "contact@ukrudtfri.dk";
  return `Ukrudtfri.dk booking (${contact})`;
}

/** Danmark — viewbox (min lon, max lat, max lon, min lat) for at bias væk fra forkerte globale homonymer. */
const DK_VIEWBOX = "8.0,58.0,15.5,54.4";

async function nominatimFetch(extra: URLSearchParams): Promise<NominatimRow[]> {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  extra.forEach((value, key) => {
    url.searchParams.set(key, value);
  });
  url.searchParams.set("format", "json");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("countrycodes", "dk");
  url.searchParams.set("limit", "10");
  url.searchParams.set("accept-language", "da");
  url.searchParams.set("viewbox", DK_VIEWBOX);
  url.searchParams.set("bounded", "0");

  const res = await fetch(url.toString(), {
    headers: {
      "User-Agent": nominatimUserAgent(),
      Accept: "application/json",
    },
    next: { revalidate: 0 },
  });

  if (!res.ok) return [];
  const data = (await res.json()) as NominatimRow[];
  return Array.isArray(data) ? data : [];
}

function rowToHit(row: NominatimRow): GeocodeHit | null {
  const lat = Number(row.lat);
  const lon = Number(row.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  return { displayName: row.display_name, lat, lon };
}

/**
 * Vælg bedste hit: høj Nominatim-importance først, derefter tættest på driftbase
 * (hjælper når første rå hit er en administrativ flade langt fra adressen).
 */
function pickBestHit(rows: NominatimRow[], base?: { lat: number; lon: number }): GeocodeHit | null {
  const withMeta = rows
    .map((row) => {
      const hit = rowToHit(row);
      if (!hit) return null;
      return {
        hit,
        importance: row.importance ?? 0,
        d: base ? haversineKm(base, { lat: hit.lat, lon: hit.lon }) : 0,
      };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  if (withMeta.length === 0) return null;

  withMeta.sort((a, b) => {
    if (Math.abs(b.importance - a.importance) > 0.0001) return b.importance - a.importance;
    return a.d - b.d;
  });

  return withMeta[0].hit;
}

/**
 * Geokod dansk adresse: struktureret opslag først (by + postnr matcher bedre end én lang streng),
 * derefter fritekst. Bruger driftbase til tie-break mellem lige "vigtige" hits.
 */
export async function geocodeDanishAddress(
  input: DanishAddressInput,
  opts?: { base?: { lat: number; lon: number } },
): Promise<GeocodeHit | null> {
  const street = input.addressLine.trim();
  const postal = input.postalCode.trim();
  const city = input.city.trim();
  if (!city && !postal && !street) return null;

  const base = opts?.base;

  const structured = new URLSearchParams();
  if (street) structured.set("street", street);
  if (city) structured.set("city", city);
  if (postal) structured.set("postalcode", postal);

  let rows = await nominatimFetch(structured);

  if (rows.length === 0) {
    const q = [street, postal, city].filter(Boolean).join(", ");
    const free = new URLSearchParams();
    free.set("q", `${q}, Danmark`);
    rows = await nominatimFetch(free);
  }

  return pickBestHit(rows, base);
}

/** Fritekst (ældre kald) — rangér uden base-hjælp. */
export async function geocodeDenmark(query: string): Promise<GeocodeHit | null> {
  const trimmed = query.trim();
  if (!trimmed) return null;
  const free = new URLSearchParams();
  free.set("q", trimmed.includes("Danmark") ? trimmed : `${trimmed}, Danmark`);
  const rows = await nominatimFetch(free);
  return pickBestHit(rows);
}
