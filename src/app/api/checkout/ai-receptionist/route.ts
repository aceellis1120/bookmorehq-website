import { NextRequest } from "next/server";
import {
  AI_RECEPTIONIST_PACKAGES,
  isPackageId,
  type PackageId,
} from "@/lib/pricing";
import { findCloserName } from "@/lib/dashboard-users";
import { getStripe } from "@/lib/stripe";
import { getStripeLineItems } from "@/lib/stripe-prices";

type CheckoutBody = {
  packageId?: PackageId;
  companyName?: string;
  contactName?: string;
  email?: string;
  phone?: string;
  closer?: string;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CheckoutBody;
    const packageId = body.packageId;

    if (!isPackageId(packageId)) {
      return Response.json(
        { error: "Select a valid AI Receptionist package." },
        { status: 400 },
      );
    }

    if (!body.companyName?.trim() || !body.contactName?.trim()) {
      return Response.json(
        { error: "Company and contact name are required." },
        { status: 400 },
      );
    }

    if (!body.email?.trim()) {
      return Response.json(
        { error: "A client email is required for checkout." },
        { status: 400 },
      );
    }

    const plan = AI_RECEPTIONIST_PACKAGES[packageId];
    const closer = findCloserName(body.closer);
    const stripe = getStripe();
    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ??
      request.nextUrl.origin;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: body.email.trim(),
      allow_promotion_codes: false,
      billing_address_collection: "auto",
      phone_number_collection: { enabled: true },
      line_items: getStripeLineItems(plan),
      metadata: {
        serviceId: "ai-receptionist",
        packageId,
        companyName: body.companyName.trim(),
        contactName: body.contactName.trim(),
        contactPhone: body.phone?.trim() ?? "",
        closer,
        closerCommission: String(plan.closerCommission),
      },
      subscription_data: {
        metadata: {
          serviceId: "ai-receptionist",
          packageId,
          companyName: body.companyName.trim(),
          closer,
        },
      },
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}&package=${packageId}`,
      cancel_url: `${appUrl}/checkout/ai-receptionist?package=${packageId}&closer=${encodeURIComponent(closer === "Unassigned" ? "" : closer)}`,
    });

    return Response.json({ url: session.url });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to create checkout.";
    const notConfigured = message.includes("Stripe is not configured");

    return Response.json(
      { error: message, code: notConfigured ? "STRIPE_NOT_CONFIGURED" : "CHECKOUT_ERROR" },
      { status: notConfigured ? 503 : 500 },
    );
  }
}
