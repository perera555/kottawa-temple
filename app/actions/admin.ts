"use server";

import bcrypt from "bcryptjs";
import { and, eq, ne, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { allowedSections, canManage, getSession } from "@/lib/auth";
import { db, schema } from "@/lib/db";
import { assignMemberNo, formatMemberNo } from "@/lib/member-no";
import { isResourceKey, RESOURCES, type ResourceKey } from "@/lib/resources";
import { isAdminRole } from "@/lib/session";
import { TABLES } from "@/lib/tables";
import { saveImage } from "@/lib/upload";
import type { FormState } from "./auth";

/* eslint-disable @typescript-eslint/no-explicit-any */

async function adminOrThrow(key: ResourceKey) {
  const user = await getSession();
  if (!user || !isAdminRole(user.role)) throw new Error("Unauthorized");
  if (RESOURCES[key].superAdminOnly && user.role !== "super_admin") throw new Error("Forbidden");
  return user;
}

function revalidateSite() {
  revalidatePath("/", "layout");
}

export async function saveRecord(
  key: string,
  id: number | null,
  _prev: FormState,
  fd: FormData
): Promise<FormState> {
  if (!isResourceKey(key)) return { error: "Unknown resource" };
  const resource = RESOURCES[key];
  let user;
  try {
    user = await adminOrThrow(key);
  } catch (e) {
    return { error: (e as Error).message };
  }
  const table = TABLES[key] as any;

  const values: Record<string, unknown> = {};

  // Section (users table has no section)
  if (key !== "users") {
    const section = String(fd.get("section") ?? "");
    if (!canManage(user, section) || !resource.sections.includes(section as never)) {
      return { error: "You cannot manage this section." };
    }
    values.section = section;
  }

  try {
    for (const f of resource.fields) {
      const raw = fd.get(f.name);
      switch (f.type) {
        case "checkbox":
          values[f.name] = raw === "on";
          break;
        case "number": {
          const s = String(raw ?? "").trim();
          values[f.name] = s === "" ? (f.name === "sortOrder" ? 0 : null) : Number(s);
          if (s !== "" && Number.isNaN(values[f.name])) return { error: `${f.label} must be a number.` };
          break;
        }
        case "date": {
          const s = String(raw ?? "").trim();
          values[f.name] = s === "" ? null : s;
          break;
        }
        case "image": {
          const file = fd.get(`${f.name}__file`);
          if (file instanceof File && file.size > 0) {
            values[f.name] = await saveImage(file, key);
          } else {
            values[f.name] = String(raw ?? "").trim();
          }
          break;
        }
        case "password":
          break;
        case "agenda": {
          let items: unknown = [];
          try {
            items = JSON.parse(String(raw ?? "[]"));
          } catch {}
          const clean = (Array.isArray(items) ? items : []).slice(0, 40).map((x: any) => ({
            time: String(x?.time ?? "").slice(0, 40),
            activity: String(x?.activity ?? "").slice(0, 200),
            monk: String(x?.monk ?? "").slice(0, 120),
            from: String(x?.from ?? "").slice(0, 120),
          }));
          values[f.name] = JSON.stringify(clean);
          break;
        }
        default:
          values[f.name] = String(raw ?? "").trim();
          if (f.name === "rating") values[f.name] = Math.min(5, Math.max(1, Number(values[f.name]) || 5));
          if (f.name === "eventId") values[f.name] = Number(values[f.name]) || null;
      }
      if (f.required && (values[f.name] === "" || values[f.name] == null) && f.type !== "password") {
        return { error: `${f.label} is required.` };
      }
    }
  } catch (e) {
    return { error: (e as Error).message };
  }

  // Columns that must not be null
  if (key === "posts" && !values.publishedAt) values.publishedAt = new Date().toISOString().slice(0, 10);

  if (key === "users") {
    const email = String(values.email).toLowerCase();
    values.email = email;
    const dup = await db
      .select({ id: schema.users.id })
      .from(schema.users)
      .where(id ? and(eq(sql`lower(${schema.users.email})`, email), ne(schema.users.id, id)) : eq(sql`lower(${schema.users.email})`, email))
      .limit(1);
    if (dup.length) return { error: "Another account already uses this email." };

    const memberNo = String(values.memberNo ?? "").trim().toUpperCase();
    values.memberNo = memberNo || null;
    if (memberNo) {
      const taken = await db
        .select({ id: schema.users.id })
        .from(schema.users)
        .where(id ? and(eq(schema.users.memberNo, memberNo), ne(schema.users.id, id)) : eq(schema.users.memberNo, memberNo))
        .limit(1);
      if (taken.length) return { error: `Registration No. ${memberNo} is already used.` };
    } else if (id) {
      values.memberNo = formatMemberNo(id);
    }

    const password = String(fd.get("password") ?? "");
    if (!id && password.length < 8) return { error: "Password must be at least 8 characters." };
    if (password) {
      if (password.length < 8) return { error: "Password must be at least 8 characters." };
      values.passwordHash = await bcrypt.hash(password, 10);
    }
    if (id === user.id && values.role !== "super_admin") {
      return { error: "You cannot remove your own super admin role." };
    }
  }

  if (id) {
    // Make sure the existing record belongs to a section this admin manages
    if (key !== "users") {
      const [existing] = await db.select().from(table).where(eq(table.id, id)).limit(1);
      if (!existing || !canManage(user, (existing as any).section)) return { error: "Not found." };
    }
    await db.update(table).set(values).where(eq(table.id, id));
    if (key === "applications") await acceptApplication(id);
  } else {
    const [row] = await db.insert(table).values(values).returning();
    if (key === "users" && !values.memberNo) await assignMemberNo((row as any).id);
    if (key === "applications") await acceptApplication((row as any).id);
  }

  revalidateSite();
  const back = key === "users" ? `/admin/${key}` : `/admin/${key}?section=${values.section}`;
  redirect(back);
}

export async function deleteRecord(key: string, id: number) {
  if (!isResourceKey(key)) throw new Error("Unknown resource");
  const user = await adminOrThrow(key);
  const table = TABLES[key] as any;
  if (key === "users") {
    if (id === user.id) throw new Error("You cannot delete your own account.");
  } else {
    const [existing] = await db.select().from(table).where(eq(table.id, id)).limit(1);
    if (!existing || !canManage(user, (existing as any).section)) throw new Error("Not found.");
  }
  await db.delete(table).where(eq(table.id, id));
  revalidateSite();
}

/** Quick status toggles from list views (approve testimonial, confirm dana, mark read). */
export async function quickUpdate(key: string, id: number, field: string, value: string | boolean) {
  if (!isResourceKey(key)) throw new Error("Unknown resource");
  const user = await adminOrThrow(key);
  const allowed: Record<string, string[]> = {
    testimonials: ["approved"],
    dana: ["status"],
    messages: ["isRead"],
    posts: ["pinned"],
    students: ["showOnWebsite"],
    applications: ["status"],
  };
  if (!allowed[key]?.includes(field)) throw new Error("Not allowed");
  const table = TABLES[key] as any;
  const [existing] = await db.select().from(table).where(eq(table.id, id)).limit(1);
  if (!existing || !canManage(user, (existing as any).section)) throw new Error("Not found.");
  await db.update(table).set({ [field]: value }).where(eq(table.id, id));
  if (key === "applications") await acceptApplication(id);
  revalidateSite();
}

/** Monthly pinkam list: create many activities in one go. */
export async function bulkCreateEvents(section: string, _prev: FormState, fd: FormData): Promise<FormState> {
  const user = await getSession();
  if (!user || !isAdminRole(user.role) || !canManage(user, section)) return { error: "Unauthorized" };
  const get = (k: string) => fd.getAll(k).map((v) => String(v).trim());
  const dates = get("eventDate");
  const cats = get("category");
  const titles = get("title");
  const hosts = get("host");
  const preachers = get("preacher");
  const froms = get("preacherFrom");
  const starts = get("startTime");
  const ends = get("endTime");
  const regs = get("allowRegistration");

  const rows = dates
    .map((d, i) => ({
      section,
      eventDate: d,
      category: cats[i] || "other",
      title: titles[i],
      host: hosts[i] ?? "",
      preacher: preachers[i] ?? "",
      preacherFrom: froms[i] ?? "",
      startTime: starts[i] ?? "",
      endTime: ends[i] ?? "",
      allowRegistration: regs[i] === "yes",
    }))
    .filter((r) => r.eventDate && r.title);

  if (!rows.length) return { error: "Add at least one row with a date and a title." };
  if (rows.some((r) => !/^\d{4}-\d{2}-\d{2}$/.test(r.eventDate))) return { error: "One of the dates is invalid." };

  await db.insert(schema.events).values(rows);
  revalidateSite();
  redirect(`/admin/events?section=${section}`);
}

/** Daily dana roster for a whole month: inputs named `<date>|<slot>|donor` and `<date>|<slot>|phone`. */
export async function saveDailyDana(month: string, _prev: FormState, fd: FormData): Promise<FormState> {
  const user = await getSession();
  if (!user || !isAdminRole(user.role) || !canManage(user, "temple")) return { error: "Unauthorized" };
  if (!/^\d{4}-\d{2}$/.test(month)) return { error: "Invalid month" };

  const rows: { danaDate: string; slot: string; donor: string; phone: string }[] = [];
  const empty: { danaDate: string; slot: string }[] = [];
  for (const [k, v] of fd.entries()) {
    const m = /^(\d{4}-\d{2}-\d{2})\|(morning|noon|evening)\|donor$/.exec(k);
    if (!m || !m[1].startsWith(month)) continue;
    const donor = String(v).trim().slice(0, 200);
    const phone = String(fd.get(`${m[1]}|${m[2]}|phone`) ?? "").trim().slice(0, 40);
    if (donor) rows.push({ danaDate: m[1], slot: m[2], donor, phone });
    else empty.push({ danaDate: m[1], slot: m[2] });
  }

  for (const r of rows) {
    await db
      .insert(schema.dailyDana)
      .values({ ...r, updatedAt: new Date() })
      .onConflictDoUpdate({ target: [schema.dailyDana.danaDate, schema.dailyDana.slot], set: { donor: r.donor, phone: r.phone, updatedAt: new Date() } });
  }
  for (const e of empty) {
    await db.delete(schema.dailyDana).where(and(eq(schema.dailyDana.danaDate, e.danaDate), eq(schema.dailyDana.slot, e.slot)));
  }
  revalidateSite();
  return { ok: true, message: `Saved ${rows.length} dana entries for ${month}.` };
}

async function resolveYoutubeChannelId(url: string): Promise<string | null> {
  const direct = /youtube\.com\/channel\/(UC[\w-]{20,})/.exec(url);
  if (direct) return direct[1];
  try {
    const res = await fetch(url, { headers: { "accept-language": "en" }, signal: AbortSignal.timeout(8000) });
    const html = await res.text();
    const m =
      /<meta itemprop="identifier" content="(UC[\w-]{20,})"/.exec(html) ||
      /"externalId":"(UC[\w-]{20,})"/.exec(html) ||
      /"channelId":"(UC[\w-]{20,})"/.exec(html) ||
      /youtube\.com\/channel\/(UC[\w-]{20,})/.exec(html);
    return m?.[1] ?? null;
  } catch {
    return null;
  }
}

/**
 * When an application is accepted, create the student (once) with an admission
 * number like DS-2026-001 (Dhamma School) or MT-2026-001 (Montessori).
 */
async function acceptApplication(id: number) {
  const [app] = await db.select().from(schema.applications).where(eq(schema.applications.id, id)).limit(1);
  if (!app || app.status !== "accepted") return;
  const existing = await db
    .select({ id: schema.students.id })
    .from(schema.students)
    .where(and(eq(schema.students.section, app.section), eq(schema.students.name, app.childName), eq(schema.students.guardianName, app.parentName)))
    .limit(1);
  if (existing.length && app.admissionNo) return;

  let admissionNo = app.admissionNo;
  if (!admissionNo) {
    const prefix = `${app.section === "dhamma" ? "DS" : "MT"}-${new Date().getFullYear()}-`;
    const rows = await db
      .select({ no: schema.students.admissionNo })
      .from(schema.students)
      .where(and(eq(schema.students.section, app.section), sql`${schema.students.admissionNo} like ${prefix + "%"}`));
    const next = rows.reduce((m, r) => Math.max(m, Number(r.no.slice(prefix.length)) || 0), 0) + 1;
    admissionNo = prefix + String(next).padStart(3, "0");
  }
  const age = app.dateOfBirth ? Math.floor((Date.now() - new Date(app.dateOfBirth).getTime()) / (365.25 * 86400000)) : null;
  if (!existing.length) {
    await db.insert(schema.students).values({
      section: app.section,
      admissionNo,
      name: app.childName,
      grade: app.grade,
      age,
      guardianName: app.parentName,
      contact: app.phone,
      imageUrl: app.photoUrl,
      active: true,
    });
  }
  await db.update(schema.applications).set({ admissionNo }).where(eq(schema.applications.id, id));
}

/** One-click Go Live / End Live from the dashboard. */
export async function setLive(section: string, _prev: FormState, fd: FormData): Promise<FormState> {
  const user = await getSession();
  if (!user || !isAdminRole(user.role) || !canManage(user, section)) return { error: "Unauthorized" };
  const isLive = fd.get("action") === "start";
  const raw = String(fd.get("liveUrl") ?? "").trim();
  const liveUrl = raw && !/^https?:\/\//i.test(raw) ? `https://${raw}` : raw;
  const liveTitle = String(fd.get("liveTitle") ?? "").trim().slice(0, 200);
  if (isLive && !liveUrl) return { error: "Paste the Facebook or YouTube live link first." };
  const set = isLive ? { isLive, liveUrl, liveTitle, updatedAt: new Date() } : { isLive: false, updatedAt: new Date() };
  await db
    .insert(schema.sectionSettings)
    .values({ section, ...set })
    .onConflictDoUpdate({ target: schema.sectionSettings.section, set });
  revalidateSite();
  return { ok: true, message: isLive ? "You are LIVE on the website." : "Live ended." };
}

/** Save a section's contact, social and live settings. */
export async function saveSettings(section: string, _prev: FormState, fd: FormData): Promise<FormState> {
  const user = await getSession();
  if (!user || !isAdminRole(user.role) || !canManage(user, section)) return { error: "Unauthorized" };
  const s = (k: string, max = 500) => String(fd.get(k) ?? "").trim().slice(0, max);
  const url = (k: string) => {
    const v = s(k);
    if (!v) return "";
    return /^https?:\/\//i.test(v) ? v : `https://${v}`;
  };
  const values = {
    phone: s("phone", 60),
    email: s("email", 200),
    whatsapp: s("whatsapp", 40),
    teacherWhatsapp: s("teacherWhatsapp", 40),
    address: s("address", 300),
    mapQuery: s("mapQuery", 300),
    facebookUrl: url("facebookUrl"),
    youtubeUrl: url("youtubeUrl"),
    youtubeChannelId: s("youtubeChannelId", 60),
    instagramUrl: url("instagramUrl"),
    tiktokUrl: url("tiktokUrl"),
    isLive: fd.get("isLive") === "on",
    liveUrl: url("liveUrl"),
    liveTitle: s("liveTitle", 200),
    updatedAt: new Date(),
  };
  if (values.isLive && !values.liveUrl) return { error: "Paste the live video link before switching LIVE on." };

  // Find the YouTube channel ID automatically from a normal channel link (@handle, /c/, /user/)
  if (values.youtubeUrl && !/^UC[\w-]{20,}$/.test(values.youtubeChannelId)) {
    values.youtubeChannelId = (await resolveYoutubeChannelId(values.youtubeUrl)) ?? values.youtubeChannelId;
  }
  await db
    .insert(schema.sectionSettings)
    .values({ section, ...values })
    .onConflictDoUpdate({ target: schema.sectionSettings.section, set: values });
  revalidateSite();
  return { ok: true, message: values.isLive ? "Saved — the LIVE banner is now showing on the website." : "Settings saved." };
}

export async function listSectionsFor() {
  const user = await getSession();
  return user ? allowedSections(user) : [];
}
