export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-xl font-bold text-foreground leading-snug">{title}</h1>
      {subtitle && <p className="mt-1.5 text-sm text-muted leading-relaxed">{subtitle}</p>}
    </div>
  );
}
