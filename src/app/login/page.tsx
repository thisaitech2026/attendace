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
    <div className="app-container flex min-h-screen flex-col justify-center px-4 py-8 safe-top safe-bottom">
      <LoginHeader />
      <LoginForm error={error} />
    </div>
  );
}
