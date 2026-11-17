/**
 * Creates / updates the first super admin (from ADMIN_EMAIL / ADMIN_PASSWORD)
 * and adds starter content when the tables are empty.
 *   npm run db:seed
 */
import { config } from "dotenv";
import bcrypt from "bcryptjs";
import { count, eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../lib/db/schema";

config({ path: ".env.local" });
config();

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  const isLocal = /localhost|127\.0\.0\.1/.test(url);
  const client = postgres(url, { max: 1, prepare: false, ssl: isLocal ? false : "require" });
  const db = drizzle(client, { schema });

  // ---------- Super admin ----------
  const email = process.env.ADMIN_EMAIL?.toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (email && password) {
    const hash = await bcrypt.hash(password, 10);
    const [existing] = await db.select().from(schema.users).where(eq(sql`lower(${schema.users.email})`, email));
    if (existing) {
      await db.update(schema.users).set({ passwordHash: hash, role: "super_admin" }).where(eq(schema.users.id, existing.id));
      console.log(`[seed] Updated super admin ${email}`);
    } else {
      const [u] = await db
        .insert(schema.users)
        .values({ name: process.env.ADMIN_NAME || "Temple Admin", email, passwordHash: hash, role: "super_admin" })
        .returning();
      await db.update(schema.users).set({ memberNo: `PKT-${new Date().getFullYear()}-${String(u.id).padStart(4, "0")}` }).where(eq(schema.users.id, u.id));
      console.log(`[seed] Created super admin ${email}`);
    }
  } else {
    console.log("[seed] ADMIN_EMAIL / ADMIN_PASSWORD not set - skipping admin account.");
  }

  // ---------- Starter content (only if empty) ----------
  const [{ n: eventCount }] = await db.select({ n: count() }).from(schema.events);
  if (eventCount === 0) {
    const y = new Date().getFullYear();
    const m = String(new Date().getMonth() + 1).padStart(2, "0");
    const nm = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1);
    const next = `${nm.getFullYear()}-${String(nm.getMonth() + 1).padStart(2, "0")}`;
    await db.insert(schema.events).values([
      // Temple - regular
      { section: "temple", category: "bodhi_puja", title: "Bodhi Puja / බෝධි පූජාව", description: "Evening Bodhi puja for blessings and protection.", schedule: "Every Wednesday & Saturday", startTime: "6.00 p.m.", location: "Sacred Bodhi tree" },
      { section: "temple", category: "poya", title: "Poya Sil Programme / පොහොය සිල් වැඩසටහන", description: "Atasil observance, meditation and Dhamma sermon.", schedule: "Every Poya day", startTime: "6.00 a.m. – 5.00 p.m.", location: "Dharma Shala" },
      { section: "temple", category: "pirith", title: "Monthly Pirith Chanting / මාසික පිරිත් දේශනාව", description: "Pirith chanting for the wellbeing of all devotees.", schedule: "First Saturday of every month", startTime: "7.00 p.m." },
      { section: "temple", category: "dana", title: "Daily Dana / දෛනික දාන", description: "Devotees offer heel dana and noon dana to the Maha Sangha. Book your date on the Dana page.", schedule: "Every day", startTime: "6.30 a.m. & 11.00 a.m." },
      // Temple - this month / next month
      { section: "temple", category: "bana", title: "Monthly Dhamma Sermon / මාසික ධර්ම දේශනාව", eventDate: `${y}-${m}-28`, startTime: "7.00 p.m.", endTime: "8.30 p.m.", location: "Dharma Shala", preacher: "Visiting Thero (to be announced)", preacherFrom: "", host: "Dayaka Sabha" },
      { section: "temple", category: "dana", title: "Noon Dana / දහවල් දානය", eventDate: `${y}-${m}-25`, startTime: "11.00 a.m.", host: "Sample Family (edit in admin)" },
      { section: "temple", category: "poya", title: "Poya Sil Programme / පොහොය සිල් වැඩසටහන", eventDate: `${y}-${m}-27`, startTime: "6.00 a.m.", endTime: "5.00 p.m.", location: "Dharma Shala", preacher: "Ven. Weraduwe Siri Jothi Thero", preacherFrom: "Sri Punyabhiwardhanaramaya", allowRegistration: true },
      { section: "temple", category: "bodhi_puja", title: "Bodhi Puja / බෝධි පූජාව", eventDate: `${y}-${m}-29`, startTime: "6.00 p.m.", host: "Dayaka Sabha", allowRegistration: true },
      { section: "temple", category: "kathina", title: "Katina Pinkama / කඨින පිංකම", description: "Annual Katina robe offering ceremony.", eventDate: `${next}-15`, startTime: "8.00 a.m.", host: "Katina Dayaka family (edit in admin)" },
      // Dhamma school
      { section: "dhamma", category: "children", title: "Sunday Dhamma Classes / ඉරිදා දහම් පන්ති", description: "Grade 1 to Grade 11 + Daham Sarasavi.", schedule: "Every Sunday", startTime: "7.30 a.m. – 12.00 noon" },
      { section: "dhamma", category: "children", title: "Monthly Sil Programme for Children / ළමා සිල් වැඩසටහන", schedule: "Last Sunday of every month", startTime: "7.30 a.m." },
      { section: "dhamma", category: "competition", title: "Bakthi Gee Competition / භක්ති ගී තරඟය", eventDate: `${y}-${m}-24`, startTime: "9.00 a.m." },
      { section: "dhamma", category: "exam", title: "Term Test / වාර විභාගය", eventDate: `${next}-07`, startTime: "8.00 a.m." },
      // Montessori
      { section: "montessori", category: "children", title: "Story time & Music / කතන්දර සහ සංගීතය", schedule: "Every Friday", startTime: "10.00 a.m." },
      { section: "montessori", category: "festival", title: "Children's Concert / ළමා ප්‍රසංගය", eventDate: `${next}-20`, startTime: "9.00 a.m.", location: "Temple hall" },
      { section: "montessori", category: "trip", title: "Educational Trip / අධ්‍යාපන චාරිකාව", eventDate: `${y}-${m}-26`, startTime: "7.30 a.m." },
    ]);

    await db.insert(schema.posts).values([
      { section: "temple", kind: "notice", title: "Welcome to our new website / අපගේ නව වෙබ් අඩවියට සාදරයෙන් පිළිගනිමු", body: "You can now book dana, read notices, watch videos and become a member online.", pinned: true },
      { section: "dhamma", kind: "notice", title: "New term begins / නව වාරය ආරම්භය", body: "Classes resume this Sunday at 7.30 a.m. Please bring your text books.", pinned: true },
      { section: "dhamma", kind: "advertisement", title: "Dhamma School Uniforms available", body: "White uniforms can be ordered from the Dhamma School office on Sunday." },
      { section: "montessori", kind: "notice", title: "Admissions open for next year / ඇතුළත් කිරීම් ආරම්භයි", body: "No admission fee. Free uniforms and books. Contact the pre school office.", pinned: true },
    ]);

    await db.insert(schema.teachers).values([
      { section: "temple", name: "Ven. Weraduwe Siri Jothi Thero", position: "Chief Incumbent / විහාරාධිපති", sortOrder: 0 },
      { section: "montessori", name: "Ven. Weraduwe Siri Jothi Thero", position: "Principal & Spiritual Leader", bio: "Education builds knowledge and strong character.", sortOrder: 0 },
      { section: "montessori", name: "Mrs. Dilhari Mahandiram", position: "Main Teacher", bio: "Guiding children with love and creativity.", sortOrder: 1 },
      { section: "montessori", name: "Miss. Nipuni Wijerathna", position: "Assistant Teacher", bio: "Supports children with care and patience.", sortOrder: 2 },
      { section: "dhamma", name: "Ven. Weraduwe Siri Jothi Thero", position: "Principal / විදුහල්පති", sortOrder: 0 },
    ]);

    await db.insert(schema.testimonials).values([
      { section: "temple", name: "Devotee", rating: 5, message: "A peaceful temple with a caring Sangha community.", approved: true },
    ]);
    console.log("[seed] Added starter content.");
  }

  await client.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
