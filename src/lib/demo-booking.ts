import { AI_RECEPTIONIST_PACKAGES } from "@/lib/pricing";

export const DEMO_SLOT_HOURS = [10, 12, 14, 16] as const;
export const DEMO_TIMEZONE = "America/Chicago";

function centralDateParts(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: DEMO_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  }).formatToParts(date);

  return Object.fromEntries(parts.map((part) => [part.type, part.value]));
}

export function getDemoSlots(days = 7) {
  const slots: string[] = [];
  const cursor = new Date();
  cursor.setUTCDate(cursor.getUTCDate() + 1);

  while (slots.length < days * DEMO_SLOT_HOURS.length) {
    const parts = centralDateParts(cursor);
    if (parts.weekday !== "Sat" && parts.weekday !== "Sun") {
      for (const hour of DEMO_SLOT_HOURS) {
        slots.push(
          `${parts.year}-${parts.month}-${parts.day}T${String(hour).padStart(2, "0")}:00:00`,
        );
      }
    }
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return slots;
}

export function isValidDemoSlot(value: string) {
  return getDemoSlots().includes(value);
}

export function formatDemoSlot(value: string) {
  const [date, time] = value.split("T");
  const [year, month, day] = date.split("-").map(Number);
  const hour = Number(time.slice(0, 2));
  const label = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
  const hourLabel = hour > 12 ? hour - 12 : hour;
  const period = hour >= 12 ? "PM" : "AM";
  return `${label} at ${hourLabel}:00 ${period} CT`;
}

export function demoOpportunityValues() {
  const starter = AI_RECEPTIONIST_PACKAGES.starter;
  return {
    setupValue: starter.setupFee,
    monthlyValue: starter.monthlyPrice,
  };
}
