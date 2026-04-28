import { prisma } from "@/lib/prisma";

/** WGS84 for Give bymidte (ca.) — bruges hvis SiteSettings endnu ikke findes. */
const GIVE_DEFAULT = {
  baseLabel: "Give, Danmark",
  baseLatitude: 55.8445,
  baseLongitude: 9.2386,
};

export async function getSiteSettings() {
  const existing = await prisma.siteSettings.findUnique({ where: { id: "global" } });
  if (existing) return existing;

  return prisma.siteSettings.create({
    data: {
      id: "global",
      pricePerSquareMeter: 4.5,
      minimumPrice: 300,
      serviceRadiusKm: 45,
      baseLabel: GIVE_DEFAULT.baseLabel,
      baseLatitude: GIVE_DEFAULT.baseLatitude,
      baseLongitude: GIVE_DEFAULT.baseLongitude,
    },
  });
}
