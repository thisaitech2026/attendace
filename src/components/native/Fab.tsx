import { Plus } from "lucide-react";

export function Fab({ onClick, label = "Add" }: { onClick: () => void; label?: string }) {
  return (
    <div
      className="pointer-events-none fixed bottom-0 left-1/2 z-30 w-full max-w-md -translate-x-1/2"
      style={{ paddingBottom: "calc(var(--nav-height) + var(--safe-bottom) + 12px)" }}
    >
      <button
        onClick={onClick}
        className="pointer-events-auto absolute right-4 bottom-0 flex h-12 items-center gap-2 rounded-full bg-primary px-4 text-white shadow-lg"
        aria-label={label}
      >
        <Plus className="h-5 w-5 shrink-0" />
        <span className="text-sm font-semibold">{label}</span>
      </button>
    </div>
  );
}
