"use server";

import bcrypt from "bcryptjs";
import { eq, sql } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db, schema } from "@/lib/db";
import { assignMemberNo } from "@/lib/member-no";
import { isAdminRole, SESSION_COOKIE, signSession, type SessionUser } from "@/lib/session";

export type FormState = { ok?: boolean; error?: string; message?: string } | undefined;

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();

async function startSession(user: SessionUser, days = 7) {
  const token = await signSession(user, days);
  const c = await cookies();
  c.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * days,
  });
}

function safeNext(next: string, fallback: string) {
  return next.startsWith("/") && !next.startsWith("//") ? next : fallback;
}

export async function login(_: FormState, fd: FormData): Promise<FormState> {
  const email = str(fd, "email").toLowerCase();
  const password = str(fd, "password");
  if (!email || !password) return { error: "Please enter email and password." };

  const [user] = await db
    .select()
    .from(schema.users)
    .where(eq(sql`lower(${schema.users.email})`, email))
    .limit(1);

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return { error: "Invalid email or password." };
  }

  const role = user.role as SessionUser["role"];
  await startSession({ id: user.id, name: user.name, email: user.email, role }, fd.get("remember") === "on" ? 90 : 7);
  redirect(safeNext(str(fd, "next"), isAdminRole(role) ? "/admin" : "/account"));
}

export async function register(_: FormState, fd: FormData): Promise<FormState> {
  const name = str(fd, "name");
  const email = str(fd, "email").toLowerCase();
  const phone = str(fd, "phone");
  const address = str(fd, "address");
  const password = str(fd, "password");
  const confirm = str(fd, "confirm");

  if (name.length < 2) return { error: "Please enter your full name." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Please enter a valid email." };
  if (password.length < 8) return { error: "Password must be at least 8 characters." };
  if (password !== confirm) return { error: "Passwords do not match." };

  const existing = await db
    .select({ id: schema.users.id })
    .from(schema.users)
    .where(eq(sql`lower(${schema.users.email})`, email))
    .limit(1);
  if (existing.length) return { error: "An account with this email already exists. Please log in." };

  const [user] = await db
    .insert(schema.users)
    .values({ name, email, phone, address, passwordHash: await bcrypt.hash(password, 10), role: "member" })
    .returning();
  await assignMemberNo(user.id);

  await startSession({ id: user.id, name: user.name, email: user.email, role: "member" });
  redirect("/account");
}

export async function logout() {
  const c = await cookies();
  c.delete(SESSION_COOKIE);
  redirect("/");
}

export async function setLang(lang: "en" | "si") {
  const c = await cookies();
  c.set("lang", lang === "si" ? "si" : "en", { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
}
