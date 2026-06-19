"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge, Table } from "@/components/ui/Table";
import { formatCurrency, formatDate, paymentMethodLabel } from "@/lib/utils";

interface Payment {
  id: string;
  transactionId: string;
  paymentDate: string;
  rentMonth: string;
  rentAmount: number;
  fineAmount: number;
  totalPaid: number;
  status: string;
  paymentMethod: string;
  rental: { property: { name: string } };
}

export default function PaymentHistoryPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/customer/payments")
      .then((r) => r.json())
      .then(setPayments)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Payment History</h1>
        <p className="text-gray-500">View all your past payments and download receipts</p>
      </div>

      <Card>
        {loading ? <p className="text-gray-500">Loading...</p> : payments.length === 0 ? (
          <p className="text-gray-500">No payment history yet</p>
        ) : (
          <Table headers={["Transaction ID", "Date", "Rent Month", "Rent", "Fine", "Total", "Method", "Status", "Receipt"]}>
            {payments.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3 text-sm font-mono">{p.transactionId}</td>
                <td className="px-4 py-3 text-sm">{formatDate(p.paymentDate)}</td>
                <td className="px-4 py-3 text-sm">{p.rentMonth}</td>
                <td className="px-4 py-3 text-sm">{formatCurrency(p.rentAmount)}</td>
                <td className="px-4 py-3 text-sm">{formatCurrency(p.fineAmount)}</td>
                <td className="px-4 py-3 text-sm font-medium">{formatCurrency(p.totalPaid)}</td>
                <td className="px-4 py-3 text-sm">{paymentMethodLabel(p.paymentMethod)}</td>
                <td className="px-4 py-3">
                  <Badge variant={p.status === "SUCCESS" ? "success" : p.status === "FAILED" ? "danger" : "warning"}>
                    {p.status}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  {p.status === "SUCCESS" && (
                    <a
                      href={`/api/receipts/${p.id}`}
                      target="_blank"
                      className="text-blue-600 hover:text-blue-800"
                      title="Download Receipt"
                    >
                      <Download className="h-4 w-4" />
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </Table>
        )}
      </Card>
    </div>
  );
}
