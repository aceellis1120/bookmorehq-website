type LeadAlertPayload = {
  call_id?: unknown;
  c_id?: unknown;
  from?: unknown;
  call_length?: unknown;
  summary?: unknown;
  analysis?: unknown;
  variables?: unknown;
  error_message?: unknown;
};

function record(value: unknown) {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : {};
}

function firstText(
  sources: Record<string, unknown>[],
  keys: string[],
  fallback: string,
) {
  for (const source of sources) {
    for (const key of keys) {
      const value = source[key];
      if (typeof value === "string" && value.trim()) return value.trim();
    }
  }
  return fallback;
}

export function leadAlertsConfigured() {
  return Boolean(
    process.env.RESEND_API_KEY &&
      process.env.LEAD_ALERT_FROM_EMAIL &&
      process.env.RESEND_API_KEY !== "replace_me",
  );
}

export async function sendLeadAlert({
  callId,
  company,
  recipient,
  payload,
}: {
  callId: string;
  company: string;
  recipient: string;
  payload: LeadAlertPayload;
}) {
  if (!leadAlertsConfigured()) return { status: "not-configured" as const };

  const variables = record(payload.variables);
  const analysis = record(payload.analysis);
  const sources = [variables, analysis];
  const callerName = firstText(sources, ["caller_name", "full_name", "name"], "Caller");
  const callbackNumber = firstText(
    sources,
    ["callback_number", "phone", "phone_number"],
    typeof payload.from === "string" ? payload.from : "Not captured",
  );
  const requestedService = firstText(
    sources,
    ["requested_service", "service_requested", "reason_for_calling"],
    "Not captured",
  );
  const urgency = firstText(sources, ["urgency", "priority"], "Not classified");
  const preferredTime = firstText(
    sources,
    ["preferred_appointment_time", "appointment_time", "preferred_time"],
    "Not requested",
  );
  const summary =
    typeof payload.summary === "string" && payload.summary.trim()
      ? payload.summary.trim()
      : firstText(sources, ["summary", "call_summary"], "No summary available.");
  const minutes = Number(payload.call_length);
  const duration = Number.isFinite(minutes)
    ? `${Math.max(0, minutes).toFixed(1)} minutes`
    : "Unknown";
  const error =
    typeof payload.error_message === "string" && payload.error_message.trim()
      ? payload.error_message.trim()
      : "None";

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "content-type": "application/json",
      "idempotency-key": `bland-call-${callId}`.slice(0, 256),
    },
    body: JSON.stringify({
      from: process.env.LEAD_ALERT_FROM_EMAIL,
      to: [recipient],
      reply_to: process.env.LEAD_ALERT_REPLY_TO || undefined,
      subject: `${urgency === "Not classified" ? "New call" : `${urgency} call`}: ${callerName} for ${company}`,
      text: [
        `New AI receptionist call for ${company}`,
        "",
        `Caller: ${callerName}`,
        `Callback: ${callbackNumber}`,
        `Requested service: ${requestedService}`,
        `Urgency: ${urgency}`,
        `Preferred time: ${preferredTime}`,
        `Duration: ${duration}`,
        `Call error: ${error}`,
        "",
        "Summary:",
        summary,
        "",
        `BookMoreHQ call ID: ${callId}`,
      ].join("\n"),
      tags: [
        { name: "source", value: "bland_call" },
        { name: "company", value: company.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 256) },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Lead alert delivery failed (${response.status}).`);
  }

  const result = (await response.json()) as { id?: string };
  return { status: "sent" as const, id: result.id };
}
