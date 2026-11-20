import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";
import { desc, eq, ilike, or, type SQL, and } from "drizzle-orm";
import { CalendarPlus, Pencil, Plus } from "lucide-react";
import { DeleteButton, StatusCell, ToggleCell } from "@/components/admin/row-actions";
import { StudentCards } from "@/components/admin/student-cards";
import { Avatar } from "@/components/user-menu";
import { isOnline } from "@/lib/presence";
import { allowedSections, requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { isResourceKey, RESOURCES } from "@/lib/resources";
import { SECTION_INFO, type Section } from "@/lib/site";
import { TABLES } from "@/lib/tables";

/* eslint-disable @typescript-eslint/no-explicit-any */

const TOGGLES: Record<string, string[]> = {
  testimonials: ["approved"],
  messages: ["isRead"],
  posts: ["pinned"],
  students: ["showOnWebsite"],
};

export default async function ResourceList({ params, searchParams }: PageProps<"/admin/[resource]">) {
  await connection();
  const { resource: key } = await params;
  const sp = await searchParams;
  if (!isResourceKey(key)) notFound();
  const user = await requireAdmin();
  const r = RESOURCES[key];
  if (r.superAdminOnly && user.role !== "super_admin") redirect("/admin");

  const sections = allowedSections(user).filter((s) => r.sections.includes(s));
  const isUsers = key === "users";
  if (!isUsers && !sections.length) redirect("/admin");
  const section = (typeof sp.section === "string" && sections.includes(sp.section as Section) ? sp.section : sections[0]) as Section;
  const q = typeof sp.q === "string" ? sp.q.trim() : "";

  const table = TABLES[key] as any;
  const conds: SQL[] = [];
  if (!isUsers) conds.push(eq(table.section, section));
  if (q) {
    const searchCols = ["name", "title", "email", "memberNo", "phone", "childName", "parentName", "admissionNo", "donor"].filter((c) => table[c]);
    conds.push(or(...searchCols.map((c) => ilike(table[c], `%${q}%`)))!);
  }
  const rows: any[] = await db.select().from(table).where(conds.length ? and(...conds) : undefined).orderBy(desc(table.id)).limit(500);

  const labelOf = (name: string) =>
    name === "createdAt" ? "Created" : name === "memberNo" ? "Reg. No." : name === "lastSeenAt" ? "Status" : name === "avatarUrl" ? "" : r.fields.find((f) => f.name === name)?.label.replace(/\s*\(.*\)/, "") ?? name;

  const cell = (row: any, col: string) => {
    const v = row[col];
    if (TOGGLES[key]?.includes(col)) return <ToggleCell resourceKey={key} id={row.id} field={col} value={!!v} />;
    if (key === "dana" && col === "status") return <StatusCell resourceKey={key} id={row.id} value={v} options={["pending", "confirmed", "cancelled"]} />;
    if (key === "applications" && col === "status")
      return <StatusCell resourceKey={key} id={row.id} value={v} options={["pending", "waiting", "accepted", "rejected"]} />;
    if (col === "photoUrl")
      // eslint-disable-next-line @next/next/no-img-element
      return v ? <img src={v} alt="" className="h-10 w-10 rounded-lg object-cover" /> : <span className="text-muted">—</span>;
    if (col === "avatarUrl") return <Avatar name={row.name} src={v} size={36} online={isOnline(row.lastSeenAt)} />;
    if (col === "lastSeenAt")
      return isOnline(v) ? (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-700"><span className="h-2 w-2 rounded-full bg-green-500" /> Online</span>
      ) : (
        <span className="inline-flex items-center gap-1.5 text-xs text-muted">
          <span className="h-2 w-2 rounded-full bg-gray-400" /> Offline{v ? ` · ${new Date(v).toLocaleString("en-GB", { dateStyle: "short", timeStyle: "short" })}` : ""}
        </span>
      );
    if (col === "imageUrl")
      // eslint-disable-next-line @next/next/no-img-element
      return v ? <img src={v} alt="" className="h-10 w-10 rounded-lg object-cover" /> : <span className="text-muted">—</span>;
    if (col === "rating") return "★".repeat(Number(v) || 0);
    if (typeof v === "boolean") return v ? "Yes" : "No";
    if (v instanceof Date) return v.toISOString().slice(0, 10);
    if (col === "role") return <span className="rounded-full bg-accent-soft px-2 py-0.5 text-xs capitalize text-accent">{String(v).replace("_", " ")}</span>;
    const s = v == null ? "" : String(v);
    const opt = r.fields.find((f) => f.name === col)?.options?.find((o) => o.value === s);
    const text = opt?.label ?? s;
    return text.length > 60 ? text.slice(0, 60) + "…" : text || <span className="text-muted">—</span>;
  };

  const base = `/admin/${key}`;
  const cardKind = key === "students" || key === "applications" ? key : null;
  const view = sp.view === "table" ? "table" : "cards";
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-accent">{r.label}</h1>
          {!isUsers && <p className="text-muted">{SECTION_INFO[section].name.en}</p>}
        </div>
        <div className="flex flex-wrap gap-2">
          {key === "events" && (
            <Link href={`/admin/monthly?section=${section}`} className="btn btn-gold">
              <CalendarPlus size={18} /> Monthly Pinkam List
            </Link>
          )}
          {r.canCreate && (
            <Link href={`${base}/new${isUsers ? "" : `?section=${section}`}`} className="btn btn-primary">
              <Plus size={18} /> Add {r.singular}
            </Link>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {!isUsers && sections.length > 1 && (
          <div className="flex flex-wrap gap-2">
            {sections.map((s) => (
              <Link
                key={s}
                href={`${base}?section=${s}`}
                className={`rounded-full border px-3 py-1.5 text-sm ${s === section ? "border-accent bg-accent text-white" : "border-line bg-white hover:border-accent"}`}
              >
                {SECTION_INFO[s].short.en}
              </Link>
            ))}
          </div>
        )}
        {cardKind && (
          <div className="flex gap-1 rounded-xl bg-white p-1 shadow-[0_3px_0_var(--line)]">
            {(["cards", "table"] as const).map((v) => (
              <Link
                key={v}
                href={`${base}?section=${section}${q ? `&q=${encodeURIComponent(q)}` : ""}&view=${v}`}
                className={`rounded-lg px-3 py-1 text-sm font-semibold capitalize ${view === v ? "bg-accent text-white" : "text-ink"}`}
              >
                {v}
              </Link>
            ))}
          </div>
        )}
        <form className="ml-auto flex gap-2">
          {!isUsers && <input type="hidden" name="section" value={section} />}
          {cardKind && <input type="hidden" name="view" value={view} />}
          <input name="q" defaultValue={q} placeholder="Search…" className="input w-56 py-1.5!" />
        </form>
      </div>

      {cardKind && view === "cards" ? (
        <>
          <p className="text-sm text-muted">
            {rows.length} {key === "applications" ? "applications" : "students"} · {SECTION_INFO[section].name.en}
          </p>
          <StudentCards kind={cardKind} rows={rows} base={base} section={section} />
        </>
      ) : (
      <div className="card card-flat overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="hero-bg text-xs uppercase tracking-wide text-white shadow-[0_4px_0_rgba(0,0,0,0.2)]">
            <tr>
              {r.columns.map((c) => <th key={c} className="px-4 py-3 font-semibold">{labelOf(c)}</th>)}
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((row) => (
              <tr key={row.id} className={`hover:bg-paper ${key === "messages" && !row.isRead ? "font-semibold" : ""}`}>
                {r.columns.map((c) => <td key={c} className="px-4 py-3 align-middle">{cell(row, c)}</td>)}
                <td className="whitespace-nowrap px-4 py-3 text-right">
                  <Link href={`${base}/${row.id}${isUsers ? "" : `?section=${section}`}`} className="inline-block rounded-lg p-2 text-accent hover:bg-accent-soft" aria-label="Edit">
                    <Pencil size={16} />
                  </Link>
                  {!(isUsers && row.id === user.id) && <DeleteButton resourceKey={key} id={row.id} />}
                </td>
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td colSpan={r.columns.length + 1} className="px-4 py-10 text-center text-muted">Nothing here yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      )}
    </div>
  );
}
