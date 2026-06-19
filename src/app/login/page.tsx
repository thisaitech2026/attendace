import { LoginForm, LoginHeader } from "@/components/auth/LoginForm";

const errorMessages: Record<string, string> = {
  missing: "Please enter username and password.",
  invalid: "Invalid username or password. Use admin/admin123 or rajesh/customer123",
  server: "Login failed. Run: npm run db:setup",
};

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const error = searchParams.error ? errorMessages[searchParams.error] : "";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <LoginHeader />
        <LoginForm error={error} />
      </div>
    </div>
  );
}
