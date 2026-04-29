import { CityServicePage } from "@/components/city-service-page";
import { requireCityPageConfigBySlug } from "@/lib/city-pages";
import { buildCityPageMetadata } from "@/lib/seo";

const cityConfig = requireCityPageConfigBySlug("hampen");

export const metadata = buildCityPageMetadata(cityConfig);

export default function HampenCityPage() {
  return <CityServicePage config={cityConfig} description={cityConfig.metaDescription} />;
}
