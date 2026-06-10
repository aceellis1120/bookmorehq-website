"use client";

import { Loader2, X } from "lucide-react";
import { useState } from "react";
import {
  AI_RECEPTIONIST_PACKAGES,
  type PackageId,
} from "@/lib/pricing";
import type { SalesTeamMember } from "@/lib/operations-types";

const inputClass =
  "h-10 w-full rounded-md border border-[#cfd5dc] bg-white px-3 text-sm outline-none focus:border-[#155eef]";

export default function OpportunityModal({
  open,
  onClose,
  onSave,
  team,
  closerName,
  saving,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (record: Record<string, unknown>) => Promise<void>;
  team: SalesTeamMember[];
  closerName?: string;
  saving: boolean;
}) {
  const [company, setCompany] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [niche, setNiche] = useState("");
  const [packageId, setPackageId] = useState<PackageId>("starter");
  const [closer, setCloser] = useState(closerName || team[0]?.name || "");
  const [nextAction, setNextAction] = useState("Initial outreach");
  const [nextActionAt, setNextActionAt] = useState("");

  if (!open) return null;

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    await onSave({
      action: "createOpportunity",
      company,
      contactName,
      email,
      phone,
      city,
      niche,
      packageId,
      closer: closerName || closer,
      nextAction,
      nextActionAt,
    });
    setCompany("");
    setContactName("");
    setEmail("");
    setPhone("");
    setCity("");
    setNiche("");
    setNextAction("Initial outreach");
    setNextActionAt("");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/35 px-4 py-8">
      <div className="max-h-full w-full max-w-2xl overflow-y-auto rounded-md border border-[#dfe3e8] bg-white shadow-xl">
        <div className="flex items-start justify-between border-b border-[#e8ebee] px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-[#17202a]">
              Add opportunity
            </h2>
            <p className="mt-1 text-xs text-[#667085]">
              This creates a real pipeline record.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-md text-[#667085] hover:bg-[#f5f7f9]"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-5 p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Company" required>
              <input
                required
                value={company}
                onChange={(event) => setCompany(event.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Contact name">
              <input
                value={contactName}
                onChange={(event) => setContactName(event.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Email">
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Phone">
              <input
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Industry">
              <input
                value={niche}
                onChange={(event) => setNiche(event.target.value)}
                placeholder="HVAC, roofing, plumbing..."
                className={inputClass}
              />
            </Field>
            <Field label="City">
              <input
                value={city}
                onChange={(event) => setCity(event.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="AI Receptionist package" required>
              <select
                value={packageId}
                onChange={(event) =>
                  setPackageId(event.target.value as PackageId)
                }
                className={inputClass}
              >
                {Object.values(AI_RECEPTIONIST_PACKAGES).map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name} - ${plan.setupFee.toLocaleString()} setup + $
                    {plan.monthlyPrice.toLocaleString()}/mo
                  </option>
                ))}
              </select>
            </Field>
            {!closerName && (
              <Field label="Assigned closer">
                <select
                  value={closer}
                  onChange={(event) => setCloser(event.target.value)}
                  className={inputClass}
                >
                  <option value="">Unassigned</option>
                  {team.map((member) => (
                    <option key={member.id} value={member.name}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </Field>
            )}
            <Field label="Next action">
              <input
                value={nextAction}
                onChange={(event) => setNextAction(event.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Due">
              <input
                type="datetime-local"
                value={nextActionAt}
                onChange={(event) => setNextActionAt(event.target.value)}
                className={inputClass}
              />
            </Field>
          </div>

          <div className="flex justify-end gap-2 border-t border-[#edf0f2] pt-5">
            <button
              type="button"
              onClick={onClose}
              className="h-10 rounded-md border border-[#cfd5dc] px-4 text-sm font-semibold text-[#344054]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-10 items-center gap-2 rounded-md bg-[#155eef] px-4 text-sm font-semibold text-white disabled:opacity-60"
            >
              {saving && <Loader2 size={16} className="animate-spin" />}
              Save opportunity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="space-y-1.5 text-sm font-medium text-[#344054]">
      <span>
        {label}
        {required ? " *" : ""}
      </span>
      {children}
    </label>
  );
}
