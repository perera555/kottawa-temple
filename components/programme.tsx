import Link from "next/link";
import { ChevronLeft, ChevronRight, Clock, HandHeart, Mic, UserRound } from "lucide-react";
import { EVENT_CATEGORIES, tr, type Lang } from "@/lib/site";

const CAT_COLORS: Record<string, string> = {
  dana: "bg-flag-orange",
  breakfast: "bg-flag-orange",
  noon: "bg-flag-orange",
  pirith: "bg-flag-blue",
  bodhi_puja: "bg-green-600",
  poya: "bg-flag-yellow text-[#3b2300]",
  sil: "bg-flag-yellow text-[#3b2300]",
  bana: "bg-accent",
  meditation: "bg-purple-600",
  kathina: "bg-flag-red",
};
const catColor = (c: string) => CAT_COLORS[c] ?? "bg-gray-500";
const catLabel = (c: string, lang: Lang) => tr(EVENT_CATEGORIES[c] ?? { en: "Dana", si: "දානය" }, lang);

type Row = {
  key: string;
  date: string;
  title: string;
  category: string;
  time: string;
  host: string;
  preacher: string;
  preacherFrom: string;
  location: string;
  eventId: number | null;
  allowRegistration: boolean;
};

/** "Pinkam schedule" panel: date · programme · host · bana by · time */
export function ProgrammePanel({ rows, lang, registerHref }: { rows: Row[]; lang: Lang; registerHref?: string }) {
  const si = lang === "si";
  if (!rows.length) return <p className="text-muted">{si ? "ඉදිරි වැඩසටහන් නොමැත." : "No upcoming programmes."}</p>;
  return (
    <div className="card card-flat overflow-hidden">
      {/* Desktop table */}
      <table className="hidden w-full text-left text-sm md:table">
        <thead className="hero-bg text-xs uppercase tracking-wider text-white">
          <tr>
            <th className="px-4 py-3">{si ? "දිනය" : "Date"}</th>
            <th className="px-4 py-3">{si ? "වැඩසටහන" : "Programme"}</th>
            <th className="px-4 py-3">{si ? "දායකත්වය" : "Hosted by (Dayaka)"}</th>
            <th className="px-4 py-3">{si ? "ධර්ම දේශනාව" : "Bana by"}</th>
            <th className="px-4 py-3">{si ? "වේලාව" : "Time"}</th>
            {registerHref && <th className="px-4 py-3" />}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((r) => {
            const d = new Date(r.date + "T00:00:00");
            return (
              <tr key={r.key} className="transition hover:bg-accent-soft/50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white text-center leading-none shadow-[0_3px_0_var(--line),0_6px_12px_-6px_rgba(0,0,0,0.3)]">
                      <span>
                        <span className="block text-lg font-bold text-accent">{d.getDate()}</span>
                        <span className="text-[10px] uppercase text-muted">{d.toLocaleDateString("en-GB", { month: "short" })}</span>
                      </span>
                    </span>
                    <span className="text-xs text-muted">{d.toLocaleDateString(si ? "si-LK" : "en-GB", { weekday: "long" })}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`mb-1 inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold text-white ${catColor(r.category)}`}>{catLabel(r.category, lang)}</span>
                  <p className="font-semibold">{r.title}</p>
                  {r.location && <p className="text-xs text-muted">{r.location}</p>}
                </td>
                <td className="px-4 py-3">{r.host || <span className="text-muted">—</span>}</td>
                <td className="px-4 py-3">
                  {r.preacher ? (
                    <>
                      <p className="font-medium">{r.preacher}</p>
                      {r.preacherFrom && <p className="text-xs text-muted">{r.preacherFrom}</p>}
                    </>
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </td>
                <td className="whitespace-nowrap px-4 py-3">{r.time || <span className="text-muted">—</span>}</td>
                {registerHref && (
                  <td className="px-4 py-3 text-right">
                    {r.allowRegistration && r.eventId && (
                      <Link href={`${registerHref}?event=${r.eventId}`} className="btn btn-primary py-1.5! text-xs">{si ? "ලියාපදිංචි වන්න" : "Register"}</Link>
                    )}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Mobile cards */}
      <ul className="divide-y divide-line md:hidden">
        {rows.map((r) => (
          <li key={r.key} className="p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold text-accent">{new Date(r.date + "T00:00:00").toLocaleDateString(si ? "si-LK" : "en-GB", { weekday: "short", day: "numeric", month: "short" })}</span>
              <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold text-white ${catColor(r.category)}`}>{catLabel(r.category, lang)}</span>
            </div>
            <p className="mt-1 font-semibold">{r.title}</p>
            <div className="mt-1 space-y-0.5 text-sm text-muted">
              {r.host && <p className="flex items-center gap-1.5"><HandHeart size={14} /> {r.host}</p>}
              {r.preacher && <p className="flex items-center gap-1.5"><Mic size={14} /> {r.preacher}{r.preacherFrom && `, ${r.preacherFrom}`}</p>}
              {r.time && <p className="flex items-center gap-1.5"><Clock size={14} /> {r.time}</p>}
            </div>
            {registerHref && r.allowRegistration && r.eventId && (
              <Link href={`${registerHref}?event=${r.eventId}`} className="btn btn-primary mt-2 py-1.5! text-xs">{si ? "ලියාපදිංචි වන්න" : "Register"}</Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

type CalItem = { date: string; title: string; category: string; time: string; host: string; preacher: string };

/** Month calendar grid */
export function CalendarView({ month, items, lang, baseHref }: { month: string; items: CalItem[]; lang: Lang; baseHref: string }) {
  const first = new Date(month + "-01T00:00:00");
  const year = first.getFullYear();
  const mIdx = first.getMonth();
  const daysInMonth = new Date(year, mIdx + 1, 0).getDate();
  const offset = (first.getDay() + 6) % 7; // Monday first
  const prev = new Date(year, mIdx - 1, 1);
  const next = new Date(year, mIdx + 1, 1);
  const fmt = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  const todayStr = new Date().toISOString().slice(0, 10);
  const byDay = new Map<number, CalItem[]>();
  for (const it of items) {
    const day = Number(it.date.slice(8, 10));
    byDay.set(day, [...(byDay.get(day) ?? []), it]);
  }
  const weekdays = lang === "si" ? ["සඳු", "අඟ", "බදා", "බ්‍රහ", "සිකු", "සෙන", "ඉරි"] : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const cells = Array.from({ length: Math.ceil((offset + daysInMonth) / 7) * 7 }, (_, i) => i - offset + 1);

  return (
    <div className="card card-flat overflow-hidden">
      <div className="hero-bg flex items-center justify-between px-4 py-3 text-white">
        <Link href={`${baseHref}?month=${fmt(prev)}`} className="rounded-full p-2 hover:bg-white/15" aria-label="Previous month"><ChevronLeft /></Link>
        <h3 className="text-3d font-display text-xl sm:text-2xl">
          {first.toLocaleDateString(lang === "si" ? "si-LK" : "en-GB", { month: "long", year: "numeric" })}
        </h3>
        <Link href={`${baseHref}?month=${fmt(next)}`} className="rounded-full p-2 hover:bg-white/15" aria-label="Next month"><ChevronRight /></Link>
      </div>
      <div className="grid grid-cols-7 border-b border-line bg-paper-2 text-center text-xs font-semibold text-muted">
        {weekdays.map((w) => <div key={w} className="py-2">{w}</div>)}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((day, i) => {
          const valid = day >= 1 && day <= daysInMonth;
          const dateStr = valid ? `${month}-${String(day).padStart(2, "0")}` : "";
          const list = valid ? byDay.get(day) ?? [] : [];
          return (
            <div
              key={i}
              className={`min-h-20 border-b border-r border-line p-1 text-xs sm:min-h-28 sm:p-1.5 ${valid ? "bg-white" : "bg-paper"} ${dateStr === todayStr ? "ring-2 ring-inset ring-accent-2" : ""}`}
            >
              {valid && (
                <>
                  <span className={`mb-1 inline-grid h-6 w-6 place-items-center rounded-full text-[11px] font-semibold ${dateStr === todayStr ? "bg-accent-2 text-white" : "text-muted"}`}>{day}</span>
                  <div className="space-y-1">
                    {list.slice(0, 3).map((it, j) => (
                      <div
                        key={j}
                        title={[it.title, it.time, it.host && `Host: ${it.host}`, it.preacher && `Bana: ${it.preacher}`].filter(Boolean).join("\n")}
                        className={`truncate rounded px-1 py-0.5 text-[10px] font-medium text-white shadow-[0_2px_0_rgba(0,0,0,0.2)] sm:text-[11px] ${catColor(it.category)}`}
                      >
                        {it.time && <span className="hidden sm:inline">{it.time.split(" ")[0]} </span>}
                        {it.title}
                      </div>
                    ))}
                    {list.length > 3 && <div className="text-[10px] text-muted">+{list.length - 3}</div>}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-3 border-t border-line p-3 text-xs">
        {["dana", "bana", "poya", "bodhi_puja", "pirith", "kathina"].map((c) => (
          <span key={c} className="inline-flex items-center gap-1.5"><span className={`h-3 w-3 rounded ${catColor(c)}`} /> {catLabel(c, lang)}</span>
        ))}
      </div>
    </div>
  );
}

export function ProgrammeDetails({ host, preacher, preacherFrom }: { host: string; preacher: string; preacherFrom: string }) {
  if (!host && !preacher) return null;
  return (
    <div className="mt-2 space-y-0.5 text-xs">
      {host && <p className="flex items-center gap-1.5"><UserRound size={13} className="text-accent-2" /> <b>Host:</b> {host}</p>}
      {preacher && <p className="flex items-center gap-1.5"><Mic size={13} className="text-accent-2" /> <b>Bana:</b> {preacher}{preacherFrom && ` (${preacherFrom})`}</p>}
    </div>
  );
}
