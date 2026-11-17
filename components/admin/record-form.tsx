"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { saveRecord } from "@/app/actions/admin";
import type { Field } from "@/lib/resources";
import { AgendaEditor } from "../agenda";

type Values = Record<string, unknown>;

function ImageInput({ field, value }: { field: Field; value: string }) {
  const [url, setUrl] = useState(value);
  const [preview, setPreview] = useState(value);
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="grid h-28 w-28 shrink-0 place-items-center overflow-hidden rounded-xl border border-line bg-paper-2 text-xs text-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {preview ? <img src={preview} alt="" className="h-full w-full object-cover" /> : "No image"}
      </div>
      <div className="flex-1 space-y-2">
        <input
          type="file"
          name={`${field.name}__file`}
          accept="image/*"
          className="block w-full text-sm file:mr-3 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:text-white"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) setPreview(URL.createObjectURL(f));
          }}
        />
        <input
          name={field.name}
          className="input text-sm"
          placeholder="…or paste an image URL"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setPreview(e.target.value);
          }}
        />
      </div>
    </div>
  );
}

export function RecordForm({
  resourceKey,
  id,
  fields,
  values,
  sections,
  section,
  backHref,
}: {
  resourceKey: string;
  id: number | null;
  fields: Field[];
  values: Values;
  sections: { value: string; label: string }[];
  section?: string;
  backHref: string;
}) {
  const [state, action, pending] = useActionState(saveRecord.bind(null, resourceKey, id), undefined);

  return (
    <form action={action} className="card card-flat space-y-5 p-6">
      {resourceKey !== "users" && (
        <label className="block">
          <span className="label">Section</span>
          <select name="section" defaultValue={section} className="input" required>
            {sections.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </label>
      )}

      {fields.map((f) => {
        const v = values[f.name];
        const str = v == null ? "" : String(v);
        if (f.type === "checkbox") {
          return (
            <label key={f.name} className="flex items-center gap-3">
              <input type="checkbox" name={f.name} defaultChecked={v === true || (v == null && f.name === "active")} className="h-5 w-5 accent-[var(--accent)]" />
              <span className="font-medium">{f.label}</span>
            </label>
          );
        }
        return (
          <div key={f.name}>
            <label className="label" htmlFor={f.name}>
              {f.label} {f.required && <span className="text-red-600">*</span>}
            </label>
            {f.type === "textarea" ? (
              <textarea id={f.name} name={f.name} defaultValue={str} rows={5} className="input" required={f.required} />
            ) : f.type === "select" ? (
              <select id={f.name} name={f.name} defaultValue={str || f.options?.[0]?.value} className="input">
                {f.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            ) : f.type === "image" ? (
              <ImageInput field={f} value={str} />
            ) : f.type === "agenda" ? (
              <AgendaEditor name={f.name} value={v} />
            ) : (
              <input
                id={f.name}
                name={f.name}
                type={f.type === "password" ? "password" : f.type === "email" ? "email" : f.type === "number" ? "number" : f.type === "date" ? "date" : "text"}
                defaultValue={f.type === "password" ? "" : str}
                className="input"
                required={f.required && f.type !== "password"}
                autoComplete={f.type === "password" ? "new-password" : undefined}
              />
            )}
            {f.help && <p className="mt-1 text-xs text-muted">{f.help}</p>}
          </div>
        );
      })}

      {state?.error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>}
      <div className="flex gap-3">
        <button className="btn btn-primary" disabled={pending}>{pending ? "Saving..." : id ? "Save changes" : "Create"}</button>
        <Link href={backHref} className="btn btn-ghost">Cancel</Link>
      </div>
    </form>
  );
}
