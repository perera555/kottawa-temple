import "server-only";
import { and, eq, isNull, lt, or } from "drizzle-orm";
import { db, schema } from "./db";

export const ONLINE_WINDOW_MS = 5 * 60 * 1000;

export const isOnline = (lastSeenAt: Date | null | undefined) =>
  !!lastSeenAt && Date.now() - new Date(lastSeenAt).getTime() < ONLINE_WINDOW_MS;

/** Marks the user as active (at most once per minute) and returns their profile basics. */
export async function touchPresence(userId: number) {
  try {
    const cutoff = new Date(Date.now() - 60 * 1000);
    await db
      .update(schema.users)
      .set({ lastSeenAt: new Date() })
      .where(and(eq(schema.users.id, userId), or(isNull(schema.users.lastSeenAt), lt(schema.users.lastSeenAt, cutoff))));
    const [u] = await db
      .select({ name: schema.users.name, avatarUrl: schema.users.avatarUrl, memberNo: schema.users.memberNo })
      .from(schema.users)
      .where(eq(schema.users.id, userId))
      .limit(1);
    return u ?? null;
  } catch {
    return null;
  }
}
