import { Request, Response, NextFunction } from "express";
import { sendUpcomingEventReminders } from "../../services/notification.service";
import { sendSuccess } from "../../utils/response";

/**
 * Trigger event reminders for events happening in 24 hours
 * This should be called by a cron job service (e.g., GitHub Actions, cron-job.org)
 */
export const triggerEventReminders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Verify cron secret to prevent unauthorized access
    const cronSecret = req.headers["x-cron-secret"];
    if (cronSecret !== process.env.CRON_SECRET) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    await sendUpcomingEventReminders();

    sendSuccess(res, null, "Event reminders sent successfully");
  } catch (error) {
    next(error);
  }
};
