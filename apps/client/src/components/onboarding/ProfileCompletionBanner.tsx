"use client";

import { useState } from "react";
import { CheckCircle2, Circle, X, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useGetProfileCompletionQuery } from "@/store/api/usersApi";

interface ProfileCompletionBannerProps {
  onDismiss?: () => void;
}

export default function ProfileCompletionBanner({ onDismiss }: ProfileCompletionBannerProps) {
  const router = useRouter();
  const [isDismissed, setIsDismissed] = useState(false);
  const { data, isLoading } = useGetProfileCompletionQuery();

  const profileCompletion = data?.data;

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.();
  };

  const handleCompleteProfile = () => {
    router.push("/profile/edit");
  };

  if (isDismissed || isLoading || !profileCompletion || profileCompletion.isComplete) {
    return null;
  }

  return (
    <div className="relative backdrop-blur-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-2xl p-4 md:p-6">
      {/* Dismiss Button */}
      <button
        onClick={handleDismiss}
        className="absolute top-4 right-4 p-1 hover:bg-white/10 rounded-lg transition-colors"
        aria-label="Dismiss"
      >
        <X className="w-5 h-5 text-white/70 hover:text-white" />
      </button>

      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="pr-8">
          <h3 className="text-lg font-bold text-white mb-1">
            Complete Your Profile to Become a Host
          </h3>
          <p className="text-sm text-gray-200">
            Fill out your profile to start hosting amazing events on Hypehouse!
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-300">Profile Completion</span>
            <span className="font-semibold text-white">
              {profileCompletion.completionPercentage}%
            </span>
          </div>
          <div className="h-3 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
              style={{ width: `${profileCompletion.completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Missing Items */}
        {profileCompletion.missing.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-300">Still needed:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {profileCompletion.missing.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-sm text-gray-200 backdrop-blur-xl bg-white/5 rounded-lg p-2"
                >
                  <Circle className="w-4 h-4 text-blue-400" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div>
          <button
            onClick={handleCompleteProfile}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:shadow-lg hover:shadow-blue-500/50 transition-all"
          >
            Complete Profile
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
