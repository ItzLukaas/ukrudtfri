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

export const DEFAULT_SEO_TITLE = "Certificeret plænesprøjtning i Give, Grindsted og Vejle";

export const DEFAULT_SEO_DESCRIPTION =
  "Få en tæt og grøn græsplæne med certificeret ukrudtsbekæmpelse. Vi hjælper i Give, Grindsted, Brande og Vejle med godkendte midler, lokal service og pris fra 1,5 kr./m².";

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
} satisfies NonNullable<Metadata["openGraph"]>;

export const defaultTwitter = {
  card: "summary_large_image",
  title: DEFAULT_SEO_TITLE,
  description: DEFAULT_SEO_DESCRIPTION,
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
