"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, IndianRupee } from "lucide-react";
import { StatCard, Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Table";
import { formatCurrency, formatDate, propertyTypeLabel } from "@/lib/utils";

interface DashboardData {
  customer: {
    name: string; mobile: string; email: string; address: string;
    occupation: string; emergencyContact: string;
  };
  rental: {
    id: string; monthlyRent: number; dueDate: number; rentStartDate: string;
    property: {
      name: string; address: string; type: string; propertyId: string;
      utility?: {
        ebServiceNumber: string | null; ebConsumerName: string | null;
        waterConnectionNumber: string | null; waterConsumerName: string | null;
      };
    };
  } | null;
  outstanding: {
    totalRent: number; totalFine: number; totalPayable: number;
    unpaidMonths: Array<{
      rentMonth: string; rentAmount: number; fineAmount: number;
      totalPayable: number; isOverdue: boolean; lateDays: number;
    }>;
  } | null;
}

export default function CustomerDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/customer/dashboard")
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-500">Loading...</div>;
  if (!data) return <div className="text-red-500">Failed to load dashboard</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome, {data.customer.name}</h1>
        <p className="text-gray-500">Your rental dashboard</p>
      </div>

      {data.outstanding && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard title="Outstanding Rent" value={formatCurrency(data.outstanding.totalRent)} icon={<IndianRupee className="h-6 w-6" />} color="bg-orange-50 text-orange-600" />
          <StatCard title="Fine Amount" value={formatCurrency(data.outstanding.totalFine)} icon={<AlertTriangle className="h-6 w-6" />} color="bg-red-50 text-red-600" />
          <StatCard title="Total Payable" value={formatCurrency(data.outstanding.totalPayable)} icon={<IndianRupee className="h-6 w-6" />} color="bg-blue-50 text-blue-600" />
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="Your Information">
          <dl className="space-y-3">
            {[
              ["Name", data.customer.name],
              ["Mobile", data.customer.mobile],
              ["Email", data.customer.email],
              ["Address", data.customer.address],
              ["Occupation", data.customer.occupation],
              ["Emergency Contact", data.customer.emergencyContact],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between">
                <dt className="text-sm text-gray-500">{label}</dt>
                <dd className="text-sm font-medium text-gray-900">{value}</dd>
              </div>
            ))}
          </dl>
        </Card>

        {data.rental ? (
          <Card title="Property Information">
            <dl className="space-y-3">
              {[
                ["Property", data.rental.property.name],
                ["Property ID", data.rental.property.propertyId],
                ["Type", propertyTypeLabel(data.rental.property.type)],
                ["Address", data.rental.property.address],
                ["Monthly Rent", formatCurrency(data.rental.monthlyRent)],
                ["Due Date", `${data.rental.dueDate}th of every month`],
                ["Rent Start", formatDate(data.rental.rentStartDate)],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between">
                  <dt className="text-sm text-gray-500">{label}</dt>
                  <dd className="text-sm font-medium text-gray-900">{value}</dd>
                </div>
              ))}
            </dl>
          </Card>
        ) : (
          <Card title="Property Information">
            <p className="text-gray-500 text-sm">No active rental assigned</p>
          </Card>
        )}
      </div>

      {data.outstanding && data.outstanding.unpaidMonths.length > 0 && (
        <Card title="Unpaid Months">
          <div className="space-y-3">
            {data.outstanding.unpaidMonths.map((m) => (
              <div key={m.rentMonth} className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                <div>
                  <p className="font-medium">{m.rentMonth}</p>
                  <p className="text-sm text-gray-500">
                    Rent: {formatCurrency(m.rentAmount)}
                    {m.fineAmount > 0 && ` | Fine: ${formatCurrency(m.fineAmount)} (${m.lateDays} days late)`}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {m.isOverdue && <Badge variant="danger">Overdue</Badge>}
                  <span className="font-bold text-gray-900">{formatCurrency(m.totalPayable)}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
