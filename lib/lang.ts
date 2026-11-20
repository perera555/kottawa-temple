import "server-only";
import { cookies } from "next/headers";
import type { Lang } from "./site";

export async function getLang(): Promise<Lang> {
  const c = await cookies();
  // Sinhala first; English only when chosen
  return c.get("lang")?.value === "en" ? "en" : "si";
}
