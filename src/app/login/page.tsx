"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Building2, Loader2 } from "lucide-react";
import { loginAction, type LoginState } from "./actions";
import { Input } from "@/components/ui/Input";

const demoAccounts = [
  { label: "Admin", username: "admin", password: "admin123" },
  { label: "Customer", username: "rajesh", password: "customer123" },
];

const initialState: LoginState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Signing in...
        </>
      ) : (
        "Sign In"
      )}
    </button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useFormState(loginAction, initialState);

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

        <form action={formAction} className="space-y-4">
          <Input
            label="Username"
            name="username"
            id="username"
            placeholder="Enter username"
            autoComplete="username"
            required
          />
          <Input
            label="Password"
            name="password"
            id="password"
            type="password"
            placeholder="Enter password"
            autoComplete="current-password"
            required
          />
          {state.error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{state.error}</div>
          )}
          <SubmitButton />
        </form>

        <div className="mt-6 rounded-lg bg-gray-50 p-4 text-xs text-gray-500">
          <p className="font-medium text-gray-700 mb-3">Quick login (one click):</p>
          <div className="space-y-2">
            {demoAccounts.map((account) => (
              <form key={account.username} action={formAction}>
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
      </div>
    </div>
  );
}
