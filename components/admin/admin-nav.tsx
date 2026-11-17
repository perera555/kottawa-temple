"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  CalendarDays,
  ClipboardList,
  GraduationCap,
  HandHeart,
  Images,
  LayoutDashboard,
  Mail,
  Megaphone,
  MessageSquareQuote,
  ShieldCheck,
  UserRound,
  Users,
  Video,
} from "lucide-react";

const ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
  posts: Megaphone,
  events: CalendarDays,
  gallery: Images,
  videos: Video,
  teachers: UserRound,
  students: GraduationCap,
  leaders: ShieldCheck,
  testimonials: MessageSquareQuote,
  messages: Mail,
  dana: HandHeart,
  registrations: ClipboardList,
  users: Users,
};

export type NavGroup = { section: string; label: string; emoji: string; items: { key: string; label: string }[] };

const itemCls = (active: boolean) =>
  `flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition duration-200 ${
    active
      ? "bg-gradient-to-b from-[#ffe17a] to-flag-yellow font-semibold text-[#2a0f0b] shadow-[0_4px_0_#b88c00,0_10px_16px_-6px_rgba(0,0,0,0.6)] -translate-y-0.5"
      : "hover:bg-white/10 hover:-translate-y-0.5"
  }`;

function useCurrentSection(groups: NavGroup[]) {
  const pathname = usePathname();
  const sp = useSearchParams();
  const fromQuery = sp.get("section");
  if (pathname.startsWith("/admin/users")) return "users";
  return fromQuery && groups.some((g) => g.section === fromQuery) ? fromQuery : groups[0]?.section;
}

/** Top bar: one tab per panel (Temple / Dhamma School / Montessori / Users) */
export function AdminSectionTabs({ groups }: { groups: NavGroup[] }) {
  const current = useCurrentSection(groups);
  return (
    <nav className="flex gap-2 overflow-x-auto">
      {groups.map((g) => {
        const active = g.section === current;
        const href = g.section === "users" ? "/admin/users" : `/admin?section=${g.section}`;
        return (
          <Link
            key={g.section}
            href={href}
            data-section={g.section === "users" ? "temple" : g.section}
            className={`shrink-0 rounded-xl px-4 py-2 text-sm font-semibold transition ${
              active
                ? "hero-bg text-white shadow-[0_5px_0_rgba(0,0,0,0.35),0_12px_20px_-8px_rgba(0,0,0,0.5)] -translate-y-0.5"
                : "bg-white text-ink shadow-[0_3px_0_var(--line)] hover:-translate-y-0.5"
            }`}
          >
            {g.emoji} {g.label}
          </Link>
        );
      })}
    </nav>
  );
}

/** Left sidebar: menu for the selected panel */
export function AdminNav({ groups }: { groups: NavGroup[] }) {
  const pathname = usePathname();
  const current = useCurrentSection(groups);
  const group = groups.find((g) => g.section === current) ?? groups[0];
  if (!group) return null;
  const q = group.section === "users" ? "" : `?section=${group.section}`;

  return (
    <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible">
      <p className="hidden px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-widest text-flag-yellow/80 lg:block">
        {group.emoji} {group.label}
      </p>
      {group.section !== "users" && (
        <Link href={`/admin${q}`} className={`${itemCls(pathname === "/admin")} shrink-0`}>
          <LayoutDashboard size={16} /> Dashboard
        </Link>
      )}
      {group.items.map((i) => {
        const Icon = ICONS[i.key] ?? Megaphone;
        return (
          <Link key={i.key} href={`/admin/${i.key}${q}`} className={`${itemCls(pathname.startsWith(`/admin/${i.key}`))} shrink-0`}>
            <Icon size={16} /> {i.label}
          </Link>
        );
      })}
    </nav>
  );
}
