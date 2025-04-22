"use client";

import { Button } from "@/components/ui/Button";
import { Form, FormField } from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export default function SignInForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-6">
      <Form form={form} onSubmit={onSubmit}>
        <FormField
          name="email"
          label="Email"
          error={form.formState.errors.email?.message}
        >
          <Input
            id="email"
            placeholder="name@example.com"
            type="email"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
            disabled={isLoading}
            {...form.register("email")}
          />
        </FormField>
        <FormField
          name="password"
          label="Password"
          error={form.formState.errors.password?.message}
        >
          <Input
            id="password"
            placeholder="••••••••"
            type="password"
            autoComplete="current-password"
            disabled={isLoading}
            {...form.register("password")}
          />
        </FormField>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit" className="w-full" isLoading={isLoading}>
          Sign In
        </Button>
      </Form>
    </div>
  );
}
