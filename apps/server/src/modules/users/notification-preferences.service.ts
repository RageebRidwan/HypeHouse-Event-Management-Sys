import { prisma } from "../../utils/prisma";
import { NotFoundError } from "../../utils/errors";

export interface NotificationPreferences {
  emailNotifications: {
    bookingConfirmation: boolean;
    eventReminders: boolean;
    eventCancellation: boolean;
    newReviews: boolean;
    promotionalEmails: boolean;
  };
}

const DEFAULT_PREFERENCES: NotificationPreferences = {
  emailNotifications: {
    bookingConfirmation: true,
    eventReminders: true,
    eventCancellation: true,
    newReviews: true,
    promotionalEmails: false,
  },
};

/**
 * Get user's notification preferences
 */
export const getNotificationPreferences = async (userId: string): Promise<NotificationPreferences> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { emailPreferences: true },
  });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  // If no preferences set, return defaults
  if (!user.emailPreferences) {
    return DEFAULT_PREFERENCES;
  }

  // Merge saved preferences with defaults (in case new preferences were added)
  return {
    ...DEFAULT_PREFERENCES,
    ...(user.emailPreferences as NotificationPreferences),
  };
};

/**
 * Update user's notification preferences
 */
export const updateNotificationPreferences = async (
  userId: string,
  preferences: Partial<NotificationPreferences>
): Promise<NotificationPreferences> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  // Get current preferences
  const currentPreferences = await getNotificationPreferences(userId);

  // Merge with new preferences
  const updatedPreferences: NotificationPreferences = {
    emailNotifications: {
      ...currentPreferences.emailNotifications,
      ...(preferences.emailNotifications || {}),
    },
  };

  // Save to database
  await prisma.user.update({
    where: { id: userId },
    data: {
      emailPreferences: updatedPreferences as any,
    },
  });

  return updatedPreferences;
};

/**
 * Check if user wants to receive a specific type of notification
 */
export const shouldSendNotification = async (
  userId: string,
  notificationType: keyof NotificationPreferences["emailNotifications"]
): Promise<boolean> => {
  const preferences = await getNotificationPreferences(userId);
  return preferences.emailNotifications[notificationType];
};
