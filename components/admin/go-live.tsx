"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Radio } from "lucide-react";
import { setLive } from "@/app/actions/admin";

/** Dashboard card: paste the live link, press Go Live. Press End Live afterwards. */
export function GoLive({ section, isLive, liveUrl, liveTitle, connected }: { section: string; isLive: boolean; liveUrl: string; liveTitle: string; connected: string[] }) {
  const [state, action, pending] = useActionState(setLive.bind(null, section), undefined);
  const live = state?.ok ? state.message?.startsWith("You are LIVE") ?? isLive : isLive;

  return (
    <form action={action} className={`card card-flat p-5 ${live ? "ring-4 ring-red-500" : ""}`}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 font-display text-xl text-accent">
          <Radio className={live ? "animate-pulse text-red-600" : ""} size={20} /> {live ? "You are LIVE" : "Go Live"}
        </h2>
        <Link href={`/admin/settings?section=${section}`} className="text-xs text-accent hover:underline">
          Social media setup →
        </Link>
      </div>
      <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
        <input name="liveUrl" defaultValue={liveUrl} placeholder="Paste Facebook / YouTube live link" className="input" />
        <input name="liveTitle" defaultValue={liveTitle} placeholder="Title (optional)" className="input" />
        <div className="flex gap-2">
          <button name="action" value="start" disabled={pending} className="btn whitespace-nowrap bg-red-600 text-white shadow-[0_4px_0_#7f1010] hover:-translate-y-0.5">
            ● Go Live
          </button>
          {live && (
            <button name="action" value="stop" disabled={pending} className="btn btn-ghost whitespace-nowrap">
              End Live
            </button>
          )}
        </div>
      </div>
      <p className="mt-3 text-xs text-muted">
        Connected: {connected.length ? connected.join(" · ") : "nothing yet — open Social media setup and paste your page links once."}
      </p>
      {state?.error && <p className="mt-2 text-sm text-red-700">{state.error}</p>}
      {state?.ok && <p className="mt-2 text-sm text-green-700">{state.message}</p>}
    </form>
  );
}
