import type { Metadata } from "next";
import type { CityPageConfig } from "@/lib/city-pages";
import { SITE_BRAND, SITE_URL } from "@/lib/site-config";

export const SERVICE_CITIES = [
  "Give",
  "Grindsted",
  "Brande",
  "Vejle",
  "Billund",
  "Jelling",
  "Bredsten",
  "Tørring",
  "Thyregod",
  "Kollemorten",
  "Givskud",
  "Gadbjerg",
  "Vandel",
  "Ødsted",
  "Egtved",
  "Randbøl",
  "Nørup",
  "Lindeballe",
  "Gødding",
  "Tørskind",
  "Filskov",
  "Hejnsvig",
  "Vorbasse",
  "Sdr. Omme",
  "Stenderup-Krogager",
  "Hampen",
  "Hjøllund",
  "Nørre Snede",
  "Ølgod",
] as const;

export const DEFAULT_SEO_TITLE = "Ukrudtfri.dk | Professionel sprøjtning af græsplæner";

export const DEFAULT_SEO_DESCRIPTION =
  "Professionel ukrudtsbekæmpelse og sprøjtning af græsplæner i Give, Grindsted, Brande og Vejle. Certificeret service med tydelig pris og hurtig booking.";

export const DEFAULT_OG_IMAGE = `${SITE_URL}/images/hero-3.jpg`;

export const SITE_KEYWORDS = [
  "ukrudtfri",
  "ukrudtfri.dk",
  "sprøjtning af græsplæne",
  "ukrudtsbekæmpelse",
  "plænepleje",
  "græsplæne",
  "sprøjtecertifikat",
  "Give",
  "Grindsted",
  "Brande",
  "Vejle",
] as const;

export const defaultOpenGraph = {
  type: "website",
  locale: "da_DK",
  siteName: SITE_BRAND,
  title: DEFAULT_SEO_TITLE,
  description: DEFAULT_SEO_DESCRIPTION,
  url: SITE_URL,
  images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: SITE_BRAND }],
} satisfies NonNullable<Metadata["openGraph"]>;

export const defaultTwitter = {
  card: "summary_large_image",
  title: DEFAULT_SEO_TITLE,
  description: DEFAULT_SEO_DESCRIPTION,
  images: [DEFAULT_OG_IMAGE],
} satisfies NonNullable<Metadata["twitter"]>;

export const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: SITE_BRAND,
  image: `${SITE_URL}/images/logo.png`,
  url: SITE_URL,
  description: DEFAULT_SEO_DESCRIPTION,
  telephone: "+4541820046",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Hyldevang 44",
    addressLocality: "Give",
    addressCountry: "DK",
  },
  areaServed: SERVICE_CITIES.map((city) => ({ "@type": "City", name: city })),
  inLanguage: "da-DK",
} as const;

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_BRAND,
  url: SITE_URL,
  inLanguage: "da-DK",
} as const;

export function buildCityServiceJsonLd(city: string, path: string, description: string) {
  const pageUrl = `${SITE_URL}${path}`;

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Ukrudtsbekæmpelse af græsplæne i ${city}`,
    description,
    areaServed: {
      "@type": "City",
      name: city,
    },
    serviceType: [
      `ukrudtsbekæmpelse ${city}`,
      `fjern ukrudt græsplæne ${city}`,
      `ukrudt i græsplæne behandling ${city}`,
      "sprøjtning af ukrudt i græsplæne",
      "ukrudtsbekæmpelse pris pr m²",
    ],
    provider: {
      "@type": "LocalBusiness",
      name: SITE_BRAND,
      url: SITE_URL,
      telephone: "+4541820046",
    },
    url: pageUrl,
    inLanguage: "da-DK",
  } as const;
}

export function buildCityPageMetadata(config: CityPageConfig): Metadata {
  const path = `/byer/${config.slug}`;
  const title = `Ukrudtsbekæmpelse i ${config.city} | Professionel sprøjtning af græsplæne`;
  const description = config.metaDescription;

  return {
    title,
    description,
    keywords: [
      `ukrudtsbekæmpelse ${config.city}`,
      `fjern ukrudt græsplæne ${config.city}`,
      `sprøjtning af græsplæne ${config.city}`,
      `ukrudt i græsplæne ${config.city}`,
    ],
    alternates: { canonical: `${SITE_URL}${path}` },
    openGraph: {
      url: `${SITE_URL}${path}`,
      title,
      description,
    },
  };
}
