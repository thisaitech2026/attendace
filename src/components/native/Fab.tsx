import { Plus } from "lucide-react";

export function Fab({ onClick, label = "Add" }: { onClick: () => void; label?: string }) {
  return (
    <button
      onClick={onClick}
      className="fixed right-4 z-30 flex h-14 items-center gap-2.5 rounded-pill bg-gradient-premium px-5 text-white shadow-fab border border-white/15 bottom-[calc(88px+var(--safe-bottom))] transition-all duration-200 active:scale-95 hover:shadow-glow"
      aria-label={label}
    >
      <Plus className="h-5 w-5" strokeWidth={2.5} />
      <span className="text-[14px] font-bold tracking-tight">{label}</span>
    </button>
  );
}
