"use client";

import {
  CalendarClock,
  CalendarDays,
  Check,
  CircleDollarSign,
  Clock3,
  Copy,
  ExternalLink,
  Loader2,
  PhoneCall,
  PlayCircle,
  Plus,
  Target,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
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
import {
  MetricCard,
  SectionHeading,
  StatusBadge,
} from "@/components/dashboard/DashboardUi";
import OpportunityModal from "@/components/dashboard/OpportunityModal";
import { useOperations } from "@/components/dashboard/useOperations";

export default function CloserDashboard({
  closerName,
  demoNumber,
  bookingSlug,
}: {
  closerName: string;
  demoNumber: string;
  bookingSlug: string;
}) {
  const { data, loading, saving, error, runOperation } = useOperations();
  const [modalOpen, setModalOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const opportunities = (data?.opportunities ?? []).filter(
    (record) => record.closer === closerName,
  );
  const commissions = (data?.commissions ?? []).filter(
    (record) => record.closer === closerName,
  );

  const earned = commissions
    .filter((record) => record.status === "Paid")
    .reduce((total, record) => total + record.closerPayout, 0);
  const pending = commissions
    .filter((record) => record.status !== "Paid")
    .reduce((total, record) => total + record.closerPayout, 0);
  const openPipeline = opportunities
    .filter((record) => !["Won", "Lost"].includes(record.stage))
    .reduce(
      (total, record) =>
        total + record.setupValue + record.monthlyValue,
      0,
    );
  const demos = opportunities.filter(
    (record) =>
      record.stage === "Demo" ||
      record.stage === "Proposal" ||
      record.stage === "Payment" ||
      record.stage === "Won",
  ).length;
  const nextActions = opportunities
    .filter((record) => !["Won", "Lost"].includes(record.stage))
    .slice()
    .sort((a, b) =>
      (a.nextActionAt || "9999").localeCompare(b.nextActionAt || "9999"),
    )
    .slice(0, 3);

  async function updateStage(id: string, stage: OpportunityStage) {
    await runOperation({ action: "updateOpportunity", id, stage });
  }

  async function copyCheckout(planId: string) {
    const path = `/checkout/ai-receptionist?package=${planId}&closer=${encodeURIComponent(closerName)}`;
    await navigator.clipboard.writeText(`${window.location.origin}${path}`);
    setCopied(planId);
    window.setTimeout(() => setCopied(null), 1600);
  }

  async function copyDemoScenario() {
    await navigator.clipboard.writeText(
      "My air conditioner is blowing warm air. I am in Nashville and would like someone tomorrow morning.",
    );
    setCopied("demo-scenario");
    window.setTimeout(() => setCopied(null), 1600);
  }

  async function copyBookingLink() {
    await navigator.clipboard.writeText(
      `${window.location.origin}/book/${bookingSlug}`,
    );
    setCopied("booking-link");
    window.setTimeout(() => setCopied(null), 1600);
  }

  const demoPhoneHref = `tel:${demoNumber.replace(/[^\d+]/g, "")}`;
  const demoPhoneDisplay = demoNumber.replace(
    /^\+1(\d{3})(\d{3})(\d{4})$/,
    "($1) $2-$3",
  );

  return (
    <div className="mx-auto max-w-[1450px]">
      <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="mb-1 text-sm font-medium text-[#155eef]">
            Closer workspace
          </p>
          <h1 className="text-2xl font-semibold text-[#17202a] sm:text-3xl">
            Your live pipeline
          </h1>
          <p className="mt-2 text-sm text-[#667085]">
            Add prospects, advance deals, send checkout links, and track
            cleared commissions.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex h-10 items-center gap-2 rounded-md bg-[#155eef] px-4 text-sm font-semibold text-white hover:bg-[#004eeb]"
        >
          <Plus size={17} />
          Add prospect
        </button>
      </div>

      {error && (
        <div className="mb-5 rounded-md border border-[#f3b7b9] bg-[#fff0f0] p-3 text-sm text-[#c53035]">
          {error}
        </div>
      )}

      {data?.system.stripeMode !== "live" && (
        <div className="mb-5 rounded-md border border-[#f2d3a2] bg-[#fff8eb] p-3 text-sm text-[#8a4b08]">
          Checkout is in {data?.system.stripeMode || "unknown"} mode. Do not
          send payment links to customers until the owner activates live
          Stripe payments.
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Commission paid"
          value={formatCurrency(earned)}
          detail="Cleared and marked paid"
          icon={CircleDollarSign}
          tone="green"
        />
        <MetricCard
          label="Commission pending"
          value={formatCurrency(pending)}
          detail="Pending or approved payouts"
          icon={Clock3}
          tone="amber"
        />
        <MetricCard
          label="Open pipeline"
          value={formatCurrency(openPipeline)}
          detail={`${opportunities.filter((record) => !["Won", "Lost"].includes(record.stage)).length} active deals`}
          icon={Target}
        />
        <MetricCard
          label="Demos reached"
          value={demos.toString()}
          detail={`${opportunities.filter((record) => record.stage === "Won").length} deals won`}
          icon={CalendarClock}
          tone="slate"
        />
      </section>

      <section className="mt-8 rounded-md border border-[#b9d1ff] bg-[#eef4ff] p-5">
        <p className="text-xs font-semibold uppercase text-[#155eef]">
          Next actions
        </p>
        {nextActions.length === 0 ? (
          <div className="py-5 text-sm text-[#475467]">
            Add your first prospect to create today&apos;s follow-up list.
          </div>
        ) : (
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {nextActions.map((record) => (
              <div key={record.id} className="border-l-2 border-[#155eef] pl-3">
                <p className="text-sm font-semibold text-[#17202a]">
                  {record.company}
                </p>
                <p className="mt-1 text-xs text-[#475467]">
                  {record.nextAction}
                </p>
                <p className="mt-1 text-xs font-medium text-[#155eef]">
                  {record.nextActionAt || "No due date"}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-8 border-y border-[#dfe3e8] bg-white py-6">
        <div className="grid gap-6 px-1 lg:grid-cols-[0.72fr_1fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase text-[#155eef]">
              Live sales demo
            </p>
            <h2 className="mt-1 text-xl font-semibold text-[#17202a]">
              {demoPhoneDisplay}
            </h2>
            <p className="mt-2 text-sm text-[#667085]">
              Let the prospect experience the receptionist before presenting
              the recommended package.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href={demoPhoneHref}
                className="inline-flex h-10 items-center gap-2 rounded-md bg-[#155eef] px-4 text-sm font-semibold text-white hover:bg-[#004eeb]"
              >
                <PhoneCall size={16} />
                Call demo
              </a>
              <button
                type="button"
                onClick={() => void copyDemoScenario()}
                className="inline-flex h-10 items-center gap-2 rounded-md border border-[#cfd5dc] bg-white px-4 text-sm font-semibold text-[#344054] hover:border-[#98a2b3]"
              >
                {copied === "demo-scenario" ? (
                  <Check size={16} />
                ) : (
                  <Copy size={16} />
                )}
                {copied === "demo-scenario" ? "Copied" : "Copy call scenario"}
              </button>
            </div>
          </div>
          <div className="border-l-2 border-[#155eef] pl-4">
            <p className="text-xs font-semibold uppercase text-[#667085]">
              Prospect scenario
            </p>
            <p className="mt-2 text-sm leading-6 text-[#344054]">
              “My air conditioner is blowing warm air. I’m in Nashville and
              would like someone tomorrow morning.”
            </p>
            <p className="mt-3 text-xs text-[#667085]">
              Use the prospect’s real name and callback number. The demo will
              capture the service address, urgency, and preferred time.
            </p>
          </div>
        </div>
      </section>

      <section
        id="calendar"
        className="mt-8 grid gap-5 lg:grid-cols-[0.72fr_1fr]"
      >
        <div className="rounded-md border border-[#dfe3e8] bg-white p-5">
          <div className="flex items-center gap-2">
            <CalendarDays size={19} className="text-[#155eef]" />
            <h2 className="font-semibold text-[#17202a]">
              My demo calendar
            </h2>
          </div>
          <p className="mt-2 text-sm leading-6 text-[#667085]">
            Send your personal booking page to qualified owners. New meetings
            appear automatically in your pipeline and next-action list.
          </p>
          <div className="mt-4 grid grid-cols-[1fr_40px] gap-2">
            <button
              type="button"
              onClick={() => void copyBookingLink()}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#155eef] px-4 text-sm font-semibold text-white"
            >
              {copied === "booking-link" ? (
                <Check size={16} />
              ) : (
                <Copy size={16} />
              )}
              {copied === "booking-link" ? "Copied" : "Copy booking link"}
            </button>
            <Link
              href={`/book/${bookingSlug}`}
              target="_blank"
              className="grid h-10 w-10 place-items-center rounded-md border border-[#cfd5dc] text-[#344054]"
              aria-label="Open booking page"
            >
              <ExternalLink size={16} />
            </Link>
          </div>
        </div>

        <div className="rounded-md border border-[#dfe3e8] bg-white p-5">
          <p className="text-xs font-semibold uppercase text-[#155eef]">
            Cold-call opener
          </p>
          <p className="mt-3 text-sm leading-6 text-[#344054]">
            “Hey, is this the owner? My name is {closerName} with BookMoreHQ.
            Quick reason for the call: we install a 24/7 AI receptionist for
            service businesses so missed and after-hours calls turn into
            qualified leads instead of voicemail. Are you the person who
            handles incoming calls?”
          </p>
          <div className="mt-4 grid gap-3 border-t border-[#edf0f2] pt-4 text-sm text-[#475467] sm:grid-cols-3">
            <p>
              <strong className="block text-[#17202a]">Discover</strong>
              Ask how missed calls are handled today.
            </p>
            <p>
              <strong className="block text-[#17202a]">Demonstrate</strong>
              Have them call the live number.
            </p>
            <p>
              <strong className="block text-[#17202a]">Close</strong>
              Recommend one package and send checkout.
            </p>
          </div>
        </div>
      </section>

      <section id="training" className="mt-8">
        <SectionHeading
          eyebrow="Training"
          title="What you are selling"
          action={
            <span className="inline-flex items-center gap-1.5 text-xs text-[#667085]">
              <PlayCircle size={15} />
              2-minute overview
            </span>
          }
        />
        <div className="overflow-hidden rounded-md border border-[#dfe3e8] bg-[#101923]">
          <video
            controls
            preload="metadata"
            poster="/closer-training-poster.jpg"
            className="aspect-video w-full"
          >
            <source src="/closer-training.mp4" type="video/mp4" />
            <track
              default
              kind="captions"
              src="/closer-training.vtt"
              srcLang="en"
              label="English"
            />
          </video>
        </div>
      </section>

      <section id="pipeline" className="mt-8">
        <SectionHeading eyebrow="Sales" title="My pipeline" />
        <div className="overflow-hidden rounded-md border border-[#dfe3e8] bg-white">
          {loading ? (
            <div className="grid min-h-48 place-items-center">
              <Loader2 size={22} className="animate-spin text-[#667085]" />
            </div>
          ) : opportunities.length === 0 ? (
            <div className="grid min-h-48 place-items-center p-6 text-center">
              <div>
                <Target size={28} className="mx-auto text-[#98a2b3]" />
                <p className="mt-3 font-semibold text-[#17202a]">
                  Your pipeline is empty
                </p>
                <p className="mt-1 text-sm text-[#667085]">
                  Add the first business you are actively working.
                </p>
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="mt-4 inline-flex h-9 items-center gap-2 rounded-md bg-[#155eef] px-3 text-sm font-semibold text-white"
                >
                  <Plus size={15} />
                  Add prospect
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[940px] text-left">
                <thead className="border-b border-[#e8ebee] bg-[#f8f9fa]">
                  <tr className="text-[11px] font-semibold uppercase text-[#667085]">
                    <th className="px-4 py-3">Account</th>
                    <th className="px-4 py-3">Stage</th>
                    <th className="px-4 py-3">Next action</th>
                    <th className="px-4 py-3">Package</th>
                    <th className="px-4 py-3 text-right">Commission</th>
                    <th className="w-12 px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#edf0f2]">
                  {opportunities.map((record) => {
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
                        <td className="px-4 py-4">
                          <p className="text-[#344054]">{record.nextAction}</p>
                          <p className="mt-0.5 text-xs text-[#667085]">
                            {record.nextActionAt || "No due date"}
                          </p>
                        </td>
                        <td className="px-4 py-4">
                          <StatusBadge tone={OPPORTUNITY_STAGE_TONES[record.stage]}>
                            {plan.name}
                          </StatusBadge>
                        </td>
                        <td className="px-4 py-4 text-right font-semibold text-[#18794e]">
                          {formatCurrency(plan.closerCommission)}
                        </td>
                        <td className="px-4 py-4">
                          <button
                            type="button"
                            onClick={() => {
                              if (
                                window.confirm(
                                  `Delete ${record.company} from your pipeline?`,
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

      <section id="packages" className="mt-8">
        <SectionHeading
          eyebrow="Checkout"
          title="AI Receptionist payment links"
          action={
            <span className="text-xs text-[#667085]">
              Credited to {closerName}
            </span>
          }
        />
        <div className="grid gap-4 lg:grid-cols-3">
          {Object.values(AI_RECEPTIONIST_PACKAGES).map((plan) => {
            const initial = calculateInitialPaymentEconomics(plan);
            return (
              <article
                key={plan.id}
                className="rounded-md border border-[#dfe3e8] bg-white p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-[#17202a]">{plan.name}</p>
                    <p className="mt-1 text-xs text-[#667085]">
                      {plan.includedMinutes.toLocaleString()} included minutes
                    </p>
                  </div>
                  <StatusBadge tone="green">
                    Earn {formatCurrency(plan.closerCommission)}
                  </StatusBadge>
                </div>
                <p className="mt-5 text-2xl font-semibold text-[#17202a]">
                  {formatCurrency(initial.initialPayment)}
                </p>
                <p className="mt-1 text-xs text-[#667085]">
                  Then {formatCurrency(plan.monthlyPrice)}/month
                </p>
                <div className="mt-5 grid grid-cols-[1fr_40px] gap-2">
                  <button
                    type="button"
                    onClick={() => void copyCheckout(plan.id)}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#155eef] px-4 text-sm font-semibold text-white"
                  >
                    {copied === plan.id ? (
                      <Check size={16} />
                    ) : (
                      <Copy size={16} />
                    )}
                    {copied === plan.id ? "Copied" : "Copy payment link"}
                  </button>
                  <Link
                    href={`/checkout/ai-receptionist?package=${plan.id}&closer=${encodeURIComponent(closerName)}`}
                    className="grid h-10 w-10 place-items-center rounded-md border border-[#cfd5dc] text-[#344054]"
                    aria-label={`Open ${plan.name} checkout`}
                  >
                    <ExternalLink size={16} />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <OpportunityModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={async (record) => {
          await runOperation(record);
        }}
        team={data?.team ?? []}
        closerName={closerName}
        saving={saving}
      />
    </div>
  );
}
