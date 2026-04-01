"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STEPS = [
  "Business Information",
  "Ideal Customer Profile",
  "Campaign Preferences",
  "Calendar & Contact",
  "Review & Submit",
];

const INDUSTRIES = [
  "Roofing", "Solar", "HVAC", "Plumbing", "SaaS", "IT Services",
  "Staffing", "Insurance", "Real Estate", "Cleaning", "Financial Services",
  "Construction", "Marketing Agency", "Consulting", "Other",
];

const EMPLOYEE_RANGES = ["1-5", "6-10", "11-25", "26-50", "51-100", "100+"];

const REVENUE_RANGES = [
  "Under $10K", "$10K-$50K", "$50K-$100K", "$100K-$500K", "$500K-$1M", "$1M+",
];

const JOB_TITLES = [
  "CEO", "Founder", "Owner", "VP of Sales", "Marketing Director",
  "Operations Manager", "Office Manager", "Other",
];

const COMPANY_SIZES = ["1-10", "11-50", "51-200", "200-500", "500+", "Any"];

const DEAL_SIZES = [
  "Under $1,000", "$1,000-$5,000", "$5,000-$15,000", "$15,000-$50,000", "$50,000+",
];

const PACKAGES = [
  { label: "Growth — $3,500/mo", value: "growth-monthly" },
  { label: "Scale — $5,500/mo", value: "scale-monthly" },
  { label: "Growth 6-month — $3,000/mo", value: "growth-6month" },
  { label: "Scale 6-month — $5,000/mo", value: "scale-6month" },
];

const CHANNELS = ["Email", "SMS", "LinkedIn", "Phone"];

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const BOOKING_TOOLS = ["Calendly", "Cal.com", "HubSpot", "Acuity", "None"];

const UPDATE_METHODS = ["Email", "Slack", "Telegram", "Text"];

type FormData = {
  // Step 1
  companyName: string;
  websiteUrl: string;
  industry: string;
  customIndustry: string;
  employees: string;
  revenueRange: string;
  whatYouSell: string;
  differentiator: string;
  // Step 2
  idealCustomer: string;
  targetTitles: string[];
  targetIndustries: string;
  targetCompanySize: string;
  targetLocations: string;
  averageDealSize: string;
  currentAcquisition: string;
  // Step 3
  selectedPackage: string;
  outreachChannels: string[];
  problemYouSolve: string;
  doNotContact: string;
  competitorsToAvoid: string;
  anythingElse: string;
  // Step 4
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  availableDays: string[];
  timeRange: string;
  bookingTool: string;
  bookingLink: string;
  updateMethod: string;
};

const initialFormData: FormData = {
  companyName: "",
  websiteUrl: "",
  industry: "",
  customIndustry: "",
  employees: "",
  revenueRange: "",
  whatYouSell: "",
  differentiator: "",
  idealCustomer: "",
  targetTitles: [],
  targetIndustries: "",
  targetCompanySize: "",
  targetLocations: "",
  averageDealSize: "",
  currentAcquisition: "",
  selectedPackage: "",
  outreachChannels: [],
  problemYouSolve: "",
  doNotContact: "",
  competitorsToAvoid: "",
  anythingElse: "",
  contactName: "",
  contactEmail: "",
  contactPhone: "",
  availableDays: [],
  timeRange: "",
  bookingTool: "",
  bookingLink: "",
  updateMethod: "",
};

// Validation per step - returns list of missing required field labels
function validateStep(step: number, data: FormData): string[] {
  const missing: string[] = [];
  switch (step) {
    case 0:
      if (!data.companyName.trim()) missing.push("Company name");
      if (!data.industry) missing.push("Industry");
      if (data.industry === "Other" && !data.customIndustry.trim()) missing.push("Custom industry");
      if (!data.whatYouSell.trim()) missing.push("What you sell/offer");
      break;
    case 1:
      if (!data.idealCustomer.trim()) missing.push("Ideal customer description");
      if (data.targetTitles.length === 0) missing.push("Target job titles");
      break;
    case 2:
      if (!data.selectedPackage) missing.push("Package selection");
      if (data.outreachChannels.length === 0) missing.push("Outreach channels");
      if (!data.problemYouSolve.trim()) missing.push("Problem you solve");
      break;
    case 3:
      if (!data.contactName.trim()) missing.push("Your name");
      if (!data.contactEmail.trim()) missing.push("Your email");
      if (!data.contactPhone.trim()) missing.push("Your phone number");
      break;
  }
  return missing;
}

