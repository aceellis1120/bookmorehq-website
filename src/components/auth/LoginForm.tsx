"use client";

import { KeyRound, Loader2, LockKeyhole, UserRound } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function LoginForm() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function signIn(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });
      const data = (await response.json()) as {
        error?: string;
        redirectTo?: string;
      };

      if (!response.ok) {
        throw new Error(data.error || "Unable to sign in.");
      }

      window.location.href = data.redirectTo ?? "/dashboard";
    } catch (loginError) {
      setError(
        loginError instanceof Error ? loginError.message : "Unable to sign in.",
      );
      setSubmitting(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#f4f6f8] px-4 py-8 text-[#17202a]">
      <section className="w-full max-w-md rounded-md border border-[#dfe3e8] bg-white p-7 shadow-sm sm:p-8">
        <Image
          src="/logo.svg"
          alt="BookMoreHQ"
          width={176}
          height={36}
          className="h-8 w-auto"
          priority
        />
        <div className="mt-7 flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-md bg-[#eef4ff] text-[#155eef]">
            <LockKeyhole size={20} />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase text-[#667085]">
              Secure access
            </p>
            <h1 className="text-xl font-semibold">Dashboard login</h1>
          </div>
        </div>

        <form onSubmit={signIn} className="mt-7 space-y-5">
          <label className="block text-sm font-medium text-[#344054]">
            Email or username
            <div className="relative mt-1.5">
              <UserRound
                size={17}
                className="absolute left-3 top-3 text-[#98a2b3]"
              />
              <input
                required
                type="text"
                autoComplete="username"
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                className="h-11 w-full rounded-md border border-[#cfd5dc] pl-10 pr-3 outline-none focus:border-[#155eef] focus:ring-1 focus:ring-[#155eef]"
                placeholder="austin or you@bookmorehq.com"
              />
            </div>
          </label>

          <label className="block text-sm font-medium text-[#344054]">
            Password
            <div className="relative mt-1.5">
              <KeyRound
                size={17}
                className="absolute left-3 top-3 text-[#98a2b3]"
              />
              <input
                required
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-11 w-full rounded-md border border-[#cfd5dc] pl-10 pr-3 outline-none focus:border-[#155eef] focus:ring-1 focus:ring-[#155eef]"
              />
            </div>
          </label>

          {error && (
            <div className="rounded-md border border-[#f3b7b9] bg-[#fff0f0] p-3 text-sm text-[#c53035]">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[#155eef] px-4 text-sm font-semibold text-white hover:bg-[#004eeb] disabled:opacity-60"
          >
            {submitting && <Loader2 size={17} className="animate-spin" />}
            Sign in
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-[#667085]">
          Use the account assigned by BookMoreHQ. Sessions expire after 12
          hours.
        </p>
      </section>
    </main>
  );
}
