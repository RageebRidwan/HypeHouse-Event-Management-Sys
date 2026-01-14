interface NewReviewEmailProps {
  hostName: string;
  eventTitle: string;
  reviewerName: string;
  rating: number;
  comment: string;
  eventUrl: string;
}

export const NewReviewEmail = ({
  hostName,
  eventTitle,
  reviewerName,
  rating,
  comment,
  eventUrl,
}: NewReviewEmailProps) => {
  const stars = "⭐".repeat(rating) + "☆".repeat(5 - rating);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Review - ${eventTitle}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
    <!-- Header -->
    <tr>
      <td style="background: linear-gradient(135deg, #ecc94b 0%, #d69e2e 100%); padding: 40px 30px; text-align: center;">
        <div style="font-size: 48px; margin-bottom: 10px;">⭐</div>
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">New Review Received!</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Someone reviewed your event</p>
      </td>
    </tr>

    <!-- Content -->
    <tr>
      <td style="padding: 40px 30px;">
        <h2 style="color: #1a202c; margin: 0 0 20px 0; font-size: 24px;">Hi ${hostName}! 🎉</h2>

        <p style="color: #4a5568; line-height: 1.6; margin: 0 0 30px 0; font-size: 16px;">
          Great news! ${reviewerName} left a review for your event "<strong>${eventTitle}</strong>".
        </p>

        <!-- Review Card -->
        <div style="background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); border-radius: 12px; padding: 25px; margin: 0 0 30px 0; border: 2px solid #fbbf24;">
          <div style="text-align: center; margin-bottom: 20px;">
            <div style="font-size: 32px; letter-spacing: 4px;">${stars}</div>
            <p style="color: #92400e; margin: 10px 0 0 0; font-size: 18px; font-weight: bold;">${rating}.0 out of 5</p>
          </div>

          <div style="background: white; border-radius: 8px; padding: 20px;">
            <p style="color: #78350f; margin: 0 0 10px 0; font-size: 14px; font-weight: 600;">Review by ${reviewerName}:</p>
            <p style="color: #92400e; margin: 0; font-size: 16px; line-height: 1.6; font-style: italic;">"${comment}"</p>
          </div>
        </div>

        <!-- CTA Button -->
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center" style="padding: 0 0 30px 0;">
              <a href="${eventUrl}" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);">
                View Event & All Reviews
              </a>
            </td>
          </tr>
        </table>

        <div style="background: #f0fdf4; border-left: 4px solid #10b981; padding: 20px; margin: 0 0 30px 0; border-radius: 4px;">
          <h4 style="color: #065f46; margin: 0 0 10px 0; font-size: 16px;">💡 Pro Tip:</h4>
          <p style="color: #047857; margin: 0; font-size: 14px; line-height: 1.6;">
            Reviews help build trust with potential attendees. Encourage participants to leave feedback after your events to showcase your hosting quality!
          </p>
        </div>

        <p style="color: #718096; line-height: 1.6; margin: 0; font-size: 14px; text-align: center;">
          Keep up the great work! 🌟
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
