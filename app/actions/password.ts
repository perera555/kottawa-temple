"use server";

import bcrypt from "bcryptjs";
import { randomInt } from "node:crypto";
import { and, desc, eq, gt, isNull, sql } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { db, schema } from "@/lib/db";
import { sendMail } from "@/lib/mail";
import type { FormState } from "./auth";

const CODE_MINUTES = 30;
const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();

async function createCode(userId: number, requestedBy: "user" | "admin") {
  const code = String(randomInt(100000, 1000000));
  // invalidate older codes
  await db
    .update(schema.passwordResets)
    .set({ usedAt: new Date() })
    .where(and(eq(schema.passwordResets.userId, userId), isNull(schema.passwordResets.usedAt)));
  await db.insert(schema.passwordResets).values({
    userId,
    requestedBy,
    codeHash: await bcrypt.hash(code, 10),
    expiresAt: new Date(Date.now() + CODE_MINUTES * 60 * 1000),
  });
  return code;
}

/** Step 1 (website): user asks for a reset code. */
export async function requestPasswordReset(_: FormState, fd: FormData): Promise<FormState> {
  const email = str(fd, "email").toLowerCase();
  if (!email) return { error: "Please enter your email." };
  const [user] = await db.select().from(schema.users).where(eq(sql`lower(${schema.users.email})`, email)).limit(1);
  const generic =
    "If an account exists for this email, a 6-digit code has been sent. If you did not get an email, please contact the temple office - the admin can give you the code. / කේතය ලැබුණේ නැත්නම් විහාරස්ථාන කාර්යාලය අමතන්න.";
  if (!user) return { ok: true, message: generic };

  const code = await createCode(user.id, "user");
  await sendMail(
    user.email,
    "Password reset code - Sri Punyabhiwardhanaramaya",
    `Ayubowan ${user.name},\n\nYour password reset code is: ${code}\nIt is valid for ${CODE_MINUTES} minutes.\n\nEnter it at the website's "Reset password" page.\n\nIf you did not ask for this, you can ignore this email.`
  );
  return { ok: true, message: generic };
}

/** Step 2: enter code + new password. */
export async function resetPassword(_: FormState, fd: FormData): Promise<FormState> {
  const email = str(fd, "email").toLowerCase();
  const code = str(fd, "code").replace(/\s/g, "");
  const password = str(fd, "password");
  if (!/^\d{6}$/.test(code)) return { error: "Enter the 6-digit code." };
  if (password.length < 8) return { error: "Password must be at least 8 characters." };
  if (password !== str(fd, "confirm")) return { error: "Passwords do not match." };

  const [user] = await db.select().from(schema.users).where(eq(sql`lower(${schema.users.email})`, email)).limit(1);
  if (!user) return { error: "Invalid email or code." };

  const [reset] = await db
    .select()
    .from(schema.passwordResets)
    .where(and(eq(schema.passwordResets.userId, user.id), isNull(schema.passwordResets.usedAt), gt(schema.passwordResets.expiresAt, new Date())))
    .orderBy(desc(schema.passwordResets.id))
    .limit(1);
  if (!reset || reset.attempts >= 5) return { error: "This code has expired. Please request a new one." };

  if (!(await bcrypt.compare(code, reset.codeHash))) {
    await db.update(schema.passwordResets).set({ attempts: reset.attempts + 1 }).where(eq(schema.passwordResets.id, reset.id));
    return { error: "Invalid email or code." };
  }

  await db.update(schema.users).set({ passwordHash: await bcrypt.hash(password, 10) }).where(eq(schema.users.id, user.id));
  await db.update(schema.passwordResets).set({ usedAt: new Date() }).where(eq(schema.passwordResets.id, reset.id));
  return { ok: true, message: "Your password has been changed. You can log in now. / මුරපදය වෙනස් විය." };
}

/** Admin: create a code for a user and show it once (and email it when possible). */
export async function adminCreateResetCode(userId: number): Promise<{ code?: string; emailed?: boolean; error?: string }> {
  const admin = await getSession();
  if (!admin || admin.role !== "super_admin") return { error: "Only super admins can do this." };
  const [user] = await db.select().from(schema.users).where(eq(schema.users.id, userId)).limit(1);
  if (!user) return { error: "User not found." };
  const code = await createCode(user.id, "admin");
  const emailed = await sendMail(
    user.email,
    "Password reset code - Sri Punyabhiwardhanaramaya",
    `Ayubowan ${user.name},\n\nThe temple admin created a password reset code for you: ${code}\nIt is valid for ${CODE_MINUTES} minutes. Use it on the website's "Reset password" page.`
  );
  return { code, emailed };
}
