interface WelcomeEmailProps {
  name: string;
  verificationUrl: string;
}

export const WelcomeEmail = ({ name, verificationUrl }: WelcomeEmailProps) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Hypehouse</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
    <!-- Header -->
    <tr>
      <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 32px; font-weight: bold;">Welcome to Hypehouse!</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Your event discovery journey begins here</p>
      </td>
    </tr>

    <!-- Content -->
    <tr>
      <td style="padding: 40px 30px;">
        <h2 style="color: #1a202c; margin: 0 0 20px 0; font-size: 24px;">Hi ${name}! 👋</h2>

        <p style="color: #4a5568; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;">
          We're thrilled to have you join Hypehouse! You're now part of a vibrant community where discovering and hosting amazing events is just a click away.
        </p>

        <p style="color: #4a5568; line-height: 1.6; margin: 0 0 30px 0; font-size: 16px;">
          To get started, please verify your email address by clicking the button below:
        </p>

        <!-- CTA Button -->
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center" style="padding: 0 0 30px 0;">
              <a href="${verificationUrl}" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);">
                Verify Email Address
              </a>
            </td>
          </tr>
        </table>

        <div style="background: #f7fafc; border-left: 4px solid #667eea; padding: 20px; margin: 0 0 30px 0; border-radius: 4px;">
          <h3 style="color: #2d3748; margin: 0 0 10px 0; font-size: 18px;">What's Next?</h3>
          <ul style="color: #4a5568; margin: 0; padding-left: 20px; line-height: 1.8;">
            <li>Complete your profile to personalize your experience</li>
            <li>Browse upcoming events in your area</li>
            <li>Become a host and create your own events</li>
            <li>Connect with like-minded people</li>
          </ul>
        </div>

        <p style="color: #718096; line-height: 1.6; margin: 0; font-size: 14px;">
          If the button doesn't work, copy and paste this link into your browser:<br>
          <a href="${verificationUrl}" style="color: #667eea; word-break: break-all;">${verificationUrl}</a>
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
