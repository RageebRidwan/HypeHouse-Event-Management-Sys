"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CreditCard, Calendar, DollarSign, CheckCircle, XCircle, Clock } from "lucide-react";
import { format } from "date-fns";
import { useGetPaymentHistoryQuery } from "../../../../store/api/paymentsApi";

type FilterType = "all" | "COMPLETED" | "PENDING" | "FAILED";

export default function PaymentHistoryPage() {
  const router = useRouter();
  const { data, isLoading } = useGetPaymentHistoryQuery();
  const [filter, setFilter] = useState<FilterType>("all");

  const payments = data?.data || [];
  const filteredPayments = filter === "all"
    ? payments
    : payments.filter(p => p.status === filter);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
            <CheckCircle className="w-3.5 h-3.5" />
            Completed
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
            <Clock className="w-3.5 h-3.5" />
            Pending
          </span>
        );
      case "FAILED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30">
            <XCircle className="w-3.5 h-3.5" />
            Failed
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800">
      {/* Header */}
      <div className="backdrop-blur-xl bg-black/20 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white/90 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Payment History</h1>
              <p className="text-gray-300 mt-1">View all your event payments</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              filter === "all"
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50"
                : "backdrop-blur-xl bg-white/10 border border-white/20 text-gray-300 hover:bg-white/20"
            }`}
          >
            All ({payments.length})
          </button>
          <button
            onClick={() => setFilter("COMPLETED")}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              filter === "COMPLETED"
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50"
                : "backdrop-blur-xl bg-white/10 border border-white/20 text-gray-300 hover:bg-white/20"
            }`}
          >
            Completed ({payments.filter(p => p.status === "COMPLETED").length})
          </button>
          <button
            onClick={() => setFilter("PENDING")}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              filter === "PENDING"
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50"
                : "backdrop-blur-xl bg-white/10 border border-white/20 text-gray-300 hover:bg-white/20"
            }`}
          >
            Pending ({payments.filter(p => p.status === "PENDING").length})
          </button>
          <button
            onClick={() => setFilter("FAILED")}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              filter === "FAILED"
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50"
                : "backdrop-blur-xl bg-white/10 border border-white/20 text-gray-300 hover:bg-white/20"
            }`}
          >
            Failed ({payments.filter(p => p.status === "FAILED").length})
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredPayments.length === 0 && (
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-12 text-center">
            <CreditCard className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Payments Found</h3>
            <p className="text-gray-400 mb-6">
              {filter === "all"
                ? "You haven't made any payments yet"
                : `No ${filter.toLowerCase()} payments found`
              }
            </p>
            <button
              onClick={() => router.push("/events")}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:shadow-lg hover:shadow-purple-500/50 transition-all"
            >
              Browse Events
            </button>
          </div>
        )}

        {/* Payment List */}
        {!isLoading && filteredPayments.length > 0 && (
          <div className="space-y-4">
            {filteredPayments.map((payment) => (
              <div
                key={payment.id}
                onClick={() => router.push(`/events/${payment.eventId}`)}
                className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all cursor-pointer group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors">
                        {payment.eventName}
                      </h3>
                      {getStatusBadge(payment.status)}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Event: {format(new Date(payment.eventDate), "MMM d, yyyy")}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Paid: {format(new Date(payment.createdAt), "MMM d, yyyy")}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-2xl font-bold text-white">
                        <DollarSign className="w-5 h-5" />
                        {payment.amount.toFixed(2)}
                      </div>
                      <p className="text-xs text-gray-400">USD</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
