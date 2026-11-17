import Link from "next/link";
import { redirect } from "next/navigation";
import { DharmaWheel } from "@/components/dharma-wheel";
import { LoginForm } from "@/components/forms";
import { getSession } from "@/lib/auth";
import { isAdminRole } from "@/lib/session";

export const metadata = { title: "Login" };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { next } = await searchParams;
  const user = await getSession();
  if (user) redirect(isAdminRole(user.role) ? "/admin" : "/account");
  return (
    <div className="hero-bg grid min-h-[70vh] place-items-center px-4 py-16">
      <div className="card card-flat w-full max-w-md p-8">
        <div className="mb-6 text-center">
          <DharmaWheel className="wheel-3d mx-auto h-14 w-14 text-accent" />
          <h1 className="mt-3 font-display text-3xl text-accent">Login / ඇතුල් වන්න</h1>
          <p className="text-sm text-muted">Members and administrators</p>
        </div>
        <LoginForm next={typeof next === "string" ? next : ""} />
        <p className="mt-4 text-center text-sm">
          <Link href="/forgot-password" className="text-accent hover:underline">Forgot password? / මුරපදය අමතකද?</Link>
        </p>
        <p className="mt-4 text-center text-sm text-muted">
          No account?{" "}
          <Link href="/register" className="font-semibold text-accent hover:underline">Become a member / සාමාජික වන්න</Link>
        </p>
      </div>
    </div>
  );
}
