import { CityServicePage } from "@/components/city-service-page";
import { CITY_PAGE_CONFIGS } from "@/lib/city-pages";
import { buildCityPageMetadata } from "@/lib/seo";

const cityConfig = CITY_PAGE_CONFIGS.find((city) => city.slug === "jelling");

if (!cityConfig) {
  throw new Error("Missing city page config for jelling");
}

export const metadata = buildCityPageMetadata(cityConfig);

export default function JellingCityPage() {
  return <CityServicePage config={cityConfig} description={cityConfig.metaDescription} />;
}
