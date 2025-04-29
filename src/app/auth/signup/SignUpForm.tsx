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

const signUpSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function SignUpForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignUpFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        setError(responseData.message || "Something went wrong");
        return;
      }

      // Sign in the user after successful registration
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Failed to sign in after registration");
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
          name="name"
          label="Name"
          error={form.formState.errors.name?.message}
        >
          <Input
            id="name"
            placeholder="John Doe"
            type="text"
            autoCapitalize="none"
            autoComplete="name"
            autoCorrect="off"
            disabled={isLoading}
            {...form.register("name")}
          />
        </FormField>
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
             autoComplete="new-password"
             disabled={isLoading}
             isPassword // Add this prop to enable the toggle
             {...form.register("password")}
           />
         </FormField>
         <FormField
          name="confirmPassword"
          label="Confirm Password"
          error={form.formState.errors.confirmPassword?.message}
        >
          <Input
            id="confirmPassword"
             placeholder="••••••••"
             type="password"
             autoComplete="new-password"
             disabled={isLoading}
             isPassword // Add this prop to enable the toggle
             {...form.register("confirmPassword")}
           />
        </FormField>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit" className="w-full" isLoading={isLoading}>
          Sign Up
        </Button>
      </Form>
    </div>
  );
}
