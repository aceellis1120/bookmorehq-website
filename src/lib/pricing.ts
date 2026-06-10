export type PackageId = "starter" | "growth" | "scale";

export type AiReceptionistPackage = {
  id: PackageId;
  name: string;
  setupFee: number;
  closerCommission: number;
  monthlyPrice: number;
  includedMinutes: number;
  includedSmsSegments: number;
  includedLocations: number;
  includedNumbers: number;
  includedCallFlows: number;
  supportAllowance: number;
  infrastructureAllowance: number;
};

export const AI_MINUTE_OVERAGE_PRICE = 0.5;
export const SMS_SEGMENT_OVERAGE_PRICE = 0.05;
export const ADDITIONAL_NUMBER_PRICE = 50;

export const COST_ASSUMPTIONS = {
  blandAiMinute: 0.14,
  twilioInboundMinute: 0.0085,
  twilioNumberMonthly: 1.15,
  twilioSmsSegment: 0.0083,
  smsCarrierFeeReserve: 0.004,
  a2pCampaignMonthly: 2,
  a2pRegistrationOneTime: 19,
  transferUsageRate: 0.1,
  transferMinute: 0.0725,
  stripeRateReserve: 0.036,
  stripeFixedFee: 0.3,
  setupLaborAllowance: 200,
} as const;

export const AI_RECEPTIONIST_PACKAGES: Record<
  PackageId,
  AiReceptionistPackage
> = {
  starter: {
    id: "starter",
    name: "Starter",
    setupFee: 2000,
    closerCommission: 1000,
    monthlyPrice: 1000,
    includedMinutes: 500,
    includedSmsSegments: 500,
    includedLocations: 1,
    includedNumbers: 1,
    includedCallFlows: 1,
    supportAllowance: 100,
    infrastructureAllowance: 5,
  },
  growth: {
    id: "growth",
    name: "Growth",
    setupFee: 2500,
    closerCommission: 1250,
    monthlyPrice: 1500,
    includedMinutes: 1000,
    includedSmsSegments: 1000,
    includedLocations: 1,
    includedNumbers: 1,
    includedCallFlows: 2,
    supportAllowance: 150,
    infrastructureAllowance: 8,
  },
  scale: {
    id: "scale",
    name: "Scale",
    setupFee: 3000,
    closerCommission: 1500,
    monthlyPrice: 2500,
    includedMinutes: 2500,
    includedSmsSegments: 2500,
    includedLocations: 3,
    includedNumbers: 3,
    includedCallFlows: 5,
    supportAllowance: 250,
    infrastructureAllowance: 12,
  },
};

export function isPackageId(
  value: string | null | undefined,
): value is PackageId {
  return Boolean(value && value in AI_RECEPTIONIST_PACKAGES);
}

export function calculatePackageEconomics(plan: AiReceptionistPackage) {
  const voiceCost =
    plan.includedMinutes *
    (COST_ASSUMPTIONS.blandAiMinute +
      COST_ASSUMPTIONS.twilioInboundMinute);
  const smsCost =
    plan.includedSmsSegments *
    (COST_ASSUMPTIONS.twilioSmsSegment +
      COST_ASSUMPTIONS.smsCarrierFeeReserve);
  const fixedVendorCost =
    plan.includedNumbers * COST_ASSUMPTIONS.twilioNumberMonthly +
    COST_ASSUMPTIONS.a2pCampaignMonthly;
  const transferReserve =
    plan.includedMinutes *
    COST_ASSUMPTIONS.transferUsageRate *
    COST_ASSUMPTIONS.transferMinute;
  const paymentProcessingReserve =
    plan.monthlyPrice * COST_ASSUMPTIONS.stripeRateReserve +
    COST_ASSUMPTIONS.stripeFixedFee;
  const directMonthlyCost =
    voiceCost +
    smsCost +
    fixedVendorCost +
    transferReserve +
    paymentProcessingReserve;
  const monthlyContribution =
    plan.monthlyPrice -
    directMonthlyCost -
    plan.supportAllowance -
    plan.infrastructureAllowance;

  return {
    voiceCost,
    smsCost,
    fixedVendorCost,
    transferReserve,
    paymentProcessingReserve,
    directMonthlyCost,
    monthlyContribution,
    contributionMargin: monthlyContribution / plan.monthlyPrice,
  };
}

export function calculateInitialPaymentEconomics(
  plan: AiReceptionistPackage,
) {
  const initialPayment = plan.setupFee + plan.monthlyPrice;
  const closerCommission = plan.closerCommission;
  const processingReserve =
    initialPayment * COST_ASSUMPTIONS.stripeRateReserve +
    COST_ASSUMPTIONS.stripeFixedFee;
  const monthly = calculatePackageEconomics(plan);
  const firstMonthVendorCost =
    monthly.voiceCost +
    monthly.smsCost +
    monthly.fixedVendorCost +
    monthly.transferReserve;
  const estimatedContribution =
    initialPayment -
    closerCommission -
    processingReserve -
    COST_ASSUMPTIONS.a2pRegistrationOneTime -
    firstMonthVendorCost -
    COST_ASSUMPTIONS.setupLaborAllowance -
    plan.supportAllowance -
    plan.infrastructureAllowance;

  return {
    initialPayment,
    closerCommission,
    processingReserve,
    firstMonthVendorCost,
    estimatedContribution,
  };
}

export function calculateOverage(
  plan: AiReceptionistPackage,
  usedMinutes: number,
  usedSmsSegments: number,
) {
  const excessMinutes = Math.max(
    0,
    usedMinutes - plan.includedMinutes,
  );
  const excessSmsSegments = Math.max(
    0,
    usedSmsSegments - plan.includedSmsSegments,
  );

  return {
    excessMinutes,
    excessSmsSegments,
    minuteCharge: excessMinutes * AI_MINUTE_OVERAGE_PRICE,
    smsCharge: excessSmsSegments * SMS_SEGMENT_OVERAGE_PRICE,
    total:
      excessMinutes * AI_MINUTE_OVERAGE_PRICE +
      excessSmsSegments * SMS_SEGMENT_OVERAGE_PRICE,
  };
}
