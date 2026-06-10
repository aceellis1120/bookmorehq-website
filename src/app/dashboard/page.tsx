import DashboardShell from "@/components/dashboard/DashboardShell";
import OwnerDashboard from "@/components/dashboard/OwnerDashboard";

export default function DashboardPage() {
  return (
    <DashboardShell role="owner">
      <OwnerDashboard />
    </DashboardShell>
  );
}
