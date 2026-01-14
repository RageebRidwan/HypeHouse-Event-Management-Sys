"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Mail, Lock, User, Sparkles } from "lucide-react";
import { FormInput } from "@/components/features/FormInput";
import { SubmitButton } from "@/components/features/SubmitButton";
import { useRegister } from "@/hooks/useAuth";
import { selectIsAuthenticated } from "@/store/slices/authSlice";
import { registerSchema, type RegisterFormData } from "@/lib/validations/auth";

export default function RegisterPage() {
  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { register: registerUser, isLoading } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const onSubmit = async (data: RegisterFormData) => {
    await registerUser(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 via-background to-primary/20" />

      {/* Floating Orbs */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-secondary/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />

      {/* Register Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Glassmorphism Card */}
        <div className="bg-card/40 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-secondary to-primary mb-4 shadow-lg"
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent"
            >
              Join Hypehouse
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-muted-foreground mt-2"
            >
              Create your account and start connecting
            </motion.p>
          </div>

          {/* Register Form */}
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {/* Name Field */}
            <FormInput
              label="Full Name"
              type="text"
              icon={<User className="w-5 h-5" />}
              error={errors.name?.message}
              {...register("name")}
            />

            {/* Email Field */}
            <FormInput
              label="Email Address"
              type="email"
              icon={<Mail className="w-5 h-5" />}
              error={errors.email?.message}
              {...register("email")}
            />

            {/* Password Field */}
            <FormInput
              label="Password"
              type="password"
              icon={<Lock className="w-5 h-5" />}
              error={errors.password?.message}
              {...register("password")}
            />

            {/* Confirm Password Field */}
            <FormInput
              label="Confirm Password"
              type="password"
              icon={<Lock className="w-5 h-5" />}
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
            />

            {/* Submit Button */}
            <SubmitButton isLoading={isLoading}>
              Create Account
            </SubmitButton>
          </motion.form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/50" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-card/40 text-muted-foreground">
                Already have an account?
              </span>
            </div>
          </div>

          {/* Login Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-center"
          >
            <Link
              href="/login"
              className="text-sm text-foreground hover:text-primary transition-colors font-medium"
            >
              Sign in instead →
            </Link>
          </motion.div>
        </div>

        {/* Bottom Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-sm text-muted-foreground mt-6"
        >
          By creating an account, you agree to our{" "}
          <Link href="/terms" className="text-primary hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
