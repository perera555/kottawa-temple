import Link from "next/link";
import { CalendarDays, CalendarRange, Flower2, Images, Mail, MapPin, Megaphone, Phone, PlayCircle, Radio, Star } from "lucide-react";
import { getSession } from "@/lib/auth";
import { getEvents, getGallery, getMonth, getPosts, getRegistrableEvents, getSchedule, getTestimonials, getVideos } from "@/lib/data";
import { CalendarView, ProgrammePanel } from "./programme";
import { MonthTimeline } from "./timeline";
import { LiveBanner, LivePlayer, SocialButtons, SocialFeed } from "./social";
import { getSettings } from "@/lib/settings";
import { getLang } from "@/lib/lang";
import { EVENT_CATEGORIES, SECTION_INFO, TEMPLE, tr, UI, VIDEO_CATEGORIES, type Section } from "@/lib/site";
import { ContactForm, ProgrammeRegistrationForm, ReviewForm } from "./forms";
import { GalleryGrid } from "./gallery-grid";
import { Container, Empty, EventCard, fmtDate, PageHero, PostCard, ReviewCard, SectionTitle, Stars } from "./ui";
import { VideoCard } from "./video-card";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

export async function SectionShell({ section, children }: { section: Section; children: React.ReactNode }) {
  const lang = await getLang();
  return (
    <div data-section={section} className="flex min-h-screen flex-col">
      <SiteHeader section={section} />
      <LiveBanner section={section} lang={lang} />
      <main className="flex-1">{children}</main>
      <SiteFooter section={section} />
    </div>
  );
}

export async function LivePage({ section }: { section: Section }) {
  const lang = await getLang();
  const si = lang === "si";
  return (
    <>
      <PageHero
        eyebrow={tr(SECTION_INFO[section].name, lang)}
        title={si ? "සජීවී සහ සමාජ මාධ්‍ය" : "Live & Social Media"}
        subtitle={si ? "Facebook සහ YouTube සජීවී විකාශන සහ නවතම පළකිරීම්" : "Facebook & YouTube live streams and our latest posts"}
        icon={Radio}
      />
      <Container className="space-y-14 py-12">
        <LivePlayer section={section} lang={lang} />
        <section>
          <SectionTitle title={si ? "නවතම පළකිරීම්" : "Latest posts"} sub={si ? "ස්වයංක්‍රීයව යාවත්කාලීන වේ" : "Updates automatically from our pages"} />
          <SocialFeed section={section} lang={lang} />
        </section>
      </Container>
    </>
  );
}

function FilterChips({ base, current, options, lang }: { base: string; current?: string; options: Record<string, { en: string; si: string }>; lang: "en" | "si" }) {
  return (
    <div className="mb-8 flex flex-wrap gap-2">
      <Link href={base} className={`rounded-full border px-3 py-1.5 text-sm ${!current ? "border-accent bg-accent text-white" : "border-line bg-white hover:border-accent"}`}>
        {lang === "si" ? "සියල්ල" : "All"}
      </Link>
      {Object.entries(options).map(([k, v]) => (
        <Link
          key={k}
          href={`${base}?category=${k}`}
          className={`rounded-full border px-3 py-1.5 text-sm ${current === k ? "border-accent bg-accent text-white" : "border-line bg-white hover:border-accent"}`}
        >
          {tr(v, lang)}
        </Link>
      ))}
    </div>
  );
}

