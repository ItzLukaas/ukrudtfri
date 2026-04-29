import { CityServicePage } from "@/components/city-service-page";
import { requireCityPageConfigBySlug } from "@/lib/city-pages";
import { buildCityPageMetadata } from "@/lib/seo";

const cityConfig = requireCityPageConfigBySlug("kollemorten");

export const metadata = buildCityPageMetadata(cityConfig);

export default function KollemortenCityPage() {
  return <CityServicePage config={cityConfig} description={cityConfig.metaDescription} />;
}
