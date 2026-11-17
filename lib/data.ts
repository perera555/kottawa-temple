import "server-only";
import { and, asc, desc, eq, gte, isNotNull, isNull, lt, or, sql } from "drizzle-orm";
import { connection } from "next/server";
import { db, schema } from "./db";
import { DANA_TYPES, type Section } from "./site";

const { posts, events, galleryItems, videos, teachers, students, leaders, testimonials, danaBookings } = schema;

const today = () => new Date().toISOString().slice(0, 10);

/** Wraps public reads: always dynamic, never crash the page if the DB is down. */
async function safe<T>(fallback: T, fn: () => Promise<T>): Promise<T> {
  await connection();
  try {
    return await fn();
  } catch (err) {
    console.error("[data]", err);
    return fallback;
  }
}

export function getPosts(section: Section, opts: { kind?: string; limit?: number; pinnedOnly?: boolean } = {}) {
  return safe([] as (typeof posts.$inferSelect)[], () => {
    const conds = [
      eq(posts.section, section),
      or(isNull(posts.expiresAt), gte(posts.expiresAt, today())),
    ];
    if (opts.kind) conds.push(eq(posts.kind, opts.kind));
    if (opts.pinnedOnly) conds.push(eq(posts.pinned, true));
    return db
      .select()
      .from(posts)
      .where(and(...conds))
      .orderBy(desc(posts.pinned), desc(posts.publishedAt), desc(posts.id))
      .limit(opts.limit ?? 100);
  });
}

export function getUpcomingEvents(section: Section, limit = 6) {
  return safe([] as (typeof events.$inferSelect)[], () =>
    db
      .select()
      .from(events)
      .where(and(eq(events.section, section), isNotNull(events.eventDate), gte(events.eventDate, today())))
      .orderBy(asc(events.eventDate))
      .limit(limit)
  );
}

export function getRegularEvents(section: Section) {
  return safe([] as (typeof events.$inferSelect)[], () =>
    db
      .select()
      .from(events)
      .where(and(eq(events.section, section), isNull(events.eventDate)))
      .orderBy(asc(events.id))
  );
}

export function getEvents(section: Section, category?: string) {
  return safe([] as (typeof events.$inferSelect)[], () => {
    const conds = [eq(events.section, section)];
    if (category) conds.push(eq(events.category, category));
    return db
      .select()
      .from(events)
      .where(and(...conds))
      .orderBy(sql`${events.eventDate} desc nulls first`, desc(events.id));
  });
}

export function getGallery(section: Section, limit = 200) {
  return safe([] as (typeof galleryItems.$inferSelect)[], () =>
    db
      .select()
      .from(galleryItems)
      .where(eq(galleryItems.section, section))
      .orderBy(desc(galleryItems.takenAt), desc(galleryItems.id))
      .limit(limit)
  );
}

export function getVideos(section: Section, opts: { category?: string; featuredOnly?: boolean; limit?: number } = {}) {
  return safe([] as (typeof videos.$inferSelect)[], () => {
    const conds = [eq(videos.section, section)];
    if (opts.category) conds.push(eq(videos.category, opts.category));
    if (opts.featuredOnly) conds.push(eq(videos.featured, true));
    return db
      .select()
      .from(videos)
      .where(and(...conds))
      .orderBy(desc(videos.featured), sql`${videos.recordedAt} desc nulls last`, desc(videos.id))
      .limit(opts.limit ?? 100);
  });
}

export function getTeachers(section: Section) {
  return safe([] as { id: number; name: string; position: string; subject: string; imageUrl: string; bio: string }[], () =>
    db
      .select({
        id: teachers.id,
        name: teachers.name,
        position: teachers.position,
        subject: teachers.subject,
        imageUrl: teachers.imageUrl,
        bio: teachers.bio,
      })
      .from(teachers)
      .where(eq(teachers.section, section))
      .orderBy(asc(teachers.sortOrder), asc(teachers.id))
  );
}

/** Public student info only - no contact details. */
export function getPublicStudents(section: Section) {
  return safe([] as { id: number; name: string; grade: string; imageUrl: string; achievement: string }[], () =>
    db
      .select({
        id: students.id,
        name: students.name,
        grade: students.grade,
        imageUrl: students.imageUrl,
        achievement: students.achievement,
      })
      .from(students)
      .where(and(eq(students.section, section), eq(students.showOnWebsite, true), eq(students.active, true)))
      .orderBy(asc(students.grade), asc(students.name))
  );
}

export function getClassCounts(section: Section) {
  return safe([] as { grade: string; count: number }[], () =>
    db
      .select({ grade: students.grade, count: sql<number>`count(*)::int` })
      .from(students)
      .where(and(eq(students.section, section), eq(students.active, true)))
      .groupBy(students.grade)
      .orderBy(asc(students.grade))
  );
}

export function getLeaders(section: Section) {
  return safe([] as (typeof leaders.$inferSelect)[], () =>
    db
      .select()
      .from(leaders)
      .where(eq(leaders.section, section))
      .orderBy(desc(leaders.year), asc(leaders.sortOrder), asc(leaders.id))
  );
}

