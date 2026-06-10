import type { ServiceId } from "@/lib/services";
import { AI_RECEPTIONIST_PACKAGES } from "@/lib/pricing";

export type PackageRecord = {
  serviceId: ServiceId;
  packageName: string;
  setup: number | null;
  monthly: number | null;
  included: string;
  closerCommission: number | null;
};

const receptionistPackages: PackageRecord[] = Object.values(
  AI_RECEPTIONIST_PACKAGES,
).map((plan) => ({
  serviceId: "ai-receptionist",
  packageName: plan.name,
  setup: plan.setupFee,
  monthly: plan.monthlyPrice,
  included: `${plan.includedMinutes.toLocaleString()} AI minutes, ${plan.includedSmsSegments.toLocaleString()} SMS segments, ${plan.includedNumbers} phone ${plan.includedNumbers === 1 ? "number" : "numbers"}, and ${plan.includedCallFlows} call ${plan.includedCallFlows === 1 ? "flow" : "flows"}`,
  closerCommission: plan.closerCommission,
}));

export const PACKAGE_RECORDS: PackageRecord[] = [
  ...receptionistPackages,
  {
    serviceId: "outbound",
    packageName: "Outbound Growth",
    setup: 0,
    monthly: 3500,
    included:
      "Outbound infrastructure, lead sourcing, campaigns, reply handling, appointment booking, and reporting",
    closerCommission: null,
  },
  {
    serviceId: "outbound",
    packageName: "Outbound Scale",
    setup: 0,
    monthly: 5500,
    included:
      "Higher-volume infrastructure, expanded targeting, multi-channel campaigns, optimization, and priority reporting",
    closerCommission: null,
  },
  {
    serviceId: "website-conversion",
    packageName: "Starter Website",
    setup: 1000,
    monthly: 0,
    included:
      "One to three pages, mobile design, contact form, local SEO setup, launch, and three months of minor edits",
    closerCommission: 500,
  },
  {
    serviceId: "website-conversion",
    packageName: "Growth Website",
    setup: 2000,
    monthly: 0,
    included:
      "Four to six pages, gallery, testimonials, FAQ, conversion layout, and six months of minor edits",
    closerCommission: 1000,
  },
  {
    serviceId: "website-conversion",
    packageName: "Premium Website",
    setup: 4000,
    monthly: 0,
    included:
      "Up to ten pages, custom design, service-area pages, priority turnaround, and twelve months of minor edits",
    closerCommission: 1400,
  },
];
