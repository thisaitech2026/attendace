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
      className={cn("glass-card w-full text-left", onClick && "active:opacity-90", className)}
    >
      <div className="space-y-2">
        <h3 className="text-base font-semibold text-foreground leading-snug break-words">{title}</h3>
        {subtitle && <p className="text-sm text-muted leading-relaxed break-words">{subtitle}</p>}
        {(badge || badgeText) && (
          <div className="pt-1">
            {badge || <Badge variant={badgeVariant}>{badgeText}</Badge>}
          </div>
        )}
      </div>

      {children && <div className="mt-4 border-t pt-4 space-y-1" style={{ borderColor: "var(--border)" }}>{children}</div>}

      {actions && (
        <div className="mt-4 flex flex-col gap-2 border-t pt-4 sm:flex-row sm:flex-wrap" style={{ borderColor: "var(--border)" }}>
          {actions}
        </div>
      )}
    </Wrapper>
  );
}

export function ListStack({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("flex flex-col gap-4", className)}>{children}</div>;
}