export function getTestimonials(section: Section) {
  return safe([] as { id: number; name: string; message: string; rating: number; createdAt: Date }[], () =>
    db
      .select({
        id: testimonials.id,
        name: testimonials.name,
        message: testimonials.message,
        rating: testimonials.rating,
        createdAt: testimonials.createdAt,
      })
      .from(testimonials)
      .where(and(eq(testimonials.section, section), eq(testimonials.approved, true)))
      .orderBy(desc(testimonials.id))
  );
}

/** Programme schedule: dated events from today plus confirmed dana, sorted by date. */
export function getSchedule(section: Section, limit = 12) {
  return safe(
    [] as {
      key: string;
      date: string;
      title: string;
      category: string;
      time: string;
      host: string;
      preacher: string;
      preacherFrom: string;
      location: string;
      eventId: number | null;
      allowRegistration: boolean;
    }[],
    async () => {
      const evs = await db
        .select()
        .from(events)
        .where(and(eq(events.section, section), isNotNull(events.eventDate), gte(events.eventDate, today())))
        .orderBy(asc(events.eventDate))
        .limit(limit);
      const dana =
        section === "temple"
          ? await db
              .select()
              .from(danaBookings)
              .where(and(eq(danaBookings.status, "confirmed"), gte(danaBookings.danaDate, today())))
              .orderBy(asc(danaBookings.danaDate))
              .limit(limit)
          : [];
      return [
        ...evs.map((e) => ({
          key: `e${e.id}`,
          date: e.eventDate!,
          title: e.title,
          category: e.category,
          time: [e.startTime, e.endTime].filter(Boolean).join(" – "),
          host: e.host,
          preacher: e.preacher,
          preacherFrom: e.preacherFrom,
          location: e.location,
          eventId: e.id,
          allowRegistration: e.allowRegistration,
        })),
        ...dana.map((d) => ({
          key: `d${d.id}`,
          date: d.danaDate,
          title: DANA_TYPES[d.danaType]?.en ?? "Dana",
          category: d.danaType === "bodhi_puja" ? "bodhi_puja" : d.danaType === "pirith" ? "pirith" : "dana",
          time: "",
          host: d.name,
          preacher: "",
          preacherFrom: "",
          location: "",
          eventId: null,
          allowRegistration: false,
        })),
      ]
        .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0))
        .slice(0, limit);
    }
  );
}

/** Everything happening in a given month (YYYY-MM) for the calendar. */
export function getMonth(section: Section, month: string) {
  return safe([] as { date: string; title: string; category: string; time: string; host: string; preacher: string }[], async () => {
    const start = `${month}-01`;
    const d = new Date(start + "T00:00:00");
    const endD = new Date(d.getFullYear(), d.getMonth() + 1, 1);
    const end = `${endD.getFullYear()}-${String(endD.getMonth() + 1).padStart(2, "0")}-01`;
    const evs = await db
      .select()
      .from(events)
      .where(and(eq(events.section, section), gte(events.eventDate, start), lt(events.eventDate, end)));
    const dana =
      section === "temple"
        ? await db
            .select()
            .from(danaBookings)
            .where(and(eq(danaBookings.status, "confirmed"), gte(danaBookings.danaDate, start), lt(danaBookings.danaDate, end)))
        : [];
    return [
      ...evs.map((e) => ({ date: e.eventDate!, title: e.title, category: e.category, time: e.startTime, host: e.host, preacher: e.preacher })),
      ...dana.map((b) => ({ date: b.danaDate, title: DANA_TYPES[b.danaType]?.en ?? "Dana", category: "dana", time: "", host: b.name, preacher: "" })),
    ];
  });
}

export function getRegistrableEvents(section: Section) {
  return safe([] as (typeof events.$inferSelect)[], () =>
    db
      .select()
      .from(events)
      .where(and(eq(events.section, section), eq(events.allowRegistration, true), or(isNull(events.eventDate), gte(events.eventDate, today()))))
      .orderBy(sql`${events.eventDate} asc nulls last`)
  );
}

/** Daily dana roster between two dates (inclusive). */
export function getDailyDana(from: string, to: string) {
  return safe([] as { danaDate: string; slot: string; donor: string }[], () =>
    db
      .select({ danaDate: schema.dailyDana.danaDate, slot: schema.dailyDana.slot, donor: schema.dailyDana.donor })
      .from(schema.dailyDana)
      .where(and(gte(schema.dailyDana.danaDate, from), sql`${schema.dailyDana.danaDate} <= ${to}`))
      .orderBy(asc(schema.dailyDana.danaDate))
  );
}

/** Dates that already have a confirmed/pending dana of a given type (no personal details). */
export function getBookedDana() {
  return safe([] as { danaDate: string; danaType: string }[], () =>
    db
      .select({ danaDate: danaBookings.danaDate, danaType: danaBookings.danaType })
      .from(danaBookings)
      .where(and(gte(danaBookings.danaDate, today()), or(eq(danaBookings.status, "confirmed"), eq(danaBookings.status, "pending"))))
      .orderBy(asc(danaBookings.danaDate))
      .limit(400)
  );
}
