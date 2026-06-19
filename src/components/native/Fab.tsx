import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

export function Fab({ onClick, label = "Add" }: { onClick: () => void; label?: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "fixed right-4 z-30 flex h-14 items-center gap-2 rounded-full bg-primary px-5 text-white shadow-fab",
        "bottom-[calc(76px+var(--safe-bottom))] active:scale-95 transition-transform"
      )}
      aria-label={label}
    >
      <Plus className="h-6 w-6" />
      <span className="text-[14px] font-semibold">{label}</span>
    </button>
  );
}
