export type BlandCall = {
  call_id: string;
  created_at: string;
  call_length: number;
  to: string;
  from: string;
  completed: boolean;
  queue_status: string;
  error_message: string | null;
  inbound?: boolean;
  summary?: string;
  concatenated_transcript?: string;
  transcripts?: Array<{
    user?: string;
    text?: string;
    created_at?: string;
  }>;
  variables?: Record<string, unknown>;
  analysis?: Record<string, unknown>;
  pathway_tags?: string[];
};

type BlandCallsResponse = {
  count: number;
  calls: BlandCall[];
};

export function getBlandApiKey() {
  const apiKey = process.env.BLAND_API_KEY;

  if (!apiKey || apiKey === "replace_me") {
    return null;
  }

  return apiKey;
}

export async function blandRequest<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const apiKey = getBlandApiKey();

  if (!apiKey) {
    throw new Error("BLAND_NOT_CONFIGURED");
  }

  const response = await fetch(`https://api.bland.ai${path}`, {
    ...options,
    headers: {
      authorization: apiKey,
      ...(options?.body ? { "content-type": "application/json" } : {}),
      ...options?.headers,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `Bland request failed (${response.status}): ${body.slice(0, 240)}`,
    );
  }

  return (await response.json()) as T;
}

export async function getRecentBlandCalls(
  limit = 20,
  phoneNumber?: string,
) {
  const params = new URLSearchParams({
    limit: String(limit),
    ascending: "false",
    sort_by: "created_at",
  });

  if (phoneNumber) {
    params.set("to_number", phoneNumber);
  }

  const result = await blandRequest<BlandCallsResponse>(
    `/v1/calls?${params.toString()}`,
  );

  return result.calls ?? [];
}

export async function getBlandCallDetails(callId: string) {
  return blandRequest<BlandCall>(`/v1/calls/${encodeURIComponent(callId)}`);
}
