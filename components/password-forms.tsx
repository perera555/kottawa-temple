"use client";

import Link from "next/link";
import { useActionState, useState, useTransition } from "react";
import { CheckCircle2, KeyRound } from "lucide-react";
import { adminCreateResetCode, requestPasswordReset, resetPassword } from "@/app/actions/password";

function Msg({ state }: { state: { ok?: boolean; error?: string; message?: string } | undefined }) {
  if (!state) return null;
  if (state.error) return <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>;
  if (state.message)
    return (
      <p className="flex gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-800">
        <CheckCircle2 size={18} className="mt-0.5 shrink-0" /> {state.message}
      </p>
    );
  return null;
}

export function ForgotForm() {
  const [state, action, pending] = useActionState(requestPasswordReset, undefined);
  return (
    <form action={action} className="space-y-4">
      <label className="block">
        <span className="label">Email</span>
        <input name="email" type="email" required className="input" autoComplete="email" />
      </label>
      <Msg state={state} />
      {state?.ok ? (
        <Link href="/reset-password" className="btn btn-primary w-full justify-center">I have a code → Reset password</Link>
      ) : (
        <button className="btn btn-primary w-full justify-center" disabled={pending}>{pending ? "Sending..." : "Send reset code"}</button>
      )}
    </form>
  );
}

export function ResetForm() {
  const [state, action, pending] = useActionState(resetPassword, undefined);
  if (state?.ok)
    return (
      <div className="space-y-4">
        <Msg state={state} />
        <Link href="/login" className="btn btn-primary w-full justify-center">Login</Link>
      </div>
    );
  return (
    <form action={action} className="space-y-4">
      <label className="block"><span className="label">Email</span><input name="email" type="email" required className="input" /></label>
      <label className="block">
        <span className="label">6-digit code</span>
        <input name="code" inputMode="numeric" pattern="\d{6}" maxLength={6} required className="input text-center font-mono text-2xl tracking-[0.5em]" />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block"><span className="label">New password</span><input name="password" type="password" minLength={8} required className="input" autoComplete="new-password" /></label>
        <label className="block"><span className="label">Confirm</span><input name="confirm" type="password" minLength={8} required className="input" autoComplete="new-password" /></label>
      </div>
      <Msg state={state} />
      <button className="btn btn-primary w-full justify-center" disabled={pending}>{pending ? "Saving..." : "Change password"}</button>
    </form>
  );
}

/** Admin: generate a one-time reset code for a user */
export function AdminResetCode({ userId, email }: { userId: number; email: string }) {
  const [pending, start] = useTransition();
  const [result, setResult] = useState<{ code?: string; emailed?: boolean; error?: string } | null>(null);
  return (
    <div className="card card-flat space-y-3 p-5">
      <h2 className="flex items-center gap-2 font-display text-xl text-accent"><KeyRound size={20} /> Password reset code</h2>
      <p className="text-sm text-muted">
        Create a 6-digit code and give it to the user (phone / SMS / WhatsApp). They enter it at <b>/reset-password</b> with their email ({email}) to choose a new
        password. You can also set a new password directly in the form below.
      </p>
      <button type="button" className="btn btn-gold" disabled={pending} onClick={() => start(async () => setResult(await adminCreateResetCode(userId)))}>
        {pending ? "Creating..." : "Generate reset code"}
      </button>
      {result?.error && <p className="text-sm text-red-700">{result.error}</p>}
      {result?.code && (
        <div className="rounded-xl bg-accent-soft p-4">
          <p className="font-mono text-3xl font-bold tracking-[0.3em] text-accent">{result.code}</p>
          <p className="mt-1 text-xs text-muted">Valid for 30 minutes. {result.emailed ? "Also emailed to the user." : "Email is not configured - please send this code to the user yourself."}</p>
        </div>
      )}
    </div>
  );
}
