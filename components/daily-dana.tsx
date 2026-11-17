import { DANA_SLOTS, tr, type Lang } from "@/lib/site";

type Entry = { danaDate: string; slot: string; donor: string };

const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/** Big 3D panel: today's morning / noon / evening dana donors (+ tomorrow). */
export function TodayDana({ entries, lang, compact = false }: { entries: Entry[]; lang: Lang; compact?: boolean }) {
  const si = lang === "si";
  const now = new Date();
  const days = [now, new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)].map((d) => ({
    date: iso(d),
    label: d.toLocaleDateString(si ? "si-LK" : "en-GB", { weekday: "long", day: "numeric", month: "long" }),
  }));
  const find = (date: string, slot: string) => entries.find((e) => e.danaDate === date && e.slot === slot)?.donor;

  return (
    <div className={`grid items-start gap-6 ${compact ? "" : "lg:grid-cols-[1.6fr_1fr]"}`}>
      {days.map((d, idx) => (
        <div key={d.date} className={`${idx === 0 ? "hero-bg tile-3d text-white" : "card"} overflow-hidden ${compact ? "p-5" : "p-6"}`}>
          <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${idx === 0 ? "text-flag-yellow" : "text-accent-2"}`}>
            {idx === 0 ? (si ? "අද දානය" : "Today's Dana") : si ? "හෙට" : "Tomorrow"}
          </p>
          <p className={`font-display text-2xl ${idx === 0 ? "text-3d" : "text-accent"}`}>{d.label}</p>
          <div className={`mt-4 grid gap-3 ${idx === 0 && !compact ? "sm:grid-cols-3" : ""}`}>
            {DANA_SLOTS.map((s) => {
              const donor = find(d.date, s.key);
              return (
                <div
                  key={s.key}
                  className={`rounded-2xl p-4 ${
                    idx === 0
                      ? "bg-white/12 shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_10px_20px_-10px_rgba(0,0,0,0.5)] backdrop-blur"
                      : "bg-paper shadow-[0_3px_0_var(--line)]"
                  }`}
                >
                  <p className="text-sm font-semibold">
                    {s.emoji} {tr(s.label, lang)}
                  </p>
                  <p className={`text-xs ${idx === 0 ? "text-white/70" : "text-muted"}`}>{s.time}</p>
                  <p className={`mt-2 ${idx === 0 ? "text-lg" : ""} font-semibold ${donor ? "" : idx === 0 ? "text-white/60" : "text-muted"}`}>
                    {donor ?? (si ? "දායකත්වය විවෘතයි" : "Open — book this dana")}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

/** Whole month, day by day. */
export function MonthDanaList({ entries, month, lang }: { entries: Entry[]; month: string; lang: Lang }) {
  const si = lang === "si";
  const [y, m] = month.split("-").map(Number);
  const days = new Date(y, m, 0).getDate();
  const today = iso(new Date());
  return (
    <div className="card card-flat overflow-x-auto">
      <table className="w-full min-w-[640px] text-sm">
        <thead className="hero-bg text-left text-xs uppercase tracking-wider text-white">
          <tr>
            <th className="px-4 py-3">{si ? "දිනය" : "Date"}</th>
            {DANA_SLOTS.map((s) => <th key={s.key} className="px-4 py-3">{s.emoji} {tr(s.label, lang)}</th>)}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {Array.from({ length: days }, (_, i) => {
            const date = `${month}-${String(i + 1).padStart(2, "0")}`;
            const d = new Date(date + "T00:00:00");
            return (
              <tr key={date} className={date === today ? "bg-accent-soft font-semibold" : date < today ? "text-muted" : ""}>
                <td className="whitespace-nowrap px-4 py-2.5">
                  {i + 1} <span className="text-xs text-muted">{d.toLocaleDateString(si ? "si-LK" : "en-GB", { weekday: "short" })}</span>
                </td>
                {DANA_SLOTS.map((s) => {
                  const donor = entries.find((e) => e.danaDate === date && e.slot === s.key)?.donor;
                  return <td key={s.key} className="px-4 py-2.5">{donor ?? <span className="text-xs text-muted">—</span>}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
