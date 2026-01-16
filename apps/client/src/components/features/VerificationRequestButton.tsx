"use client";

import { useState } from "react";
import { Shield, CheckCircle2, XCircle, Clock, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import {
  useGetVerificationStatusQuery,
  useRequestVerificationMutation,
} from "@/store/api/verificationApi";

export default function VerificationRequestButton() {
  const { data: statusData, isLoading } = useGetVerificationStatusQuery();
  const [requestVerification, { isLoading: isRequesting }] = useRequestVerificationMutation();

  const status = statusData?.data;

  const handleRequest = async () => {
    try {
      const result = await requestVerification().unwrap();
      toast.success(result.message);
    } catch (error: any) {
      toast.error(error?.data?.error || "Failed to request verification");
    }
  };

  if (isLoading) {
    return null;
  }

  // Already verified
  if (status?.verified) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/30">
        <CheckCircle2 className="w-5 h-5 text-green-500" />
        <span className="text-sm font-medium text-green-500">Verified</span>
      </div>
    );
  }

  // Request pending
  if (status?.verificationRequested && !status?.verificationRejected) {
    return (
      <div className="flex flex-col gap-2 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-yellow-500" />
          <span className="text-sm font-medium text-yellow-500">Verification Pending</span>
        </div>
        <p className="text-xs text-gray-400">
          Your verification request is being reviewed by our team.
        </p>
      </div>
    );
  }

  // Request rejected
  if (status?.verificationRejected) {
    return (
      <div className="flex flex-col gap-2 p-4 rounded-lg bg-red-500/10 border border-red-500/30">
        <div className="flex items-center gap-2">
          <XCircle className="w-5 h-5 text-red-500" />
          <span className="text-sm font-medium text-red-500">Verification Rejected</span>
        </div>
        {status.verificationRejectedReason && (
          <p className="text-xs text-gray-400">{status.verificationRejectedReason}</p>
        )}
        <button
          onClick={handleRequest}
          disabled={isRequesting}
          className="mt-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-medium hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRequesting ? "Requesting..." : "Request Again"}
        </button>
      </div>
    );
  }

  // Can request verification
  return (
    <div className="flex flex-col gap-3 p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
      <div className="flex items-start gap-3">
        <Shield className="w-5 h-5 text-purple-500 mt-0.5" />
        <div className="flex-1">
          <h4 className="text-sm font-medium text-white mb-1">Get Verified</h4>
          <p className="text-xs text-gray-400 mb-3">
            Complete your profile and accept host terms to request a verification badge.
          </p>
          <button
            onClick={handleRequest}
            disabled={isRequesting}
            className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-medium hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRequesting ? "Requesting..." : "Request Verification"}
          </button>
        </div>
      </div>
    </div>
  );
}
