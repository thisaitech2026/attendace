"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { PageHeader } from "@/components/native/PageHeader";
import { ListCard, ListStack } from "@/components/native/ListCard";
import { InfoRow, InfoGrid } from "@/components/native/InfoRow";
import { Fab } from "@/components/native/Fab";
import { BottomSheet } from "@/components/native/BottomSheet";
import { LoadingState, EmptyState } from "@/components/native/States";

interface Customer {
  id: string;
  name: string;
  mobile: string;
  email: string;
  address: string;
  aadhaar: string;
  occupation: string;
  emergencyContact: string;
  user?: { username: string };
}

const emptyForm = {
  name: "", mobile: "", email: "", address: "",
  aadhaar: "", occupation: "", emergencyContact: "",
  username: "", password: "", confirmPassword: "",
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [passwordError, setPasswordError] = useState("");

  const load = () => {
    fetch("/api/admin/customers").then((r) => r.json()).then(setCustomers).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setPasswordError(""); setModalOpen(true); };

  const openEdit = (c: Customer) => {
    setEditing(c);
    setForm({
      name: c.name, mobile: c.mobile, email: c.email, address: c.address,
      aadhaar: c.aadhaar, occupation: c.occupation, emergencyContact: c.emergencyContact,
      username: c.user?.username || "", password: "", confirmPassword: "",
    });
    setModalOpen(true);
    setPasswordError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing && form.password !== form.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    if (editing && form.password && form.password !== form.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    setPasswordError("");
    const url = editing ? `/api/admin/customers/${editing.id}` : "/api/admin/customers";
    const payload = { ...form };
    delete (payload as Record<string, string>).confirmPassword;
    if (editing && !form.password) delete (payload as Record<string, string>).password;
    await fetch(url, { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    setModalOpen(false);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this customer?")) return;
    await fetch(`/api/admin/customers/${id}`, { method: "DELETE" });
    load();
  };

  const set = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <div className="pb-20">
      <PageHeader title="Customers" subtitle={`${customers.length} registered customers`} />

      {loading ? (
        <LoadingState />
      ) : customers.length === 0 ? (
        <EmptyState title="No customers yet" message="Tap + Add to register a customer" />
      ) : (
        <ListStack>
          {customers.map((c) => (
            <ListCard
              key={c.id}
              title={c.name}
              subtitle={c.occupation}
              badgeText={c.user?.username || "No login"}
              badgeVariant="info"
              actions={
                <>
                  <Button size="sm" variant="secondary" onClick={() => openEdit(c)}>
                    <Pencil className="h-4 w-4" /> Edit
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(c.id)}>
                    <Trash2 className="h-4 w-4" /> Delete
                  </Button>
                </>
              }
            >
              <InfoGrid>
                <InfoRow label="Mobile" value={c.mobile} />
                <InfoRow label="Email" value={c.email} />
                <InfoRow label="Emergency" value={c.emergencyContact} />
                <InfoRow label="Aadhaar" value={c.aadhaar} />
              </InfoGrid>
            </ListCard>
          ))}
        </ListStack>
      )}

      <Fab onClick={openCreate} label="Add" />

      <BottomSheet open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Customer" : "Add Customer"}>
        <form onSubmit={handleSubmit} className="space-y-4 pb-6">
          <Input label="Customer Name" value={form.name} onChange={(e) => set("name", e.target.value)} required />
          <Input label="Mobile Number" type="tel" value={form.mobile} onChange={(e) => set("mobile", e.target.value)} required />
          <Input label="Email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} required />
          <Input label="Address" value={form.address} onChange={(e) => set("address", e.target.value)} required />
          <Input label="Aadhaar Number" value={form.aadhaar} onChange={(e) => set("aadhaar", e.target.value)} required />
          <Input label="Occupation" value={form.occupation} onChange={(e) => set("occupation", e.target.value)} required />
          <Input label="Emergency Contact" type="tel" value={form.emergencyContact} onChange={(e) => set("emergencyContact", e.target.value)} required />
          <p className="native-section-title">Login Credentials</p>
          <Input label="Username" value={form.username} onChange={(e) => set("username", e.target.value)} required={!editing} />
          <PasswordInput label="Password" value={form.password} onChange={(e) => set("password", e.target.value)} required={!editing} placeholder={editing ? "Leave blank to keep" : ""} />
          <PasswordInput label="Confirm Password" value={form.confirmPassword} onChange={(e) => set("confirmPassword", e.target.value)} required={!editing} error={passwordError} />
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" type="button" className="flex-1" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" className="flex-1">{editing ? "Update" : "Create"}</Button>
          </div>
        </form>
      </BottomSheet>
    </div>
  );
}
