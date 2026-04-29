import Script from "next/script";

const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
const PLAUSIBLE_SRC = process.env.NEXT_PUBLIC_PLAUSIBLE_SRC ?? "https://plausible.io/js/script.js";

export function PlausibleAnalytics() {
  if (!PLAUSIBLE_DOMAIN) {
    return null;
  }

  return <Script defer data-domain={PLAUSIBLE_DOMAIN} src={PLAUSIBLE_SRC} strategy="afterInteractive" />;
}
