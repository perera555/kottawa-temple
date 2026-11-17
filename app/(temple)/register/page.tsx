import Link from "next/link";
import { redirect } from "next/navigation";
import { BadgeCheck } from "lucide-react";
import { RegisterForm } from "@/components/forms";
import { getSession } from "@/lib/auth";

export const metadata = { title: "Become a Member" };

export default async function RegisterPage() {
  if (await getSession()) redirect("/account");
  return (
    <div className="hero-bg px-4 py-16">
      <div className="mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-2">
        <div className="text-white">
          <h1 className="text-3d font-display text-4xl sm:text-5xl">Become a Member</h1>
          <p className="mt-1 font-display text-2xl text-flag-yellow">සාමාජිකයෙකු වන්න</p>
          <ul className="mt-6 space-y-3 text-white/90">
            {[
              "Receive your membership number instantly (e.g. PKT-2026-0001)",
              "ඔබගේ සාමාජික අංකය වහාම ලැබේ",
              "Track your dana bookings, messages and reviews",
              "Your reviews are published immediately",
            ].map((t) => (
              <li key={t} className="flex gap-2"><BadgeCheck className="shrink-0 text-flag-yellow" /> {t}</li>
            ))}
          </ul>
        </div>
        <div className="card card-flat p-8">
          <RegisterForm />
          <p className="mt-6 text-center text-sm text-muted">
            Already a member? <Link href="/login" className="font-semibold text-accent hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
