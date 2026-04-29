import { CityServicePage } from "@/components/city-service-page";
import { requireCityPageConfigBySlug } from "@/lib/city-pages";
import { buildCityPageMetadata } from "@/lib/seo";

const cityConfig = requireCityPageConfigBySlug("egtved");

export const metadata = buildCityPageMetadata(cityConfig);

export default function EgtvedCityPage() {
  return <CityServicePage config={cityConfig} description={cityConfig.metaDescription} />;
}
