import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { and, gte, lt } from "drizzle-orm";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DailyDanaForm } from "@/components/admin/daily-dana-form";
import { canManage, requireAdmin } from "@/lib/auth";
import { db, schema } from "@/lib/db";

export const metadata = { title: "Daily Dana Roster" };

export default async function DailyDanaAdmin({ searchParams }: PageProps<"/admin/daily-dana">) {
  await connection();
  const user = await requireAdmin();
  if (!canManage(user, "temple")) redirect("/admin");
  const sp = await searchParams;
  const month = typeof sp.month === "string" && /^\d{4}-\d{2}$/.test(sp.month) ? sp.month : new Date().toISOString().slice(0, 7);
  const [y, m] = month.split("-").map(Number);
  const fmt = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  const prev = fmt(new Date(y, m - 2, 1));
  const next = fmt(new Date(y, m, 1));

  const rows = await db
    .select()
    .from(schema.dailyDana)
    .where(and(gte(schema.dailyDana.danaDate, `${month}-01`), lt(schema.dailyDana.danaDate, `${next}-01`)));
  const existing = Object.fromEntries(rows.map((r) => [`${r.danaDate}|${r.slot}`, { donor: r.donor, phone: r.phone }]));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-accent">Daily Dana Roster · දෛනික දාන</h1>
          <p className="text-muted">Enter the donors for the whole month once. The temple home page shows today&apos;s donors automatically.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/admin/daily-dana?section=temple&month=${prev}`} className="btn btn-ghost py-1.5!" aria-label="Previous month"><ChevronLeft size={18} /></Link>
          <span className="rounded-xl bg-white px-4 py-2 font-semibold shadow-[0_3px_0_var(--line)]">
            {new Date(month + "-01T00:00:00").toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
          </span>
          <Link href={`/admin/daily-dana?section=temple&month=${next}`} className="btn btn-ghost py-1.5!" aria-label="Next month"><ChevronRight size={18} /></Link>
        </div>
      </div>
      <DailyDanaForm key={month} month={month} existing={existing} />
    </div>
  );
}
