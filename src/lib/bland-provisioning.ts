import { blandRequest } from "@/lib/bland";
import { updateOperationsState } from "@/lib/operations-store";
import {
  compileReceptionistConfiguration,
  type ReceptionistOnboardingPayload,
} from "@/lib/receptionist-compiler";
import type { CompiledReceptionistConfig } from "@/lib/operations-types";

type PurchaseNumberResponse = {
  phone_number?: string;
  number?: string;
  data?: {
    phone_number?: string;
    number?: string;
  };
};

function cleanPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return value.trim();
}

function areaCode(value: string) {
  const digits = value.replace(/\D/g, "");
  const local =
    digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
  return local.length >= 3 ? local.slice(0, 3) : "615";
}

export function buildReceptionistPrompt(
  payload: ReceptionistOnboardingPayload,
  compiled?: CompiledReceptionistConfig,
) {
  const calendarBehavior = payload.calendarSystem?.trim()
    ? `The business uses ${payload.calendarSystem}. Treat appointments as requests unless a connected scheduling tool confirms availability.`
    : "Collect the preferred date and time as an appointment request. Never claim the appointment is confirmed.";

  return [
    compiled?.systemPrompt ||
      `You are the receptionist for ${payload.companyName}, a ${payload.industry} business serving ${payload.serviceAreas}.`,
    "Never claim to send SMS, take payments, provide binding quotes, diagnose a problem, or confirm an appointment unless a connected tool completes that action during this call.",
    !compiled ? `Services: ${payload.services}. Hours: ${payload.businessHours}.` : "",
    "Ask one question at a time. Collect the caller's full name, callback number, service address, requested service, problem summary, urgency, and preferred date and time. Confirm critical details before ending.",
    `Emergency rules: ${payload.emergencyRules}. For immediate danger, direct the caller to emergency services before continuing.`,
    `Transfer when the caller requests a person or meets the urgent rules. If transfer fails, confirm the callback number and mark the lead urgent.`,
    calendarBehavior,
    payload.bookingRules ? `Booking rules: ${payload.bookingRules}.` : "",
    payload.commonQuestions
      ? `Approved answers: ${payload.commonQuestions}.`
      : "Do not invent prices, warranties, availability, diagnoses, or policies. Offer a team follow-up when unsure.",
    `After hours: ${payload.afterHours}.`,
    "End by summarizing the request and explaining that the team will follow up.",
  ]
    .filter(Boolean)
    .join("\n")
    .slice(0, 4000);
}

export function buildInboundConfiguration(
  onboardingId: string,
  payload: ReceptionistOnboardingPayload,
  compiled?: CompiledReceptionistConfig,
) {
  const appUrl = (
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://bookmorehq-website.vercel.app"
  ).replace(/\/$/, "");
  const secret = process.env.BLAND_WEBHOOK_SECRET;
  const webhook = `${appUrl}/api/bland/webhook?secret=${encodeURIComponent(secret || "")}&onboarding=${encodeURIComponent(onboardingId)}`;

  return {
    prompt: buildReceptionistPrompt(payload, compiled),
    first_sentence:
      compiled?.firstSentence ||
      payload.greeting ||
      `Thank you for calling ${payload.companyName}. How can I help you today?`,
    voice: process.env.BLAND_DEFAULT_VOICE || "maya",
    model: "base",
    language: "en-US",
    timezone: "America/Chicago",
    transfer_phone_number: cleanPhone(payload.transferPhone),
    fallback_number: cleanPhone(payload.mainPhone),
    interruption_threshold: 120,
    noise_cancellation: true,
    max_duration: 20,
    webhook,
    analysis_schema: {
      caller_name: "string",
      callback_number: "string",
      service_address: "string",
      requested_service: "string",
      problem_summary: "string",
      urgency: "string",
      preferred_appointment_time: "string",
      transfer_attempted: "boolean",
      appointment_status: "string",
    },
    analysis_prompt:
      compiled?.analysisPrompt ||
      "Extract only details stated or clearly confirmed during the call. Use routine, priority, or emergency for urgency.",
    summary_prompt:
      compiled?.summaryPrompt ||
      "Summarize the caller's request, urgency, contact details, appointment request, transfer result, and required next action.",
    metadata: {
      bookmorehq_onboarding_id: onboardingId,
      company: payload.companyName,
      alert_email: payload.alertEmail,
      alert_phone: payload.alertPhone,
    },
    record: true,
  };
}

export async function compileOnboardingPrompt(onboardingId: string) {
  const attemptId = crypto.randomUUID();
  const claimed = await updateOperationsState((current) => {
    const record = current.onboarding.find((item) => item.id === onboardingId);
    if (!record) throw new Error("Onboarding record not found.");
    if (!record.payload) throw new Error("Onboarding form is incomplete.");
    if (
      record.promptCompilationStatus === "Compiled" &&
      record.compiledReceptionist
    ) {
      return current;
    }
    const compilingIsRecent =
      record.promptCompilationStatus === "Compiling" &&
      Date.now() - new Date(record.updatedAt).getTime() < 10 * 60 * 1000;
    if (compilingIsRecent && record.promptCompilationAttemptId) return current;

    record.promptCompilationStatus = "Compiling";
    record.promptCompilationAttemptId = attemptId;
    record.compilationError = undefined;
    record.updatedAt = new Date().toISOString();
    return current;
  });
  const onboarding = claimed.onboarding.find(
    (record) => record.id === onboardingId,
  );
  if (!onboarding) throw new Error("Onboarding record not found.");
  if (
    onboarding.promptCompilationStatus === "Compiled" &&
    onboarding.compiledReceptionist
  ) {
    return onboarding;
  }
  if (onboarding.promptCompilationAttemptId !== attemptId) return onboarding;

  try {
    const payload =
      onboarding.payload as unknown as ReceptionistOnboardingPayload;
    const { compiled, model } =
      await compileReceptionistConfiguration(payload);
    const updated = await updateOperationsState((current) => {
      const record = current.onboarding.find(
        (item) => item.id === onboardingId,
      );
      if (record?.promptCompilationAttemptId === attemptId) {
        record.compiledReceptionist = compiled;
        record.compilerModel = model;
        record.compiledAt = new Date().toISOString();
        record.promptCompilationStatus = compiled.requiresReview
          ? "Needs review"
          : "Compiled";
        record.promptCompilationAttemptId = undefined;
        record.updatedAt = new Date().toISOString();
      }
      return current;
    });
    return updated.onboarding.find((record) => record.id === onboardingId);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Prompt compilation failed.";
    await updateOperationsState((current) => {
      const record = current.onboarding.find(
        (item) => item.id === onboardingId,
      );
      if (record?.promptCompilationAttemptId === attemptId) {
        record.promptCompilationStatus = "Failed";
        record.promptCompilationAttemptId = undefined;
        record.compilationError = message;
        record.updatedAt = new Date().toISOString();
      }
      return current;
    });
    throw error;
  }
}

