import type { Metadata } from "next";
import { CONTACT_EMAIL, SITE_BRAND, SITE_URL } from "@/lib/site-config";

export const SERVICE_CITIES = [
  "Give",
  "Grindsted",
  "Brande",
  "Vejle",
  "Billund",
  "Jelling",
  "Bredsten",
  "Tørring",
] as const;

export const DEFAULT_SEO_TITLE = "Ukrudtfri.dk | Professionel sprøjtning af græsplæner";

export const DEFAULT_SEO_DESCRIPTION =
  "Få en flot, tæt og grøn græsplæne med professionel sprøjtning af ukrudt. Ukrudtfri.dk dækker Give, Grindsted, Brande og Vejle med certificeret service.";

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
  email: CONTACT_EMAIL,
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
