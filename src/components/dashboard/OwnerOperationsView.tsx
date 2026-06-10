"use client";

import {
  Banknote,
  BriefcaseBusiness,
  CircleDollarSign,
  CreditCard,
  Loader2,
  Package,
  Plus,
  Search,
  Sparkles,
  Trash2,
  Users,
} from "lucide-react";
import { useState } from "react";
import { formatCurrency } from "@/lib/format";
import {
  OPPORTUNITY_STAGES,
  type ClientStatus,
  type CommissionStatus,
  type OwnerSection,
  type OpportunityStage,
} from "@/lib/operations-types";
import { PACKAGE_RECORDS } from "@/lib/package-catalog";
import { SERVICE_LINES } from "@/lib/services";
import {
  AI_RECEPTIONIST_PACKAGES,
} from "@/lib/pricing";
import {
  MetricCard,
  SectionHeading,
  StatusBadge,
} from "@/components/dashboard/DashboardUi";
import OpportunityModal from "@/components/dashboard/OpportunityModal";
import { useOperations } from "@/components/dashboard/useOperations";

const inputClass =
  "h-10 rounded-md border border-[#cfd5dc] bg-white px-3 text-sm text-[#344054] outline-none focus:border-[#155eef]";

function Header({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
      <div>
        <p className="mb-1 text-sm font-medium text-[#155eef]">{eyebrow}</p>
        <h1 className="text-2xl font-semibold text-[#17202a] sm:text-3xl">
          {title}
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-[#667085]">{description}</p>
      </div>
      {action}
    </div>
  );
}

function Empty({
  title,
  detail,
  icon: Icon,
}: {
  title: string;
  detail: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}) {
  return (
    <div className="grid min-h-48 place-items-center p-6 text-center">
      <div>
        <Icon size={28} className="mx-auto text-[#98a2b3]" />
        <p className="mt-3 font-semibold text-[#17202a]">{title}</p>
        <p className="mt-1 text-sm text-[#667085]">{detail}</p>
      </div>
    </div>
  );
}

export default function OwnerOperationsView({
  section,
}: {
  section: OwnerSection;
}) {
  const { data, loading, saving, error, runOperation } = useOperations();
  const [modalOpen, setModalOpen] = useState(false);
  const [query, setQuery] = useState("");

  if (loading && !data) {
    return (
      <div className="grid min-h-[55vh] place-items-center">
        <Loader2 size={24} className="animate-spin text-[#667085]" />
      </div>
    );
  }

  const content =
    section === "pipeline" ? (
      <PipelineView
        data={data}
        query={query}
        setQuery={setQuery}
        saving={saving}
        setModalOpen={setModalOpen}
        runOperation={runOperation}
      />
    ) : section === "clients" ? (
      <ClientsView
        data={data}
        query={query}
        setQuery={setQuery}
        saving={saving}
        runOperation={runOperation}
      />
    ) : section === "closers" ? (
      <ClosersView data={data} />
    ) : section === "commissions" ? (
      <CommissionsView
        data={data}
        saving={saving}
        runOperation={runOperation}
      />
    ) : section === "payments" ? (
      <PaymentsView data={data} />
    ) : (
      <PackagesView />
    );

  return (
    <div className="mx-auto max-w-[1500px]">
      {error && (
        <div className="mb-5 rounded-md border border-[#f3b7b9] bg-[#fff0f0] p-3 text-sm text-[#c53035]">
          {error}
        </div>
      )}
      {content}
      <OpportunityModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={async (record) => {
          await runOperation(record);
        }}
        team={data?.team ?? []}
        saving={saving}
      />
    </div>
  );
}

type Data = ReturnType<typeof useOperations>["data"];
type RunOperation = ReturnType<typeof useOperations>["runOperation"];

function SearchBox({
  query,
  setQuery,
}: {
  query: string;
  setQuery: (value: string) => void;
}) {
  return (
    <label className="relative block min-w-64">
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#98a2b3]"
      />
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search"
        className={`${inputClass} w-full pl-9`}
      />
    </label>
  );
}

function PipelineView({
  data,
  query,
  setQuery,
  saving,
  setModalOpen,
  runOperation,
}: {
  data: Data;
  query: string;
  setQuery: (value: string) => void;
  saving: boolean;
  setModalOpen: (open: boolean) => void;
  runOperation: RunOperation;
}) {
  const [stage, setStage] = useState<"All" | OpportunityStage>("All");
  const visible = (data?.opportunities ?? []).filter((record) => {
    const search = query.toLowerCase();
    return (
      (record.company.toLowerCase().includes(search) ||
        record.closer.toLowerCase().includes(search)) &&
      (stage === "All" || record.stage === stage)
    );
  });
  const open = visible.filter(
    (record) => !["Won", "Lost"].includes(record.stage),
  );

  return (
    <>
      <Header
        eyebrow="Sales operations"
        title="Pipeline"
        description="Every saved opportunity, assigned closer, next action, package, and stage."
        action={
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex h-10 items-center gap-2 rounded-md bg-[#155eef] px-4 text-sm font-semibold text-white"
          >
            <Plus size={16} />
            Add opportunity
          </button>
        }
      />
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Open opportunities"
          value={open.length.toString()}
          detail="Excludes won and lost"
          icon={BriefcaseBusiness}
        />
        <MetricCard
          label="Initial pipeline"
          value={formatCurrency(
            open.reduce(
              (total, record) =>
                total + record.setupValue + record.monthlyValue,
              0,
            ),
          )}
          detail="Setup plus first monthly charge"
          icon={CircleDollarSign}
          tone="green"
        />
        <MetricCard
          label="Payment stage"
          value={open
            .filter((record) => record.stage === "Payment")
            .length.toString()}
          detail="Waiting for checkout"
          icon={CreditCard}
          tone="amber"
        />
        <MetricCard
          label="Won"
          value={visible
            .filter((record) => record.stage === "Won")
            .length.toString()}
          detail="Converted opportunities"
          icon={Banknote}
          tone="slate"
        />
      </section>
      <section className="mt-8">
        <SectionHeading
          eyebrow="Opportunities"
          title="Deal board"
          action={
            <div className="flex flex-wrap gap-2">
              <SearchBox query={query} setQuery={setQuery} />
              <select
                value={stage}
                onChange={(event) =>
                  setStage(event.target.value as "All" | OpportunityStage)
                }
                className={inputClass}
              >
                <option>All</option>
                {OPPORTUNITY_STAGES.map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            </div>
          }
        />
        <div className="overflow-hidden rounded-md border border-[#dfe3e8] bg-white">
          {visible.length === 0 ? (
            <Empty
              title="No matching opportunities"
              detail="Add a real prospect or change the current filters."
              icon={BriefcaseBusiness}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] text-left">
                <thead className="border-b border-[#e8ebee] bg-[#f8f9fa]">
                  <tr className="text-[11px] font-semibold uppercase text-[#667085]">
                    <th className="px-4 py-3">Company</th>
                    <th className="px-4 py-3">Package</th>
                    <th className="px-4 py-3">Stage</th>
                    <th className="px-4 py-3">Closer</th>
                    <th className="px-4 py-3">Next action</th>
                    <th className="px-4 py-3 text-right">Initial payment</th>
                    <th className="w-12 px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#edf0f2]">
                  {visible.map((record) => {
                    const plan = AI_RECEPTIONIST_PACKAGES[record.packageId];
                    return (
                      <tr key={record.id} className="text-sm">
                        <td className="px-4 py-4">
                          <p className="font-semibold text-[#17202a]">
                            {record.company}
                          </p>
                          <p className="mt-0.5 text-xs text-[#667085]">
                            {record.contactName || "Contact pending"}
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
                              void runOperation({
                                action: "updateOpportunity",
                                id: record.id,
                                stage: event.target.value,
                              })
                            }
                            className="h-8 rounded-md border border-[#dfe3e8] bg-white px-2 text-xs font-medium"
                          >
                            {OPPORTUNITY_STAGES.map((value) => (
                              <option key={value}>{value}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-4 text-[#475467]">
                          {record.closer}
                        </td>
                        <td className="px-4 py-4">
                          <p>{record.nextAction}</p>
                          <p className="mt-0.5 text-xs text-[#667085]">
                            {record.nextActionAt || "No due date"}
                          </p>
                        </td>
                        <td className="px-4 py-4 text-right font-semibold">
                          {formatCurrency(plan.setupFee + plan.monthlyPrice)}
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
    </>
  );
}

function ClientsView({
  data,
  query,
  setQuery,
  saving,
  runOperation,
}: {
  data: Data;
  query: string;
  setQuery: (value: string) => void;
  saving: boolean;
  runOperation: RunOperation;
}) {
  const visible = (data?.clients ?? []).filter((client) =>
    client.company.toLowerCase().includes(query.toLowerCase()),
  );
  const mrr = visible
    .filter((client) => client.status !== "Paused")
    .reduce((total, client) => total + client.mrr, 0);
  const onboarding = data?.onboarding ?? [];

  return (
    <>
      <Header
        eyebrow="Client operations"
        title="Clients"
        description="Accounts appear automatically after a completed Stripe checkout."
      />
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Client accounts"
          value={visible.length.toString()}
          detail="Real saved accounts"
          icon={Users}
        />
        <MetricCard
          label="Active MRR"
          value={formatCurrency(mrr)}
          detail="Excludes paused accounts"
          icon={CircleDollarSign}
          tone="green"
        />
        <MetricCard
          label="Onboarding"
          value={visible
            .filter((client) => client.status === "Onboarding")
            .length.toString()}
          detail="Waiting for build completion"
          icon={Package}
          tone="amber"
        />
        <MetricCard
          label="Live"
          value={visible
            .filter((client) => client.status === "Live")
            .length.toString()}
          detail="Launched client systems"
          icon={BriefcaseBusiness}
          tone="slate"
        />
      </section>
      <section className="mt-8">
        <SectionHeading
          eyebrow="Automation"
          title="Receptionist provisioning"
        />
        <div className="rounded-md border border-[#dfe3e8] bg-white">
          {onboarding.length === 0 ? (
            <Empty
              title="No onboarding forms submitted"
              detail="Paid clients appear here after completing their receptionist form."
              icon={Package}
            />
          ) : (
            <div className="divide-y divide-[#edf0f2]">
              {onboarding.map((record) => (
                <div
                  key={record.id}
                  className="grid gap-4 p-4 md:grid-cols-[1.1fr_0.9fr_1fr_auto] md:items-start"
                >
                  <div>
                    <p className="font-semibold text-[#17202a]">
                      {record.company}
                    </p>
                    <p className="mt-1 text-xs text-[#667085]">
                      {AI_RECEPTIONIST_PACKAGES[record.packageId].name} · Form{" "}
                      {record.status.toLowerCase()}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <Sparkles size={15} className="text-[#7f56d9]" />
                      <StatusBadge
                        tone={
                          record.promptCompilationStatus === "Compiled"
                            ? "green"
                            : record.promptCompilationStatus === "Failed" ||
                                record.promptCompilationStatus === "Needs review"
                              ? "red"
                              : record.promptCompilationStatus === "Compiling"
                                ? "blue"
                                : "amber"
                        }
                      >
                        AI {record.promptCompilationStatus || "Pending"}
                      </StatusBadge>
                    </div>
                    {record.compiledReceptionist && (
                      <>
                        <p className="mt-2 text-xs text-[#475467]">
                          {record.compiledReceptionist.toneSummary}
                        </p>
                        {record.compiledReceptionist.warnings.length > 0 && (
                          <p className="mt-1 text-xs text-[#b54708]">
                            {record.compiledReceptionist.warnings.join(" ")}
                          </p>
                        )}
                        {record.promptCompilationStatus === "Needs review" && (
                          <p className="mt-1 text-xs text-[#c53035]">
                            {record.compiledReceptionist.reviewReason}
                          </p>
                        )}
                      </>
                    )}
                    {record.compilationError && (
                      <p className="mt-1 text-xs text-[#c53035]">
                        {record.compilationError}
                      </p>
                    )}
                  </div>
                  <div>
                    <StatusBadge
                      tone={
                        record.provisioningStatus === "Provisioned"
                          ? "green"
                          : record.provisioningStatus === "Failed"
                            ? "red"
                            : record.provisioningStatus === "Provisioning"
                              ? "blue"
                              : "amber"
                      }
                    >
                      Phone {record.provisioningStatus || "Ready"}
                    </StatusBadge>
                    <p className="text-sm font-medium text-[#344054]">
                      {record.blandPhoneNumber || "Number not assigned"}
                    </p>
                    {record.provisioningError && (
                      <p className="mt-1 max-w-sm text-xs text-[#c53035]">
                        {record.provisioningError}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    {(record.promptCompilationStatus === "Pending" ||
                      record.promptCompilationStatus === "Failed") && (
                      <button
                        type="button"
                        disabled={saving}
                        onClick={() =>
                          void runOperation({
                            action: "compileOnboardingPrompt",
                            onboardingId: record.id,
                          })
                        }
                        className="h-9 rounded-md border border-[#7f56d9] px-3 text-sm font-semibold text-[#6941c6] disabled:opacity-60"
                      >
                        Build with AI
                      </button>
                    )}
                    {record.promptCompilationStatus === "Needs review" && (
                      <button
                        type="button"
                        disabled={saving}
                        onClick={() =>
                          void runOperation({
                            action: "approveCompiledPrompt",
                            onboardingId: record.id,
                          })
                        }
                        className="h-9 rounded-md border border-[#b54708] px-3 text-sm font-semibold text-[#b54708] disabled:opacity-60"
                      >
                        Approve AI setup
                      </button>
                    )}
                    {record.promptCompilationStatus === "Compiled" &&
                      (record.provisioningStatus === "Ready" ||
                        record.provisioningStatus === "Failed") && (
                        <button
                          type="button"
                          disabled={saving}
                          onClick={() => {
                            if (
                              window.confirm(
                                `Provision ${record.company}? Bland will purchase a $15/month phone number and configure the receptionist.`,
                              )
                            ) {
                              void runOperation({
                                action: "provisionOnboarding",
                                onboardingId: record.id,
                              });
                            }
                          }}
                          className="h-9 rounded-md bg-[#155eef] px-3 text-sm font-semibold text-white disabled:opacity-60"
                        >
                          Provision number
                        </button>
                      )}
                  </div>
                  {record.compiledReceptionist && (
                    <details className="rounded-md border border-[#e4e7ec] bg-[#f8fafc] p-3 md:col-span-4">
                      <summary className="cursor-pointer text-sm font-semibold text-[#344054]">
                        Review generated receptionist configuration
                      </summary>
                      <div className="mt-4 grid gap-5 lg:grid-cols-2">
                        <div>
                          <p className="text-xs font-semibold uppercase text-[#667085]">
                            Enabled capabilities
                          </p>
                          <p className="mt-2 text-sm leading-6 text-[#475467]">
                            {record.compiledReceptionist.enabledCapabilities.join(
                              ", ",
                            )}
                          </p>
                          <p className="mt-4 text-xs font-semibold uppercase text-[#667085]">
                            Blocked capabilities
                          </p>
                          <p className="mt-2 text-sm leading-6 text-[#475467]">
                            {record.compiledReceptionist.blockedCapabilities.join(
                              ", ",
                            )}
                          </p>
                          <p className="mt-4 text-xs font-semibold uppercase text-[#667085]">
                            Acceptance tests
                          </p>
                          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[#475467]">
                            {record.compiledReceptionist.testScenarios.map(
                              (scenario) => (
                                <li key={scenario}>{scenario}</li>
                              ),
                            )}
                          </ul>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase text-[#667085]">
                            Generated system prompt
                          </p>
                          <pre className="mt-2 max-h-80 overflow-auto whitespace-pre-wrap rounded-md border border-[#dfe3e8] bg-white p-3 font-sans text-xs leading-5 text-[#344054]">
                            {record.compiledReceptionist.systemPrompt}
                          </pre>
                        </div>
                      </div>
                    </details>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <section className="mt-8">
        <SectionHeading
          eyebrow="Accounts"
          title="Client portfolio"
          action={<SearchBox query={query} setQuery={setQuery} />}
        />
        <div className="rounded-md border border-[#dfe3e8] bg-white">
          {visible.length === 0 ? (
            <Empty
              title="No clients yet"
              detail="The first paid Stripe checkout will create the first client account."
              icon={Users}
            />
          ) : (
            <div className="divide-y divide-[#edf0f2]">
              {visible.map((client) => (
                <div
                  key={client.id}
                  className="grid gap-4 p-4 md:grid-cols-[1.3fr_0.8fr_0.8fr_0.8fr] md:items-center"
                >
                  <div>
                    <p className="font-semibold text-[#17202a]">
                      {client.company}
                    </p>
                    <p className="mt-1 text-xs text-[#667085]">
                      {client.email || "Email pending"} · {client.closer}
                    </p>
                  </div>
                  <p className="text-sm text-[#475467]">
                    {AI_RECEPTIONIST_PACKAGES[client.packageId].name}
                  </p>
                  <p className="text-sm font-semibold text-[#17202a]">
                    {formatCurrency(client.mrr)}/mo
                  </p>
                  <select
                    value={client.status}
                    disabled={saving}
                    onChange={(event) =>
                      void runOperation({
                        action: "updateClientStatus",
                        id: client.id,
                        status: event.target.value,
                      })
                    }
                    className={inputClass}
                  >
                    {(["Onboarding", "Testing", "Live", "Paused"] as ClientStatus[]).map(
                      (status) => (
                        <option key={status}>{status}</option>
                      ),
                    )}
                  </select>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function ClosersView({ data }: { data: Data }) {
  return (
    <>
      <Header
        eyebrow="Sales team"
        title="Closers"
        description="Performance is calculated from each closer's actual opportunities and commission records."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        {(data?.team ?? []).map((member) => {
          const opportunities = (data?.opportunities ?? []).filter(
            (record) => record.closer === member.name,
          );
          const commissions = (data?.commissions ?? []).filter(
            (record) => record.closer === member.name,
          );
          const paid = commissions
            .filter((record) => record.status === "Paid")
            .reduce((total, record) => total + record.closerPayout, 0);
          const pending = commissions
            .filter((record) => record.status !== "Paid")
            .reduce((total, record) => total + record.closerPayout, 0);
          return (
            <article
              key={member.id}
              className="rounded-md border border-[#dfe3e8] bg-white p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-semibold text-[#17202a]">
                    {member.name}
                  </h2>
                  <p className="mt-1 text-xs text-[#667085]">{member.email}</p>
                </div>
                <StatusBadge tone="green">Active</StatusBadge>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-4 border-t border-[#edf0f2] pt-4">
                <Value label="Open deals" value={opportunities.filter((record) => !["Won", "Lost"].includes(record.stage)).length.toString()} />
                <Value label="Paid" value={formatCurrency(paid)} />
                <Value label="Pending" value={formatCurrency(pending)} />
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}

function CommissionsView({
  data,
  saving,
  runOperation,
}: {
  data: Data;
  saving: boolean;
  runOperation: RunOperation;
}) {
  const commissions = data?.commissions ?? [];
  return (
    <>
      <Header
        eyebrow="Compensation"
        title="Commissions"
        description="Commissions are created from paid checkouts and remain pending until you approve and mark them paid."
      />
      <section className="grid gap-4 sm:grid-cols-3">
        {(["Pending", "Approved", "Paid"] as CommissionStatus[]).map(
          (status) => (
            <MetricCard
              key={status}
              label={status}
              value={formatCurrency(
                commissions
                  .filter((record) => record.status === status)
                  .reduce(
                    (total, record) => total + record.closerPayout,
                    0,
                  ),
              )}
              detail={`${commissions.filter((record) => record.status === status).length} records`}
              icon={Banknote}
              tone={
                status === "Paid"
                  ? "green"
                  : status === "Approved"
                    ? "slate"
                    : "amber"
              }
            />
          ),
        )}
      </section>
      <section className="mt-8">
        <SectionHeading eyebrow="Payout ledger" title="Commission records" />
        <div className="overflow-hidden rounded-md border border-[#dfe3e8] bg-white">
          {commissions.length === 0 ? (
            <Empty
              title="No commissions yet"
              detail="Paid checkouts credited to a closer will appear here."
              icon={Banknote}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left">
                <thead className="border-b border-[#e8ebee] bg-[#f8f9fa]">
                  <tr className="text-[11px] font-semibold uppercase text-[#667085]">
                    <th className="px-4 py-3">Closer</th>
                    <th className="px-4 py-3">Company</th>
                    <th className="px-4 py-3">Package</th>
                    <th className="px-4 py-3 text-right">Collected</th>
                    <th className="px-4 py-3 text-right">Payout</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#edf0f2]">
                  {commissions.map((record) => (
                    <tr key={record.id} className="text-sm">
                      <td className="px-4 py-4 font-semibold">{record.closer}</td>
                      <td className="px-4 py-4">{record.company}</td>
                      <td className="px-4 py-4">
                        {AI_RECEPTIONIST_PACKAGES[record.packageId].name}
                      </td>
                      <td className="px-4 py-4 text-right">
                        {formatCurrency(record.collected)}
                      </td>
                      <td className="px-4 py-4 text-right font-semibold text-[#18794e]">
                        {formatCurrency(record.closerPayout)}
                      </td>
                      <td className="px-4 py-4">
                        <select
                          value={record.status}
                          disabled={saving}
                          onChange={(event) =>
                            void runOperation({
                              action: "updateCommissionStatus",
                              id: record.id,
                              status: event.target.value,
                            })
                          }
                          className="h-8 rounded-md border border-[#dfe3e8] bg-white px-2 text-xs font-medium"
                        >
                          {(["Pending", "Approved", "Paid"] as CommissionStatus[]).map(
                            (status) => (
                              <option key={status}>{status}</option>
                            ),
                          )}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function PaymentsView({ data }: { data: Data }) {
  const payments = data?.payments ?? [];
  const paid = payments.filter((record) => record.status === "Paid");
  return (
    <>
      <Header
        eyebrow="Collections"
        title="Payments"
        description="Completed BookMoreHQ Stripe checkouts are synchronized into this ledger."
      />
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Collected" value={formatCurrency(paid.reduce((total, record) => total + record.gross, 0))} detail={`${paid.length} paid transactions`} icon={CircleDollarSign} tone="green" />
        <MetricCard label="Processing reserve" value={formatCurrency(paid.reduce((total, record) => total + record.processing, 0))} detail="Estimated card fees" icon={CreditCard} />
        <MetricCard label="Closer payouts" value={formatCurrency(paid.reduce((total, record) => total + record.closerPayout, 0))} detail="Commission obligation" icon={Users} tone="amber" />
        <MetricCard label="BookMoreHQ retained" value={formatCurrency(paid.reduce((total, record) => total + record.bookmoreTake, 0))} detail="Before fulfillment costs" icon={Banknote} tone="slate" />
      </section>
      <section className="mt-8">
        <SectionHeading eyebrow="Stripe ledger" title="Payment history" />
        <div className="overflow-hidden rounded-md border border-[#dfe3e8] bg-white">
          {payments.length === 0 ? (
            <Empty title="No production payments yet" detail="Completed checkouts after the production reset will appear here." icon={CreditCard} />
          ) : (
            <div className="divide-y divide-[#edf0f2]">
              {payments.map((record) => (
                <div key={record.id} className="grid gap-3 p-4 md:grid-cols-[1.2fr_0.8fr_0.7fr_0.7fr_0.7fr] md:items-center">
                  <div>
                    <p className="font-semibold text-[#17202a]">{record.company}</p>
                    <p className="mt-1 text-xs text-[#667085]">{new Date(record.createdAt).toLocaleString()}</p>
                  </div>
                  <p className="text-sm text-[#475467]">{record.type}</p>
                  <p className="text-sm font-semibold">{formatCurrency(record.gross)}</p>
                  <p className="text-sm text-[#475467]">{record.closer}</p>
                  <StatusBadge tone={record.status === "Paid" ? "green" : record.status === "Failed" ? "red" : "amber"}>{record.status}</StatusBadge>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function PackagesView() {
  return (
    <>
      <Header
        eyebrow="Offer catalog"
        title="Packages"
        description="Current BookMoreHQ pricing and closer compensation. AI Receptionist is the active launch offer."
      />
      <div className="space-y-8">
        {SERVICE_LINES.map((service) => {
          const records = PACKAGE_RECORDS.filter(
            (record) => record.serviceId === service.id,
          );
          if (records.length === 0) return null;
          return (
            <section key={service.id}>
              <SectionHeading eyebrow={service.name} title="Package pricing" />
              <div className="grid gap-4 lg:grid-cols-3">
                {records.map((record) => (
                  <article key={`${record.serviceId}-${record.packageName}`} className="rounded-md border border-[#dfe3e8] bg-white p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="font-semibold text-[#17202a]">{record.packageName}</h2>
                      <StatusBadge tone={record.serviceId === "ai-receptionist" ? "green" : "slate"}>
                        {record.serviceId === "ai-receptionist" ? "Selling" : "Planned"}
                      </StatusBadge>
                    </div>
                    <p className="mt-4 text-xl font-semibold text-[#17202a]">
                      {record.setup !== null ? formatCurrency(record.setup) : "No setup"}
                    </p>
                    <p className="mt-1 text-xs text-[#667085]">
                      {record.monthly ? `${formatCurrency(record.monthly)}/month` : "One-time project"}
                    </p>
                    <p className="mt-4 text-sm leading-6 text-[#475467]">{record.included}</p>
                    <div className="mt-5 border-t border-[#edf0f2] pt-4 text-sm">
                      Closer commission:{" "}
                      <strong className="text-[#18794e]">
                        {record.closerCommission === null
                          ? "Not locked"
                          : formatCurrency(record.closerCommission)}
                      </strong>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}

function Value({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] uppercase text-[#667085]">{label}</p>
      <p className="mt-1 text-sm font-semibold text-[#17202a]">{value}</p>
    </div>
  );
}
