"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CreditCard, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { format } from "date-fns";
import { toast } from "sonner";
import { getStripe } from "../../lib/stripe";
import { useCreatePaymentIntentMutation } from "../../store/api/paymentsApi";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: {
    id: string;
    title: string;
    date: string;
    price: number;
  };
  onSuccess: () => void;
}

function PaymentForm({ event, onSuccess, onClose }: Omit<PaymentModalProps, "isOpen">) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/events/${event.id}`,
        },
        redirect: "if_required",
      });

      if (error) {
        setPaymentError(error.message || "Payment failed");
        toast.error(error.message || "Payment failed");
      } else {
        setPaymentSuccess(true);
        toast.success("Payment successful! You've joined the event.");

        // Wait a moment to show success state, then callback
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 2000);
      }
    } catch (err: unknown) {
      const error = err as { message?: string };
      setPaymentError(error.message || "An unexpected error occurred");
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
        >
          <CheckCircle className="w-20 h-20 text-green-400 mb-4" />
        </motion.div>
        <h3 className="text-2xl font-bold text-white mb-2">Payment Successful!</h3>
        <p className="text-gray-300">You've successfully joined the event.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Event Details */}
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4">
        <h3 className="font-semibold text-white mb-2">{event.title}</h3>
        <p className="text-sm text-gray-400">
          {format(new Date(event.date), "EEEE, MMMM d, yyyy 'at' h:mm a")}
        </p>
        <div className="mt-3 pt-3 border-t border-white/10">
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Event Fee</span>
            <span className="text-2xl font-bold text-white">${event.price.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Payment Element */}
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4">
        <label className="block text-sm font-medium text-gray-300 mb-3">
          <CreditCard className="w-4 h-4 inline mr-2" />
          Card Details
        </label>
        <PaymentElement
          options={{
            layout: "tabs",
            defaultValues: {
              billingDetails: {
                address: {
                  country: "US",
                },
              },
            },
          }}
        />
      </div>

      {/* Test Card Info */}
      <div className="backdrop-blur-xl bg-blue-500/10 border border-blue-500/30 rounded-xl p-3">
        <p className="text-xs text-blue-300">
          <strong>Test Mode:</strong> Use card 4242 4242 4242 4242 with any future date and CVC
        </p>
      </div>

      {/* Error Message */}
      {paymentError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-xl bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-300">Payment Failed</p>
            <p className="text-xs text-red-200 mt-1">{paymentError}</p>
          </div>
        </motion.div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onClose}
          disabled={isProcessing}
          className="flex-1 px-6 py-3 rounded-xl backdrop-blur-xl bg-white/10 border border-white/20 text-white font-medium hover:bg-white/20 transition-all disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>Pay ${event.price.toFixed(2)}</>
          )}
        </button>
      </div>
    </form>
  );
}

export function PaymentModal({ isOpen, onClose, event, onSuccess }: PaymentModalProps) {
  const [createPaymentIntent, { isLoading: isCreatingIntent }] = useCreatePaymentIntentMutation();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && !clientSecret) {
      // Create payment intent when modal opens
      createPaymentIntent({ eventId: event.id })
        .unwrap()
        .then((response) => {
          setClientSecret(response.data.clientSecret);
        })
        .catch((err) => {
          // Sanitize error message for user display
          let userMessage = "Failed to initialize payment. Please try again.";

          if (err?.data?.error) {
            // Only show safe, user-friendly messages
            const errorMsg = err.data.error.toLowerCase();
            if (errorMsg.includes("sold out") || errorMsg.includes("full")) {
              userMessage = "This event is now sold out.";
            } else if (errorMsg.includes("already registered") || errorMsg.includes("already joined")) {
              userMessage = "You are already registered for this event.";
            } else if (errorMsg.includes("cancelled")) {
              userMessage = "This event has been cancelled.";
            }
          }

          setError(userMessage);
          toast.error(userMessage);
        });
    }
  }, [isOpen, event.id, clientSecret, createPaymentIntent]);

  const handleClose = () => {
    setClientSecret(null);
    setError(null);
    onClose();
  };

  const stripePromise = getStripe();

  // Check if Stripe is configured
  if (!stripePromise) {
    return (
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md backdrop-blur-xl bg-gradient-to-br from-purple-900/40 via-purple-800/40 to-pink-800/40 border border-white/20 rounded-3xl shadow-2xl p-8"
            >
              <h2 className="text-2xl font-bold text-white mb-4">Payment Unavailable</h2>
              <p className="text-gray-300 mb-6">
                Payment processing is currently unavailable. Please contact the event organizer for alternative payment methods.
              </p>
              <button
                onClick={handleClose}
                className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:shadow-lg transition-all"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto backdrop-blur-xl bg-gradient-to-br from-purple-900/40 via-purple-800/40 to-pink-800/40 border border-white/20 rounded-3xl shadow-2xl"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-xl backdrop-blur-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Content */}
            <div className="p-8">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-white mb-2">Complete Payment</h2>
                <p className="text-gray-300">Join this amazing event by completing your payment</p>
              </div>

              {isCreatingIntent ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="w-12 h-12 text-purple-400 animate-spin mb-4" />
                  <p className="text-gray-300">Initializing payment...</p>
                </div>
              ) : error ? (
                <div className="backdrop-blur-xl bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
                  <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                  <p className="text-red-300 font-medium mb-2">Payment Initialization Failed</p>
                  <p className="text-red-200 text-sm mb-4 whitespace-pre-wrap">{typeof error === 'string' ? error : JSON.stringify(error, null, 2)}</p>
                  <button
                    onClick={handleClose}
                    className="px-6 py-2 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors"
                  >
                    Close
                  </button>
                </div>
              ) : clientSecret ? (
                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret,
                    appearance: {
                      theme: "night",
                      variables: {
                        colorPrimary: "#a855f7",
                        colorBackground: "#1f2937",
                        colorText: "#ffffff",
                        colorDanger: "#ef4444",
                        fontFamily: "system-ui, sans-serif",
                        borderRadius: "12px",
                      },
                    },
                  }}
                >
                  <PaymentForm event={event} onSuccess={onSuccess} onClose={handleClose} />
                </Elements>
              ) : null}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
