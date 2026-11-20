import Link from "next/link";
import type { GuideTopic } from "@/lib/guides";
import { tr, type Lang } from "@/lib/site";

const COLORS: [string, string][] = [
  ["#ffb347", "#a3410a"],
  ["#5b8def", "#0f2a63"],
  ["#6ccf8a", "#14421f"],
  ["#ef5b62", "#7a0f14"],
  ["#ffe17a", "#8a5f00"],
  ["#b5524f", "#4a0c0c"],
];

/** Bilingual step-by-step guide: contents chips + one 3D card per topic. */
export function GuideView({ topics, lang, other }: { topics: GuideTopic[]; lang: Lang; other?: { href: string; label: string } }) {
  const si = lang === "si";
  return (
    <div className="space-y-10">
      {/* contents */}
      <nav className="card card-flat p-5">
        <p className="mb-3 text-sm font-semibold text-muted">{si ? "පටුන" : "Contents"}</p>
        <div className="flex flex-wrap gap-2">
          {topics.map((t) => (
            <a key={t.id} href={`#${t.id}`} className="nav-3d">
              <span className="mr-1">{t.icon}</span> {tr(t.title, lang)}
            </a>
          ))}
        </div>
        <p className="mt-4 text-xs text-muted">
          {si ? "ඉංග්‍රීසියෙන් කියවීමට ඉහළ දකුණේ “EN” ඔබන්න." : "Press “සිං” at the top right to read this guide in Sinhala."}
          {other && (
            <>
              {" · "}
              <Link href={other.href} className="font-semibold text-accent hover:underline">{other.label} →</Link>
            </>
          )}
        </p>
      </nav>

      {/* topics */}
      {topics.map((t, i) => {
        const [c1, c2] = COLORS[i % COLORS.length];
        return (
          <section key={t.id} id={t.id} className="card scroll-mt-36 overflow-hidden">
            <div className="flex items-center gap-4 px-6 py-4 text-white" style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}>
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/20 text-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_6px_12px_-6px_rgba(0,0,0,0.5)]">
                {t.icon}
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">{si ? "පියවර" : "Step"} {i + 1}</p>
                <h2 className="text-3d font-display text-2xl">{tr(t.title, lang)}</h2>
              </div>
            </div>
            <ol className="space-y-3 p-6">
              {t.steps.map((s, j) => (
                <li key={j} className="flex gap-3">
                  <span
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-xl text-sm font-bold text-white"
                    style={{ background: `linear-gradient(160deg, ${c1}, ${c2})`, boxShadow: `0 3px 0 ${c2}` }}
                  >
                    {j + 1}
                  </span>
                  <span className="pt-1 leading-relaxed">{tr(s, lang)}</span>
                </li>
              ))}
            </ol>
            {t.tip && (
              <p className="mx-6 mb-6 rounded-xl bg-accent-soft px-4 py-3 text-sm">
                💡 <b>{si ? "ඉඟිය:" : "Tip:"}</b> {tr(t.tip, lang)}
              </p>
            )}
          </section>
        );
      })}
    </div>
  );
}
