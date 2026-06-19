import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

interface ListCardProps {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  badgeVariant?: "success" | "warning" | "danger" | "info" | "default";
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
        "native-card w-full text-left transition active:scale-[0.99]",
        onClick && "cursor-pointer hover:border-primary/30",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-[16px] font-semibold text-foreground leading-tight">{title}</h3>
          {subtitle && <p className="mt-1 text-caption text-gray-500 leading-snug">{subtitle}</p>}
        </div>
        {badge || (badgeText && <Badge variant={badgeVariant}>{badgeText}</Badge>)}
      </div>
      {children && <div className="mt-3 border-t border-outline/50 pt-3">{children}</div>}
      {actions && <div className="mt-3 flex items-center gap-2 border-t border-outline/50 pt-3">{actions}</div>}
    </Wrapper>
  );
}

export function ListStack({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("flex flex-col gap-3", className)}>{children}</div>;
}
