import { NextRequest } from "next/server";
import { provisionOnboarding } from "@/lib/bland-provisioning";
import { readOperationsState } from "@/lib/operations-store";
import { syncStripeOperations } from "@/lib/stripe-operations";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

function isAuthorized(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  return Boolean(
    secret &&
      secret !== "replace_me" &&
      request.headers.get("authorization") === `Bearer ${secret}`,
  );
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  const synced = await syncStripeOperations(true);
  const state = synced ?? (await readOperationsState());
  const stripeMode = process.env.STRIPE_SECRET_KEY?.includes("_test_")
    ? "test"
    : process.env.STRIPE_SECRET_KEY
      ? "live"
      : "not-configured";

  const eligible = state.onboarding
    .filter(
      (record) =>
        record.status === "Submitted" &&
        Boolean(record.checkoutSessionId) &&
        Boolean(record.payload) &&
        record.promptCompilationStatus !== "Needs review" &&
        ["Ready", "Failed"].includes(record.provisioningStatus || "Ready"),
    )
    .slice(0, 10);

  if (stripeMode !== "live") {
    return Response.json({
      success: true,
      stripeMode,
      syncedPaidClients: state.clients.length,
      eligibleForProvisioning: eligible.length,
      provisioned: [],
      message:
        "Paid clients were synchronized. Number provisioning remains disabled until Stripe uses a live key.",
    });
  }

  const provisioned: string[] = [];
  const failed: Array<{ onboardingId: string; error: string }> = [];

  for (const record of eligible) {
    try {
      await provisionOnboarding(record.id);
      provisioned.push(record.id);
    } catch (error) {
      failed.push({
        onboardingId: record.id,
        error:
          error instanceof Error ? error.message : "Provisioning failed.",
      });
    }
  }

  return Response.json({
    success: failed.length === 0,
    stripeMode,
    syncedPaidClients: state.clients.length,
    eligibleForProvisioning: eligible.length,
    provisioned,
    failed,
  });
}
