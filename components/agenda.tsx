"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { parseAgenda, type AgendaItem } from "./agenda-view";

const TEMPLATE: AgendaItem[] = [
  { time: "6.00 a.m.", activity: "Buddha puja & Sil samadana / බුද්ධ පූජාව සහ සිල් සමාදන් වීම", monk: "", from: "" },
  { time: "8.00 a.m.", activity: "Dhamma sermon / ධර්ම දේශනාව", monk: "", from: "" },
  { time: "10.00 a.m.", activity: "Meditation / භාවනා", monk: "", from: "" },
  { time: "11.00 a.m.", activity: "Noon dana / දහවල් දානය", monk: "", from: "" },
  { time: "1.30 p.m.", activity: "Dhamma discussion / ධර්ම සාකච්ඡාව", monk: "", from: "" },
  { time: "4.30 p.m.", activity: "Bodhi puja & Sil ending / බෝධි පූජාව", monk: "", from: "" },
];

/** Admin row editor; writes JSON into a hidden input named `name`. */
export function AgendaEditor({ name, value }: { name: string; value: unknown }) {
  const [rows, setRows] = useState<AgendaItem[]>(() => parseAgenda(value));
  const set = (i: number, patch: Partial<AgendaItem>) => setRows((r) => r.map((x, j) => (j === i ? { ...x, ...patch } : x)));
  return (
    <div className="space-y-2">
      <input type="hidden" name={name} value={JSON.stringify(rows.filter((r) => r.time || r.activity))} />
      {rows.map((r, i) => (
        <div key={i} className="grid gap-1.5 rounded-xl border border-line bg-paper p-2 sm:grid-cols-[110px_1fr_1fr_1fr_auto]">
          <input value={r.time} onChange={(e) => set(i, { time: e.target.value })} placeholder="Time" className="input px-2! py-1.5!" />
          <input value={r.activity} onChange={(e) => set(i, { activity: e.target.value })} placeholder="Activity" className="input px-2! py-1.5!" />
          <input value={r.monk} onChange={(e) => set(i, { monk: e.target.value })} placeholder="Hamuduruwo / conducted by" className="input px-2! py-1.5!" />
          <input value={r.from} onChange={(e) => set(i, { from: e.target.value })} placeholder="Temple / place" className="input px-2! py-1.5!" />
          <button type="button" onClick={() => setRows((x) => x.filter((_, j) => j !== i))} className="rounded-lg p-2 text-red-600 hover:bg-red-50" aria-label="Remove">
            <Trash2 size={16} />
          </button>
        </div>
      ))}
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => setRows((x) => [...x, { time: "", activity: "", monk: "", from: "" }])} className="btn btn-ghost py-1.5! text-sm">
          <Plus size={16} /> Add row
        </button>
        {!rows.length && (
          <button type="button" onClick={() => setRows(TEMPLATE)} className="btn btn-gold py-1.5! text-sm">
            Use Poya Sil template
          </button>
        )}
      </div>
    </div>
  );
}

