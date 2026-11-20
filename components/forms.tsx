"use client";

import { useActionState, useState } from "react";
import { CheckCircle2, Star } from "lucide-react";
import { login, register, type FormState } from "@/app/actions/auth";
import { bookDana, registerForProgramme, sendMessage, submitTestimonial, updateProfile } from "@/app/actions/public";
import { DANA_TYPES, tr, type Lang, type Section } from "@/lib/site";

function Alert({ state }: { state: FormState }) {
  if (!state) return null;
  if (state.error) return <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{state.error}</p>;
  if (state.ok && state.message)
    return (
      <p className="flex items-start gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-800" role="status">
        <CheckCircle2 size={18} className="mt-0.5 shrink-0" /> {state.message}
      </p>
    );
  return null;
}

const Honeypot = () => <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />;

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      {children}
    </label>
  );
}

export function ContactForm({ section, lang, defaults }: { section: Section; lang: Lang; defaults?: { name?: string; email?: string; phone?: string } }) {
  const [state, action, pending] = useActionState(sendMessage, undefined);
  if (state?.ok) return <Alert state={state} />;
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="section" value={section} />
      <Honeypot />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={lang === "si" ? "නම *" : "Name *"}><input name="name" required className="input" defaultValue={defaults?.name} /></Field>
        <Field label={lang === "si" ? "දුරකථන" : "Phone"}><input name="phone" className="input" defaultValue={defaults?.phone} /></Field>
      </div>
      <Field label={lang === "si" ? "විද්‍යුත් තැපෑල" : "Email"}><input name="email" type="email" className="input" defaultValue={defaults?.email} /></Field>
      <Field label={lang === "si" ? "මාතෘකාව" : "Subject"}><input name="subject" className="input" /></Field>
      <Field label={lang === "si" ? "පණිවිඩය *" : "Message *"}><textarea name="message" required rows={5} className="input" /></Field>
      <Alert state={state} />
      <button className="btn btn-primary" disabled={pending}>{pending ? "..." : lang === "si" ? "යවන්න" : "Send message"}</button>
    </form>
  );
}

export function DanaForm({ lang, defaults }: { lang: Lang; defaults?: { name?: string; email?: string; phone?: string } }) {
  const [state, action, pending] = useActionState(bookDana, undefined);
  const min = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  if (state?.ok) return <Alert state={state} />;
  return (
    <form action={action} className="space-y-4">
      <Honeypot />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={lang === "si" ? "දිනය *" : "Date *"}><input type="date" name="danaDate" min={min} required className="input" /></Field>
        <Field label={lang === "si" ? "පූජාව *" : "Offering *"}>
          <select name="danaType" className="input" defaultValue="noon">
            {Object.entries(DANA_TYPES).map(([k, v]) => <option key={k} value={k}>{tr(v, lang)}</option>)}
          </select>
        </Field>
        <Field label={lang === "si" ? "දායකයාගේ නම *" : "Donor name *"}><input name="name" required className="input" defaultValue={defaults?.name} /></Field>
        <Field label={lang === "si" ? "දුරකථන *" : "Phone *"}><input name="phone" required className="input" defaultValue={defaults?.phone} /></Field>
      </div>
      <Field label={lang === "si" ? "විද්‍යුත් තැපෑල" : "Email"}><input name="email" type="email" className="input" defaultValue={defaults?.email} /></Field>
      <Field label={lang === "si" ? "සටහන් (අනුස්මරණය, භික්ෂූන් ගණන ...)" : "Notes (in memory of, number of monks ...)"}><textarea name="notes" rows={3} className="input" /></Field>
      <Alert state={state} />
      <button className="btn btn-primary" disabled={pending}>{pending ? "..." : lang === "si" ? "ඉල්ලීම යවන්න" : "Request booking"}</button>
    </form>
  );
}

export function ReviewForm({ section, lang, defaultName, isMember }: { section: Section; lang: Lang; defaultName?: string; isMember: boolean }) {
  const [state, action, pending] = useActionState(submitTestimonial, undefined);
  const [rating, setRating] = useState(5);
  if (state?.ok) return <Alert state={state} />;
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="section" value={section} />
      <input type="hidden" name="rating" value={rating} />
      <Honeypot />
      <div>
        <span className="label">{lang === "si" ? "ඇගයීම" : "Your rating"}</span>
        <div className="flex gap-1" role="radiogroup">
          {[1, 2, 3, 4, 5].map((i) => (
            <button key={i} type="button" role="radio" aria-checked={rating === i} aria-label={`${i} stars`} onClick={() => setRating(i)}>
              <Star size={28} className={i <= rating ? "fill-flag-yellow text-flag-yellow" : "text-line"} />
            </button>
          ))}
        </div>
      </div>
      <Field label={lang === "si" ? "නම *" : "Name *"}><input name="name" required className="input" defaultValue={defaultName} /></Field>
      <Field label={lang === "si" ? "ඔබගේ අදහස *" : "Your review *"}><textarea name="message" required minLength={5} rows={4} className="input" /></Field>
      {!isMember && (
        <p className="text-xs text-muted">
          {lang === "si" ? "අමුත්තන්ගේ අදහස් අනුමත කළ පසු පළ වේ. සාමාජිකයින්ගේ අදහස් වහාම පළ වේ." : "Guest reviews appear after approval. Members' reviews are published immediately."}
        </p>
      )}
      <Alert state={state} />
      <button className="btn btn-primary" disabled={pending}>{pending ? "..." : lang === "si" ? "අදහස පළ කරන්න" : "Post review"}</button>
    </form>
  );
}

