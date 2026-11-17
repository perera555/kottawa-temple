import Link from "next/link";
import { CalendarDays, Clock, MapPin, Megaphone, Pin, Repeat, Star, UserRound, type LucideIcon } from "lucide-react";
import { EVENT_CATEGORIES, tr, type Bi, type Lang } from "@/lib/site";
import { AgendaTable, parseAgenda } from "./agenda-view";
import { DharmaWheel } from "./dharma-wheel";

export function fmtDate(d: string | Date | null | undefined, lang: Lang = "en") {
  if (!d) return "";
  const date = typeof d === "string" ? new Date(d + (d.length === 10 ? "T00:00:00" : "")) : d;
  return date.toLocaleDateString(lang === "si" ? "si-LK" : "en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export function PageHero({ title, subtitle, eyebrow, icon: Icon }: { title: string; subtitle?: string; eyebrow?: string; icon?: LucideIcon }) {
  return (
    <section className="hero-bg relative overflow-hidden text-white">
      <DharmaWheel className="spin-slow pointer-events-none absolute -right-24 -top-24 h-96 w-96 text-white/10" />
      {Icon ? (
        <div className="pointer-events-none absolute right-10 top-1/2 hidden -translate-y-1/2 md:block" style={{ perspective: "700px" }}>
          <div className="float-3d grid h-36 w-36 place-items-center rounded-[2rem] bg-gradient-to-br from-flag-yellow to-accent-2 text-white shadow-[0_14px_0_rgba(0,0,0,0.25),0_40px_60px_-20px_rgba(0,0,0,0.6),inset_0_2px_0_rgba(255,255,255,0.5)]">
            <Icon size={72} strokeWidth={1.6} className="drop-shadow-[0_4px_0_rgba(0,0,0,0.25)]" />
          </div>
        </div>
      ) : (
        <DharmaWheel className="wheel-3d pointer-events-none absolute right-8 top-1/2 hidden h-36 w-36 -translate-y-1/2 text-flag-yellow/80 md:block" />
      )}
      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:py-20">
        {eyebrow && <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-flag-yellow">{eyebrow}</p>}
        <h1 className="text-3d font-display text-3xl sm:text-5xl">{title}</h1>
        {subtitle && <p className="mt-3 max-w-2xl text-white/85 sm:text-lg">{subtitle}</p>}
      </div>
    </section>
  );
}

export function SectionTitle({ title, sub, href, linkLabel }: { title: string; sub?: string; href?: string; linkLabel?: string }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="font-display text-2xl text-accent sm:text-3xl">{title}</h2>
        <span className="section-bar mt-2" />
        {sub && <p className="mt-1 text-muted">{sub}</p>}
      </div>
      {href && (
        <Link href={href} className="text-sm font-semibold text-accent hover:underline">
          {linkLabel} →
        </Link>
      )}
    </div>
  );
}

export function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-7xl px-4 ${className}`}>{children}</div>;
}

export function Empty({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-white/60 px-6 py-10 text-center text-muted">
      <DharmaWheel className="mx-auto mb-3 h-10 w-10 text-line" />
      {text}
    </div>
  );
}

export function Img({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  if (!src) {
    return (
      <div className={`grid place-items-center bg-accent-soft text-accent/40 ${className}`}>
        <DharmaWheel className="h-1/3 max-h-16 w-1/3 max-w-16" />
      </div>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} className={`object-cover ${className}`} loading="lazy" />;
}

type Post = { id: number; kind: string; title: string; body: string; imageUrl: string; linkUrl: string; pinned: boolean; publishedAt: string };

export function PostCard({ post, lang }: { post: Post; lang: Lang }) {
  const isAd = post.kind === "advertisement";
  return (
    <article className={`card overflow-hidden ${isAd ? "ring-2 ring-accent-2/60" : ""}`}>
      {post.imageUrl && <Img src={post.imageUrl} alt={post.title} className="aspect-[16/9] w-full" />}
      <div className="p-5">
        <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-semibold ${isAd ? "bg-accent-2 text-white" : "bg-accent-soft text-accent"}`}>
            <Megaphone size={12} />
            {isAd ? (lang === "si" ? "දැන්වීම" : "Advertisement") : post.kind === "news" ? (lang === "si" ? "පුවත්" : "News") : lang === "si" ? "නිවේදනය" : "Notice"}
          </span>
          {post.pinned && (
            <span className="inline-flex items-center gap-1 text-accent-2">
              <Pin size={12} /> {lang === "si" ? "වැදගත්" : "Important"}
            </span>
          )}
          <span className="text-muted">{fmtDate(post.publishedAt, lang)}</span>
        </div>
        <h3 className="text-lg font-semibold">{post.title}</h3>
        {post.body && <p className="prose-text mt-2 text-sm text-muted">{post.body}</p>}
        {post.linkUrl && (
          <a href={post.linkUrl} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm font-semibold text-accent hover:underline">
            {lang === "si" ? "වැඩි විස්තර" : "More details"} →
          </a>
        )}
      </div>
    </article>
  );
}

