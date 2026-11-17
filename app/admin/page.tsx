import Link from "next/link";
import { and, count, eq, gte, inArray } from "drizzle-orm";
import { connection } from "next/server";
import { db, schema } from "@/lib/db";
import { allowedSections, requireAdmin } from "@/lib/auth";
import { RESOURCES } from "@/lib/resources";
import { SECTION_INFO } from "@/lib/site";
import { TABLES } from "@/lib/tables";

export default async function Dashboard({ searchParams }: PageProps<"/admin">) {
  await connection();
  const user = await requireAdmin();
  const sp = await searchParams;
  const all = allowedSections(user);
  const picked = typeof sp.section === "string" ? all.filter((s) => s === sp.section) : [];
  const sections = picked.length ? picked : all.slice(0, 1);
  const today = new Date().toISOString().slice(0, 10);

  const countOf = async (table: (typeof TABLES)[keyof typeof TABLES], extra?: ReturnType<typeof eq>) => {
    const t = table as typeof schema.posts;
    const where = extra ? and(inArray(t.section, sections), extra) : inArray(t.section, sections);
    const [r] = await db.select({ n: count() }).from(t).where(where);
    return r.n;
  };

  const [unread, pendingReviews, pendingDana, upcomingDana, members] = await Promise.all([
    countOf(TABLES.messages, eq(schema.messages.isRead, false)),
    countOf(TABLES.testimonials, eq(schema.testimonials.approved, false)),
    sections.includes("temple") ? countOf(TABLES.dana, eq(schema.danaBookings.status, "pending")) : Promise.resolve(0),
    sections.includes("temple")
      ? db.select().from(schema.danaBookings).where(gte(schema.danaBookings.danaDate, today)).orderBy(schema.danaBookings.danaDate).limit(6)
      : Promise.resolve([]),
    user.role === "super_admin" ? db.select({ n: count() }).from(schema.users).then((r) => r[0].n) : Promise.resolve(null),
  ]);

  const perSection = await Promise.all(
    sections.map(async (s) => ({
      s,
      posts: (await db.select({ n: count() }).from(schema.posts).where(eq(schema.posts.section, s)))[0].n,
      events: (await db.select({ n: count() }).from(schema.events).where(eq(schema.events.section, s)))[0].n,
      gallery: (await db.select({ n: count() }).from(schema.galleryItems).where(eq(schema.galleryItems.section, s)))[0].n,
    }))
  );

  const alerts = [
    { label: "Unread messages", n: unread, href: `/admin/messages?section=${sections[0]}` },
    { label: "Reviews to approve", n: pendingReviews, href: `/admin/testimonials?section=${sections[0]}` },
    ...(sections.includes("temple") ? [{ label: "Dana requests pending", n: pendingDana, href: "/admin/dana?section=temple" }] : []),
    ...(members !== null ? [{ label: "User accounts", n: members, href: "/admin/users" }] : []),
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-accent">Ayubowan, {user.name} 🙏</h1>
        <p className="text-muted">{SECTION_INFO[sections[0]].name.en} — admin panel</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {alerts.map((a) => (
          <Link key={a.label} href={a.href} className="card p-5">
            <p className="font-display text-4xl text-accent">{a.n}</p>
            <p className="text-sm text-muted">{a.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {perSection.map((p) => (
          <div key={p.s} data-section={p.s} className="card card-flat overflow-hidden">
            <div className="hero-bg p-4 text-white">
              <p className="font-display text-xl">{SECTION_INFO[p.s].name.en}</p>
            </div>
            <div className="grid grid-cols-3 divide-x divide-line text-center">
              {[["posts", p.posts], ["events", p.events], ["gallery", p.gallery]].map(([k, n]) => (
                <Link key={k} href={`/admin/${k}?section=${p.s}`} className="p-4 hover:bg-accent-soft">
                  <p className="text-2xl font-bold text-accent">{n}</p>
                  <p className="text-xs text-muted">{RESOURCES[k as "posts"].label}</p>
                </Link>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 border-t border-line p-4">
              <Link href={`/admin/posts/new?section=${p.s}`} className="btn btn-primary py-1.5! text-sm">+ Notice / Ad</Link>
              <Link href={`/admin/events/new?section=${p.s}`} className="btn btn-ghost py-1.5! text-sm">+ Activity</Link>
              <Link href={`/admin/gallery/new?section=${p.s}`} className="btn btn-ghost py-1.5! text-sm">+ Photo</Link>
              <Link href={`/admin/videos/new?section=${p.s}`} className="btn btn-ghost py-1.5! text-sm">+ Video</Link>
              {p.s === "dhamma" && <Link href={`/admin/leaders/new?section=${p.s}`} className="btn btn-ghost py-1.5! text-sm">+ Prefect</Link>}
              {p.s !== "temple" && <Link href={`/admin/students/new?section=${p.s}`} className="btn btn-ghost py-1.5! text-sm">+ Student</Link>}
              <Link href={`/admin/teachers/new?section=${p.s}`} className="btn btn-ghost py-1.5! text-sm">+ {p.s === "temple" ? "Monk" : "Teacher"}</Link>
            </div>
          </div>
        ))}
      </div>

      {upcomingDana.length > 0 && (
        <div className="card card-flat p-6">
          <h2 className="mb-3 font-display text-xl text-accent">Upcoming dana</h2>
          <ul className="divide-y divide-line text-sm">
            {upcomingDana.map((d) => (
              <li key={d.id} className="flex justify-between gap-4 py-2">
                <span>{d.danaDate} · {d.name} ({d.phone})</span>
                <Link href={`/admin/dana/${d.id}`} className="capitalize text-accent">{d.status}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
