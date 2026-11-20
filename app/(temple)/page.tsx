import Link from "next/link";
import { SocialFeed } from "@/components/social";
import {
  Baby,
  BadgeCheck,
  BookOpenText,
  CalendarDays,
  CalendarHeart,
  Flower2,
  GraduationCap,
  HandHeart,
  Images,
  Mail,
  Megaphone,
  PlayCircle,
  Sprout,
  Star,
  Sun,
} from "lucide-react";
import { DharmaWheel } from "@/components/dharma-wheel";
import { Container, EventCard, Img, PostCard, ReviewCard, SectionTitle } from "@/components/ui";
import { VideoCard } from "@/components/video-card";
import { CalendarView, ProgrammePanel } from "@/components/programme";
import { Hero3D } from "@/components/three/hero-3d";
import { TodayDana } from "@/components/daily-dana";
import { GalleryShowcase } from "@/components/gallery-showcase";
import { NoticeBoard } from "@/components/notice-board";
import { PinkamBoard } from "@/components/pinkam-board";
import { getDailyDana, getEvents, getGallery, getMonth, getPosts, getRegularEvents, getSchedule, getTestimonials, getUpcomingEvents, getVideos } from "@/lib/data";
import { getLang } from "@/lib/lang";
import { SECTION_INFO, TEMPLE, tr, UI } from "@/lib/site";

/** Buddhist-flag inspired gradients for the feature tiles: [light, base, deep] */
const FEATURE_COLORS: [string, string, string][] = [
  ["#ffb347", "#ec7a1c", "#a3410a"], // orange
  ["#5b8def", "#1f4ea3", "#0f2a63"], // blue
  ["#ffe17a", "#e2a614", "#8a5f00"], // yellow
  ["#ef5b62", "#c8242b", "#7a0f14"], // red
  ["#b5524f", "#8a1e1e", "#4a0c0c"], // maroon
  ["#6ccf8a", "#2c7a3f", "#14421f"], // green
];

