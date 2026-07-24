"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toastManager } from "@/components/ui/toast";
import { Field, FieldLabel } from "@/components/ui/field";
import { PasswordInput } from "@/components/shared/password-input";
import { authClient } from "@/lib/auth/client";
import { Spinner } from "@/components/ui/spinner";
import { getFormValues } from "@/lib/form";

type LoginData = {
  email: string;
  password: string;
};

export function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const values = getFormValues<LoginData>(e);

      authClient.signIn.email(values, {
        onSuccess: () => {
          router.push("/");
        },
        onError: ({ error }) => {
          toastManager.add({
            title: error.message,
            type: "error",
          });
        },
      });
    } catch {
      toastManager.add({
        title: "Something went wrong",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field>
        <FieldLabel>Email</FieldLabel>
        <Input
          size="lg"
          type="email"
          name="email"
          placeholder="you@example.com"
          required
        />
      </Field>

      <Field>
        <FieldLabel>Password</FieldLabel>
        <PasswordInput
          size="lg"
          name="password"
          placeholder="••••••••"
          autoComplete="new-password"
          minLength={8}
          max={55}
          required
        />
      </Field>

      <Button size="lg" type="submit" className="w-full" loading={loading}>
        Sign in
      </Button>
    </form>
  );
}
