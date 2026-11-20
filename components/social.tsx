import Link from "next/link";
import { Radio } from "lucide-react";
import { getLatestYoutube } from "@/lib/youtube";
import { getSettings, youtubeChannelId, type SectionSettings } from "@/lib/settings";
import { SECTION_INFO, tr, type Lang, type Section } from "@/lib/site";
import { toEmbed } from "./video-card";

/* Simple brand glyphs (lucide no longer ships brand icons) */
const PATHS: Record<string, string> = {
  facebook: "M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.3H8v3h2.5V21h3z",
  youtube:
    "M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8zM10 15V9l5.2 3L10 15z",
  instagram:
    "M12 7.3A4.7 4.7 0 1 0 12 16.7 4.7 4.7 0 0 0 12 7.3zm0 7.8a3.1 3.1 0 1 1 0-6.2 3.1 3.1 0 0 1 0 6.2zm6-8a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0zM12 4.6c2.4 0 2.7 0 3.6.1 2.4.1 3.6 1.3 3.7 3.7.1.9.1 1.2.1 3.6s0 2.7-.1 3.6c-.1 2.4-1.3 3.6-3.7 3.7-.9.1-1.2.1-3.6.1s-2.7 0-3.6-.1c-2.4-.1-3.6-1.3-3.7-3.7-.1-.9-.1-1.2-.1-3.6s0-2.7.1-3.6C4.8 6 6 4.8 8.4 4.7c.9-.1 1.2-.1 3.6-.1z",
  tiktok: "M16.6 5.8A4.3 4.3 0 0 1 15.5 3h-3.1v12.4a2.6 2.6 0 1 1-1.8-2.5V9.7a5.7 5.7 0 1 0 4.9 5.7V9.1a7.3 7.3 0 0 0 4.3 1.4V7.4a4.3 4.3 0 0 1-3.2-1.6z",
  whatsapp:
    "M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3zm5.2 12.6c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-3.3-.8-2.8-1.1-4.5-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.3 0 .5l-.4.6-.3.4c.1.2.6 1 1.3 1.7.9.8 1.7 1.1 1.9 1.2.2.1.4.1.5-.1l.7-.9c.2-.2.4-.2.6-.1l1.9.9c.3.1.4.2.5.3.1.2.1.7-.1 1.3z",
};
const COLORS: Record<string, string> = { facebook: "#1877f2", youtube: "#ff0000", instagram: "#d62976", tiktok: "#111111", whatsapp: "#25d366" };

export function SocialIcon({ name, size = 18 }: { name: string; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d={PATHS[name]} />
    </svg>
  );
}

export function socialLinks(s: SectionSettings) {
  const wa = s.whatsapp.replace(/[^\d]/g, "");
  return [
    { name: "facebook", label: "Facebook", href: s.facebookUrl },
    { name: "youtube", label: "YouTube", href: s.youtubeUrl },
    { name: "instagram", label: "Instagram", href: s.instagramUrl },
    { name: "tiktok", label: "TikTok", href: s.tiktokUrl },
    { name: "whatsapp", label: "WhatsApp", href: wa ? `https://wa.me/${wa}` : "" },
  ].filter((l) => l.href);
}

/** Row of 3D social buttons. */
export function SocialButtons({ settings, size = "md" }: { settings: SectionSettings; size?: "sm" | "md" }) {
  const links = socialLinks(settings);
  if (!links.length) return null;
  const box = size === "sm" ? "h-7 w-7" : "h-10 w-10";
  return (
    <div className="flex flex-wrap gap-2">
      {links.map((l) => (
        <a
          key={l.name}
          href={l.href}
          target="_blank"
          rel="noreferrer"
          aria-label={l.label}
          title={l.label}
          className={`grid ${box} place-items-center rounded-xl text-white transition hover:-translate-y-0.5`}
          style={{ background: COLORS[l.name], boxShadow: `inset 0 1px 0 rgba(255,255,255,.35), 0 3px 0 rgba(0,0,0,.35)` }}
        >
          <SocialIcon name={l.name} size={size === "sm" ? 14 : 20} />
        </a>
      ))}
    </div>
  );
}

/** Red LIVE bar under the header when the section is streaming. */
export async function LiveBanner({ section, lang }: { section: Section; lang: Lang }) {
  const s = await getSettings(section);
  if (!s.isLive || !s.liveUrl) return null;
  const base = SECTION_INFO[section].base;
  return (
    <Link href={`${base}/live`} className="block bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-white shadow-[0_6px_0_#7f1010]">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2.5">
        <span className="inline-flex items-center gap-1.5 rounded-md bg-white px-2 py-0.5 text-xs font-black text-red-700">
          <span className="h-2 w-2 animate-pulse rounded-full bg-red-600" /> LIVE
        </span>
        <span className="truncate font-semibold">{s.liveTitle || (lang === "si" ? "සජීවී විකාශනය දැන් සිදුවේ" : "We are live now")}</span>
        <span className="ml-auto shrink-0 rounded-full bg-white/20 px-3 py-1 text-sm font-semibold">{lang === "si" ? "නරඹන්න" : "Watch now"} →</span>
      </div>
    </Link>
  );
}

