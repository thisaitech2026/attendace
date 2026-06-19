export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-5">
      <h1 className="text-title text-foreground">{title}</h1>
      {subtitle && <p className="mt-1 text-caption text-gray-500">{subtitle}</p>}
    </div>
  );
}
