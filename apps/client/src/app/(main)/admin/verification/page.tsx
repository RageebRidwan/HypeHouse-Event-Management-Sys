"use client";

import { useState } from "react";
import {
  useGetPendingRequestsQuery,
  useApproveVerificationMutation,
  useRejectVerificationMutation,
} from "@/store/api/verificationApi";
import { Shield, CheckCircle, XCircle, Clock, User, MapPin, Star, Calendar, Users } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface RejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  userName: string;
}

function RejectModal({ isOpen, onClose, onConfirm, userName }: RejectModalProps) {
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!reason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    onConfirm(reason);
    setReason("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 max-w-md w-full">
        <h3 className="text-xl font-bold text-white mb-4">
          Reject Verification Request
        </h3>
        <p className="text-gray-300 mb-4">
          You are about to reject the verification request from <span className="font-semibold text-white">{userName}</span>.
          Please provide a reason:
        </p>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g., Profile does not meet quality standards, suspicious activity, etc."
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 min-h-[120px] resize-none"
        />
        <div className="flex gap-3 mt-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-pink-600 text-white font-medium hover:shadow-lg hover:shadow-red-500/50 transition-all"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}

export default function VerificationRequestsPage() {
  const { data, isLoading, error } = useGetPendingRequestsQuery();
  const [approveVerification, { isLoading: isApproving }] = useApproveVerificationMutation();
  const [rejectVerification, { isLoading: isRejecting }] = useRejectVerificationMutation();

  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{ id: string; name: string } | null>(null);

  const requests = data?.data || [];

  const handleApprove = async (userId: string, userName: string) => {
    try {
      await approveVerification(userId).unwrap();
      toast.success(`${userName} has been verified successfully`);
    } catch (error: any) {
      toast.error(error?.data?.error || "Failed to approve verification");
    }
  };

  const handleRejectClick = (userId: string, userName: string) => {
    setSelectedUser({ id: userId, name: userName });
    setRejectModalOpen(true);
  };

  const handleRejectConfirm = async (reason: string) => {
    if (!selectedUser) return;

    try {
      await rejectVerification({ userId: selectedUser.id, reason }).unwrap();
      toast.success(`Verification request from ${selectedUser.name} has been rejected`);
      setRejectModalOpen(false);
      setSelectedUser(null);
    } catch (error: any) {
      toast.error(error?.data?.error || "Failed to reject verification");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-400 text-lg">Failed to load verification requests</p>
          <p className="text-gray-400 text-sm mt-2">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-8 h-8 text-purple-400" />
          <h1 className="text-4xl font-bold text-white">Verification Requests</h1>
        </div>
        <p className="text-gray-300">
          Review and manage user verification requests
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-yellow-500/20">
              <Clock className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Pending Requests</p>
              <p className="text-2xl font-bold text-white">{requests.length}</p>
            </div>
          </div>
        </div>

        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-purple-500/20">
              <Shield className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Oldest Request</p>
              <p className="text-lg font-bold text-white">
                {requests.length > 0
                  ? new Date(requests[0].verificationRequestedAt).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>

        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-blue-500/20">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Events Hosted</p>
              <p className="text-2xl font-bold text-white">
                {requests.reduce((sum, r) => sum + r._count.eventsHosted, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Requests List */}
      {requests.length === 0 ? (
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-12 text-center">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">All Caught Up!</h3>
          <p className="text-gray-300">
            There are no pending verification requests at the moment.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {requests.map((request) => (
            <div
              key={request.id}
              className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all"
            >
              <div className="flex flex-col lg:flex-row gap-6">
                {/* User Info */}
                <div className="flex-1">
                  <div className="flex items-start gap-4 mb-4">
                    {request.avatar ? (
                      <Image
                        src={request.avatar}
                        alt={request.name}
                        width={64}
                        height={64}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                        <User className="w-8 h-8 text-white" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-1">
                        {request.name}
                      </h3>
                      <p className="text-gray-400 text-sm mb-2">{request.email}</p>
                      <div className="flex flex-wrap gap-2">
                        {request.location && (
                          <div className="flex items-center gap-1 px-3 py-1 rounded-lg bg-white/5 border border-white/10">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-300">{request.location}</span>
                          </div>
                        )}
                        {request.rating && request.rating > 0 && (
                          <div className="flex items-center gap-1 px-3 py-1 rounded-lg bg-white/5 border border-white/10">
                            <Star className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm text-white font-medium">
                              {request.rating.toFixed(1)}
                            </span>
                            <span className="text-sm text-gray-400">
                              ({request.reviewCount} reviews)
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  {request.bio && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-400 mb-2">Bio</h4>
                      <p className="text-gray-300 text-sm leading-relaxed">{request.bio}</p>
                    </div>
                  )}

                  {/* Interests */}
                  {request.interests && request.interests.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-400 mb-2">Interests</h4>
                      <div className="flex flex-wrap gap-2">
                        {request.interests.map((interest, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-sm"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg p-3">
                      <p className="text-xs text-gray-400 mb-1">Events Hosted</p>
                      <p className="text-lg font-bold text-white">{request._count.eventsHosted}</p>
                    </div>
                    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg p-3">
                      <p className="text-xs text-gray-400 mb-1">Participated In</p>
                      <p className="text-lg font-bold text-white">{request._count.participations}</p>
                    </div>
                    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg p-3">
                      <p className="text-xs text-gray-400 mb-1">Member Since</p>
                      <p className="text-sm font-bold text-white">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Request Date */}
                  <div className="mt-4 flex items-center gap-2 text-sm text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Requested on{" "}
                      {new Date(request.verificationRequestedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex lg:flex-col gap-3 lg:w-48">
                  <button
                    onClick={() => handleApprove(request.id, request.name)}
                    disabled={isApproving || isRejecting}
                    className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium hover:shadow-lg hover:shadow-green-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => handleRejectClick(request.id, request.name)}
                    disabled={isApproving || isRejecting}
                    className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-red-600 to-pink-600 text-white font-medium hover:shadow-lg hover:shadow-red-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <XCircle className="w-5 h-5" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      <RejectModal
        isOpen={rejectModalOpen}
        onClose={() => {
          setRejectModalOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={handleRejectConfirm}
        userName={selectedUser?.name || ""}
      />
    </div>
  );
}
