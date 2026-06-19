import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

interface ListCardProps {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  badgeVariant?: "success" | "warning" | "danger" | "info" | "default" | "premium";
  badgeText?: string;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function ListCard({
  title,
  subtitle,
  badge,
  badgeVariant = "default",
  badgeText,
  children,
  actions,
  onClick,
  className,
}: ListCardProps) {
  const Wrapper = onClick ? "button" : "div";

  return (
    <Wrapper
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={cn(
        "glass-card w-full text-left transition-all duration-200 animate-slide-up",
        onClick && "cursor-pointer hover:border-border-glow active:scale-[0.99]",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-[16px] font-bold text-foreground leading-tight tracking-tight">{title}</h3>
          {subtitle && <p className="mt-1.5 text-caption text-muted leading-snug">{subtitle}</p>}
        </div>
        {badge || (badgeText && <Badge variant={badgeVariant}>{badgeText}</Badge>)}
      </div>
      {children && <div className="mt-4 border-t border-border pt-4">{children}</div>}
      {actions && <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">{actions}</div>}
    </Wrapper>
  );
}

export function ListStack({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("flex flex-col gap-3.5", className)}>{children}</div>;
}
