import Link from "next/link";
import { DharmaWheel } from "@/components/dharma-wheel";
import { ResetForm } from "@/components/password-forms";

export const metadata = { title: "Reset password" };

export default function Page() {
  return (
    <div className="hero-bg grid min-h-[70vh] place-items-center px-4 py-16">
      <div className="card card-flat w-full max-w-md p-8">
        <div className="mb-6 text-center">
          <DharmaWheel className="wheel-3d mx-auto h-14 w-14 text-accent" />
          <h1 className="mt-3 font-display text-3xl text-accent">Reset password</h1>
          <p className="text-sm text-muted">නව මුරපදයක් සකසන්න</p>
        </div>
        <ResetForm />
        <p className="mt-6 text-center text-sm text-muted">
          No code? <Link href="/forgot-password" className="font-semibold text-accent hover:underline">Request one</Link>
        </p>
      </div>
    </div>
  );
}
