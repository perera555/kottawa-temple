import Link from "next/link";
import { SocialFeed } from "@/components/social";
import { Award, BookOpen, Users, Megaphone } from "lucide-react";
import { DharmaWheel } from "@/components/dharma-wheel";
import { Hero3D } from "@/components/three/hero-3d";
import { Container, EventCard, PersonCard, PostCard, ReviewCard, SectionTitle } from "@/components/ui";
import { getClassCounts, getLeaders, getPosts, getTestimonials, getUpcomingEvents, getEvents } from "@/lib/data";
import { getLang } from "@/lib/lang";
import { SECTION_INFO, TEMPLE, tr, UI } from "@/lib/site";

export const metadata = { title: "Siri Saddharmodaya Dhamma School" };

export default async function DhammaHome() {
  const [lang, notices, ads, upcoming, recent, counts, leaders, reviews] = await Promise.all([
    getLang(),
    getPosts("dhamma", { kind: "notice", limit: 3 }),
    getPosts("dhamma", { kind: "advertisement", limit: 3 }),
    getUpcomingEvents("dhamma", 4),
    getEvents("dhamma"),
    getClassCounts("dhamma"),
    getLeaders("dhamma"),
    getTestimonials("dhamma"),
  ]);
  const info = SECTION_INFO.dhamma;
  const si = lang === "si";
  const totalStudents = counts.reduce((s, c) => s + c.count, 0);
  const prefects = leaders.filter((l) => l.type === "prefect").slice(0, 4);
  const events = upcoming.length ? upcoming : recent.slice(0, 4);

  return (
    <>
      <section className="hero-bg relative overflow-hidden text-white">
        <DharmaWheel className="spin-slow pointer-events-none absolute -left-32 -bottom-40 h-112 w-md text-white/5" />
        <Hero3D variant="dhamma" className="pointer-events-none absolute -right-10 top-0 hidden h-full w-[520px] lg:block" />
        <Container className="relative py-16 sm:py-24">
          <p className="text-sm uppercase tracking-[0.2em] text-flag-yellow">{tr(TEMPLE.name, lang)}, {tr(TEMPLE.place, lang)}</p>
          <h1 className="text-3d mt-3 max-w-3xl font-display text-4xl leading-tight sm:text-6xl">{tr(info.name, lang)}</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/85">{tr(info.tagline, lang)}</p>
          <p className="mt-2 text-white/70">{si ? "සෑම ඉරිදාවකම පෙ.ව. 7.30 සිට ප.ව. 12.00 දක්වා" : "Every Sunday, 7.30 a.m. – 12.00 noon"}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/dhamma-school/notices" className="btn btn-gold"><Megaphone size={18} /> {si ? "නිවේදන" : "Notices"}</Link>
            <Link href="/dhamma-school/activities" className="btn btn-ghost">{si ? "ක්‍රියාකාරකම්" : "Activities"}</Link>
          </div>
        </Container>
      </section>

      <Container className="relative z-10 -mt-10 grid gap-5 sm:grid-cols-3">
        {[
          { icon: Users, n: totalStudents || "—", l: si ? "සිසුන්" : "Students", href: "/dhamma-school/students" },
          { icon: BookOpen, n: counts.length || "—", l: si ? "පන්ති" : "Classes", href: "/dhamma-school/teachers" },
          { icon: Award, n: leaders.length || "—", l: si ? "ශිෂ්‍ය නායකයින්" : "Prefects & Monitors", href: "/dhamma-school/prefects" },
        ].map((s) => (
          <Link key={s.l} href={s.href} className="card flex items-center gap-4 p-6">
            <span className="depth-3d grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-accent-2 to-accent text-white shadow-lg"><s.icon /></span>
            <span>
              <span className="block font-display text-3xl text-accent">{s.n}</span>
              <span className="text-sm text-muted">{s.l}</span>
            </span>
          </Link>
        ))}
      </Container>

      <Container className="grid gap-12 py-16 lg:grid-cols-2">
        <section>
          <SectionTitle title={tr(UI.latestNotices, lang)} href="/dhamma-school/notices" linkLabel={tr(UI.viewAll, lang)} />
          {notices.length ? <div className="space-y-5">{notices.map((p) => <PostCard key={p.id} post={p} lang={lang} />)}</div> : <p className="text-muted">{tr(UI.noItems, lang)}</p>}
        </section>
        <section>
          <SectionTitle title={si ? "ළමා ක්‍රියාකාරකම්" : "Children's Activities"} href="/dhamma-school/activities" linkLabel={tr(UI.viewAll, lang)} />
          {events.length ? <div className="space-y-4">{events.map((e) => <EventCard key={e.id} ev={e} lang={lang} />)}</div> : <p className="text-muted">{tr(UI.noItems, lang)}</p>}
        </section>
      </Container>

      {prefects.length > 0 && (
        <section className="bg-paper-2 py-16">
          <Container>
            <SectionTitle title={tr(UI.prefects, lang)} href="/dhamma-school/prefects" linkLabel={tr(UI.viewAll, lang)} />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {prefects.map((p, i) => <PersonCard key={p.id} name={p.name} role={p.position} sub={p.grade} imageUrl={p.imageUrl} highlight={i === 0} />)}
            </div>
          </Container>
        </section>
      )}

      {ads.length > 0 && (
        <Container className="py-16">
          <SectionTitle title={tr(UI.advertisements, lang)} />
          <div className="grid gap-6 md:grid-cols-3">{ads.map((p) => <PostCard key={p.id} post={p} lang={lang} />)}</div>
        </Container>
      )}

      {/* SOCIAL MEDIA - Facebook & YouTube update automatically */}
      <section className="py-16">
        <Container>
          <SectionTitle
            title={lang === "si" ? "සමාජ මාධ්‍ය" : "Social Media"}
            sub={lang === "si" ? "Facebook සහ YouTube හි නවතම පළකිරීම් - ස්වයංක්‍රීයව යාවත්කාලීන වේ" : "Our latest Facebook and YouTube posts — updated automatically"}
            href="/dhamma-school/live"
            linkLabel={lang === "si" ? "🔴 සජීවී" : "🔴 Live"}
          />
          <SocialFeed section="dhamma" lang={lang} compact />
        </Container>
      </section>
      {reviews.length > 0 && (
        <Container className="pb-16">
          <SectionTitle title={si ? "දෙමාපිය අදහස්" : "Parents say"} href="/dhamma-school/reviews" linkLabel={si ? "අදහසක් ලියන්න" : "Write a review"} />
          <div className="grid gap-6 md:grid-cols-3">{reviews.slice(0, 3).map((r) => <ReviewCard key={r.id} r={r} lang={lang} />)}</div>
        </Container>
      )}
    </>
  );
}
