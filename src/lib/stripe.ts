import Stripe from "stripe";

export function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error(
      "Stripe is not configured. Add STRIPE_SECRET_KEY to .env.local.",
    );
  }

  return new Stripe(secretKey);
}

