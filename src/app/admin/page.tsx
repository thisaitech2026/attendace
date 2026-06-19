"use client";

import { useEffect, useState } from "react";
import {
  Building2, Home, Store, Users, AlertTriangle,
  IndianRupee, TrendingUp,
} from "lucide-react";
import { StatCard, Card } from "@/components/ui/Card";
import { Badge, Table } from "@/components/ui/Table";
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
    paymentMethod: string;
    rental: { customer: { name: string }; property: { name: string } };
  }>;
  overdueAccounts: Array<{
    rental: { customer: { name: string }; property: { name: string } };
    totalPayable: number;
    totalFine: number;
    unpaidMonths: Array<{ rentMonth: string }>;
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

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-500">Loading dashboard...</div>;
  if (!data) return <div className="text-red-500">Failed to load dashboard</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500">Overview of your rental management system</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Properties" value={data.totalProperties} icon={<Building2 className="h-6 w-6" />} />
        <StatCard title="Total Houses" value={data.totalHouses} icon={<Home className="h-6 w-6" />} color="bg-green-50 text-green-600" />
        <StatCard title="Total Shops" value={data.totalShops} icon={<Store className="h-6 w-6" />} color="bg-purple-50 text-purple-600" />
        <StatCard title="Occupied" value={data.occupiedProperties} icon={<Users className="h-6 w-6" />} color="bg-orange-50 text-orange-600" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Vacant Properties" value={data.vacantProperties} icon={<Building2 className="h-6 w-6" />} color="bg-gray-50 text-gray-600" />
        <StatCard title="Monthly Collections" value={formatCurrency(data.monthlyCollections)} icon={<IndianRupee className="h-6 w-6" />} color="bg-green-50 text-green-600" />
        <StatCard title="Due Amounts" value={formatCurrency(data.dueAmounts)} icon={<AlertTriangle className="h-6 w-6" />} color="bg-red-50 text-red-600" />
        <StatCard title="Fine Collections" value={formatCurrency(data.fineCollections)} icon={<TrendingUp className="h-6 w-6" />} color="bg-yellow-50 text-yellow-600" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="Recent Payments">
          {data.recentPayments.length === 0 ? (
            <p className="text-gray-500 text-sm">No payments yet</p>
          ) : (
            <Table headers={["Customer", "Property", "Amount", "Date", "Status"]}>
              {data.recentPayments.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-3 text-sm">{p.rental.customer.name}</td>
                  <td className="px-4 py-3 text-sm">{p.rental.property.name}</td>
                  <td className="px-4 py-3 text-sm font-medium">{formatCurrency(p.totalPaid)}</td>
                  <td className="px-4 py-3 text-sm">{formatDate(p.paymentDate)}</td>
                  <td className="px-4 py-3">
                    <Badge variant={p.status === "SUCCESS" ? "success" : p.status === "FAILED" ? "danger" : "warning"}>
                      {p.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </Table>
          )}
        </Card>

        <Card title="Overdue Accounts">
          {data.overdueAccounts.length === 0 ? (
            <p className="text-gray-500 text-sm">No overdue accounts</p>
          ) : (
            <Table headers={["Customer", "Property", "Due Amount", "Fine"]}>
              {data.overdueAccounts.map((a, i) => (
                <tr key={i}>
                  <td className="px-4 py-3 text-sm">{a.rental.customer.name}</td>
                  <td className="px-4 py-3 text-sm">{a.rental.property.name}</td>
                  <td className="px-4 py-3 text-sm font-medium text-red-600">{formatCurrency(a.totalPayable)}</td>
                  <td className="px-4 py-3 text-sm">{formatCurrency(a.totalFine)}</td>
                </tr>
              ))}
            </Table>
          )}
        </Card>
      </div>
    </div>
  );
}
