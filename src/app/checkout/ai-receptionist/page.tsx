import AiReceptionistCheckout from "@/components/checkout/AiReceptionistCheckout";
import { isPackageId } from "@/lib/pricing";

export default async function AiReceptionistCheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ package?: string; closer?: string }>;
}) {
  const params = await searchParams;
  const packageId = isPackageId(params.package) ? params.package : "starter";

  return (
    <AiReceptionistCheckout
      initialPackageId={packageId}
      closer={params.closer ?? ""}
    />
  );
}