export async function provisionOnboarding(onboardingId: string) {
  const webhookSecret = process.env.BLAND_WEBHOOK_SECRET;
  if (!webhookSecret || webhookSecret === "replace_me") {
    throw new Error("The Bland webhook secret is not configured.");
  }

  const compiledOnboarding = await compileOnboardingPrompt(onboardingId);
  if (!compiledOnboarding?.compiledReceptionist) {
    throw new Error("The AI receptionist configuration is still compiling.");
  }
  if (compiledOnboarding.promptCompilationStatus === "Needs review") {
    throw new Error(
      compiledOnboarding.compiledReceptionist.reviewReason ||
        "The AI receptionist configuration requires owner review.",
    );
  }
  if (compiledOnboarding.promptCompilationStatus !== "Compiled") {
    throw new Error("The AI receptionist configuration is not ready.");
  }

  const attemptId = crypto.randomUUID();
  const claimed = await updateOperationsState((current) => {
    const record = current.onboarding.find(
      (item) => item.id === onboardingId,
    );
    if (!record) throw new Error("Onboarding record not found.");
    if (!record.payload) throw new Error("Onboarding form is incomplete.");
    if (record.provisioningStatus === "Provisioned") return current;
    const provisioningIsRecent =
      record.provisioningStatus === "Provisioning" &&
      Date.now() - new Date(record.updatedAt).getTime() < 10 * 60 * 1000;
    if (
      provisioningIsRecent &&
      record.provisioningAttemptId
    ) {
      return current;
    }
    record.provisioningStatus = "Provisioning";
    record.provisioningAttemptId = attemptId;
    record.provisioningError = undefined;
    record.updatedAt = new Date().toISOString();
    return current;
  });
  const onboarding = claimed.onboarding.find(
    (record) => record.id === onboardingId,
  );
  if (!onboarding) throw new Error("Onboarding record not found.");
  if (onboarding.provisioningStatus === "Provisioned") return onboarding;
  if (onboarding.provisioningAttemptId !== attemptId) return onboarding;

  const payload =
    onboarding.payload as unknown as ReceptionistOnboardingPayload;
  const compiled = onboarding.compiledReceptionist;
  let phoneNumber = onboarding.blandPhoneNumber;

  try {
    if (!phoneNumber) {
      const purchased = await blandRequest<PurchaseNumberResponse>(
        "/numbers/purchase",
        {
          method: "POST",
          body: JSON.stringify({
            area_code: areaCode(payload.mainPhone),
            country_code: "US",
          }),
        },
      );
      phoneNumber =
        purchased.phone_number ||
        purchased.number ||
        purchased.data?.phone_number ||
        purchased.data?.number;
      if (!phoneNumber) {
        throw new Error("Bland purchased a number but did not return it.");
      }

      await updateOperationsState((current) => {
        const record = current.onboarding.find(
          (item) => item.id === onboardingId,
        );
        if (record?.provisioningAttemptId === attemptId) {
          record.blandPhoneNumber = phoneNumber;
          record.updatedAt = new Date().toISOString();
        }
        return current;
      });
    }

    await blandRequest(`/v1/inbound/${encodeURIComponent(phoneNumber)}`, {
      method: "POST",
      body: JSON.stringify(
        buildInboundConfiguration(onboardingId, payload, compiled),
      ),
    });

    const updated = await updateOperationsState((current) => {
      const record = current.onboarding.find(
        (item) => item.id === onboardingId,
      );
      if (record) {
        record.provisioningStatus = "Provisioned";
        record.provisioningAttemptId = undefined;
        record.blandPhoneNumber = phoneNumber;
        record.provisionedAt = new Date().toISOString();
        record.status = "Testing";
        record.updatedAt = new Date().toISOString();
      }
      const client = current.clients.find(
        (item) =>
          item.id === record?.clientId ||
          item.company.toLowerCase() === payload.companyName.toLowerCase(),
      );
      if (client) {
        client.blandPhoneNumber = phoneNumber;
        client.status = "Testing";
        client.updatedAt = new Date().toISOString();
      }
      return current;
    });
    return updated.onboarding.find((record) => record.id === onboardingId);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Bland provisioning failed.";
    await updateOperationsState((current) => {
      const record = current.onboarding.find(
        (item) => item.id === onboardingId,
      );
      if (record) {
        record.provisioningStatus = "Failed";
        record.provisioningAttemptId = undefined;
        record.provisioningError = message;
        record.updatedAt = new Date().toISOString();
      }
      return current;
    });
    throw error;
  }
}
