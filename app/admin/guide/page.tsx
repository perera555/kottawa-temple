import { LangToggle } from "@/components/lang-toggle";
import { GuideView } from "@/components/guide-view";
import { requireAdmin } from "@/lib/auth";
import { ADMIN_GUIDE } from "@/lib/guides";
import { getLang } from "@/lib/lang";

export const metadata = { title: "Admin Guide / පරිපාලක උපදෙස්" };

export default async function AdminGuidePage() {
  await requireAdmin();
  const lang = await getLang();
  const si = lang === "si";
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="hero-bg tile-3d flex flex-wrap items-center justify-between gap-4 p-6 text-white">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-flag-yellow">{si ? "උපදෙස්" : "Help"}</p>
          <h1 className="text-3d font-display text-3xl">{si ? "පරිපාලක උපදෙස්" : "Admin Guide"}</h1>
          <p className="text-white/80">{si ? "පරිපාලක පුවරුව පියවරෙන් පියවර භාවිතා කරන ආකාරය" : "Step-by-step: how to use the admin panel"}</p>
        </div>
        <LangToggle lang={lang} />
      </div>
      <GuideView topics={ADMIN_GUIDE} lang={lang} other={{ href: "/guide", label: si ? "පරිශීලක උපදෙස්" : "User Guide" }} />
    </div>
  );
}
