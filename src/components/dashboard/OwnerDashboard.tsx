"use client";

import {
  Banknote,
  BriefcaseBusiness,
  CheckCircle2,
  CircleDashed,
  CircleDollarSign,
  Loader2,
  Plus,
  RefreshCw,
  Settings2,
  Trash2,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  OPPORTUNITY_STAGES,
  OPPORTUNITY_STAGE_TONES,
  type OpportunityStage,
} from "@/lib/operations-types";
import { formatCurrency } from "@/lib/format";
import {
  AI_RECEPTIONIST_PACKAGES,
  calculateInitialPaymentEconomics,
} from "@/lib/pricing";
import { SERVICE_LINES } from "@/lib/services";
import {
  MetricCard,
  SectionHeading,
  StatusBadge,
} from "@/components/dashboard/DashboardUi";
import OpportunityModal from "@/components/dashboard/OpportunityModal";
import { useOperations } from "@/components/dashboard/useOperations";

export default function OwnerDashboard() {
  const { data, loading, saving, error, refresh, runOperation } =
    useOperations();
  const [modalOpen, setModalOpen] = useState(false);
  const [stageFilter, setStageFilter] = useState<"All" | OpportunityStage>(
    "All",
  );

  const opportunities = useMemo(
    () =>
      stageFilter === "All"
        ? data?.opportunities ?? []
        : (data?.opportunities ?? []).filter(
            (record) => record.stage === stageFilter,
          ),
    [data?.opportunities, stageFilter],
  );
  const openOpportunities = (data?.opportunities ?? []).filter(
    (record) => !["Won", "Lost"].includes(record.stage),
  );
  const collectedRevenue = (data?.payments ?? [])
    .filter((payment) => payment.status === "Paid")
    .reduce((total, payment) => total + payment.gross, 0);
  const activeMrr = (data?.clients ?? [])
    .filter((client) => client.status !== "Paused")
    .reduce((total, client) => total + client.mrr, 0);
  const pendingCommissions = (data?.commissions ?? [])
    .filter((commission) => commission.status !== "Paid")
    .reduce((total, commission) => total + commission.closerPayout, 0);
  const readiness = [
    {
      label: "Live payments",
      ready: data?.system.stripeMode === "live",
    },
    {
      label: "Stripe webhook",
      ready: data?.system.stripeWebhookConfigured,
    },
    {
      label: "Bland provisioning",
      ready: data?.system.blandConfigured,
    },
    {
      label: "AI configuration",
      ready: data?.system.openAiConfigured,
    },
    {
      label: "Client lead alerts",
      ready: data?.system.leadAlertsConfigured,
    },
    {
      label: "Automatic launch",
      ready: data?.system.autoProvisionEnabled,
    },
  ];
  const readySystems = readiness.filter((item) => item.ready).length;

  async function createOpportunity(record: Record<string, unknown>) {
    await runOperation(record);
  }

  async function updateStage(id: string, stage: OpportunityStage) {
    await runOperation({ action: "updateOpportunity", id, stage });
  }

  return (
    <div className="mx-auto max-w-[1500px]">
      <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="mb-1 text-sm font-medium text-[#155eef]">
            Owner overview
          </p>
          <h1 className="text-2xl font-semibold text-[#17202a] sm:text-3xl">
            BookMoreHQ operations
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-[#667085]">
            Live sales, collections, clients, and commissions. No sample data.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => void refresh()}
            disabled={loading}
            className="grid h-10 w-10 place-items-center rounded-md border border-[#cfd5dc] bg-white text-[#475467] hover:bg-[#f8f9fa] disabled:opacity-60"
            aria-label="Refresh dashboard"
            title="Refresh dashboard"
          >
            <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
          </button>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex h-10 items-center gap-2 rounded-md bg-[#155eef] px-4 text-sm font-semibold text-white hover:bg-[#004eeb]"
          >
            <Plus size={17} />
            Add opportunity
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-5 rounded-md border border-[#f3b7b9] bg-[#fff0f0] p-3 text-sm text-[#c53035]">
          {error}
        </div>
      )}

      {data?.system.stripeMode !== "live" && (
        <div className="mb-5 rounded-md border border-[#f2d3a2] bg-[#fff8eb] p-3 text-sm text-[#8a4b08]">
          Stripe is currently in {data?.system.stripeMode || "unknown"} mode.
          Payment links cannot collect live customer money until a live Stripe
          key is connected.
        </div>
      )}

      <section className="mb-5 border-y border-[#dfe3e8] bg-white px-4 py-4 sm:px-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Settings2 size={18} className="text-[#155eef]" />
            <div>
              <p className="text-sm font-semibold text-[#17202a]">
                Production readiness
              </p>
              <p className="text-xs text-[#667085]">
                {readySystems} of {readiness.length} launch systems connected
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {readiness.map((item) => (
              <span
                key={item.label}
                className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                  item.ready ? "text-[#18794e]" : "text-[#b54708]"
                }`}
              >
                {item.ready ? (
                  <CheckCircle2 size={14} />
                ) : (
                  <CircleDashed size={14} />
                )}
                {item.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Collected revenue"
          value={formatCurrency(collectedRevenue)}
          detail={`${(data?.payments ?? []).filter((payment) => payment.status === "Paid").length} cleared payments`}
          icon={CircleDollarSign}
          tone="green"
        />
        <MetricCard
          label="Active MRR"
          value={formatCurrency(activeMrr)}
          detail={`${(data?.clients ?? []).filter((client) => client.status !== "Paused").length} active client accounts`}
          icon={Banknote}
        />
        <MetricCard
          label="Open pipeline"
          value={formatCurrency(
            openOpportunities.reduce(
              (total, record) =>
                total + record.setupValue + record.monthlyValue,
              0,
            ),
          )}
          detail={`${openOpportunities.length} active opportunities`}
          icon={BriefcaseBusiness}
          tone="amber"
        />
        <MetricCard
          label="Pending commissions"
          value={formatCurrency(pendingCommissions)}
          detail="Awaiting approval or payout"
          icon={Users}
          tone="slate"
        />
      </section>

      <section className="mt-8">
        <SectionHeading eyebrow="Services" title="Production status" />
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {SERVICE_LINES.map((service) => {
            const clients = (data?.clients ?? []).filter(
              (client) => client.serviceId === service.id,
            ).length;
            const pipeline = openOpportunities.filter(
              (record) => record.serviceId === service.id,
            ).length;

            return (
              <article
                key={service.id}
                className="min-h-28 rounded-md border border-[#dfe3e8] bg-white p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold text-[#17202a]">
                    {service.name}
                  </p>
                  <StatusBadge
                    tone={service.id === "ai-receptionist" ? "green" : "slate"}
                  >
                    {service.id === "ai-receptionist"
                      ? "Selling now"
                      : "Not launched"}
                  </StatusBadge>
                </div>
                <div className="mt-5 flex gap-5 text-xs text-[#667085]">
                  <span>
                    Clients{" "}
                    <strong className="text-[#344054]">{clients}</strong>
                  </span>
                  <span>
                    Pipeline{" "}
                    <strong className="text-[#344054]">{pipeline}</strong>
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mt-8">
        <SectionHeading
          eyebrow="Sales"
          title="Pipeline"
          action={
            <select
              value={stageFilter}
              onChange={(event) =>
                setStageFilter(
                  event.target.value as "All" | OpportunityStage,
                )
              }
              className="h-9 rounded-md border border-[#cfd5dc] bg-white px-3 text-sm text-[#344054]"
            >
              <option>All</option>
              {OPPORTUNITY_STAGES.map((stage) => (
                <option key={stage}>{stage}</option>
              ))}
            </select>
          }
        />

        <div className="overflow-hidden rounded-md border border-[#dfe3e8] bg-white">
          {loading ? (
            <div className="grid min-h-52 place-items-center text-[#667085]">
              <Loader2 size={22} className="animate-spin" />
            </div>
          ) : opportunities.length === 0 ? (
            <EmptyState
              title="No opportunities yet"
              detail="Add the first real prospect to begin building the pipeline."
              action={() => setModalOpen(true)}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] text-left">
                <thead className="border-b border-[#e8ebee] bg-[#f8f9fa]">
                  <tr className="text-[11px] font-semibold uppercase text-[#667085]">
                    <th className="px-4 py-3">Company</th>
                    <th className="px-4 py-3">Package</th>
                    <th className="px-4 py-3">Stage</th>
                    <th className="px-4 py-3">Closer</th>
                    <th className="px-4 py-3">Next action</th>
                    <th className="px-4 py-3 text-right">Due today</th>
                    <th className="w-12 px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#edf0f2]">
                  {opportunities.map((record) => {
                    const plan = AI_RECEPTIONIST_PACKAGES[record.packageId];
                    const economics = calculateInitialPaymentEconomics(plan);
                    return (
                      <tr key={record.id} className="text-sm">
                        <td className="px-4 py-4">
                          <p className="font-semibold text-[#17202a]">
                            {record.company}
                          </p>
                          <p className="mt-0.5 text-xs text-[#667085]">
                            {[record.niche, record.city]
                              .filter(Boolean)
                              .join(" · ") || "Business details pending"}
                          </p>
                        </td>
                        <td className="px-4 py-4 text-[#475467]">
                          {plan.name}
                        </td>
                        <td className="px-4 py-4">
                          <select
                            value={record.stage}
                            disabled={saving}
                            onChange={(event) =>
                              void updateStage(
                                record.id,
                                event.target.value as OpportunityStage,
                              )
                            }
                            className="h-8 rounded-md border border-[#dfe3e8] bg-white px-2 text-xs font-medium"
                          >
                            {OPPORTUNITY_STAGES.map((stage) => (
                              <option key={stage}>{stage}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-4 text-[#475467]">
                          {record.closer}
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-[#344054]">{record.nextAction}</p>
                          <p className="mt-0.5 text-xs text-[#667085]">
                            {record.nextActionAt || "No due date"}
                          </p>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <p className="font-semibold text-[#17202a]">
                            {formatCurrency(economics.initialPayment)}
                          </p>
                          <StatusBadge tone={OPPORTUNITY_STAGE_TONES[record.stage]}>
                            {record.stage}
                          </StatusBadge>
                        </td>
                        <td className="px-4 py-4">
                          <button
                            type="button"
                            onClick={() => {
                              if (
                                window.confirm(
                                  `Delete ${record.company} from the pipeline?`,
                                )
                              ) {
                                void runOperation({
                                  action: "deleteOpportunity",
                                  id: record.id,
                                });
                              }
                            }}
                            className="grid h-8 w-8 place-items-center rounded-md text-[#98a2b3] hover:bg-[#fff0f0] hover:text-[#c53035]"
                            aria-label={`Delete ${record.company}`}
                            title="Delete opportunity"
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      <OpportunityModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={createOpportunity}
        team={data?.team ?? []}
        saving={saving}
      />
    </div>
  );
}

function EmptyState({
  title,
  detail,
  action,
}: {
  title: string;
  detail: string;
  action: () => void;
}) {
  return (
    <div className="grid min-h-52 place-items-center p-6 text-center">
      <div>
        <BriefcaseBusiness
          size={28}
          className="mx-auto text-[#98a2b3]"
        />
        <p className="mt-3 font-semibold text-[#17202a]">{title}</p>
        <p className="mt-1 text-sm text-[#667085]">{detail}</p>
        <button
          type="button"
          onClick={action}
          className="mt-4 inline-flex h-9 items-center gap-2 rounded-md bg-[#155eef] px-3 text-sm font-semibold text-white"
        >
          <Plus size={15} />
          Add opportunity
        </button>
      </div>
    </div>
  );
}
