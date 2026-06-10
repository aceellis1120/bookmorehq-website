import CloserDashboard from "@/components/dashboard/CloserDashboard";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { getCurrentUser } from "@/lib/current-user";

export default async function CloserDashboardPage() {
  const user = await getCurrentUser();
  const ownerPreview = user?.role === "owner";
  const closerName = ownerPreview
    ? "Closer 1"
    : user?.closerName || user?.name || "Closer";
  const displayName = ownerPreview
    ? "Closer 1 Preview"
    : user?.name || closerName;

  return (
    <DashboardShell
      role="closer"
      userName={displayName}
      userEmail={ownerPreview ? "Owner preview" : user?.email}
    >
      <CloserDashboard closerName={closerName} />
    </DashboardShell>
  );
}
