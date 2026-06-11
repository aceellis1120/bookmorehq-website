import CloserDashboard from "@/components/dashboard/CloserDashboard";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { getCurrentUser } from "@/lib/current-user";
import { getDashboardUsers } from "@/lib/dashboard-users";

export default async function CloserDashboardPage() {
  const user = await getCurrentUser();
  const ownerPreview = user?.role === "owner";
  const demoNumber = process.env.BLAND_DEMO_NUMBER || "+16155024926";
  const dashboardUser = getDashboardUsers().find(
    (record) => record.id === user?.id,
  );
  const bookingSlug = ownerPreview
    ? "closer1"
    : dashboardUser?.username || "closer1";
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
      <CloserDashboard
        closerName={closerName}
        demoNumber={demoNumber}
        bookingSlug={bookingSlug}
      />
    </DashboardShell>
  );
}
