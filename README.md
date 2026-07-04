# LawnGuard.dk / Ukrudtfri.dk

Next.js App Router project for local lawn weed-control services.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## SEO and performance checklist

Implemented in code:

- Internal linking support across homepage, city pages, and header navigation.
- Shorter, keyword-focused meta descriptions on core pages.
- Stronger keyword placement in key headings and section titles.
- Expanded copy where pages were previously thin (`/byer` and local city templates).
- Mobile-oriented frontend performance settings in `next.config.ts` (`compress`, AVIF/WebP, no `x-powered-by`).
- Optional self-hosted analytics: **Umami** or **Plausible CE** via `src/components/site-analytics.tsx` (see `.env.example` and `docker/umami.compose.yaml`).
- Inline style removal in `src/components/animated-faq-title.tsx`.

Requires external/manual setup:

- HTTP/2 or HTTP/3 protocol verification/enforcement at hosting/CDN layer.
- DNS authentication records (SPF + DMARC).
- Off-site link building outreach and partner directory placement.
- Search Console/Bing verification and ongoing indexing monitoring.

## Analytics setup (self-hosted)

**Umami** (recommended) — samme stack som jeres site (Next.js), kan **hostes direkte på Vercel** som et *andet* Vercel-projekt end hovedsitet (fx projektet `ukrudtfri-stats` med domænet `stats.ukrudtfri.dk`).

1. Opret **Postgres** et sted Umami understøtter: [Neon](https://neon.tech), [Supabase](https://supabase.com), eller Vercels egne storage-integrations — kopier `DATABASE_URL`.
2. Følg den officielle guide: [Running on Vercel (Umami)](https://umami.is/docs/guides/running-on-vercel) (fork/import af Umami-repo, sæt `DATABASE_URL`, build, deploy).
3. I Vercel for **Umami-projektet**: **Settings → Domains** → tilføj `stats.ukrudtfri.dk` (DNS hos jeres udbyder: CNAME til `cname.vercel-dns.com` som Vercel viser).
4. Log ind på `https://stats.ukrudtfri.dk`, opret admin, **Websites → Add** med domænet `ukrudtfri.dk`, kopier **Website ID**.
5. I **hovedprojektet** (denne repo / ukrudtfri.dk på Vercel):

```env
NEXT_PUBLIC_UMAMI_URL=https://stats.ukrudtfri.dk
NEXT_PUBLIC_UMAMI_WEBSITE_ID=<uuid from Umami>
```

**Alternativ (egen server / Docker):** `docker/umami.compose.yaml` + TLS-proxy foran — samme env på hovedsitet.

**Plausible CE:** self-host Plausible, derefter `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` + `NEXT_PUBLIC_PLAUSIBLE_SRC` (brug ikke samtidig med Umami).

Do not set both Umami and Plausible at once (Umami wins if both are set).

If neither Umami nor Plausible env vars are set, no analytics script is loaded.

### Statistik i admin (samme login som /admin)

Når Umami kører, kan du vise tal i **egen UI** på `/admin/stats` (logo + menu matcher admin). Sæt desuden server-only:

```env
UMAMI_USERNAME=din_umami_bruger
UMAMI_PASSWORD=din_umami_adgangskode
```

(Brug gerne en dedikeret Umami-bruger med læseadgang hvis du vil skærme den primære admin-konto.)

## External platform and DNS setup

These items cannot be fully done in app code and must be configured in your hosting/DNS provider.

### 1) HTTP/2+ (hosting / CDN)

1. Ensure the site is served behind a modern edge platform (Vercel, Cloudflare, Fastly, Nginx with TLS).
2. Confirm HTTPS is enabled with valid TLS certificate.
3. Verify HTTP/2 or HTTP/3 in browser DevTools Network (Protocol column) after deployment.
4. If using custom reverse proxy, enable ALPN and `http2` on TLS listeners.

### 2) SPF record (DNS TXT)

Create/update TXT record on root (`@`) for sending domain. If mail is sent through Resend only, a typical value is:

```txt
v=spf1 include:spf.resend.com ~all
```

If other providers also send mail for the same domain, merge them into one SPF record (only one SPF TXT record is allowed).

### 3) DMARC record (DNS TXT)

Create TXT record on `_dmarc.ukrudtfri.dk`:

```txt
v=DMARC1; p=quarantine; adkim=s; aspf=s; rua=mailto:dmarc@ukrudtfri.dk; fo=1; pct=100
```

Suggested rollout:

1. Start with `p=none` for monitoring 1-2 weeks.
2. Move to `p=quarantine`.
3. Move to `p=reject` when SPF/DKIM alignment is stable.

## Exact manual steps

1. **Enable/verify HTTP/2+**
   - Deploy behind Vercel/Cloudflare or another TLS edge that supports HTTP/2/3.
   - In browser DevTools Network, add the `Protocol` column and confirm `h2` or `h3` in production.
2. **Add SPF TXT record**
   - Host/name: `@`
   - Type: `TXT`
   - Value (Resend-only example): `v=spf1 include:spf.resend.com ~all`
   - Keep exactly one SPF TXT record for the root.
3. **Add DMARC TXT record**
   - Host/name: `_dmarc`
   - Type: `TXT`
   - Start value (monitoring): `v=DMARC1; p=none; adkim=s; aspf=s; rua=mailto:dmarc@ukrudtfri.dk; fo=1; pct=100`
   - After 1-2 weeks with clean alignment, move `p=none` -> `p=quarantine` -> `p=reject`.
4. **Set analytics environment variables**
   - Add `NEXT_PUBLIC_PLAUSIBLE_DOMAIN=www.ukrudtfri.dk`
   - Optionally set `NEXT_PUBLIC_PLAUSIBLE_SRC=https://plausible.io/js/script.js`
5. **Run outreach for backlinks**
   - Submit the site to relevant Danish local/business directories.
   - Ask local partners/suppliers for contextual links to service or city pages.
   - Prioritize links to `/`, `/byer`, and key city pages.
6. **Verify indexing tools**
   - Add/verify domain in Google Search Console and Bing Webmaster Tools.
   - Submit `https://www.ukrudtfri.dk/sitemap.xml` and monitor coverage/errors monthly.

## Notes

- Keep `NEXT_PUBLIC_SITE_URL` aligned with production origin.
- Run `npm run lint` before deployment.
