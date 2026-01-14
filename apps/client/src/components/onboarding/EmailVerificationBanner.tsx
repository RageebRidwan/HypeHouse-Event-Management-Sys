"use client";

import { useState } from "react";
import { Mail, X, RefreshCw } from "lucide-react";
import { useResendVerificationMutation } from "@/store/api/authApi";
import { toast } from "sonner";

interface EmailVerificationBannerProps {
  onDismiss?: () => void;
}

export default function EmailVerificationBanner({ onDismiss }: EmailVerificationBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);
  const [resendVerification, { isLoading }] = useResendVerificationMutation();

  const handleResend = async () => {
    try {
      await resendVerification().unwrap();
      toast.success("Verification email sent! Check your inbox.");
    } catch (error: any) {
      toast.error(error?.data?.error || "Failed to resend verification email");
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.();
  };

  if (isDismissed) return null;

  return (
    <div className="relative backdrop-blur-xl bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-2xl p-4 md:p-6">
      {/* Dismiss Button */}
      <button
        onClick={handleDismiss}
        className="absolute top-4 right-4 p-1 hover:bg-white/10 rounded-lg transition-colors"
        aria-label="Dismiss"
      >
        <X className="w-5 h-5 text-white/70 hover:text-white" />
      </button>

      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        {/* Icon */}
        <div className="flex-shrink-0 p-3 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500">
          <Mail className="w-6 h-6 text-white" />
        </div>

        {/* Content */}
        <div className="flex-1 pr-8 md:pr-0">
          <h3 className="text-lg font-bold text-white mb-1">
            Verify Your Email Address
          </h3>
          <p className="text-sm text-gray-200">
            We sent a verification email to your inbox. Please click the link in the email to verify your account and unlock all features.
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={handleResend}
          disabled={isLoading}
          className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4" />
              Resend Email
            </>
          )}
        </button>
      </div>
    </div>
  );
}
