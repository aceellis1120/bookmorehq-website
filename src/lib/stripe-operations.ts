import Stripe from "stripe";
import {
  AI_RECEPTIONIST_PACKAGES,
  COST_ASSUMPTIONS,
  isPackageId,
} from "@/lib/pricing";
import { getStripe } from "@/lib/stripe";
import {
  type CommissionRecord,
  type OperationsState,
  type PaymentRecord,
} from "@/lib/operations-types";
import {
  readOperationsState,
  updateOperationsState,
} from "@/lib/operations-store";

const stripeSyncInterval = 5 * 60 * 1000;

function paymentEconomics(gross: number, closerPayout: number) {
  const processing =
    gross * COST_ASSUMPTIONS.stripeRateReserve +
    COST_ASSUMPTIONS.stripeFixedFee;

  return {
    processing,
    bookmoreTake: Math.max(0, gross - processing - closerPayout),
  };
}

function syncCheckoutSession(
  state: OperationsState,
  session: Stripe.Checkout.Session,
) {
  const packageId = session.metadata?.packageId;
  if (
    session.payment_status !== "paid" ||
    session.status !== "complete" ||
    session.metadata?.serviceId !== "ai-receptionist" ||
    !isPackageId(packageId)
  ) {
    return;
  }

  const plan = AI_RECEPTIONIST_PACKAGES[packageId];
  const createdAt = new Date(session.created * 1000).toISOString();
  const company = session.metadata?.companyName || "Unnamed client";
  const closer = session.metadata?.closer || "Unassigned";
  const closerPayout = plan.closerCommission;
  const gross = (session.amount_total ?? 0) / 100;
  const economics = paymentEconomics(gross, closerPayout);
  const paymentId = `stripe-session-${session.id}`;

  if (!state.payments.some((payment) => payment.id === paymentId)) {
    const payment: PaymentRecord = {
      id: paymentId,
      company,
      serviceId: "ai-receptionist",
      packageId,
      type: "Initial checkout",
      gross,
      processing: economics.processing,
      closerPayout,
      bookmoreTake: economics.bookmoreTake,
      closer,
      status: "Paid",
      stripeSessionId: session.id,
      createdAt,
    };
    state.payments.unshift(payment);
  }

  const commissionId = `commission-${session.id}`;
  if (
    closer !== "Unassigned" &&
    !state.commissions.some((commission) => commission.id === commissionId)
  ) {
    const commission: CommissionRecord = {
      id: commissionId,
      closer,
      company,
      serviceId: "ai-receptionist",
      packageId,
      collected: gross,
      closerPayout,
      bookmoreTake: economics.bookmoreTake,
      status: "Pending",
      createdAt,
    };
    state.commissions.unshift(commission);
  }

  const customerId =
    typeof session.customer === "string" ? session.customer : undefined;
  const subscriptionId =
    typeof session.subscription === "string"
      ? session.subscription
      : undefined;
  const email =
    session.customer_details?.email || session.customer_email || "";
  const phone =
    session.metadata?.contactPhone ||
    session.customer_details?.phone ||
    "";
  const existingClient = state.clients.find(
    (client) =>
      (customerId && client.stripeCustomerId === customerId) ||
      (email && client.email.toLowerCase() === email.toLowerCase()),
  );

  if (existingClient) {
    const contactName = session.metadata?.contactName || existingClient.contactName;
    const changed =
      existingClient.company !== company ||
      existingClient.contactName !== contactName ||
      existingClient.email !== email ||
      existingClient.phone !== phone ||
      existingClient.packageId !== packageId ||
      existingClient.closer !== closer ||
      existingClient.mrr !== plan.monthlyPrice ||
      existingClient.stripeCustomerId !== customerId ||
      existingClient.stripeSubscriptionId !== subscriptionId;
    if (changed) {
      existingClient.company = company;
      existingClient.contactName = contactName;
      existingClient.email = email;
      existingClient.phone = phone;
      existingClient.packageId = packageId;
      existingClient.closer = closer;
      existingClient.mrr = plan.monthlyPrice;
      existingClient.stripeCustomerId = customerId;
      existingClient.stripeSubscriptionId = subscriptionId;
      existingClient.updatedAt = new Date().toISOString();
    }
  } else {
    state.clients.unshift({
      id: `client-${session.id}`,
      company,
      contactName: session.metadata?.contactName || "",
      email,
      phone,
      serviceId: "ai-receptionist",
      packageId,
      status: "Onboarding",
      closer,
      mrr: plan.monthlyPrice,
      usageMinutes: 0,
      smsSegments: 0,
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
      createdAt,
      updatedAt: createdAt,
    });
  }

  const opportunity = state.opportunities.find(
    (record) =>
      record.company.toLowerCase() === company.toLowerCase() &&
      record.closer === closer,
  );
  if (opportunity && opportunity.stage !== "Won") {
    opportunity.stage = "Won";
    opportunity.updatedAt = new Date().toISOString();
  }

  if (
    !state.onboarding.some(
      (record) => record.id === `onboarding-${session.id}`,
    )
  ) {
    state.onboarding.unshift({
      id: `onboarding-${session.id}`,
      clientId: existingClient?.id || `client-${session.id}`,
      company,
      serviceId: "ai-receptionist",
      packageId,
      status: "Not started",
      createdAt,
      updatedAt: createdAt,
    });
  }
}

export async function syncStripeOperations(force = false) {
  if (!process.env.STRIPE_SECRET_KEY) return null;

  const current = await readOperationsState();
  const lastSync = current.lastStripeSyncAt
    ? new Date(current.lastStripeSyncAt).getTime()
    : 0;
  if (!force && Date.now() - lastSync < stripeSyncInterval) return current;

  const cutoff = Math.floor(
    new Date(
      process.env.PRODUCTION_DATA_START_AT || "2026-06-09T00:00:00.000Z",
    ).getTime() / 1000,
  );
  const stripe = getStripe();
  const sessions = await stripe.checkout.sessions.list({
    limit: 100,
    created: { gte: cutoff },
  });

  return updateOperationsState((state) => {
    for (const session of sessions.data) {
      syncCheckoutSession(state, session);
    }
    state.lastStripeSyncAt = new Date().toISOString();
    return state;
  });
}

export async function syncStripeEvent(event: Stripe.Event) {
  if (event.type !== "checkout.session.completed") return null;

  const session = event.data.object as Stripe.Checkout.Session;
  return updateOperationsState((state) => {
    syncCheckoutSession(state, session);
    return state;
  });
}

export async function syncStripeCheckoutSession(
  session: Stripe.Checkout.Session,
) {
  return updateOperationsState((state) => {
    syncCheckoutSession(state, session);
    return state;
  });
}
