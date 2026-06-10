"use client";

import { ArrowLeft, Check, Loader2, PhoneCall, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  AI_RECEPTIONIST_PACKAGES,
  type PackageId,
} from "@/lib/pricing";
import { formatCurrency } from "@/lib/format";

export default function AiReceptionistCheckout({
  initialPackageId,
  closer,
}: {
  initialPackageId: PackageId;
  closer: string;
}) {
  const [packageId, setPackageId] = useState(initialPackageId);
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const plan = AI_RECEPTIONIST_PACKAGES[packageId];

  async function startCheckout(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/checkout/ai-receptionist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageId,
          companyName,
          contactName,
          email,
          phone,
          closer,
        }),
      });
      const data = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !data.url) {
        throw new Error(data.error || "Unable to start checkout.");
      }

      window.location.href = data.url;
    } catch (checkoutError) {
      setError(
        checkoutError instanceof Error
          ? checkoutError.message
          : "Unable to start checkout.",
      );
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f4f6f8] px-4 py-8 text-[#17202a]">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#475467] hover:text-[#155eef]"
        >
          <ArrowLeft size={16} />
          Back to BookMoreHQ
        </Link>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.78fr]">
          <section className="rounded-md border border-[#dfe3e8] bg-white p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-md bg-[#eef4ff] text-[#155eef]">
                <PhoneCall size={20} />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase text-[#667085]">
                  BookMoreHQ
                </p>
                <h1 className="text-xl font-semibold">AI Receptionist Checkout</h1>
              </div>
            </div>

            <form onSubmit={startCheckout} className="mt-7 space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Package
                </label>
                <div className="grid gap-2 sm:grid-cols-3">
                  {Object.values(AI_RECEPTIONIST_PACKAGES).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setPackageId(item.id)}
                      className={`rounded-md border p-3 text-left ${
                        packageId === item.id
                          ? "border-[#155eef] bg-[#eef4ff]"
                          : "border-[#dfe3e8] hover:border-[#aab4c0]"
                      }`}
                    >
                      <span className="block text-sm font-semibold">
                        {item.name}
                      </span>
                      <span className="mt-1 block text-xs text-[#667085]">
                        {formatCurrency(item.setupFee + item.monthlyPrice)} today
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-medium">
                  Company name
                  <input
                    required
                    value={companyName}
                    onChange={(event) => setCompanyName(event.target.value)}
                    className="mt-1.5 h-11 w-full rounded-md border border-[#cfd5dc] px-3 outline-none focus:border-[#155eef]"
                  />
                </label>
                <label className="text-sm font-medium">
                  Contact name
                  <input
                    required
                    value={contactName}
                    onChange={(event) => setContactName(event.target.value)}
                    className="mt-1.5 h-11 w-full rounded-md border border-[#cfd5dc] px-3 outline-none focus:border-[#155eef]"
                  />
                </label>
                <label className="text-sm font-medium">
                  Email
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="mt-1.5 h-11 w-full rounded-md border border-[#cfd5dc] px-3 outline-none focus:border-[#155eef]"
                  />
                </label>
                <label className="text-sm font-medium">
                  Phone
                  <input
                    type="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    className="mt-1.5 h-11 w-full rounded-md border border-[#cfd5dc] px-3 outline-none focus:border-[#155eef]"
                  />
                </label>
              </div>

              {closer && (
                <p className="text-xs text-[#667085]">
                  Sales representative: <strong>{closer}</strong>
                </p>
              )}

              {error && (
                <div className="rounded-md border border-[#f3b7b9] bg-[#fff0f0] p-3 text-sm text-[#c53035]">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[#155eef] px-4 text-sm font-semibold text-white hover:bg-[#004eeb] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting && <Loader2 size={17} className="animate-spin" />}
                Continue to secure checkout
              </button>
            </form>
          </section>

          <aside className="rounded-md border border-[#dfe3e8] bg-white p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[#667085]">
                  Selected package
                </p>
                <h2 className="mt-1 text-xl font-semibold">{plan.name}</h2>
              </div>
              <ShieldCheck className="text-[#18794e]" size={22} />
            </div>

            <div className="mt-6 border-y border-[#edf0f2] py-5">
              <div className="flex justify-between text-sm">
                <span className="text-[#667085]">Setup</span>
                <span className="font-semibold">{formatCurrency(plan.setupFee)}</span>
              </div>
              <div className="mt-3 flex justify-between text-sm">
                <span className="text-[#667085]">First month</span>
                <span className="font-semibold">
                  {formatCurrency(plan.monthlyPrice)}
                </span>
              </div>
              <div className="mt-4 flex justify-between border-t border-[#edf0f2] pt-4">
                <span className="font-semibold">Due today</span>
                <span className="text-xl font-semibold">
                  {formatCurrency(plan.setupFee + plan.monthlyPrice)}
                </span>
              </div>
            </div>

            <ul className="mt-5 space-y-3 text-sm text-[#475467]">
              {[
                `${plan.includedMinutes.toLocaleString()} AI minutes per month`,
                `${plan.includedSmsSegments.toLocaleString()} SMS segments`,
                "Custom call flow and testing",
                "Lead alerts and monthly reporting",
                "Launch after completed onboarding",
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <Check size={16} className="mt-0.5 shrink-0 text-[#18794e]" />
                  {item}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </main>
  );
}
