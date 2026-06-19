import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "success" | "warning" | "danger" | "info" | "default" | "premium";
}

export function Badge({ children, variant = "default" }: BadgeProps) {
  const variants = {
    success: "bg-emerald-500/15 text-emerald-300 border border-emerald-500/25",
    warning: "bg-amber-500/15 text-amber-300 border border-amber-500/25",
    danger: "bg-red-500/15 text-red-300 border border-red-500/25",
    info: "bg-primary/15 text-primary-light border border-primary/30",
    premium: "bg-gradient-premium text-white border border-white/20 shadow-sm",
    default: "bg-white/5 text-muted border border-border",
  };
  return (
    <span className={cn("inline-flex shrink-0 items-center rounded-pill px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide", variants[variant])}>
      {children}
    </span>
  );
}
