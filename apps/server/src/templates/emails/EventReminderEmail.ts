interface EventReminderEmailProps {
  userName: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  eventUrl: string;
}

export const EventReminderEmail = ({
  userName,
  eventTitle,
  eventDate,
  eventTime,
  eventLocation,
  eventUrl,
}: EventReminderEmailProps) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Event Reminder - ${eventTitle}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
    <!-- Header -->
    <tr>
      <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
        <div style="font-size: 48px; margin-bottom: 10px;">⏰</div>
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">Event Reminder</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Your event is coming up soon!</p>
      </td>
    </tr>

    <!-- Content -->
    <tr>
      <td style="padding: 40px 30px;">
        <h2 style="color: #1a202c; margin: 0 0 20px 0; font-size: 24px;">Hi ${userName}! 👋</h2>

        <p style="color: #4a5568; line-height: 1.6; margin: 0 0 30px 0; font-size: 16px;">
          This is a friendly reminder that you have an upcoming event:
        </p>

        <!-- Event Card -->
        <div style="background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); border-radius: 12px; padding: 25px; margin: 0 0 30px 0; border: 2px solid #e2e8f0;">
          <h3 style="color: #2d3748; margin: 0 0 20px 0; font-size: 22px; font-weight: bold;">${eventTitle}</h3>

          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding: 8px 0;">
                <span style="color: #718096; font-size: 14px;">📅 Date:</span>
                <strong style="color: #2d3748; font-size: 16px; margin-left: 10px;">${eventDate}</strong>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0;">
                <span style="color: #718096; font-size: 14px;">🕐 Time:</span>
                <strong style="color: #2d3748; font-size: 16px; margin-left: 10px;">${eventTime}</strong>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0;">
                <span style="color: #718096; font-size: 14px;">📍 Location:</span>
                <strong style="color: #2d3748; font-size: 16px; margin-left: 10px;">${eventLocation}</strong>
              </td>
            </tr>
          </table>
        </div>

        <!-- CTA Button -->
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center" style="padding: 0 0 30px 0;">
              <a href="${eventUrl}" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);">
                View Event Details
              </a>
            </td>
          </tr>
        </table>

        <div style="background: #fff5f5; border-left: 4px solid #f56565; padding: 20px; margin: 0 0 30px 0; border-radius: 4px;">
          <p style="color: #742a2a; margin: 0; font-size: 14px; line-height: 1.6;">
            <strong>Important:</strong> Don't forget to check the event details and prepare accordingly. If you can't make it, please cancel your registration so others can attend.
          </p>
        </div>

        <p style="color: #718096; line-height: 1.6; margin: 0; font-size: 14px; text-align: center;">
          See you at the event! 🎉
        </p>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background: #f7fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
        <p style="color: #718096; margin: 0 0 10px 0; font-size: 14px;">
          Need help? Contact us at <a href="mailto:support@hypehouse.com" style="color: #667eea; text-decoration: none;">support@hypehouse.com</a>
        </p>
        <p style="color: #a0aec0; margin: 0; font-size: 12px;">
          © ${new Date().getFullYear()} Hypehouse. All rights reserved.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
};
