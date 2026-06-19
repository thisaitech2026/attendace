import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "success" | "warning" | "danger" | "info" | "default" | "premium";
}

export function Badge({ children, variant = "default" }: BadgeProps) {
  const variants = {
    success: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    warning: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    danger: "bg-red-500/15 text-red-300 border-red-500/30",
    info: "bg-primary/15 text-primary-light border-primary/30",
    premium: "bg-primary text-white border-primary",
    default: "bg-white/5 text-muted border-white/10",
  };
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center rounded-lg border px-2.5 py-1 text-xs font-medium leading-snug break-words",
        variants[variant]
      )}
    >
      {children}
    </span>
  );
}
