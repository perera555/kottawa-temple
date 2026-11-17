import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";
import { desc, eq } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import { RecordForm } from "@/components/admin/record-form";
import { AdminResetCode } from "@/components/password-forms";
import { allowedSections, canManage, requireAdmin } from "@/lib/auth";
import { db, schema } from "@/lib/db";
import { isResourceKey, RESOURCES } from "@/lib/resources";
import { SECTION_INFO } from "@/lib/site";
import { TABLES } from "@/lib/tables";

/* eslint-disable @typescript-eslint/no-explicit-any */

export default async function EditRecord({ params, searchParams }: PageProps<"/admin/[resource]/[id]">) {
  await connection();
  const { resource: key, id: idParam } = await params;
  const sp = await searchParams;
  if (!isResourceKey(key)) notFound();
  const user = await requireAdmin();
  const r = RESOURCES[key];
  if (r.superAdminOnly && user.role !== "super_admin") redirect("/admin");

  const isNew = idParam === "new";
  if (isNew && !r.canCreate) notFound();
  const id = isNew ? null : Number(idParam);
  if (!isNew && !Number.isInteger(id)) notFound();

  let values: Record<string, unknown> = {};
  if (id) {
    const table = TABLES[key] as any;
    const [row] = await db.select().from(table).where(eq(table.id, id)).limit(1);
    if (!row) notFound();
    if (key !== "users" && !canManage(user, (row as any).section)) redirect("/admin");
    values = row as Record<string, unknown>;
  }

  const sections = allowedSections(user)
    .filter((s) => r.sections.includes(s))
    .map((s) => ({ value: s, label: SECTION_INFO[s].name.en }));
  const section = (values.section as string) ?? (typeof sp.section === "string" ? sp.section : sections[0]?.value);
  let fields = r.fields;
  if (key === "registrations") {
    const evs = await db
      .select({ id: schema.events.id, title: schema.events.title, eventDate: schema.events.eventDate, section: schema.events.section })
      .from(schema.events)
      .where(eq(schema.events.allowRegistration, true))
      .orderBy(desc(schema.events.id));
    fields = fields.map((f) =>
      f.name === "eventId"
        ? {
            ...f,
            label: "Programme",
            type: "select" as const,
            options: evs.filter((e) => canManage(user, e.section)).map((e) => ({ value: String(e.id), label: `${e.eventDate ?? "Regular"} · ${e.title}` })),
          }
        : f
    );
  }
  const back = key === "users" ? `/admin/${key}` : `/admin/${key}?section=${section}`;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link href={back} className="inline-flex items-center gap-1 text-sm text-muted hover:text-accent">
        <ArrowLeft size={16} /> Back to {r.label}
      </Link>
      <h1 className="font-display text-3xl text-accent">{isNew ? `Add ${r.singular}` : `Edit ${r.singular}`}</h1>
      {key === "users" && values.memberNo ? (
        <p className="rounded-xl bg-accent-soft px-4 py-2 text-sm">Registration No: <b className="font-mono">{String(values.memberNo)}</b></p>
      ) : null}
      {key === "users" && id && user.role === "super_admin" ? <AdminResetCode userId={id} email={String(values.email)} /> : null}
      <RecordForm resourceKey={key} id={id} fields={fields} values={values} sections={sections} section={section} backHref={back} />
    </div>
  );
}
