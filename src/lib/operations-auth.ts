import { NextRequest } from "next/server";
import {
  AUTH_COOKIE,
  verifySessionToken,
  type SessionPayload,
} from "@/lib/auth-token";

export async function getRequestSession(request: NextRequest) {
  return verifySessionToken(
    request.cookies.get(AUTH_COOKIE)?.value,
    process.env.AUTH_SECRET,
  );
}

export function filterStateForSession<T extends {
  opportunities: Array<{ closer: string }>;
  clients: Array<{ closer: string }>;
  payments: Array<{ closer: string }>;
  commissions: Array<{ closer: string }>;
}>(
  state: T,
  session: SessionPayload,
) {
  if (session.role === "owner") return state;

  const closer = session.closerName || session.name;
  return {
    ...state,
    opportunities: state.opportunities.filter(
      (record) => record.closer === closer,
    ),
    clients: state.clients.filter((record) => record.closer === closer),
    payments: state.payments.filter((record) => record.closer === closer),
    commissions: state.commissions.filter(
      (record) => record.closer === closer,
    ),
  };
}
