"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Building2, Users, Link2, FileText,
  LogOut, Home, CreditCard, History, Zap, Sparkles,
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
      <header className="premium-header sticky top-0 z-40">
        <div className="relative z-10 flex h-[60px] items-center justify-between px-5">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-premium shadow-glow">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-[15px] font-bold text-white truncate tracking-tight">Rental Manager</p>
              <p className="text-[11px] font-medium text-indigo-200/70">{role === "ADMIN" ? "Admin Console" : "My Portal"}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/80 backdrop-blur-sm transition active:scale-95 hover:bg-white/10"
            aria-label="Logout"
          >
            <LogOut className="h-[18px] w-[18px]" />
          </button>
        </div>
      </header>

      <main className="relative z-10 min-h-[calc(100dvh-60px-80px)] animate-fade-in px-4 py-5 pb-8">
        {children}
      </main>

      <nav className="fixed bottom-0 left-1/2 z-40 w-full max-w-md -translate-x-1/2 px-3 pb-3 safe-bottom">
        <div className="flex items-stretch rounded-[22px] border border-border bg-surface-glass p-1.5 shadow-nav backdrop-blur-2xl">
          {links.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative flex min-h-[56px] flex-1 flex-col items-center justify-center gap-0.5 rounded-[16px] py-1.5 transition-all duration-300",
                  active
                    ? "bg-gradient-premium text-white shadow-glow"
                    : "text-muted hover:text-foreground"
                )}
              >
                <Icon className={cn("h-[22px] w-[22px]", active && "drop-shadow-sm")} />
                <span className={cn("text-[10px] font-bold tracking-wide", active ? "text-white" : "")}>
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
