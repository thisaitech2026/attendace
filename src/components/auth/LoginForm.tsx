"use client";

import { useState } from "react";
import { Building2, Loader2 } from "lucide-react";
import { PasswordInput } from "@/components/ui/PasswordInput";

const demoAccounts = [
  { label: "Admin", username: "admin", password: "admin123" },
  { label: "Customer", username: "rajesh", password: "customer123" },
];

interface LoginFormProps {
  error?: string;
}

async function loginRequest(username: string, password: string) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || "Login failed");
  }

  return data as { redirect?: string };
}

export function LoginForm({ error: initialError }: LoginFormProps) {
  const [error, setError] = useState(initialError || "");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (username: string, password: string) => {
    setError("");
    setLoading(true);
    try {
      const data = await loginRequest(username, password);
      window.location.assign(data.redirect || "/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = String(formData.get("username") || "").trim();
    const password = String(formData.get("password") || "");
    if (!username || !password) {
      setError("Please enter username and password.");
      return;
    }
    await handleLogin(username, password);
  };

  return (
    <>
      <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
        <input
          type="text"
          name="prevent_autofill_username"
          tabIndex={-1}
          autoComplete="username"
          aria-hidden="true"
          className="pointer-events-none absolute -left-[9999px] h-0 w-0 opacity-0"
        />
        <input
          type="password"
          name="prevent_autofill_password"
          tabIndex={-1}
          autoComplete="current-password"
          aria-hidden="true"
          className="pointer-events-none absolute -left-[9999px] h-0 w-0 opacity-0"
        />

        <div className="relative space-y-1">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="Enter username"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
            data-lpignore="true"
            data-1p-ignore="true"
            readOnly
            onFocus={(e) => e.currentTarget.removeAttribute("readOnly")}
            disabled={loading}
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-60"
          />
        </div>

        <PasswordInput
          id="password"
          name="password"
          label="Password"
          placeholder="Enter password"
          autoComplete="new-password"
          data-lpignore="true"
          data-1p-ignore="true"
          readOnly
          onFocus={(e) => e.currentTarget.removeAttribute("readOnly")}
          disabled={loading}
          required
        />

        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-60"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? "Signing in..." : "Sign In"}
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
              className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 text-left hover:border-blue-300 hover:bg-blue-50 transition-colors disabled:opacity-60"
            >
              <span className="font-medium text-gray-700">{account.label}</span>
              <span className="font-mono text-gray-500">
                {account.username} / {account.password}
              </span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

export function LoginHeader() {
  return (
    <div className="mb-8 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
        <Building2 className="h-8 w-8 text-blue-600" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900">Rental Manager</h1>
      <p className="mt-1 text-sm text-gray-500">House & Shop Management System</p>
    </div>
  );
}
