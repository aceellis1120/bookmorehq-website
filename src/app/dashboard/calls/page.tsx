import DashboardShell from "@/components/dashboard/DashboardShell";
import CallsDashboard from "@/components/dashboard/CallsDashboard";
import {
  getBlandCallDetails,
  getRecentBlandCalls,
  type BlandCall,
} from "@/lib/bland";

export const dynamic = "force-dynamic";

export default async function CallsPage() {
  let calls: BlandCall[] = [];
  let configurationError = false;
  let error = "";

  try {
    const recentCalls = await getRecentBlandCalls(20);
    calls = await Promise.all(
      recentCalls.slice(0, 12).map(async (call) => {
        try {
          return await getBlandCallDetails(call.call_id);
        } catch {
          return call;
        }
      }),
    );
    const productionStart = new Date(
      process.env.PRODUCTION_DATA_START_AT || "2026-06-09T00:00:00.000Z",
    ).getTime();
    calls = calls.filter(
      (call) => new Date(call.created_at).getTime() >= productionStart,
    );
  } catch (callsError) {
    const message =
      callsError instanceof Error ? callsError.message : "Unable to load calls.";
    configurationError = message === "BLAND_NOT_CONFIGURED";
    error = configurationError ? "" : message;
  }

  return (
    <DashboardShell role="owner">
      <CallsDashboard
        calls={calls}
        configurationError={configurationError}
        error={error}
        phoneNumber="All BookMoreHQ-managed numbers"
      />
    </DashboardShell>
  );
}
