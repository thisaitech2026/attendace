"use client";

import { useEffect, useState } from "react";
import { CreditCard, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Card } from "@/components/ui/Card";
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
        body: JSON.stringify({
          rentalId: data.rental.id,
          rentMonth: selectedMonth,
          paymentMethod,
        }),
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

  if (loading) return <div className="text-gray-500">Loading...</div>;

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
          <p className="text-gray-500 mb-4">Transaction ID: <span className="font-mono">{success.transactionId}</span></p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => window.open(`/api/receipts/${success.paymentId}`, "_blank")}>
              Download Receipt
            </Button>
            <Button variant="secondary" onClick={() => { setSuccess(null); window.location.reload(); }}>
              Make Another Payment
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!data?.outstanding || data.outstanding.unpaidMonths.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="page-title">Pay Rent</h1>
        <Card>
          <p className="text-green-600 font-medium">All rent payments are up to date!</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Pay Rent</h1>
        <p className="text-gray-500">Make online payment for your rent</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="Select Payment Details">
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

        <Card title="Payment Summary">
          {selectedDue ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Rent Amount</span>
                  <span>{formatCurrency(selectedDue.rentAmount)}</span>
                </div>
                {selectedDue.fineAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Fine ({selectedDue.lateDays} days)</span>
                    <span className="text-red-600">{formatCurrency(selectedDue.fineAmount)}</span>
                  </div>
                )}
                <hr />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total Payable</span>
                  <span className="text-blue-600">{formatCurrency(selectedDue.totalPayable)}</span>
                </div>
              </div>
              <Button className="w-full" onClick={handlePay} disabled={paying}>
                <CreditCard className="h-4 w-4" />
                {paying ? "Processing..." : `Pay ${formatCurrency(selectedDue.totalPayable)}`}
              </Button>
            </div>
          ) : (
            <p className="text-gray-500">Select a month to pay</p>
          )}
        </Card>
      </div>
    </div>
  );
}
