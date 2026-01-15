"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Loader2, Mail, Sparkles } from "lucide-react";
import Link from "next/link";
import { useVerifyEmailMutation } from "@/store/api/authApi";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [verifyEmail, { isLoading, isSuccess, isError, error }] =
    useVerifyEmailMutation();

  const [verificationStatus, setVerificationStatus] = useState<
    "verifying" | "success" | "error"
  >("verifying");

  useEffect(() => {
    if (!token) {
      setVerificationStatus("error");
      return;
    }

    // Verify email on mount
    verifyEmail(token)
      .unwrap()
      .then(() => {
        setVerificationStatus("success");
      })
      .catch(() => {
        setVerificationStatus("error");
      });
  }, [token, verifyEmail]);

  const getErrorMessage = () => {
    if (!token) {
      return "No verification token provided";
    }
    if (error && "data" in error) {
      return (error.data as any)?.error || "Verification failed";
    }
    return "An unexpected error occurred";
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20" />

      {/* Floating Orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-primary/30 rounded-full blur-3xl animate-pulse" />
      <div
        className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      />

      {/* Verification Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Glassmorphism Card */}
        <div className="bg-card/40 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl p-8">
          {/* Header Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex justify-center mb-6"
          >
            {verificationStatus === "verifying" && (
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary shadow-lg">
                <Loader2 className="w-10 h-10 text-white animate-spin" />
              </div>
            )}
            {verificationStatus === "success" && (
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
            )}
            {verificationStatus === "error" && (
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-rose-500 shadow-lg">
                <XCircle className="w-10 h-10 text-white" />
              </div>
            )}
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            {/* Verifying State */}
            {verificationStatus === "verifying" && (
              <>
                <h1 className="text-2xl font-bold text-foreground mb-3">
                  Verifying Your Email
                </h1>
                <p className="text-muted-foreground">
                  Please wait while we verify your email address...
                </p>
              </>
            )}

            {/* Success State */}
            {verificationStatus === "success" && (
              <>
                <h1 className="text-2xl font-bold text-foreground mb-3">
                  Email Verified Successfully!
                </h1>
                <p className="text-muted-foreground mb-6">
                  Your email has been verified. You can now access all features
                  of Hypehouse.
                </p>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Link href="/dashboard">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      Go to Dashboard
                    </motion.button>
                  </Link>

                  <Link href="/events">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3 px-6 rounded-xl border border-border/50 text-foreground font-medium hover:bg-accent/50 transition-all duration-200"
                    >
                      Browse Events
                    </motion.button>
                  </Link>
                </div>
              </>
            )}

            {/* Error State */}
            {verificationStatus === "error" && (
              <>
                <h1 className="text-2xl font-bold text-foreground mb-3">
                  Verification Failed
                </h1>
                <p className="text-muted-foreground mb-6">
                  {getErrorMessage()}
                </p>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Link href="/dashboard">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      Go to Dashboard
                    </motion.button>
                  </Link>

                  <Link href="/login">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3 px-6 rounded-xl border border-border/50 text-foreground font-medium hover:bg-accent/50 transition-all duration-200"
                    >
                      Back to Login
                    </motion.button>
                  </Link>
                </div>
              </>
            )}
          </motion.div>
        </div>

        {/* Help Text */}
        {verificationStatus === "error" && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-sm text-muted-foreground mt-6"
          >
            Need help?{" "}
            <Link href="/support" className="text-primary hover:underline">
              Contact Support
            </Link>
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
