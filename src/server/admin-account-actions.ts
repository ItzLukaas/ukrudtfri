"use server";

import { randomBytes, createHash, randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { Prisma } from "@prisma/client";
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

type EmailChangeTokenDelegate = {
  deleteMany: (args: { where: { userId: string; consumedAt: null } }) => Promise<{ count: number }>;
  create: (args: {
    data: { userId: string; tokenHash: string; newEmail: string; expiresAt: Date };
  }) => Promise<unknown>;
  findUnique: (args: {
    where: { tokenHash: string };
  }) => Promise<{ id: string; userId: string; newEmail: string; expiresAt: Date; consumedAt: Date | null } | null>;
  update: (args: { where: { id: string }; data: { consumedAt: Date } }) => Promise<unknown>;
};

type PrismaTx = Prisma.TransactionClient;

function getEmailChangeTokenDelegate(client: PrismaTx | typeof prisma): EmailChangeTokenDelegate | null {
  const maybe = client as unknown as Record<string, unknown>;
  const delegate = maybe.emailChangeToken;
  if (!delegate || typeof delegate !== "object") return null;
  return delegate as EmailChangeTokenDelegate;
}

async function deletePendingEmailChangeTokens(client: PrismaTx | typeof prisma, userId: string) {
  const delegate = getEmailChangeTokenDelegate(client);
  if (delegate) {
    await delegate.deleteMany({ where: { userId, consumedAt: null } });
    return;
  }
  await client.$executeRaw`
    DELETE FROM "EmailChangeToken"
    WHERE "userId" = ${userId} AND "consumedAt" IS NULL
  `;
}

async function createEmailChangeToken(
  client: PrismaTx | typeof prisma,
  params: { userId: string; tokenHash: string; newEmail: string; expiresAt: Date },
) {
  const delegate = getEmailChangeTokenDelegate(client);
  if (delegate) {
    await delegate.create({ data: params });
    return;
  }
  await client.$executeRaw`
    INSERT INTO "EmailChangeToken" ("id", "userId", "tokenHash", "newEmail", "expiresAt", "createdAt")
    VALUES (${randomUUID()}, ${params.userId}, ${params.tokenHash}, ${params.newEmail}, ${params.expiresAt}, NOW())
  `;
}

async function findEmailChangeTokenByHash(client: PrismaTx | typeof prisma, tokenHash: string) {
  const delegate = getEmailChangeTokenDelegate(client);
  if (delegate) {
    return delegate.findUnique({ where: { tokenHash } });
  }
  const rows = await client.$queryRaw<
    Array<{ id: string; userId: string; newEmail: string; expiresAt: Date; consumedAt: Date | null }>
  >`
    SELECT "id", "userId", "newEmail", "expiresAt", "consumedAt"
    FROM "EmailChangeToken"
    WHERE "tokenHash" = ${tokenHash}
    LIMIT 1
  `;
  return rows[0] ?? null;
}

async function markEmailChangeTokenConsumed(client: PrismaTx | typeof prisma, id: string, consumedAt: Date) {
  const delegate = getEmailChangeTokenDelegate(client);
  if (delegate) {
    await delegate.update({ where: { id }, data: { consumedAt } });
    return;
  }
  await client.$executeRaw`
    UPDATE "EmailChangeToken"
    SET "consumedAt" = ${consumedAt}
    WHERE "id" = ${id}
  `;
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

const emailSchema = z.object({
  newEmail: z.string().trim().email("Angiv en gyldig email."),
});

export async function requestAdminEmailChangeAction(raw: unknown) {
  try {
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

    await prisma.$transaction(async (tx) => {
      await deletePendingEmailChangeTokens(tx, user.id);
      await createEmailChangeToken(tx, {
        userId: user.id,
        tokenHash,
        newEmail,
        expiresAt,
      });
    });

    const emailResult = await sendAdminEmailChangeVerificationEmail({
      to: newEmail,
      currentEmail: user.email,
      token: rawToken,
      expiresAt,
    });

    if (!emailResult.ok) {
      return {
        ok: false as const,
        message: emailResult.message,
      };
    }

    return { ok: true as const };
  } catch (error) {
    console.error("[admin-account] Failed to request admin email change", error);
    return { ok: false as const, message: "Kunne ikke starte emailskift. Prøv igen." };
  }
}

export async function consumeAdminEmailChangeTokenAction(token: string) {
  const normalized = token.trim();
  if (!normalized) return { ok: false as const, message: "Token mangler." };

  const tokenHash = hashToken(normalized);
  const now = new Date();

  try {
    const result = await prisma.$transaction(async (tx) => {
      const pending = await findEmailChangeTokenByHash(tx, tokenHash);

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
      await markEmailChangeTokenConsumed(tx, pending.id, now);
      await deletePendingEmailChangeTokens(tx, pending.userId);

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
