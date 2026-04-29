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

- Metadata and keyword coverage is configured in `src/lib/seo.ts`, `src/app/layout.tsx`, and page-level metadata files.
- Internal linking support is improved on `src/app/(site)/page.tsx` and `src/app/(site)/byer/page.tsx`.
- Mobile-friendly performance settings are enabled in `next.config.ts` (`compress`, AVIF/WebP image formats, disabled `x-powered-by` header).
- Optional lightweight analytics is wired via `src/components/plausible-analytics.tsx` and loaded from `src/app/layout.tsx`.

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

## Notes

- Keep `NEXT_PUBLIC_SITE_URL` aligned with production origin.
- Run `npm run lint` before deployment.
