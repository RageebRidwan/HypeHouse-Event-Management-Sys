import { prisma } from "../../utils/prisma";
import { BadRequestError, NotFoundError } from "../../utils/errors";

export interface CreateReportInput {
  reportedType: "EVENT" | "REVIEW" | "USER";
  reportedId: string;
  reason: string;
  description?: string;
}

/**
 * Create a new report
 */
export const createReport = async (reporterId: string, data: CreateReportInput) => {
  // Validate that the reported item exists
  if (data.reportedType === "EVENT") {
    const event = await prisma.event.findUnique({ where: { id: data.reportedId } });
    if (!event) {
      throw new NotFoundError("Event not found");
    }
  } else if (data.reportedType === "REVIEW") {
    const review = await prisma.review.findUnique({ where: { id: data.reportedId } });
    if (!review) {
      throw new NotFoundError("Review not found");
    }
  } else if (data.reportedType === "USER") {
    const user = await prisma.user.findUnique({ where: { id: data.reportedId } });
    if (!user) {
      throw new NotFoundError("User not found");
    }
  }

  // Check if user already reported this item
  const existingReport = await prisma.report.findFirst({
    where: {
      reporterId,
      reportedType: data.reportedType,
      reportedId: data.reportedId,
    },
  });

  if (existingReport) {
    throw new BadRequestError("You have already reported this item");
  }

  const report = await prisma.report.create({
    data: {
      reporterId,
      reportedType: data.reportedType,
      reportedId: data.reportedId,
      reason: data.reason,
      description: data.description,
    },
    include: {
      reporter: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return report;
};

/**
 * Get user's reports
 */
export const getMyReports = async (userId: string) => {
  const reports = await prisma.report.findMany({
    where: { reporterId: userId },
    include: {
      resolvedBy: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return reports;
};
