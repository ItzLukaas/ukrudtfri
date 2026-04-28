import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { localBusinessJsonLd, websiteJsonLd } from "@/lib/seo";
import { getPublicPricing } from "@/server/public-booking";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const pricing = await getPublicPricing();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      <SiteHeader
        baseLabel={pricing.baseLabel}
        baseLatitude={pricing.baseLatitude}
        baseLongitude={pricing.baseLongitude}
      />
      <div className="flex-1">{children}</div>
      <SiteFooter />
    </>
  );
}
