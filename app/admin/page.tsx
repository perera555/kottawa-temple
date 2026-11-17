import Link from "next/link";
import { and, count, desc, eq, gte } from "drizzle-orm";
import { connection } from "next/server";
import {
  CalendarDays,
  CalendarPlus,
  ClipboardList,
  GraduationCap,
  HandHeart,
  Images,
  Mail,
  Megaphone,
  MessageSquareQuote,
  ShieldCheck,
  UserRound,
  Users,
  Utensils,
  Video,
  Wifi,
} from "lucide-react";
import { Avatar } from "@/components/user-menu";
import { allowedSections, requireAdmin } from "@/lib/auth";
import { db, schema } from "@/lib/db";
import { ONLINE_WINDOW_MS } from "@/lib/presence";
import { DANA_SLOTS, SECTION_INFO } from "@/lib/site";

const C = {
  orange: ["#ffb347", "#ec7a1c", "#a3410a"],
  blue: ["#5b8def", "#1f4ea3", "#0f2a63"],
  yellow: ["#ffe17a", "#e2a614", "#8a5f00"],
  red: ["#ef5b62", "#c8242b", "#7a0f14"],
  maroon: ["#b5524f", "#8a1e1e", "#4a0c0c"],
  green: ["#6ccf8a", "#2c7a3f", "#14421f"],
} as const;
const vars = (c: readonly string[]) => ({ "--f1": c[0], "--f2": c[1], "--f3": c[2] }) as React.CSSProperties;

