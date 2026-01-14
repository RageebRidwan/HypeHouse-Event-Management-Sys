import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

/**
 * Send verification email to new user
 */
export async function sendVerificationEmail(
  email: string,
  name: string,
  token: string
): Promise<void> {
  const verificationUrl = `${CLIENT_URL}/verify-email?token=${token}`;

  try {
    await resend.emails.send({
      from: "Hypehouse <onboarding@resend.dev>", // Change this to your verified domain
      to: email,
      subject: "Verify your email - Hypehouse",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <!-- Header with gradient -->
            <div style="background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%); padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 32px; font-weight: bold;">Hypehouse</h1>
            </div>

            <!-- Content -->
            <div style="background: #ffffff; padding: 40px 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
              <h2 style="color: #1f2937; margin-top: 0; font-size: 24px;">Welcome to Hypehouse, ${name}! 🎉</h2>

              <p style="color: #4b5563; font-size: 16px; margin: 20px 0;">
                Thanks for signing up! We're excited to have you join our community of event enthusiasts.
              </p>

              <p style="color: #4b5563; font-size: 16px; margin: 20px 0;">
                To get started, please verify your email address by clicking the button below:
              </p>

              <!-- CTA Button -->
              <div style="text-align: center; margin: 35px 0;">
                <a href="${verificationUrl}" style="display: inline-block; background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(124, 58, 237, 0.3);">
                  Verify Email Address
                </a>
              </div>

              <p style="color: #6b7280; font-size: 14px; margin: 30px 0 10px 0;">
                Or copy and paste this link into your browser:
              </p>
              <p style="color: #7c3aed; font-size: 14px; word-break: break-all; background: #f9fafb; padding: 12px; border-radius: 6px; border: 1px solid #e5e7eb;">
                ${verificationUrl}
              </p>

              <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid #e5e7eb;">
                <p style="color: #6b7280; font-size: 14px; margin: 10px 0;">
                  <strong>Note:</strong> This verification link will expire in 24 hours.
                </p>
                <p style="color: #6b7280; font-size: 14px; margin: 10px 0;">
                  If you didn't create an account with Hypehouse, you can safely ignore this email.
                </p>
              </div>
            </div>

            <!-- Footer -->
            <div style="text-align: center; margin-top: 30px; color: #9ca3af; font-size: 12px;">
              <p>© 2026 Hypehouse. All rights reserved.</p>
              <p>Bringing people together through amazing events.</p>
            </div>
          </body>
        </html>
      `,
    });
  } catch (error) {
    console.error("Failed to send verification email:", error);
    throw new Error("Failed to send verification email");
  }
}

/**
 * Send welcome email after email verification
 */
export async function sendWelcomeEmail(
  email: string,
  name: string
): Promise<void> {
  try {
    await resend.emails.send({
      from: "Hypehouse <onboarding@resend.dev>",
      to: email,
      subject: "Welcome to Hypehouse! 🎉",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%); padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 32px; font-weight: bold;">Hypehouse</h1>
            </div>

            <div style="background: #ffffff; padding: 40px 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
              <h2 style="color: #1f2937; margin-top: 0; font-size: 24px;">You're all set, ${name}! ✅</h2>

              <p style="color: #4b5563; font-size: 16px; margin: 20px 0;">
                Your email has been verified successfully. You now have access to all Hypehouse features!
              </p>

              <h3 style="color: #1f2937; font-size: 18px; margin-top: 30px;">What's next?</h3>

              <ul style="color: #4b5563; font-size: 16px; line-height: 1.8;">
                <li>📋 <strong>Complete your profile</strong> - Add a bio, location, and interests</li>
                <li>🎯 <strong>Discover events</strong> - Browse amazing events in your area</li>
                <li>🎫 <strong>Join events</strong> - Register for events that interest you</li>
                <li>⭐ <strong>Become a host</strong> - Create your own events and bring people together</li>
              </ul>

              <div style="text-align: center; margin: 35px 0;">
                <a href="${CLIENT_URL}/events" style="display: inline-block; background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(124, 58, 237, 0.3);">
                  Explore Events
                </a>
              </div>

              <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid #e5e7eb;">
                <p style="color: #6b7280; font-size: 14px;">
                  Need help getting started? Check out our <a href="${CLIENT_URL}/help" style="color: #7c3aed; text-decoration: none;">Help Center</a> or reply to this email.
                </p>
              </div>
            </div>

            <div style="text-align: center; margin-top: 30px; color: #9ca3af; font-size: 12px;">
              <p>© 2026 Hypehouse. All rights reserved.</p>
            </div>
          </body>
        </html>
      `,
    });
  } catch (error) {
    console.error("Failed to send welcome email:", error);
    // Don't throw - welcome email is not critical
  }
}

