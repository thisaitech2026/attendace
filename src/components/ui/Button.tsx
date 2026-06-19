import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "outline";
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
    primary: "bg-primary text-white active:opacity-90",
    secondary: "bg-white/10 text-foreground border border-white/10 active:bg-white/15",
    danger: "bg-red-600 text-white active:opacity-90",
    ghost: "text-muted active:bg-white/5",
    outline: "border border-primary/50 text-primary-light bg-transparent active:bg-primary/10",
  };
  const sizes = {
    sm: "px-3 py-2 text-sm rounded-lg min-h-[40px]",
    md: "px-4 py-2.5 text-sm rounded-xl min-h-[44px]",
    lg: "px-5 py-3 text-base rounded-xl min-h-[48px]",
    block: "w-full px-4 py-3 text-base rounded-xl min-h-[48px]",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 font-semibold transition-opacity disabled:opacity-40",
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
