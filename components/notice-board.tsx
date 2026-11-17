import Link from "next/link";
import { BookOpen, CalendarDays, Landmark, Megaphone, Pin, Repeat, Sprout, Tag } from "lucide-react";
import { getEvents, getPosts, getUpcomingEvents } from "@/lib/data";
import { SECTION_INFO, tr, type Lang, type Section } from "@/lib/site";

const COLS: { s: Section; icon: typeof Landmark }[] = [
  { s: "temple", icon: Landmark },
  { s: "dhamma", icon: BookOpen },
  { s: "montessori", icon: Sprout },
];

/** Three side-by-side 3D boards: each section's notices + advertisements. */
export async function NoticeBoard({
  lang,
  stacked = false,
  sections,
  withActivities = false,
}: {
  lang: Lang;
  stacked?: boolean;
  sections?: Section[];
  withActivities?: boolean;
}) {
  const si = lang === "si";
  const cols = sections ? COLS.filter((c) => sections.includes(c.s)) : COLS;
  const data = await Promise.all(
    cols.map(async (c) => {
      const [all, upcoming, events] = await Promise.all([
        getPosts(c.s, { limit: 12 }),
        withActivities ? getUpcomingEvents(c.s, 3) : Promise.resolve([]),
        withActivities ? getEvents(c.s) : Promise.resolve([]),
      ]);
      return {
        ...c,
        notices: all.filter((p) => p.kind !== "advertisement").slice(0, 4),
        ads: all.filter((p) => p.kind === "advertisement").slice(0, 3),
        activities: upcoming.length ? upcoming : events.slice(0, 3),
      };
    })
  );
  const fmt = (d: string) => new Date(d + "T00:00:00").toLocaleDateString(si ? "si-LK" : "en-GB", { day: "numeric", month: "short" });

  return (
    <div className={`grid ${stacked ? "gap-6 sm:grid-cols-2 lg:grid-cols-1" : "gap-8 lg:grid-cols-3"}`}>
      {data.map(({ s, icon: Icon, notices, ads, activities }) => {
        const info = SECTION_INFO[s];
        return (
          <div key={s} data-section={s} className="card card-flat flex flex-col overflow-hidden">
            <div className="hero-bg relative overflow-hidden px-5 py-4 text-white">
              <Icon className="absolute -right-3 -top-3 h-24 w-24 text-white/10" />
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-flag-yellow">
                <Icon size={14} /> {tr(info.short, lang)}
              </p>
              <p className="text-3d font-display text-xl leading-tight">{tr(info.name, lang)}</p>
            </div>

            <div className="flex-1 space-y-2 p-4">
              <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent">
                <Megaphone size={14} /> {si ? "නිවේදන" : "Notices"}
              </p>
              {notices.length ? (
                notices.map((p) => (
                  <Link
                    key={p.id}
                    href={`${info.base}/notices`}
                    className="block rounded-xl border border-line bg-white p-3 shadow-[0_3px_0_var(--line)] transition hover:-translate-y-0.5 hover:border-accent"
                  >
                    <span className="flex items-center gap-2 text-[11px] text-muted">
                      {fmt(p.publishedAt)}
                      {p.pinned && <span className="inline-flex items-center gap-0.5 font-semibold text-accent-2"><Pin size={11} /> {si ? "වැදගත්" : "Important"}</span>}
                    </span>
                    <span className="mt-0.5 line-clamp-2 block text-sm font-semibold">{p.title}</span>
                    {p.body && <span className="mt-0.5 line-clamp-2 block text-xs text-muted">{p.body}</span>}
                  </Link>
                ))
              ) : (
                <p className="text-sm text-muted">{si ? "නිවේදන නොමැත" : "No notices"}</p>
              )}

              <p className="flex items-center gap-1.5 pt-3 text-xs font-bold uppercase tracking-wider text-accent-2">
                <Tag size={14} /> {si ? "දැන්වීම්" : "Advertisements"}
              </p>
              {ads.length ? (
                ads.map((p) => (
                  <Link
                    key={p.id}
                    href={`${info.base}/notices`}
                    className="flex gap-3 overflow-hidden rounded-xl bg-gradient-to-br from-accent-soft to-white p-3 shadow-[0_3px_0_var(--line)] ring-1 ring-accent-2/40 transition hover:-translate-y-0.5"
                  >
                    {p.imageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.imageUrl} alt="" className="h-14 w-14 shrink-0 rounded-lg object-cover" />
                    )}
                    <span className="min-w-0">
                      <span className="line-clamp-2 block text-sm font-semibold">{p.title}</span>
                      {p.body && <span className="line-clamp-2 block text-xs text-muted">{p.body}</span>}
                    </span>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-muted">{si ? "දැන්වීම් නොමැත" : "No advertisements"}</p>
              )}

              {withActivities && (
                <>
                  <p className="flex items-center gap-1.5 pt-3 text-xs font-bold uppercase tracking-wider text-accent">
                    <CalendarDays size={14} /> {si ? "ක්‍රියාකාරකම්" : "Activities"}
                  </p>
                  {activities.length ? (
                    activities.map((e) => (
                      <Link key={e.id} href={`${info.base}/activities`} className="flex items-center gap-3 rounded-xl bg-white p-2.5 shadow-[0_3px_0_var(--line)] transition hover:-translate-y-0.5">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-accent text-center text-[10px] font-bold leading-tight text-white">
                          {e.eventDate ? fmt(e.eventDate) : <Repeat size={16} />}
                        </span>
                        <span className="line-clamp-2 text-sm font-medium">{e.title}</span>
                      </Link>
                    ))
                  ) : (
                    <p className="text-sm text-muted">{si ? "ක්‍රියාකාරකම් නොමැත" : "No activities"}</p>
                  )}
                </>
              )}
            </div>
            <Link href={`${info.base}/notices`} className="border-t border-line px-4 py-3 text-center text-sm font-semibold text-accent hover:bg-accent-soft">
              {si ? "සියල්ල බලන්න" : "View all"} →
            </Link>
          </div>
        );
      })}
    </div>
  );
}
