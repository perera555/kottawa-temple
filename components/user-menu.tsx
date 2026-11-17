"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { LayoutDashboard, LogOut, UserRound } from "lucide-react";
import { logout } from "@/app/actions/auth";

export function Avatar({ name, src, size = 32, online }: { name: string; src?: string; size?: number; online?: boolean }) {
  return (
    <span className="relative inline-block shrink-0" style={{ width: size, height: size }}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={name} className="h-full w-full rounded-full border-2 border-white object-cover shadow" />
      ) : (
        <span className="grid h-full w-full place-items-center rounded-full border-2 border-white bg-flag-orange font-bold text-white shadow" style={{ fontSize: size * 0.42 }}>
          {name.slice(0, 1).toUpperCase()}
        </span>
      )}
      {online !== undefined && (
        <span
          className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white ${online ? "bg-green-500" : "bg-gray-400"}`}
          title={online ? "Online" : "Offline"}
        />
      )}
    </span>
  );
}

export function UserMenu({ name, avatarUrl, memberNo, isAdmin }: { name: string; avatarUrl: string; memberNo: string | null; isAdmin: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const close = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen((o) => !o)} className="flex items-center gap-2 rounded-full py-0.5 pl-0.5 pr-2 hover:bg-white/10" aria-expanded={open}>
        <Avatar name={name} src={avatarUrl} size={26} online />
        <span className="hidden max-w-32 truncate sm:inline">{name}</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-60 overflow-hidden rounded-xl border border-line bg-white text-ink shadow-xl">
          <div className="flex items-center gap-3 border-b border-line p-3">
            <Avatar name={name} src={avatarUrl} size={40} online />
            <div className="min-w-0">
              <p className="truncate font-semibold">{name}</p>
              <p className="text-xs text-green-700">● Online</p>
              {memberNo && <p className="font-mono text-xs text-muted">{memberNo}</p>}
            </div>
          </div>
          <Link href="/account" className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-accent-soft" onClick={() => setOpen(false)}>
            <UserRound size={16} /> My Account / Profile
          </Link>
          {isAdmin && (
            <Link href="/admin" className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-accent-soft" onClick={() => setOpen(false)}>
              <LayoutDashboard size={16} /> Admin Panel
            </Link>
          )}
          <form action={logout} className="border-t border-line">
            <button className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-red-700 hover:bg-red-50">
              <LogOut size={16} /> Sign out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
