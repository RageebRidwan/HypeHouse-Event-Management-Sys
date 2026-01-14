import cron from "node-cron";
import { sendUpcomingEventReminders } from "../services/notification.service";
import { prisma } from "../utils/prisma";

/**
 * Update past events to COMPLETED status
 */
const updateCompletedEvents = async () => {
  try {
    const now = new Date();
    const result = await prisma.event.updateMany({
      where: {
        date: {
          lt: now,
        },
        status: {
          in: ["OPEN", "FULL"],
        },
      },
      data: {
        status: "COMPLETED",
      },
    });

    if (result.count > 0) {
      console.log(`[CRON] Updated ${result.count} event(s) to COMPLETED status`);
    }
  } catch (error) {
    console.error("[CRON] Error updating completed events:", error);
  }
};

/**
 * Schedule automated jobs
 */
export const startCronJobs = () => {
  // Run every hour to update past events to COMPLETED status
  cron.schedule("0 * * * *", async () => {
    console.log("[CRON] Running event status update job...");
    await updateCompletedEvents();
  });

  // Run every day at 9:00 AM to send reminders for events happening in 24 hours
  cron.schedule("0 9 * * *", async () => {
    console.log("[CRON] Running daily event reminder job...");
    try {
      await sendUpcomingEventReminders();
      console.log("[CRON] Event reminders job completed successfully");
    } catch (error) {
      console.error("[CRON] Error running event reminders job:", error);
    }
  });

  // Run immediately on startup to catch any past events
  updateCompletedEvents();

  console.log("✅ Cron jobs initialized:");
  console.log("  - Event status updates: Hourly");
  console.log("  - Event reminders: Daily at 9:00 AM");
};

