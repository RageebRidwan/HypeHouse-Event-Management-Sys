"use client";

import { useState } from "react";
import { Shield, X } from "lucide-react";
import HostTermsModal from "./HostTermsModal";

interface HostTermsBannerProps {
  onDismiss?: () => void;
}

export default function HostTermsBanner({ onDismiss }: HostTermsBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.();
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  if (isDismissed) return null;

  return (
    <>
      <div className="relative backdrop-blur-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-2xl p-4 md:p-6">
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
          <div className="flex-shrink-0 p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
            <Shield className="w-6 h-6 text-white" />
          </div>

          {/* Content */}
          <div className="flex-1 pr-8 md:pr-0">
            <h3 className="text-lg font-bold text-white mb-1">
              One Final Step to Become a Host!
            </h3>
            <p className="text-sm text-gray-200">
              Your profile is complete! Accept the Host Terms & Conditions to start creating and hosting amazing events.
            </p>
          </div>

          {/* Action Button */}
          <button
            onClick={handleOpenModal}
            className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium hover:shadow-lg hover:shadow-green-500/50 transition-all"
          >
            <Shield className="w-4 h-4" />
            Review Terms
          </button>
        </div>
      </div>

      {/* Host Terms Modal */}
      <HostTermsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
