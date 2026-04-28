/** Canonical site origin (no trailing slash). Override with NEXT_PUBLIC_SITE_URL in production. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://ukrudtfri.dk").replace(/\/$/, "");

/** Primary brand label as shown in UI and emails (incl. .dk). */
export const SITE_BRAND = "Ukrudtfri.dk";

/** Public contact email shown on the site and in transactional mail footers. */
export const CONTACT_EMAIL = "info@ukrudtfri.dk";
