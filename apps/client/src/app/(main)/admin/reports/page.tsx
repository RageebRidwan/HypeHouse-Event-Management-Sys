"use client";

import { useState } from "react";
import {
  useGetAllReportsQuery,
  useResolveReportMutation,
  useDismissReportMutation,
} from "@/store/api/adminApi";
import {
  Flag,
  Filter,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  User,
  Calendar as CalendarIcon,
  MessageSquare,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

export default function ReportsManagement() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading } = useGetAllReportsQuery({
    page,
    limit: 20,
    status: statusFilter || undefined,
    reportedType: typeFilter || undefined,
  });

  const [resolveReport] = useResolveReportMutation();
  const [dismissReport] = useDismissReportMutation();

  const reports = data?.data.reports || [];
  const totalPages = data?.data.totalPages || 1;

  const handleResolve = async (reportId: string) => {
    if (!confirm("Mark this report as resolved? This indicates you've taken action on the reported content.")) {
      return;
    }

    try {
      await resolveReport(reportId).unwrap();
      toast.success("Report marked as resolved");
    } catch (error: any) {
      toast.error(error?.data?.error || "Failed to resolve report");
    }
  };

  const handleDismiss = async (reportId: string) => {
    if (!confirm("Dismiss this report? This indicates no action is needed.")) {
      return;
    }

    try {
      await dismissReport(reportId).unwrap();
      toast.success("Report dismissed");
    } catch (error: any) {
      toast.error(error?.data?.error || "Failed to dismiss report");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Reports Management</h1>
          <p className="text-gray-300">
            Review and moderate user-submitted reports
          </p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all"
        >
          <Filter className="w-4 h-4" />
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 [&>option]:bg-gray-800 [&>option]:text-white"
            >
              <option value="">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="RESOLVED">Resolved</option>
              <option value="DISMISSED">Dismissed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Report Type
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 [&>option]:bg-gray-800 [&>option]:text-white"
            >
              <option value="">All Types</option>
              <option value="EVENT">Event Reports</option>
              <option value="REVIEW">Review Reports</option>
              <option value="USER">User Reports</option>
            </select>
          </div>
        </div>
      )}

      {/* Reports List */}
      <div className="space-y-4">
        {reports.length === 0 ? (
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-12 text-center">
            <Flag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Reports Found</h3>
            <p className="text-gray-400">
              {statusFilter || typeFilter
                ? "Try adjusting your filters"
                : "There are no reports to review"}
            </p>
          </div>
        ) : (
          reports.map((report) => (
            <div
              key={report.id}
              className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  {/* Report Type Icon */}
                  <div
                    className={`p-3 rounded-xl ${
                      report.reportedType === "EVENT"
                        ? "bg-purple-500/20 text-purple-300"
                        : report.reportedType === "REVIEW"
                        ? "bg-blue-500/20 text-blue-300"
                        : "bg-orange-500/20 text-orange-300"
                    }`}
                  >
                    {report.reportedType === "EVENT" ? (
                      <CalendarIcon className="w-6 h-6" />
                    ) : report.reportedType === "REVIEW" ? (
                      <MessageSquare className="w-6 h-6" />
                    ) : (
                      <User className="w-6 h-6" />
                    )}
                  </div>

                  {/* Report Details */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                          report.reportedType === "EVENT"
                            ? "bg-purple-500/20 text-purple-300"
                            : report.reportedType === "REVIEW"
                            ? "bg-blue-500/20 text-blue-300"
                            : "bg-orange-500/20 text-orange-300"
                        }`}
                      >
                        {report.reportedType}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                          report.status === "PENDING"
                            ? "bg-yellow-500/20 text-yellow-300"
                            : report.status === "RESOLVED"
                            ? "bg-green-500/20 text-green-300"
                            : "bg-gray-500/20 text-gray-300"
                        }`}
                      >
                        {report.status}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-white mb-2">
                      <AlertTriangle className="w-4 h-4 inline mr-2 text-red-400" />
                      {report.reason}
                    </h3>

                    {report.description && (
                      <p className="text-gray-300 text-sm mb-3 bg-white/5 rounded-lg p-3">
                        {report.description}
                      </p>
                    )}

                    <div className="flex items-center gap-6 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>Reported by: {report.reporter.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4" />
                        <span>{new Date(report.createdAt).toLocaleString()}</span>
                      </div>
                    </div>

                    {report.resolvedBy && (
                      <div className="mt-2 text-sm text-gray-400">
                        <span className="text-green-400">✓</span> Handled by:{" "}
                        {report.resolvedBy.name}
                        {report.resolvedAt && (
                          <span className="ml-2">
                            on {new Date(report.resolvedAt).toLocaleString()}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="mt-3 text-xs text-gray-500">
                      Report ID: {report.id} • Reported Item ID: {report.reportedId}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {report.status === "PENDING" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleResolve(report.id)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 text-green-300 transition-all"
                      title="Resolve Report"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Resolve
                    </button>
                    <button
                      onClick={() => handleDismiss(report.id)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-500/20 hover:bg-gray-500/30 border border-gray-500/50 text-gray-300 transition-all"
                      title="Dismiss Report"
                    >
                      <XCircle className="w-4 h-4" />
                      Dismiss
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {reports.length > 0 && (
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl px-6 py-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">
              Page {page} of {totalPages} • {data?.data.total || 0} total reports
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
