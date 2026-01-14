import { Request, Response, NextFunction } from "express";
import * as notificationPreferencesService from "./notification-preferences.service";
import { sendSuccess } from "../../utils/response";

/**
 * Get user's notification preferences
 */
export const getNotificationPreferences = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const preferences = await notificationPreferencesService.getNotificationPreferences(userId);
    sendSuccess(res, preferences, "Notification preferences retrieved successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * Update user's notification preferences
 */
export const updateNotificationPreferences = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const preferences = await notificationPreferencesService.updateNotificationPreferences(
      userId,
      req.body
    );
    sendSuccess(res, preferences, "Notification preferences updated successfully");
  } catch (error) {
    next(error);
  }
};