export async function NoticesPage({ section }: { section: Section }) {
  const [lang, all] = await Promise.all([getLang(), getPosts(section)]);
  const ads = all.filter((p) => p.kind === "advertisement");
  const notices = all.filter((p) => p.kind !== "advertisement");
  const info = SECTION_INFO[section];
  return (
    <>
      <PageHero eyebrow={tr(info.name, lang)} title={lang === "si" ? "නිවේදන සහ දැන්වීම්" : "Notices & Advertisements"} icon={Megaphone} />
      <Container className="grid gap-10 py-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-5 font-display text-2xl text-accent">{tr(UI.latestNotices, lang)}</h2>
          {notices.length ? (
            <div className="grid gap-6 sm:grid-cols-2">{notices.map((p) => <PostCard key={p.id} post={p} lang={lang} />)}</div>
          ) : (
            <Empty text={tr(UI.noItems, lang)} />
          )}
        </div>
        <aside>
          <h2 className="mb-5 font-display text-2xl text-accent">{tr(UI.advertisements, lang)}</h2>
          {ads.length ? <div className="space-y-6">{ads.map((p) => <PostCard key={p.id} post={p} lang={lang} />)}</div> : <Empty text={tr(UI.noItems, lang)} />}
        </aside>
      </Container>
    </>
  );
}

export async function ActivitiesPage({ section, category, title }: { section: Section; category?: string; title?: string }) {
  const [lang, events] = await Promise.all([getLang(), getEvents(section, category)]);
  const info = SECTION_INFO[section];
  const regular = events.filter((e) => !e.eventDate);
  const dated = events.filter((e) => e.eventDate).sort((a, b) => (a.eventDate! < b.eventDate! ? -1 : 1));
  const grouped = new Map<string, typeof dated>();
  for (const e of dated) {
    const m = e.eventDate!.slice(0, 7);
    grouped.set(m, [...(grouped.get(m) ?? []), e]);
  }
  // Current & future months first, then past months (most recent first)
  const nowM = new Date().toISOString().slice(0, 7);
  const months = [
    ...[...grouped].filter(([m]) => m >= nowM),
    ...[...grouped].filter(([m]) => m < nowM).reverse(),
  ];
  const monthLabel = (m: string) =>
    new Date(m + "-01T00:00:00").toLocaleDateString(lang === "si" ? "si-LK" : "en-GB", { month: "long", year: "numeric" });
  const usedCats = Object.fromEntries(Object.entries(EVENT_CATEGORIES).filter(([k]) => k === category || events.some((e) => e.category === k) || !category));
  return (
    <>
      <PageHero eyebrow={tr(info.name, lang)} title={title ?? (lang === "si" ? "ක්‍රියාකාරකම්" : "Activities")} icon={CalendarDays} />
      <Container className="py-12">
        <FilterChips base={`${info.base}/activities`} current={category} options={usedCats} lang={lang} />
        {regular.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-5 font-display text-2xl text-accent">{tr(UI.regular, lang)}</h2>
            <div className="grid gap-5 md:grid-cols-2">{regular.map((e) => <EventCard key={e.id} ev={e} lang={lang} />)}</div>
          </section>
        )}
        <h2 className="mb-5 font-display text-2xl text-accent">{lang === "si" ? "මාසික වැඩසටහන්" : "Monthly Activities"}</h2>
        {months.length ? (
          <>
            <nav className="mb-8 flex gap-2 overflow-x-auto pb-2">
              {months.map(([m]) => (
                <a key={m} href={`#m-${m}`} className="nav-3d shrink-0">{monthLabel(m)}</a>
              ))}
            </nav>
            <div className="space-y-16">
              {months.map(([m, list]) => (
                <MonthTimeline key={m} id={`m-${m}`} label={monthLabel(m)} events={list} lang={lang} />
              ))}
            </div>
          </>
        ) : (
          <Empty text={tr(UI.noItems, lang)} />
        )}
      </Container>
    </>
  );
}

export async function GalleryPage({ section }: { section: Section }) {
  const [lang, items] = await Promise.all([getLang(), getGallery(section)]);
  return (
    <>
      <PageHero eyebrow={tr(SECTION_INFO[section].name, lang)} title={tr(UI.gallery, lang)} icon={Images} />
      <Container className="py-12">
        {items.length ? <GalleryGrid items={items} allLabel={lang === "si" ? "සියල්ල" : "All"} /> : <Empty text={tr(UI.noItems, lang)} />}
      </Container>
    </>
  );
}

