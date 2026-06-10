import DashboardShell from "@/components/dashboard/DashboardShell";
import OwnerOperationsView from "@/components/dashboard/OwnerOperationsView";
import type { OwnerSection } from "@/lib/operations-types";

export default function OwnerSectionPage({
  section,
}: {
  section: OwnerSection;
}) {
  return (
    <DashboardShell role="owner">
      <OwnerOperationsView section={section} />
    </DashboardShell>
  );
}
