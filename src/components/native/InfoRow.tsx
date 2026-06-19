import { cn } from "@/lib/utils";

export function InfoRow({ label, value, className }: { label: string; value: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-0.5 py-2", className)}>
      <span className="text-caption text-gray-500">{label}</span>
      <span className="text-[15px] font-medium text-foreground break-words">{value}</span>
    </div>
  );
}

export function InfoGrid({ children, cols = 2 }: { children: React.ReactNode; cols?: 1 | 2 }) {
  return (
    <div className={cn("grid gap-x-4", cols === 2 ? "grid-cols-2" : "grid-cols-1")}>
      {children}
    </div>
  );
}
