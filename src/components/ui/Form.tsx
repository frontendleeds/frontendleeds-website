"use client";

import { cn } from "@/lib/utils";
import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  UseFormReturn,
} from "react-hook-form";
import { ReactNode } from "react";

interface FormProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  onSubmit: SubmitHandler<T>;
  children: ReactNode;
  className?: string;
}

export function Form<T extends FieldValues>({
  form,
  onSubmit,
  children,
  className,
}: FormProps<T>) {
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-6", className)}>
        {children}
      </form>
    </FormProvider>
  );
}

interface FormFieldProps {
  name: string;
  label?: string;
  children: ReactNode;
  className?: string;
  description?: string;
  error?: string;
}

export function FormField({
  name,
  label,
  children,
  className,
  description,
  error,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label
          htmlFor={name}
          className="text-sm font-medium leading-none text-gray-900 dark:text-gray-100 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </label>
      )}
      {children}
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
      )}
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
