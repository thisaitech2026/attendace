"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge, Table } from "@/components/ui/Table";
import { formatCurrency, formatDate } from "@/lib/utils";

const reportTypes = [
  { key: "property", label: "Property Reports" },
  { key: "occupancy", label: "Occupancy Reports" },
  { key: "customer", label: "Customer Reports" },
  { key: "daily", label: "Daily Collections" },
  { key: "monthly", label: "Monthly Collections" },
  { key: "due", label: "Due Reports" },
  { key: "fine", label: "Fine Reports" },
  { key: "outstanding", label: "Outstanding Reports" },
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
    if (loading) return <p className="text-gray-500">Loading report...</p>;
    if (!data) return <p className="text-red-500">Failed to load</p>;

    switch (activeType) {
      case "property":
        return (
          <Table headers={["ID", "Name", "Type", "Status", "Rent", "Tenant"]}>
            {(data as Array<{ id: string; propertyId: string; name: string; type: string; status: string; monthlyRent: number; rentals: Array<{ customer: { name: string } }> }>).map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3 text-sm font-mono">{p.propertyId}</td>
                <td className="px-4 py-3 text-sm">{p.name}</td>
                <td className="px-4 py-3 text-sm">{p.type}</td>
                <td className="px-4 py-3"><Badge variant={p.status === "OCCUPIED" ? "success" : "warning"}>{p.status}</Badge></td>
                <td className="px-4 py-3 text-sm">{formatCurrency(p.monthlyRent)}</td>
                <td className="px-4 py-3 text-sm">{p.rentals[0]?.customer.name || "-"}</td>
              </tr>
            ))}
          </Table>
        );
      case "occupancy": {
        const d = data as { occupied: number; vacant: number; byType: Array<{ type: string; status: string; _count: number }> };
        return (
          <div className="space-y-4">
            <div className="form-grid-2">
              <div className="rounded-lg bg-green-50 p-4"><p className="text-sm text-green-600">Occupied</p><p className="text-2xl font-bold">{d.occupied}</p></div>
              <div className="rounded-lg bg-yellow-50 p-4"><p className="text-sm text-yellow-600">Vacant</p><p className="text-2xl font-bold">{d.vacant}</p></div>
            </div>
            <Table headers={["Type", "Status", "Count"]}>
              {d.byType.map((item, i) => (
                <tr key={i}>
                  <td className="px-4 py-3 text-sm">{item.type}</td>
                  <td className="px-4 py-3 text-sm">{item.status}</td>
                  <td className="px-4 py-3 text-sm font-medium">{item._count}</td>
                </tr>
              ))}
            </Table>
          </div>
        );
      }
      case "customer":
        return (
          <Table headers={["Name", "Mobile", "Email", "Property", "Username"]}>
            {(data as Array<{ id: string; name: string; mobile: string; email: string; rentals: Array<{ property: { name: string } }>; user: { username: string } }>).map((c) => (
              <tr key={c.id}>
                <td className="px-4 py-3 text-sm font-medium">{c.name}</td>
                <td className="px-4 py-3 text-sm">{c.mobile}</td>
                <td className="px-4 py-3 text-sm">{c.email}</td>
                <td className="px-4 py-3 text-sm">{c.rentals[0]?.property.name || "-"}</td>
                <td className="px-4 py-3 text-sm font-mono">{c.user?.username}</td>
              </tr>
            ))}
          </Table>
        );
      case "daily": {
        const d = data as { payments: Array<{ id: string; transactionId: string; totalPaid: number; paymentDate: string; rental: { customer: { name: string } } }>; total: number; date: string };
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">Date: {d.date} | Total: <span className="font-bold text-green-600">{formatCurrency(d.total)}</span></p>
            <Table headers={["Txn ID", "Customer", "Amount", "Date"]}>
              {d.payments.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-3 text-sm font-mono">{p.transactionId}</td>
                  <td className="px-4 py-3 text-sm">{p.rental.customer.name}</td>
                  <td className="px-4 py-3 text-sm">{formatCurrency(p.totalPaid)}</td>
                  <td className="px-4 py-3 text-sm">{formatDate(p.paymentDate)}</td>
                </tr>
              ))}
            </Table>
          </div>
        );
      }
      case "monthly": {
        const d = data as { payments: Array<{ id: string; transactionId: string; totalPaid: number; fineAmount: number; rental: { customer: { name: string } } }>; total: number; fineTotal: number; month: string };
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">Month: {d.month} | Total: <span className="font-bold text-green-600">{formatCurrency(d.total)}</span> | Fines: <span className="font-bold text-red-600">{formatCurrency(d.fineTotal)}</span></p>
            <Table headers={["Txn ID", "Customer", "Amount", "Fine"]}>
              {d.payments.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-3 text-sm font-mono">{p.transactionId}</td>
                  <td className="px-4 py-3 text-sm">{p.rental.customer.name}</td>
                  <td className="px-4 py-3 text-sm">{formatCurrency(p.totalPaid)}</td>
                  <td className="px-4 py-3 text-sm">{formatCurrency(p.fineAmount)}</td>
                </tr>
              ))}
            </Table>
          </div>
        );
      }
      case "due":
        return (
          <Table headers={["Customer", "Property", "Outstanding", "Fine", "Unpaid Months"]}>
            {(data as Array<{ rental: { customer: { name: string }; property: { name: string } }; totalPayable: number; totalFine: number; unpaidMonths: Array<{ rentMonth: string }> }>).map((d, i) => (
              <tr key={i}>
                <td className="px-4 py-3 text-sm">{d.rental.customer.name}</td>
                <td className="px-4 py-3 text-sm">{d.rental.property.name}</td>
                <td className="px-4 py-3 text-sm font-medium text-red-600">{formatCurrency(d.totalPayable)}</td>
                <td className="px-4 py-3 text-sm">{formatCurrency(d.totalFine)}</td>
                <td className="px-4 py-3 text-sm">{d.unpaidMonths.map((m) => m.rentMonth).join(", ")}</td>
              </tr>
            ))}
          </Table>
        );
      case "fine": {
        const d = data as { payments: Array<{ id: string; transactionId: string; fineAmount: number; paymentDate: string; rental: { customer: { name: string } } }>; total: number };
        return (
          <div className="space-y-4">
            <p className="text-sm">Total Fine Collections: <span className="font-bold text-red-600">{formatCurrency(d.total)}</span></p>
            <Table headers={["Txn ID", "Customer", "Fine", "Date"]}>
              {d.payments.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-3 text-sm font-mono">{p.transactionId}</td>
                  <td className="px-4 py-3 text-sm">{p.rental.customer.name}</td>
                  <td className="px-4 py-3 text-sm">{formatCurrency(p.fineAmount)}</td>
                  <td className="px-4 py-3 text-sm">{formatDate(p.paymentDate)}</td>
                </tr>
              ))}
            </Table>
          </div>
        );
      }
      case "outstanding": {
        const d = data as { outstanding: Array<{ rental: { customer: { name: string }; property: { name: string } }; totalPayable: number; totalRent: number; totalFine: number }>; grandTotal: number };
        return (
          <div className="space-y-4">
            <p className="text-sm">Grand Total Outstanding: <span className="font-bold text-red-600">{formatCurrency(d.grandTotal)}</span></p>
            <Table headers={["Customer", "Property", "Rent Due", "Fine", "Total"]}>
              {d.outstanding.map((o, i) => (
                <tr key={i}>
                  <td className="px-4 py-3 text-sm">{o.rental.customer.name}</td>
                  <td className="px-4 py-3 text-sm">{o.rental.property.name}</td>
                  <td className="px-4 py-3 text-sm">{formatCurrency(o.totalRent)}</td>
                  <td className="px-4 py-3 text-sm">{formatCurrency(o.totalFine)}</td>
                  <td className="px-4 py-3 text-sm font-medium text-red-600">{formatCurrency(o.totalPayable)}</td>
                </tr>
              ))}
            </Table>
          </div>
        );
      }
      default:
        return <p>Unknown report type</p>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Reports</h1>
        <p className="text-gray-500">Generate and view system reports</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {reportTypes.map((rt) => (
          <button
            key={rt.key}
            onClick={() => setActiveType(rt.key)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeType === rt.key ? "bg-blue-600 text-white" : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
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