function FacebookFeed({ url, height = 640 }: { url: string; height?: number }) {
  const src = `https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(url)}&tabs=timeline&width=500&height=${height}&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true`;
  return (
    <div className="card card-flat overflow-hidden">
      <iframe
        title="Facebook page"
        src={src}
        className="mx-auto block w-full max-w-[500px]"
        style={{ height, border: "none", overflow: "hidden" }}
        loading="lazy"
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
      />
    </div>
  );
}

/**
 * Social media block: Facebook page feed (auto-updating posts & live videos)
 * + latest YouTube uploads (refreshed every 30 minutes).
 */
export async function SocialFeed({ section, lang, compact = false }: { section: Section; lang: Lang; compact?: boolean }) {
  const s = await getSettings(section);
  const channel = youtubeChannelId(s);
  const videos = await getLatestYoutube(channel, compact ? 4 : 6);
  const si = lang === "si";
  if (!s.facebookUrl && !videos.length) {
    return (
      <div className="card card-flat flex flex-wrap items-center justify-between gap-4 p-6">
        <p className="text-muted">
          {si ? "සමාජ මාධ්‍ය ගිණුම් තවම සම්බන්ධ කර නැත." : "Social media accounts are not connected yet."}{" "}
          <span className="text-xs">(Admin → Social Media &amp; Live)</span>
        </p>
        <SocialButtons settings={s} />
      </div>
    );
  }
  return (
    <div className={`grid gap-8 ${s.facebookUrl && videos.length ? "lg:grid-cols-[500px_1fr]" : ""}`}>
      {s.facebookUrl && (
        <div>
          <p className="mb-3 flex items-center gap-2 font-semibold" style={{ color: COLORS.facebook }}>
            <SocialIcon name="facebook" /> Facebook
          </p>
          <FacebookFeed url={s.facebookUrl} height={compact ? 520 : 680} />
        </div>
      )}
      {videos.length > 0 && (
        <div>
          <p className="mb-3 flex items-center justify-between gap-2 font-semibold" style={{ color: COLORS.youtube }}>
            <span className="inline-flex items-center gap-2"><SocialIcon name="youtube" /> {si ? "නවතම YouTube වීඩියෝ" : "Latest on YouTube"}</span>
            {s.youtubeUrl && (
              <a href={s.youtubeUrl} target="_blank" rel="noreferrer" className="text-sm text-accent hover:underline">
                {si ? "චැනලය" : "Channel"} →
              </a>
            )}
          </p>
          <div className="grid gap-5 sm:grid-cols-2">
            {videos.map((v) => (
              <div key={v.id} className="card overflow-hidden">
                <div className="aspect-video bg-black">
                  <iframe
                    title={v.title}
                    src={`https://www.youtube-nocookie.com/embed/${v.id}`}
                    className="h-full w-full"
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="p-3">
                  <p className="line-clamp-2 text-sm font-semibold">{v.title}</p>
                  <p className="text-xs text-muted">{new Date(v.published).toLocaleDateString(si ? "si-LK" : "en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/** The live player: admin's live link first, else the YouTube channel's live stream. */
export async function LivePlayer({ section, lang }: { section: Section; lang: Lang }) {
  const s = await getSettings(section);
  const si = lang === "si";
  const channel = youtubeChannelId(s);
  const src = s.isLive && s.liveUrl ? toEmbed(s.liveUrl) : channel ? { kind: "iframe" as const, src: `https://www.youtube-nocookie.com/embed/live_stream?channel=${channel}` } : null;
  return (
    <div className="hero-bg tile-3d overflow-hidden p-4 text-white sm:p-6">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-black ${s.isLive ? "bg-white text-red-700" : "bg-white/20"}`}>
          <Radio size={14} className={s.isLive ? "animate-pulse" : ""} /> {s.isLive ? "LIVE" : si ? "සජීවී" : "Live"}
        </span>
        <h2 className="text-3d font-display text-2xl">{s.isLive ? s.liveTitle || (si ? "සජීවී විකාශනය" : "Live now") : si ? "සජීවී විකාශනය" : "Live stream"}</h2>
      </div>
      {src && src.kind !== "link" ? (
        <div className="aspect-video overflow-hidden rounded-xl bg-black shadow-[0_20px_40px_-15px_rgba(0,0,0,0.7)]">
          {src.kind === "iframe" ? (
            <iframe title="Live" src={src.src} className="h-full w-full" allow="autoplay; encrypted-media; picture-in-picture; web-share" allowFullScreen />
          ) : (
            <video src={src.src} controls className="h-full w-full" />
          )}
        </div>
      ) : src?.kind === "link" ? (
        <a href={src.src} target="_blank" rel="noreferrer" className="btn btn-gold">{si ? "සජීවී විකාශනය නරඹන්න" : "Watch the live stream"} →</a>
      ) : (
        <p className="text-white/80">
          {si
            ? "දැනට සජීවී විකාශනයක් නොමැත. ඊළඟ පිංකම සඳහා අපගේ Facebook සහ YouTube පිටු අනුගමනය කරන්න."
            : "We are not live right now. Follow our Facebook and YouTube pages to catch the next pinkama live."}
        </p>
      )}
      <div className="mt-4">
        <SocialButtons settings={s} />
      </div>
    </div>
  );
}

export function sectionLabel(section: Section, lang: Lang) {
  return tr(SECTION_INFO[section].short, lang);
}
