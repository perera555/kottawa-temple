"use client";

import { useActionState, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { bulkCreateEvents } from "@/app/actions/admin";

type Row = { id: number; eventDate: string; category: string; title: string; host: string; preacher: string; preacherFrom: string; startTime: string; endTime: string; allowRegistration: boolean };

const QUICK: Record<string, { category: string; title: string; startTime: string; allowRegistration?: boolean }> = {
  dana: { category: "dana", title: "Noon Dana / දහවල් දානය", startTime: "11.00 a.m." },
  bana: { category: "bana", title: "Dhamma Sermon / ධර්ම දේශනාව", startTime: "7.00 p.m." },
  poya: { category: "poya", title: "Poya Sil Programme / පොහොය සිල් වැඩසටහන", startTime: "6.00 a.m.", allowRegistration: true },
  bodhi: { category: "bodhi_puja", title: "Bodhi Puja / බෝධි පූජාව", startTime: "6.00 p.m.", allowRegistration: true },
  pirith: { category: "pirith", title: "Pirith Chanting / පිරිත් දේශනාව", startTime: "7.00 p.m." },
};

let uid = 1;

export function MonthlyForm({ section, categories }: { section: string; categories: { value: string; label: string }[] }) {
  const [state, action, pending] = useActionState(bulkCreateEvents.bind(null, section), undefined);
  const [month, setMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });
  const blank = (over: Partial<Row> = {}): Row => ({
    id: uid++, eventDate: "", category: "dana", title: "", host: "", preacher: "", preacherFrom: "", startTime: "", endTime: "", allowRegistration: false, ...over,
  });
  const [rows, setRows] = useState<Row[]>(() => [blank(), blank(), blank()]);

  const update = (id: number, patch: Partial<Row>) => setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const fillDays = (weekday: number, q: keyof typeof QUICK) => {
    const [y, m] = month.split("-").map(Number);
    const days = new Date(y, m, 0).getDate();
    const add: Row[] = [];
    for (let d = 1; d <= days; d++) {
      const dt = new Date(y, m - 1, d);
      if (weekday === -1 || dt.getDay() === weekday) {
        add.push(blank({ eventDate: `${month}-${String(d).padStart(2, "0")}`, ...QUICK[q] }));
      }
    }
    setRows((rs) => [...rs.filter((r) => r.eventDate || r.title), ...add]);
  };

  const sorted = [...rows].sort((a, b) => (a.eventDate || "9999").localeCompare(b.eventDate || "9999"));

  return (
    <form action={action} className="space-y-5">
      <div className="card card-flat flex flex-wrap items-end gap-4 p-5">
        <label>
          <span className="label">Month</span>
          <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="input" />
        </label>
        <div className="flex flex-wrap gap-2">
          <span className="w-full text-xs font-semibold uppercase tracking-wide text-muted">Quick fill for this month</span>
          <button type="button" onClick={() => fillDays(-1, "dana")} className="btn btn-ghost py-1.5! text-xs">Dana every day</button>
          <button type="button" onClick={() => fillDays(3, "bodhi")} className="btn btn-ghost py-1.5! text-xs">Bodhi puja every Wed</button>
          <button type="button" onClick={() => fillDays(6, "bodhi")} className="btn btn-ghost py-1.5! text-xs">Bodhi puja every Sat</button>
          <button type="button" onClick={() => fillDays(0, "bana")} className="btn btn-ghost py-1.5! text-xs">Bana every Sunday</button>
          <button type="button" onClick={() => setRows((rs) => [...rs, blank({ ...QUICK.poya, eventDate: `${month}-` })])} className="btn btn-ghost py-1.5! text-xs">+ Poya sil row</button>
          <button type="button" onClick={() => setRows((rs) => [...rs, blank({ ...QUICK.pirith, eventDate: `${month}-` })])} className="btn btn-ghost py-1.5! text-xs">+ Pirith row</button>
        </div>
      </div>

      <div className="card card-flat overflow-x-auto">
        <table className="w-full min-w-[1100px] text-sm">
          <thead className="hero-bg text-left text-xs uppercase tracking-wider text-white">
            <tr>
              <th className="px-2 py-3">Date *</th>
              <th className="px-2 py-3">Type</th>
              <th className="px-2 py-3">Title *</th>
              <th className="px-2 py-3">Dana host / Dayaka</th>
              <th className="px-2 py-3">Bana by</th>
              <th className="px-2 py-3">Preacher&apos;s temple</th>
              <th className="px-2 py-3">Start</th>
              <th className="px-2 py-3">End</th>
              <th className="px-2 py-3">Reg.</th>
              <th />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {sorted.map((r) => (
              <tr key={r.id} className="align-top">
                <td className="p-1.5"><input type="date" name="eventDate" value={r.eventDate} onChange={(e) => update(r.id, { eventDate: e.target.value })} className="input px-2! py-1.5!" /></td>
                <td className="p-1.5">
                  <select name="category" value={r.category} onChange={(e) => update(r.id, { category: e.target.value })} className="input px-2! py-1.5!">
                    {categories.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </td>
                <td className="p-1.5"><input name="title" value={r.title} onChange={(e) => update(r.id, { title: e.target.value })} className="input px-2! py-1.5!" /></td>
                <td className="p-1.5"><input name="host" value={r.host} onChange={(e) => update(r.id, { host: e.target.value })} className="input px-2! py-1.5!" placeholder="Perera family" /></td>
                <td className="p-1.5"><input name="preacher" value={r.preacher} onChange={(e) => update(r.id, { preacher: e.target.value })} className="input px-2! py-1.5!" placeholder="Ven. …" /></td>
                <td className="p-1.5"><input name="preacherFrom" value={r.preacherFrom} onChange={(e) => update(r.id, { preacherFrom: e.target.value })} className="input px-2! py-1.5!" /></td>
                <td className="p-1.5"><input name="startTime" value={r.startTime} onChange={(e) => update(r.id, { startTime: e.target.value })} className="input w-24 px-2! py-1.5!" /></td>
                <td className="p-1.5"><input name="endTime" value={r.endTime} onChange={(e) => update(r.id, { endTime: e.target.value })} className="input w-24 px-2! py-1.5!" /></td>
                <td className="p-1.5 text-center">
                  <input type="hidden" name="allowRegistration" value={r.allowRegistration ? "yes" : "no"} />
                  <input type="checkbox" checked={r.allowRegistration} onChange={(e) => update(r.id, { allowRegistration: e.target.checked })} className="mt-2 h-4 w-4" title="Allow online registration" />
                </td>
                <td className="p-1.5">
                  <button type="button" onClick={() => setRows((rs) => rs.filter((x) => x.id !== r.id))} className="rounded-lg p-2 text-red-600 hover:bg-red-50" aria-label="Remove row">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="border-t border-line p-3">
          <button type="button" onClick={() => setRows((rs) => [...rs, blank({ eventDate: `${month}-01` })])} className="btn btn-ghost py-1.5! text-sm">
            <Plus size={16} /> Add row
          </button>
        </div>
      </div>

      {state?.error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>}
      <button className="btn btn-primary" disabled={pending}>{pending ? "Saving..." : `Save ${rows.filter((r) => r.eventDate && r.title).length} programmes`}</button>
    </form>
  );
}
