import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { connection } from "next/server";
import { BadgeCheck, LogOut, ShieldCheck } from "lucide-react";
import { logout } from "@/app/actions/auth";
import { ProfileForm } from "@/components/forms";
import { Container, fmtDate, Stars } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { db, schema } from "@/lib/db";
import { isAdminRole } from "@/lib/session";
import { DANA_TYPES, SECTION_INFO, type Section } from "@/lib/site";

export const metadata = { title: "My Account" };

const STATUS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-700",
};

export default async function AccountPage() {
  await connection();
  const session = await requireUser();
  const [[user], bookings, msgs, reviews, apps] = await Promise.all([
    db.select().from(schema.users).where(eq(schema.users.id, session.id)).limit(1),
    db.select().from(schema.danaBookings).where(eq(schema.danaBookings.userId, session.id)).orderBy(desc(schema.danaBookings.danaDate)),
    db.select().from(schema.messages).where(eq(schema.messages.userId, session.id)).orderBy(desc(schema.messages.createdAt)),
    db.select().from(schema.testimonials).where(eq(schema.testimonials.userId, session.id)).orderBy(desc(schema.testimonials.createdAt)),
    db.select().from(schema.applications).where(eq(schema.applications.userId, session.id)).orderBy(desc(schema.applications.createdAt)),
  ]);
  if (!user) return <Container className="py-16">Account not found.</Container>;

  return (
    <Container className="py-12">
      <div className="hero-bg tile-3d mb-10 flex flex-wrap items-center justify-between gap-6 p-8 text-white">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-flag-yellow">My Account / මගේ ගිණුම</p>
          <h1 className="text-3d mt-1 font-display text-3xl sm:text-4xl">{user.name}</h1>
          <p className="text-white/80">{user.email}</p>
        </div>
        <div className="rounded-2xl bg-white/10 p-5 text-center backdrop-blur">
          <p className="flex items-center justify-center gap-1 text-xs uppercase tracking-wider text-flag-yellow"><BadgeCheck size={14} /> Registration No.</p>
          <p className="mt-1 font-mono text-2xl font-bold">{user.memberNo ?? "-"}</p>
          <p className="text-xs text-white/70">Member since {fmtDate(user.createdAt)}</p>
        </div>
      </div>

      <div className="mb-8 flex flex-wrap gap-3">
        {isAdminRole(user.role) && <Link href="/admin" className="btn btn-primary"><ShieldCheck size={18} /> Admin Panel</Link>}
        <Link href="/dana" className="btn btn-ghost">Book a Dana</Link>
        <Link href="/reviews" className="btn btn-ghost">Write a review</Link>
        <form action={logout}><button className="btn btn-ghost"><LogOut size={16} /> Logout</button></form>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="card card-flat p-6">
          <h2 className="mb-4 font-display text-2xl text-accent">My Dana Bookings</h2>
          {bookings.length ? (
            <ul className="divide-y divide-line">
              {bookings.map((b) => (
                <li key={b.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                  <span>
                    <span className="block font-semibold">{fmtDate(b.danaDate)}</span>
                    <span className="text-muted">{DANA_TYPES[b.danaType]?.en ?? b.danaType}</span>
                  </span>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS[b.status] ?? ""}`}>{b.status}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted">No bookings yet. <Link href="/dana" className="text-accent underline">Book a dana</Link></p>
          )}
        </section>

        {apps.length > 0 && (
          <section className="card card-flat p-6 lg:col-span-2">
            <h2 className="mb-4 font-display text-2xl text-accent">My Admission Applications</h2>
            <ul className="divide-y divide-line">
              {apps.map((a) => (
                <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
                  <span>
                    <span className="block font-semibold">{a.childName}</span>
                    <span className="text-muted">{SECTION_INFO[a.section as Section]?.short.en} · {a.grade} · applied {fmtDate(a.createdAt)}</span>
                  </span>
                  <span className="flex items-center gap-2">
                    {a.admissionNo && <span className="font-mono text-xs">{a.admissionNo}</span>}
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${a.status === "accepted" ? "bg-green-100 text-green-800" : a.status === "rejected" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-800"}`}>
                      {a.status === "waiting" ? "waiting list" : a.status}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="card card-flat p-6">
          <h2 className="mb-4 font-display text-2xl text-accent">My Profile</h2>
          <ProfileForm user={{ name: user.name, phone: user.phone, address: user.address, avatarUrl: user.avatarUrl }} />
        </section>

        <section className="card card-flat p-6">
          <h2 className="mb-4 font-display text-2xl text-accent">My Messages</h2>
          {msgs.length ? (
            <ul className="space-y-4">
              {msgs.map((m) => (
                <li key={m.id} className="rounded-xl border border-line p-4 text-sm">
                  <p className="text-xs text-muted">{SECTION_INFO[m.section as Section]?.short.en} · {fmtDate(m.createdAt)}</p>
                  <p className="font-semibold">{m.subject || "Message"}</p>
                  <p className="prose-text text-muted">{m.message}</p>
                  {m.reply ? (
                    <p className="prose-text mt-3 rounded-lg bg-accent-soft p-3"><b>Reply:</b> {m.reply}</p>
                  ) : (
                    <p className="mt-2 text-xs text-muted">{m.isRead ? "Seen by the temple" : "Awaiting reply"}</p>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted">No messages. <Link href="/contact" className="text-accent underline">Contact us</Link></p>
          )}
        </section>

        <section className="card card-flat p-6">
          <h2 className="mb-4 font-display text-2xl text-accent">My Reviews</h2>
          {reviews.length ? (
            <ul className="space-y-4">
              {reviews.map((r) => (
                <li key={r.id} className="rounded-xl border border-line p-4 text-sm">
                  <div className="flex items-center justify-between">
                    <Stars n={r.rating} size={14} />
                    <span className="text-xs text-muted">{r.approved ? "Published" : "Awaiting approval"}</span>
                  </div>
                  <p className="mt-2 text-muted">{r.message}</p>
                  <p className="mt-1 text-xs text-muted">{SECTION_INFO[r.section as Section]?.short.en}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted">No reviews yet.</p>
          )}
        </section>
      </div>
    </Container>
  );
}
