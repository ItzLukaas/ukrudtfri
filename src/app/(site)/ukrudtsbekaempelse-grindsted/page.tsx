import type { Metadata } from "next";
import GrindstedCityPage from "@/app/(site)/byer/grindsted/page";
import { SITE_BRAND, SITE_URL } from "@/lib/site-config";

const primaryPath = "/byer/grindsted";
const aliasPath = "/ukrudtsbekaempelse-grindsted";

export const metadata: Metadata = {
  title: `Ukrudtsbekæmpelse Grindsted | ${SITE_BRAND}`,
  description:
    "Alias-side for ukrudtsbekæmpelse i Grindsted. Primær canonical side er bysiden med detaljer om behandling af ukrudt i græsplænen.",
  alternates: {
    canonical: `${SITE_URL}${primaryPath}`,
  },
  openGraph: {
    url: `${SITE_URL}${aliasPath}`,
    title: `Ukrudtsbekæmpelse Grindsted | ${SITE_BRAND}`,
    description:
      "Alias-side for ukrudtsbekæmpelse i Grindsted med canonical til primær byside for lokal behandling af ukrudt i græsplænen.",
  },
};

export default GrindstedCityPage;
