import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { getLang } from "@/lib/lang";
import { getSettings } from "@/lib/settings";
import { SECTION_INFO, TEMPLE, tr, type Section } from "@/lib/site";
import { DharmaWheel } from "./dharma-wheel";
import { SocialButtons } from "./social";

export async function SiteFooter({ section = "temple" }: { section?: Section }) {
  const [lang, st] = await Promise.all([getLang(), getSettings(section)]);
  const info = SECTION_INFO[section];
  return (
    <footer className="mt-auto bg-[#2a0f0b] text-white/80">
      <div className="flag-stripe h-1.5" />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <DharmaWheel className="h-12 w-12 text-flag-yellow" />
            <div>
              <p className="font-display text-xl text-white">{tr(info.name, lang)}</p>
              <p className="text-sm">{section === "temple" ? tr(TEMPLE.place, lang) : `${tr(TEMPLE.name, lang)}, ${tr(TEMPLE.place, lang)}`}</p>
            </div>
          </div>
          <p className="mt-4 max-w-md text-sm leading-relaxed">
            {lang === "si"
              ? "ශ්‍රී පුණ්‍යාභිවර්ධනාරාමය යටතේ සිරි සද්ධර්මෝදය දහම් පාසල සහ උදය ළමා උයන පෙර පාසල පවත්වාගෙන යනු ලැබේ."
              : "Home of the Siri Saddharmodaya Dhamma School and the Udaya Lama Uyana Pre School, under Sri Punyabhiwardhanaramaya."}
          </p>
          <p className="mt-4 text-sm italic text-flag-yellow/90">
            {lang === "si" ? "සබ්බදානං ධම්මදානං ජිනාති" : "“The gift of Dhamma excels all gifts.”"}
          </p>
          <div className="mt-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-white">{lang === "si" ? "සමාජ මාධ්‍ය" : "Follow us"}</p>
            <SocialButtons settings={st} />
          </div>
        </div>
        <div>
          <p className="mb-3 font-semibold text-white">{lang === "si" ? "පිටු" : "Explore"}</p>
          <ul className="space-y-2 text-sm">
            {info.nav.slice(1).map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="hover:text-flag-yellow">
                  {tr(n.label, lang)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-3 font-semibold text-white">{lang === "si" ? "සම්බන්ධ වන්න" : "Contact"}</p>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-2"><MapPin size={16} className="mt-0.5 shrink-0" /> {st.address}</li>
            <li className="flex gap-2"><Phone size={16} className="mt-0.5 shrink-0" /> <a href={`tel:${st.phone}`} className="hover:text-flag-yellow">{st.phone}</a></li>
            <li className="flex gap-2"><Mail size={16} className="mt-0.5 shrink-0" /> <a href={`mailto:${st.email}`} className="hover:text-flag-yellow">{st.email}</a></li>
          </ul>
          <div className="mt-4 flex gap-3 text-xs">
            <Link href="/register" className="underline hover:text-flag-yellow">{lang === "si" ? "සාමාජික වන්න" : "Become a member"}</Link>
            <Link href="/login" className="underline hover:text-flag-yellow">{lang === "si" ? "ඇතුල් වන්න" : "Login"}</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs">
        © {new Date().getFullYear()} {tr(info.name, lang)} · {tr(TEMPLE.name, lang)}, {tr(TEMPLE.place, lang)}
      </div>
    </footer>
  );
}
