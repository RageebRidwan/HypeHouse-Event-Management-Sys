import { Resend } from "resend";
import { WelcomeEmail } from "../templates/emails/WelcomeEmail";
import { EventReminderEmail } from "../templates/emails/EventReminderEmail";
import { BookingConfirmationEmail } from "../templates/emails/BookingConfirmationEmail";
import { EventCancellationEmail } from "../templates/emails/EventCancellationEmail";
import { NewReviewEmail } from "../templates/emails/NewReviewEmail";
import { shouldSendNotification } from "../modules/users/notification-preferences.service";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.FROM_EMAIL || "Hypehouse <onboarding@resend.dev>";

export interface SendWelcomeEmailParams {
  to: string;
  name: string;
  verificationUrl: string;
}

export interface SendEventReminderParams {
  to: string;
  userName: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  eventUrl: string;
}

export interface SendBookingConfirmationParams {
  to: string;
  userName: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  hostName: string;
  eventUrl: string;
  ticketPrice: number;
}

export interface SendEventCancellationParams {
  to: string;
  userName: string;
  eventTitle: string;
  eventDate: string;
  hostName: string;
  refundAmount: number;
  cancellationReason?: string;
}

export interface SendNewReviewParams {
  to: string;
  hostName: string;
  eventTitle: string;
  reviewerName: string;
  rating: number;
  comment: string;
  eventUrl: string;
}

/**
 * Send welcome email to new users
 */
export const sendWelcomeEmail = async (params: SendWelcomeEmailParams) => {
  try {
    const html = WelcomeEmail({
      name: params.name,
      verificationUrl: params.verificationUrl,
    });

    await resend.emails.send({
      from: FROM_EMAIL,
      to: params.to,
      subject: "Welcome to Hypehouse! 🎉",
      html,
    });

    console.log(`Welcome email sent to ${params.to}`);
  } catch (error) {
    console.error("Error sending welcome email:", error);
    throw error;
  }
};

/**
 * Send event reminder to participants
 */
export const sendEventReminder = async (params: SendEventReminderParams) => {
  try {
    // Check if user wants event reminders
    const shouldSend = await shouldSendNotification(params.to, "eventReminders");
    if (!shouldSend) {
      console.log(`Skipping event reminder to ${params.to} - user opted out`);
      return;
    }

    const html = EventReminderEmail({
      userName: params.userName,
      eventTitle: params.eventTitle,
      eventDate: params.eventDate,
      eventTime: params.eventTime,
      eventLocation: params.eventLocation,
      eventUrl: params.eventUrl,
    });

    await resend.emails.send({
      from: FROM_EMAIL,
      to: params.to,
      subject: `Reminder: ${params.eventTitle} is coming up soon! ⏰`,
      html,
    });

    console.log(`Event reminder sent to ${params.to} for ${params.eventTitle}`);
  } catch (error) {
    console.error("Error sending event reminder:", error);
    throw error;
  }
};

/**
 * Send booking confirmation to participants
 */
export const sendBookingConfirmation = async (params: SendBookingConfirmationParams) => {
  try {
    // Check if user wants booking confirmations
    const shouldSend = await shouldSendNotification(params.to, "bookingConfirmation");
    if (!shouldSend) {
      console.log(`Skipping booking confirmation to ${params.to} - user opted out`);
      return;
    }

    const html = BookingConfirmationEmail({
      userName: params.userName,
      eventTitle: params.eventTitle,
      eventDate: params.eventDate,
      eventTime: params.eventTime,
      eventLocation: params.eventLocation,
      hostName: params.hostName,
      eventUrl: params.eventUrl,
      ticketPrice: params.ticketPrice,
    });

    await resend.emails.send({
      from: FROM_EMAIL,
      to: params.to,
      subject: `Booking Confirmed: ${params.eventTitle} ✅`,
      html,
    });

    console.log(`Booking confirmation sent to ${params.to} for ${params.eventTitle}`);
  } catch (error) {
    console.error("Error sending booking confirmation:", error);
    throw error;
  }
};

/**
 * Send event cancellation notification to participants
 */
export const sendEventCancellation = async (params: SendEventCancellationParams) => {
  try {
    const html = EventCancellationEmail({
      userName: params.userName,
      eventTitle: params.eventTitle,
      eventDate: params.eventDate,
      hostName: params.hostName,
      refundAmount: params.refundAmount,
      cancellationReason: params.cancellationReason,
    });

    await resend.emails.send({
      from: FROM_EMAIL,
      to: params.to,
      subject: `Event Cancelled: ${params.eventTitle} ❌`,
      html,
    });

    console.log(`Event cancellation sent to ${params.to} for ${params.eventTitle}`);
  } catch (error) {
    console.error("Error sending event cancellation:", error);
    throw error;
  }
};

/**
 * Send new review notification to host
 */
export const sendNewReviewNotification = async (params: SendNewReviewParams) => {
  try {
    // Check if user wants new review notifications
    const shouldSend = await shouldSendNotification(params.to, "newReviews");
    if (!shouldSend) {
      console.log(`Skipping new review notification to ${params.to} - user opted out`);
      return;
    }

    const html = NewReviewEmail({
      hostName: params.hostName,
      eventTitle: params.eventTitle,
      reviewerName: params.reviewerName,
      rating: params.rating,
      comment: params.comment,
      eventUrl: params.eventUrl,
    });

    await resend.emails.send({
      from: FROM_EMAIL,
      to: params.to,
      subject: `New Review for ${params.eventTitle} ⭐`,
      html,
    });

    console.log(`New review notification sent to ${params.to} for ${params.eventTitle}`);
  } catch (error) {
    console.error("Error sending new review notification:", error);
    throw error;
  }
};

/**
 * Batch send event reminders 24 hours before event
 * This should be called by a cron job
 */
export const sendUpcomingEventReminders = async () => {
  try {
    const { prisma } = await import("../utils/prisma");

    // Get events happening in the next 24 hours
    const tomorrow = new Date();
    tomorrow.setHours(tomorrow.getHours() + 24);

    const upcomingEvents = await prisma.event.findMany({
      where: {
        date: {
          gte: new Date(),
          lte: tomorrow,
        },
        status: "OPEN",
      },
      include: {
        participants: {
          include: {
            user: true,
          },
        },
        host: true,
      },
    });

    console.log(`Found ${upcomingEvents.length} events in the next 24 hours`);

    for (const event of upcomingEvents) {
      for (const participant of event.participants) {
        // Check if user wants reminders (when we add preferences)
        // For now, send to everyone

        const eventDate = new Date(event.date);
        const eventUrl = `${process.env.CLIENT_URL}/events/${event.id}`;

        await sendEventReminder({
          to: participant.user.email,
          userName: participant.user.name,
          eventTitle: event.title,
          eventDate: eventDate.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          eventTime: eventDate.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          eventLocation: event.location,
          eventUrl,
        });

        // Add small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    console.log(`Sent reminders for ${upcomingEvents.length} events`);
  } catch (error) {
    console.error("Error sending upcoming event reminders:", error);
    throw error;
  }
};
