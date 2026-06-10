import { BarChart3, Boxes, Clock3, Workflow } from "lucide-react";

const capabilities = [
  {
    value: "24/7",
    label: "AI call coverage",
    icon: Clock3,
  },
  {
    value: "7",
    label: "connected growth layers",
    icon: Boxes,
  },
  {
    value: "1",
    label: "operating dashboard",
    icon: BarChart3,
  },
  {
    value: "End to end",
    label: "lead-to-booking workflow",
    icon: Workflow,
  },
];

export default function Stats() {
  return (
    <section className="border-y border-[#202b3a] bg-[#101722]">
      <div className="mx-auto grid max-w-7xl sm:grid-cols-2 lg:grid-cols-4">
        {capabilities.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="flex min-h-32 items-center gap-4 border-b border-[#202b3a] px-6 py-7 sm:border-r lg:border-b-0"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-[#172554] text-[#60a5fa]">
                <Icon size={19} />
              </span>
              <div>
                <p className="text-xl font-bold text-white">{item.value}</p>
                <p className="mt-1 text-xs text-[#93a3b8]">{item.label}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