// Reusable components
function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-sm font-medium text-white mb-1.5">
      {children}
      {required && <span className="text-accent ml-1">*</span>}
    </label>
  );
}

function Input({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-bg-primary border border-border rounded-lg px-4 py-3 text-white placeholder-text-secondary/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
    />
  );
}

function Select({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-bg-primary border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors appearance-none"
    >
      <option value="" className="text-text-secondary">
        {placeholder || "Select..."}
      </option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}

function Textarea({
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full bg-bg-primary border border-border rounded-lg px-4 py-3 text-white placeholder-text-secondary/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors resize-none"
    />
  );
}

function CheckboxGroup({
  options,
  selected,
  onChange,
}: {
  options: string[];
  selected: string[];
  onChange: (v: string[]) => void;
}) {
  const toggle = (opt: string) => {
    onChange(
      selected.includes(opt)
        ? selected.filter((s) => s !== opt)
        : [...selected, opt]
    );
  };
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = selected.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
              active
                ? "bg-accent/20 border-accent text-accent"
                : "bg-bg-primary border-border text-text-secondary hover:border-text-secondary"
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

// Step components
function Step1({ data, update }: { data: FormData; update: (d: Partial<FormData>) => void }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <Label required>Company Name</Label>
          <Input value={data.companyName} onChange={(v) => update({ companyName: v })} placeholder="Acme Corp" />
        </div>
        <div>
          <Label>Website URL</Label>
          <Input value={data.websiteUrl} onChange={(v) => update({ websiteUrl: v })} placeholder="https://example.com" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <Label required>Industry</Label>
          <Select value={data.industry} onChange={(v) => update({ industry: v })} options={INDUSTRIES} placeholder="Select your industry" />
        </div>
        {data.industry === "Other" && (
          <div>
            <Label required>Specify Industry</Label>
            <Input value={data.customIndustry} onChange={(v) => update({ customIndustry: v })} placeholder="Your industry" />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <Label>Number of Employees</Label>
          <Select value={data.employees} onChange={(v) => update({ employees: v })} options={EMPLOYEE_RANGES} placeholder="Select range" />
        </div>
        <div>
          <Label>Monthly Revenue Range</Label>
          <Select value={data.revenueRange} onChange={(v) => update({ revenueRange: v })} options={REVENUE_RANGES} placeholder="Select range" />
        </div>
      </div>

      <div>
        <Label required>What do you sell/offer?</Label>
        <Textarea value={data.whatYouSell} onChange={(v) => update({ whatYouSell: v })} placeholder="Describe your products or services..." />
      </div>

      <div>
        <Label>What makes you different from competitors?</Label>
        <Textarea value={data.differentiator} onChange={(v) => update({ differentiator: v })} placeholder="Your unique selling proposition..." />
      </div>
    </div>
  );
}

function Step2({ data, update }: { data: FormData; update: (d: Partial<FormData>) => void }) {
  return (
    <div className="space-y-5">
      <div>
        <Label required>Who is your ideal customer?</Label>
        <Textarea value={data.idealCustomer} onChange={(v) => update({ idealCustomer: v })} placeholder="Describe the type of person or company you want to reach" rows={4} />
      </div>

      <div>
        <Label required>Target Job Titles</Label>
        <CheckboxGroup options={JOB_TITLES} selected={data.targetTitles} onChange={(v) => update({ targetTitles: v })} />
      </div>

      <div>
        <Label>Target Industries</Label>
        <Input value={data.targetIndustries} onChange={(v) => update({ targetIndustries: v })} placeholder="What industries are your best customers in?" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <Label>Target Company Size</Label>
          <Select value={data.targetCompanySize} onChange={(v) => update({ targetCompanySize: v })} options={COMPANY_SIZES} placeholder="Select size" />
        </div>
        <div>
          <Label>Average Deal Size</Label>
          <Select value={data.averageDealSize} onChange={(v) => update({ averageDealSize: v })} options={DEAL_SIZES} placeholder="Select range" />
        </div>
      </div>

      <div>
        <Label>Target Locations</Label>
        <Input value={data.targetLocations} onChange={(v) => update({ targetLocations: v })} placeholder="Cities, states, or regions you want to target" />
      </div>

      <div>
        <Label>How do you currently get customers?</Label>
        <Textarea value={data.currentAcquisition} onChange={(v) => update({ currentAcquisition: v })} placeholder="Referrals, ads, cold outreach, etc." />
      </div>
    </div>
  );
}

function Step3({ data, update }: { data: FormData; update: (d: Partial<FormData>) => void }) {
  return (
    <div className="space-y-5">
      <div>
        <Label required>Which package did you select?</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PACKAGES.map((pkg) => (
            <button
              key={pkg.value}
              type="button"
              onClick={() => update({ selectedPackage: pkg.value })}
              className={`p-4 rounded-lg border text-left transition-all ${
                data.selectedPackage === pkg.value
                  ? "bg-accent/15 border-accent shadow-[0_0_15px_rgba(59,130,246,0.15)]"
                  : "bg-bg-primary border-border hover:border-text-secondary"
              }`}
            >
              <span className={`text-sm font-semibold ${data.selectedPackage === pkg.value ? "text-accent" : "text-white"}`}>
                {pkg.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label required>Preferred Outreach Channels</Label>
        <CheckboxGroup options={CHANNELS} selected={data.outreachChannels} onChange={(v) => update({ outreachChannels: v })} />
      </div>

      <div>
        <Label required>What problem do you solve for your customers?</Label>
        <Textarea value={data.problemYouSolve} onChange={(v) => update({ problemYouSolve: v })} placeholder="Describe the core problem your product/service solves..." rows={4} />
      </div>

      <div>
        <Label>Any companies or people we should NOT contact?</Label>
        <Textarea value={data.doNotContact} onChange={(v) => update({ doNotContact: v })} placeholder="List any exclusions..." />
      </div>

      <div>
        <Label>Are there any competitors you want us to avoid?</Label>
        <Textarea value={data.competitorsToAvoid} onChange={(v) => update({ competitorsToAvoid: v })} placeholder="List competitors to exclude..." />
      </div>

      <div>
        <Label>Anything else we should know?</Label>
        <Textarea value={data.anythingElse} onChange={(v) => update({ anythingElse: v })} placeholder="Additional context, preferences, or notes..." />
      </div>
    </div>
  );
}

function Step4({ data, update }: { data: FormData; update: (d: Partial<FormData>) => void }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <Label required>Your Name</Label>
          <Input value={data.contactName} onChange={(v) => update({ contactName: v })} placeholder="John Smith" />
        </div>
        <div>
          <Label required>Your Email</Label>
          <Input value={data.contactEmail} onChange={(v) => update({ contactEmail: v })} placeholder="john@example.com" type="email" />
        </div>
      </div>

      <div>
        <Label required>Your Phone Number</Label>
        <Input value={data.contactPhone} onChange={(v) => update({ contactPhone: v })} placeholder="(555) 123-4567" type="tel" />
      </div>

      <div>
        <Label>Calendar Availability — What days work for appointments?</Label>
        <CheckboxGroup options={DAYS} selected={data.availableDays} onChange={(v) => update({ availableDays: v })} />
      </div>

      <div>
        <Label>Preferred Time Range</Label>
        <Input value={data.timeRange} onChange={(v) => update({ timeRange: v })} placeholder="e.g. 9am - 5pm EST" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <Label>Do you use a booking tool?</Label>
          <Select value={data.bookingTool} onChange={(v) => update({ bookingTool: v })} options={BOOKING_TOOLS} placeholder="Select tool" />
        </div>
        {data.bookingTool && data.bookingTool !== "None" && (
          <div>
            <Label>Booking Link</Label>
            <Input value={data.bookingLink} onChange={(v) => update({ bookingLink: v })} placeholder="https://calendly.com/you" />
          </div>
        )}
      </div>

      <div>
        <Label>Preferred method for us to send you updates</Label>
        <Select value={data.updateMethod} onChange={(v) => update({ updateMethod: v })} options={UPDATE_METHODS} placeholder="Select method" />
      </div>
    </div>
  );
}

function ReviewSection({
  title,
  stepIndex,
  onEdit,
  children,
}: {
  title: string;
  stepIndex: number;
  onEdit: (step: number) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-border rounded-lg p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-semibold">{title}</h3>
        <button
          type="button"
          onClick={() => onEdit(stepIndex)}
          className="text-accent text-sm hover:underline"
        >
          Edit
        </button>
      </div>
      <div className="space-y-2 text-sm text-text-secondary">{children}</div>
    </div>
  );
}

function ReviewItem({ label, value }: { label: string; value: string | string[] | undefined }) {
  const display = Array.isArray(value) ? value.join(", ") : value;
  if (!display) return null;
  return (
    <div className="flex flex-col sm:flex-row sm:gap-2">
      <span className="text-text-secondary/70 shrink-0">{label}:</span>
      <span className="text-white">{display}</span>
    </div>
  );
}

function Step5({ data, onEdit }: { data: FormData; onEdit: (step: number) => void }) {
  const pkgLabel = PACKAGES.find((p) => p.value === data.selectedPackage)?.label || data.selectedPackage;
  return (
    <div className="space-y-4">
      <ReviewSection title="Business Information" stepIndex={0} onEdit={onEdit}>
        <ReviewItem label="Company" value={data.companyName} />
        <ReviewItem label="Website" value={data.websiteUrl} />
        <ReviewItem label="Industry" value={data.industry === "Other" ? data.customIndustry : data.industry} />
        <ReviewItem label="Employees" value={data.employees} />
        <ReviewItem label="Revenue" value={data.revenueRange} />
        <ReviewItem label="What you sell" value={data.whatYouSell} />
        <ReviewItem label="Differentiator" value={data.differentiator} />
      </ReviewSection>

      <ReviewSection title="Ideal Customer Profile" stepIndex={1} onEdit={onEdit}>
        <ReviewItem label="Ideal customer" value={data.idealCustomer} />
        <ReviewItem label="Target titles" value={data.targetTitles} />
        <ReviewItem label="Target industries" value={data.targetIndustries} />
        <ReviewItem label="Company size" value={data.targetCompanySize} />
        <ReviewItem label="Locations" value={data.targetLocations} />
        <ReviewItem label="Deal size" value={data.averageDealSize} />
        <ReviewItem label="Current acquisition" value={data.currentAcquisition} />
      </ReviewSection>

      <ReviewSection title="Campaign Preferences" stepIndex={2} onEdit={onEdit}>
        <ReviewItem label="Package" value={pkgLabel} />
        <ReviewItem label="Channels" value={data.outreachChannels} />
        <ReviewItem label="Problem you solve" value={data.problemYouSolve} />
        <ReviewItem label="Do not contact" value={data.doNotContact} />
        <ReviewItem label="Competitors to avoid" value={data.competitorsToAvoid} />
        <ReviewItem label="Other notes" value={data.anythingElse} />
      </ReviewSection>

      <ReviewSection title="Calendar & Contact" stepIndex={3} onEdit={onEdit}>
        <ReviewItem label="Name" value={data.contactName} />
        <ReviewItem label="Email" value={data.contactEmail} />
        <ReviewItem label="Phone" value={data.contactPhone} />
        <ReviewItem label="Available days" value={data.availableDays} />
        <ReviewItem label="Time range" value={data.timeRange} />
        <ReviewItem label="Booking tool" value={data.bookingTool} />
        <ReviewItem label="Booking link" value={data.bookingLink} />
        <ReviewItem label="Update method" value={data.updateMethod} />
      </ReviewSection>
    </div>
  );
}

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [direction, setDirection] = useState(1);

  const update = (partial: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...partial }));
    setErrors([]);
  };

  const goTo = (target: number) => {
    setDirection(target > step ? 1 : -1);
    setErrors([]);
    setStep(target);
  };

  const next = () => {
    const missing = validateStep(step, formData);
    if (missing.length > 0) {
      setErrors(missing);
      return;
    }
    goTo(step + 1);
  };

  const back = () => goTo(step - 1);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, submittedAt: new Date().toISOString() }),
      });
      if (!res.ok) throw new Error("Submit failed");
      console.log("Onboarding submitted:", formData);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setErrors(["Something went wrong. Please try again or contact hello@bookmorehq.com"]);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-bg-secondary border border-border rounded-2xl p-10 max-w-lg w-full text-center"
        >
          <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">You&apos;re all set!</h2>
          <p className="text-text-secondary text-lg">
            Thanks! We&apos;ll have your campaigns ready within 10 days.
          </p>
          <p className="text-text-secondary/60 text-sm mt-4">
            Questions? Reach out to{" "}
            <a href="mailto:hello@bookmorehq.com" className="text-accent hover:underline">
              hello@bookmorehq.com
            </a>
          </p>
        </motion.div>
      </div>
    );
  }

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 40 : -40, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -40 : 40, opacity: 0 }),
  };

  return (
    <div className="min-h-screen bg-bg-primary py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Logo */}
        <div className="text-center mb-8">
          <a href="/" className="inline-flex items-center gap-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
                <path d="M9 16l2 2 4-4" />
              </svg>
            </div>
            <span className="text-white font-bold text-xl">BookMore HQ</span>
          </a>
          <p className="text-text-secondary mt-2">Client Onboarding</p>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            {STEPS.map((label, i) => (
              <div key={label} className="flex flex-col items-center flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                    i < step
                      ? "bg-accent text-white"
                      : i === step
                      ? "bg-accent/20 border-2 border-accent text-accent"
                      : "bg-bg-primary border border-border text-text-secondary"
                  }`}
                >
                  {i < step ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </div>
                <span className={`text-xs mt-1.5 hidden sm:block ${i <= step ? "text-white" : "text-text-secondary/50"}`}>
                  {label}
                </span>
              </div>
            ))}
          </div>
          <div className="h-1 bg-bg-primary rounded-full overflow-hidden border border-border/50">
            <motion.div
              className="h-full bg-accent rounded-full"
              initial={false}
              animate={{ width: `${((step) / (STEPS.length - 1)) * 100}%` }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            />
          </div>
          <p className="text-text-secondary text-sm mt-2 text-center">
            Step {step + 1} of {STEPS.length}
          </p>
        </div>

        {/* Form card */}
        <div className="bg-bg-secondary border border-border rounded-2xl p-6 sm:p-8 min-h-[400px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              <h2 className="text-xl font-bold text-white mb-1">{STEPS[step]}</h2>
              <p className="text-text-secondary text-sm mb-6">
                {step === 0 && "Tell us about your business so we can tailor your campaigns."}
                {step === 1 && "Help us understand who you want to reach."}
                {step === 2 && "Configure your outreach preferences."}
                {step === 3 && "How should we reach you and book appointments?"}
                {step === 4 && "Review your information before submitting."}
              </p>

              {step === 0 && <Step1 data={formData} update={update} />}
              {step === 1 && <Step2 data={formData} update={update} />}
              {step === 2 && <Step3 data={formData} update={update} />}
              {step === 3 && <Step4 data={formData} update={update} />}
              {step === 4 && <Step5 data={formData} onEdit={goTo} />}
            </motion.div>
          </AnimatePresence>

          {/* Errors */}
          {errors.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 p-3 rounded-lg bg-red-500/10 border border-red-500/30"
            >
              <p className="text-red-400 text-sm font-medium">Please fill in the following required fields:</p>
              <ul className="text-red-400/80 text-sm mt-1 list-disc list-inside">
                {errors.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
            {step > 0 ? (
              <button
                type="button"
                onClick={back}
                className="px-6 py-2.5 rounded-lg border border-border text-text-secondary hover:text-white hover:border-text-secondary transition-colors"
              >
                Back
              </button>
            ) : (
              <div />
            )}

            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={next}
                className="px-8 py-2.5 rounded-lg bg-accent text-white font-semibold hover:bg-accent/90 transition-colors shadow-[0_0_20px_rgba(59,130,246,0.25)]"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="px-8 py-2.5 rounded-lg bg-accent text-white font-semibold hover:bg-accent/90 transition-colors shadow-[0_0_20px_rgba(59,130,246,0.25)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Submitting..." : "Submit"}
              </button>
            )}
          </div>
        </div>

        {/* Help footer */}
        <p className="text-center text-text-secondary/60 text-sm mt-6">
          Need help? Contact{" "}
          <a href="mailto:hello@bookmorehq.com" className="text-accent hover:underline">
            hello@bookmorehq.com
          </a>
        </p>
      </div>
    </div>
  );
}
