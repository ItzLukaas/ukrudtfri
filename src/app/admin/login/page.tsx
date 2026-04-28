"use client";

import { Suspense, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const callbackUrl = searchParams.get("callbackUrl") ?? "/admin";

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    startTransition(async () => {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!res || res.error) {
        toast.error("Forkert email eller adgangskode.");
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    });
  }

  return (
    <div className="flex w-full flex-col items-center gap-8">
      <h1 className="text-center text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Admin</h1>

      <div className="w-full rounded-xl border border-border/60 bg-card p-6 shadow-sm sm:p-8">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="admin-email">Email</Label>
            <Input
              id="admin-email"
              type="email"
              name="email"
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10 rounded-lg"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-password">Adgangskode</Label>
            <Input
              id="admin-password"
              type="password"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-10 rounded-lg"
              required
            />
          </div>
          <Button type="submit" className="mt-1 h-10 w-full rounded-lg gap-2" size="default" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Logger ind…
              </>
            ) : (
              <>
                Log ind
                <ArrowRight className="size-4" aria-hidden />
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="h-40 w-full rounded-xl border border-border/60 bg-card/60" />}>
      <AdminLoginForm />
    </Suspense>
  );
}
