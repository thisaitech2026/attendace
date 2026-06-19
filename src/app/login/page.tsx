import { LoginForm, LoginHeader } from "@/components/auth/LoginForm";

const errorMessages: Record<string, string> = {
  missing: "Please enter username and password.",
  invalid: "Invalid username or password.",
  server: "Login failed. Run: npm run db:setup",
};

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const error = searchParams.error ? errorMessages[searchParams.error] : "";

  return (
    <div className="app-container relative flex min-h-screen flex-col justify-center px-5 py-10 safe-top safe-bottom">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-accent/15 blur-3xl" />
      </div>
      <div className="relative z-10">
        <LoginHeader />
        <LoginForm error={error} />
      </div>
    </div>
  );
}
