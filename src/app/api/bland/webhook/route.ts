import { NextRequest } from "next/server";
import { sendLeadAlert } from "@/lib/lead-alerts";
import { updateOperationsState } from "@/lib/operations-store";

export async function POST(request: NextRequest) {
  const expectedSecret = process.env.BLAND_WEBHOOK_SECRET;
  const suppliedSecret = request.nextUrl.searchParams.get("secret");

  if (
    !expectedSecret ||
    expectedSecret === "replace_me" ||
    suppliedSecret !== expectedSecret
  ) {
    return Response.json({ error: "Unauthorized webhook." }, { status: 401 });
  }

  try {
    const payload = (await request.json()) as Record<string, unknown>;
    const onboardingId = request.nextUrl.searchParams.get("onboarding");
    const callId = String(payload.call_id ?? payload.c_id ?? "");

    if (onboardingId && callId) {
      const updated = await updateOperationsState((state) => {
        state.processedBlandCallIds ??= [];
        const onboarding = state.onboarding.find(
          (record) => record.id === onboardingId,
        );
        if (!state.processedBlandCallIds.includes(callId)) {
          state.processedBlandCallIds.push(callId);
          state.processedBlandCallIds =
            state.processedBlandCallIds.slice(-5000);

          const client = state.clients.find(
            (record) =>
              record.id === onboarding?.clientId ||
              record.company.toLowerCase() ===
                onboarding?.company.toLowerCase(),
          );
          if (client) {
            const callLength = Number(payload.call_length);
            if (Number.isFinite(callLength) && callLength > 0) {
              client.usageMinutes += callLength;
            }
            client.updatedAt = new Date().toISOString();
          }
        }
        return state;
      });

      updated.alertedBlandCallIds ??= [];
      const onboarding = updated.onboarding.find(
        (record) => record.id === onboardingId,
      );
      const alertEmail =
        typeof onboarding?.payload?.alertEmail === "string"
          ? onboarding.payload.alertEmail
          : "";

      if (alertEmail && !updated.alertedBlandCallIds.includes(callId)) {
        const alert = await sendLeadAlert({
          callId,
          company: onboarding?.company || "BookMoreHQ client",
          recipient: alertEmail,
          payload,
        });
        if (alert.status === "sent") {
          await updateOperationsState((state) => {
            state.alertedBlandCallIds ??= [];
            if (!state.alertedBlandCallIds.includes(callId)) {
              state.alertedBlandCallIds.push(callId);
              state.alertedBlandCallIds =
                state.alertedBlandCallIds.slice(-5000);
            }
            return state;
          });
        }
      }
    }

    return Response.json({ received: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Invalid Bland webhook payload.";
    return Response.json({ error: message }, { status: 400 });
  }
}
