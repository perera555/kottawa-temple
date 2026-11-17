"use client";

import { useTransition } from "react";
import { setLang } from "@/app/actions/auth";
import type { Lang } from "@/lib/site";

export function LangToggle({ lang }: { lang: Lang }) {
  const [pending, start] = useTransition();
  return (
    <div className="inline-flex rounded-full border border-white/30 p-0.5 text-xs font-semibold" aria-busy={pending}>
      {(["si", "en"] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => start(() => setLang(l))}
          className={`rounded-full px-2.5 py-1 transition ${lang === l ? "bg-white text-accent" : "text-white/85 hover:text-white"}`}
          aria-pressed={lang === l}
        >
          {l === "si" ? "සිං" : "EN"}
        </button>
      ))}
    </div>
  );
}