/**
 * Send email when user joins an event
 */
export async function sendEventJoinedEmail(
  email: string,
  name: string,
  eventTitle: string,
  eventDate: string,
  eventLocation: string
): Promise<void> {
  try {
    await resend.emails.send({
      from: "Hypehouse <events@resend.dev>",
      to: email,
      subject: `You're registered for ${eventTitle}! 🎉`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%); padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 32px; font-weight: bold;">Hypehouse</h1>
            </div>

            <div style="background: #ffffff; padding: 40px 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
              <h2 style="color: #1f2937; margin-top: 0; font-size: 24px;">Registration Confirmed! 🎫</h2>

              <p style="color: #4b5563; font-size: 16px; margin: 20px 0;">
                Hi ${name},
              </p>

              <p style="color: #4b5563; font-size: 16px; margin: 20px 0;">
                You're all set for <strong>${eventTitle}</strong>! We can't wait to see you there.
              </p>

              <div style="background: #f9fafb; border-left: 4px solid #7c3aed; padding: 20px; margin: 30px 0; border-radius: 6px;">
                <h3 style="color: #1f2937; margin-top: 0; font-size: 18px;">Event Details</h3>
                <p style="color: #4b5563; margin: 10px 0;"><strong>📅 Date:</strong> ${eventDate}</p>
                <p style="color: #4b5563; margin: 10px 0;"><strong>📍 Location:</strong> ${eventLocation}</p>
              </div>

              <div style="text-align: center; margin: 35px 0;">
                <a href="${CLIENT_URL}/dashboard" style="display: inline-block; background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(124, 58, 237, 0.3);">
                  View My Events
                </a>
              </div>

              <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid #e5e7eb;">
                <p style="color: #6b7280; font-size: 14px;">
                  We'll send you a reminder 24 hours before the event. See you there!
                </p>
              </div>
            </div>

            <div style="text-align: center; margin-top: 30px; color: #9ca3af; font-size: 12px;">
              <p>© 2026 Hypehouse. All rights reserved.</p>
            </div>
          </body>
        </html>
      `,
    });
  } catch (error) {
    console.error("Failed to send event joined email:", error);
  }
}

/**
 * Send event reminder 24 hours before event
 */
export async function sendEventReminderEmail(
  email: string,
  name: string,
  eventTitle: string,
  eventDate: string,
  eventLocation: string
): Promise<void> {
  try {
    await resend.emails.send({
      from: "Hypehouse <events@resend.dev>",
      to: email,
      subject: `Reminder: ${eventTitle} is tomorrow! ⏰`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%); padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 32px; font-weight: bold;">Hypehouse</h1>
            </div>

            <div style="background: #ffffff; padding: 40px 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
              <h2 style="color: #1f2937; margin-top: 0; font-size: 24px;">Don't forget! Your event is tomorrow ⏰</h2>

              <p style="color: #4b5563; font-size: 16px; margin: 20px 0;">
                Hi ${name},
              </p>

              <p style="color: #4b5563; font-size: 16px; margin: 20px 0;">
                This is a friendly reminder that <strong>${eventTitle}</strong> is happening soon!
              </p>

              <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 30px 0; border-radius: 6px;">
                <h3 style="color: #92400e; margin-top: 0; font-size: 18px;">⏰ Event Tomorrow</h3>
                <p style="color: #78350f; margin: 10px 0;"><strong>📅 Date:</strong> ${eventDate}</p>
                <p style="color: #78350f; margin: 10px 0;"><strong>📍 Location:</strong> ${eventLocation}</p>
              </div>

              <p style="color: #4b5563; font-size: 16px; margin: 20px 0;">
                We're looking forward to seeing you there!
              </p>

              <div style="text-align: center; margin: 35px 0;">
                <a href="${CLIENT_URL}/dashboard" style="display: inline-block; background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(124, 58, 237, 0.3);">
                  View Event Details
                </a>
              </div>
            </div>

            <div style="text-align: center; margin-top: 30px; color: #9ca3af; font-size: 12px;">
              <p>© 2026 Hypehouse. All rights reserved.</p>
            </div>
          </body>
        </html>
      `,
    });
  } catch (error) {
    console.error("Failed to send event reminder email:", error);
  }
}

