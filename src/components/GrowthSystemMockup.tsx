"use client";

import {
  Bot,
  CheckCircle2,
  Globe2,
  Megaphone,
  MessageSquareText,
  PhoneCall,
  Search,
  Star,
} from "lucide-react";

const systems = [
  {
    name: "AI Receptionist",
    detail: "Calls answered and qualified",
    icon: PhoneCall,
    tone: "text-[#60a5fa] bg-[#172554]",
  },
  {
    name: "Outbound Growth",
    detail: "Target accounts contacted",
    icon: Search,
    tone: "text-[#fbbf24] bg-[#422006]",
  },
  {
    name: "Website Conversion",
    detail: "Traffic converted into leads",
    icon: Globe2,
    tone: "text-[#34d399] bg-[#052e2b]",
  },
  {
    name: "AI Follow-Up",
    detail: "Open leads kept moving",
    icon: MessageSquareText,
    tone: "text-[#c084fc] bg-[#2e1065]",
  },
  {
    name: "Local Authority",
    detail: "Reviews and trust strengthened",
    icon: Star,
    tone: "text-[#fb7185] bg-[#4c0519]",
  },
  {
    name: "Paid Growth",
    detail: "Campaigns tracked to calls",
    icon: Megaphone,
    tone: "text-[#fb923c] bg-[#431407]",
  },
];

export default function GrowthSystemMockup() {
  return (
    <div className="mx-auto w-full min-w-0 max-w-xl overflow-hidden rounded-lg border border-[#273449] bg-[#101722] shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
      <div className="flex items-center justify-between border-b border-[#273449] px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-[#2563eb] text-white">
            <Bot size={17} />
          </span>
          <div>
            <p className="text-xs font-semibold text-white">BookMoreHQ Growth OS</p>
            <p className="text-[10px] text-[#8ea0b8]">Unified growth command center</p>
          </div>
        </div>
        <span className="hidden items-center gap-1.5 rounded-md border border-[#14532d] bg-[#052e1b] px-2 py-1 text-[10px] font-semibold text-[#6ee7a8] sm:inline-flex">
          <span className="h-1.5 w-1.5 rounded-full bg-[#4ade80]" />
          Systems online
        </span>
      </div>

      <div className="grid grid-cols-2 gap-px bg-[#273449] sm:grid-cols-3">
        {systems.map((system) => {
          const Icon = system.icon;
          return (
            <div key={system.name} className="min-w-0 bg-[#101722] p-3 sm:p-4">
              <span className={`grid h-8 w-8 place-items-center rounded-md ${system.tone}`}>
                <Icon size={16} />
              </span>
              <p className="mt-3 break-words text-xs font-semibold text-white">{system.name}</p>
              <p className="mt-1 text-[10px] leading-4 text-[#8ea0b8]">
                {system.detail}
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-3 border-t border-[#273449] bg-[#0b111a] p-4 sm:grid-cols-3">
        {[
          ["Lead captured", "Call, form, ad, or outreach"],
          ["Lead worked", "Qualified, routed, and followed up"],
          ["Revenue tracked", "Pipeline and performance visible"],
        ].map(([title, detail]) => (
          <div key={title} className="flex gap-2">
            <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-[#4ade80]" />
            <div>
              <p className="text-[11px] font-semibold text-white">{title}</p>
              <p className="mt-0.5 text-[9px] leading-3 text-[#7f8da3]">{detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