export default async function TempleHome() {
  const thisMonth = new Date().toISOString().slice(0, 7);
  const [lang, notices, ads, upcoming, regular, gallery, videos, reviews, schedule, monthItems, dailyDana] = await Promise.all([
    getLang(),
    getPosts("temple", { kind: "notice", limit: 3 }),
    getPosts("temple", { kind: "advertisement", limit: 2 }),
    getUpcomingEvents("temple", 4),
    getRegularEvents("temple"),
    getGallery("temple", 8),
    getVideos("temple", { limit: 3 }),
    getTestimonials("temple"),
    getSchedule("temple", 8),
    getMonth("temple", thisMonth),
    getDailyDana(new Date().toISOString().slice(0, 10), new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10)),
  ]);

  const pinkam = (await getEvents("temple")).map((e) => ({
    id: e.id,
    title: e.title,
    category: e.category,
    eventDate: e.eventDate,
    startTime: e.startTime,
    endTime: e.endTime,
    schedule: e.schedule,
    host: e.host,
    preacher: e.preacher,
    preacherFrom: e.preacherFrom,
    location: e.location,
    allowRegistration: e.allowRegistration,
  }));

  const services = [
    { icon: HandHeart, title: { en: "Dana", si: "දාන" }, text: { en: "Offer alms to the Maha Sangha - book your date online.", si: "මහා සංඝරත්නයට දානය පූජා කිරීමට දිනයක් වෙන්කරගන්න." }, href: "/dana" },
    { icon: BookOpenText, title: { en: "Pirith", si: "පිරිත්" }, text: { en: "Pirith chanting for blessings at the temple or your home.", si: "විහාරයේ හෝ නිවසේ පිරිත් දේශනා." }, href: "/activities?category=pirith" },
    { icon: Flower2, title: { en: "Bodhi Puja", si: "බෝධි පූජා" }, text: { en: "Offerings at the sacred Bodhi tree for health and protection.", si: "සෞඛ්‍යය සහ ආරක්ෂාව පතා බෝධි පූජා." }, href: "/activities?category=bodhi_puja" },
    { icon: Sun, title: { en: "Poya & Sil", si: "පොහොය සහ සිල්" }, text: { en: "Observe sil, meditation and Dhamma talks every Poya day.", si: "සෑම පොහොය දිනකම සිල් සමාදානය සහ භාවනා." }, href: "/activities?category=poya" },
  ];

  const features = [
    { icon: CalendarDays, title: { en: "Monthly Activities", si: "මාසික වැඩසටහන්" }, text: { en: "Every programme of the month at a glance.", si: "මාසයේ සියලු වැඩසටහන්." }, href: "/activities" },
    { icon: PlayCircle, title: { en: "Videos", si: "වීඩියෝ" }, text: { en: "Katina, Bodhi Puja and Bana videos.", si: "කඨින, බෝධි පූජා, බණ වීඩියෝ." }, href: "/videos" },
    { icon: Megaphone, title: { en: "Notices & Ads", si: "නිවේදන සහ දැන්වීම්" }, text: { en: "Latest announcements from the temple.", si: "විහාරස්ථානයේ නවතම නිවේදන." }, href: "/notices" },
    { icon: Images, title: { en: "Gallery", si: "ඡායාරූප" }, text: { en: "Photos from our pinkam and events.", si: "පිංකම් සහ උත්සව ඡායාරූප." }, href: "/gallery" },
    { icon: Star, title: { en: "Reviews", si: "අදහස්" }, text: { en: "Read and write reviews.", si: "අදහස් කියවන්න සහ ලියන්න." }, href: "/reviews" },
    { icon: GraduationCap, title: { en: "Dhamma School", si: "දහම් පාසල" }, text: { en: "Siri Saddharmodaya Sunday Dhamma School.", si: "සිරි සද්ධර්මෝදය ඉරිදා දහම් පාසල." }, href: "/dhamma-school", section: "dhamma" },
    { icon: Baby, title: { en: "Pre School", si: "පෙර පාසල" }, text: { en: "Udaya Lama Uyana Montessori.", si: "උදය ළමා උයන පෙර පාසල." }, href: "/montessori", section: "montessori" },
    { icon: BadgeCheck, title: { en: "Membership", si: "සාමාජිකත්වය" }, text: { en: "Register and get your membership number.", si: "ලියාපදිංචි වී සාමාජික අංකය ලබාගන්න." }, href: "/register" },
    { icon: Mail, title: { en: "Contact & Map", si: "සම්බන්ධ වන්න" }, text: { en: "Send a message or find the temple.", si: "පණිවිඩයක් එවන්න හෝ විහාරය සොයාගන්න." }, href: "/contact" },
  ];

  return (
    <>
      {/* HERO */}
      <section className="hero-bg relative overflow-hidden text-white">
        <DharmaWheel className="spin-slow pointer-events-none absolute -left-32 -bottom-40 h-[28rem] w-[28rem] text-white/5" />
        <Container className="relative grid items-center gap-10 py-16 sm:py-20 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm text-flag-yellow backdrop-blur">
              <Sprout size={16} /> {tr(TEMPLE.place, lang)}
            </p>
            <h1 className="text-3d font-display text-4xl leading-tight sm:text-5xl xl:text-[3.6rem]">{tr(TEMPLE.name, lang)}</h1>
            <p className="mt-2 font-display text-xl text-white/80 sm:text-2xl">{lang === "si" ? TEMPLE.name.en : TEMPLE.name.si}</p>
            <p className="mt-5 max-w-xl text-lg text-white/85">{tr(SECTION_INFO.temple.tagline, lang)}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/dana" className="btn btn-gold">{lang === "si" ? "දානයක් වෙන්කරන්න" : "Book a Dana"}</Link>
              <Link href="/activities" className="btn btn-ghost">{lang === "si" ? "පිංකම් බලන්න" : "See activities"}</Link>
            </div>
          </div>
          <Hero3D variant="temple" className="mx-auto aspect-square w-full max-w-[520px]" />
        </Container>
      </section>

      {/* SERVICES */}
      <Container className="relative z-10 -mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((s) => (
          <Link key={s.href} href={s.href} className="card group p-6">
            <span className="depth-3d mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-accent-2 to-accent text-white shadow-lg">
              <s.icon size={24} />
            </span>
            <h3 className="font-display text-xl text-accent">{tr(s.title, lang)}</h3>
            <p className="mt-1 text-sm text-muted">{tr(s.text, lang)}</p>
          </Link>
        ))}
      </Container>

      {/* ALL FEATURES */}
      <Container className="pt-16">
        <SectionTitle title={lang === "si" ? "අපගේ සේවා" : "Explore"} sub={lang === "si" ? "වෙබ් අඩවියේ සියලු සේවා" : "Everything on our website"} />
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
          {features.map((f, i) => {
            const palette = FEATURE_COLORS[i % FEATURE_COLORS.length];
            return (
              <Link
                key={f.href}
                href={f.href}
                className={`feature-3d group ${i === 0 ? "md:col-span-2 md:row-span-2" : ""}`}
                style={{ "--f1": palette[0], "--f2": palette[1], "--f3": palette[2] } as React.CSSProperties}
              >
                <span className="feature-orb" />
                <span className={`feature-icon ${i === 0 ? "h-24 w-24" : "h-16 w-16"}`}>
                  <f.icon size={i === 0 ? 48 : 30} strokeWidth={1.8} />
                </span>
                <span className="relative mt-auto block">
                  <span className={`text-3d block font-display ${i === 0 ? "text-3xl sm:text-4xl" : "text-xl"}`}>{tr(f.title, lang)}</span>
                  <span className={`mt-1 block text-white/85 ${i === 0 ? "text-base" : "text-xs"}`}>{tr(f.text, lang)}</span>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-white/90 transition group-hover:gap-2">
                    {lang === "si" ? "පිවිසෙන්න" : "Open"} →
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </Container>

      {/* THREE COLUMNS: notices (left) · pinkam (middle) · daily dana (right) */}
      <Container className="grid gap-8 pt-16 lg:grid-cols-[300px_1fr] xl:grid-cols-[300px_1fr_340px] max-w-[1500px]!">
        {/* LEFT: notice board */}
        <aside className="order-2 space-y-4 lg:order-1">
          <SectionTitle title={lang === "si" ? "විහාරස්ථාන නිවේදන" : "Temple Notices"} href="/notices" linkLabel={tr(UI.viewAll, lang)} />
          <NoticeBoard lang={lang} sections={["temple"]} stacked withActivities />
        </aside>

        {/* MIDDLE: main */}
        <div className="order-1 min-w-0 space-y-14 lg:order-2">
          <section>
            <SectionTitle
              title={lang === "si" ? "දෛනික දානය" : "Daily Dana"}
              sub={lang === "si" ? "උදේ, දවල් සහ හවස දාන දායකයින්" : "Morning, noon and evening dana donors"}
              href="/dana"
              linkLabel={lang === "si" ? "මාසයේ ලැයිස්තුව" : "Whole month"}
            />
            <TodayDana entries={dailyDana} lang={lang} />
          </section>
          <section>
            <SectionTitle
              title={lang === "si" ? "පිංකම්" : "Pinkam"}
              sub={lang === "si" ? "දාන, පිරිත්, බෝධි පූජා, පොහොය සිල් සහ බණ" : "Dana, Pirith, Bodhi Puja, Poya Sil and Bana"}
              href="/activities"
              linkLabel={tr(UI.viewAll, lang)}
            />
            <PinkamBoard items={pinkam} lang={lang} />
          </section>
          <section>
            <SectionTitle
              title={lang === "si" ? "පිංකම් සටහන" : "Programme Schedule"}
              sub={lang === "si" ? "දායකත්වය, ධර්ම දේශනාව සහ වේලාව" : "Who hosts, who preaches, and when"}
              href="/calendar"
              linkLabel={tr(UI.viewAll, lang)}
            />
            <ProgrammePanel rows={schedule} lang={lang} registerHref="/sil" />
          </section>
          <section>
            <SectionTitle title={lang === "si" ? "දින දර්ශනය" : "Calendar"} href="/calendar" linkLabel={lang === "si" ? "විශාලව බලන්න" : "Full calendar"} />
            <CalendarView month={thisMonth} items={monthItems} lang={lang} baseHref="/calendar" />
          </section>
        </div>

        {/* RIGHT: daily dana + Dhamma School + Montessori (separate) */}
        <aside className="order-3 space-y-8 lg:col-span-2 xl:col-span-1">
          <div>
            <SectionTitle title={lang === "si" ? "දහම් පාසල සහ පෙර පාසල" : "Dhamma School & Montessori"} />
            <NoticeBoard lang={lang} sections={["dhamma", "montessori"]} stacked withActivities />
          </div>
        </aside>
      </Container>

      {/* VIDEOS */}
      {videos.length > 0 && (
        <Container className="py-16">
          <SectionTitle title={lang === "si" ? "වීඩියෝ" : "Videos"} sub={lang === "si" ? "කඨින, බෝධි පූජා, බණ" : "Katina, Bodhi Puja, Bana"} href="/videos" linkLabel={tr(UI.viewAll, lang)} />
          <div className="grid gap-6 md:grid-cols-3">{videos.map((v) => <VideoCard key={v.id} v={v} lang={lang} />)}</div>
        </Container>
      )}

      {/* GALLERY - separate section, one 3D album per section */}
      <section className="py-16">
        <Container>
          <SectionTitle
            title={tr(UI.gallery, lang)}
            sub={lang === "si" ? "විහාරය, දහම් පාසල සහ පෙර පාසලේ ඡායාරූප" : "Photos from the temple, Dhamma School and Montessori"}
          />
          <GalleryShowcase lang={lang} />
          {gallery.length > 0 && (
            <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4">
              {gallery.slice(0, 4).map((g) => (
                <Link key={g.id} href="/gallery" className="tile-3d overflow-hidden">
                  <Img src={g.imageUrl} alt={g.title} className="aspect-square w-full" />
                </Link>
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* SOCIAL MEDIA - Facebook & YouTube update automatically */}
      <section className="py-16">
        <Container>
          <SectionTitle
            title={lang === "si" ? "සමාජ මාධ්‍ය" : "Social Media"}
            sub={lang === "si" ? "Facebook සහ YouTube හි නවතම පළකිරීම් - ස්වයංක්‍රීයව යාවත්කාලීන වේ" : "Our latest Facebook and YouTube posts — updated automatically"}
            href="/live"
            linkLabel={lang === "si" ? "🔴 සජීවී" : "🔴 Live"}
          />
          <SocialFeed section="temple" lang={lang} compact />
        </Container>
      </section>
      {/* REVIEWS */}
      <section className="bg-paper-2 py-16">
        <Container>
          <SectionTitle title={lang === "si" ? "බැතිමතුන්ගේ අදහස්" : "What devotees say"} href="/reviews" linkLabel={lang === "si" ? "අදහසක් ලියන්න" : "Write a review"} />
          {reviews.length ? (
            <div className="grid gap-6 md:grid-cols-3">{reviews.slice(0, 3).map((r) => <ReviewCard key={r.id} r={r} lang={lang} />)}</div>
          ) : (
            <p className="text-muted">{lang === "si" ? "පළමු අදහස ඔබ ලියන්න!" : "Be the first to write a review!"}</p>
          )}
        </Container>
      </section>

      {/* MEMBERSHIP CTA */}
      <section className="hero-bg py-16 text-center text-white">
        <Container>
          <CalendarHeart className="mx-auto mb-4 text-flag-yellow" size={40} />
          <h2 className="text-3d font-display text-3xl sm:text-4xl">{lang === "si" ? "විහාරයේ සාමාජිකයෙකු වන්න" : "Become a member of the temple"}</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/85">
            {lang === "si"
              ? "ලියාපදිංචි වී ඔබගේ සාමාජික අංකය ලබාගන්න. ඔබගේ දාන වෙන්කිරීම් සහ පණිවිඩ එකම තැනකින් බලන්න."
              : "Register to receive your membership number and keep track of your dana bookings and messages."}
          </p>
          <Link href="/register" className="btn btn-gold mt-6">{lang === "si" ? "ලියාපදිංචි වන්න" : "Register now"}</Link>
        </Container>
      </section>
    </>
  );
}