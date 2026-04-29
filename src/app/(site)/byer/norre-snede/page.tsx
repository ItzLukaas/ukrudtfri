import { CityServicePage } from "@/components/city-service-page";
import { requireCityPageConfigBySlug } from "@/lib/city-pages";
import { buildCityPageMetadata } from "@/lib/seo";

const cityConfig = requireCityPageConfigBySlug("norre-snede");

export const metadata = buildCityPageMetadata(cityConfig);

export default function NorreSnedeCityPage() {
  return <CityServicePage config={cityConfig} description={cityConfig.metaDescription} />;
}
