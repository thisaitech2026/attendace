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
    primary: "bg-primary text-white active:bg-primary-dark shadow-sm",
    secondary: "bg-primary-container text-primary-dark active:bg-blue-100",
    danger: "bg-red-600 text-white active:bg-red-700",
    ghost: "text-gray-600 active:bg-gray-100",
    outline: "border-2 border-primary text-primary bg-white active:bg-primary-container",
  };
  const sizes = {
    sm: "px-3 py-2 text-[13px] rounded-button min-h-[40px]",
    md: "px-5 py-3 text-[15px] rounded-button min-h-[48px]",
    lg: "px-6 py-3.5 text-[16px] rounded-button min-h-[52px]",
    block: "w-full px-5 py-3.5 text-[16px] rounded-button min-h-[52px]",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
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
