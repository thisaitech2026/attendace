"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { PageHeader } from "@/components/native/PageHeader";
import { ListCard, ListStack } from "@/components/native/ListCard";
import { InfoRow, InfoGrid } from "@/components/native/InfoRow";
import { LoadingState } from "@/components/native/States";
import { SummaryBox } from "@/components/native/SummaryBox";
import { formatCurrency, formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

const reportTypes = [
  { key: "property", label: "Properties" },
  { key: "occupancy", label: "Occupancy" },
  { key: "customer", label: "Customers" },
  { key: "daily", label: "Daily" },
  { key: "monthly", label: "Monthly" },
  { key: "due", label: "Due" },
  { key: "fine", label: "Fines" },
  { key: "outstanding", label: "Outstanding" },
];

export default function ReportsPage() {
  const [activeType, setActiveType] = useState("property");
  const [data, setData] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/reports?type=${activeType}`)
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [activeType]);

  const renderReport = () => {
    if (loading) return <LoadingState message="Loading report..." />;
    if (!data) return <p className="text-red-400 text-center py-6">Failed to load</p>;

    switch (activeType) {
      case "property":
        return (
          <ListStack>
            {(data as Array<{ id: string; propertyId: string; name: string; type: string; status: string; monthlyRent: number; rentals: Array<{ customer: { name: string } }> }>).map((p) => (
              <ListCard key={p.id} title={p.name} subtitle={p.propertyId} badgeText={p.status} badgeVariant={p.status === "OCCUPIED" ? "success" : "warning"}>
                <InfoGrid>
                  <InfoRow label="Type" value={p.type} />
                  <InfoRow label="Rent" value={formatCurrency(p.monthlyRent)} />
                  <InfoRow label="Tenant" value={p.rentals[0]?.customer.name || "Vacant"} className="col-span-2" />
                </InfoGrid>
              </ListCard>
            ))}
          </ListStack>
        );
      case "occupancy": {
        const d = data as { occupied: number; vacant: number; byType: Array<{ type: string; status: string; _count: number }> };
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <SummaryBox label="Occupied" value={d.occupied} variant="success" />
              <SummaryBox label="Vacant" value={d.vacant} variant="warning" />
            </div>
            <ListStack>
              {d.byType.map((item, i) => (
                <ListCard key={i} title={item.type} badgeText={`${item._count}`} badgeVariant="info">
                  <InfoRow label="Status" value={item.status} />
                </ListCard>
              ))}
            </ListStack>
          </div>
        );
      }
      case "customer":
        return (
          <ListStack>
            {(data as Array<{ id: string; name: string; mobile: string; email: string; rentals: Array<{ property: { name: string } }>; user: { username: string } }>).map((c) => (
              <ListCard key={c.id} title={c.name} subtitle={c.user?.username} badgeVariant="info" badgeText="Customer">
                <InfoGrid>
                  <InfoRow label="Mobile" value={c.mobile} />
                  <InfoRow label="Email" value={c.email} />
                  <InfoRow label="Property" value={c.rentals[0]?.property.name || "None"} className="col-span-2" />
                </InfoGrid>
              </ListCard>
            ))}
          </ListStack>
        );
      case "daily": {
        const d = data as { payments: Array<{ id: string; transactionId: string; totalPaid: number; paymentDate: string; rental: { customer: { name: string } } }>; total: number; date: string };
        return (
          <div className="space-y-4">
            <SummaryBox label={d.date} value={formatCurrency(d.total)} variant="success" />
            <ListStack>
              {d.payments.map((p) => (
                <ListCard key={p.id} title={p.rental.customer.name} subtitle={p.transactionId} badgeText={formatCurrency(p.totalPaid)} badgeVariant="success">
                  <InfoRow label="Date" value={formatDate(p.paymentDate)} />
                </ListCard>
              ))}
            </ListStack>
          </div>
        );
      }
      case "monthly": {
        const d = data as { payments: Array<{ id: string; transactionId: string; totalPaid: number; fineAmount: number; rental: { customer: { name: string } } }>; total: number; fineTotal: number; month: string };
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <SummaryBox label={d.month} value={formatCurrency(d.total)} variant="success" />
              <SummaryBox label="Fines" value={formatCurrency(d.fineTotal)} variant="danger" />
            </div>
            <ListStack>
              {d.payments.map((p) => (
                <ListCard key={p.id} title={p.rental.customer.name} subtitle={p.transactionId}>
                  <InfoGrid>
                    <InfoRow label="Paid" value={formatCurrency(p.totalPaid)} />
                    <InfoRow label="Fine" value={formatCurrency(p.fineAmount)} />
                  </InfoGrid>
                </ListCard>
              ))}
            </ListStack>
          </div>
        );
      }
      case "due":
        return (
          <ListStack>
            {(data as Array<{ rental: { customer: { name: string }; property: { name: string } }; totalPayable: number; totalFine: number; unpaidMonths: Array<{ rentMonth: string }> }>).map((d, i) => (
              <ListCard key={i} title={d.rental.customer.name} subtitle={d.rental.property.name} badge={<Badge variant="danger">Due</Badge>}>
                <InfoGrid>
                  <InfoRow label="Outstanding" value={formatCurrency(d.totalPayable)} />
                  <InfoRow label="Fine" value={formatCurrency(d.totalFine)} />
                  <InfoRow label="Unpaid Months" value={d.unpaidMonths.map((m) => m.rentMonth).join(", ")} className="col-span-2" />
                </InfoGrid>
              </ListCard>
            ))}
          </ListStack>
        );
      case "fine": {
        const d = data as { payments: Array<{ id: string; transactionId: string; fineAmount: number; paymentDate: string; rental: { customer: { name: string } } }>; total: number };
        return (
          <div className="space-y-4">
            <SummaryBox label="Total Fines Collected" value={formatCurrency(d.total)} variant="danger" />
            <ListStack>
              {d.payments.map((p) => (
                <ListCard key={p.id} title={p.rental.customer.name} subtitle={p.transactionId} badgeText={formatCurrency(p.fineAmount)} badgeVariant="danger">
                  <InfoRow label="Date" value={formatDate(p.paymentDate)} />
                </ListCard>
              ))}
            </ListStack>
          </div>
        );
      }
      case "outstanding": {
        const d = data as { outstanding: Array<{ rental: { customer: { name: string }; property: { name: string } }; totalPayable: number; totalRent: number; totalFine: number }>; grandTotal: number };
        return (
          <div className="space-y-4">
            <SummaryBox label="Grand Total Outstanding" value={formatCurrency(d.grandTotal)} variant="danger" />
            <ListStack>
              {d.outstanding.map((o, i) => (
                <ListCard key={i} title={o.rental.customer.name} subtitle={o.rental.property.name} badgeText={formatCurrency(o.totalPayable)} badgeVariant="danger">
                  <InfoGrid>
                    <InfoRow label="Rent Due" value={formatCurrency(o.totalRent)} />
                    <InfoRow label="Fine" value={formatCurrency(o.totalFine)} />
                  </InfoGrid>
                </ListCard>
              ))}
            </ListStack>
          </div>
        );
      }
      default:
        return <p>Unknown report type</p>;
    }
  };

  return (
    <div className="space-y-4 pb-4">
      <PageHeader title="Reports" subtitle="View system reports" />

      <div className="flex flex-wrap gap-2">
        {reportTypes.map((rt) => (
          <button
            key={rt.key}
            onClick={() => setActiveType(rt.key)}
            className={cn(
              "filter-chip",
              activeType === rt.key && "filter-chip-active"
            )}
          >
            {rt.label}
          </button>
        ))}
      </div>

      <Card title={reportTypes.find((r) => r.key === activeType)?.label}>
        {renderReport()}
      </Card>
    </div>
  );
}
