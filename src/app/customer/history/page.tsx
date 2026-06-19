"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/native/PageHeader";
import { ListCard, ListStack } from "@/components/native/ListCard";
import { InfoRow, InfoGrid } from "@/components/native/InfoRow";
import { LoadingState, EmptyState } from "@/components/native/States";
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
    <div className="pb-4">
      <PageHeader title="Payment History" subtitle="Your past transactions" />

      {loading ? (
        <LoadingState />
      ) : payments.length === 0 ? (
        <EmptyState title="No payments yet" message="Your payment history will appear here" />
      ) : (
        <ListStack>
          {payments.map((p) => (
            <ListCard
              key={p.id}
              title={p.rentMonth}
              subtitle={p.rental.property.name}
              badgeText={p.status}
              badgeVariant={p.status === "SUCCESS" ? "success" : p.status === "FAILED" ? "danger" : "warning"}
            >
              <InfoGrid>
                <InfoRow label="Amount" value={formatCurrency(p.totalPaid)} />
                <InfoRow label="Date" value={formatDate(p.paymentDate)} />
                <InfoRow label="Rent" value={formatCurrency(p.rentAmount)} />
                <InfoRow label="Fine" value={formatCurrency(p.fineAmount)} />
                <InfoRow label="Method" value={paymentMethodLabel(p.paymentMethod)} className="col-span-2" />
                <InfoRow label="Txn ID" value={p.transactionId} className="col-span-2" />
              </InfoGrid>
              {p.status === "SUCCESS" && (
                <a href={`/api/receipts/${p.id}`} target="_blank" rel="noopener noreferrer" className="mt-3 block">
                  <Button size="sm" variant="secondary" className="w-full">
                    <Download className="h-4 w-4" /> Download Receipt
                  </Button>
                </a>
              )}
            </ListCard>
          ))}
        </ListStack>
      )}
    </div>
  );
}