export function ProgrammeRegistrationForm({
  lang,
  events,
  selected,
  defaults,
}: {
  lang: Lang;
  events: { id: number; label: string }[];
  selected?: number;
  defaults?: { name?: string };
}) {
  const [state, action, pending] = useActionState(registerForProgramme, undefined);
  const si = lang === "si";
  if (state?.ok) return <Alert state={state} />;
  if (!events.length) return <p className="text-muted">{si ? "දැනට ලියාපදිංචිය විවෘත වැඩසටහන් නොමැත." : "No programmes are open for registration right now."}</p>;
  return (
    <form action={action} className="space-y-4">
      <Honeypot />
      <Field label={si ? "වැඩසටහන *" : "Programme *"}>
        <select name="eventId" className="input" defaultValue={selected ?? events[0].id} required>
          {events.map((e) => <option key={e.id} value={e.id}>{e.label}</option>)}
        </select>
      </Field>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label={si ? "නම *" : "Name *"}><input name="name" required className="input" defaultValue={defaults?.name} /></Field>
        <Field label={si ? "දුරකථන *" : "Phone *"}><input name="phone" required className="input" /></Field>
        <Field label={si ? "පුද්ගලයින් ගණන" : "No. of people"}><input name="people" type="number" min={1} max={50} defaultValue={1} className="input" /></Field>
      </div>
      <Field label={si ? "සටහන්" : "Notes"}><textarea name="notes" rows={2} className="input" /></Field>
      <Alert state={state} />
      <button className="btn btn-primary" disabled={pending}>{pending ? "..." : si ? "ලියාපදිංචි වන්න" : "Register"}</button>
    </form>
  );
}

export function LoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState(login, undefined);
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="next" value={next ?? ""} />
      <Field label="Email"><input name="email" type="email" required autoComplete="email" className="input" /></Field>
      <Field label="Password"><input name="password" type="password" required autoComplete="current-password" className="input" /></Field>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="remember" defaultChecked className="h-4 w-4" /> Keep me signed in (90 days) / මාව මතක තබාගන්න
      </label>
      <Alert state={state} />
      <button className="btn btn-primary w-full justify-center" disabled={pending}>{pending ? "Signing in..." : "Login"}</button>
    </form>
  );
}

export function RegisterForm() {
  const [state, action, pending] = useActionState(register, undefined);
  return (
    <form action={action} className="space-y-4">
      <Field label="Full name / සම්පූර්ණ නම *"><input name="name" required className="input" autoComplete="name" /></Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Email *"><input name="email" type="email" required className="input" autoComplete="email" /></Field>
        <Field label="Phone / දුරකථන"><input name="phone" className="input" autoComplete="tel" /></Field>
      </div>
      <Field label="Address / ලිපිනය"><input name="address" className="input" autoComplete="street-address" /></Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Password * (min 8)"><input name="password" type="password" required minLength={8} className="input" autoComplete="new-password" /></Field>
        <Field label="Confirm password *"><input name="confirm" type="password" required minLength={8} className="input" autoComplete="new-password" /></Field>
      </div>
      <Alert state={state} />
      <button className="btn btn-primary w-full justify-center" disabled={pending}>{pending ? "Creating account..." : "Create account / ගිණුම සාදන්න"}</button>
    </form>
  );
}

export function ProfileForm({ user }: { user: { name: string; phone: string; address: string; avatarUrl: string } }) {
  const [state, action, pending] = useActionState(updateProfile, undefined);
  const [preview, setPreview] = useState(user.avatarUrl);
  return (
    <form action={action} className="space-y-4">
      <div className="flex items-center gap-4">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="" className="h-20 w-20 rounded-full border-4 border-white object-cover shadow-[0_8px_20px_-6px_rgba(0,0,0,0.4)]" />
        ) : (
          <span className="grid h-20 w-20 place-items-center rounded-full bg-flag-orange text-3xl font-bold text-white shadow-[0_8px_20px_-6px_rgba(0,0,0,0.4)]">
            {user.name.slice(0, 1).toUpperCase()}
          </span>
        )}
        <label className="block">
          <span className="label">Profile picture</span>
          <input
            type="file"
            name="avatar"
            accept="image/*"
            className="text-sm file:mr-3 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:text-white"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) setPreview(URL.createObjectURL(f));
            }}
          />
        </label>
      </div>
      <Field label="Full name"><input name="name" required className="input" defaultValue={user.name} /></Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Phone"><input name="phone" className="input" defaultValue={user.phone} /></Field>
        <Field label="Address"><input name="address" className="input" defaultValue={user.address} /></Field>
      </div>
      <Field label="New password (leave empty to keep)"><input name="password" type="password" minLength={8} className="input" autoComplete="new-password" /></Field>
      <Alert state={state} />
      <button className="btn btn-primary" disabled={pending}>{pending ? "Saving..." : "Save profile"}</button>
    </form>
  );
}
