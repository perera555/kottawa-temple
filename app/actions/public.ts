"use server";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { db, schema } from "@/lib/db";
import { DANA_TYPES, SECTIONS, type Section } from "@/lib/site";
import { saveImage } from "@/lib/upload";
import type { FormState } from "./auth";

const str = (fd: FormData, k: string, max = 2000) => String(fd.get(k) ?? "").trim().slice(0, max);
const section = (fd: FormData): Section => {
  const s = str(fd, "section");
  return (SECTIONS as string[]).includes(s) ? (s as Section) : "temple";
};

export async function sendMessage(_: FormState, fd: FormData): Promise<FormState> {
  if (str(fd, "website")) return { ok: true, message: "Thank you!" }; // honeypot
  const name = str(fd, "name", 120);
  const message = str(fd, "message", 4000);
  if (!name || !message) return { error: "Please fill your name and message." };
  const session = await getSession();
  await db.insert(schema.messages).values({
    userId: session?.id ?? null,
    section: section(fd),
    name,
    message,
    email: str(fd, "email", 200),
    phone: str(fd, "phone", 40),
    subject: str(fd, "subject", 200),
  });
  return { ok: true, message: "Thank you! Your message has been sent. / ස්තූතියි! ඔබගේ පණිවිඩය ලැබුණා." };
}

export async function bookDana(_: FormState, fd: FormData): Promise<FormState> {
  if (str(fd, "website")) return { ok: true };
  const name = str(fd, "name", 120);
  const phone = str(fd, "phone", 40);
  const danaDate = str(fd, "danaDate", 10);
  const danaType = str(fd, "danaType", 40);
  if (!name || !phone || !/^\d{4}-\d{2}-\d{2}$/.test(danaDate)) {
    return { error: "Please enter your name, phone number and a date." };
  }
  if (!(danaType in DANA_TYPES)) return { error: "Please choose a dana type." };
  if (danaDate < new Date().toISOString().slice(0, 10)) return { error: "Please choose a future date." };

  const session = await getSession();
  await db.insert(schema.danaBookings).values({
    userId: session?.id ?? null,
    name,
    phone,
    danaDate,
    danaType,
    email: str(fd, "email", 200),
    notes: str(fd, "notes", 1000),
  });
  revalidatePath("/dana");
  return {
    ok: true,
    message: "Your request was received. The temple will call you to confirm. / ඔබගේ ඉල්ලීම ලැබුණා. තහවුරු කිරීමට විහාරස්ථානයෙන් අමතනු ඇත.",
  };
}

export async function registerForProgramme(_: FormState, fd: FormData): Promise<FormState> {
  if (str(fd, "website")) return { ok: true };
  const eventId = Number(str(fd, "eventId", 12));
  const name = str(fd, "name", 120);
  const phone = str(fd, "phone", 40);
  const people = Math.min(50, Math.max(1, Number(str(fd, "people", 3)) || 1));
  if (!eventId || !name || !phone) return { error: "Please choose a programme and enter your name and phone." };
  const [ev] = await db.select().from(schema.events).where(eq(schema.events.id, eventId)).limit(1);
  if (!ev || !ev.allowRegistration) return { error: "Registration is not open for this programme." };
  const session = await getSession();
  await db.insert(schema.registrations).values({
    section: ev.section,
    eventId,
    userId: session?.id ?? null,
    name,
    phone,
    people,
    notes: str(fd, "notes", 1000),
  });
  return { ok: true, message: `Registered for "${ev.title}". See you there! / ලියාපදිංචිය සාර්ථකයි.` };
}

/** Online student registration for the Dhamma School / Montessori. */
export async function submitApplication(_: FormState, fd: FormData): Promise<FormState> {
  if (str(fd, "website")) return { ok: true };
  const sec = str(fd, "section");
  if (sec !== "dhamma" && sec !== "montessori") return { error: "Unknown school." };
  const childName = str(fd, "childName", 150);
  const parentName = str(fd, "parentName", 150);
  const phone = str(fd, "phone", 40);
  const dob = str(fd, "dateOfBirth", 10);
  if (!childName || !parentName || !phone) return { error: "Please enter the child's name, parent's name and phone number." };
  if (dob && !/^\d{4}-\d{2}-\d{2}$/.test(dob)) return { error: "Please check the date of birth." };
  if (fd.get("consent") !== "on") return { error: "Please confirm the details are correct." };

  let photoUrl = "";
  const photo = fd.get("photo");
  if (photo instanceof File && photo.size > 0) {
    try {
      photoUrl = await saveImage(photo, "applications");
    } catch (e) {
      return { error: (e as Error).message };
    }
  }
  const session = await getSession();
  const [row] = await db
    .insert(schema.applications)
    .values({
      section: sec,
      userId: session?.id ?? null,
      childName,
      dateOfBirth: dob || null,
      gender: str(fd, "gender", 10),
      grade: str(fd, "grade", 60),
      schoolName: str(fd, "schoolName", 150),
      parentName,
      relationship: str(fd, "relationship", 40),
      phone,
      email: str(fd, "email", 200),
      address: str(fd, "address", 300),
      notes: str(fd, "notes", 1000),
      photoUrl,
    })
    .returning({ id: schema.applications.id });
  return {
    ok: true,
    message: `Application #${row.id} received. The ${sec === "dhamma" ? "Dhamma School" : "pre school"} will contact you soon. / ඔබගේ අයදුම්පත ලැබුණා. ඉක්මනින් අමතනු ඇත.`,
  };
}

export async function submitTestimonial(_: FormState, fd: FormData): Promise<FormState> {
  if (str(fd, "website")) return { ok: true };
  const name = str(fd, "name", 120);
  const message = str(fd, "message", 1500);
  if (!name || message.length < 5) return { error: "Please enter your name and a review." };
  const rating = Math.min(5, Math.max(1, Number(str(fd, "rating", 1)) || 5));
  const session = await getSession();
  // Members' reviews are published immediately; guest reviews wait for admin approval
  const approved = !!session;
  const sec = section(fd);
  await db.insert(schema.testimonials).values({ userId: session?.id ?? null, section: sec, name, rating, message, approved });
  revalidatePath("/", "layout");
  return {
    ok: true,
    message: approved
      ? "Thank you! Your review is now published. / ස්තූතියි! ඔබගේ අදහස පළ විය."
      : "Thank you! Your review will appear after approval. / ස්තූතියි! අනුමත කළ පසු පළ වේ.",
  };
}

export async function updateProfile(_: FormState, fd: FormData): Promise<FormState> {
  const session = await getSession();
  if (!session) return { error: "Please log in again." };
  const name = str(fd, "name", 120);
  if (!name) return { error: "Name is required." };
  const values: Partial<typeof schema.users.$inferInsert> = {
    name,
    phone: str(fd, "phone", 40),
    address: str(fd, "address", 300),
  };
  const avatar = fd.get("avatar");
  if (avatar instanceof File && avatar.size > 0) {
    try {
      values.avatarUrl = await saveImage(avatar, "avatars");
    } catch (e) {
      return { error: (e as Error).message };
    }
  }
  const password = str(fd, "password", 200);
  if (password) {
    if (password.length < 8) return { error: "Password must be at least 8 characters." };
    values.passwordHash = await bcrypt.hash(password, 10);
  }
  await db.update(schema.users).set(values).where(eq(schema.users.id, session.id));
  revalidatePath("/account");
  return { ok: true, message: "Profile updated." };
}
