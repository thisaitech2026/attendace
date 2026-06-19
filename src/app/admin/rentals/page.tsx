"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { PageHeader } from "@/components/native/PageHeader";
import { ListCard, ListStack } from "@/components/native/ListCard";
import { InfoRow, InfoGrid } from "@/components/native/InfoRow";
import { Fab } from "@/components/native/Fab";
import { BottomSheet } from "@/components/native/BottomSheet";
import { LoadingState, EmptyState } from "@/components/native/States";
import { formatCurrency, formatDate } from "@/lib/utils";

interface Rental {
  id: string;
  rentStartDate: string;
  monthlyRent: number;
  dueDate: number;
  gracePeriod: number;
  finePerDay: number;
  depositAmount: number;
  status: string;
  customer: { id: string; name: string };
  property: { id: string; name: string; propertyId: string };
}

interface Customer { id: string; name: string }
interface Property { id: string; name: string; propertyId: string; monthlyRent: number; securityDeposit: number }

const emptyForm = {
  customerId: "", propertyId: "", rentStartDate: "",
  monthlyRent: "", dueDate: "5", gracePeriod: "5",
  finePerDay: "50", depositAmount: "",
};

export default function RentalsPage() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const [r, c, p] = await Promise.all([
      fetch("/api/admin/rentals").then((res) => res.json()),
      fetch("/api/admin/customers").then((res) => res.json()),
      fetch("/api/admin/properties").then((res) => res.json()),
    ]);
    setRentals(r);
    setCustomers(c);
    setProperties(p);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handlePropertyChange = (propertyId: string) => {
    const prop = properties.find((p) => p.id === propertyId);
    setForm((f) => ({
      ...f,
      propertyId,
      monthlyRent: prop ? String(prop.monthlyRent) : f.monthlyRent,
      depositAmount: prop ? String(prop.securityDeposit) : f.depositAmount,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/admin/rentals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerId: form.customerId,
        propertyId: form.propertyId,
        rentStartDate: form.rentStartDate,
        monthlyRent: parseFloat(form.monthlyRent),
        dueDate: parseInt(form.dueDate),
        gracePeriod: parseInt(form.gracePeriod),
        finePerDay: parseFloat(form.finePerDay),
        depositAmount: parseFloat(form.depositAmount),
      }),
    });
    setModalOpen(false);
    load();
  };

  const handleTerminate = async (id: string) => {
    if (!confirm("Terminate this rental?")) return;
    await fetch(`/api/admin/rentals/${id}`, { method: "DELETE" });
    load();
  };

  const set = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <div className="page-content-fab">
      <PageHeader title="Rentals" subtitle="Customer to property mappings" />

      {loading ? (
        <LoadingState />
      ) : rentals.length === 0 ? (
        <EmptyState title="No rentals yet" message="Map a customer to a property" />
      ) : (
        <ListStack>
          {rentals.map((r) => (
            <ListCard
              key={r.id}
              title={r.customer.name}
              subtitle={r.property.name}
              badgeText={r.status}
              badgeVariant={r.status === "ACTIVE" ? "success" : "default"}
              actions={
                r.status === "ACTIVE" ? (
                  <Button size="sm" variant="danger" className="w-full" onClick={() => handleTerminate(r.id)}>
                    <Trash2 className="h-4 w-4" /> Terminate
                  </Button>
                ) : undefined
              }
            >
              <InfoGrid>
                <InfoRow label="Property ID" value={r.property.propertyId} />
                <InfoRow label="Start Date" value={formatDate(r.rentStartDate)} />
                <InfoRow label="Monthly Rent" value={formatCurrency(r.monthlyRent)} />
                <InfoRow label="Due Day" value={`${r.dueDate}th of month`} />
                <InfoRow label="Fine / Day" value={formatCurrency(r.finePerDay)} />
                <InfoRow label="Deposit" value={formatCurrency(r.depositAmount)} />
              </InfoGrid>
            </ListCard>
          ))}
        </ListStack>
      )}

      <Fab onClick={() => { setForm(emptyForm); setModalOpen(true); }} label="Map" />

      <BottomSheet open={modalOpen} onClose={() => setModalOpen(false)} title="Map Customer to Property">
        <form onSubmit={handleSubmit} className="space-y-4 pb-6">
          <Select label="Customer" value={form.customerId} onChange={(e) => set("customerId", e.target.value)} options={[
            { value: "", label: "Select customer" },
            ...customers.map((c) => ({ value: c.id, label: c.name })),
          ]} />
          <Select label="Property" value={form.propertyId} onChange={(e) => handlePropertyChange(e.target.value)} options={[
            { value: "", label: "Select property" },
            ...properties.map((p) => ({ value: p.id, label: `${p.name} (${p.propertyId})` })),
          ]} />
          <Input label="Rent Start Date" type="date" value={form.rentStartDate} onChange={(e) => set("rentStartDate", e.target.value)} required />
          <Input label="Monthly Rent" type="number" value={form.monthlyRent} onChange={(e) => set("monthlyRent", e.target.value)} required />
          <Input label="Deposit Amount" type="number" value={form.depositAmount} onChange={(e) => set("depositAmount", e.target.value)} required />
          <Input label="Due Date (day of month)" type="number" min="1" max="28" value={form.dueDate} onChange={(e) => set("dueDate", e.target.value)} required />
          <Input label="Grace Period (days)" type="number" value={form.gracePeriod} onChange={(e) => set("gracePeriod", e.target.value)} required />
          <Input label="Fine Per Day" type="number" value={form.finePerDay} onChange={(e) => set("finePerDay", e.target.value)} required />
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" type="button" className="flex-1" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" className="flex-1">Create</Button>
          </div>
        </form>
      </BottomSheet>
    </div>
  );
}
