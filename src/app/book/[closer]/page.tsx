import { notFound } from "next/navigation";
import DemoBookingForm from "@/components/booking/DemoBookingForm";
import { getDashboardUsers } from "@/lib/dashboard-users";

export const dynamic = "force-dynamic";

export default async function BookCloserDemoPage({
  params,
}: {
  params: Promise<{ closer: string }>;
}) {
  const { closer } = await params;
  const exists = getDashboardUsers().some(
    (user) =>
      user.role === "closer" &&
      user.username.toLowerCase() === closer.toLowerCase(),
  );
  if (!exists) notFound();

  return (
    <main className="min-h-screen bg-[#f4f6f8] px-4 py-8 text-[#17202a] sm:py-12">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-md border border-[#dfe3e8] bg-white">
        <DemoBookingForm closer={closer} />
      </div>
    </main>
  );
}
