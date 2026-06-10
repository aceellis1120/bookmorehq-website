import { NextRequest } from "next/server";
import { getStripe } from "@/lib/stripe";
import { syncStripeEvent } from "@/lib/stripe-operations";

export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return Response.json(
      { error: "Stripe webhook is not configured." },
      { status: 503 },
    );
  }

  try {
    const stripe = getStripe();
    const payload = await request.text();
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret,
    );

    await syncStripeEvent(event);

    return Response.json({ received: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Invalid Stripe webhook.";
    return Response.json({ error: message }, { status: 400 });
  }
}
