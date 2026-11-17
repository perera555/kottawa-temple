"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Pause, Play, X } from "lucide-react";

type Item = { id: number; imageUrl: string; title: string; album: string; description?: string; takenAt?: string | null };

const fmt = (d?: string | null) =>
  d ? new Date(d + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "";

export function GalleryGrid({ items, allLabel = "All" }: { items: Item[]; allLabel?: string }) {
  const albums = useMemo(() => Array.from(new Set(items.map((i) => i.album).filter(Boolean))), [items]);
  const [album, setAlbum] = useState<string>("");
  const [open, setOpen] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const thumbs = useRef<HTMLDivElement>(null);
  const list = album ? items.filter((i) => i.album === album) : items;

  const go = useCallback((dir: number) => setOpen((o) => (o === null ? o : (o + dir + list.length) % list.length)), [list.length]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === " ") { e.preventDefault(); setPlaying((p) => !p); }
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, go]);

  useEffect(() => {
    if (!playing || open === null) return;
    const t = setInterval(() => go(1), 3500);
    return () => clearInterval(t);
  }, [playing, open, go]);

  useEffect(() => {
    thumbs.current?.querySelector<HTMLElement>(`[data-i="${open}"]`)?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [open]);

  const current = open !== null ? list[open] : null;

  return (
    <div>
      {albums.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {["", ...albums].map((a) => (
            <button
              key={a || "all"}
              onClick={() => setAlbum(a)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${album === a ? "border-accent bg-accent text-white shadow-[0_4px_0_rgba(0,0,0,0.25)]" : "border-line bg-white shadow-[0_3px_0_var(--line)] hover:-translate-y-0.5"}`}
            >
              {a || allLabel}
            </button>
          ))}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((item, idx) => (
          <button key={item.id} onClick={() => setOpen(idx)} className="card group overflow-hidden text-left">
            <div className="relative aspect-[4/3] overflow-hidden bg-paper-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.imageUrl} alt={item.title || "Photo"} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
              {item.album && (
                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-semibold text-accent shadow">{item.album}</span>
              )}
              {item.takenAt && (
                <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 text-xs font-medium text-white">
                  <CalendarDays size={13} /> {fmt(item.takenAt)}
                </span>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-accent">{item.title || "Untitled"}</h3>
              {item.description && <p className="mt-1 line-clamp-2 text-sm text-muted">{item.description}</p>}
            </div>
          </button>
        ))}
      </div>

      {current && open !== null && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/95 text-white" role="dialog" aria-modal="true">
          {/* Top bar */}
          <div className="flex items-center justify-between gap-3 p-3 sm:p-4">
            <span className="text-sm text-white/70">{open + 1} / {list.length}</span>
            <div className="flex items-center gap-2">
              <button onClick={() => setPlaying((p) => !p)} className="btn btn-gold py-1.5! text-sm" aria-label={playing ? "Pause slideshow" : "Play slideshow"}>
                {playing ? <><Pause size={16} /> Pause</> : <><Play size={16} /> Play</>}
              </button>
              <button onClick={() => { setOpen(null); setPlaying(false); }} className="rounded-full p-2 hover:bg-white/10" aria-label="Close"><X size={26} /></button>
            </div>
          </div>

          {/* Image + arrows */}
          <div className="relative flex min-h-0 flex-1 items-center justify-center px-14 sm:px-24">
            <button onClick={() => go(-1)} className="absolute left-2 grid h-12 w-12 place-items-center rounded-full bg-white/10 shadow-[0_4px_0_rgba(0,0,0,0.5)] backdrop-blur transition hover:-translate-x-0.5 hover:bg-white/20 sm:left-6 sm:h-14 sm:w-14" aria-label="Previous photo">
              <ChevronLeft size={30} />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img key={current.id} src={current.imageUrl} alt={current.title} className="max-h-full max-w-full rounded-xl object-contain shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)]" />
            <button onClick={() => go(1)} className="absolute right-2 grid h-12 w-12 place-items-center rounded-full bg-white/10 shadow-[0_4px_0_rgba(0,0,0,0.5)] backdrop-blur transition hover:translate-x-0.5 hover:bg-white/20 sm:right-6 sm:h-14 sm:w-14" aria-label="Next photo">
              <ChevronRight size={30} />
            </button>
          </div>

          {/* Caption */}
          <div className="mx-auto max-w-3xl px-4 pt-3 text-center">
            <p className="font-display text-xl">{current.title}</p>
            <p className="text-xs text-flag-yellow">{[current.album, fmt(current.takenAt)].filter(Boolean).join(" · ")}</p>
            {current.description && <p className="mt-1 text-sm text-white/75">{current.description}</p>}
          </div>

          {/* Thumbnails: pick any photo manually */}
          <div ref={thumbs} className="flex gap-2 overflow-x-auto p-3 sm:justify-center">
            {list.map((t, i) => (
              <button
                key={t.id}
                data-i={i}
                onClick={() => setOpen(i)}
                className={`h-14 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition ${i === open ? "scale-110 border-flag-yellow" : "border-transparent opacity-50 hover:opacity-100"}`}
                aria-label={`Show photo ${i + 1}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={t.imageUrl} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
