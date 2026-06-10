export type ServiceId =
  | "ai-receptionist"
  | "outbound"
  | "website-conversion"
  | "ai-follow-up"
  | "local-authority"
  | "paid-growth"
  | "growth-os";

export type ServiceLine = {
  id: ServiceId;
  name: string;
  shortName: string;
  status: "Active" | "Existing" | "Planning" | "Future";
  pricingStatus: "Locked" | "Existing" | "Not configured";
  description: string;
};

export const SERVICE_LINES: ServiceLine[] = [
  {
    id: "ai-receptionist",
    name: "AI Receptionist",
    shortName: "Receptionist",
    status: "Active",
    pricingStatus: "Locked",
    description: "Inbound calls, qualification, routing, booking, and alerts.",
  },
  {
    id: "outbound",
    name: "Outbound Growth",
    shortName: "Outbound",
    status: "Existing",
    pricingStatus: "Locked",
    description: "Prospecting, outreach, appointment setting, and pipeline.",
  },
  {
    id: "website-conversion",
    name: "Website Conversion",
    shortName: "Websites",
    status: "Existing",
    pricingStatus: "Locked",
    description: "Websites, landing pages, forms, and conversion tracking.",
  },
  {
    id: "ai-follow-up",
    name: "AI Follow-Up",
    shortName: "Follow-Up",
    status: "Active",
    pricingStatus: "Locked",
    description: "Lead nurture, estimate follow-up, reactivation, and no-shows.",
  },
  {
    id: "local-authority",
    name: "Local Authority",
    shortName: "Authority",
    status: "Active",
    pricingStatus: "Locked",
    description: "Reviews, Google Business Profile, and local trust.",
  },
  {
    id: "paid-growth",
    name: "Paid Growth",
    shortName: "Paid Growth",
    status: "Active",
    pricingStatus: "Locked",
    description: "Advertising, retargeting, and booked-job attribution.",
  },
  {
    id: "growth-os",
    name: "BookMoreHQ Growth OS",
    shortName: "Growth OS",
    status: "Active",
    pricingStatus: "Locked",
    description: "Unified demand, capture, conversion, and reporting.",
  },
];
