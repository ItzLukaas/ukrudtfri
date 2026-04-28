"use server";

import { randomBytes, createHash } from "node:crypto";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { sendAdminEmailChangeVerificationEmail } from "@/lib/mail";

async function requireAdminUser() {
  const session = await auth();
  const email = session?.user?.email?.toLowerCase().trim();
  if (!email) throw new Error("UNAUTHORIZED");
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("UNAUTHORIZED");
  return user;
}

function hashToken(rawToken: string) {
  return createHash("sha256").update(rawToken).digest("hex");
}

const avatarSchema = z.object({
  avatarUrl: z.string().trim().url("Angiv en gyldig URL.").max(500).or(z.literal("")),
});

export async function updateAdminAvatarAction(raw: unknown) {
  const user = await requireAdminUser();
  const parsed = avatarSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false as const, message: parsed.error.issues[0]?.message ?? "Ugyldig avatar URL." };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { avatarUrl: parsed.data.avatarUrl || null },
  });
  revalidatePath("/admin/account");
  return { ok: true as const };
}

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Nuværende adgangskode mangler."),
  newPassword: z
    .string()
    .min(8, "Ny adgangskode skal være mindst 8 tegn.")
    .max(128, "Ny adgangskode er for lang."),
});

export async function changeAdminPasswordAction(raw: unknown) {
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
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash: nextHash } });
  return { ok: true as const };
}

const emailSchema = z.object({
  newEmail: z.string().trim().email("Angiv en gyldig email."),
});

export async function requestAdminEmailChangeAction(raw: unknown) {
  const user = await requireAdminUser();
  const parsed = emailSchema.safeParse(raw);
  if (!parsed.success) return { ok: false as const, message: parsed.error.issues[0]?.message ?? "Ugyldig email." };

  const newEmail = parsed.data.newEmail.toLowerCase();
  if (newEmail === user.email.toLowerCase()) {
    return { ok: false as const, message: "Den nye email er den samme som den nuværende." };
  }

  const existing = await prisma.user.findUnique({ where: { email: newEmail }, select: { id: true } });
  if (existing) return { ok: false as const, message: "Emailen bruges allerede af en anden konto." };

  const rawToken = randomBytes(32).toString("hex");
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24);

  await prisma.$transaction([
    prisma.emailChangeToken.deleteMany({ where: { userId: user.id, consumedAt: null } }),
    prisma.emailChangeToken.create({
      data: {
        userId: user.id,
        tokenHash,
        newEmail,
        expiresAt,
      },
    }),
  ]);

  await sendAdminEmailChangeVerificationEmail({
    to: newEmail,
    currentEmail: user.email,
    token: rawToken,
    expiresAt,
  });

  return { ok: true as const };
}

export async function consumeAdminEmailChangeTokenAction(token: string) {
  const normalized = token.trim();
  if (!normalized) return { ok: false as const, message: "Token mangler." };

  const tokenHash = hashToken(normalized);
  const now = new Date();

  try {
    const result = await prisma.$transaction(async (tx) => {
      const pending = await tx.emailChangeToken.findUnique({
        where: { tokenHash },
        include: { user: true },
      });

      if (!pending || pending.consumedAt || pending.expiresAt <= now) return { kind: "invalid" as const };

      const emailTaken = await tx.user.findUnique({
        where: { email: pending.newEmail },
        select: { id: true },
      });
      if (emailTaken && emailTaken.id !== pending.userId) return { kind: "taken" as const };

      await tx.user.update({
        where: { id: pending.userId },
        data: { email: pending.newEmail },
      });
      await tx.emailChangeToken.update({
        where: { id: pending.id },
        data: { consumedAt: now },
      });
      await tx.emailChangeToken.deleteMany({
        where: { userId: pending.userId, consumedAt: null },
      });

      return { kind: "ok" as const };
    });

    if (result.kind === "ok") return { ok: true as const };
    if (result.kind === "taken") return { ok: false as const, message: "Emailen er allerede i brug." };
    return { ok: false as const, message: "Token er ugyldig eller udløbet." };
  } catch (error) {
    console.error(error);
    return { ok: false as const, message: "Kunne ikke bekræfte emailskift." };
  }
}

export async function getAdminAccountData() {
  const user = await requireAdminUser();
  return {
    email: user.email,
    avatarUrl: user.avatarUrl ?? "",
  };
}
