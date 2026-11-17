import Link from "next/link";
import { Check, Gift, Megaphone, Palette, Sparkles } from "lucide-react";
import { Hero3D } from "@/components/three/hero-3d";
import { Container, EventCard, Img, PostCard, ReviewCard, SectionTitle } from "@/components/ui";
import { getEvents, getGallery, getPosts, getTestimonials } from "@/lib/data";
import { getLang } from "@/lib/lang";
import { SECTION_INFO, TEMPLE, tr, UI } from "@/lib/site";

export const metadata = { title: "Udaya Lama Uyana Pre School" };

const BENEFITS = {
  en: [
    "There is no admission fee required to enroll your child in our preschool.",
    "Free school uniforms are provided to every child.",
    "All essential school books are given completely free of charge.",
    "Nutritious meals are provided free of charge on selected days.",
    "Educational trips and outdoor learning activities are organized regularly.",
    "Every child receives a special birthday gift from the school.",
    "A complete set of books and a school bag are provided in the first year.",
    "Special benefits and celebrations are arranged for Children's Day.",
    "Each child receives a savings benefit of Rs.1000 at the end of the year.",
  ],
  si: [
    "දරුවා ඇතුළත් කිරීම සඳහා කිසිදු ගාස්තුවක් අය නොකෙරේ.",
    "සෑම දරුවෙකුටම නිල ඇඳුම් නොමිලේ ලබා දේ.",
    "පාසල් පොත් සියල්ලම නොමිලේ සපයනු ලැබේ.",
    "පෝෂණීය ආහාර නියමිත දිනවල නොමිලේ ලබා දේ.",
    "අධ්‍යාපන චාරිකා සහ බාහිර ක්‍රියාකාරකම් සංවිධානය කරයි.",
    "සෑම දරුවෙකුටම උපන්දිනයට විශේෂ තෑග්ගක් ලබා දේ.",
    "පළමු වසර සඳහා පොත් සහ පාසල් බෑගයක් ලබා දේ.",
    "ළමා දිනයට විශේෂ වැඩසටහන් සකස් කරයි.",
    "වසර අවසානයේ රු.1000 ඉතිරිකිරීමක් ලබා දේ.",
  ],
};

const PROGRAMS = {
  en: ["Learning through play activities", "Developing thinking and problem-solving skills", "Creative arts, music and storytelling", "Good habits, manners and Buddhist values"],
  si: ["ක්‍රීඩා මඟින් ඉගෙනීම", "සිතීමේ හැකියාව වර්ධනය කිරීම", "නිර්මාණශීලී කලාව සහ සංගීතය", "යහපත් පුරුදු සහ බෞද්ධ සාරධර්ම"],
};

