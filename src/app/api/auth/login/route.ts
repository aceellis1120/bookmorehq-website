import { NextRequest, NextResponse } from "next/server";
import {
  AUTH_COOKIE,
  createSessionToken,
  passwordsMatch,
} from "@/lib/auth-token";
import {
  findDashboardUser,
  getDashboardUsers,
  toSessionUser,
} from "@/lib/dashboard-users";

type LoginBody = {
  identifier?: string;
  email?: string;
  password?: string;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as LoginBody;
    const identifier = body.identifier || body.email;

    if (!identifier || !body.password) {
      return Response.json(
        { error: "Enter your email or username and password." },
        { status: 400 },
      );
    }

    const users = getDashboardUsers();
    const user = findDashboardUser(identifier);
    const authSecret = process.env.AUTH_SECRET;

    if (users.length === 0 || !authSecret) {
      return Response.json(
        { error: "Dashboard login is not configured." },
        { status: 503 },
      );
    }

    const valid =
      user && (await passwordsMatch(body.password, user.password));
    if (!valid) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return Response.json(
        { error: "That email, username, or password is incorrect." },
        { status: 401 },
      );
    }

    const response = NextResponse.json({
      success: true,
      redirectTo:
        user.role === "owner" ? "/dashboard" : "/dashboard/closer",
    });
    response.cookies.set(
      AUTH_COOKIE,
      await createSessionToken(toSessionUser(user), authSecret),
      {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 12 * 60 * 60,
      },
    );
    return response;
  } catch {
    return Response.json({ error: "Unable to sign in." }, { status: 400 });
  }
}
