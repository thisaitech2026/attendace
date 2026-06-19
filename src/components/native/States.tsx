import { Loader2 } from "lucide-react";

export function LoadingState({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-500">
      <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
      <p className="text-caption">{message}</p>
    </div>
  );
}

export function EmptyState({ title, message }: { title: string; message?: string }) {
  return (
    <div className="native-card text-center py-10">
      <p className="text-[16px] font-medium text-gray-700">{title}</p>
      {message && <p className="mt-1 text-caption text-gray-500">{message}</p>}
    </div>
  );
}
