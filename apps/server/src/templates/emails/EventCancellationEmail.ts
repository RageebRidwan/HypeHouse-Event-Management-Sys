interface EventCancellationEmailProps {
  userName: string;
  eventTitle: string;
  eventDate: string;
  hostName: string;
  refundAmount: number;
  cancellationReason?: string;
}

export const EventCancellationEmail = ({
  userName,
  eventTitle,
  eventDate,
  hostName,
  refundAmount,
  cancellationReason,
}: EventCancellationEmailProps) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Event Cancelled - ${eventTitle}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
    <!-- Header -->
    <tr>
      <td style="background: linear-gradient(135deg, #f56565 0%, #c53030 100%); padding: 40px 30px; text-align: center;">
        <div style="font-size: 48px; margin-bottom: 10px;">❌</div>
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">Event Cancelled</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">We're sorry for the inconvenience</p>
      </td>
    </tr>

    <!-- Content -->
    <tr>
      <td style="padding: 40px 30px;">
        <h2 style="color: #1a202c; margin: 0 0 20px 0; font-size: 24px;">Hi ${userName},</h2>

        <p style="color: #4a5568; line-height: 1.6; margin: 0 0 30px 0; font-size: 16px;">
          We're writing to inform you that the following event has been cancelled by the host:
        </p>

        <!-- Event Card -->
        <div style="background: #fff5f5; border-radius: 12px; padding: 25px; margin: 0 0 30px 0; border: 2px solid #feb2b2;">
          <h3 style="color: #742a2a; margin: 0 0 20px 0; font-size: 22px; font-weight: bold;">${eventTitle}</h3>

          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding: 8px 0;">
                <span style="color: #9b2c2c; font-size: 14px;">📅 Original Date:</span>
                <strong style="color: #742a2a; font-size: 16px; margin-left: 10px;">${eventDate}</strong>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0;">
                <span style="color: #9b2c2c; font-size: 14px;">👤 Host:</span>
                <strong style="color: #742a2a; font-size: 16px; margin-left: 10px;">${hostName}</strong>
              </td>
            </tr>
            ${cancellationReason ? `
            <tr>
              <td style="padding: 15px 0 8px 0; border-top: 1px solid #feb2b2;">
                <span style="color: #9b2c2c; font-size: 14px; display: block; margin-bottom: 8px;">📝 Reason:</span>
                <p style="color: #742a2a; font-size: 14px; margin: 0; line-height: 1.6; background: white; padding: 12px; border-radius: 6px;">${cancellationReason}</p>
              </td>
            </tr>
            ` : ''}
          </table>
        </div>

        ${refundAmount > 0 ? `
        <!-- Refund Info -->
        <div style="background: #f0fff4; border-left: 4px solid #48bb78; padding: 20px; margin: 0 0 30px 0; border-radius: 4px;">
          <h4 style="color: #22543d; margin: 0 0 10px 0; font-size: 18px;">💰 Refund Information</h4>
          <p style="color: #276749; margin: 0; font-size: 14px; line-height: 1.6;">
            A full refund of <strong style="font-size: 16px;">$${refundAmount.toFixed(2)}</strong> has been processed and will be credited to your original payment method within 5-7 business days.
          </p>
        </div>
        ` : ''}

        <p style="color: #4a5568; line-height: 1.6; margin: 0 0 30px 0; font-size: 16px;">
          We understand this is disappointing. We encourage you to explore other exciting events on Hypehouse!
        </p>

        <!-- CTA Button -->
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center" style="padding: 0 0 30px 0;">
              <a href="${process.env.CLIENT_URL}/events" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);">
                Browse Other Events
              </a>
            </td>
          </tr>
        </table>

        <p style="color: #718096; line-height: 1.6; margin: 0; font-size: 14px; text-align: center;">
          If you have any questions about this cancellation or your refund, please don't hesitate to contact us.
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
