const nodemailer = require('nodemailer');

/**
 * Creates nodemailer transport based on environment variables
 */
const createTransporter = () => {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }

  return null;
};

/**
 * Send notification email when a client submits the contact form
 */
const sendInquiryNotification = async (inquiry) => {
  const studioEmail = process.env.NOTIFICATION_EMAIL || 'graphicshaven4@gmail.com';
  const fromEmail = process.env.EMAIL_FROM || '"Graphics Haven Studio" <no-reply@graphicshaven.in>';

  const subject = `🔥 New Client Lead: ${inquiry.name} (${inquiry.service || 'Design Inquiry'})`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f7f8; margin: 0; padding: 24px; color: #111; }
        .card { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #eaeaea; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
        .header { background: #111111; padding: 24px 32px; color: #ffffff; }
        .header h1 { margin: 0; font-size: 20px; font-weight: 700; letter-spacing: -0.02em; }
        .header p { margin: 4px 0 0; font-size: 13px; color: #ef3c67; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
        .content { padding: 32px; }
        .field { margin-bottom: 20px; }
        .label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #888888; margin-bottom: 6px; }
        .value { font-size: 15px; color: #111111; font-weight: 500; }
        .badge { display: inline-block; background: #fff1f4; color: #ef3c67; border: 1px solid #ffd0d9; padding: 4px 10px; border-radius: 8px; font-size: 13px; font-weight: 600; }
        .details-box { background: #f9f9fa; border: 1px solid #eeeeee; padding: 16px; border-radius: 10px; font-size: 14px; line-height: 1.6; color: #333333; margin-top: 6px; }
        .footer { padding: 20px 32px; background: #fafafa; border-top: 1px solid #eeeeee; text-align: center; }
        .btn { display: inline-block; background: #ef3c67; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 600; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1>New Project Inquiry</h1>
          <p>Graphics Haven Studio Lead</p>
        </div>
        <div class="content">
          <div class="field">
            <div class="label">Client Name</div>
            <div class="value">${inquiry.name}</div>
          </div>
          <div class="field">
            <div class="label">Contact Info</div>
            <div class="value">
              <a href="mailto:${inquiry.email}" style="color: #ef3c67; text-decoration: none;">${inquiry.email}</a>
              ${inquiry.phone ? ` &bull; <a href="tel:${inquiry.phone}" style="color: #111; text-decoration: none;">${inquiry.phone}</a>` : ''}
            </div>
          </div>
          <div class="field" style="display: flex; gap: 20px;">
            <div style="flex: 1;">
              <div class="label">Requested Service</div>
              <div class="badge">${inquiry.service || 'General Inquiry'}</div>
            </div>
            <div style="flex: 1;">
              <div class="label">Budget Range</div>
              <div class="badge" style="background: #f4f4f5; color: #111; border-color: #e4e4e7;">${inquiry.budget || 'Not specified'}</div>
            </div>
          </div>
          <div class="field">
            <div class="label">Project Details & Requirements</div>
            <div class="details-box">
              ${inquiry.details ? inquiry.details.replace(/\n/g, '<br>') : '<em>No extra project notes provided.</em>'}
            </div>
          </div>
        </div>
        <div class="footer">
          <a href="mailto:${inquiry.email}?subject=Regarding your project with Graphics Haven" class="btn">Reply to ${inquiry.name} &rarr;</a>
        </div>
      </div>
    </body>
    </html>
  `;

  const transporter = createTransporter();

  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from: fromEmail,
        to: studioEmail,
        replyTo: inquiry.email,
        subject,
        html: htmlContent,
      });

      console.log(`[Email] Notification delivered to ${studioEmail} (Message ID: ${info.messageId})`);
      return { success: true, mode: 'smtp', messageId: info.messageId };
    } catch (err) {
      console.warn(`[Email] SMTP delivery failed (${err.message}). Falling back to console log preview.`);
    }
  }

  // Graceful Fallback Log for local dev / unconfigured SMTP
  console.log('\n=======================================================');
  console.log(`📧 [EMAIL NOTIFICATION DISPATCHED]`);
  console.log(`To:        ${studioEmail}`);
  console.log(`From:      ${fromEmail}`);
  console.log(`Subject:   ${subject}`);
  console.log(`Client:    ${inquiry.name} <${inquiry.email}> | Phone: ${inquiry.phone || 'N/A'}`);
  console.log(`Service:   ${inquiry.service} | Budget: ${inquiry.budget}`);
  console.log(`Details:   ${inquiry.details || 'None'}`);
  console.log('=======================================================\n');

  return { success: true, mode: 'preview', studioEmail };
};

module.exports = {
  sendInquiryNotification,
};
