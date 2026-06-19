"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Building2, Users, Link2, FileText,
  LogOut, Home, CreditCard, History, Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { InstallPwaBanner } from "./InstallPwaBanner";

type Role = "ADMIN" | "CUSTOMER";

const adminLinks = [
  { href: "/admin", label: "Dashboard", shortLabel: "Home", icon: LayoutDashboard },
  { href: "/admin/properties", label: "Properties", shortLabel: "Props", icon: Building2 },
  { href: "/admin/customers", label: "Customers", shortLabel: "Users", icon: Users },
  { href: "/admin/rentals", label: "Rentals", shortLabel: "Rentals", icon: Link2 },
  { href: "/admin/reports", label: "Reports", shortLabel: "Reports", icon: FileText },
];

const customerLinks = [
  { href: "/customer", label: "Dashboard", shortLabel: "Home", icon: Home },
  { href: "/customer/utilities", label: "Utilities", shortLabel: "Utils", icon: Zap },
  { href: "/customer/payments", label: "Pay Rent", shortLabel: "Pay", icon: CreditCard },
  { href: "/customer/history", label: "Payment History", shortLabel: "History", icon: History },
];

function useNavLinks(role: Role) {
  return role === "ADMIN" ? adminLinks : customerLinks;
}

function DesktopSidebar({ role }: { role: Role }) {
  const pathname = usePathname();
  const router = useRouter();
  const links = useNavLinks(role);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col bg-gray-900 text-white md:flex">
      <Link
        href="/"
        className="flex h-16 items-center gap-2 border-b border-gray-800 px-6 hover:bg-gray-800/50 transition-colors"
      >
        <Building2 className="h-7 w-7 text-blue-400" />
        <div>
          <h1 className="text-sm font-bold">Rental Manager</h1>
          <p className="text-xs text-gray-400">{role === "ADMIN" ? "Admin Panel" : "Customer Portal"}</p>
        </div>
      </Link>
      <nav className="flex-1 space-y-1 p-4">
        {links.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-800 hover:text-white"
              )}
            >
              <Icon className="h-5 w-5" />
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-gray-800 p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}

function MobileHeader({ role }: { role: Role }) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-40 flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm safe-top md:hidden">
      <Link href="/" className="flex items-center gap-2">
        <Building2 className="h-6 w-6 text-blue-600" />
        <div>
          <p className="text-sm font-bold text-gray-900">Rental Manager</p>
          <p className="text-[10px] text-gray-500">{role === "ADMIN" ? "Admin" : "Customer"}</p>
        </div>
      </Link>
      <button
        onClick={handleLogout}
        className="flex h-10 w-10 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
        aria-label="Logout"
      >
        <LogOut className="h-5 w-5" />
      </button>
    </header>
  );
}

function MobileBottomNav({ role }: { role: Role }) {
  const pathname = usePathname();
  const links = useNavLinks(role);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.08)] safe-bottom md:hidden">
      <div className="flex items-stretch justify-around">
        {links.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex min-h-[60px] flex-1 flex-col items-center justify-center gap-0.5 px-1 py-2 text-[10px] font-medium transition-colors",
                active ? "text-blue-600" : "text-gray-500"
              )}
            >
              <Icon className={cn("h-5 w-5", active && "stroke-[2.5px]")} />
              <span className="truncate">{link.shortLabel}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function AppLayout({ children, role }: { children: React.ReactNode; role: Role }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <DesktopSidebar role={role} />
      <MobileHeader role={role} />
      <MobileBottomNav role={role} />
      <main className="min-h-screen px-4 pb-24 pt-16 md:ml-64 md:p-8 md:pb-8 md:pt-8">
        {children}
      </main>
      <InstallPwaBanner />
    </div>
  );
}

// Keep Sidebar export for any legacy imports
export { DesktopSidebar as Sidebar };
