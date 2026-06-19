import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "outline" | "glow";
  size?: "sm" | "md" | "lg" | "block";
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  children,
  ...props
}: ButtonProps) {
  const variants = {
    primary: "bg-gradient-premium text-white shadow-glow active:opacity-90 border border-white/10",
    glow: "bg-gradient-premium text-white shadow-fab animate-pulse-glow border border-white/20",
    secondary: "bg-surface-elevated text-foreground border border-border active:bg-surface hover:border-border-glow",
    danger: "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-500/20",
    ghost: "text-muted active:bg-white/5 hover:text-foreground",
    outline: "border border-primary/40 text-primary-light bg-primary/5 active:bg-primary/15",
  };
  const sizes = {
    sm: "px-3.5 py-2 text-[13px] rounded-button min-h-[40px]",
    md: "px-5 py-3 text-[14px] rounded-button min-h-[48px]",
    lg: "px-6 py-3.5 text-[15px] rounded-button min-h-[52px]",
    block: "w-full px-5 py-3.5 text-[15px] rounded-button min-h-[52px]",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
