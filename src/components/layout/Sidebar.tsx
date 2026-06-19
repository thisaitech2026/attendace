"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Building2, Users, Link2, FileText,
  LogOut, Home, CreditCard, History, Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const adminLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/properties", label: "Properties", icon: Building2 },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/rentals", label: "Rentals", icon: Link2 },
  { href: "/admin/reports", label: "Reports", icon: FileText },
];

const customerLinks = [
  { href: "/customer", label: "Dashboard", icon: Home },
  { href: "/customer/utilities", label: "Utilities", icon: Zap },
  { href: "/customer/payments", label: "Pay Rent", icon: CreditCard },
  { href: "/customer/history", label: "Payment History", icon: History },
];

export function Sidebar({ role }: { role: "ADMIN" | "CUSTOMER" }) {
  const pathname = usePathname();
  const router = useRouter();
  const links = role === "ADMIN" ? adminLinks : customerLinks;

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col bg-gray-900 text-white">
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

export function AppLayout({ children, role }: { children: React.ReactNode; role: "ADMIN" | "CUSTOMER" }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar role={role} />
      <main className="ml-64 p-8">{children}</main>
    </div>
  );
}
