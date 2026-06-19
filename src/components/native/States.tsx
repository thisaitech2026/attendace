import { Loader2 } from "lucide-react";

export function LoadingState({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-primary/30 blur-xl animate-pulse-glow" />
        <Loader2 className="relative h-10 w-10 animate-spin text-primary-light" />
      </div>
      <p className="mt-4 text-caption text-muted font-medium">{message}</p>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="skeleton h-28 w-full" />
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function EmptyState({ title, message }: { title: string; message?: string }) {
  return (
    <div className="glass-card py-12 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-border">
        <span className="text-2xl opacity-40">📭</span>
      </div>
      <p className="text-[16px] font-bold text-foreground">{title}</p>
      {message && <p className="mt-2 text-caption text-muted max-w-[240px] mx-auto">{message}</p>}
    </div>
  );
}
