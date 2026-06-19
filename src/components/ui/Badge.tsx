import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "success" | "warning" | "danger" | "info" | "default";
}

export function Badge({ children, variant = "default" }: BadgeProps) {
  const variants = {
    success: "bg-emerald-100 text-emerald-800",
    warning: "bg-amber-100 text-amber-800",
    danger: "bg-red-100 text-red-800",
    info: "bg-primary-container text-primary-dark",
    default: "bg-gray-100 text-gray-700",
  };
  return (
    <span className={cn("inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-[12px] font-semibold", variants[variant])}>
      {children}
    </span>
  );
}
