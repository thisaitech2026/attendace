import { cn } from "@/lib/utils";

interface StatTileProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  accent?: "blue" | "green" | "red" | "amber" | "purple" | "gray";
}

const iconBg = {
  blue: "bg-primary/20 text-primary-light",
  green: "bg-emerald-500/20 text-emerald-300",
  red: "bg-red-500/20 text-red-300",
  amber: "bg-amber-500/20 text-amber-300",
  purple: "bg-violet-500/20 text-violet-300",
  gray: "bg-white/10 text-muted",
};

export function StatTile({ title, value, icon, accent = "blue" }: StatTileProps) {
  return (
    <div className="glass-card flex items-start gap-4">
      {icon && (
        <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl", iconBg[accent])}>
          {icon}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-sm text-muted leading-snug">{title}</p>
        <p className="text-xl font-bold text-foreground leading-snug mt-1 break-words">{value}</p>
      </div>
    </div>
  );
}

export function Card({ children, className, title }: { children: React.ReactNode; className?: string; title?: string }) {
  return (
    <div className={cn("glass-card", className)}>
      {title && <h3 className="text-base font-semibold text-foreground mb-4 leading-snug">{title}</h3>}
      {children}
    </div>
  );
}

export const StatCard = StatTile;
