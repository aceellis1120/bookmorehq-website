"use client";

import {
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Loader2,
  PhoneCall,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  AI_RECEPTIONIST_PACKAGES,
  type PackageId,
} from "@/lib/pricing";

type FormState = {
  companyName: string;
  website: string;
  industry: string;
  services: string;
  serviceAreas: string;
  businessHours: string;
  mainPhone: string;
  transferPhone: string;
  alertEmail: string;
  alertPhone: string;
  calendarSystem: string;
  bookingRules: string;
  emergencyRules: string;
  greeting: string;
  commonQuestions: string;
  afterHours: string;
  voiceTone: string;
  primaryCallGoals: string;
  specialInstructions: string;
};

const initialState: FormState = {
  companyName: "",
  website: "",
  industry: "HVAC",
  services: "",
  serviceAreas: "Nashville, TN",
  businessHours: "Monday-Friday, 8:00 AM-5:00 PM",
  mainPhone: "",
  transferPhone: "",
  alertEmail: "",
  alertPhone: "",
  calendarSystem: "",
  bookingRules: "",
  emergencyRules: "",
  greeting: "Thank you for calling. How can I help you today?",
  commonQuestions: "",
  afterHours:
    "Collect the caller's details, identify urgency, and send an immediate lead alert.",
  voiceTone: "Warm, professional, concise, and confident",
  primaryCallGoals:
    "Understand why the caller is calling, collect complete lead details, identify urgency, and move the caller toward the correct next step.",
  specialInstructions: "",
};

const inputClass =
  "mt-1.5 h-11 w-full rounded-md border border-[#cfd5dc] bg-white px-3 text-sm outline-none focus:border-[#155eef] focus:ring-1 focus:ring-[#155eef]";
const textareaClass =
  "mt-1.5 min-h-28 w-full resize-y rounded-md border border-[#cfd5dc] bg-white px-3 py-3 text-sm outline-none focus:border-[#155eef] focus:ring-1 focus:ring-[#155eef]";

