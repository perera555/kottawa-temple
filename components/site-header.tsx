import Link from "next/link";
import { BookOpen, Landmark, LogOut, Sprout, UserRound } from "lucide-react";
import { logout } from "@/app/actions/auth";
import { getSession } from "@/lib/auth";
import { touchPresence } from "@/lib/presence";
import { UserMenu } from "./user-menu";
import { getLang } from "@/lib/lang";
import { isAdminRole } from "@/lib/session";
import { SECTION_INFO, TEMPLE, tr, type Section } from "@/lib/site";
import { DharmaWheel } from "./dharma-wheel";
import { LangToggle } from "./lang-toggle";
import { NavLinks } from "./nav-links";

export async function SiteHeader({ section }: { section: Section }) {
  const [lang, user] = await Promise.all([getLang(), getSession()]);
  const profile = user ? await touchPresence(user.id) : null;
  const info = SECTION_INFO[section];
  const items = info.nav.map((n) => ({ href: n.href, label: tr(n.label, lang) }));

  const accountLinks = (cls: string) =>
    user ? (
      <UserMenu
        name={profile?.name ?? user.name}
        avatarUrl={profile?.avatarUrl ?? ""}
        memberNo={profile?.memberNo ?? null}
        isAdmin={isAdminRole(user.role)}
      />
    ) : (
      <>
        <Link href="/login" className={cls}>
          {lang === "si" ? "ඇතුල් වන්න" : "Login"}
        </Link>
        <Link href="/register" className={`${cls} font-semibold text-flag-yellow`}>
          {lang === "si" ? "සාමාජික වන්න" : "Become a Member"}
        </Link>
      </>
    );
  const account = (
    <div className="flex flex-wrap gap-2">
      {user ? (
        <>
          <Link href="/account" className="btn btn-ghost py-1.5! text-sm">
            <UserRound size={16} /> {lang === "si" ? "මගේ ගිණුම" : "My Account"}
          </Link>
          {isAdminRole(user.role) && <Link href="/admin" className="btn btn-primary py-1.5! text-sm">Admin Panel</Link>}
          <form action={logout}><button className="btn btn-ghost py-1.5! text-sm"><LogOut size={16} /> {lang === "si" ? "පිටවන්න" : "Sign out"}</button></form>
        </>
      ) : (
        <>
          <Link href="/login" className="btn btn-ghost py-1.5! text-sm">{lang === "si" ? "ඇතුල් වන්න" : "Login"}</Link>
          <Link href="/register" className="btn btn-primary py-1.5! text-sm">{lang === "si" ? "සාමාජික වන්න" : "Become a Member"}</Link>
        </>
      )}
    </div>
  );

  return (
    <header className="sticky top-0 z-40">
      {/* Temple bar - every page sits under the temple */}
      <div className="bg-[#5e1414] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-1.5 text-xs sm:text-sm">
          <Link href="/" className="flex min-w-0 items-center gap-2 hover:text-flag-yellow">
            <DharmaWheel className="h-5 w-5 shrink-0 text-flag-yellow" />
            <span className="truncate font-display tracking-wide">
              {tr(TEMPLE.name, lang)}, {tr(TEMPLE.place, lang)}
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <div className={`${user ? "flex" : "hidden sm:flex"} items-center gap-4`}>
              {accountLinks("inline-flex items-center gap-1 hover:text-flag-yellow")}
            </div>
            <LangToggle lang={lang} />
          </div>
        </div>
      </div>
      <div className="flag-stripe h-1" />
      <div className="relative border-b border-line bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <Link href={info.base || "/"} className="flex min-w-0 items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-accent text-flag-yellow">
              <DharmaWheel className="h-8 w-8" />
            </span>
            <span className="min-w-0 leading-tight">
              <span className="block truncate font-display text-lg text-accent sm:text-xl">{tr(info.name, lang)}</span>
              <span className="block truncate text-xs text-muted">
                {section === "temple" ? tr(TEMPLE.place, lang) : `${tr(TEMPLE.name, lang)}`}
              </span>
            </span>
          </Link>
          <NavLinks items={items} extra={account} />
        </div>
      </div>
      {/* Section switcher: Temple / Dhamma School / Montessori */}
      <div className="border-b border-line bg-paper-2/95 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-2">
          {(["temple", "dhamma", "montessori"] as const).map((s) => {
            const active = s === section;
            const Icon = s === "temple" ? Landmark : s === "dhamma" ? BookOpen : Sprout;
            const label =
              s === "temple"
                ? tr(TEMPLE.name, lang)
                : s === "dhamma"
                  ? lang === "si" ? "ඉරිදා දහම් පාසල" : "Sunday Dhamma School"
                  : lang === "si" ? "උදය ළමා උයන පෙර පාසල" : "Udaya Lama Uyana Montessori";
            return (
              <Link
                key={s}
                href={SECTION_INFO[s].base || "/"}
                data-section={s}
                className={`shrink-0 rounded-xl px-4 py-1.5 text-sm font-semibold transition ${
                  active
                    ? "hero-bg -translate-y-0.5 text-white shadow-[0_4px_0_rgba(0,0,0,0.3),0_10px_18px_-8px_rgba(0,0,0,0.5)]"
                    : "bg-white text-ink shadow-[0_3px_0_var(--line)] hover:-translate-y-0.5 hover:text-accent"
                }`}
              >
                <span className="inline-flex items-center gap-1.5"><Icon size={16} /> {label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
