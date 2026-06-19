"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, IndianRupee } from "lucide-react";
import { StatTile, Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ListCard, ListStack } from "@/components/native/ListCard";
import { InfoRow } from "@/components/native/InfoRow";
import { LoadingState } from "@/components/native/States";
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

  if (loading) return <LoadingState />;
  if (!data) return <div className="text-red-400 text-center py-10">Failed to load</div>;

  return (
    <div className="space-y-5">
      <div className="glass-card">
        <p className="text-sm text-muted">Welcome back</p>
        <h1 className="text-xl font-bold text-foreground mt-1 leading-snug break-words">
          Hi, {data.customer.name.split(" ")[0]}
        </h1>
        <p className="text-sm text-muted mt-2 leading-relaxed">Your rental overview</p>
      </div>

      {data.outstanding && (
        <div className="grid grid-cols-1 gap-3">
          <StatTile title="Outstanding Rent" value={formatCurrency(data.outstanding.totalRent)} icon={<IndianRupee className="h-6 w-6" />} accent="amber" />
          <StatTile title="Fine Amount" value={formatCurrency(data.outstanding.totalFine)} icon={<AlertTriangle className="h-6 w-6" />} accent="red" />
          <StatTile title="Total Payable" value={formatCurrency(data.outstanding.totalPayable)} icon={<IndianRupee className="h-6 w-6" />} accent="blue" />
        </div>
      )}

      <Card title="Your Details">
        <div className="space-y-1">
          <InfoRow label="Mobile" value={data.customer.mobile} />
          <InfoRow label="Email" value={data.customer.email} />
          <InfoRow label="Address" value={data.customer.address} />
          <InfoRow label="Occupation" value={data.customer.occupation} />
          <InfoRow label="Emergency" value={data.customer.emergencyContact} />
        </div>
      </Card>

      {data.rental ? (
        <Card title="Your Property">
          <div className="space-y-1">
            <InfoRow label="Property" value={data.rental.property.name} />
            <InfoRow label="Type" value={propertyTypeLabel(data.rental.property.type)} />
            <InfoRow label="Monthly Rent" value={formatCurrency(data.rental.monthlyRent)} />
            <InfoRow label="Due Date" value={`${data.rental.dueDate}th every month`} />
            <InfoRow label="Started" value={formatDate(data.rental.rentStartDate)} />
            <InfoRow label="Address" value={data.rental.property.address} />
          </div>
        </Card>
      ) : (
        <Card title="Your Property">
          <p className="text-sm text-muted">No active rental assigned</p>
        </Card>
      )}

      {data.outstanding && data.outstanding.unpaidMonths.length > 0 && (
        <Card title="Unpaid Months">
          <ListStack className="gap-2">
            {data.outstanding.unpaidMonths.map((m) => (
              <ListCard
                key={m.rentMonth}
                title={m.rentMonth}
                subtitle={`Rent: ${formatCurrency(m.rentAmount)}${m.fineAmount > 0 ? ` · Fine: ${formatCurrency(m.fineAmount)}` : ""}`}
                badge={m.isOverdue ? <Badge variant="danger">Overdue</Badge> : undefined}
                badgeText={!m.isOverdue ? formatCurrency(m.totalPayable) : undefined}
                badgeVariant="warning"
              >
                {m.isOverdue && <InfoRow label="Total Due" value={formatCurrency(m.totalPayable)} />}
              </ListCard>
            ))}
          </ListStack>
        </Card>
      )}
    </div>
  );
}
