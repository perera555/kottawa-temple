"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteRecord, quickUpdate } from "@/app/actions/admin";

export function DeleteButton({ resourceKey, id }: { resourceKey: string; id: number }) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (confirm("Delete this record? This cannot be undone.")) {
          start(async () => {
            try {
              await deleteRecord(resourceKey, id);
            } catch (e) {
              alert((e as Error).message);
            }
          });
        }
      }}
      className="rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:opacity-50"
      aria-label="Delete"
    >
      <Trash2 size={16} />
    </button>
  );
}

export function ToggleCell({ resourceKey, id, field, value }: { resourceKey: string; id: number; field: string; value: boolean }) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => start(() => quickUpdate(resourceKey, id, field, !value))}
      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${value ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"} disabled:opacity-50`}
    >
      {value ? "Yes" : "No"}
    </button>
  );
}

export function StatusCell({ resourceKey, id, value, options }: { resourceKey: string; id: number; value: string; options: string[] }) {
  const [pending, start] = useTransition();
  return (
    <select
      disabled={pending}
      defaultValue={value}
      onChange={(e) => start(() => quickUpdate(resourceKey, id, "status", e.target.value))}
      className="rounded-lg border border-line bg-white px-2 py-1 text-xs capitalize"
    >
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}
