import type { PackageId } from "@/lib/pricing";
import type { ServiceId } from "@/lib/services";

export type OwnerSection =
  | "overview"
  | "pipeline"
  | "clients"
  | "closers"
  | "commissions"
  | "packages"
  | "payments";

export const OPPORTUNITY_STAGES = [
  "Lead",
  "Contacted",
  "Demo",
  "Proposal",
  "Payment",
  "Won",
  "Lost",
] as const;

export type OpportunityStage = (typeof OPPORTUNITY_STAGES)[number];

export const OPPORTUNITY_STAGE_TONES: Record<
  OpportunityStage,
  "blue" | "green" | "amber" | "red" | "slate"
> = {
  Lead: "slate",
  Contacted: "blue",
  Demo: "blue",
  Proposal: "amber",
  Payment: "amber",
  Won: "green",
  Lost: "red",
};

export type Opportunity = {
  id: string;
  company: string;
  contactName: string;
  email: string;
  phone: string;
  city: string;
  niche: string;
  serviceId: ServiceId;
  packageId: PackageId;
  stage: OpportunityStage;
  closer: string;
  nextAction: string;
  nextActionAt: string;
  setupValue: number;
  monthlyValue: number;
  createdAt: string;
  updatedAt: string;
};

export type ClientStatus = "Onboarding" | "Testing" | "Live" | "Paused";

export type ClientAccount = {
  id: string;
  company: string;
  contactName: string;
  email: string;
  phone: string;
  serviceId: ServiceId;
  packageId: PackageId;
  status: ClientStatus;
  closer: string;
  mrr: number;
  usageMinutes: number;
  smsSegments: number;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  blandPhoneNumber?: string;
  launchDate?: string;
  createdAt: string;
  updatedAt: string;
};

export type PaymentStatus = "Paid" | "Pending" | "Failed" | "Refunded";

export type PaymentRecord = {
  id: string;
  company: string;
  serviceId: ServiceId;
  packageId: PackageId;
  type: "Initial checkout" | "Monthly subscription" | "Overage" | "Manual";
  gross: number;
  processing: number;
  closerPayout: number;
  bookmoreTake: number;
  closer: string;
  status: PaymentStatus;
  stripeSessionId?: string;
  stripeInvoiceId?: string;
  createdAt: string;
};

export type CommissionStatus = "Pending" | "Approved" | "Paid";

export type CommissionRecord = {
  id: string;
  closer: string;
  company: string;
  serviceId: ServiceId;
  packageId: PackageId;
  collected: number;
  closerPayout: number;
  bookmoreTake: number;
  status: CommissionStatus;
  createdAt: string;
  paidAt?: string;
};

export type OnboardingRecord = {
  id: string;
  clientId?: string;
  company: string;
  serviceId: ServiceId;
  packageId: PackageId;
  status: "Not started" | "Submitted" | "In build" | "Testing" | "Complete";
  checkoutSessionId?: string;
  provisioningStatus?:
    | "Ready"
    | "Provisioning"
    | "Provisioned"
    | "Failed";
  provisioningAttemptId?: string;
  promptCompilationStatus?:
    | "Pending"
    | "Compiling"
    | "Compiled"
    | "Needs review"
    | "Failed";
  promptCompilationAttemptId?: string;
  compiledReceptionist?: CompiledReceptionistConfig;
  compilerModel?: string;
  compiledAt?: string;
  compilationError?: string;
  blandPhoneNumber?: string;
  provisionedAt?: string;
  provisioningError?: string;
  payload?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};

export type CompiledReceptionistConfig = {
  systemPrompt: string;
  firstSentence: string;
  analysisPrompt: string;
  summaryPrompt: string;
  toneSummary: string;
  enabledCapabilities: string[];
  blockedCapabilities: string[];
  testScenarios: string[];
  warnings: string[];
  requiresReview: boolean;
  reviewReason: string;
};

export type OperationsState = {
  version: 1;
  lastStripeSyncAt?: string;
  opportunities: Opportunity[];
  clients: ClientAccount[];
  payments: PaymentRecord[];
  commissions: CommissionRecord[];
  onboarding: OnboardingRecord[];
  processedBlandCallIds: string[];
  alertedBlandCallIds: string[];
  updatedAt: string;
};

export type SalesTeamMember = {
  id: string;
  name: string;
  email: string;
  username: string;
};

export type OperationsPayload = OperationsState & {
  team: SalesTeamMember[];
  system: {
    stripeMode: "test" | "live" | "not configured";
    storageConnected: boolean;
    stripeWebhookConfigured: boolean;
    blandConfigured: boolean;
    openAiConfigured: boolean;
    leadAlertsConfigured: boolean;
    autoProvisionEnabled: boolean;
  };
};

export function createEmptyOperationsState(): OperationsState {
  return {
    version: 1,
    opportunities: [],
    clients: [],
    payments: [],
    commissions: [],
    onboarding: [],
    processedBlandCallIds: [],
    alertedBlandCallIds: [],
    updatedAt: new Date().toISOString(),
  };
}
