import { prisma } from "@/lib/prisma";

function overlaps(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) {
  return aStart < bEnd && bStart < aEnd;
}

export async function listAvailableOpenSlots(now = new Date()) {
  const [blocks, slots] = await Promise.all([
    prisma.blockedWindow.findMany(),
    prisma.openSlot.findMany({
      where: {
        startsAt: { gte: now },
        OR: [
          { booking: null },
          { booking: { status: { in: ["REJECTED", "CANCELLED"] } } },
        ],
      },
      orderBy: { startsAt: "asc" },
      take: 400,
      include: { booking: true },
    }),
  ]);

  return slots.filter(
    (s) => !blocks.some((b) => overlaps(s.startsAt, s.endsAt, b.startsAt, b.endsAt)),
  );
}
