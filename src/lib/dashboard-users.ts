import type { DashboardRole, SessionUser } from "@/lib/auth-token";

export type DashboardUser = SessionUser & {
  username: string;
  password: string;
};

function isDashboardRole(value: unknown): value is DashboardRole {
  return value === "owner" || value === "closer";
}

export function getDashboardUsers(): DashboardUser[] {
  const rawUsers = process.env.DASHBOARD_USERS_JSON;
  if (!rawUsers) return [];

  try {
    const users = JSON.parse(rawUsers) as unknown;
    if (!Array.isArray(users)) return [];

    return users.filter((user): user is DashboardUser => {
      if (!user || typeof user !== "object") return false;

      const candidate = user as Partial<DashboardUser>;
      return (
        typeof candidate.id === "string" &&
        typeof candidate.name === "string" &&
        typeof candidate.email === "string" &&
        typeof candidate.username === "string" &&
        typeof candidate.password === "string" &&
        isDashboardRole(candidate.role) &&
        (candidate.closerName === undefined ||
          typeof candidate.closerName === "string")
      );
    });
  } catch {
    return [];
  }
}

export function findDashboardUser(identifier: string) {
  const normalizedIdentifier = identifier.trim().toLowerCase();
  return getDashboardUsers().find(
    (user) =>
      user.email.trim().toLowerCase() === normalizedIdentifier ||
      user.username.trim().toLowerCase() === normalizedIdentifier,
  );
}

export function findCloserName(value: string | undefined) {
  const normalized = value?.trim().toLowerCase();
  if (!normalized) return "Unassigned";

  const closer = getDashboardUsers().find(
    (user) =>
      user.role === "closer" &&
      [user.name, user.closerName]
        .filter(Boolean)
        .some((name) => name?.trim().toLowerCase() === normalized),
  );
  return closer?.closerName || closer?.name || "Unassigned";
}

export function toSessionUser(user: DashboardUser): SessionUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    closerName: user.closerName,
  };
}
