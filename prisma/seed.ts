import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = (process.env.BOOTSTRAP_ADMIN_EMAIL ?? "admin@ukrudtfri.dk").toLowerCase();
  const password = process.env.BOOTSTRAP_ADMIN_PASSWORD ?? "SkiftMig123!";

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    create: { email, passwordHash },
    update: { passwordHash },
  });

  await prisma.siteSettings.upsert({
    where: { id: "global" },
    create: {
      id: "global",
      pricePerSquareMeter: 1.5,
      minimumPrice: 300,
      serviceRadiusKm: 45,
      baseLabel: "Hyldevang 44, Give",
      baseLatitude: 55.8445,
      baseLongitude: 9.2386,
    },
    update: {
      // Nulstil base-koordinater ved seed hvis de er blevet gemt forkert i admin (pris/radius ændres ikke her).
      baseLabel: "Hyldevang 44, Give",
      baseLatitude: 55.8445,
      baseLongitude: 9.2386,
    },
  });

  const defaultTemplates = [
    {
      slug: "booking_cancelled",
      name: "Aflysning til kunde",
      subject: "Ændring af tiden hos os — {{customerName}}",
      bodyHtml: `<p>Hej {{customerName}},</p>
<p>Vi må desværre <strong>aflyse</strong> dit besøg, der skulle have været:</p>
<p><strong>{{whenLabel}}</strong><br />{{addressLabel}}</p>
<p>Vi beklager ulejligheden. Book gerne en ny tid på vores website, eller skriv til os.</p>
<p>De bedste hilsner<br />Ukrudtfri</p>`,
    },
    {
      slug: "booking_notice",
      name: "Kort besked til kunde",
      subject: "Vedr. din booking — {{customerName}}",
      bodyHtml: `<p>Hej {{customerName}},</p>
<p>Vi skriver kort angående din tid <strong>{{whenLabel}}</strong> hos {{addressLabel}}.</p>
<p>[Tilpas denne tekst og send fra admin.]</p>
<p>Mvh<br />Ukrudtfri</p>`,
    },
  ];

  for (const t of defaultTemplates) {
    await prisma.emailTemplate.upsert({
      where: { slug: t.slug },
      create: t,
      update: { name: t.name, subject: t.subject, bodyHtml: t.bodyHtml },
    });
  }

  console.log(`Seed færdig. Admin login: ${email} / (password fra BOOTSTRAP_ADMIN_PASSWORD eller default)`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
