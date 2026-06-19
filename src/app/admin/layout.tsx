import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { AppLayout } from "@/components/layout/Sidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession();
  if (!user || user.role !== "ADMIN") redirect("/login");
  return <AppLayout role="ADMIN">{children}</AppLayout>;
}
