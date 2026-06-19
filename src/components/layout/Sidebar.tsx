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
    <div className="app-container relative">
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-outline bg-primary px-4 text-white safe-top">
        <div className="flex items-center gap-2 min-w-0">
          <Building2 className="h-6 w-6 shrink-0" />
          <div className="min-w-0">
            <p className="text-[15px] font-bold truncate">Rental Manager</p>
            <p className="text-[11px] text-blue-100">{role === "ADMIN" ? "Admin" : "Customer"}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 active:bg-white/25"
          aria-label="Logout"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </header>

      <main className="min-h-[calc(100dvh-56px-64px)] px-4 py-4 pb-6">{children}</main>

      <nav className="fixed bottom-0 left-1/2 z-40 w-full max-w-md -translate-x-1/2 border-t border-outline bg-white safe-bottom">
        <div className="flex items-stretch">
          {links.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex min-h-[64px] flex-1 flex-col items-center justify-center gap-1 py-2 transition-colors",
                  active ? "text-primary" : "text-gray-400"
                )}
              >
                <Icon className={cn("h-6 w-6", active && "stroke-[2.5px]")} />
                <span className="text-[11px] font-semibold">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export { AppLayout as Sidebar };
