"use client";

import { Building2 } from "lucide-react";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Button } from "@/components/ui/Button";

const demoAccounts = [
  { label: "Admin", username: "admin", password: "admin123" },
  { label: "Customer", username: "rajesh", password: "customer123" },
];

interface LoginFormProps {
  error?: string;
}

export function LoginForm({ error }: LoginFormProps) {
  return (
    <div className="flex flex-col gap-6">
      <form action="/api/auth/login" method="POST" autoComplete="off" className="flex flex-col gap-5">
        <div>
          <label htmlFor="username" className="native-label">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="Enter username"
            autoComplete="off"
            required
            className="native-input"
          />
        </div>

        <PasswordInput
          id="password"
          name="password"
          label="Password"
          placeholder="Enter password"
          autoComplete="off"
          required
        />

        {error && (
          <div className="rounded-button bg-red-50 px-4 py-3 text-[14px] text-red-700">{error}</div>
        )}

        <Button type="submit" size="block">Sign In</Button>
      </form>

      <div>
        <p className="native-section-title">Quick Login</p>
        <div className="flex flex-col gap-2">
          {demoAccounts.map((account) => (
            <form key={account.username} action="/api/auth/login" method="POST">
              <input type="hidden" name="username" value={account.username} />
              <input type="hidden" name="password" value={account.password} />
              <button
                type="submit"
                className="native-card flex w-full items-center justify-between active:scale-[0.99] transition-transform"
              >
                <span className="text-[15px] font-semibold text-foreground">{account.label}</span>
                <span className="text-caption text-gray-500 font-mono">
                  {account.username}
                </span>
              </button>
            </form>
          ))}
        </div>
      </div>
    </div>
  );
}

export function LoginHeader() {
  return (
    <div className="mb-8 text-center">
      <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary-container">
        <Building2 className="h-10 w-10 text-primary" />
      </div>
      <h1 className="text-[24px] font-bold text-foreground">Rental Manager</h1>
      <p className="mt-2 text-caption text-gray-500">House & Shop Management</p>
    </div>
  );
}
