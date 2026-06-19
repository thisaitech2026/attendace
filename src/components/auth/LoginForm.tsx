"use client";

import { Building2, Sparkles, Shield, Zap } from "lucide-react";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Button } from "@/components/ui/Button";

const demoAccounts = [
  { label: "Admin", username: "admin", password: "admin123", icon: Shield },
  { label: "Customer", username: "rajesh", password: "customer123", icon: Zap },
];

interface LoginFormProps {
  error?: string;
}

export function LoginForm({ error }: LoginFormProps) {
  return (
    <div className="flex flex-col gap-6 animate-slide-up">
      <form action="/api/auth/login" method="POST" autoComplete="off" className="glass-card flex flex-col gap-5 !p-5">
        <div>
          <label htmlFor="username" className="native-label">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="Enter your username"
            autoComplete="off"
            required
            className="native-input"
          />
        </div>

        <PasswordInput
          id="password"
          name="password"
          label="Password"
          placeholder="Enter your password"
          autoComplete="off"
          required
        />

        {error && (
          <div className="rounded-button border border-red-500/30 bg-red-500/10 px-4 py-3 text-[14px] text-red-300">
            {error}
          </div>
        )}

        <Button type="submit" size="block" variant="glow">
          Sign In
        </Button>
      </form>

      <div>
        <p className="native-section-title">Quick Access</p>
        <div className="flex flex-col gap-2.5">
          {demoAccounts.map((account) => {
            const Icon = account.icon;
            return (
              <form key={account.username} action="/api/auth/login" method="POST">
                <input type="hidden" name="username" value={account.username} />
                <input type="hidden" name="password" value={account.password} />
                <button
                  type="submit"
                  className="glass-card flex w-full items-center gap-3 !p-4 transition-all active:scale-[0.99] hover:border-border-glow"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-premium shadow-glow">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <span className="text-[15px] font-bold text-foreground">{account.label}</span>
                    <p className="text-[12px] text-muted font-mono mt-0.5">{account.username}</p>
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-primary-light">Enter →</span>
                </button>
              </form>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function LoginHeader() {
  return (
    <div className="mb-10 text-center animate-fade-in">
      <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center">
        <div className="absolute inset-0 rounded-3xl bg-gradient-premium opacity-30 blur-2xl animate-pulse-glow" />
        <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-premium shadow-fab ring-1 ring-white/20">
          <Building2 className="h-11 w-11 text-white" />
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 mb-2">
        <Sparkles className="h-4 w-4 text-accent" />
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary-light">Premium Edition</span>
      </div>
      <h1 className="text-display gradient-text">Rental Manager</h1>
      <p className="mt-3 text-caption text-muted max-w-[260px] mx-auto">
        Smart property & rental management at your fingertips
      </p>
    </div>
  );
}
