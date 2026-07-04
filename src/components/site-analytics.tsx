import Script from "next/script";

const umamiWebsiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID?.trim();
const umamiBaseUrl = process.env.NEXT_PUBLIC_UMAMI_URL?.trim()?.replace(/\/$/, "");

const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN?.trim();

function plausibleScriptSrc() {
  const full = process.env.NEXT_PUBLIC_PLAUSIBLE_SRC?.trim();
  if (full) return full;
  const scriptName = process.env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT?.trim() || "script.outbound-links.js";
  return `https://plausible.io/js/${scriptName}`;
}

function umamiScriptSrc() {
  if (!umamiBaseUrl) return null;
  return `${umamiBaseUrl}/script.js`;
}

/**
 * Besøgsstatistik uden Plausible-cloud.
 *
 * **Umami** (anbefalet self-host): sæt `NEXT_PUBLIC_UMAMI_URL` (fx `https://stats.ukrudtfri.dk`)
 * og `NEXT_PUBLIC_UMAMI_WEBSITE_ID` (UUID fra Umami → Websites → indstillinger).
 * Dashboard: samme base-URL. Del med “kunder” via Umami **Share link** pr. website.
 *
 * **Plausible Community Edition** (self-host): sæt `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` + `NEXT_PUBLIC_PLAUSIBLE_SRC`
 * pegende på dit eget domæne, fx `https://stats.ukrudtfri.dk/js/script.js`.
 *
 * Umami vinder hvis begge er sat (undgå dobbelt tracking).
 */
export function SiteAnalytics() {
  const umamiSrc = umamiScriptSrc();

  if (umamiWebsiteId && umamiSrc) {
    return (
      <Script
        id="umami"
        src={umamiSrc}
        data-website-id={umamiWebsiteId}
        strategy="afterInteractive"
        defer
        data-cookieconsent="statistics"
      />
    );
  }

  if (!plausibleDomain) {
    return null;
  }

  const src = plausibleScriptSrc();

  return (
    <Script
      defer
      data-domain={plausibleDomain}
      src={src}
      strategy="afterInteractive"
      data-cookieconsent="statistics"
    />
  );
}

/** @deprecated Brug `SiteAnalytics` — bevares for bagudkompatibilitet. */
export const PlausibleAnalytics = SiteAnalytics;
