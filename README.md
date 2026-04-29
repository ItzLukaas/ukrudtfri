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
- Optional lightweight analytics via Plausible in `src/components/plausible-analytics.tsx`.
- Inline style removal in `src/components/animated-faq-title.tsx`.

Requires external/manual setup:

- HTTP/2 or HTTP/3 protocol verification/enforcement at hosting/CDN layer.
- DNS authentication records (SPF + DMARC).
- Off-site link building outreach and partner directory placement.
- Search Console/Bing verification and ongoing indexing monitoring.

## Analytics setup (Plausible)

Set these env vars in deployment:

```env
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=www.ukrudtfri.dk
NEXT_PUBLIC_PLAUSIBLE_SRC=https://plausible.io/js/script.js
```

`NEXT_PUBLIC_PLAUSIBLE_DOMAIN` is required. If empty, no analytics script is loaded.

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
