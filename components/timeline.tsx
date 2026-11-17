import { Clock, MapPin, Mic, UserRound } from "lucide-react";
import { EVENT_CATEGORIES, tr, type Lang } from "@/lib/site";
import { AgendaTable, parseAgenda } from "./agenda-view";

type Ev = {
  id: number;
  title: string;
  description: string;
  category: string;
  eventDate: string | null;
  startTime: string;
  endTime: string;
  location: string;
  host: string;
  preacher: string;
  preacherFrom: string;
  agenda: string;
  imageUrl: string;
};

const COLORS: Record<string, [string, string]> = {
  dana: ["#ffb347", "#a3410a"],
  pirith: ["#5b8def", "#0f2a63"],
  bodhi_puja: ["#6ccf8a", "#14421f"],
  poya: ["#ffe17a", "#8a5f00"],
  sil: ["#ffe17a", "#8a5f00"],
  bana: ["#b5524f", "#4a0c0c"],
  kathina: ["#ef5b62", "#7a0f14"],
  children: ["#7ad3e8", "#145a6b"],
};
const color = (c: string) => COLORS[c] ?? ["#c9a27a", "#5a3a1f"];

/** One month: 3D banner + day-by-day timeline. */
export function MonthTimeline({ id, label, events, lang }: { id: string; label: string; events: Ev[]; lang: Lang }) {
  const si = lang === "si";
  const today = new Date().toISOString().slice(0, 10);
  return (
    <section id={id} className="scroll-mt-40">
      {/* Month banner */}
      <div className="hero-bg tile-3d relative mb-8 flex items-end justify-between overflow-hidden px-6 py-5 text-white">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-flag-yellow">{si ? "මාසික වැඩසටහන" : "Monthly programme"}</p>
          <h3 className="text-3d font-display text-3xl sm:text-4xl">{label}</h3>
        </div>
        <span className="rounded-2xl bg-white/15 px-4 py-2 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] backdrop-blur">
          <span className="block font-display text-3xl leading-none">{events.length}</span>
          <span className="text-xs">{si ? "වැඩසටහන්" : "programmes"}</span>
        </span>
      </div>

      {/* Timeline */}
      <ol className="relative space-y-6 border-l-4 border-dashed border-line pl-0 sm:ml-12">
        {events.map((e) => {
          const d = new Date(e.eventDate + "T00:00:00");
          const [c1, c2] = color(e.category);
          const past = (e.eventDate ?? "") < today;
          const isToday = e.eventDate === today;
          return (
            <li key={e.id} className={`relative pl-20 sm:pl-24 ${past ? "opacity-60" : ""}`}>
              {/* 3D date badge on the line */}
              <span
                className="absolute -left-[2px] top-0 grid h-[72px] w-[72px] -translate-x-1/2 place-items-center rounded-2xl text-center leading-none text-white sm:h-20 sm:w-20"
                style={{
                  background: `linear-gradient(160deg, ${c1}, ${c2})`,
                  boxShadow: `inset 0 2px 0 rgba(255,255,255,.4), 0 6px 0 ${c2}, 0 16px 24px -10px ${c2}`,
                }}
              >
                <span>
                  <span className="block text-[10px] uppercase tracking-wider opacity-90">{d.toLocaleDateString(si ? "si-LK" : "en-GB", { weekday: "short" })}</span>
                  <span className="text-3d block text-3xl font-bold">{d.getDate()}</span>
                  <span className="block text-[10px] uppercase">{d.toLocaleDateString("en-GB", { month: "short" })}</span>
                </span>
              </span>

              <article className={`card overflow-hidden ${isToday ? "ring-4 ring-flag-yellow" : ""}`}>
                <div className="flex flex-col sm:flex-row">
                  <div className="min-w-0 flex-1 p-5">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <span className="rounded-full px-2.5 py-0.5 text-[11px] font-bold text-white" style={{ background: c2 }}>
                        {tr(EVENT_CATEGORIES[e.category] ?? EVENT_CATEGORIES.other, lang)}
                      </span>
                      {isToday && <span className="rounded-full bg-flag-yellow px-2.5 py-0.5 text-[11px] font-bold text-[#3b2300]">{si ? "අද" : "TODAY"}</span>}
                    </div>
                    <h4 className="text-lg font-semibold">{e.title}</h4>
                    {e.description && <p className="prose-text mt-1 text-sm text-muted">{e.description}</p>}
                    <div className="mt-3 grid gap-x-5 gap-y-1.5 text-sm sm:grid-cols-2">
                      {(e.startTime || e.endTime) && (
                        <p className="flex items-center gap-1.5"><Clock size={15} className="text-accent-2" /> {[e.startTime, e.endTime].filter(Boolean).join(" – ")}</p>
                      )}
                      {e.location && <p className="flex items-center gap-1.5"><MapPin size={15} className="text-accent-2" /> {e.location}</p>}
                      {e.host && <p className="flex items-center gap-1.5"><UserRound size={15} className="text-accent-2" /> <span><b>{si ? "දායකත්වය" : "Host"}:</b> {e.host}</span></p>}
                      {e.preacher && (
                        <p className="flex items-center gap-1.5"><Mic size={15} className="text-accent-2" /> <span><b>{si ? "දේශනා" : "Bana"}:</b> {e.preacher}{e.preacherFrom && ` (${e.preacherFrom})`}</span></p>
                      )}
                    </div>
                    <AgendaTable items={parseAgenda(e.agenda)} lang={lang} />
                  </div>
                  {e.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={e.imageUrl} alt="" className="h-48 w-full object-cover sm:h-auto sm:w-56" />
                  )}
                </div>
              </article>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
