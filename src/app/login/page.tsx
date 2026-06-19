"use client";

import { useState } from "react";
import { Building2, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/Input";

const demoAccounts = [
  { label: "Admin", username: "admin", password: "admin123", redirect: "/admin" },
  { label: "Customer", username: "rajesh", password: "customer123", redirect: "/customer" },
];

async function performLogin(username: string, password: string): Promise<{ ok: boolean; error?: string; redirect?: string }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username.trim(), password }),
      signal: controller.signal,
      credentials: "same-origin",
    });

    clearTimeout(timeout);

    let data: { error?: string; redirect?: string } = {};
    try {
      data = await res.json();
    } catch {
      return { ok: false, error: "Server error. Run: npm run db:setup" };
    }

    if (!res.ok) {
      return { ok: false, error: data.error || "Login failed" };
    }

    return { ok: true, redirect: data.redirect };
  } catch (err) {
    clearTimeout(timeout);
    if (err instanceof Error && err.name === "AbortError") {
      return { ok: false, error: "Request timed out. Please try again." };
    }
    return { ok: false, error: "Connection error. Make sure the server is running." };
  }
}

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (user: string, pass: string) => {
    setLoading(true);
    setError("");

    const result = await performLogin(user, pass);

    if (!result.ok) {
      setError(result.error || "Login failed");
      setLoading(false);
      return;
    }

    if (result.redirect) {
      window.location.replace(result.redirect);
      return;
    }

    setLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin(username, password);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
            <Building2 className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Rental Manager</h1>
          <p className="mt-1 text-sm text-gray-500">House & Shop Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            autoComplete="username"
            disabled={loading}
            required
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            autoComplete="current-password"
            disabled={loading}
            required
          />
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="mt-6 rounded-lg bg-gray-50 p-4 text-xs text-gray-500">
          <p className="font-medium text-gray-700 mb-3">Quick login (one click):</p>
          <div className="space-y-2">
            {demoAccounts.map((account) => (
              <button
                key={account.username}
                type="button"
                disabled={loading}
                onClick={() => handleLogin(account.username, account.password)}
                className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 text-left hover:border-blue-300 hover:bg-blue-50 transition-colors disabled:opacity-50"
              >
                <span className="font-medium text-gray-700">{account.label}</span>
                <span className="font-mono text-gray-500">
                  {account.username} / {account.password}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
