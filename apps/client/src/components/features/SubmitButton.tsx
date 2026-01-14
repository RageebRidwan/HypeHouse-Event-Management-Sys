"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubmitButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  children: React.ReactNode;
}

export const SubmitButton = ({
  isLoading = false,
  children,
  className,
  disabled,
  ...props
}: SubmitButtonProps) => {
  return (
    <button
      type="submit"
      disabled={disabled || isLoading}
      className={cn(
        "relative w-full py-3 px-6 rounded-lg font-semibold text-white",
        "bg-gradient-to-r from-primary to-secondary",
        "hover:opacity-90 active:scale-[0.98]",
        "transition-all duration-200",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "shadow-lg shadow-primary/25 hover:shadow-primary/40",
        className
      )}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
};
