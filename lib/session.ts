/** JWT session helpers - safe to import from proxy.ts (no DB access). */
import { jwtVerify, SignJWT } from "jose";

export const SESSION_COOKIE = "kt_session";

export type SessionUser = {
  id: number;
  name: string;
  email: string;
  role: "super_admin" | "temple" | "dhamma" | "montessori" | "member";
};

export const isAdminRole = (role: string) => role !== "member";

function key() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("AUTH_SECRET must be set (at least 16 characters).");
  }
  return new TextEncoder().encode(secret);
}

export async function signSession(user: SessionUser, days = 7) {
  return new SignJWT({ ...user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${days}d`)
    .sign(key());
}

export async function verifySession(token: string | undefined): Promise<SessionUser | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key());
    return {
      id: Number(payload.id),
      name: String(payload.name),
      email: String(payload.email),
      role: payload.role as SessionUser["role"],
    };
  } catch {
    return null;
  }
}
