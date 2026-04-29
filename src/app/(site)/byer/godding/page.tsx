import { CityServicePage } from "@/components/city-service-page";
import { requireCityPageConfigBySlug } from "@/lib/city-pages";
import { buildCityPageMetadata } from "@/lib/seo";

const cityConfig = requireCityPageConfigBySlug("godding");

export const metadata = buildCityPageMetadata(cityConfig);

export default function GoddingCityPage() {
  return <CityServicePage config={cityConfig} description={cityConfig.metaDescription} />;
}
