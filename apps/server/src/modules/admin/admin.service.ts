import { prisma } from "../../utils/prisma";
import { NotFoundError, BadRequestError, ForbiddenError } from "../../utils/errors";

/**
 * Get platform statistics
 */
export const getPlatformStats = async () => {
  const now = new Date();

  const [
    totalUsers,
    totalEvents,
    totalReviews,
    totalParticipants,
    pendingReports,
    activeEvents,
    upcomingEvents,
    completedEvents,
    verifiedHosts,
    suspendedUsers,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.event.count(),
    prisma.review.count(),
    prisma.participant.count(),
    prisma.report.count({ where: { status: "PENDING" } }),
    prisma.event.count({ where: { status: "OPEN" } }),
    prisma.event.count({ where: { date: { gte: now }, status: { not: "CANCELLED" } } }),
    prisma.event.count({ where: { status: "COMPLETED" } }),
    prisma.user.count({ where: { role: "HOST", verified: true } }),
    prisma.user.count({ where: { suspended: true } }),
  ]);

  const avgRating = await prisma.review.aggregate({
    _avg: { rating: true },
  });

  // Calculate total revenue from completed payments
  const revenueData = await prisma.participant.aggregate({
    _sum: { amountPaid: true },
    where: { paymentStatus: "COMPLETED" },
  });

  const totalRevenue = revenueData._sum.amountPaid || 0;

  return {
    totalUsers,
    totalEvents,
    totalParticipants,
    totalRevenue,
    totalReviews,
    averageRating: avgRating._avg.rating || 0,
    pendingReports,
    activeEvents,
    upcomingEvents,
    completedEvents,
    verifiedHosts,
    suspendedUsers,
  };
};

/**
 * Get all users with filters and pagination
 */
export const getAllUsers = async (params: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  suspended?: boolean;
}) => {
  const page = params.page || 1;
  const limit = params.limit || 20;
  const skip = (page - 1) * limit;

  const where: any = {};

  if (params.search) {
    where.OR = [
      { name: { contains: params.search, mode: "insensitive" } },
      { email: { contains: params.search, mode: "insensitive" } },
    ];
  }

  if (params.role) {
    where.role = params.role;
  }

  if (params.suspended !== undefined) {
    where.suspended = params.suspended;
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        role: true,
        verified: true,
        emailVerified: true,
        suspended: true,
        suspendedAt: true,
        suspendedReason: true,
        createdAt: true,
        rating: true,
        reviewCount: true,
        _count: {
          select: {
            eventsHosted: true,
            participations: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

/**
 * Get user details by ID
 */
export const getUserDetails = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      avatar: true,
      bio: true,
      location: true,
      interests: true,
      role: true,
      verified: true,
      emailVerified: true,
      rating: true,
      reviewCount: true,
      suspended: true,
      suspendedAt: true,
      suspendedReason: true,
      acceptedHostTerms: true,
      hostTermsAcceptedAt: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          eventsHosted: true,
          participations: true,
          reviews: true,
          reportsCreated: true,
        },
      },
    },
  });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  // Get recent events
  const recentEvents = await prisma.event.findMany({
    where: { hostId: userId },
    take: 5,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      eventType: true,
      date: true,
      status: true,
      createdAt: true,
    },
  });

  return {
    ...user,
    recentEvents,
  };
};

/**
 * Update user role
 */
export const updateUserRole = async (userId: string, newRole: string) => {
  if (!["USER", "HOST", "ADMIN"].includes(newRole)) {
    throw new BadRequestError("Invalid role");
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: { role: newRole as any },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  return user;
};

/**
 * Suspend user
 */
export const suspendUser = async (userId: string, reason: string) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      suspended: true,
      suspendedAt: new Date(),
      suspendedReason: reason,
    },
    select: {
      id: true,
      name: true,
      email: true,
      suspended: true,
      suspendedAt: true,
      suspendedReason: true,
    },
  });

  return user;
};

/**
 * Unsuspend user
 */
export const unsuspendUser = async (userId: string) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      suspended: false,
      suspendedAt: null,
      suspendedReason: null,
    },
    select: {
      id: true,
      name: true,
      email: true,
      suspended: true,
    },
  });

  return user;
};

/**
 * Delete user (admin only)
 */
export const deleteUser = async (userId: string) => {
  await prisma.user.delete({
    where: { id: userId },
  });

  return { message: "User deleted successfully" };
};

/**
 * Get all events with filters
 */
export const getAllEvents = async (params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  flagged?: boolean;
}) => {
  const page = params.page || 1;
  const limit = params.limit || 20;
  const skip = (page - 1) * limit;

  const where: any = {};

  if (params.search) {
    where.OR = [
      { title: { contains: params.search, mode: "insensitive" } },
      { location: { contains: params.search, mode: "insensitive" } },
    ];
  }

  if (params.status) {
    where.status = params.status;
  }

  const [events, total] = await Promise.all([
    prisma.event.findMany({
      where,
      skip,
      take: limit,
      include: {
        host: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            participants: true,
            reviews: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.event.count({ where }),
  ]);

  return {
    events,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

/**
 * Delete event (admin only)
 */
export const deleteEventAsAdmin = async (eventId: string) => {
  await prisma.event.delete({
    where: { id: eventId },
  });

  return { message: "Event deleted successfully" };
};

/**
 * Get all reports
 */
export const getAllReports = async (params: {
  page?: number;
  limit?: number;
  type?: string;
  status?: string;
}) => {
  const page = params.page || 1;
  const limit = params.limit || 20;
  const skip = (page - 1) * limit;

  const where: any = {};

  if (params.type) {
    where.reportedType = params.type;
  }

  if (params.status) {
    where.status = params.status;
  }

  const [reports, total] = await Promise.all([
    prisma.report.findMany({
      where,
      skip,
      take: limit,
      include: {
        reporter: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        resolvedBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.report.count({ where }),
  ]);

  return {
    reports,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

/**
 * Resolve report
 */
export const resolveReport = async (reportId: string, adminId: string) => {
  const report = await prisma.report.update({
    where: { id: reportId },
    data: {
      status: "RESOLVED",
      resolvedAt: new Date(),
      resolvedById: adminId,
    },
  });

  return report;
};

/**
 * Dismiss report
 */
export const dismissReport = async (reportId: string, adminId: string) => {
  const report = await prisma.report.update({
    where: { id: reportId },
    data: {
      status: "DISMISSED",
      resolvedAt: new Date(),
      resolvedById: adminId,
    },
  });

  return report;
};
