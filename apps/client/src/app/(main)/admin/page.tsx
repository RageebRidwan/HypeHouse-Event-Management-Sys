"use client";

import { useGetPlatformStatsQuery } from "@/store/api/adminApi";
import {
  Users,
  Calendar,
  DollarSign,
  Star,
  UserCheck,
  UserX,
  Flag,
  CalendarCheck,
  CalendarClock,
  CheckCircle,
} from "lucide-react";

export default function AdminDashboard() {
  const { data, isLoading, error } = useGetPlatformStatsQuery();
  const stats = data?.data;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-400 text-lg">Failed to load platform statistics</p>
          <p className="text-gray-400 text-sm mt-2">Please try again later</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      gradient: "from-blue-600 to-cyan-600",
    },
    {
      title: "Total Events",
      value: stats.totalEvents.toLocaleString(),
      icon: Calendar,
      gradient: "from-purple-600 to-pink-600",
    },
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      gradient: "from-green-600 to-emerald-600",
    },
    {
      title: "Average Rating",
      value: stats.averageRating.toFixed(1),
      icon: Star,
      gradient: "from-yellow-600 to-orange-600",
      suffix: "/5.0",
    },
    {
      title: "Verified Hosts",
      value: stats.verifiedHosts.toLocaleString(),
      icon: UserCheck,
      gradient: "from-indigo-600 to-purple-600",
    },
    {
      title: "Suspended Users",
      value: stats.suspendedUsers.toLocaleString(),
      icon: UserX,
      gradient: "from-red-600 to-pink-600",
    },
    {
      title: "Pending Reports",
      value: stats.pendingReports.toLocaleString(),
      icon: Flag,
      gradient: "from-orange-600 to-red-600",
    },
    {
      title: "Active Events",
      value: stats.activeEvents.toLocaleString(),
      icon: CalendarCheck,
      gradient: "from-teal-600 to-cyan-600",
    },
    {
      title: "Upcoming Events",
      value: stats.upcomingEvents.toLocaleString(),
      icon: CalendarClock,
      gradient: "from-blue-600 to-indigo-600",
    },
    {
      title: "Completed Events",
      value: stats.completedEvents.toLocaleString(),
      icon: CheckCircle,
      gradient: "from-green-600 to-teal-600",
    },
    {
      title: "Total Participants",
      value: stats.totalParticipants.toLocaleString(),
      icon: Users,
      gradient: "from-pink-600 to-rose-600",
    },
    {
      title: "Total Reviews",
      value: stats.totalReviews.toLocaleString(),
      icon: Star,
      gradient: "from-amber-600 to-yellow-600",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Platform Overview</h1>
        <p className="text-gray-300">
          Real-time statistics and metrics for Hypehouse platform
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-gray-300 text-sm font-medium mb-2">
                {stat.title}
              </h3>
              <div className="flex items-baseline gap-1">
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                {stat.suffix && (
                  <span className="text-gray-400 text-sm">{stat.suffix}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Visual Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Event Status Distribution */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-6">Event Status Distribution</h3>
          <div className="space-y-4">
            {[
              { label: "Active Events", value: stats.activeEvents, color: "bg-green-500", max: stats.totalEvents },
              { label: "Upcoming Events", value: stats.upcomingEvents, color: "bg-blue-500", max: stats.totalEvents },
              { label: "Completed Events", value: stats.completedEvents, color: "bg-purple-500", max: stats.totalEvents },
            ].map((item) => {
              const percentage = stats.totalEvents > 0 ? (item.value / item.max) * 100 : 0;
              return (
                <div key={item.label}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300 text-sm">{item.label}</span>
                    <span className="text-white font-semibold">{item.value}</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                    <div
                      className={`${item.color} h-full rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* User Metrics */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-6">User Metrics</h3>
          <div className="space-y-4">
            {[
              { label: "Verified Hosts", value: stats.verifiedHosts, color: "bg-emerald-500", max: stats.totalUsers },
              { label: "Active Participants", value: stats.totalParticipants, color: "bg-cyan-500", max: stats.totalUsers },
              { label: "Suspended Users", value: stats.suspendedUsers, color: "bg-red-500", max: stats.totalUsers },
            ].map((item) => {
              const percentage = stats.totalUsers > 0 ? (item.value / item.max) * 100 : 0;
              return (
                <div key={item.label}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300 text-sm">{item.label}</span>
                    <span className="text-white font-semibold">{item.value}</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                    <div
                      className={`${item.color} h-full rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <a
            href="/admin/users"
            className="flex items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all"
          >
            <Users className="w-5 h-5 text-blue-400" />
            <span className="text-white font-medium">Manage Users</span>
          </a>
          <a
            href="/admin/events"
            className="flex items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all"
          >
            <Calendar className="w-5 h-5 text-purple-400" />
            <span className="text-white font-medium">Manage Events</span>
          </a>
          <a
            href="/admin/reports"
            className="flex items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all"
          >
            <Flag className="w-5 h-5 text-orange-400" />
            <span className="text-white font-medium">Review Reports</span>
          </a>
          <a
            href="/dashboard"
            className="flex items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all"
          >
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-white font-medium">Back to Site</span>
          </a>
        </div>
      </div>
    </div>
  );
}
