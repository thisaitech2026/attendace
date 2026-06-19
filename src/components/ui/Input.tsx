import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s/g, "-");
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="native-label">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn("native-input", error && "border-red-500", className)}
        {...props}
      />
      {error && <p className="text-[12px] text-red-500">{error}</p>}
    </div>
  );
}
