import Script from "next/script";

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim();

/**
 * Meta (Facebook) Pixel — kun aktiv når NEXT_PUBLIC_META_PIXEL_ID er sat.
 * I produktion: `type="text/plain"` + `data-cookieconsent="marketing"` så Cookiebot kan styre marketing-scripts.
 * Lokalt: almindelig JS så du kan teste uden samtykke-banner.
 */
export function MetaPixel() {
  if (!PIXEL_ID) {
    return null;
  }

  const init = `
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${PIXEL_ID}');
fbq('track','PageView');
`.trim();

  const useConsentWrapper = process.env.NODE_ENV === "production";

  return (
    <>
      <Script
        id="meta-pixel"
        strategy="afterInteractive"
        {...(useConsentWrapper ? ({ "data-cookieconsent": "marketing" } as const) : {})}
        type={useConsentWrapper ? "text/plain" : "text/javascript"}
        dangerouslySetInnerHTML={{ __html: init }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          className="pointer-events-none absolute h-px w-px overflow-hidden border-0 p-0 opacity-0"
          alt=""
          src={`https://www.facebook.com/tr?id=${encodeURIComponent(PIXEL_ID)}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}
