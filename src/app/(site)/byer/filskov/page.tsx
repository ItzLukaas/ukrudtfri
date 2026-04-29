import { CityServicePage } from "@/components/city-service-page";
import { CITY_PAGE_CONFIGS } from "@/lib/city-pages";
import { buildCityPageMetadata } from "@/lib/seo";

const cityConfig = CITY_PAGE_CONFIGS.find((city) => city.slug === "filskov");

if (!cityConfig) {
  throw new Error("Missing city page config for filskov");
}

export const metadata = buildCityPageMetadata(cityConfig);

export default function FilskovCityPage() {
  return <CityServicePage config={cityConfig} description={cityConfig.metaDescription} />;
}
