import { BookOpenText } from "lucide-react";
import { GuideView } from "@/components/guide-view";
import { Container, PageHero } from "@/components/ui";
import { getSession } from "@/lib/auth";
import { USER_GUIDE } from "@/lib/guides";
import { getLang } from "@/lib/lang";
import { isAdminRole } from "@/lib/session";

export const metadata = { title: "User Guide / පරිශීලක උපදෙස්" };

export default async function UserGuidePage() {
  const [lang, user] = await Promise.all([getLang(), getSession()]);
  const si = lang === "si";
  return (
    <>
      <PageHero
        eyebrow={si ? "උපදෙස්" : "Help"}
        title={si ? "පරිශීලක උපදෙස්" : "User Guide"}
        subtitle={si ? "ගිණුම සෑදීම, ඇතුල් වීම සහ වෙබ් අඩවියේ සියලු සේවා භාවිතා කරන ආකාරය" : "How to create an account, log in and use every service on the website"}
        icon={BookOpenText}
      />
      <Container className="py-12">
        <GuideView
          topics={USER_GUIDE}
          lang={lang}
          other={user && isAdminRole(user.role) ? { href: "/admin/guide", label: si ? "පරිපාලක උපදෙස්" : "Admin Guide" } : undefined}
        />
      </Container>
    </>
  );
}
