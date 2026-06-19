"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { PageHeader } from "@/components/native/PageHeader";
import { ListCard, ListStack } from "@/components/native/ListCard";
import { InfoRow, InfoGrid } from "@/components/native/InfoRow";
import { Fab } from "@/components/native/Fab";
import { BottomSheet } from "@/components/native/BottomSheet";
import { LoadingState, EmptyState } from "@/components/native/States";
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
    await fetch(url, { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
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
    <div className="pb-20">
      <PageHeader title="Properties" subtitle={`${properties.length} total properties`} />

      {loading ? (
        <LoadingState />
      ) : properties.length === 0 ? (
        <EmptyState title="No properties yet" message="Tap + Add to create your first property" />
      ) : (
        <ListStack>
          {properties.map((p) => (
            <ListCard
              key={p.id}
              title={p.name}
              subtitle={`${p.propertyId} · ${propertyTypeLabel(p.type)}`}
              badgeText={p.status}
              badgeVariant={p.status === "OCCUPIED" ? "success" : "warning"}
              actions={
                <>
                  <Button size="sm" variant="secondary" onClick={() => openEdit(p)}>
                    <Pencil className="h-4 w-4" /> Edit
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(p.id)}>
                    <Trash2 className="h-4 w-4" /> Delete
                  </Button>
                </>
              }
            >
              <InfoGrid>
                <InfoRow label="Monthly Rent" value={formatCurrency(p.monthlyRent)} />
                <InfoRow label="Deposit" value={formatCurrency(p.securityDeposit)} />
                <InfoRow label="Address" value={p.address} className="col-span-2" />
              </InfoGrid>
            </ListCard>
          ))}
        </ListStack>
      )}

      <Fab onClick={openCreate} label="Add" />

      <BottomSheet open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Property" : "Add Property"}>
        <form onSubmit={handleSubmit} className="space-y-4 pb-6">
          <Input label="Property ID" value={form.propertyId} onChange={(e) => set("propertyId", e.target.value)} required />
          <Input label="Property Name" value={form.name} onChange={(e) => set("name", e.target.value)} required />
          <Input label="Address" value={form.address} onChange={(e) => set("address", e.target.value)} required />
          <Input label="Description" value={form.description} onChange={(e) => set("description", e.target.value)} />
          <Select label="Type" value={form.type} onChange={(e) => set("type", e.target.value)} options={[
            { value: "HOUSE", label: "House" }, { value: "APARTMENT", label: "Apartment" },
            { value: "VILLA", label: "Villa" }, { value: "SHOP", label: "Shop" },
            { value: "COMMERCIAL_UNIT", label: "Commercial Unit" },
          ]} />
          <Select label="Status" value={form.status} onChange={(e) => set("status", e.target.value)} options={[
            { value: "VACANT", label: "Vacant" }, { value: "OCCUPIED", label: "Occupied" },
          ]} />
          <Input label="Monthly Rent" type="number" value={form.monthlyRent} onChange={(e) => set("monthlyRent", e.target.value)} required />
          <Input label="Security Deposit" type="number" value={form.securityDeposit} onChange={(e) => set("securityDeposit", e.target.value)} required />
          <p className="native-section-title">Utility Information</p>
          <Input label="EB Service Number" value={form.ebServiceNumber} onChange={(e) => set("ebServiceNumber", e.target.value)} />
          <Input label="EB Consumer Name" value={form.ebConsumerName} onChange={(e) => set("ebConsumerName", e.target.value)} />
          <Input label="Water Connection" value={form.waterConnectionNumber} onChange={(e) => set("waterConnectionNumber", e.target.value)} />
          <Input label="Water Consumer" value={form.waterConsumerName} onChange={(e) => set("waterConsumerName", e.target.value)} />
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" type="button" className="flex-1" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" className="flex-1">{editing ? "Update" : "Create"}</Button>
          </div>
        </form>
      </BottomSheet>
    </div>
  );
}
