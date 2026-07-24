import { PasswordInput } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toastManager } from "@/components/ui/toast";
import { authClient } from "@/lib/auth/client";
import { getFormValues } from "@/lib/form";
import { useRouter } from "next/navigation";
import { useState } from "react";

type SignUpData = {
  name: string;
  email: string;
  password: string;
};

export function SignUpForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const data = getFormValues<SignUpData>(e);
      authClient.signUp.email(data, {
        onError: ({ error }) => {
          toastManager.add({
            title: error.message,
            type: "error",
          });
        },
        onSuccess: () => {
          router.push("/");
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
        <FieldLabel>Name</FieldLabel>
        <Input
          size="lg"
          name="name"
          type="text"
          placeholder="Your name"
          required
        />
      </Field>
      <Field>
        <FieldLabel>Email</FieldLabel>
        <Input
          size="lg"
          name="email"
          type="email"
          placeholder="your@example.com"
          required
        />
      </Field>
      <Field>
        <FieldLabel>Password</FieldLabel>
        <PasswordInput
          name="password"
          placeholder="••••••••"
          minLength={8}
          autoComplete="new-password"
          required
        />
      </Field>
      <Button size="lg" type="submit" className="w-full" loading={loading}>
        Create account
      </Button>
    </form>
  );
}
