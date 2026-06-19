import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  action?: React.ReactNode;
}

export function Card({ children, className, title, action }: CardProps) {
  return (
    <div className={cn("rounded-xl border border-gray-200 bg-white shadow-sm", className)}>
      {(title || action) && (
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
          {action}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: string;
}

export function StatCard({ title, value, icon, color = "bg-blue-50 text-blue-600" }: StatCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
        </div>
        {icon && (
          <div className={cn("rounded-lg p-3", color)}>{icon}</div>
        )}
      </div>
    </div>
  );
}
