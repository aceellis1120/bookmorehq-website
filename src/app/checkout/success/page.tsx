import { AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { isPackageId } from "@/lib/pricing";
import { getStripe } from "@/lib/stripe";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ package?: string; session_id?: string }>;
}) {
  const params = await searchParams;
  let paymentConfirmed = false;
  let packageId = params.package ?? "starter";

  if (params.session_id) {
    try {
      const session = await getStripe().checkout.sessions.retrieve(
        params.session_id,
      );
      paymentConfirmed =
        session.status === "complete" && session.payment_status === "paid";
      const paidPackage = session.metadata?.packageId;
      packageId = isPackageId(paidPackage) ? paidPackage : "starter";
    } catch {
      paymentConfirmed = false;
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#f4f6f8] px-4">
      <section className="w-full max-w-xl rounded-md border border-[#dfe3e8] bg-white p-8 text-center">
        {paymentConfirmed ? (
          <CheckCircle2 size={48} className="mx-auto text-[#18794e]" />
        ) : (
          <AlertCircle size={48} className="mx-auto text-[#b54708]" />
        )}
        <p className="mt-5 text-xs font-semibold uppercase text-[#667085]">
          {paymentConfirmed ? "Payment confirmed" : "Payment not verified"}
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-[#17202a]">
          {paymentConfirmed
            ? "Welcome to BookMoreHQ"
            : "We could not confirm this checkout"}
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#667085]">
          {paymentConfirmed
            ? `Your AI Receptionist ${packageId} package is ready for onboarding. Standard systems target launch within 1-2 business days after complete onboarding. Integrations, SMS registration, number porting, or complex routing may require 3-7 business days.`
            : "Return to checkout or contact BookMoreHQ before beginning implementation."}
        </p>
        {paymentConfirmed ? (
          <Link
            href={`/onboarding/ai-receptionist?package=${encodeURIComponent(packageId)}&session_id=${encodeURIComponent(params.session_id ?? "")}`}
            className="mt-6 inline-flex h-11 items-center justify-center rounded-md bg-[#155eef] px-5 text-sm font-semibold text-white"
          >
            Start onboarding
          </Link>
        ) : (
          <Link
            href={`/checkout/ai-receptionist?package=${encodeURIComponent(packageId)}`}
            className="mt-6 inline-flex h-11 items-center justify-center rounded-md bg-[#155eef] px-5 text-sm font-semibold text-white"
          >
            Return to checkout
          </Link>
        )}
      </section>
    </main>
  );
}
