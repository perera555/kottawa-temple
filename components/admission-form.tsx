"use client";

import { useActionState, useRef, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { submitApplication } from "@/app/actions/public";
import type { Lang } from "@/lib/site";

type Contact = { label: string; number: string };

const waLink = (number: string, text: string) => `https://wa.me/${number.replace(/[^\d]/g, "")}?text=${encodeURIComponent(text)}`;

function WhatsAppButton({ c, text }: { c: Contact; text: string }) {
  return (
    <a
      href={waLink(c.number, text)}
      target="_blank"
      rel="noreferrer"
      className="btn text-white"
      style={{ background: "#25d366", boxShadow: "inset 0 1px 0 rgba(255,255,255,.35), 0 4px 0 #128c4a" }}
    >
      <svg viewBox="0 0 24 24" width={18} height={18} fill="currentColor" aria-hidden="true">
        <path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3zm5.2 12.6c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-3.3-.8-2.8-1.1-4.5-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.3 0 .5l-.4.6-.3.4c.1.2.6 1 1.3 1.7.9.8 1.7 1.1 1.9 1.2.2.1.4.1.5-.1l.7-.9c.2-.2.4-.2.6-.1l1.9.9c.3.1.4.2.5.3.1.2.1.7-.1 1.3z" />
      </svg>
      {c.label}
    </a>
  );
}

function F({ name, label, type = "text", required = false, children }: { name: string; label: string; type?: string; required?: boolean; children?: React.ReactNode }) {
  return (
    <label className="block">
      <span className="label">{label}{required && " *"}</span>
      {children ?? <input name={name} type={type} required={required} className="input" />}
    </label>
  );
}

export function AdmissionForm({
  section,
  schoolName,
  lang,
  contacts,
  gradeOptions,
  defaults,
}: {
  section: "dhamma" | "montessori";
  schoolName: string;
  lang: Lang;
  contacts: Contact[];
  gradeOptions: string[];
  defaults?: { parentName?: string; email?: string };
}) {
  const [state, action, pending] = useActionState(submitApplication, undefined);
  const form = useRef<HTMLFormElement>(null);
  const [summary, setSummary] = useState("");
  const si = lang === "si";

  const buildMessage = () => {
    const fd = form.current ? new FormData(form.current) : null;
    const g = (k: string) => String(fd?.get(k) ?? "").trim();
    const lines = [
      `${schoolName} - ${si ? "ඇතුළත් වීමේ ඉල්ලීම" : "Admission request"}`,
      g("childName") && `${si ? "දරුවා" : "Child"}: ${g("childName")}`,
      g("dateOfBirth") && `${si ? "උපන් දිනය" : "Date of birth"}: ${g("dateOfBirth")}`,
      g("grade") && `${si ? "ශ්‍රේණිය" : "Grade/class"}: ${g("grade")}`,
      g("parentName") && `${si ? "මව/පියා" : "Parent"}: ${g("parentName")}`,
      g("phone") && `${si ? "දුරකථන" : "Phone"}: ${g("phone")}`,
      g("address") && `${si ? "ලිපිනය" : "Address"}: ${g("address")}`,
    ].filter(Boolean);
    return lines.length > 1 ? lines.join("\n") : `${schoolName} - ${si ? "මගේ දරුවා ඇතුළත් කිරීමට කැමතියි." : "I would like to register my child."}`;
  };

  if (state?.ok) {
    return (
      <div className="space-y-4">
        <p className="flex gap-2 rounded-xl bg-green-50 p-4 text-green-800">
          <CheckCircle2 className="mt-0.5 shrink-0" /> {state.message}
        </p>
        {contacts.length > 0 && (
          <div className="rounded-xl bg-paper p-4">
            <p className="mb-3 text-sm font-semibold">{si ? "WhatsApp මගින්ද දැනුම් දෙන්න:" : "Also let them know on WhatsApp:"}</p>
            <div className="flex flex-wrap gap-2">{contacts.map((c) => <WhatsAppButton key={c.label} c={c} text={summary} />)}</div>
          </div>
        )}
      </div>
    );
  }

  return (
    <form ref={form} action={action} onSubmit={() => setSummary(buildMessage())} className="space-y-6">
      <input type="hidden" name="section" value={section} />
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <fieldset className="space-y-4">
        <legend className="mb-2 font-display text-xl text-accent">{si ? "දරුවාගේ විස්තර" : "Child's details"}</legend>
        <F name="childName" label={si ? "දරුවාගේ සම්පූර්ණ නම" : "Child's full name"} required />
        <div className="grid gap-4 sm:grid-cols-3">
          <F name="dateOfBirth" label={si ? "උපන් දිනය" : "Date of birth"} type="date" />
          <F name="gender" label={si ? "ස්ත්‍රී/පුරුෂ" : "Gender"}>
            <select name="gender" className="input" defaultValue="">
              <option value="">-</option>
              <option value="boy">{si ? "පිරිමි ළමයා" : "Boy"}</option>
              <option value="girl">{si ? "ගැහැණු ළමයා" : "Girl"}</option>
            </select>
          </F>
          <F name="grade" label={si ? "ශ්‍රේණිය / පන්තිය" : "Grade / class"}>
            <select name="grade" className="input">
              {gradeOptions.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </F>
        </div>
        {section === "dhamma" && <F name="schoolName" label={si ? "පාසල" : "Day school"} />}
        <F name="notes" label={si ? "සෞඛ්‍ය / විශේෂ සටහන්" : "Medical / special notes"}>
          <textarea name="notes" rows={2} className="input" />
        </F>
        <F name="photo" label={si ? "දරුවාගේ ඡායාරූපය (අවශ්‍ය නම්)" : "Child's photo (optional)"}>
          <input type="file" name="photo" accept="image/*" className="block text-sm file:mr-3 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:text-white" />
        </F>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="mb-2 font-display text-xl text-accent">{si ? "දෙමාපිය විස්තර" : "Parent / guardian"}</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="label">{si ? "නම" : "Name"} *</span>
            <input name="parentName" required defaultValue={defaults?.parentName} className="input" />
          </label>
          <F name="relationship" label={si ? "සම්බන්ධතාවය" : "Relationship"}>
            <select name="relationship" className="input">
              <option value="mother">{si ? "මව" : "Mother"}</option>
              <option value="father">{si ? "පියා" : "Father"}</option>
              <option value="guardian">{si ? "භාරකරු" : "Guardian"}</option>
            </select>
          </F>
          <F name="phone" label={si ? "දුරකථන / WhatsApp" : "Phone / WhatsApp"} required />
          <label className="block">
            <span className="label">{si ? "විද්‍යුත් තැපෑල" : "Email"}</span>
            <input name="email" type="email" defaultValue={defaults?.email} className="input" />
          </label>
        </div>
        <F name="address" label={si ? "ලිපිනය" : "Address"} />
      </fieldset>

      <label className="flex items-start gap-2 text-sm">
        <input type="checkbox" name="consent" required className="mt-1 h-4 w-4" />
        {si ? "ඉහත විස්තර නිවැරදි බව සහතික කරමි." : "I confirm the details above are correct."}
      </label>

      {state?.error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>}
      <button className="btn btn-primary" disabled={pending}>{pending ? "..." : si ? "අයදුම්පත යවන්න" : "Submit application"}</button>

      {contacts.length > 0 && (
        <div className="rounded-2xl border border-dashed border-line bg-paper p-5">
          <p className="mb-1 font-semibold">{si ? "ඔන්ලයින් අයදුම් කළ නොහැකිද?" : "Can't apply online?"}</p>
          <p className="mb-3 text-sm text-muted">
            {si ? "WhatsApp මගින් කෙලින්ම පණිවිඩයක් යවන්න. ඔබ පුරවා ඇති විස්තර පණිවිඩයට එකතු වේ." : "Send a WhatsApp message instead — anything you've filled in above is added to the message."}
          </p>
          <div className="flex flex-wrap gap-2">
            {contacts.map((c) => (
              <a
                key={c.label}
                href={waLink(c.number, "")}
                onClick={(e) => {
                  e.preventDefault();
                  window.open(waLink(c.number, buildMessage()), "_blank", "noopener");
                }}
                className="btn text-white"
                style={{ background: "#25d366", boxShadow: "inset 0 1px 0 rgba(255,255,255,.35), 0 4px 0 #128c4a" }}
              >
                WhatsApp {c.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </form>
  );
}