type Ev = {
  id: number;
  title: string;
  description: string;
  category: string;
  eventDate: string | null;
  startTime: string;
  endTime?: string;
  schedule: string;
  location: string;
  imageUrl: string;
  host?: string;
  preacher?: string;
  preacherFrom?: string;
  agenda?: string;
};

export function EventCard({ ev, lang }: { ev: Ev; lang: Lang }) {
  const d = ev.eventDate ? new Date(ev.eventDate + "T00:00:00") : null;
  return (
    <article className="card flex overflow-hidden">
      <div className="flex w-24 shrink-0 flex-col items-center justify-center bg-accent p-3 text-center text-white">
        {d ? (
          <>
            <span className="text-3xl font-bold leading-none">{d.getDate()}</span>
            <span className="mt-1 text-xs uppercase tracking-wide">{d.toLocaleDateString("en-GB", { month: "short" })}</span>
            <span className="text-[10px] opacity-75">{d.getFullYear()}</span>
          </>
        ) : (
          <Repeat className="text-flag-yellow" />
        )}
      </div>
      <div className="min-w-0 flex-1 p-4">
        <span className="text-xs font-semibold uppercase tracking-wide text-accent-2">
          {tr(EVENT_CATEGORIES[ev.category] ?? EVENT_CATEGORIES.other, lang)}
        </span>
        <h3 className="font-semibold">{ev.title}</h3>
        {ev.description && <p className="prose-text mt-1 line-clamp-3 text-sm text-muted">{ev.description}</p>}
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
          {ev.schedule && <span className="inline-flex items-center gap-1"><CalendarDays size={13} /> {ev.schedule}</span>}
          {ev.startTime && <span className="inline-flex items-center gap-1"><Clock size={13} /> {[ev.startTime, ev.endTime].filter(Boolean).join(" – ")}</span>}
          {ev.location && <span className="inline-flex items-center gap-1"><MapPin size={13} /> {ev.location}</span>}
        </div>
        {(ev.host || ev.preacher) && (
          <div className="mt-2 space-y-0.5 rounded-lg bg-accent-soft/60 px-2 py-1.5 text-xs">
            {ev.host && <p><b>{lang === "si" ? "දායකත්වය:" : "Hosted by:"}</b> {ev.host}</p>}
            {ev.preacher && <p><b>{lang === "si" ? "ධර්ම දේශනාව:" : "Bana by:"}</b> {ev.preacher}{ev.preacherFrom && ` — ${ev.preacherFrom}`}</p>}
          </div>
        )}
        <AgendaTable items={parseAgenda(ev.agenda)} lang={lang} />
      </div>
      {ev.imageUrl && <Img src={ev.imageUrl} alt={ev.title} className="hidden w-32 shrink-0 sm:block" />}
    </article>
  );
}

export function PersonCard({ name, role, sub, imageUrl, note, highlight }: { name: string; role?: string; sub?: string; imageUrl: string; note?: string; highlight?: boolean }) {
  return (
    <div className={`card p-6 text-center ${highlight ? "ring-2 ring-accent" : ""}`}>
      {imageUrl ? (
        <Img src={imageUrl} alt={name} className="mx-auto mb-4 h-28 w-28 rounded-full border-4 border-accent-soft" />
      ) : (
        <div className="mx-auto mb-4 grid h-28 w-28 place-items-center rounded-full border-4 border-accent-soft bg-accent-soft text-accent">
          <UserRound size={44} />
        </div>
      )}
      <h3 className="font-semibold text-accent">{name}</h3>
      {role && <p className="text-sm font-medium">{role}</p>}
      {sub && <p className="text-xs text-muted">{sub}</p>}
      {note && <p className="mt-3 text-sm italic text-muted">“{note}”</p>}
    </div>
  );
}

export function Stars({ n, size = 16 }: { n: number; size?: number }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={`${n} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={size} className={i <= n ? "fill-flag-yellow text-flag-yellow" : "text-line"} />
      ))}
    </span>
  );
}

export function ReviewCard({ r, lang }: { r: { name: string; message: string; rating: number; createdAt: Date }; lang: Lang }) {
  return (
    <figure className="card flex h-full flex-col p-6">
      <Stars n={r.rating} />
      <blockquote className="prose-text mt-3 flex-1 text-ink/90">“{r.message}”</blockquote>
      <figcaption className="mt-4 flex items-center gap-3 border-t border-line pt-3">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-accent text-sm font-bold text-white">
          {r.name.slice(0, 1).toUpperCase()}
        </span>
        <span>
          <span className="block text-sm font-semibold">{r.name}</span>
          <span className="block text-xs text-muted">{fmtDate(r.createdAt, lang)}</span>
        </span>
      </figcaption>
    </figure>
  );
}

export function t(b: Bi, lang: Lang) {
  return tr(b, lang);
}
