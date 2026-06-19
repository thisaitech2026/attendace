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
      <form action="/api/auth/login" method="POST" autoComplete="off" className="glass-card flex flex-col gap-5">
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
          <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300 leading-relaxed">
            {error}
          </div>
        )}

        <Button type="submit" size="block">Sign In</Button>
      </form>

      <div>
        <p className="native-section-title">Quick login</p>
        <div className="flex flex-col gap-3">
          {demoAccounts.map((account) => (
            <form key={account.username} action="/api/auth/login" method="POST">
              <input type="hidden" name="username" value={account.username} />
              <input type="hidden" name="password" value={account.password} />
              <button
                type="submit"
                className="glass-card flex w-full items-center justify-between gap-3 text-left active:opacity-90"
              >
                <div className="min-w-0">
                  <p className="text-base font-semibold text-foreground">{account.label}</p>
                  <p className="text-sm text-muted mt-0.5">{account.username}</p>
                </div>
                <span className="shrink-0 text-sm font-medium text-primary-light">Sign in</span>
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
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
        <Building2 className="h-8 w-8 text-white" />
      </div>
      <h1 className="text-2xl font-bold text-foreground">Rental Manager</h1>
      <p className="mt-2 text-sm text-muted leading-relaxed px-4">
        House & shop rental management
      </p>
    </div>
  );
}
