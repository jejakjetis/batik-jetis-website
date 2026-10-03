"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/app/actions/admin";
import { Button } from "@/components/ui/Button";

const field =
  "mt-2 block w-full rounded-[4px] border border-field bg-cream px-3 py-3 text-base focus:border-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta/40";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});
  return (
    <form action={action} className="mt-8 space-y-5">
      {state.error && (
        <p role="alert" className="rounded-sm border border-danger/40 bg-danger/5 px-4 py-3 text-danger">
          {state.error}
        </p>
      )}
      <div>
        <label htmlFor="email" className="block text-sm font-semibold">
          Email
        </label>
        <input id="email" name="email" type="email" required autoComplete="username" maxLength={254} className={field} />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-semibold">
          Kata sandi
        </label>
        <input id="password" name="password" type="password" required autoComplete="current-password" maxLength={200} className={field} />
      </div>
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Memproses…" : "Masuk"}
      </Button>
    </form>
  );
}
