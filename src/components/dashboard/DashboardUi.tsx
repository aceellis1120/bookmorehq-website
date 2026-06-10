import type { LucideIcon } from "lucide-react";

export function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
  tone = "blue",
}: {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  tone?: "blue" | "green" | "amber" | "slate";
}) {
  const tones = {
    blue: "bg-[#eaf2ff] text-[#155eef]",
    green: "bg-[#eaf8ef] text-[#198754]",
    amber: "bg-[#fff4e5] text-[#b25e09]",
    slate: "bg-[#eef1f4] text-[#475467]",
  };

  return (
    <article className="min-w-0 rounded-md border border-[#dfe3e8] bg-white p-5">
      <div className="mb-5 flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-[#667085]">{label}</p>
        <span className={`grid h-9 w-9 place-items-center rounded-md ${tones[tone]}`}>
          <Icon size={18} strokeWidth={1.8} />
        </span>
      </div>
      <p className="text-2xl font-semibold text-[#17202a]">{value}</p>
      <p className="mt-1 text-xs text-[#667085]">{detail}</p>
    </article>
  );
}

export function StatusBadge({
  children,
  tone = "slate",
}: {
  children: React.ReactNode;
  tone?: "blue" | "green" | "amber" | "red" | "slate";
}) {
  const tones = {
    blue: "border-[#b9d1ff] bg-[#eef4ff] text-[#155eef]",
    green: "border-[#b7e3c8] bg-[#edf9f1] text-[#18794e]",
    amber: "border-[#f2d3a2] bg-[#fff7e8] text-[#a15c07]",
    red: "border-[#f3b7b9] bg-[#fff0f0] text-[#c53035]",
    slate: "border-[#dfe3e8] bg-[#f5f7f9] text-[#475467]",
  };

  return (
    <span
      className={`inline-flex min-h-6 items-center rounded-full border px-2.5 text-xs font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  action,
}: {
  eyebrow?: string;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div>
        {eyebrow && (
          <p className="mb-1 text-[11px] font-semibold uppercase text-[#667085]">
            {eyebrow}
          </p>
        )}
        <h2 className="text-lg font-semibold text-[#17202a]">{title}</h2>
      </div>
      {action}
    </div>
  );
}
