"use client";

import { useEffect, useState } from "react";
import { CreditCard, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/native/PageHeader";
import { InfoRow } from "@/components/native/InfoRow";
import { LoadingState } from "@/components/native/States";
import { formatCurrency } from "@/lib/utils";

interface PaymentData {
  rental: { id: string } | null;
  outstanding: {
    unpaidMonths: Array<{
      rentMonth: string; rentAmount: number; fineAmount: number;
      totalPayable: number; isOverdue: boolean; lateDays: number;
    }>;
    totalPayable: number;
  } | null;
}

const paymentMethods = [
  { value: "UPI", label: "UPI" },
  { value: "GOOGLE_PAY", label: "Google Pay" },
  { value: "PHONEPE", label: "PhonePe" },
  { value: "PAYTM", label: "Paytm" },
  { value: "DEBIT_CARD", label: "Debit Card" },
  { value: "CREDIT_CARD", label: "Credit Card" },
  { value: "NET_BANKING", label: "Net Banking" },
];

export default function PaymentsPage() {
  const [data, setData] = useState<PaymentData | null>(null);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [success, setSuccess] = useState<{ transactionId: string; paymentId: string } | null>(null);

  useEffect(() => {
    fetch("/api/customer/dashboard")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        if (d.outstanding?.unpaidMonths?.length > 0) {
          setSelectedMonth(d.outstanding.unpaidMonths[0].rentMonth);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const selectedDue = data?.outstanding?.unpaidMonths.find((m) => m.rentMonth === selectedMonth);

  const handlePay = async () => {
    if (!data?.rental || !selectedMonth) return;
    setPaying(true);
    try {
      const res = await fetch("/api/customer/dashboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rentalId: data.rental.id, rentMonth: selectedMonth, paymentMethod }),
      });
      const payment = await res.json();
      if (res.ok) {
        setSuccess({ transactionId: payment.transactionId, paymentId: payment.id });
      } else {
        alert(payment.error || "Payment failed");
      }
    } catch {
      alert("Payment failed. Please try again.");
    } finally {
      setPaying(false);
    }
  };

  if (loading) return <LoadingState />;

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <CheckCircle className="h-20 w-20 text-emerald-400 mb-4 drop-shadow-lg" />
        <h2 className="text-xl font-bold text-foreground mb-2">Payment Successful!</h2>
        <p className="text-sm text-muted mb-6 break-all">Txn: {success.transactionId}</p>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <Button size="block" onClick={() => window.open(`/api/receipts/${success.paymentId}`, "_blank")}>
            Download Receipt
          </Button>
          <Button size="block" variant="secondary" onClick={() => { setSuccess(null); window.location.reload(); }}>
            Pay Again
          </Button>
        </div>
      </div>
    );
  }

  if (!data?.outstanding || data.outstanding.unpaidMonths.length === 0) {
    return (
      <div>
        <PageHeader title="Pay Rent" />
        <Card>
          <p className="text-emerald-300 font-semibold text-center py-4">All payments are up to date!</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-4">
      <PageHeader title="Pay Rent" subtitle="Select month and pay online" />

      <Card title="Payment Details">
        <div className="space-y-4">
          <Select
            label="Rent Month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            options={data.outstanding.unpaidMonths.map((m) => ({
              value: m.rentMonth,
              label: `${m.rentMonth}${m.isOverdue ? " (Overdue)" : ""}`,
            }))}
          />
          <Select
            label="Payment Method"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            options={paymentMethods}
          />
        </div>
      </Card>

      {selectedDue && (
        <Card title="Summary">
          <div className="space-y-3">
            <InfoRow label="Rent Amount" value={formatCurrency(selectedDue.rentAmount)} />
            {selectedDue.fineAmount > 0 && (
              <InfoRow label={`Fine (${selectedDue.lateDays} days)`} value={formatCurrency(selectedDue.fineAmount)} />
            )}
            <div className="border-t pt-3" style={{ borderColor: "var(--border)" }}>
              <div className="flex justify-between items-center gap-3">
                <span className="text-base font-bold">Total</span>
                <span className="text-xl font-bold text-primary-light break-words">{formatCurrency(selectedDue.totalPayable)}</span>
              </div>
            </div>
            <Button size="block" onClick={handlePay} disabled={paying} className="mt-2">
              <CreditCard className="h-5 w-5" />
              {paying ? "Processing..." : `Pay ${formatCurrency(selectedDue.totalPayable)}`}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
