import { NextRequest } from "next/server";
import {
  filterStateForSession,
  getRequestSession,
} from "@/lib/operations-auth";
import {
  OPPORTUNITY_STAGES,
  type ClientStatus,
  type CommissionStatus,
  type Opportunity,
  type OpportunityStage,
} from "@/lib/operations-types";
import {
  AI_RECEPTIONIST_PACKAGES,
  isPackageId,
  type PackageId,
} from "@/lib/pricing";
import { readOperationsState, updateOperationsState } from "@/lib/operations-store";
import { syncStripeOperations } from "@/lib/stripe-operations";
import { getDashboardUsers } from "@/lib/dashboard-users";
import {
  compileOnboardingPrompt,
  provisionOnboarding,
} from "@/lib/bland-provisioning";
import { leadAlertsConfigured } from "@/lib/lead-alerts";

type OperationBody = {
  action?: string;
  id?: string;
  company?: string;
  contactName?: string;
  email?: string;
  phone?: string;
  city?: string;
  niche?: string;
  packageId?: PackageId;
  stage?: OpportunityStage;
  closer?: string;
  nextAction?: string;
  nextActionAt?: string;
  status?: ClientStatus | CommissionStatus;
  onboardingId?: string;
};

const ownerActions = new Set([
  "approveCompiledPrompt",
  "compileOnboardingPrompt",
  "provisionOnboarding",
  "updateClientStatus",
  "updateCommissionStatus",
]);

function safeText(value: string | undefined, maxLength = 160) {
  return value?.trim().slice(0, maxLength) ?? "";
}

function responseForSession(
  state: Awaited<ReturnType<typeof readOperationsState>>,
  session: Awaited<ReturnType<typeof getRequestSession>> & {},
) {
  const filtered = filterStateForSession(state, session);
  const team =
    session.role === "owner"
      ? getDashboardUsers()
          .filter((user) => user.role === "closer")
          .map(({ id, name, email, username }) => ({
            id,
            name,
            email,
            username,
          }))
      : [
          {
            id: session.id,
            name: session.name,
            email: session.email,
            username: "",
          },
        ];

  return {
    ...filtered,
    team,
    system: {
      stripeMode: process.env.STRIPE_SECRET_KEY
        ? process.env.STRIPE_SECRET_KEY.includes("_test_")
          ? "test"
          : "live"
        : "not configured",
      storageConnected: Boolean(
        process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID,
      ),
      stripeWebhookConfigured: Boolean(process.env.STRIPE_WEBHOOK_SECRET),
      blandConfigured: Boolean(
        process.env.BLAND_API_KEY &&
          process.env.BLAND_WEBHOOK_SECRET &&
          process.env.BLAND_WEBHOOK_SECRET !== "replace_me",
      ),
      openAiConfigured: Boolean(
        process.env.OPENAI_API_KEY &&
          process.env.OPENAI_API_KEY !== "replace_me",
      ),
      leadAlertsConfigured: leadAlertsConfigured(),
      autoProvisionEnabled: process.env.BLAND_AUTO_PROVISION === "true",
    },
  };
}

export async function GET(request: NextRequest) {
  const session = await getRequestSession(request);
  if (!session) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const synced = await syncStripeOperations();
    const state = synced ?? (await readOperationsState());
    return Response.json(responseForSession(state, session));
  } catch {
    const state = await readOperationsState();
    return Response.json(responseForSession(state, session));
  }
}

