"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Card } from "@/components/ui/Card";
import { Badge, Table, Modal } from "@/components/ui/Table";
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
    setProperties(p.filter((prop: Property & { status: string }) => prop.status === "VACANT" || true));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm(emptyForm); setModalOpen(true); };

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
    if (!confirm("Terminate this rental mapping?")) return;
    await fetch(`/api/admin/rentals/${id}`, { method: "DELETE" });
    load();
  };

  const set = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rental Mapping</h1>
          <p className="text-gray-500">Map customers to properties</p>
        </div>
        <Button onClick={openCreate}><Plus className="h-4 w-4" /> Map Rental</Button>
      </div>

      <Card>
        {loading ? <p className="text-gray-500">Loading...</p> : (
          <Table headers={["Customer", "Property", "Start Date", "Rent", "Due Day", "Fine/Day", "Status", "Actions"]}>
            {rentals.map((r) => (
              <tr key={r.id}>
                <td className="px-4 py-3 text-sm font-medium">{r.customer.name}</td>
                <td className="px-4 py-3 text-sm">{r.property.name} ({r.property.propertyId})</td>
                <td className="px-4 py-3 text-sm">{formatDate(r.rentStartDate)}</td>
                <td className="px-4 py-3 text-sm">{formatCurrency(r.monthlyRent)}</td>
                <td className="px-4 py-3 text-sm">{r.dueDate}th</td>
                <td className="px-4 py-3 text-sm">{formatCurrency(r.finePerDay)}</td>
                <td className="px-4 py-3">
                  <Badge variant={r.status === "ACTIVE" ? "success" : "default"}>{r.status}</Badge>
                </td>
                <td className="px-4 py-3">
                  {r.status === "ACTIVE" && (
                    <button onClick={() => handleTerminate(r.id)} className="text-red-600 hover:text-red-800">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </Table>
        )}
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Map Customer to Property">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select label="Customer" value={form.customerId} onChange={(e) => set("customerId", e.target.value)} options={[
            { value: "", label: "Select customer" },
            ...customers.map((c) => ({ value: c.id, label: c.name })),
          ]} />
          <Select label="Property" value={form.propertyId} onChange={(e) => handlePropertyChange(e.target.value)} options={[
            { value: "", label: "Select property" },
            ...properties.map((p) => ({ value: p.id, label: `${p.name} (${p.propertyId})` })),
          ]} />
          <Input label="Rent Start Date" type="date" value={form.rentStartDate} onChange={(e) => set("rentStartDate", e.target.value)} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Monthly Rent" type="number" value={form.monthlyRent} onChange={(e) => set("monthlyRent", e.target.value)} required />
            <Input label="Deposit Amount" type="number" value={form.depositAmount} onChange={(e) => set("depositAmount", e.target.value)} required />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Input label="Due Date (day)" type="number" min="1" max="28" value={form.dueDate} onChange={(e) => set("dueDate", e.target.value)} required />
            <Input label="Grace Period (days)" type="number" value={form.gracePeriod} onChange={(e) => set("gracePeriod", e.target.value)} required />
            <Input label="Fine Per Day" type="number" value={form.finePerDay} onChange={(e) => set("finePerDay", e.target.value)} required />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit">Create Mapping</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
