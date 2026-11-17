"use client";

import { useActionState } from "react";
import { saveDailyDana } from "@/app/actions/admin";

type Entry = { donor: string; phone: string };
const SLOTS = [
  { key: "morning", label: "🌅 Morning (උදේ)" },
  { key: "noon", label: "☀️ Noon (දවල්)" },
  { key: "evening", label: "🌇 Evening (හවස)" },
] as const;

export function DailyDanaForm({ month, existing }: { month: string; existing: Record<string, Entry> }) {
  const [state, action, pending] = useActionState(saveDailyDana.bind(null, month), undefined);
  const [y, m] = month.split("-").map(Number);
  const days = new Date(y, m, 0).getDate();
  const today = new Date().toISOString().slice(0, 10);

  return (
    <form action={action} className="space-y-4">
      <div className="card card-flat overflow-x-auto">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="hero-bg sticky top-0 text-left text-xs uppercase tracking-wider text-white">
            <tr>
              <th className="px-3 py-3">Date</th>
              {SLOTS.map((s) => <th key={s.key} className="px-3 py-3">{s.label}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {Array.from({ length: days }, (_, i) => {
              const date = `${month}-${String(i + 1).padStart(2, "0")}`;
              const d = new Date(date + "T00:00:00");
              const weekend = d.getDay() === 0 || d.getDay() === 6;
              return (
                <tr key={date} className={`${date === today ? "bg-accent-soft" : weekend ? "bg-paper" : ""}`}>
                  <td className="whitespace-nowrap px-3 py-2">
                    <span className="font-semibold">{i + 1}</span>{" "}
                    <span className="text-xs text-muted">{d.toLocaleDateString("en-GB", { weekday: "short" })}</span>
                  </td>
                  {SLOTS.map((s) => {
                    const e = existing[`${date}|${s.key}`];
                    return (
                      <td key={s.key} className="px-2 py-1.5">
                        <div className="flex gap-1.5">
                          <input name={`${date}|${s.key}|donor`} defaultValue={e?.donor} placeholder="Donor / family" className="input px-2! py-1.5!" />
                          <input name={`${date}|${s.key}|phone`} defaultValue={e?.phone} placeholder="Phone" className="input w-28 px-2! py-1.5!" />
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {state?.error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>}
      {state?.ok && <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-800">{state.message}</p>}
      <button className="btn btn-primary" disabled={pending}>{pending ? "Saving..." : "Save month"}</button>
    </form>
  );
}
