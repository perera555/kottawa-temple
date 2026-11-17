import { PlayCircle } from "lucide-react";
import { tr, VIDEO_CATEGORIES, type Lang } from "@/lib/site";
import { fmtDate } from "./ui";

/** Turns a YouTube / Facebook / mp4 link into something we can embed. */
export function toEmbed(url: string): { kind: "iframe" | "video" | "link"; src: string } {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\.|^m\./, "");
    if (host === "youtu.be") return { kind: "iframe", src: `https://www.youtube-nocookie.com/embed/${u.pathname.slice(1)}` };
    if (host.endsWith("youtube.com")) {
      const id = u.searchParams.get("v") || u.pathname.split("/").filter(Boolean).pop();
      if (u.pathname.startsWith("/embed/")) return { kind: "iframe", src: url };
      if (id) return { kind: "iframe", src: `https://www.youtube-nocookie.com/embed/${id}` };
    }
    if (host.endsWith("facebook.com") || host === "fb.watch") {
      return { kind: "iframe", src: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false` };
    }
    if (/\.(mp4|webm|ogg)(\?|$)/i.test(u.pathname)) return { kind: "video", src: url };
  } catch {}
  return { kind: "link", src: url };
}

type V = { id: number; title: string; videoUrl: string; description: string; category: string; recordedAt: string | null };

export function VideoCard({ v, lang }: { v: V; lang: Lang }) {
  const e = toEmbed(v.videoUrl);
  return (
    <article className="card overflow-hidden">
      <div className="aspect-video bg-black">
        {e.kind === "iframe" && (
          <iframe
            src={e.src}
            title={v.title}
            className="h-full w-full"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
        {e.kind === "video" && <video src={e.src} controls preload="metadata" className="h-full w-full" />}
        {e.kind === "link" && (
          <a href={e.src} target="_blank" rel="noreferrer" className="grid h-full w-full place-items-center text-white">
            <PlayCircle size={56} />
          </a>
        )}
      </div>
      <div className="p-4">
        <span className="text-xs font-semibold uppercase tracking-wide text-accent-2">
          {tr(VIDEO_CATEGORIES[v.category] ?? VIDEO_CATEGORIES.other, lang)}
          {v.recordedAt && <span className="ml-2 font-normal normal-case text-muted">{fmtDate(v.recordedAt, lang)}</span>}
        </span>
        <h3 className="mt-1 font-semibold">{v.title}</h3>
        {v.description && <p className="prose-text mt-1 line-clamp-3 text-sm text-muted">{v.description}</p>}
      </div>
    </article>
  );
}