/**
 * Send notification to host when someone joins their event
 */
export async function sendNewParticipantEmail(
  hostEmail: string,
  hostName: string,
  participantName: string,
  eventTitle: string
): Promise<void> {
  try {
    await resend.emails.send({
      from: "Hypehouse <events@resend.dev>",
      to: hostEmail,
      subject: `New registration for ${eventTitle}! 🎉`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%); padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 32px; font-weight: bold;">Hypehouse</h1>
            </div>

            <div style="background: #ffffff; padding: 40px 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
              <h2 style="color: #1f2937; margin-top: 0; font-size: 24px;">Great news! 🎉</h2>

              <p style="color: #4b5563; font-size: 16px; margin: 20px 0;">
                Hi ${hostName},
              </p>

              <p style="color: #4b5563; font-size: 16px; margin: 20px 0;">
                <strong>${participantName}</strong> just registered for your event <strong>${eventTitle}</strong>!
              </p>

              <div style="text-align: center; margin: 35px 0;">
                <a href="${CLIENT_URL}/dashboard" style="display: inline-block; background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(124, 58, 237, 0.3);">
                  View Participants
                </a>
              </div>
            </div>

            <div style="text-align: center; margin-top: 30px; color: #9ca3af; font-size: 12px;">
              <p>© 2026 Hypehouse. All rights reserved.</p>
            </div>
          </body>
        </html>
      `,
    });
  } catch (error) {
    console.error("Failed to send new participant email:", error);
  }
}

/**
 * Send payment receipt
 */
export async function sendPaymentReceiptEmail(
  email: string,
  name: string,
  eventTitle: string,
  amount: number,
  paymentId: string
): Promise<void> {
  try {
    await resend.emails.send({
      from: "Hypehouse <payments@resend.dev>",
      to: email,
      subject: `Payment Confirmation - ${eventTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%); padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 32px; font-weight: bold;">Hypehouse</h1>
            </div>

            <div style="background: #ffffff; padding: 40px 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
              <h2 style="color: #1f2937; margin-top: 0; font-size: 24px;">Payment Successful! ✅</h2>

              <p style="color: #4b5563; font-size: 16px; margin: 20px 0;">
                Hi ${name},
              </p>

              <p style="color: #4b5563; font-size: 16px; margin: 20px 0;">
                Your payment for <strong>${eventTitle}</strong> has been processed successfully.
              </p>

              <div style="background: #f0fdf4; border-left: 4px solid #10b981; padding: 20px; margin: 30px 0; border-radius: 6px;">
                <h3 style="color: #065f46; margin-top: 0; font-size: 18px;">Payment Details</h3>
                <p style="color: #064e3b; margin: 10px 0;"><strong>Amount Paid:</strong> $${amount.toFixed(2)}</p>
                <p style="color: #064e3b; margin: 10px 0;"><strong>Payment ID:</strong> ${paymentId}</p>
                <p style="color: #064e3b; margin: 10px 0;"><strong>Event:</strong> ${eventTitle}</p>
              </div>

              <p style="color: #6b7280; font-size: 14px; margin: 30px 0;">
                This email serves as your receipt. Please keep it for your records.
              </p>
            </div>

            <div style="text-align: center; margin-top: 30px; color: #9ca3af; font-size: 12px;">
              <p>© 2026 Hypehouse. All rights reserved.</p>
            </div>
          </body>
        </html>
      `,
    });
  } catch (error) {
    console.error("Failed to send payment receipt email:", error);
  }
}
