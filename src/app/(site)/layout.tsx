import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { CONTACT_EMAIL, SITE_BRAND, SITE_URL } from "@/lib/site-config";

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: SITE_BRAND,
  url: SITE_URL,
  description:
    "Professionel sprøjtning af græsplæner i Give, Grindsted, Brande, Vejle og omegn. Book tid online til plænepleje.",
  telephone: "+4541820046",
  email: CONTACT_EMAIL,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Hyldevang 44",
    addressLocality: "Give",
    addressCountry: "DK",
  },
  areaServed: [
    { "@type": "City", name: "Give" },
    { "@type": "City", name: "Grindsted" },
    { "@type": "City", name: "Brande" },
    { "@type": "City", name: "Vejle" },
    { "@type": "City", name: "Billund" },
  ],
  inLanguage: "da-DK",
} as const;

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      <SiteHeader />
      <div className="flex-1">{children}</div>
      <SiteFooter />
    </>
  );
}
