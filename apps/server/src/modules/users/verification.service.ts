import { prisma } from "../../utils/prisma";
import { BadRequestError, ForbiddenError, NotFoundError } from "../../utils/errors";

/**
 * Request verification badge (user endpoint)
 */
export const requestVerification = async (userId: string): Promise<{ message: string }> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  // Check if already verified
  if (user.verified) {
    throw new BadRequestError("You are already verified");
  }

  // Check if already requested
  if (user.verificationRequested && !user.verificationRejected) {
    throw new BadRequestError("Verification request already pending");
  }

  // Check profile completion requirements
  if (!user.bio || user.bio.length < 100) {
    throw new BadRequestError("Please complete your profile with a bio (minimum 100 characters)");
  }

  if (!user.location) {
    throw new BadRequestError("Please add your location to your profile");
  }

  if (!user.interests || user.interests.length < 3) {
    throw new BadRequestError("Please add at least 3 interests to your profile");
  }

  if (!user.acceptedHostTerms) {
    throw new BadRequestError("Please accept the host terms and conditions");
  }

  // Update user with verification request
  await prisma.user.update({
    where: { id: userId },
    data: {
      verificationRequested: true,
      verificationRequestedAt: new Date(),
      verificationRejected: false,
      verificationRejectedReason: null,
    },
  });

  return {
    message: "Verification request submitted successfully. An admin will review your request soon.",
  };
};

/**
 * Get verification request status (user endpoint)
 */
export const getVerificationStatus = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      verified: true,
      verificationRequested: true,
      verificationRequestedAt: true,
      verificationRejected: true,
      verificationRejectedReason: true,
    },
  });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  return user;
};

/**
 * Get all pending verification requests (admin endpoint)
 */
export const getPendingVerificationRequests = async () => {
  const users = await prisma.user.findMany({
    where: {
      verificationRequested: true,
      verified: false,
    },
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      bio: true,
      location: true,
      interests: true,
      rating: true,
      reviewCount: true,
      verificationRequestedAt: true,
      createdAt: true,
      _count: {
        select: {
          eventsHosted: true,
          participations: true,
        },
      },
    },
    orderBy: {
      verificationRequestedAt: 'asc', // Oldest first
    },
  });

  return users;
};

/**
 * Approve verification request (admin endpoint)
 */
export const approveVerification = async (
  adminId: string,
  userId: string
): Promise<{ message: string }> => {
  // Check if admin
  const admin = await prisma.user.findUnique({
    where: { id: adminId },
  });

  if (!admin || admin.role !== "ADMIN") {
    throw new ForbiddenError("Only admins can approve verification requests");
  }

  // Check if user exists and has requested verification
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  if (!user.verificationRequested) {
    throw new BadRequestError("User has not requested verification");
  }

  if (user.verified) {
    throw new BadRequestError("User is already verified");
  }

  // Approve verification
  await prisma.user.update({
    where: { id: userId },
    data: {
      verified: true,
      verificationRequested: false,
      verificationRequestedAt: null,
      verificationRejected: false,
      verificationRejectedReason: null,
    },
  });

  return {
    message: "User verified successfully",
  };
};

/**
 * Reject verification request (admin endpoint)
 */
export const rejectVerification = async (
  adminId: string,
  userId: string,
  reason: string
): Promise<{ message: string }> => {
  // Check if admin
  const admin = await prisma.user.findUnique({
    where: { id: adminId },
  });

  if (!admin || admin.role !== "ADMIN") {
    throw new ForbiddenError("Only admins can reject verification requests");
  }

  // Check if user exists and has requested verification
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  if (!user.verificationRequested) {
    throw new BadRequestError("User has not requested verification");
  }

  // Reject verification
  await prisma.user.update({
    where: { id: userId },
    data: {
      verificationRequested: false,
      verificationRejected: true,
      verificationRejectedReason: reason,
    },
  });

  return {
    message: "Verification request rejected",
  };
};
