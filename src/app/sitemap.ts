import type { MetadataRoute } from "next";
import { CITY_PAGE_SLUGS } from "@/lib/city-pages";
import { SITE_URL } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/byer`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/booking`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/kontakt`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    ...CITY_PAGE_SLUGS.map((slug) => ({
      url: `${SITE_URL}/byer/${slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
