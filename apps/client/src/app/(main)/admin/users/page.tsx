"use client";

import { useState } from "react";
import {
  useGetAllUsersQuery,
  useSuspendUserMutation,
  useUnsuspendUserMutation,
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
} from "@/store/api/adminApi";
import {
  Search,
  Filter,
  UserX,
  UserCheck,
  Shield,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Mail,
  Calendar,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

export default function UsersManagement() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [suspendedFilter, setSuspendedFilter] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading } = useGetAllUsersQuery({
    page,
    limit: 20,
    search: search || undefined,
    role: roleFilter || undefined,
    suspended: suspendedFilter === "true" ? true : suspendedFilter === "false" ? false : undefined,
  });

  const [suspendUser] = useSuspendUserMutation();
  const [unsuspendUser] = useUnsuspendUserMutation();
  const [updateUserRole] = useUpdateUserRoleMutation();
  const [deleteUser] = useDeleteUserMutation();

  const users = data?.data.users || [];
  const totalPages = data?.data.totalPages || 1;

  const handleSuspend = async (userId: string) => {
    const reason = prompt("Enter suspension reason:");
    if (!reason) return;

    try {
      await suspendUser({ userId, data: { reason } }).unwrap();
      toast.success("User suspended successfully");
          } catch (error: any) {
      toast.error(error?.data?.error || "Failed to suspend user");
    }
  };

  const handleUnsuspend = async (userId: string) => {
    if (!confirm("Are you sure you want to unsuspend this user?")) return;

    try {
      await unsuspendUser(userId).unwrap();
      toast.success("User unsuspended successfully");
          } catch (error: any) {
      toast.error(error?.data?.error || "Failed to unsuspend user");
    }
  };

  const handleRoleChange = async (userId: string, currentRole: string) => {
    const roles = ["USER", "HOST", "ADMIN"];
    const newRole = prompt(
      `Current role: ${currentRole}\n\nEnter new role (USER, HOST, or ADMIN):`
    )?.toUpperCase();

    if (!newRole || !roles.includes(newRole) || newRole === currentRole) {
      return;
    }

    try {
      await updateUserRole({ userId, data: { role: newRole } }).unwrap();
      toast.success(`User role updated to ${newRole}`);
          } catch (error: any) {
      toast.error(error?.data?.error || "Failed to update user role");
    }
  };

  const handleDelete = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to DELETE user "${userName}"? This action cannot be undone!`)) {
      return;
    }

    try {
      await deleteUser(userId).unwrap();
      toast.success("User deleted successfully");
          } catch (error: any) {
      toast.error(error?.data?.error || "Failed to delete user");
    }
  };

  const handleExportCSV = () => {
    if (!users || users.length === 0) {
      toast.error("No data to export");
      return;
    }

    // Create CSV content
    const headers = ["Name", "Email", "Role", "Verified", "Suspended", "Joined Date"];
    const rows = users.map(user => [
      user.name || "N/A",
      user.email,
      user.role,
      user.emailVerified ? "Yes" : "No",
      user.suspended ? "Yes" : "No",
      new Date(user.createdAt).toLocaleDateString(),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(",")),
    ].join("\n");

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `users_export_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Users exported successfully");
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
          <h1 className="text-4xl font-bold text-white mb-2">User Management</h1>
          <p className="text-gray-300">
            Manage users, roles, and account status
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white transition-all"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all"
          >
            <Filter className="w-4 h-4" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Role
              </label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 [&>option]:bg-gray-800 [&>option]:text-white"
              >
                <option value="">All Roles</option>
                <option value="USER">User</option>
                <option value="HOST">Host</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Status
              </label>
              <select
                value={suspendedFilter}
                onChange={(e) => setSuspendedFilter(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 [&>option]:bg-gray-800 [&>option]:text-white"
              >
                <option value="">All Users</option>
                <option value="false">Active</option>
                <option value="true">Suspended</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                  User
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                  Stats
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                  Joined
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-purple-600 to-pink-600">
                        {user.avatar ? (
                          <Image
                            src={user.avatar}
                            alt={user.name || 'User'}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white font-bold">
                            {user.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-white font-medium">{user.name || 'Unknown User'}</p>
                        <p className="text-gray-400 text-sm flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                        user.role === "ADMIN"
                          ? "bg-red-500/20 text-red-300"
                          : user.role === "HOST"
                          ? "bg-purple-500/20 text-purple-300"
                          : "bg-blue-500/20 text-blue-300"
                      }`}
                    >
                      {user.role === "ADMIN" && <Shield className="w-3 h-3" />}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {user.suspended ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-300">
                          <UserX className="w-3 h-3" />
                          Suspended
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-300">
                          <UserCheck className="w-3 h-3" />
                          Active
                        </span>
                      )}
                      {user.emailVerified && (
                        <div className="text-xs text-gray-400">✓ Email verified</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-300 space-y-1">
                      {user._count && (
                        <>
                          <div>Events: {user._count.eventsHosted || 0}</div>
                          <div>Reviews: {user._count.reviews || 0}</div>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm text-gray-400">
                      <Calendar className="w-3 h-3" />
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleRoleChange(user.id, user.role)}
                        className="p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 transition-all"
                        title="Change Role"
                      >
                        <Shield className="w-4 h-4" />
                      </button>
                      {user.suspended ? (
                        <button
                          onClick={() => handleUnsuspend(user.id)}
                          className="p-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-300 transition-all"
                          title="Unsuspend User"
                        >
                          <UserCheck className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleSuspend(user.id)}
                          className="p-2 rounded-lg bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 transition-all"
                          title="Suspend User"
                        >
                          <UserX className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(user.id, user.name || 'this user')}
                        className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 transition-all"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/10">
          <p className="text-sm text-gray-400">
            Page {page} of {totalPages} • {data?.data.total || 0} total users
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
    </div>
  );
}
