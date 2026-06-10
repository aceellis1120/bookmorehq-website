import { cookies } from "next/headers";
import { AUTH_COOKIE, verifySessionToken } from "@/lib/auth-token";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  return verifySessionToken(
    cookieStore.get(AUTH_COOKIE)?.value,
    process.env.AUTH_SECRET,
  );
}
