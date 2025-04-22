"use client";

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "link" | "destructive";
  size?: "default" | "sm" | "lg";
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant = "default",
      size = "default",
      isLoading = false,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          {
            "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800": variant === "default",
            "bg-transparent border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800":
              variant === "outline",
            "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800": variant === "ghost",
            "bg-transparent underline-offset-4 hover:underline text-blue-600 dark:text-blue-400":
              variant === "link",
            "bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800": variant === "destructive",
            "h-10 py-2 px-4": size === "default",
            "h-8 py-1 px-3 text-sm": size === "sm",
            "h-12 py-3 px-6 text-lg": size === "lg",
          },
          className
        )}
        ref={ref}
        disabled={isLoading || disabled}
        {...props}
      >
        {isLoading ? (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
