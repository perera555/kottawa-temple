import "server-only";
import { eq } from "drizzle-orm";
import { connection } from "next/server";
import { db, schema } from "./db";
import { TEMPLE, type Section } from "./site";

export type SectionSettings = typeof schema.sectionSettings.$inferSelect;

const DEFAULTS = (section: Section): SectionSettings => ({
  section,
  phone: TEMPLE.phone,
  email: TEMPLE.email,
  whatsapp: "",
  teacherWhatsapp: "",
  address: TEMPLE.address.en,
  mapQuery: "Sri Punyabhiwardhanaramaya Kottawa",
  facebookUrl: "",
  youtubeUrl: "",
  youtubeChannelId: "",
  instagramUrl: "",
  tiktokUrl: "",
  isLive: false,
  liveUrl: "",
  liveTitle: "",
  updatedAt: new Date(0),
});

/** Settings for a section; empty contact fields fall back to the temple's. */
export async function getSettings(section: Section): Promise<SectionSettings> {
  await connection();
  try {
    const rows = await db.select().from(schema.sectionSettings);
    const own = rows.find((r) => r.section === section);
    const temple = rows.find((r) => r.section === "temple");
    const base = DEFAULTS(section);
    const merged = { ...base, ...(own ?? {}) } as SectionSettings;
    // contact fallbacks: section -> temple -> defaults
    for (const k of ["phone", "email", "whatsapp", "address", "mapQuery"] as const) {
      if (!merged[k]) merged[k] = temple?.[k] || base[k];
    }
    return merged;
  } catch (err) {
    console.error("[settings]", err);
    return DEFAULTS(section);
  }
}

export async function getRawSettings(section: Section) {
  const [row] = await db.select().from(schema.sectionSettings).where(eq(schema.sectionSettings.section, section)).limit(1);
  return row ?? null;
}

/** YouTube channel id (UC...) from an id or a /channel/ URL. */
export function youtubeChannelId(s: SectionSettings) {
  if (/^UC[\w-]{20,}$/.test(s.youtubeChannelId)) return s.youtubeChannelId;
  const m = /youtube\.com\/channel\/(UC[\w-]{20,})/.exec(s.youtubeUrl);
  return m?.[1] ?? "";
}
