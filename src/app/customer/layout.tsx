import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { AppLayout } from "@/components/layout/Sidebar";

export default async function CustomerLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession();
  if (!user || user.role !== "CUSTOMER") redirect("/login");
  return <AppLayout role="CUSTOMER">{children}</AppLayout>;
}
