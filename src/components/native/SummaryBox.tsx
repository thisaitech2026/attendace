import { cn } from "@/lib/utils";

export function SummaryBox({
  label,
  value,
  variant = "default",
}: {
  label: string;
  value: string | number;
  variant?: "default" | "success" | "warning" | "danger";
}) {
  const styles = {
    default: "bg-gradient-stat-blue border-primary/20",
    success: "bg-gradient-stat-green border-emerald-500/20",
    warning: "bg-gradient-stat-amber border-amber-500/20",
    danger: "bg-gradient-stat-red border-red-500/20",
  };
  const labelColors = {
    default: "text-primary-light",
    success: "text-emerald-300",
    warning: "text-amber-300",
    danger: "text-red-300",
  };

  return (
    <div className={cn("glass-card py-4 border", styles[variant])}>
      <p className={cn("text-sm font-medium", labelColors[variant])}>{label}</p>
      <p className="text-xl font-bold text-foreground mt-1 leading-snug break-words">{value}</p>
    </div>
  );
}
