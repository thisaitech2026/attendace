import { cn } from "@/lib/utils";

interface StatTileProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  accent?: "blue" | "green" | "red" | "amber" | "purple" | "gray";
}

const accents = {
  blue: "bg-primary-container text-primary",
  green: "bg-emerald-50 text-emerald-600",
  red: "bg-red-50 text-red-600",
  amber: "bg-amber-50 text-amber-600",
  purple: "bg-purple-50 text-purple-600",
  gray: "bg-gray-100 text-gray-600",
};

export function StatTile({ title, value, icon, accent = "blue" }: StatTileProps) {
  return (
    <div className="native-card flex items-center gap-3 p-4">
      {icon && (
        <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl", accents[accent])}>
          {icon}
        </div>
      )}
      <div className="min-w-0">
        <p className="text-caption text-gray-500 truncate">{title}</p>
        <p className="text-[20px] font-bold text-foreground leading-tight mt-0.5">{value}</p>
      </div>
    </div>
  );
}

export function Card({ children, className, title }: { children: React.ReactNode; className?: string; title?: string }) {
  return (
    <div className={cn("native-card", className)}>
      {title && <h3 className="text-[15px] font-semibold text-foreground mb-3">{title}</h3>}
      {children}
    </div>
  );
}

// Legacy alias
export const StatCard = StatTile;
