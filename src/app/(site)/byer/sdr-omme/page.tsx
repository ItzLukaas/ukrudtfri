import { CityServicePage } from "@/components/city-service-page";
import { requireCityPageConfigBySlug } from "@/lib/city-pages";
import { buildCityPageMetadata } from "@/lib/seo";

const cityConfig = requireCityPageConfigBySlug("sdr-omme");

export const metadata = buildCityPageMetadata(cityConfig);

export default function SdrOmmeCityPage() {
  return <CityServicePage config={cityConfig} description={cityConfig.metaDescription} />;
}
