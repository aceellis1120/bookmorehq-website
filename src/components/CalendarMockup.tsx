"use client";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];

interface Slot {
  time: string;
  status: "booked" | "available";
  label?: string;
}

const schedule: Record<string, Slot[]> = {
  Mon: [
    { time: "9:00", status: "booked", label: "Discovery Call — James R." },
    { time: "10:30", status: "booked", label: "Strategy Call — Sarah M." },
    { time: "1:00", status: "available" },
    { time: "3:00", status: "booked", label: "Onboarding — TechFlow Inc." },
  ],
  Tue: [
    { time: "9:00", status: "booked", label: "Pipeline Review — Mark D." },
    { time: "10:30", status: "available" },
    { time: "1:00", status: "booked", label: "Demo Call — Lisa K." },
    { time: "3:00", status: "booked", label: "Strategy Call — David W." },
  ],
  Wed: [
    { time: "9:00", status: "booked", label: "Discovery Call — Amy T." },
    { time: "10:30", status: "booked", label: "Kickoff — Nova Labs" },
    { time: "1:00", status: "booked", label: "Check-in — Ryan P." },
    { time: "3:00", status: "available" },
  ],
  Thu: [
    { time: "9:00", status: "available" },
    { time: "10:30", status: "booked", label: "Strategy Call — Emma J." },
    { time: "1:00", status: "booked", label: "Demo Call — Chris B." },
    { time: "3:00", status: "booked", label: "Onboarding — ScaleUp Co." },
  ],
  Fri: [
    { time: "9:00", status: "booked", label: "Discovery Call — Nina S." },
    { time: "10:30", status: "booked", label: "Pipeline Review — Tom H." },
    { time: "1:00", status: "booked", label: "Strategy Call — Jen L." },
    { time: "3:00", status: "booked", label: "Wrap-up — Alex M." },
  ],
};

export default function CalendarMockup() {
  return (
    <div className="rounded-2xl border border-[#1F2937] bg-[#0F172A] p-5 shadow-[0_0_40px_rgba(59,130,246,0.08)] max-w-lg ml-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">March 2026</h3>
        <span className="text-xs text-[#3B82F6] font-medium">This Week</span>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-5 gap-2 mb-3">
        {days.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-[#94A3B8]"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Time slots grid */}
      <div className="grid grid-cols-5 gap-2">
        {days.map((day) =>
          schedule[day].map((slot, i) => (
            <div
              key={`${day}-${i}`}
              className={`rounded-lg px-2 py-2 text-center ${
                slot.status === "booked"
                  ? "bg-[#3B82F6]/15 border border-[#3B82F6]/30"
                  : "bg-[#0B0F14] border border-[#1F2937]"
              }`}
            >
              <div className="text-[10px] text-[#94A3B8] mb-1">{slot.time}</div>
              {slot.status === "booked" ? (
                <div className="text-[9px] text-[#3B82F6] font-medium leading-tight truncate">
                  {slot.label?.split("—")[0]?.trim() ?? "Booked"}
                </div>
              ) : (
                <div className="text-[9px] text-[#94A3B8]/60">Available</div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between text-[10px] text-[#94A3B8]">
        <span>16 of 20 slots booked</span>
        <span className="text-[#3B82F6]">80% capacity</span>
      </div>
    </div>
  );
}
