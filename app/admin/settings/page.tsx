import { redirect } from "next/navigation";
import { connection } from "next/server";
import { SettingsForm } from "@/components/admin/settings-form";
import { allowedSections, requireAdmin } from "@/lib/auth";
import { getRawSettings } from "@/lib/settings";
import { SECTION_INFO, type Section } from "@/lib/site";

export const metadata = { title: "Social Media & Live" };

export default async function SettingsPage({ searchParams }: PageProps<"/admin/settings">) {
  await connection();
  const user = await requireAdmin();
  const sp = await searchParams;
  const sections = allowedSections(user);
  const section = (typeof sp.section === "string" && sections.includes(sp.section as Section) ? sp.section : sections[0]) as Section;
  if (!section) redirect("/admin");
  const row = await getRawSettings(section);
  const values = Object.fromEntries(Object.entries(row ?? {}).filter(([, v]) => typeof v === "string" || typeof v === "boolean")) as Record<string, string | boolean>;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="font-display text-3xl text-accent">Social Media &amp; Live</h1>
        <p className="text-muted">{SECTION_INFO[section].name.en} — Facebook, YouTube, live stream and contact details for this section&apos;s website.</p>
      </div>
      <SettingsForm key={section} section={section} values={values} />
    </div>
  );
}
