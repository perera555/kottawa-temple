export type AgendaItem = { time: string; activity: string; monk: string; from: string };

export function parseAgenda(raw: unknown): AgendaItem[] {
  try {
    const v = typeof raw === "string" ? JSON.parse(raw || "[]") : raw;
    return Array.isArray(v) ? v.filter((x) => x && (x.time || x.activity)) : [];
  } catch {
    return [];
  }
}

/** Public timetable */
export function AgendaTable({ items, lang }: { items: AgendaItem[]; lang: "en" | "si" }) {
  if (!items.length) return null;
  const si = lang === "si";
  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-line">
      <p className="hero-bg px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-white">{si ? "කාල සටහන" : "Timetable"}</p>
      <ol className="divide-y divide-line bg-white text-sm">
        {items.map((it, i) => (
          <li key={i} className="grid grid-cols-[84px_1fr] gap-2 px-3 py-2">
            <span className="font-semibold text-accent">{it.time}</span>
            <span>
              <span className="block">{it.activity}</span>
              {it.monk && (
                <span className="block text-xs text-muted">
                  🙏 {it.monk}
                  {it.from && ` — ${it.from}`}
                </span>
              )}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
