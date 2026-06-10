"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BriefcaseBusiness,
  CircleDollarSign,
  CreditCard,
  Gauge,
  Headphones,
  LayoutDashboard,
  LogOut,
  Package,
  PanelLeftClose,
  PhoneCall,
  Users,
} from "lucide-react";
import { useState } from "react";

type DashboardShellProps = {
  role: "owner" | "closer";
  userName?: string;
  userEmail?: string;
  children: React.ReactNode;
};

const ownerNavigation = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Calls", href: "/dashboard/calls", icon: PhoneCall },
  { label: "Pipeline", href: "/dashboard/pipeline", icon: BriefcaseBusiness },
  { label: "Clients", href: "/dashboard/clients", icon: Users },
  { label: "Closers", href: "/dashboard/closers", icon: Headphones },
  { label: "Commissions", href: "/dashboard/commissions", icon: CircleDollarSign },
  { label: "Packages", href: "/dashboard/packages", icon: Package },
  { label: "Payments", href: "/dashboard/payments", icon: CreditCard },
];

const closerNavigation = [
  { label: "Workspace", href: "/dashboard/closer", icon: LayoutDashboard },
  { label: "My pipeline", href: "/dashboard/closer#pipeline", icon: BriefcaseBusiness },
  { label: "Packages", href: "/dashboard/closer#packages", icon: Package },
];

export default function DashboardShell({
  role,
  userName = role === "owner" ? "Austin Ellis" : "Closer",
  userEmail,
  children,
}: DashboardShellProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigation = role === "owner" ? ownerNavigation : closerNavigation;
  const initials = userName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  async function signOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

  return (
    <div className="min-h-screen bg-[#f4f6f8] text-[#17202a]">
      <div className="flex min-h-screen">
        <aside
          className={`fixed inset-y-0 left-0 z-40 flex w-[248px] flex-col border-r border-[#dfe3e8] bg-white transition-transform lg:static lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-16 items-center justify-between border-b border-[#e8ebee] px-5">
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/logo.svg"
                alt="BookMoreHQ"
                width={160}
                height={32}
                className="h-7 w-auto"
                priority
              />
            </Link>
            <button
              type="button"
              className="grid h-9 w-9 place-items-center text-[#667085] lg:hidden"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close navigation"
            >
              <PanelLeftClose size={19} />
            </button>
          </div>

          <div className="px-4 pb-2 pt-5">
            <p className="px-3 text-[11px] font-semibold uppercase text-[#98a2b3]">
              {role === "owner" ? "Owner command center" : "Closer workspace"}
            </p>
          </div>

          <nav className="flex-1 space-y-1 px-3">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = item.href === pathname;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors ${
                    active
                      ? "bg-[#eaf2ff] text-[#155eef]"
                      : "text-[#475467] hover:bg-[#f5f7f9] hover:text-[#17202a]"
                  }`}
                >
                  <Icon size={18} strokeWidth={1.8} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-[#e8ebee] p-3">
            {role === "owner" && (
              <Link
                href="/dashboard/closer"
                className="mb-1 flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-[#475467] hover:bg-[#f5f7f9]"
              >
                <Gauge size={18} strokeWidth={1.8} />
                Preview closer view
              </Link>
            )}
            <button
              type="button"
              onClick={signOut}
              className="flex h-10 w-full items-center gap-3 rounded-md px-3 text-sm font-medium text-[#475467] hover:bg-[#f5f7f9]"
            >
              <LogOut size={18} strokeWidth={1.8} />
              Sign out
            </button>
          </div>
        </aside>

        {sidebarOpen && (
          <button
            type="button"
            className="fixed inset-0 z-30 bg-black/20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation"
          />
        )}

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-[#dfe3e8] bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="grid h-9 w-9 place-items-center text-[#475467] lg:hidden"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open navigation"
              >
                <PanelLeftClose className="rotate-180" size={19} />
              </button>
              <div>
                <p className="text-sm font-semibold text-[#17202a]">
                  {role === "owner" ? "BookMoreHQ Operations" : "Sales Workspace"}
                </p>
                <p className="hidden text-xs text-[#667085] sm:block">
                  Production workspace · live records
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-[#17202a] text-xs font-semibold text-white">
                  {initials || (role === "owner" ? "AE" : "C")}
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs font-semibold text-[#17202a]">
                    {userName}
                  </p>
                  <p className="text-[11px] text-[#667085]">
                    {userEmail || (role === "owner" ? "Owner" : "Sales")}
                  </p>
                </div>
            </div>
          </header>

          <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
