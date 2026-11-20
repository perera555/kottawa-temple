import Link from "next/link";
import { Cake, GraduationCap, Pencil, Phone, UserRound } from "lucide-react";
import { DeleteButton, StatusCell, ToggleCell } from "./row-actions";

/* eslint-disable @typescript-eslint/no-explicit-any */

const STATUS_STYLE: Record<string, [string, string]> = {
  pending: ["#ffe17a", "#8a5f00"],
  waiting: ["#5b8def", "#0f2a63"],
  accepted: ["#6ccf8a", "#14421f"],
  rejected: ["#ef5b62", "#7a0f14"],
};

const age = (dob?: string | null) => (dob ? Math.floor((Date.now() - new Date(dob).getTime()) / (365.25 * 86400000)) : null);

/** One 3D card per student / application. */
export function StudentCards({ kind, rows, base, section }: { kind: "students" | "applications"; rows: any[]; base: string; section: string }) {
  if (!rows.length) {
    return <div className="card card-flat p-10 text-center text-muted">Nothing here yet.</div>;
  }
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {rows.map((r) => {
        const isApp = kind === "applications";
        const name = isApp ? r.childName : r.name;
        const photo = isApp ? r.photoUrl : r.imageUrl;
        const parent = isApp ? r.parentName : r.guardianName;
        const phone = isApp ? r.phone : r.contact;
        const years = isApp ? age(r.dateOfBirth) : r.age;
        const [c1, c2] = isApp ? STATUS_STYLE[r.status] ?? STATUS_STYLE.pending : r.active ? ["#ffb347", "#a3410a"] : ["#c9c3bb", "#5c5650"];
        return (
          <article key={r.id} className="card group flex flex-col overflow-hidden">
            {/* photo header */}
            <div className="relative h-40 overflow-hidden" style={{ background: `linear-gradient(160deg, ${c1}, ${c2})` }}>
              {photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photo} alt={name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              ) : (
                <div className="grid h-full place-items-center text-white/80">
                  <span className="grid h-20 w-20 place-items-center rounded-full bg-white/20 text-3xl font-bold shadow-[inset_0_2px_0_rgba(255,255,255,0.4),0_10px_20px_-8px_rgba(0,0,0,0.5)]">
                    {String(name ?? "?").slice(0, 1).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent" />
              {(r.admissionNo || isApp) && (
                <span className="absolute left-3 top-3 rounded-lg bg-white/95 px-2 py-0.5 font-mono text-xs font-bold text-ink shadow">
                  {r.admissionNo || `#${r.id}`}
                </span>
              )}
              <span
                className="absolute right-3 top-3 rounded-full px-2.5 py-0.5 text-[11px] font-bold capitalize text-white shadow"
                style={{ background: c2 }}
              >
                {isApp ? (r.status === "waiting" ? "waiting list" : r.status) : r.active ? "enrolled" : "left"}
              </span>
              <p className="text-3d absolute bottom-2 left-3 right-3 truncate font-display text-xl text-white">{name}</p>
            </div>

            {/* details */}
            <div className="flex-1 space-y-1.5 p-4 text-sm">
              {r.grade && (
                <p className="flex items-center gap-2"><GraduationCap size={15} className="text-accent-2" /> {r.grade}</p>
              )}
              {years != null && (
                <p className="flex items-center gap-2"><Cake size={15} className="text-accent-2" /> {years} years{isApp && r.dateOfBirth ? ` · ${r.dateOfBirth}` : ""}</p>
              )}
              {parent && (
                <p className="flex items-center gap-2"><UserRound size={15} className="text-accent-2" /> {parent}{isApp && r.relationship ? ` (${r.relationship})` : ""}</p>
              )}
              {phone && (
                <p className="flex items-center gap-2">
                  <Phone size={15} className="text-accent-2" />
                  <a href={`tel:${phone}`} className="hover:underline">{phone}</a>
                  <a href={`https://wa.me/${String(phone).replace(/[^\d]/g, "").replace(/^0/, "94")}`} target="_blank" rel="noreferrer" className="rounded bg-[#25d366] px-1.5 text-[10px] font-bold text-white">
                    WhatsApp
                  </a>
                </p>
              )}
              {isApp && r.notes && <p className="line-clamp-2 rounded-lg bg-paper px-2 py-1 text-xs text-muted">{r.notes}</p>}
              {!isApp && r.achievement && <p className="line-clamp-2 rounded-lg bg-paper px-2 py-1 text-xs text-muted">🏆 {r.achievement}</p>}
            </div>

            {/* actions */}
            <div className="flex items-center justify-between gap-2 border-t border-line bg-paper/60 px-3 py-2">
              {isApp ? (
                <StatusCell resourceKey="applications" id={r.id} value={r.status} options={["pending", "waiting", "accepted", "rejected"]} />
              ) : (
                <span className="flex items-center gap-1.5 text-xs text-muted">
                  On website <ToggleCell resourceKey="students" id={r.id} field="showOnWebsite" value={!!r.showOnWebsite} />
                </span>
              )}
              <span className="flex items-center">
                <Link href={`${base}/${r.id}?section=${section}`} className="rounded-lg p-2 text-accent hover:bg-accent-soft" aria-label="Edit">
                  <Pencil size={16} />
                </Link>
                <DeleteButton resourceKey={kind} id={r.id} />
              </span>
            </div>
          </article>
        );
      })}
    </div>
  );
}
