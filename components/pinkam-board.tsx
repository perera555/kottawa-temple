"use client";

import Link from "next/link";
import { useState } from "react";
import { BookOpenText, Clock, Flower2, HandHeart, MapPin, Mic, Moon, Repeat, UserRound } from "lucide-react";

export type PinkamItem = {
  id: number;
  title: string;
  category: string;
  eventDate: string | null;
  startTime: string;
  endTime: string;
  schedule: string;
  host: string;
  preacher: string;
  preacherFrom: string;
  location: string;
  allowRegistration: boolean;
};

const TABS = [
  { key: "dana", cats: ["dana"], icon: HandHeart, en: "Dana", si: "දාන", color: ["#ffb347", "#ec7a1c", "#a3410a"], href: "/dana", cta: { en: "Book a dana", si: "දානයක් වෙන්කරන්න" } },
  { key: "pirith", cats: ["pirith"], icon: BookOpenText, en: "Pirith", si: "පිරිත්", color: ["#5b8def", "#1f4ea3", "#0f2a63"], href: "/activities?category=pirith", cta: { en: "All pirith", si: "සියලු පිරිත්" } },
  { key: "bodhi", cats: ["bodhi_puja"], icon: Flower2, en: "Bodhi Puja", si: "බෝධි පූජා", color: ["#6ccf8a", "#2c7a3f", "#14421f"], href: "/sil", cta: { en: "Register", si: "ලියාපදිංචි වන්න" } },
  { key: "poya", cats: ["poya", "sil", "meditation"], icon: Moon, en: "Poya Sil", si: "පොහොය සිල්", color: ["#ffe17a", "#e2a614", "#8a5f00"], href: "/sil", cta: { en: "Register for sil", si: "සිල් සඳහා ලියාපදිංචි වන්න" } },
  { key: "bana", cats: ["bana", "kathina"], icon: Mic, en: "Bana", si: "බණ", color: ["#b5524f", "#8a1e1e", "#4a0c0c"], href: "/activities?category=bana", cta: { en: "All sermons", si: "සියලු දේශනා" } },
] as const;

export function PinkamBoard({ items, lang }: { items: PinkamItem[]; lang: "en" | "si" }) {
  const [active, setActive] = useState<(typeof TABS)[number]["key"]>("dana");
  const si = lang === "si";
  const tab = TABS.find((t) => t.key === active)!;
  const today = new Date().toISOString().slice(0, 10);
  const list = items
    .filter((i) => (tab.cats as readonly string[]).includes(i.category))
    .filter((i) => !i.eventDate || i.eventDate >= today)
    .sort((a, b) => (a.eventDate ?? "0000").localeCompare(b.eventDate ?? "0000"))
    .slice(0, 6);
  const style = { "--f1": tab.color[0], "--f2": tab.color[1], "--f3": tab.color[2] } as React.CSSProperties;

  return (
    <div>
      {/* 3D tabs */}
      <div className="mb-5 flex flex-wrap gap-2" role="tablist">
        {TABS.map((t) => {
          const on = t.key === active;
          return (
            <button
              key={t.key}
              role="tab"
              aria-selected={on}
              onClick={() => setActive(t.key)}
              className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition duration-300 ${
                on ? "-translate-y-1 text-white" : "bg-white text-ink shadow-[0_4px_0_var(--line)] hover:-translate-y-0.5"
              }`}
              style={
                on
                  ? {
                      background: `linear-gradient(160deg, ${t.color[0]}, ${t.color[1]} 60%, ${t.color[2]})`,
                      boxShadow: `inset 0 2px 0 rgba(255,255,255,.35), 0 6px 0 ${t.color[2]}, 0 16px 24px -10px ${t.color[2]}`,
                    }
                  : undefined
              }
            >
              <t.icon size={18} /> {si ? t.si : t.en}
            </button>
          );
        })}
      </div>

      {/* Panel */}
      <div className="feature-3d min-h-0! p-0! hover:transform-none!" style={style}>
        <span className="feature-orb" />
        <div className="relative flex items-center justify-between gap-3 px-6 pt-5">
          <h3 className="text-3d flex items-center gap-2 font-display text-2xl">
            <tab.icon size={26} /> {si ? tab.si : tab.en}
          </h3>
          <Link href={tab.href} className="rounded-full bg-white/20 px-4 py-1.5 text-sm font-semibold backdrop-blur hover:bg-white/30">
            {si ? tab.cta.si : tab.cta.en} →
          </Link>
        </div>
        <div className="relative grid gap-3 p-5 sm:grid-cols-2">
          {list.length ? (
            list.map((e) => {
              const d = e.eventDate ? new Date(e.eventDate + "T00:00:00") : null;
              return (
                <div key={e.id} className="flex gap-3 rounded-2xl bg-white p-3 text-ink shadow-[0_4px_0_rgba(0,0,0,0.15),0_14px_24px_-12px_rgba(0,0,0,0.5)]">
                  <span
                    className="grid h-14 w-14 shrink-0 place-items-center rounded-xl text-center leading-none text-white"
                    style={{ background: `linear-gradient(160deg, ${tab.color[0]}, ${tab.color[2]})` }}
                  >
                    {d ? (
                      <span>
                        <span className="block text-xl font-bold">{d.getDate()}</span>
                        <span className="text-[10px] uppercase">{d.toLocaleDateString("en-GB", { month: "short" })}</span>
                      </span>
                    ) : (
                      <Repeat size={22} />
                    )}
                  </span>
                  <div className="min-w-0 text-sm">
                    <p className="font-semibold leading-snug">{e.title}</p>
                    <div className="mt-1 space-y-0.5 text-xs text-muted">
                      {(e.startTime || e.schedule) && (
                        <p className="flex items-center gap-1"><Clock size={12} /> {[e.schedule, [e.startTime, e.endTime].filter(Boolean).join(" – ")].filter(Boolean).join(" · ")}</p>
                      )}
                      {e.host && <p className="flex items-center gap-1"><UserRound size={12} /> {e.host}</p>}
                      {e.preacher && <p className="flex items-center gap-1"><Mic size={12} /> {e.preacher}{e.preacherFrom && `, ${e.preacherFrom}`}</p>}
                      {e.location && <p className="flex items-center gap-1"><MapPin size={12} /> {e.location}</p>}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="rounded-2xl bg-white/15 p-5 text-sm sm:col-span-2">
              {si ? "ඉදිරි වැඩසටහන් නොමැත. පරිපාලක පුවරුවෙන් එක් කරන්න." : "No upcoming programmes yet — the admin can add them from the admin panel."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
