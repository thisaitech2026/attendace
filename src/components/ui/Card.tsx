import { cn } from "@/lib/utils";

interface StatTileProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  accent?: "blue" | "green" | "red" | "amber" | "purple" | "gray";
}

const accents = {
  blue: { bg: "bg-gradient-stat-blue", icon: "bg-primary/20 text-primary-light ring-1 ring-primary/30" },
  green: { bg: "bg-gradient-stat-green", icon: "bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/30" },
  red: { bg: "bg-gradient-stat-red", icon: "bg-red-500/20 text-red-300 ring-1 ring-red-500/30" },
  amber: { bg: "bg-gradient-stat-amber", icon: "bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/30" },
  purple: { bg: "bg-gradient-stat-purple", icon: "bg-accent-violet/20 text-accent-violet ring-1 ring-accent-violet/30" },
  gray: { bg: "bg-surface-elevated", icon: "bg-white/5 text-muted ring-1 ring-border" },
};

export function StatTile({ title, value, icon, accent = "blue" }: StatTileProps) {
  const style = accents[accent];
  return (
    <div className={cn("glass-card flex items-center gap-3.5 p-4 transition hover:border-border-glow", style.bg)}>
      {icon && (
        <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl", style.icon)}>
          {icon}
        </div>
      )}
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted truncate">{title}</p>
        <p className="text-[20px] font-extrabold text-foreground leading-tight mt-1 tracking-tight">{value}</p>
      </div>
    </div>
  );
}

export function Card({ children, className, title }: { children: React.ReactNode; className?: string; title?: string }) {
  return (
    <div className={cn("glass-card animate-slide-up", className)}>
      {title && (
        <div className="mb-4 flex items-center gap-2">
          <div className="h-4 w-1 rounded-full bg-gradient-premium" />
          <h3 className="text-[14px] font-bold text-foreground tracking-tight">{title}</h3>
        </div>
      )}
      {children}
    </div>
  );
}

export const StatCard = StatTile;
