"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function requireAdminUser() {
  const session = await auth();
  const email = session?.user?.email?.toLowerCase().trim();
  if (!email) throw new Error("UNAUTHORIZED");
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("UNAUTHORIZED");
  return user;
}

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Nuværende adgangskode mangler."),
  newPassword: z
    .string()
    .min(8, "Ny adgangskode skal være mindst 8 tegn.")
    .max(128, "Ny adgangskode er for lang."),
});

export async function changeAdminPasswordAction(raw: unknown) {
  try {
    const user = await requireAdminUser();
    const parsed = passwordSchema.safeParse(raw);
    if (!parsed.success) {
      return { ok: false as const, message: parsed.error.issues[0]?.message ?? "Ugyldig adgangskode." };
    }
    if (parsed.data.currentPassword === parsed.data.newPassword) {
      return { ok: false as const, message: "Ny adgangskode skal være forskellig fra den nuværende." };
    }

    const passwordOk = await bcrypt.compare(parsed.data.currentPassword, user.passwordHash);
    if (!passwordOk) {
      return { ok: false as const, message: "Nuværende adgangskode er forkert." };
    }

    const nextHash = await bcrypt.hash(parsed.data.newPassword, 12);
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: nextHash },
      select: { passwordHash: true },
    });

    // Defensive verification: make sure the stored hash matches the chosen password.
    const persisted = await bcrypt.compare(parsed.data.newPassword, updated.passwordHash);
    if (!persisted) {
      return { ok: false as const, message: "Kunne ikke gemme ny adgangskode." };
    }

    return { ok: true as const };
  } catch (error) {
    console.error(error);
    return { ok: false as const, message: "Kunne ikke opdatere adgangskode." };
  }
}
