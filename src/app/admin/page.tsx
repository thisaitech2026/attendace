"use client";

import { useEffect, useState } from "react";
import {
  Building2, Home, Store, Users, AlertTriangle,
  IndianRupee, TrendingUp,
} from "lucide-react";
import { StatTile, Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { PageHeader } from "@/components/native/PageHeader";
import { ListCard, ListStack } from "@/components/native/ListCard";
import { InfoRow, InfoGrid } from "@/components/native/InfoRow";
import { LoadingState } from "@/components/native/States";
import { formatCurrency, formatDate } from "@/lib/utils";

interface DashboardData {
  totalProperties: number;
  totalHouses: number;
  totalShops: number;
  occupiedProperties: number;
  vacantProperties: number;
  monthlyCollections: number;
  fineCollections: number;
  dueAmounts: number;
  recentPayments: Array<{
    id: string;
    transactionId: string;
    paymentDate: string;
    totalPaid: number;
    status: string;
    rental: { customer: { name: string }; property: { name: string } };
  }>;
  overdueAccounts: Array<{
    rental: { customer: { name: string }; property: { name: string } };
    totalPayable: number;
    totalFine: number;
  }>;
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState message="Loading dashboard..." />;
  if (!data) return <div className="text-red-600 text-center py-10">Failed to load dashboard</div>;

  return (
    <div className="space-y-5 pb-4">
      <PageHeader title="Dashboard" subtitle="Rental overview" />

      <div className="grid grid-cols-2 gap-3">
        <StatTile title="Properties" value={data.totalProperties} icon={<Building2 className="h-6 w-6" />} />
        <StatTile title="Occupied" value={data.occupiedProperties} icon={<Users className="h-6 w-6" />} accent="green" />
        <StatTile title="Houses" value={data.totalHouses} icon={<Home className="h-6 w-6" />} accent="purple" />
        <StatTile title="Shops" value={data.totalShops} icon={<Store className="h-6 w-6" />} accent="amber" />
        <StatTile title="Collections" value={formatCurrency(data.monthlyCollections)} icon={<IndianRupee className="h-6 w-6" />} accent="green" />
        <StatTile title="Due Amount" value={formatCurrency(data.dueAmounts)} icon={<AlertTriangle className="h-6 w-6" />} accent="red" />
        <StatTile title="Vacant" value={data.vacantProperties} icon={<Building2 className="h-6 w-6" />} accent="gray" />
        <StatTile title="Fines" value={formatCurrency(data.fineCollections)} icon={<TrendingUp className="h-6 w-6" />} accent="amber" />
      </div>

      <Card title="Recent Payments">
        {data.recentPayments.length === 0 ? (
          <p className="text-caption text-gray-500">No payments yet</p>
        ) : (
          <ListStack className="gap-2">
            {data.recentPayments.map((p) => (
              <ListCard
                key={p.id}
                title={p.rental.customer.name}
                subtitle={p.rental.property.name}
                badgeText={p.status}
                badgeVariant={p.status === "SUCCESS" ? "success" : p.status === "FAILED" ? "danger" : "warning"}
              >
                <InfoGrid>
                  <InfoRow label="Amount" value={formatCurrency(p.totalPaid)} />
                  <InfoRow label="Date" value={formatDate(p.paymentDate)} />
                </InfoGrid>
              </ListCard>
            ))}
          </ListStack>
        )}
      </Card>

      <Card title="Overdue Accounts">
        {data.overdueAccounts.length === 0 ? (
          <p className="text-caption text-gray-500">No overdue accounts</p>
        ) : (
          <ListStack className="gap-2">
            {data.overdueAccounts.map((a, i) => (
              <ListCard
                key={i}
                title={a.rental.customer.name}
                subtitle={a.rental.property.name}
                badge={<Badge variant="danger">Overdue</Badge>}
              >
                <InfoGrid>
                  <InfoRow label="Due Amount" value={formatCurrency(a.totalPayable)} />
                  <InfoRow label="Fine" value={formatCurrency(a.totalFine)} />
                </InfoGrid>
              </ListCard>
            ))}
          </ListStack>
        )}
      </Card>
    </div>
  );
}
