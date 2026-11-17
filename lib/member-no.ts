import "server-only";
import { eq } from "drizzle-orm";
import { db, schema } from "./db";

/** Registration number derived from the account id: PKT-<year>-0001 */
export function formatMemberNo(id: number, year = new Date().getFullYear()) {
  return `PKT-${year}-${String(id).padStart(4, "0")}`;
}

export async function assignMemberNo(id: number) {
  const memberNo = formatMemberNo(id);
  await db.update(schema.users).set({ memberNo }).where(eq(schema.users.id, id));
  return memberNo;
}
