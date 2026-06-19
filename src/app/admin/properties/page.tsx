"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Card } from "@/components/ui/Card";
import { Badge, Table, Modal } from "@/components/ui/Table";
import { formatCurrency, propertyTypeLabel } from "@/lib/utils";

interface Property {
  id: string;
  propertyId: string;
  name: string;
  address: string;
  description: string | null;
  monthlyRent: number;
  securityDeposit: number;
  status: string;
  type: string;
  utility?: {
    ebServiceNumber: string | null;
    ebConsumerName: string | null;
    waterConnectionNumber: string | null;
    waterConsumerName: string | null;
  };
}

const emptyForm = {
  propertyId: "", name: "", address: "", description: "",
  monthlyRent: "", securityDeposit: "", status: "VACANT", type: "HOUSE",
  ebServiceNumber: "", ebConsumerName: "",
  waterConnectionNumber: "", waterConsumerName: "",
};

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Property | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);

  const load = () => {
    fetch("/api/admin/properties").then((r) => r.json()).then(setProperties).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };

  const openEdit = (p: Property) => {
    setEditing(p);
    setForm({
      propertyId: p.propertyId, name: p.name, address: p.address,
      description: p.description || "", monthlyRent: String(p.monthlyRent),
      securityDeposit: String(p.securityDeposit), status: p.status, type: p.type,
      ebServiceNumber: p.utility?.ebServiceNumber || "",
      ebConsumerName: p.utility?.ebConsumerName || "",
      waterConnectionNumber: p.utility?.waterConnectionNumber || "",
      waterConsumerName: p.utility?.waterConsumerName || "",
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      propertyId: form.propertyId, name: form.name, address: form.address,
      description: form.description || null,
      monthlyRent: parseFloat(form.monthlyRent),
      securityDeposit: parseFloat(form.securityDeposit),
      status: form.status, type: form.type,
      utility: {
        ebServiceNumber: form.ebServiceNumber || null,
        ebConsumerName: form.ebConsumerName || null,
        waterConnectionNumber: form.waterConnectionNumber || null,
        waterConsumerName: form.waterConsumerName || null,
      },
    };

    const url = editing ? `/api/admin/properties/${editing.id}` : "/api/admin/properties";
    const method = editing ? "PUT" : "POST";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    setModalOpen(false);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this property?")) return;
    await fetch(`/api/admin/properties/${id}`, { method: "DELETE" });
    load();
  };

  const set = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Property Management</h1>
          <p className="text-gray-500">Manage houses, apartments, villas, and shops</p>
        </div>
        <Button onClick={openCreate}><Plus className="h-4 w-4" /> Add Property</Button>
      </div>

      <Card>
        {loading ? <p className="text-gray-500">Loading...</p> : (
          <Table headers={["ID", "Name", "Type", "Rent", "Deposit", "Status", "Actions"]}>
            {properties.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3 text-sm font-mono">{p.propertyId}</td>
                <td className="px-4 py-3 text-sm font-medium">{p.name}</td>
                <td className="px-4 py-3 text-sm">{propertyTypeLabel(p.type)}</td>
                <td className="px-4 py-3 text-sm">{formatCurrency(p.monthlyRent)}</td>
                <td className="px-4 py-3 text-sm">{formatCurrency(p.securityDeposit)}</td>
                <td className="px-4 py-3">
                  <Badge variant={p.status === "OCCUPIED" ? "success" : "warning"}>{p.status}</Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(p)} className="text-blue-600 hover:text-blue-800"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:text-red-800"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </Table>
        )}
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Property" : "Add Property"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-grid-2">
            <Input label="Property ID" value={form.propertyId} onChange={(e) => set("propertyId", e.target.value)} required />
            <Input label="Property Name" value={form.name} onChange={(e) => set("name", e.target.value)} required />
          </div>
          <Input label="Address" value={form.address} onChange={(e) => set("address", e.target.value)} required />
          <Input label="Description" value={form.description} onChange={(e) => set("description", e.target.value)} />
          <div className="form-grid-2">
            <Select label="Type" value={form.type} onChange={(e) => set("type", e.target.value)} options={[
              { value: "HOUSE", label: "House" }, { value: "APARTMENT", label: "Apartment" },
              { value: "VILLA", label: "Villa" }, { value: "SHOP", label: "Shop" },
              { value: "COMMERCIAL_UNIT", label: "Commercial Unit" },
            ]} />
            <Select label="Status" value={form.status} onChange={(e) => set("status", e.target.value)} options={[
              { value: "VACANT", label: "Vacant" }, { value: "OCCUPIED", label: "Occupied" },
            ]} />
          </div>
          <div className="form-grid-2">
            <Input label="Monthly Rent" type="number" value={form.monthlyRent} onChange={(e) => set("monthlyRent", e.target.value)} required />
            <Input label="Security Deposit" type="number" value={form.securityDeposit} onChange={(e) => set("securityDeposit", e.target.value)} required />
          </div>
          <hr className="my-2" />
          <p className="text-sm font-medium text-gray-700">Utility Information</p>
          <div className="form-grid-2">
            <Input label="EB Service Number" value={form.ebServiceNumber} onChange={(e) => set("ebServiceNumber", e.target.value)} />
            <Input label="EB Consumer Name" value={form.ebConsumerName} onChange={(e) => set("ebConsumerName", e.target.value)} />
            <Input label="Water Connection Number" value={form.waterConnectionNumber} onChange={(e) => set("waterConnectionNumber", e.target.value)} />
            <Input label="Water Consumer Name" value={form.waterConsumerName} onChange={(e) => set("waterConsumerName", e.target.value)} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit">{editing ? "Update" : "Create"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
