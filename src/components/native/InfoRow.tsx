import { cn } from "@/lib/utils";

export function InfoRow({ label, value, className }: { label: string; value: React.ReactNode; className?: string }) {
  return (
    <div className={cn("py-2.5", className)}>
      <p className="text-xs text-muted mb-1">{label}</p>
      <p className="text-sm font-medium text-foreground leading-relaxed break-words">{value}</p>
    </div>
  );
}

export function InfoGrid({ children, cols = 1 }: { children: React.ReactNode; cols?: 1 | 2 }) {
  return (
    <div className={cn("grid gap-1", cols === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1")}>
      {children}
    </div>
  );
}
