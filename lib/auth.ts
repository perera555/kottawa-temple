import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Section } from "./site";
import { isAdminRole, SESSION_COOKIE, verifySession, type SessionUser } from "./session";

export async function getSession(): Promise<SessionUser | null> {
  const c = await cookies();
  return verifySession(c.get(SESSION_COOKIE)?.value);
}

/** For admin pages: redirect to login when not signed in as an admin. */
export async function requireAdmin(): Promise<SessionUser> {
  const user = await getSession();
  if (!user) redirect("/login?next=/admin");
  if (!isAdminRole(user.role)) redirect("/account");
  return user;
}

/** For member pages: any logged-in account. */
export async function requireUser(): Promise<SessionUser> {
  const user = await getSession();
  if (!user) redirect("/login");
  return user;
}

/** Sections an admin may manage. */
export function allowedSections(user: SessionUser): Section[] {
  if (user.role === "super_admin") return ["temple", "dhamma", "montessori"];
  if (user.role === "member") return [];
  return [user.role];
}

export function canManage(user: SessionUser, section: string) {
  return allowedSections(user).includes(section as Section);
}
