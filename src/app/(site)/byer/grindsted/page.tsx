import { CityServicePage } from "@/components/city-service-page";
import { requireCityPageConfigBySlug } from "@/lib/city-pages";
import { buildCityPageMetadata } from "@/lib/seo";

const cityConfig = requireCityPageConfigBySlug("grindsted");

export const metadata = buildCityPageMetadata(cityConfig);

export default function GrindstedCityPage() {
  return <CityServicePage config={cityConfig} description={cityConfig.metaDescription} />;
}
