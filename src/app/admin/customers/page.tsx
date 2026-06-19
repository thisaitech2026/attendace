"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Table, Modal } from "@/components/ui/Table";

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
  username: "", password: "",
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);

  const load = () => {
    fetch("/api/admin/customers").then((r) => r.json()).then(setCustomers).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };

  const openEdit = (c: Customer) => {
    setEditing(c);
    setForm({
      name: c.name, mobile: c.mobile, email: c.email, address: c.address,
      aadhaar: c.aadhaar, occupation: c.occupation, emergencyContact: c.emergencyContact,
      username: c.user?.username || "", password: "",
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editing ? `/api/admin/customers/${editing.id}` : "/api/admin/customers";
    const method = editing ? "PUT" : "POST";
    const payload = { ...form };
    if (editing && !form.password) delete (payload as Record<string, string>).password;
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
          <p className="text-gray-500">Create and manage customer accounts</p>
        </div>
        <Button onClick={openCreate}><Plus className="h-4 w-4" /> Add Customer</Button>
      </div>

      <Card>
        {loading ? <p className="text-gray-500">Loading...</p> : (
          <Table headers={["Name", "Mobile", "Email", "Occupation", "Username", "Actions"]}>
            {customers.map((c) => (
              <tr key={c.id}>
                <td className="px-4 py-3 text-sm font-medium">{c.name}</td>
                <td className="px-4 py-3 text-sm">{c.mobile}</td>
                <td className="px-4 py-3 text-sm">{c.email}</td>
                <td className="px-4 py-3 text-sm">{c.occupation}</td>
                <td className="px-4 py-3 text-sm font-mono">{c.user?.username}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(c)} className="text-blue-600 hover:text-blue-800"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => handleDelete(c.id)} className="text-red-600 hover:text-red-800"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </Table>
        )}
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Customer" : "Add Customer"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Customer Name" value={form.name} onChange={(e) => set("name", e.target.value)} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Mobile Number" value={form.mobile} onChange={(e) => set("mobile", e.target.value)} required />
            <Input label="Email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} required />
          </div>
          <Input label="Address" value={form.address} onChange={(e) => set("address", e.target.value)} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Aadhaar Number" value={form.aadhaar} onChange={(e) => set("aadhaar", e.target.value)} required />
            <Input label="Occupation" value={form.occupation} onChange={(e) => set("occupation", e.target.value)} required />
          </div>
          <Input label="Emergency Contact" value={form.emergencyContact} onChange={(e) => set("emergencyContact", e.target.value)} required />
          <hr />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Username" value={form.username} onChange={(e) => set("username", e.target.value)} required={!editing} />
            <Input label="Password" type="password" value={form.password} onChange={(e) => set("password", e.target.value)} required={!editing} placeholder={editing ? "Leave blank to keep" : ""} />
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
