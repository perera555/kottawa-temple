import Link from "next/link";
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

  const sectionFeeds = await Promise.all(
    (["dhamma", "montessori"] as const).map(async (k) => {
      const [n, up, all] = await Promise.all([getPosts(k, { limit: 3 }), getUpcomingEvents(k, 3), getEvents(k)]);
      return { k, notices: n, events: up.length ? up : all.slice(0, 3) };
    })
  );

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

      {/* MAIN: notices (left) + daily dana (right) */}
      <Container className="grid gap-10 pt-16 lg:grid-cols-[1fr_380px]">
        <div className="min-w-0 space-y-14">
          {/* Temple notices - the main section */}
          <section>
            <SectionTitle title={lang === "si" ? "විහාරස්ථාන නිවේදන" : "Temple Notices"} href="/notices" linkLabel={tr(UI.viewAll, lang)} />
            {notices.length ? (
              <div className="grid gap-5 md:grid-cols-2">{notices.map((p) => <PostCard key={p.id} post={p} lang={lang} />)}</div>
            ) : (
              <p className="text-muted">{tr(UI.noItems, lang)}</p>
            )}
          </section>

          {/* Dhamma School + Montessori - separate panels */}
          <section>
            <SectionTitle title={tr(UI.ourSections, lang)} sub={lang === "si" ? "දහම් පාසල සහ පෙර පාසලේ නිවේදන හා ක්‍රියාකාරකම්" : "Notices and activities from our Dhamma School and Montessori"} />
            <div className="grid gap-8">
          <div className="grid gap-8">
            {sectionFeeds.map(({ k, notices: sn, events: se }) => {
              const s = SECTION_INFO[k];
              return (
                <div key={k} data-section={k} className="tile-3d hero-bg group relative overflow-hidden p-6 text-white sm:p-8">
                  <DharmaWheel className="absolute -right-10 -top-10 h-48 w-48 text-white/10 transition duration-700 group-hover:rotate-90" />
                  <p className="text-sm uppercase tracking-[0.2em] text-flag-yellow">{tr(s.short, lang)}</p>
                  <h3 className="text-3d mt-1 font-display text-3xl">{tr(s.name, lang)}</h3>
                  <p className="mt-2 max-w-md text-white/85">{tr(s.tagline, lang)}</p>

                  <div className="relative mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white/12 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] backdrop-blur">
                      <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-flag-yellow">
                        <Megaphone size={14} /> {tr(UI.latestNotices, lang)}
                      </p>
                      {sn.length ? (
                        <ul className="space-y-2 text-sm">
                          {sn.map((p) => (
                            <li key={p.id}>
                              <Link href={`${s.base}/notices`} className="block rounded-lg px-2 py-1.5 hover:bg-white/10">
                                <span className="line-clamp-2 font-medium">{p.title}</span>
                                <span className="text-xs text-white/60">{p.publishedAt}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-white/60">{tr(UI.noItems, lang)}</p>
                      )}
                    </div>
                    <div className="rounded-2xl bg-white/12 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] backdrop-blur">
                      <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-flag-yellow">
                        <CalendarDays size={14} /> {lang === "si" ? "ක්‍රියාකාරකම්" : "Activities"}
                      </p>
                      {se.length ? (
                        <ul className="space-y-2 text-sm">
                          {se.map((e) => (
                            <li key={e.id}>
                              <Link href={`${s.base}/activities`} className="flex gap-2 rounded-lg px-2 py-1.5 hover:bg-white/10">
                                <span className="w-12 shrink-0 text-xs font-bold text-flag-yellow">
                                  {e.eventDate ? new Date(e.eventDate + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : "↻"}
                                </span>
                                <span className="line-clamp-2 font-medium">{e.title}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-white/60">{tr(UI.noItems, lang)}</p>
                      )}
                    </div>
                  </div>
                  <Link href={s.base} className="btn btn-gold relative mt-6">{tr(UI.visit, lang)} {tr(s.short, lang)} →</Link>
                </div>
              );
            })}
          </div>
            </div>
          </section>
        </div>

        {/* RIGHT SIDEBAR */}
        <aside className="space-y-8 lg:sticky lg:top-44 lg:self-start">
          <div>
            <SectionTitle title={lang === "si" ? "දෛනික දානය" : "Daily Dana"} href="/dana" linkLabel={lang === "si" ? "මාසය" : "Month"} />
            <TodayDana entries={dailyDana} lang={lang} compact />
          </div>
          <div>
            <SectionTitle title={tr(UI.upcoming, lang)} href="/activities" linkLabel={tr(UI.viewAll, lang)} />
            <div className="space-y-3">
              {(upcoming.length ? upcoming : regular).slice(0, 3).map((e) => (
                <Link key={e.id} href="/activities" className="card flex items-center gap-3 p-3">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-accent text-center leading-none text-white shadow-[0_3px_0_rgba(0,0,0,0.25)]">
                    {e.eventDate ? (
                      <span>
                        <span className="block text-lg font-bold">{new Date(e.eventDate + "T00:00:00").getDate()}</span>
                        <span className="text-[10px] uppercase">{new Date(e.eventDate + "T00:00:00").toLocaleDateString("en-GB", { month: "short" })}</span>
                      </span>
                    ) : (
                      <CalendarDays size={20} />
                    )}
                  </span>
                  <span className="min-w-0">
                    <span className="line-clamp-2 text-sm font-semibold">{e.title}</span>
                    <span className="text-xs text-muted">{e.startTime || e.schedule}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </Container>

      {/* PROGRAMME PANEL + CALENDAR */}
      <Container className="grid gap-10 pt-16 xl:grid-cols-[1.4fr_1fr]">
        <section>
          <SectionTitle
            title={lang === "si" ? "පිංකම් සටහන" : "Programme Schedule"}
            sub={lang === "si" ? "දානය, පොහොය සිල්, බෝධි පූජා සහ ධර්ම දේශනා" : "Dana hosts, Poya sil, Bodhi puja and Bana — who, when and where"}
            href="/calendar"
            linkLabel={tr(UI.viewAll, lang)}
          />
          <ProgrammePanel rows={schedule} lang={lang} registerHref="/sil" />
        </section>
        <section>
          <SectionTitle title={lang === "si" ? "දින දර්ශනය" : "Calendar"} href="/calendar" linkLabel={lang === "si" ? "විශාලව බලන්න" : "Full calendar"} />
          <CalendarView month={thisMonth} items={monthItems} lang={lang} baseHref="/calendar" />
        </section>
      </Container>

      {/* VIDEOS */}
      {videos.length > 0 && (
        <Container className="py-16">
          <SectionTitle title={lang === "si" ? "වීඩියෝ" : "Videos"} sub={lang === "si" ? "කඨින, බෝධි පූජා, බණ" : "Katina, Bodhi Puja, Bana"} href="/videos" linkLabel={tr(UI.viewAll, lang)} />
          <div className="grid gap-6 md:grid-cols-3">{videos.map((v) => <VideoCard key={v.id} v={v} lang={lang} />)}</div>
        </Container>
      )}

      {/* ADS */}
      {ads.length > 0 && (
        <Container className="pb-16">
          <SectionTitle title={tr(UI.advertisements, lang)} />
          <div className="grid gap-6 md:grid-cols-2">{ads.map((p) => <PostCard key={p.id} post={p} lang={lang} />)}</div>
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