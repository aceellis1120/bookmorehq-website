import { NextRequest } from "next/server";
import {
  isPackageId,
  type PackageId,
} from "@/lib/pricing";
import { updateOperationsState } from "@/lib/operations-store";
import { getStripe } from "@/lib/stripe";
import {
  compileOnboardingPrompt,
  provisionOnboarding,
} from "@/lib/bland-provisioning";
import type { ReceptionistOnboardingPayload } from "@/lib/receptionist-compiler";
import { syncStripeCheckoutSession } from "@/lib/stripe-operations";

const onboardingFields = [
  "companyName",
  "website",
  "industry",
  "services",
  "serviceAreas",
  "businessHours",
  "mainPhone",
  "transferPhone",
  "alertEmail",
  "alertPhone",
  "calendarSystem",
  "bookingRules",
  "emergencyRules",
  "greeting",
  "commonQuestions",
  "afterHours",
  "voiceTone",
  "primaryCallGoals",
  "specialInstructions",
] as const satisfies readonly (keyof ReceptionistOnboardingPayload)[];

const requiredFields: readonly (keyof ReceptionistOnboardingPayload)[] = [
  "companyName",
  "industry",
  "services",
  "serviceAreas",
  "businessHours",
  "mainPhone",
  "transferPhone",
  "alertEmail",
  "alertPhone",
  "emergencyRules",
  "greeting",
  "afterHours",
  "voiceTone",
  "primaryCallGoals",
];

function normalizeOnboardingPayload(data: Record<string, unknown>) {
  return Object.fromEntries(
    onboardingFields.map((field) => [
      field,
      typeof data[field] === "string"
        ? data[field].trim().slice(0, 5000)
        : "",
    ]),
  ) as ReceptionistOnboardingPayload;
}

export async function POST(request: NextRequest) {
  try {
    const data = (await request.json()) as Record<string, unknown> & {
      companyName?: string;
      packageId?: PackageId;
      checkoutSessionId?: string;
    };
    const payload = normalizeOnboardingPayload(data);
    const company = payload.companyName;
    const packageId = data.packageId;
    const checkoutSessionId = data.checkoutSessionId?.trim();

    if (
      !company ||
      !checkoutSessionId ||
      !isPackageId(packageId)
    ) {
      return Response.json(
        {
          success: false,
          error: "A verified payment session, company, and package are required.",
        },
        { status: 400 },
      );
    }

    const checkout = await getStripe().checkout.sessions.retrieve(
      checkoutSessionId,
    );
    const paidCompany = checkout.metadata?.companyName?.trim();
    if (
      checkout.status !== "complete" ||
      checkout.payment_status !== "paid" ||
      checkout.metadata?.serviceId !== "ai-receptionist" ||
      checkout.metadata?.packageId !== packageId ||
      !paidCompany ||
      paidCompany.toLowerCase() !== company.toLowerCase()
    ) {
      return Response.json(
        { success: false, error: "This checkout is not eligible for onboarding." },
        { status: 403 },
      );
    }

    if (requiredFields.some((field) => !payload[field]?.trim())) {
      return Response.json(
        { success: false, error: "Complete every required onboarding field." },
        { status: 400 },
      );
    }

    await syncStripeCheckoutSession(checkout);

    const now = new Date().toISOString();
    let onboardingId = "";
    await updateOperationsState((current) => {
      const client = current.clients.find(
        (record) => record.company.toLowerCase() === company.toLowerCase(),
      );
      const existing = current.onboarding.find(
        (record) =>
          record.checkoutSessionId === checkoutSessionId ||
          record.id === `onboarding-${checkoutSessionId}`,
      );

      if (existing?.checkoutSessionId) {
        onboardingId = existing.id;
        return current;
      } else if (existing) {
        onboardingId = existing.id;
        existing.clientId = client?.id || existing.clientId;
        existing.company = company;
        existing.packageId = packageId;
        existing.checkoutSessionId = checkoutSessionId;
        existing.payload = {
          ...payload,
          packageId,
          checkoutSessionId,
          submittedAt: now,
        };
        existing.status = "Submitted";
        existing.provisioningStatus = "Ready";
        existing.promptCompilationStatus = "Pending";
        existing.updatedAt = now;
      } else {
        onboardingId = crypto.randomUUID();
        current.onboarding.unshift({
          id: onboardingId,
          clientId: client?.id,
          company,
          serviceId: "ai-receptionist",
          packageId,
          status: "Submitted",
          checkoutSessionId,
          provisioningStatus: "Ready",
          promptCompilationStatus: "Pending",
          payload: {
            ...payload,
            packageId,
            checkoutSessionId,
            submittedAt: now,
          },
          createdAt: now,
          updatedAt: now,
        });
      }
      return current;
    });

    let promptCompilation = "Pending";
    if (process.env.OPENAI_API_KEY) {
      try {
        const compiled = await compileOnboardingPrompt(onboardingId);
        promptCompilation =
          compiled?.promptCompilationStatus || "Pending";
      } catch {
        promptCompilation = "Failed";
      }
    }

    const autoProvision =
      process.env.BLAND_AUTO_PROVISION === "true" &&
      !process.env.STRIPE_SECRET_KEY?.includes("_test_") &&
      promptCompilation === "Compiled";
    if (autoProvision) {
      await provisionOnboarding(onboardingId);
    }

    return Response.json({
      success: true,
      onboardingId,
      provisioning: autoProvision ? "started" : "ready",
      promptCompilation,
    });
  } catch {
    return Response.json(
      { success: false, error: "Failed to process submission." },
      { status: 500 },
    );
  }
}
