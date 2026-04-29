import { CityServicePage } from "@/components/city-service-page";
import { CITY_PAGE_CONFIGS } from "@/lib/city-pages";
import { buildCityPageMetadata } from "@/lib/seo";

const cityConfig = CITY_PAGE_CONFIGS.find((city) => city.slug === "bredsten");

if (!cityConfig) {
  throw new Error("Missing city page config for bredsten");
}

export const metadata = buildCityPageMetadata(cityConfig);

export default function BredstenCityPage() {
  return <CityServicePage config={cityConfig} description={cityConfig.metaDescription} />;
}
