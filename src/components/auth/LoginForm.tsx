"use client";

import { Building2 } from "lucide-react";
import { PasswordInput } from "@/components/ui/PasswordInput";

const demoAccounts = [
  { label: "Admin", username: "admin", password: "admin123" },
  { label: "Customer", username: "rajesh", password: "customer123" },
];

interface LoginFormProps {
  error?: string;
}

export function LoginForm({ error }: LoginFormProps) {
  return (
    <>
      <form action="/api/auth/login" method="POST" className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="Enter username"
            autoComplete="username"
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <PasswordInput
          id="password"
          name="password"
          label="Password"
          placeholder="Enter password"
          autoComplete="current-password"
          required
        />

        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
        )}

        <button
          type="submit"
          className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
        >
          Sign In
        </button>
      </form>

      <div className="mt-6 rounded-lg bg-gray-50 p-4 text-xs text-gray-500">
        <p className="font-medium text-gray-700 mb-3">Quick login (one click):</p>
        <div className="space-y-2">
          {demoAccounts.map((account) => (
            <form key={account.username} action="/api/auth/login" method="POST">
              <input type="hidden" name="username" value={account.username} />
              <input type="hidden" name="password" value={account.password} />
              <button
                type="submit"
                className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 text-left hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <span className="font-medium text-gray-700">{account.label}</span>
                <span className="font-mono text-gray-500">
                  {account.username} / {account.password}
                </span>
              </button>
            </form>
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