export async function VideosPage({ section, category }: { section: Section; category?: string }) {
  const [lang, videos] = await Promise.all([getLang(), getVideos(section, { category })]);
  const info = SECTION_INFO[section];
  return (
    <>
      <PageHero
        eyebrow={tr(info.name, lang)}
        title={lang === "si" ? "වීඩියෝ" : "Videos"}
        subtitle={lang === "si" ? "කඨින, බෝධි පූජා, බණ සහ පිරිත් වීඩියෝ" : "Katina ceremonies, Bodhi Puja, Bana sermons and Pirith"}
        icon={PlayCircle}
      />
      <Container className="py-12">
        <div className="mb-8 flex flex-wrap gap-2">
          <Link href={`${info.base}/videos`} className={`rounded-full border px-3 py-1.5 text-sm ${!category ? "border-accent bg-accent text-white" : "border-line bg-white"}`}>
            {lang === "si" ? "සියල්ල" : "All"}
          </Link>
          {Object.entries(VIDEO_CATEGORIES).map(([k, v]) => (
            <Link key={k} href={`${info.base}/videos?category=${k}`} className={`rounded-full border px-3 py-1.5 text-sm ${category === k ? "border-accent bg-accent text-white" : "border-line bg-white hover:border-accent"}`}>
              {tr(v, lang)}
            </Link>
          ))}
        </div>
        {videos.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{videos.map((v) => <VideoCard key={v.id} v={v} lang={lang} />)}</div>
        ) : (
          <Empty text={tr(UI.noItems, lang)} />
        )}
      </Container>
    </>
  );
}

export async function ReviewsPage({ section }: { section: Section }) {
  const [lang, reviews, user] = await Promise.all([getLang(), getTestimonials(section), getSession()]);
  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  return (
    <>
      <PageHero
        eyebrow={tr(SECTION_INFO[section].name, lang)}
        title={lang === "si" ? "ඔබගේ අදහස්" : "Reviews"}
        subtitle={lang === "si" ? "ඔබගේ අත්දැකීම අප සමඟ බෙදාගන්න" : "Share your experience with us"}
        icon={Star}
      />
      <Container className="grid gap-10 py-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {reviews.length > 0 && (
            <div className="card card-flat mb-8 flex items-center gap-5 p-5">
              <span className="font-display text-5xl text-accent">{avg.toFixed(1)}</span>
              <div>
                <Stars n={Math.round(avg)} size={20} />
                <p className="text-sm text-muted">{reviews.length} {lang === "si" ? "අදහස්" : "reviews"}</p>
              </div>
            </div>
          )}
          {reviews.length ? (
            <div className="grid gap-6 sm:grid-cols-2">{reviews.map((r) => <ReviewCard key={r.id} r={r} lang={lang} />)}</div>
          ) : (
            <Empty text={lang === "si" ? "පළමු අදහස ඔබ ලියන්න!" : "Be the first to write a review!"} />
          )}
        </div>
        <aside className="card card-flat h-fit p-6">
          <h2 className="mb-4 font-display text-2xl text-accent">{lang === "si" ? "අදහසක් ලියන්න" : "Write a review"}</h2>
          <ReviewForm section={section} lang={lang} defaultName={user?.name} isMember={!!user} />
        </aside>
      </Container>
    </>
  );
}

export async function CalendarPage({ section, month }: { section: Section; month?: string }) {
  const m = month && /^\d{4}-\d{2}$/.test(month) ? month : new Date().toISOString().slice(0, 7);
  const [lang, items, schedule] = await Promise.all([getLang(), getMonth(section, m), getSchedule(section, 15)]);
  const info = SECTION_INFO[section];
  const si = lang === "si";
  return (
    <>
      <PageHero eyebrow={tr(info.name, lang)} title={si ? "දින දර්ශනය" : "Calendar"} subtitle={si ? "මාසයේ සියලු වැඩසටහන්" : "All programmes of the month"} icon={CalendarRange} />
      <Container className="space-y-12 py-12">
        <CalendarView month={m} items={items} lang={lang} baseHref={`${info.base}/calendar`} />
        <section>
          <h2 className="mb-5 font-display text-2xl text-accent">{si ? "ඉදිරි වැඩසටහන් සටහන" : "Programme schedule"}</h2>
          <ProgrammePanel rows={schedule} lang={lang} registerHref={`${info.base}/sil`} />
        </section>
      </Container>
    </>
  );
}

