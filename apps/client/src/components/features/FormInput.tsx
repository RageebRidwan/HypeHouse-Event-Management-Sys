"use client";

import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, icon, type = "text", className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);

    const isPasswordField = type === "password";
    const inputType = isPasswordField && showPassword ? "text" : type;

    return (
      <div className="relative w-full">
        {/* Input Container */}
        <div className="relative">
          {/* Icon */}
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              {icon}
            </div>
          )}

          {/* Input Field */}
          <input
            ref={ref}
            type={inputType}
            className={cn(
              "peer w-full rounded-lg border-2 bg-background/50 backdrop-blur-sm px-4 pt-6 pb-2 text-foreground transition-all duration-200",
              icon && "pl-12",
              isPasswordField && "pr-12",
              error
                ? "border-destructive focus:border-destructive focus:ring-destructive"
                : "border-border focus:border-primary focus:ring-2 focus:ring-primary/20",
              "placeholder-transparent",
              className
            )}
            placeholder={label}
            onFocus={() => setIsFocused(true)}
            onBlur={(e) => {
              setIsFocused(false);
              setHasValue(!!e.target.value);
            }}
            onChange={(e) => setHasValue(!!e.target.value)}
            {...props}
          />

          {/* Floating Label */}
          <label
            className={cn(
              "absolute left-4 transition-all duration-200 pointer-events-none",
              icon && "left-12",
              isFocused || hasValue || props.value
                ? "top-2 text-xs text-primary font-medium"
                : "top-1/2 -translate-y-1/2 text-sm text-muted-foreground"
            )}
          >
            {label}
          </label>

          {/* Password Toggle */}
          {isPasswordField && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <p className="mt-1.5 text-sm text-destructive animate-in fade-in slide-in-from-top-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";
