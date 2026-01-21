import { prisma } from "../../utils/prisma";
import { NotFoundError, ForbiddenError, BadRequestError } from "../../utils/errors";
import { uploadImage } from "../../utils/cloudinary";
import { checkProfileCompletion } from "../../utils/profileValidation";

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  bio: string | null;
  role: string;
  verified: boolean;
  createdAt: Date;
  stats: {
    eventsHosted: number;
    eventsJoined: number;
    averageRating: number;
  };
  hostedEvents: Array<{
    id: string;
    title: string;
    eventType: string;
    date: Date;
    imageUrl: string | null;
    _count: {
      participants: number;
    };
  }>;
}

export interface UpdateProfileInput {
  name?: string;
  bio?: string;
  avatar?: string;
}

export const getUserById = async (userId: string): Promise<UserProfile> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      avatar: true,
      bio: true,
      role: true,
      verified: true,
      createdAt: true,
      eventsHosted: {
        select: {
          id: true,
          title: true,
          eventType: true,
          date: true,
          imageUrl: true,
          _count: {
            select: {
              participants: true,
            },
          },
        },
        orderBy: {
          date: "desc",
        },
        take: 6,
      },
      _count: {
        select: {
          eventsHosted: true,
          participations: true,
        },
      },
    },
  });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  // Calculate average rating from reviews received
  const reviews = await prisma.review.findMany({
    where: {
      event: {
        hostId: userId,
      },
    },
    select: {
      rating: true,
    },
  });

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatar: user.avatar,
    bio: user.bio,
    role: user.role,
    verified: user.verified,
    createdAt: user.createdAt,
    stats: {
      eventsHosted: user._count.eventsHosted,
      eventsJoined: user._count.participations,
      averageRating: Math.round(averageRating * 10) / 10,
    },
    hostedEvents: user.eventsHosted,
  };
};

export const updateUserProfile = async (
  userId: string,
  requestUserId: string,
  data: UpdateProfileInput
): Promise<UserProfile> => {
  // Check if user can update this profile
  if (userId !== requestUserId) {
    throw new ForbiddenError("You can only update your own profile");
  }

  // Validate bio length
  if (data.bio && data.bio.length > 500) {
    throw new Error("Bio must be less than 500 characters");
  }

  // Validate name length
  if (data.name && data.name.length < 2) {
    throw new Error("Name must be at least 2 characters");
  }

  // Update user
  await prisma.user.update({
    where: { id: userId },
    data: {
      name: data.name,
      bio: data.bio,
      avatar: data.avatar,
    },
  });

  // Return updated profile
  return getUserById(userId);
};

export const uploadProfileImage = async (
  userId: string,
  imageBuffer: Buffer,
  mimeType: string
): Promise<string> => {
  try {
    // Upload to Cloudinary
    const result = await uploadImage(imageBuffer, "hypehouse/profiles");

    // Update user avatar
    await prisma.user.update({
      where: { id: userId },
      data: { avatar: result.secure_url },
    });

    return result.secure_url;
  } catch (error) {
    throw new Error("Failed to upload profile image");
  }
};

/**
 * Get profile completion status
 */
export const getProfileCompletion = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      avatar: true,
      bio: true,
      location: true,
      interests: true,
    },
  });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  return checkProfileCompletion(user);
};

/**
 * Update user profile with location and interests
 */
export const updateProfileExtended = async (
  userId: string,
  data: {
    name?: string;
    bio?: string;
    avatar?: string | null;
    location?: string;
    interests?: string[];
  }
) => {
  // Validate interests
  if (data.interests && data.interests.length > 10) {
    throw new BadRequestError("Maximum 10 interests allowed");
  }

  // Build update data - handle avatar separately to allow null values
  const updateData: Record<string, unknown> = {};

  if (data.name) updateData.name = data.name;
  if (data.bio) updateData.bio = data.bio;
  if (data.location) updateData.location = data.location;
  if (data.interests) updateData.interests = data.interests;

  // Avatar can be set to null (to remove it) or a new string
  if (data.avatar !== undefined) {
    updateData.avatar = data.avatar;
  }

  await prisma.user.update({
    where: { id: userId },
    data: updateData,
  });

  return getProfileCompletion(userId);
};

/**
 * Accept host terms and conditions
 */
export const acceptHostTerms = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { acceptedHostTerms: true },
  });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  if (user.acceptedHostTerms) {
    throw new BadRequestError("Host terms already accepted");
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      acceptedHostTerms: true,
      hostTermsAcceptedAt: new Date(),
    },
  });

  return {
    message: "Host terms accepted successfully",
    acceptedAt: new Date(),
  };
};
