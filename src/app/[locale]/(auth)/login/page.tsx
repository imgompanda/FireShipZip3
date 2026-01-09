import { AuthForm } from "@/components/features/auth/AuthForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black p-4">
      <AuthForm />
    </div>
  );
}
