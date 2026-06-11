"use client";

import { CalendarClock, CheckCircle2, Loader2, PhoneCall } from "lucide-react";
import { useEffect, useState } from "react";
import { formatDemoSlot } from "@/lib/demo-booking";

type Availability = {
  closerName: string;
  slots: string[];
};

export default function DemoBookingForm({ closer }: { closer: string }) {
  const [availability, setAvailability] = useState<Availability | null>(null);
  const [slot, setSlot] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [complete, setComplete] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    void fetch(`/api/book-demo?closer=${encodeURIComponent(closer)}`)
      .then(async (response) => {
        const body = (await response.json()) as Availability & { error?: string };
        if (!response.ok) throw new Error(body.error || "Unable to load times.");
        setAvailability(body);
        setSlot(body.slots[0] || "");
      })
      .catch((loadError) =>
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load times.",
        ),
      );
  }, [closer]);

  async function bookDemo(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    const form = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/book-demo", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          closer,
          company: form.get("company"),
          contactName: form.get("contactName"),
          email: form.get("email"),
          phone: form.get("phone"),
          niche: form.get("niche"),
          website: form.get("website"),
          slot,
        }),
      });
      const body = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(body.error || "Unable to book demo.");
      setComplete(true);
    } catch (bookingError) {
      setError(
        bookingError instanceof Error
          ? bookingError.message
          : "Unable to book demo.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (complete) {
    return (
      <div className="grid min-h-[420px] place-items-center text-center">
        <div>
          <CheckCircle2 className="mx-auto text-[#18794e]" size={42} />
          <h1 className="mt-5 text-2xl font-semibold text-[#17202a]">
            Your demo is booked
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#667085]">
            {availability?.closerName || "Your BookMoreHQ specialist"} will
            contact you at the number provided for a live AI receptionist
            demonstration.
          </p>
          <p className="mt-4 text-sm font-semibold text-[#155eef]">
            {formatDemoSlot(slot)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={bookDemo} className="grid gap-6 lg:grid-cols-[0.85fr_1fr]">
      <section className="min-w-0 overflow-hidden bg-[#17202a] p-7 text-white sm:p-9">
        <PhoneCall size={28} />
        <p className="mt-8 text-xs font-semibold uppercase text-[#8fb4ff]">
          BookMoreHQ live demo
        </p>
        <h1 className="mt-2 max-w-full break-words text-2xl font-semibold leading-tight sm:text-3xl">
          Hear your next customer answered in real time.
        </h1>
        <p className="mt-4 text-sm leading-6 text-[#cfd5dc]">
          Experience how the AI receptionist answers, qualifies the caller,
          captures urgency, and delivers a structured lead alert.
        </p>
        <div className="mt-8 border-t border-white/15 pt-6 text-sm text-[#cfd5dc]">
          <p className="font-semibold text-white">
            {availability?.closerName || "BookMoreHQ specialist"}
          </p>
          <p className="mt-1">20-minute phone demonstration</p>
        </div>
      </section>

      <section className="min-w-0 overflow-hidden p-7 sm:p-9">
        <div className="flex items-center gap-2 text-[#155eef]">
          <CalendarClock size={20} />
          <p className="text-sm font-semibold">Choose your demo time</p>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {availability?.slots.slice(0, 12).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setSlot(item)}
              className={`h-11 min-w-0 whitespace-normal rounded-md border px-3 text-left text-xs font-semibold ${
                slot === item
                  ? "border-[#155eef] bg-[#eef4ff] text-[#155eef]"
                  : "border-[#dfe3e8] text-[#475467] hover:border-[#98a2b3]"
              }`}
            >
              {formatDemoSlot(item)}
            </button>
          ))}
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          {[
            ["company", "Company name", "text"],
            ["contactName", "Your name", "text"],
            ["email", "Email", "email"],
            ["phone", "Phone", "tel"],
            ["niche", "Industry", "text"],
          ].map(([name, label, type]) => (
            <label
              key={name}
              className={`text-sm font-medium text-[#344054] ${
                name === "niche" ? "sm:col-span-2" : ""
              }`}
            >
              {label}
              <input
                required
                name={name}
                type={type}
                className="mt-1.5 h-11 w-full rounded-md border border-[#cfd5dc] px-3 outline-none focus:border-[#155eef]"
              />
            </label>
          ))}
          <input
            name="website"
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
            aria-hidden="true"
          />
        </div>

        {error && (
          <p className="mt-4 rounded-md border border-[#f3b7b9] bg-[#fff0f0] p-3 text-sm text-[#c53035]">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting || !slot}
          className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[#155eef] px-4 text-sm font-semibold text-white hover:bg-[#004eeb] disabled:opacity-60"
        >
          {submitting && <Loader2 size={17} className="animate-spin" />}
          Book live demo
        </button>
        <p className="mt-3 text-center text-xs text-[#667085]">
          Times shown in Central Time. No payment required.
        </p>
      </section>
    </form>
  );
}