export async function POST(request: NextRequest) {
  const session = await getRequestSession(request);
  if (!session) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const body = (await request.json()) as OperationBody;
    const now = new Date().toISOString();

    if (body.action && ownerActions.has(body.action) && session.role !== "owner") {
      return Response.json(
        { error: "Owner access required." },
        { status: 403 },
      );
    }

    if (
      body.action === "provisionOnboarding" ||
      body.action === "compileOnboardingPrompt"
    ) {
      if (!body.onboardingId) {
        return Response.json(
          { error: "Onboarding record is required." },
          { status: 400 },
        );
      }
      await (body.action === "provisionOnboarding"
        ? provisionOnboarding(body.onboardingId)
        : compileOnboardingPrompt(body.onboardingId));
      return Response.json(
        responseForSession(await readOperationsState(), session),
      );
    }

    const state = await updateOperationsState((current) => {
      if (body.action === "createOpportunity") {
        if (!safeText(body.company) || !isPackageId(body.packageId)) {
          throw new Error("Company and package are required.");
        }

        const plan = AI_RECEPTIONIST_PACKAGES[body.packageId];
        const closer =
          session.role === "closer"
            ? session.closerName || session.name
            : safeText(body.closer) || "Unassigned";
        const opportunity: Opportunity = {
          id: crypto.randomUUID(),
          company: safeText(body.company),
          contactName: safeText(body.contactName),
          email: safeText(body.email),
          phone: safeText(body.phone, 40),
          city: safeText(body.city, 80),
          niche: safeText(body.niche, 80),
          serviceId: "ai-receptionist",
          packageId: body.packageId,
          stage: body.stage || "Lead",
          closer,
          nextAction: safeText(body.nextAction) || "Initial outreach",
          nextActionAt: safeText(body.nextActionAt, 80),
          setupValue: plan.setupFee,
          monthlyValue: plan.monthlyPrice,
          createdAt: now,
          updatedAt: now,
        };
        current.opportunities.unshift(opportunity);
        return current;
      }

      if (body.action === "updateOpportunity") {
        const record = current.opportunities.find(
          (opportunity) => opportunity.id === body.id,
        );
        if (!record) throw new Error("Opportunity not found.");
        if (
          session.role === "closer" &&
          record.closer !== (session.closerName || session.name)
        ) {
          throw new Error("You cannot change another closer's opportunity.");
        }
        if (body.stage && OPPORTUNITY_STAGES.includes(body.stage)) {
          record.stage = body.stage;
        }
        if (body.nextAction !== undefined) {
          record.nextAction = safeText(body.nextAction);
        }
        if (body.nextActionAt !== undefined) {
          record.nextActionAt = safeText(body.nextActionAt, 80);
        }
        if (session.role === "owner" && body.closer !== undefined) {
          record.closer = safeText(body.closer) || "Unassigned";
        }
        record.updatedAt = now;
        return current;
      }

      if (body.action === "deleteOpportunity") {
        const record = current.opportunities.find(
          (opportunity) => opportunity.id === body.id,
        );
        if (!record) throw new Error("Opportunity not found.");
        if (
          session.role === "closer" &&
          record.closer !== (session.closerName || session.name)
        ) {
          throw new Error("You cannot delete another closer's opportunity.");
        }
        current.opportunities = current.opportunities.filter(
          (opportunity) => opportunity.id !== body.id,
        );
        return current;
      }

      if (body.action === "updateClientStatus") {
        const client = current.clients.find((record) => record.id === body.id);
        if (!client) throw new Error("Client not found.");
        if (
          body.status &&
          ["Onboarding", "Testing", "Live", "Paused"].includes(body.status)
        ) {
          client.status = body.status as ClientStatus;
        }
        client.updatedAt = now;
        return current;
      }

      if (body.action === "updateCommissionStatus") {
        const commission = current.commissions.find(
          (record) => record.id === body.id,
        );
        if (!commission) throw new Error("Commission not found.");
        if (
          body.status &&
          ["Pending", "Approved", "Paid"].includes(body.status)
        ) {
          commission.status = body.status as CommissionStatus;
          commission.paidAt =
            body.status === "Paid" ? now : commission.paidAt;
        }
        return current;
      }

      if (body.action === "approveCompiledPrompt") {
        const record = current.onboarding.find(
          (item) => item.id === body.onboardingId,
        );
        if (!record?.compiledReceptionist) {
          throw new Error("Compiled receptionist configuration not found.");
        }
        record.compiledReceptionist.requiresReview = false;
        record.compiledReceptionist.reviewReason =
          "Approved by the BookMoreHQ owner.";
        record.promptCompilationStatus = "Compiled";
        record.updatedAt = now;
        return current;
      }

      throw new Error("Unsupported operation.");
    });

    return Response.json(responseForSession(state, session));
  } catch (error) {
    const message =
      error instanceof SyntaxError
        ? "Invalid request body."
        : error instanceof Error
          ? error.message
          : "Unable to save the record.";
    return Response.json(
      { error: message },
      { status: 400 },
    );
  }
}
