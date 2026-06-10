import type Stripe from "stripe";
import type { AiReceptionistPackage, PackageId } from "@/lib/pricing";

const priceEnvironmentKeys: Record<
  PackageId,
  { setup: string; monthly: string }
> = {
  starter: {
    setup: "STRIPE_STARTER_SETUP_PRICE_ID",
    monthly: "STRIPE_STARTER_MONTHLY_PRICE_ID",
  },
  growth: {
    setup: "STRIPE_GROWTH_SETUP_PRICE_ID",
    monthly: "STRIPE_GROWTH_MONTHLY_PRICE_ID",
  },
  scale: {
    setup: "STRIPE_SCALE_SETUP_PRICE_ID",
    monthly: "STRIPE_SCALE_MONTHLY_PRICE_ID",
  },
};

export function getStripeLineItems(
  plan: AiReceptionistPackage,
): Stripe.Checkout.SessionCreateParams.LineItem[] {
  const keys = priceEnvironmentKeys[plan.id];
  const setupPrice = process.env[keys.setup];
  const monthlyPrice = process.env[keys.monthly];

  if (setupPrice && monthlyPrice) {
    return [
      { price: setupPrice, quantity: 1 },
      { price: monthlyPrice, quantity: 1 },
    ];
  }

  return [
    {
      price_data: {
        currency: "usd",
        product_data: {
          name: `BookMoreHQ AI Receptionist ${plan.name} Setup`,
          description: "Custom configuration, call flow, testing, and launch.",
        },
        unit_amount: plan.setupFee * 100,
      },
      quantity: 1,
    },
    {
      price_data: {
        currency: "usd",
        product_data: {
          name: `BookMoreHQ AI Receptionist ${plan.name}`,
          description: `${plan.includedMinutes.toLocaleString()} AI minutes and ${plan.includedSmsSegments.toLocaleString()} SMS segments per month.`,
        },
        recurring: { interval: "month" },
        unit_amount: plan.monthlyPrice * 100,
      },
      quantity: 1,
    },
  ];
}