export default function AiReceptionistOnboarding({
  packageId,
  checkoutSessionId,
}: {
  packageId: PackageId;
  checkoutSessionId: string;
}) {
  const [form, setForm] = useState<FormState>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const plan = AI_RECEPTIONIST_PACKAGES[packageId];

  function update(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service: "ai-receptionist",
          packageId,
          checkoutSessionId,
          submittedAt: new Date().toISOString(),
          ...form,
        }),
      });

      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(
          result.error || "We could not save this onboarding form.",
        );
      }

      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "We could not save this onboarding form.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f4f6f8] px-4">
        <section className="w-full max-w-xl rounded-md border border-[#dfe3e8] bg-white p-8 text-center">
          <CheckCircle2 size={48} className="mx-auto text-[#18794e]" />
          <p className="mt-5 text-xs font-semibold uppercase text-[#667085]">
            Onboarding complete
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-[#17202a]">
            Your build sheet is ready
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#667085]">
            Your {plan.name} AI Receptionist intake has been received. The AI
            configuration will be generated from these business rules, reviewed
            when necessary, tested, and then activated.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-md bg-[#155eef] px-5 text-sm font-semibold text-white"
          >
            Return to BookMoreHQ
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f6f8] px-4 py-8 text-[#17202a]">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-md bg-[#eef4ff] text-[#155eef]">
              <PhoneCall size={21} />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase text-[#667085]">
                BookMoreHQ
              </p>
              <h1 className="text-2xl font-semibold">
                AI Receptionist onboarding
              </h1>
            </div>
          </div>
          <span className="rounded-md border border-[#b7e4ce] bg-[#ecfdf3] px-3 py-2 text-sm font-semibold text-[#18794e]">
            {plan.name} package
          </span>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_280px]">
          <form
            onSubmit={submit}
            className="space-y-7 rounded-md border border-[#dfe3e8] bg-white p-6 sm:p-8"
          >
            <FormSection
              number="01"
              title="Business and service details"
              description="This becomes the agent's knowledge base."
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Business name" required>
                  <input
                    required
                    value={form.companyName}
                    onChange={(event) =>
                      update("companyName", event.target.value)
                    }
                    className={inputClass}
                  />
                </Field>
                <Field label="Website">
                  <input
                    type="url"
                    value={form.website}
                    onChange={(event) => update("website", event.target.value)}
                    placeholder="https://"
                    className={inputClass}
                  />
                </Field>
                <Field label="Industry" required>
                  <select
                    required
                    value={form.industry}
                    onChange={(event) => update("industry", event.target.value)}
                    className={inputClass}
                  >
                    <option>HVAC</option>
                    <option>Roofing</option>
                    <option>Plumbing</option>
                    <option>Electrical</option>
                    <option>Other home service</option>
                  </select>
                </Field>
                <Field label="Service areas" required>
                  <input
                    required
                    value={form.serviceAreas}
                    onChange={(event) =>
                      update("serviceAreas", event.target.value)
                    }
                    className={inputClass}
                  />
                </Field>
              </div>
              <Field label="Services offered" required>
                <textarea
                  required
                  value={form.services}
                  onChange={(event) => update("services", event.target.value)}
                  placeholder="List the services callers can ask about."
                  className={textareaClass}
                />
              </Field>
              <Field label="Common questions and approved answers">
                <textarea
                  value={form.commonQuestions}
                  onChange={(event) =>
                    update("commonQuestions", event.target.value)
                  }
                  placeholder="Pricing policies, financing, warranties, same-day service, and anything the agent may answer."
                  className={textareaClass}
                />
              </Field>
            </FormSection>

            <FormSection
              number="02"
              title="Call routing and alerts"
              description="Tell the agent where calls and lead summaries go."
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Current main phone" required>
                  <input
                    required
                    type="tel"
                    value={form.mainPhone}
                    onChange={(event) => update("mainPhone", event.target.value)}
                    className={inputClass}
                  />
                </Field>
                <Field label="Live transfer phone" required>
                  <input
                    required
                    type="tel"
                    value={form.transferPhone}
                    onChange={(event) =>
                      update("transferPhone", event.target.value)
                    }
                    className={inputClass}
                  />
                </Field>
                <Field label="Lead alert email" required>
                  <input
                    required
                    type="email"
                    value={form.alertEmail}
                    onChange={(event) => update("alertEmail", event.target.value)}
                    className={inputClass}
                  />
                </Field>
                <Field label="Lead alert mobile number" required>
                  <input
                    required
                    type="tel"
                    value={form.alertPhone}
                    onChange={(event) => update("alertPhone", event.target.value)}
                    className={inputClass}
                  />
                </Field>
              </div>
              <Field label="Emergency and urgent-call rules" required>
                <textarea
                  required
                  value={form.emergencyRules}
                  onChange={(event) =>
                    update("emergencyRules", event.target.value)
                  }
                  placeholder="Example: no heat under 40°F, active water leak, elderly resident, commercial outage."
                  className={textareaClass}
                />
              </Field>
            </FormSection>

            <FormSection
              number="03"
              title="Scheduling and agent behavior"
              description="These rules control what the caller experiences."
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Business hours" required>
                  <input
                    required
                    value={form.businessHours}
                    onChange={(event) =>
                      update("businessHours", event.target.value)
                    }
                    className={inputClass}
                  />
                </Field>
                <Field label="Calendar or CRM">
                  <input
                    value={form.calendarSystem}
                    onChange={(event) =>
                      update("calendarSystem", event.target.value)
                    }
                    placeholder="Google Calendar, ServiceTitan, Jobber..."
                    className={inputClass}
                  />
                </Field>
              </div>
              <Field label="Booking rules">
                <textarea
                  value={form.bookingRules}
                  onChange={(event) =>
                    update("bookingRules", event.target.value)
                  }
                  placeholder="Appointment length, lead time, technician zones, services that require manual confirmation."
                  className={textareaClass}
                />
              </Field>
              <Field label="Desired voice and tone" required>
                <input
                  required
                  value={form.voiceTone}
                  onChange={(event) =>
                    update("voiceTone", event.target.value)
                  }
                  placeholder="Warm, professional, calm, direct..."
                  className={inputClass}
                />
              </Field>
              <Field label="Primary goals for every call" required>
                <textarea
                  required
                  value={form.primaryCallGoals}
                  onChange={(event) =>
                    update("primaryCallGoals", event.target.value)
                  }
                  placeholder="What should the receptionist accomplish on a normal call?"
                  className={textareaClass}
                />
              </Field>
              <Field label="Approved greeting" required>
                <input
                  required
                  value={form.greeting}
                  onChange={(event) => update("greeting", event.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="After-hours behavior" required>
                <textarea
                  required
                  value={form.afterHours}
                  onChange={(event) => update("afterHours", event.target.value)}
                  className={textareaClass}
                />
              </Field>
              <Field label="Special instructions and situations to avoid">
                <textarea
                  value={form.specialInstructions}
                  onChange={(event) =>
                    update("specialInstructions", event.target.value)
                  }
                  placeholder="VIP callers, services you do not offer, phrases to avoid, calls that must always transfer..."
                  className={textareaClass}
                />
              </Field>
            </FormSection>

            {error && (
              <div className="rounded-md border border-[#f3b7b9] bg-[#fff0f0] p-3 text-sm text-[#c53035]">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[#155eef] px-5 text-sm font-semibold text-white hover:bg-[#004eeb] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <Loader2 size={17} className="animate-spin" />
              ) : (
                <ClipboardCheck size={17} />
              )}
              Submit onboarding
            </button>
          </form>

          <aside className="h-fit rounded-md border border-[#dfe3e8] bg-white p-5 lg:sticky lg:top-6">
            <p className="text-xs font-semibold uppercase text-[#667085]">
              What happens next
            </p>
            <ol className="mt-4 space-y-4">
              {[
                "The receptionist configuration is generated",
                "The phone number and call routing are provisioned",
                "We test normal and emergency calls",
                "You approve the final call experience",
                "The number goes live",
              ].map((item, index) => (
                <li key={item} className="flex gap-2.5 text-sm text-[#475467]">
                  <ChevronRight
                    size={16}
                    className="mt-0.5 shrink-0 text-[#155eef]"
                  />
                  <span>
                    <strong className="text-[#17202a]">{index + 1}.</strong>{" "}
                    {item}
                  </span>
                </li>
              ))}
            </ol>
            <div className="mt-5 border-t border-[#edf0f2] pt-5 text-xs leading-5 text-[#667085]">
              The only separate connection may be calendar or CRM access when
              the selected platform requires the client to authorize it.
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function FormSection({
  number,
  title,
  description,
  children,
}: {
  number: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4 border-b border-[#edf0f2] pb-7 last:border-0 last:pb-0">
      <div className="flex gap-3">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-[#eef4ff] text-xs font-bold text-[#155eef]">
          {number}
        </span>
        <div>
          <h2 className="text-base font-semibold">{title}</h2>
          <p className="mt-0.5 text-xs text-[#667085]">{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm font-medium text-[#344054]">
      {label}
      {required && <span className="ml-1 text-[#d92d20]">*</span>}
      {children}
    </label>
  );
}
