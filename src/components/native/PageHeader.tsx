export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6 animate-slide-up">
      <h1 className="text-title text-foreground tracking-tight">{title}</h1>
      {subtitle && <p className="mt-1.5 text-caption text-muted">{subtitle}</p>}
    </div>
  );
}