export async function RegistrationPage({ section, eventId }: { section: Section; eventId?: number }) {
  const [lang, events, user] = await Promise.all([getLang(), getRegistrableEvents(section), getSession()]);
  const info = SECTION_INFO[section];
  const si = lang === "si";
  const options = events.map((e) => ({
    id: e.id,
    label: `${e.eventDate ? fmtDate(e.eventDate, lang) + " · " : e.schedule ? e.schedule + " · " : ""}${e.title}${e.startTime ? " · " + e.startTime : ""}`,
  }));
  return (
    <>
      <PageHero
        eyebrow={tr(info.name, lang)}
        title={si ? "සිල් සහ පූජා ලියාපදිංචිය" : "Sil & Puja Registration"}
        subtitle={si ? "පොහොය සිල් සමාදානය, බෝධි පූජා සහ අනෙකුත් වැඩසටහන් සඳහා ලියාපදිංචි වන්න" : "Register for Poya sil observance, Bodhi puja and other programmes"}
        icon={Flower2}
      />
      <Container className="grid gap-10 py-12 lg:grid-cols-5">
        <div className="card card-flat p-6 lg:col-span-3">
          <ProgrammeRegistrationForm lang={lang} events={options} selected={eventId} defaults={{ name: user?.name }} />
        </div>
        <aside className="space-y-4 lg:col-span-2">
          {events.slice(0, 5).map((e) => <EventCard key={e.id} ev={e} lang={lang} />)}
        </aside>
      </Container>
    </>
  );
}

export async function ContactPage({ section }: { section: Section }) {
  const [lang, user, st] = await Promise.all([getLang(), getSession(), getSettings(section)]);
  const info = SECTION_INFO[section];
  return (
    <>
      <PageHero eyebrow={tr(info.name, lang)} title={tr(UI.contactUs, lang)} icon={Mail} />
      <Container className="grid gap-10 py-12 lg:grid-cols-5">
        <div className="space-y-5 lg:col-span-2">
          <div className="card p-6">
            <h2 className="font-display text-xl text-accent">{tr(info.name, lang)}</h2>
            <p className="text-sm text-muted">{tr(TEMPLE.name, lang)}, {tr(TEMPLE.place, lang)}</p>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex gap-2"><MapPin size={18} className="shrink-0 text-accent" /> {st.address}</li>
              <li className="flex gap-2"><Phone size={18} className="shrink-0 text-accent" /> <a href={`tel:${st.phone}`} className="hover:underline">{st.phone}</a></li>
              <li className="flex gap-2"><Mail size={18} className="shrink-0 text-accent" /> <a href={`mailto:${st.email}`} className="hover:underline">{st.email}</a></li>
            </ul>
            <div className="mt-4"><SocialButtons settings={st} /></div>
          </div>
          <div className="tile-3d overflow-hidden">
            <iframe
              title="Map"
              className="h-72 w-full"
              loading="lazy"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(st.mapQuery)}&z=16&output=embed`}
            />
          </div>
        </div>
        <div className="card card-flat p-6 lg:col-span-3">
          <h2 className="mb-4 font-display text-2xl text-accent">{lang === "si" ? "පණිවිඩයක් එවන්න" : "Send us a message"}</h2>
          <ContactForm section={section} lang={lang} defaults={user ? { name: user.name, email: user.email } : undefined} />
        </div>
      </Container>
    </>
  );
}
