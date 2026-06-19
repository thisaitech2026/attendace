"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Building2, Users, Link2, FileText,
  LogOut, Home, CreditCard, History, Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Role = "ADMIN" | "CUSTOMER";

const adminLinks = [
  { href: "/admin", label: "Home", icon: LayoutDashboard },
  { href: "/admin/properties", label: "Properties", icon: Building2 },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/rentals", label: "Rentals", icon: Link2 },
  { href: "/admin/reports", label: "Reports", icon: FileText },
];

const customerLinks = [
  { href: "/customer", label: "Home", icon: Home },
  { href: "/customer/utilities", label: "Utilities", icon: Zap },
  { href: "/customer/payments", label: "Pay", icon: CreditCard },
  { href: "/customer/history", label: "History", icon: History },
];

export function AppLayout({ children, role }: { children: React.ReactNode; role: Role }) {
  const pathname = usePathname();
  const router = useRouter();
  const links = role === "ADMIN" ? adminLinks : customerLinks;

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="flex h-full items-center justify-between px-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-base font-semibold text-white leading-tight">Rental Manager</p>
              <p className="text-xs text-slate-400 leading-tight mt-0.5">
                {role === "ADMIN" ? "Admin" : "Customer"}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white"
            aria-label="Logout"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </header>

      <main className="page-content px-4 py-5">{children}</main>

      <nav
        className="fixed bottom-0 left-1/2 z-40 w-full max-w-md -translate-x-1/2 border-t safe-bottom bg-[#12182a]"
        style={{ borderColor: "var(--border)", height: "calc(var(--nav-height) + var(--safe-bottom))" }}
      >
        <div className="flex h-[72px] items-center justify-around px-1">
          {links.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                title={link.label}
                className={cn(
                  "flex min-w-0 flex-1 flex-col items-center justify-center gap-1 px-1 py-2 rounded-lg transition-colors",
                  active ? "text-primary-light" : "text-slate-500"
                )}
              >
                <Icon className={cn("h-6 w-6 shrink-0", active && "text-primary-light")} />
                <span className="w-full text-center text-[11px] font-medium leading-tight">
                  {link.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export { AppLayout as Sidebar };