export default async function MontessoriHome() {
  const [lang, notices, events, gallery, reviews] = await Promise.all([
    getLang(),
    getPosts("montessori", { limit: 3 }),
    getEvents("montessori"),
    getGallery("montessori", 8),
    getTestimonials("montessori"),
  ]);
  const info = SECTION_INFO.montessori;
  const si = lang === "si";

  return (
    <>
      <section className="hero-bg relative overflow-hidden text-white">
        <div className="pointer-events-none absolute inset-0">
          {["left-[8%] top-[18%] h-16 w-16 bg-flag-yellow/80", "right-[12%] top-[14%] h-24 w-24 bg-flag-orange/70", "left-[40%] bottom-[10%] h-12 w-12 bg-white/50", "right-[30%] bottom-[18%] h-20 w-20 bg-flag-blue/60"].map((c) => (
            <span key={c} className={`float-3d absolute rounded-full shadow-[inset_-8px_-10px_20px_rgba(0,0,0,0.25),inset_6px_6px_14px_rgba(255,255,255,0.5),0_20px_30px_-10px_rgba(0,0,0,0.4)] ${c}`} />
          ))}
        </div>
        <Hero3D variant="montessori" className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto h-full max-w-xl opacity-35" />
        <Container className="relative py-20 text-center sm:py-28">
          <p className="text-sm uppercase tracking-[0.2em] text-flag-yellow">{tr(TEMPLE.name, lang)}, {tr(TEMPLE.place, lang)}</p>
          <h1 className="text-3d mt-3 font-display text-4xl sm:text-6xl">🌱 {tr(info.name, lang)}</h1>
          <p className="mt-4 text-lg text-white/90">{tr(info.tagline, lang)}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/montessori/contact" className="btn btn-gold">{si ? "ඇතුළත් කිරීම් විමසන්න" : "Ask about admissions"}</Link>
            <Link href="/montessori/about" className="btn btn-ghost">{si ? "අප ගැන" : "About us"}</Link>
          </div>
        </Container>
      </section>

      <Container className="relative z-10 -mt-12 grid gap-6 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2" style={{ background: "linear-gradient(180deg,#fffbe6,#fff)" }}>
          <h2 className="mb-4 flex items-center gap-2 font-display text-2xl text-[#9a6b00]"><Gift /> {si ? "ප්‍රධාන ප්‍රතිලාභ" : "Principal Benefits"}</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {BENEFITS[lang].map((b) => (
              <li key={b} className="flex gap-2 rounded-xl bg-white p-3 text-sm shadow-[0_3px_0_var(--line)]">
                <Check size={18} className="mt-0.5 shrink-0 text-accent" /> {b}
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="mb-4 flex items-center gap-2 font-display text-2xl text-accent"><Palette /> {si ? "වැඩසටහන්" : "Programs"}</h2>
            <ul className="space-y-2">
              {PROGRAMS[lang].map((p) => (
                <li key={p} className="flex gap-2 text-sm"><Sparkles size={16} className="mt-0.5 shrink-0 text-accent-2" /> {p}</li>
              ))}
            </ul>
          </div>
          <div className="card p-6" style={{ background: "linear-gradient(180deg,#fff1f0,#fff)" }}>
            <h2 className="mb-3 flex items-center gap-2 font-display text-2xl text-flag-red"><Megaphone /> {si ? "නිවේදනය" : "Announcement"}</h2>
            {notices[0] ? (
              <div>
                <p className="font-semibold">{notices[0].title}</p>
                <p className="prose-text mt-1 text-sm text-muted">{notices[0].body}</p>
              </div>
            ) : (
              <p className="text-sm text-muted">{si ? "නිවේදන නොමැත" : "No announcements"}</p>
            )}
          </div>
        </div>
      </Container>

      <Container className="grid gap-12 py-16 lg:grid-cols-2">
        <section>
          <SectionTitle title={si ? "ක්‍රියාකාරකම්" : "Activities"} href="/montessori/activities" linkLabel={tr(UI.viewAll, lang)} />
          {events.length ? <div className="space-y-4">{events.slice(0, 4).map((e) => <EventCard key={e.id} ev={e} lang={lang} />)}</div> : <p className="text-muted">{tr(UI.noItems, lang)}</p>}
        </section>
        <section>
          <SectionTitle title={tr(UI.latestNotices, lang)} href="/montessori/notices" linkLabel={tr(UI.viewAll, lang)} />
          {notices.length ? <div className="space-y-5">{notices.map((p) => <PostCard key={p.id} post={p} lang={lang} />)}</div> : <p className="text-muted">{tr(UI.noItems, lang)}</p>}
        </section>
      </Container>

      {gallery.length > 0 && (
        <Container className="pb-16">
          <SectionTitle title={si ? "🎉 විශේෂ අවස්ථා" : "🎉 Special Events"} href="/montessori/gallery" linkLabel={tr(UI.viewAll, lang)} />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {gallery.map((g) => (
              <Link key={g.id} href="/montessori/gallery" className="tile-3d overflow-hidden">
                <Img src={g.imageUrl} alt={g.title} className="aspect-square w-full" />
              </Link>
            ))}
          </div>
        </Container>
      )}

      <section className="bg-paper-2 py-16">
        <Container>
          <SectionTitle title={si ? "💬 මව්පිය අදහස්" : "💬 What Parents Say"} href="/montessori/reviews" linkLabel={si ? "අදහසක් ලියන්න" : "Write a review"} />
          {reviews.length ? (
            <div className="grid gap-6 md:grid-cols-3">{reviews.slice(0, 3).map((r) => <ReviewCard key={r.id} r={r} lang={lang} />)}</div>
          ) : (
            <p className="text-muted">{si ? "තවම අදහස් නොමැත" : "No reviews yet"}</p>
          )}
        </Container>
      </section>
    </>
  );
}
