"use client";

import { useState } from "react";
import { X, FileText, CheckCircle } from "lucide-react";
import { useAcceptHostTermsMutation } from "@/store/api/usersApi";
import { useAppDispatch } from "@/store/hooks";
import { updateUser } from "@/store/slices/authSlice";
import { toast } from "sonner";

interface HostTermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept?: () => void;
}

export default function HostTermsModal({ isOpen, onClose, onAccept }: HostTermsModalProps) {
  const dispatch = useAppDispatch();
  const [acceptHostTerms, { isLoading }] = useAcceptHostTermsMutation();
  const [hasScrolled, setHasScrolled] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const scrolledToBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 50;
    if (scrolledToBottom) {
      setHasScrolled(true);
    }
  };

  const handleAccept = async () => {
    if (!agreedToTerms) {
      toast.error("Please agree to the terms and conditions");
      return;
    }

    try {
      await acceptHostTerms().unwrap();

      // Update user in Redux state
      dispatch(updateUser({
        role: "HOST", // Backend automatically promotes to HOST upon accepting terms
        acceptedHostTerms: true
      }));

      toast.success("Host terms accepted! You can now create events.");
      onAccept?.();
      onClose();
    } catch (error: any) {
      toast.error(error?.data?.error || "Failed to accept host terms");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-3xl max-h-[90vh] backdrop-blur-xl bg-gradient-to-br from-purple-900/90 via-purple-800/90 to-pink-800/90 border border-white/20 rounded-2xl shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Host Terms & Conditions</h2>
              <p className="text-sm text-gray-300">Please read and accept to become a host</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Content */}
        <div
          className="flex-1 overflow-y-auto p-6 space-y-4 text-gray-200"
          onScroll={handleScroll}
        >
          <section>
            <h3 className="text-lg font-bold text-white mb-2">1. Event Hosting Responsibilities</h3>
            <p className="text-sm leading-relaxed">
              As a host on Hypehouse, you agree to:
            </p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1 text-sm">
              <li>Provide accurate event information including date, time, location, and description</li>
              <li>Ensure the safety and well-being of all participants</li>
              <li>Comply with all local laws and regulations</li>
              <li>Respond promptly to participant inquiries and concerns</li>
              <li>Maintain appropriate insurance and permits as required</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-bold text-white mb-2">2. Content Guidelines</h3>
            <p className="text-sm leading-relaxed">
              Event listings must:
            </p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1 text-sm">
              <li>Be truthful and not misleading</li>
              <li>Not contain offensive, discriminatory, or illegal content</li>
              <li>Include accurate pricing and refund policies</li>
              <li>Use appropriate images that represent the actual event</li>
              <li>Not infringe on intellectual property rights</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-bold text-white mb-2">3. Cancellation & Refunds</h3>
            <p className="text-sm leading-relaxed">
              You agree to:
            </p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1 text-sm">
              <li>Provide at least 48 hours notice for event cancellations</li>
              <li>Issue full refunds for cancelled events within 7 business days</li>
              <li>Communicate any changes to participants immediately</li>
              <li>Honor your stated refund policy for participant-initiated cancellations</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-bold text-white mb-2">4. Payment & Fees</h3>
            <p className="text-sm leading-relaxed">
              Hypehouse charges a platform fee of 10% on paid events. Payments are processed securely and transferred to your account within 3-5 business days after the event concludes. You are responsible for any applicable taxes on your earnings.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-white mb-2">5. Liability & Insurance</h3>
            <p className="text-sm leading-relaxed">
              You acknowledge that you are solely responsible for the events you host. Hypehouse is not liable for any injuries, damages, or losses that occur during your events. You agree to maintain appropriate insurance coverage and indemnify Hypehouse against any claims arising from your events.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-white mb-2">6. Account Suspension</h3>
            <p className="text-sm leading-relaxed">
              Hypehouse reserves the right to suspend or terminate your hosting privileges if you:
            </p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1 text-sm">
              <li>Violate these terms and conditions</li>
              <li>Receive multiple complaints from participants</li>
              <li>Engage in fraudulent or illegal activities</li>
              <li>Fail to maintain a minimum average rating of 3.0 stars</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-bold text-white mb-2">7. Privacy & Data</h3>
            <p className="text-sm leading-relaxed">
              You will receive access to participant information (names, emails, phone numbers) solely for event management purposes. You agree not to share, sell, or misuse this information and to comply with all applicable privacy laws including GDPR and CCPA.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-white mb-2">8. Modifications</h3>
            <p className="text-sm leading-relaxed">
              Hypehouse reserves the right to modify these terms at any time. You will be notified of significant changes and continued hosting implies acceptance of the updated terms.
            </p>
          </section>

          {/* Scroll Indicator */}
          {!hasScrolled && (
            <div className="sticky bottom-0 left-0 right-0 flex justify-center pb-2">
              <div className="px-4 py-2 rounded-full bg-purple-600/80 backdrop-blur-sm text-white text-sm">
                ↓ Scroll to read all terms
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 space-y-4">
          {/* Checkbox */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              disabled={!hasScrolled}
              className="mt-1 w-5 h-5 rounded border-2 border-white/30 bg-white/10 checked:bg-gradient-to-br checked:from-purple-600 checked:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            />
            <span className="text-sm text-gray-200">
              I have read and agree to the Host Terms & Conditions and understand my responsibilities as an event host on Hypehouse
            </span>
          </label>

          {/* Buttons */}
          <div className="flex flex-col-reverse sm:flex-row gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAccept}
              disabled={!agreedToTerms || !hasScrolled || isLoading}
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Accepting...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Accept & Become a Host
                </>
              )}
            </button>
          </div>

          {!hasScrolled && (
            <p className="text-xs text-center text-yellow-400">
              Please scroll through and read all terms before accepting
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