export default async function Dashboard({ searchParams }: PageProps<"/admin">) {
  await connection();
  const user = await requireAdmin();
  const sp = await searchParams;
  const all = allowedSections(user);
  const picked = typeof sp.section === "string" ? all.filter((s) => s === sp.section) : [];
  const section = (picked[0] ?? all[0])!;
  const today = new Date().toISOString().slice(0, 10);
  const isTemple = section === "temple";
  const q = `?section=${section}`;

  const n = async (p: Promise<{ n: number }[]>) => (await p)[0]?.n ?? 0;
  const [unread, pendingReviews, pendingDana, regs, notices, events, photos, students, members, online, latestMsgs, latestRegs, upcoming, todayDana] =
    await Promise.all([
      n(db.select({ n: count() }).from(schema.messages).where(and(eq(schema.messages.section, section), eq(schema.messages.isRead, false)))),
      n(db.select({ n: count() }).from(schema.testimonials).where(and(eq(schema.testimonials.section, section), eq(schema.testimonials.approved, false)))),
      isTemple ? n(db.select({ n: count() }).from(schema.danaBookings).where(eq(schema.danaBookings.status, "pending"))) : 0,
      n(db.select({ n: count() }).from(schema.registrations).where(eq(schema.registrations.section, section))),
      n(db.select({ n: count() }).from(schema.posts).where(eq(schema.posts.section, section))),
      n(db.select({ n: count() }).from(schema.events).where(eq(schema.events.section, section))),
      n(db.select({ n: count() }).from(schema.galleryItems).where(eq(schema.galleryItems.section, section))),
      n(db.select({ n: count() }).from(schema.students).where(and(eq(schema.students.section, section), eq(schema.students.active, true)))),
      n(db.select({ n: count() }).from(schema.users)),
      db
        .select({ id: schema.users.id, name: schema.users.name, avatarUrl: schema.users.avatarUrl, role: schema.users.role })
        .from(schema.users)
        .where(gte(schema.users.lastSeenAt, new Date(Date.now() - ONLINE_WINDOW_MS)))
        .limit(12),
      db.select().from(schema.messages).where(eq(schema.messages.section, section)).orderBy(desc(schema.messages.createdAt)).limit(5),
      db.select().from(schema.registrations).where(eq(schema.registrations.section, section)).orderBy(desc(schema.registrations.createdAt)).limit(5),
      db.select().from(schema.events).where(and(eq(schema.events.section, section), gte(schema.events.eventDate, today))).orderBy(schema.events.eventDate).limit(5),
      isTemple ? db.select().from(schema.dailyDana).where(eq(schema.dailyDana.danaDate, today)) : Promise.resolve([]),
    ]);

  const stats = [
    { label: "Unread messages", n: unread, icon: Mail, c: C.red, href: `/admin/messages${q}` },
    { label: "Reviews to approve", n: pendingReviews, icon: MessageSquareQuote, c: C.yellow, href: `/admin/testimonials${q}` },
    ...(isTemple ? [{ label: "Dana requests pending", n: pendingDana, icon: HandHeart, c: C.orange, href: "/admin/dana?section=temple" }] : []),
    { label: "Sil / puja registrations", n: regs, icon: ClipboardList, c: C.blue, href: `/admin/registrations${q}` },
    ...(section !== "temple" ? [{ label: "Active students", n: students, icon: GraduationCap, c: C.green, href: `/admin/students${q}` }] : []),
    { label: "Users online now", n: online.length, icon: Wifi, c: C.green, href: user.role === "super_admin" ? "/admin/users" : `/admin${q}` },
  ];

  const actions = [
    { label: "Notice / Ad", icon: Megaphone, c: C.red, href: `/admin/posts/new${q}` },
    { label: "Activity", icon: CalendarDays, c: C.blue, href: `/admin/events/new${q}` },
    { label: "Monthly list", icon: CalendarPlus, c: C.maroon, href: `/admin/monthly${q}` },
    ...(isTemple ? [{ label: "Daily dana", icon: Utensils, c: C.orange, href: "/admin/daily-dana?section=temple" }] : []),
    { label: "Photo", icon: Images, c: C.green, href: `/admin/gallery/new${q}` },
    { label: "Video", icon: Video, c: C.red, href: `/admin/videos/new${q}` },
    { label: isTemple ? "Monk" : "Teacher", icon: UserRound, c: C.yellow, href: `/admin/teachers/new${q}` },
    ...(section === "dhamma" ? [{ label: "Prefect / Monitor", icon: ShieldCheck, c: C.blue, href: `/admin/leaders/new${q}` }] : []),
    ...(section !== "temple" ? [{ label: "Student", icon: GraduationCap, c: C.green, href: `/admin/students/new${q}` }] : []),
    ...(user.role === "super_admin" ? [{ label: "User / Admin", icon: Users, c: C.maroon, href: "/admin/users/new" }] : []),
  ];

  return (
    <div className="space-y-10">
      {/* Welcome banner */}
      <div data-section={section} className="hero-bg tile-3d relative overflow-hidden p-6 text-white sm:p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-flag-yellow">{SECTION_INFO[section].short.en} · Admin</p>
        <h1 className="text-3d mt-1 font-display text-3xl sm:text-4xl">Ayubowan, {user.name} 🙏</h1>
        <p className="mt-1 text-white/80">{SECTION_INFO[section].name.en}</p>
        <div className="mt-5 flex flex-wrap gap-6 text-sm">
          <span><b className="text-2xl">{notices}</b> notices</span>
          <span><b className="text-2xl">{events}</b> activities</span>
          <span><b className="text-2xl">{photos}</b> photos</span>
          {user.role === "super_admin" && <span><b className="text-2xl">{members}</b> user accounts</span>}
        </div>
      </div>

      {/* Stat tiles */}
      <div className="grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-5">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="feature-3d min-h-36!" style={vars(s.c)}>
            <span className="feature-orb" />
            <span className="feature-icon h-12 w-12"><s.icon size={24} /></span>
            <span className="relative mt-auto">
              <span className="text-3d block font-display text-4xl">{s.n}</span>
              <span className="text-sm text-white/90">{s.label}</span>
            </span>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <section>
        <h2 className="mb-4 font-display text-2xl text-accent">Quick add</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 xl:grid-cols-8">
          {actions.map((a) => (
            <Link key={a.label} href={a.href} className="feature-3d min-h-0! items-center p-4! text-center" style={vars(a.c)}>
              <span className="feature-icon mb-2! h-12 w-12"><a.icon size={22} /></span>
              <span className="relative text-sm font-semibold">+ {a.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Panels */}
      <div className="grid gap-6 xl:grid-cols-3">
        {isTemple && (
          <div className="card card-flat p-5">
            <h2 className="mb-3 flex items-center justify-between font-display text-xl text-accent">
              Today&apos;s dana <Link href="/admin/daily-dana?section=temple" className="text-xs font-sans text-accent hover:underline">Edit roster →</Link>
            </h2>
            <ul className="space-y-2 text-sm">
              {DANA_SLOTS.map((s) => {
                const d = todayDana.find((x) => x.slot === s.key);
                return (
                  <li key={s.key} className="flex items-center justify-between gap-3 rounded-xl bg-paper px-3 py-2 shadow-[0_3px_0_var(--line)]">
                    <span>{s.emoji} {s.label.en}</span>
                    <span className={d ? "font-semibold" : "text-muted"}>{d?.donor ?? "Open"}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <div className="card card-flat p-5">
          <h2 className="mb-3 font-display text-xl text-accent">Upcoming programmes</h2>
          {upcoming.length ? (
            <ul className="space-y-2 text-sm">
              {upcoming.map((e) => (
                <li key={e.id}>
                  <Link href={`/admin/events/${e.id}${q}`} className="flex items-center gap-3 rounded-xl px-2 py-1.5 hover:bg-accent-soft">
                    <span className="w-16 shrink-0 text-xs font-bold text-accent">{e.eventDate}</span>
                    <span className="line-clamp-1">{e.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted">Nothing scheduled. <Link href={`/admin/monthly${q}`} className="text-accent underline">Add this month&apos;s list</Link></p>
          )}
        </div>

        <div className="card card-flat p-5">
          <h2 className="mb-3 font-display text-xl text-accent">Latest messages</h2>
          {latestMsgs.length ? (
            <ul className="space-y-2 text-sm">
              {latestMsgs.map((m) => (
                <li key={m.id}>
                  <Link href={`/admin/messages/${m.id}${q}`} className="block rounded-xl px-2 py-1.5 hover:bg-accent-soft">
                    <span className={`block ${m.isRead ? "" : "font-semibold"}`}>{m.name} {!m.isRead && <span className="ml-1 rounded-full bg-flag-red px-1.5 text-[10px] text-white">new</span>}</span>
                    <span className="line-clamp-1 text-xs text-muted">{m.subject || m.message}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted">No messages yet.</p>
          )}
        </div>

        <div className="card card-flat p-5">
          <h2 className="mb-3 font-display text-xl text-accent">Latest registrations</h2>
          {latestRegs.length ? (
            <ul className="space-y-2 text-sm">
              {latestRegs.map((r) => (
                <li key={r.id} className="flex justify-between gap-3 rounded-xl px-2 py-1.5">
                  <span>{r.name} <span className="text-xs text-muted">({r.people})</span></span>
                  <span className="text-xs text-muted">{r.phone}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted">No registrations yet.</p>
          )}
        </div>

        <div className="card card-flat p-5">
          <h2 className="mb-3 flex items-center gap-2 font-display text-xl text-accent">
            <span className="h-2.5 w-2.5 rounded-full bg-green-500" /> Online now
          </h2>
          {online.length ? (
            <ul className="flex flex-wrap gap-3">
              {online.map((u) => (
                <li key={u.id} className="flex items-center gap-2 rounded-full bg-paper py-1 pl-1 pr-3 text-sm shadow-[0_3px_0_var(--line)]">
                  <Avatar name={u.name} src={u.avatarUrl} size={28} online />
                  {u.name}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted">Nobody else is online.</p>
          )}
        </div>
      </div>
    </div>
  );
}

