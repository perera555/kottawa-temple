import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { MonthlyForm } from "@/components/admin/monthly-form";
import { allowedSections, requireAdmin } from "@/lib/auth";
import { EVENT_CATEGORIES, SECTION_INFO, type Section } from "@/lib/site";

export const metadata = { title: "Monthly Pinkam List" };

export default async function MonthlyPage({ searchParams }: PageProps<"/admin/monthly">) {
  const user = await requireAdmin();
  const sp = await searchParams;
  const sections = allowedSections(user);
  const section = (typeof sp.section === "string" && sections.includes(sp.section as Section) ? sp.section : sections[0]) as Section;
  if (!section) redirect("/admin");
  const categories = Object.entries(EVENT_CATEGORIES).map(([value, l]) => ({ value, label: l.en }));
  return (
    <div className="space-y-6">
      <Link href={`/admin/events?section=${section}`} className="inline-flex items-center gap-1 text-sm text-muted hover:text-accent">
        <ArrowLeft size={16} /> Back to Activities
      </Link>
      <div>
        <h1 className="font-display text-3xl text-accent">Monthly Pinkam List</h1>
        <p className="text-muted">
          {SECTION_INFO[section].name.en} — add the whole month&apos;s programme at once. It appears day by day on the website calendar and schedule.
        </p>
      </div>
      <MonthlyForm section={section} categories={categories} />
    </div>
  );
}
