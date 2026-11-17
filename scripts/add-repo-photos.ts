/**
 * One-time: attach the photos from the old Montessori repo.
 *   npx tsx scripts/add-repo-photos.ts
 */
import { config } from "dotenv";
import { and, eq, like } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../lib/db/schema";

config({ path: ".env.local" });

async function main() {
  const url = process.env.DATABASE_URL!;
  const isLocal = /localhost|127\.0\.0\.1/.test(url);
  const client = postgres(url, { max: 1, prepare: false, ssl: isLocal ? false : "require" });
  const db = drizzle(client, { schema });

  // Chief incumbent photo on every section's teacher list
  await db.update(schema.teachers).set({ imageUrl: "/images/sangha/chief-thero.jpg" }).where(like(schema.teachers.name, "Ven. Weraduwe%"));

  const photos = [
    { section: "montessori", album: "Classroom", title: "Learning together", description: "Our little ones learning and playing together in the Udaya Lama Uyana classroom.", imageUrl: "/images/montessori/classroom.jpg" },
    { section: "montessori", album: "Classroom", title: "Happy learner", description: "A joyful moment at Udaya Lama Uyana Pre School.", imageUrl: "/images/montessori/child-learning.jpg" },
  ];
  for (const p of photos) {
    const exists = await db.select({ id: schema.galleryItems.id }).from(schema.galleryItems).where(and(eq(schema.galleryItems.section, p.section), eq(schema.galleryItems.imageUrl, p.imageUrl)));
    if (!exists.length) await db.insert(schema.galleryItems).values({ ...p, takenAt: new Date().toISOString().slice(0, 10) });
  }
  console.log("Photos attached.");
  await client.end();
}

main();
