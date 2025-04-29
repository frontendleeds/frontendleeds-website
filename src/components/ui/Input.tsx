"use client";

import { cn } from "@/lib/utils";
import { forwardRef, InputHTMLAttributes, useState } from "react";
import { Button } from "./Button"; 

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  // Add a prop to specifically enable the toggle for password fields
  isPassword?: boolean;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, isPassword, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword((prev) => !prev);
    };

    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className="relative flex items-center">
        <input
          type={inputType}
          className={cn(
            "flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50",
            // Add padding to the right if it's a password field to make space for the button
            isPassword ? "pr-10" : "",
            className
          )}
          ref={ref}
          {...props}
        />
        {isPassword && (
          <Button
            type="button" // Prevent form submission
            variant="ghost" // Use a less intrusive button style
            size="sm" // Smaller button size
            className="absolute px-1 right-1 h-7 w-7" // Position inside the input
            onClick={togglePasswordVisibility}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {/* Simple text/emoji icons for now */}
            {showPassword ? "👁️‍🗨️" : "👁️"}
          </Button>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
