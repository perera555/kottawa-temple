"use client";

import { useActionState, useState } from "react";
import { saveSettings } from "@/app/actions/admin";

type Values = Record<string, string | boolean>;

function F({ name, label, values, help, placeholder }: { name: string; label: string; values: Values; help?: string; placeholder?: string }) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      <input name={name} defaultValue={String(values[name] ?? "")} placeholder={placeholder} className="input" />
      {help && <span className="mt-1 block text-xs text-muted">{help}</span>}
    </label>
  );
}

export function SettingsForm({ section, values }: { section: string; values: Values }) {
  const [state, action, pending] = useActionState(saveSettings.bind(null, section), undefined);
  const [live, setLive] = useState(values.isLive === true);

  return (
    <form action={action} className="space-y-8">
      {/* LIVE */}
      <section className={`card card-flat p-6 ${live ? "ring-4 ring-red-500" : ""}`}>
        <h2 className="mb-1 flex items-center gap-2 font-display text-2xl text-accent">
          <span className={`h-3 w-3 rounded-full ${live ? "animate-pulse bg-red-600" : "bg-gray-300"}`} /> Live stream
        </h2>
        <p className="mb-4 text-sm text-muted">
          Going live on Facebook or YouTube? Paste the live video link and switch LIVE on. A red LIVE banner with the video appears at the top of this
          section&apos;s website. Switch it off when the live ends.
        </p>
        <label className="mb-4 flex items-center gap-3">
          <input type="checkbox" name="isLive" checked={live} onChange={(e) => setLive(e.target.checked)} className="h-6 w-6 accent-red-600" />
          <span className="text-lg font-semibold">{live ? "🔴 We are LIVE now" : "Not live"}</span>
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          <F name="liveUrl" label="Live video link" values={values} placeholder="https://www.facebook.com/.../videos/... or https://youtube.com/live/..." />
          <F name="liveTitle" label="Live title" values={values} placeholder="e.g. Poya Sil programme - live" />
        </div>
      </section>

      {/* SOCIAL */}
      <section className="card card-flat p-6">
        <h2 className="mb-4 font-display text-2xl text-accent">Social accounts</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <F name="facebookUrl" label="Facebook page" values={values} placeholder="https://www.facebook.com/yourpage" help="Its latest posts and live videos show automatically on the website." />
          <F name="youtubeUrl" label="YouTube channel" values={values} placeholder="https://www.youtube.com/@yourchannel" help="Paste your channel link once. New videos appear on the website automatically." />
          <F
            name="youtubeChannelId"
            label="YouTube channel ID (filled automatically)"
            values={values}
            placeholder="UCxxxxxxxxxxxxxxxxxxxxxx"
            help="Leave empty — it is found automatically from your channel link when you save."
          />
          <F name="instagramUrl" label="Instagram" values={values} placeholder="https://www.instagram.com/..." />
          <F name="tiktokUrl" label="TikTok" values={values} placeholder="https://www.tiktok.com/@..." />
        </div>
      </section>

      {/* CONTACT */}
      <section className="card card-flat p-6">
        <h2 className="mb-4 font-display text-2xl text-accent">Contact details</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <F name="phone" label="Phone" values={values} />
          <F name="whatsapp" label="WhatsApp - Principal / office" values={values} placeholder="+94 7X XXX XXXX" help="Parents can message this number from the Admission page." />
          <F name="teacherWhatsapp" label="WhatsApp - Teacher" values={values} placeholder="+94 7X XXX XXXX" />
          <F name="email" label="Email" values={values} />
          <F name="address" label="Address" values={values} />
          <F name="mapQuery" label="Map location" values={values} help='Place name as typed in Google Maps, or coordinates like "6.8412,79.9645".' />
        </div>
      </section>

      {state?.error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>}
      {state?.ok && <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-800">{state.message}</p>}
      <button className="btn btn-primary" disabled={pending}>{pending ? "Saving..." : "Save settings"}</button>
    </form>
  );
}
