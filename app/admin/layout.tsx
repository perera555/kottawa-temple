import Link from "next/link";
import { Suspense } from "react";
import { ExternalLink, LogOut } from "lucide-react";
import { logout } from "@/app/actions/auth";
import { AdminNav, AdminSectionTabs, type NavGroup } from "@/components/admin/admin-nav";
import { DharmaWheel } from "@/components/dharma-wheel";
import { UserMenu } from "@/components/user-menu";
import { allowedSections, requireAdmin } from "@/lib/auth";
import { touchPresence } from "@/lib/presence";
import { RESOURCE_KEYS, RESOURCES } from "@/lib/resources";

export const metadata = { title: "Admin Panel" };

const PANELS = {
  temple: { label: "Temple", emoji: "🏛" },
  dhamma: { label: "Dhamma School", emoji: "📿" },
  montessori: { label: "Montessori", emoji: "🌱" },
} as const;

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const user = await requireAdmin();
  const profile = await touchPresence(user.id);

  const groups: NavGroup[] = allowedSections(user).map((s) => ({
    section: s,
    ...PANELS[s],
    items: [
      { key: "settings", label: "Social Media & Live" },
      ...(s === "temple" ? [{ key: "daily-dana", label: "Daily Dana Roster" }] : []),
      { key: "monthly", label: "Monthly Pinkam List" },
      ...RESOURCE_KEYS.filter((k) => !RESOURCES[k].superAdminOnly && RESOURCES[k].sections.includes(s)).map((k) => ({
        key: k,
        label: RESOURCES[k].label,
      })),
    ],
  }));
  if (user.role === "super_admin") {
    groups.push({ section: "users", label: "Users & Members", emoji: "👥", items: [{ key: "users", label: "Users & Members" }] });
  }

  return (
    <div data-section="temple" className="flex min-h-screen flex-col bg-paper md:flex-row">
      {/* LEFT NAV */}
      <aside className="admin-sidebar text-white/85 md:sticky md:top-0 md:h-screen md:w-64 md:shrink-0 md:overflow-y-auto">
        <div className="flag-stripe h-1" />
        <Link href="/admin" className="flex items-center gap-3 p-5">
          <DharmaWheel className="wheel-3d h-10 w-10 text-flag-yellow" />
          <div className="leading-tight">
            <p className="font-display text-white">Admin Panel</p>
            <p className="text-xs">Sri Punyabhiwardhanaramaya</p>
          </div>
        </Link>
        <Suspense>
          <AdminNav groups={groups} />
        </Suspense>
        <div className="space-y-1 border-t border-white/10 p-3 text-sm">
          <Link href="/" target="_blank" className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-white/10">
            <ExternalLink size={16} /> View website
          </Link>
          <form action={logout}>
            <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left hover:bg-white/10">
              <LogOut size={16} /> Sign out
            </button>
          </form>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        {/* TOP NAV */}
        <div className="sticky top-0 z-30 space-y-3 bg-paper/90 p-4 pb-3 backdrop-blur sm:px-8">
          <div className="hero-bg tile-3d flex items-center justify-between gap-4 px-5 py-3 text-white">
            <span className="text-3d truncate font-display text-lg">Sri Punyabhiwardhanaramaya, Kottawa</span>
            <UserMenu name={profile?.name ?? user.name} avatarUrl={profile?.avatarUrl ?? ""} memberNo={profile?.memberNo ?? null} isAdmin />
          </div>
          <Suspense>
            <AdminSectionTabs groups={groups} />
          </Suspense>
        </div>
        <main className="p-4 pt-2 sm:px-8">{children}</main>
      </div>
    </div>
  );
}
