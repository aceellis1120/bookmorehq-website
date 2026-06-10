import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  PhoneCall,
  Settings2,
  Timer,
} from "lucide-react";
import { MetricCard, SectionHeading, StatusBadge } from "./DashboardUi";
import type { BlandCall } from "@/lib/bland";
import {
  formatCentralDate,
  formatDuration,
  formatPhone,
} from "@/lib/format";

function stringVariable(
  variables: Record<string, unknown> | undefined,
  keys: string[],
) {
  for (const key of keys) {
    const value = variables?.[key];
    if (typeof value === "string" && value.trim()) return value;
  }
  return "";
}

export default function CallsDashboard({
  calls,
  configurationError,
  error,
  phoneNumber,
}: {
  calls: BlandCall[];
  configurationError: boolean;
  error: string;
  phoneNumber?: string;
}) {
  const completedCalls = calls.filter((call) => call.completed).length;
  const totalMinutes = calls.reduce(
    (total, call) => total + (call.call_length ?? 0),
    0,
  );
  const callsWithErrors = calls.filter((call) => call.error_message).length;

  return (
    <div className="mx-auto max-w-[1450px]">
      <div className="mb-7">
        <p className="mb-1 text-sm font-medium text-[#155eef]">
          AI Receptionist
        </p>
        <h1 className="text-2xl font-semibold text-[#17202a] sm:text-3xl">
          Receptionist call activity
        </h1>
        <p className="mt-2 text-sm text-[#667085]">
          Calls, captured lead details, and outcomes from the BookMoreHQ
          receptionist line.
        </p>
      </div>

      {configurationError ? (
        <section className="rounded-md border border-[#f2d3a2] bg-white p-6">
          <div className="flex gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-[#fff4e5] text-[#b25e09]">
              <Settings2 size={20} />
            </span>
            <div>
              <h2 className="font-semibold text-[#17202a]">
                Connect the Bland API
              </h2>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-[#667085]">
                Add <code>BLAND_API_KEY</code> to the deployment environment,
                then redeploy. The dashboard will automatically load calls from
                the demo number.
              </p>
            </div>
          </div>
        </section>
      ) : error ? (
        <section className="rounded-md border border-[#f3b7b9] bg-white p-6">
          <div className="flex gap-3">
            <AlertTriangle className="text-[#c53035]" size={20} />
            <div>
              <h2 className="font-semibold text-[#17202a]">
                Bland calls could not be loaded
              </h2>
              <p className="mt-1 text-sm text-[#667085]">{error}</p>
            </div>
          </div>
        </section>
      ) : (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="Recent calls"
              value={calls.length.toLocaleString()}
              detail="Since the production reset"
              icon={PhoneCall}
            />
            <MetricCard
              label="Completed"
              value={completedCalls.toLocaleString()}
              detail="Calls completed successfully"
              icon={CheckCircle2}
              tone="green"
            />
            <MetricCard
              label="Conversation time"
              value={`${Math.round(totalMinutes)} min`}
              detail="Across the calls shown below"
              icon={Timer}
              tone="slate"
            />
            <MetricCard
              label="Needs review"
              value={callsWithErrors.toLocaleString()}
              detail="Calls reporting an error"
              icon={AlertTriangle}
              tone={callsWithErrors ? "amber" : "green"}
            />
          </section>

          <section className="mt-8">
            <SectionHeading
              eyebrow="Live Bland data"
              title="Recent conversations"
              action={
                <span className="text-xs text-[#667085]">
                  {phoneNumber?.startsWith("All ")
                    ? phoneNumber
                    : `BookMoreHQ number ${formatPhone(phoneNumber)}`}
                </span>
              }
            />

            <div className="overflow-hidden rounded-md border border-[#dfe3e8] bg-white">
              <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead className="border-b border-[#e8ebee] bg-[#f8f9fa]">
                    <tr className="text-[11px] font-semibold uppercase text-[#667085]">
                      <th className="px-4 py-3">Caller</th>
                      <th className="px-4 py-3">Niche / request</th>
                      <th className="px-4 py-3">Outcome</th>
                      <th className="px-4 py-3">Duration</th>
                      <th className="px-4 py-3">Received</th>
                      <th className="px-4 py-3">Summary</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#edf0f2]">
                    {calls.map((call) => {
                      const variables = call.variables;
                      const niche = stringVariable(variables, [
                        "niche",
                        "business_type",
                        "selected_niche",
                      ]);
                      const request = stringVariable(variables, [
                        "service_requested",
                        "appointment_type",
                        "reason_for_calling",
                      ]);
                      const summary =
                        call.summary ||
                        stringVariable(call.analysis, ["summary"]) ||
                        "Open the call in Bland for the full transcript.";

                      return (
                        <tr key={call.call_id} className="align-top text-sm">
                          <td className="px-4 py-4">
                            <p className="font-semibold text-[#17202a]">
                              {stringVariable(variables, [
                                "full_name",
                                "name",
                              ]) || "Caller"}
                            </p>
                            <p className="mt-1 text-xs text-[#667085]">
                              {formatPhone(call.from)}
                            </p>
                          </td>
                          <td className="px-4 py-4">
                            <p className="font-medium text-[#344054]">
                              {niche || "Business type not captured"}
                            </p>
                            <p className="mt-1 max-w-52 text-xs text-[#667085]">
                              {request || "Request not extracted"}
                            </p>
                          </td>
                          <td className="px-4 py-4">
                            <StatusBadge
                              tone={
                                call.error_message
                                  ? "red"
                                  : call.completed
                                    ? "green"
                                    : "amber"
                              }
                            >
                              {call.error_message
                                ? "Review"
                                : call.completed
                                  ? "Completed"
                                  : call.queue_status || "Processing"}
                            </StatusBadge>
                          </td>
                          <td className="px-4 py-4">
                            <span className="inline-flex items-center gap-1.5 text-[#475467]">
                              <Clock3 size={14} />
                              {formatDuration(call.call_length)}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-4 py-4 text-[#475467]">
                            {formatCentralDate(call.created_at)}
                          </td>
                          <td className="px-4 py-4">
                            <p className="max-w-md text-xs leading-5 text-[#667085]">
                              {summary}
                            </p>
                          </td>
                        </tr>
                      );
                    })}
                    {calls.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-4 py-12 text-center text-sm text-[#667085]"
                        >
                          No calls received since the production reset.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
