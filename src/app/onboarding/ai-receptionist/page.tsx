import AiReceptionistOnboarding from "@/components/onboarding/AiReceptionistOnboarding";
import { isPackageId } from "@/lib/pricing";

export default async function AiReceptionistOnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ package?: string; session_id?: string }>;
}) {
  const params = await searchParams;
  const packageId = isPackageId(params.package) ? params.package : "starter";

  return (
    <AiReceptionistOnboarding
      packageId={packageId}
      checkoutSessionId={params.session_id ?? ""}
    />
  );
}
