// Email Service Configuration
// Supports multiple email providers: SendGrid, Mailgun, SMTP, etc.

interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
}

interface EmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

// Email configuration
const EMAIL_CONFIG = {
  // Provider: 'sendgrid' | 'mailgun' | 'smtp' | 'console'
  provider: process.env.EMAIL_PROVIDER || 'console',

  // SendGrid
  sendgrid: {
    apiKey: process.env.SENDGRID_API_KEY || '',
    fromEmail: process.env.EMAIL_FROM || 'noreply@c2concreteblockpro.com',
    fromName: 'C2 ConcreteBlock Pro',
  },

  // Mailgun
  mailgun: {
    apiKey: process.env.MAILGUN_API_KEY || '',
    domain: process.env.MAILGUN_DOMAIN || '',
    fromEmail: process.env.EMAIL_FROM || 'noreply@c2concreteblockpro.com',
  },

  // SMTP (for custom email servers)
  smtp: {
    host: process.env.SMTP_HOST || '',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    fromEmail: process.env.EMAIL_FROM || 'noreply@c2concreteblockpro.com',
  },
};

// Send email using configured provider
export async function sendEmail(options: EmailOptions): Promise<EmailResponse> {
  const { provider } = EMAIL_CONFIG;

  // Console logging for development
  if (provider === 'console' || process.env.NODE_ENV === 'development') {
    console.log('\n========== EMAIL ==========');
    console.log('To:', Array.isArray(options.to) ? options.to.join(', ') : options.to);
    console.log('Subject:', options.subject);
    console.log('Body:', options.text || 'HTML email (see HTML content)');
    console.log('============================\n');
    return { success: true, messageId: `console-${Date.now()}` };
  }

  try {
    switch (provider) {
      case 'sendgrid':
        return await sendWithSendGrid(options);
      case 'mailgun':
        return await sendWithMailgun(options);
      case 'smtp':
        return await sendWithSMTP(options);
      default:
        throw new Error(`Unknown email provider: ${provider}`);
    }
  } catch (error) {
    console.error('Email send error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email',
    };
  }
}

// SendGrid implementation
async function sendWithSendGrid(options: EmailOptions): Promise<EmailResponse> {
  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${EMAIL_CONFIG.sendgrid.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      personalizations: [
        {
          to: Array.isArray(options.to)
            ? options.to.map((email) => ({ email }))
            : [{ email: options.to }],
        },
      ],
      from: {
        email: EMAIL_CONFIG.sendgrid.fromEmail,
        name: EMAIL_CONFIG.sendgrid.fromName,
      },
      subject: options.subject,
      content: [
        {
          type: 'text/plain',
          value: options.text || '',
        },
        {
          type: 'text/html',
          value: options.html,
        },
      ],
      attachments: options.attachments?.map((att) => ({
        filename: att.filename,
        content: att.content.toString(),
        type: att.contentType || 'application/octet-stream',
        disposition: 'attachment',
      })),
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`SendGrid error: ${error}`);
  }

  return {
    success: true,
    messageId: response.headers.get('X-Message-Id') || undefined,
  };
}

// Mailgun implementation
async function sendWithMailgun(options: EmailOptions): Promise<EmailResponse> {
  const formData = new FormData();
  formData.append('from', `${EMAIL_CONFIG.sendgrid.fromName} <${EMAIL_CONFIG.mailgun.fromEmail}>`);
  formData.append('to', Array.isArray(options.to) ? options.to.join(',') : options.to);
  formData.append('subject', options.subject);
  formData.append('html', options.html);
  if (options.text) formData.append('text', options.text);

  const response = await fetch(
    `https://api.mailgun.net/v3/${EMAIL_CONFIG.mailgun.domain}/messages`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`api:${EMAIL_CONFIG.mailgun.apiKey}`).toString('base64')}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Mailgun error: ${error}`);
  }

  const data = await response.json();
  return {
    success: true,
    messageId: data.id,
  };
}

// SMTP implementation (using a simple SMTP client)
async function sendWithSMTP(options: EmailOptions): Promise<EmailResponse> {
  // For SMTP, you would typically use nodemailer
  // This is a placeholder - install nodemailer if using SMTP
  console.log('SMTP email sending - install nodemailer for production use');
  console.log('Email details:', options);
  return { success: true, messageId: `smtp-${Date.now()}` };
}

// Email templates
export const EmailTemplates = {
  // Order confirmation email
  orderConfirmation: (params: {
    customerName: string;
    orderId: string;
    items: Array<{ name: string; quantity: number; price: number }>;
    total: number;
    deliveryAddress?: string;
    estimatedDelivery?: string;
  }) => ({
    subject: `Order Confirmation - ${params.orderId}`,
    text: `
Dear ${params.customerName},

Thank you for your order from C2 ConcreteBlock Pro!

Order ID: ${params.orderId}

Items:
${params.items.map((item) => `- ${item.name} x ${item.quantity}: $${item.price} GYD`).join('\n')}

Total: $${params.total.toLocaleString()} GYD

${params.deliveryAddress ? `Delivery Address: ${params.deliveryAddress}` : ''}
${params.estimatedDelivery ? `Estimated Delivery: ${params.estimatedDelivery}` : ''}

If you have any questions, please contact us at +592 XXX-XXXX or reply to this email.

Best regards,
C2 ConcreteBlock Pro Team
    `,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #1E3A5F; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background: #f9f9f9; }
    .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .items-table th, .items-table td { padding: 10px; border-bottom: 1px solid #ddd; text-align: left; }
    .total { font-size: 1.2em; font-weight: bold; color: #1E3A5F; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 0.9em; }
    .button { display: inline-block; padding: 10px 20px; background: #F97316; color: white; text-decoration: none; border-radius: 5px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>C2 ConcreteBlock Pro</h1>
      <p>Building Stronger Foundations</p>
    </div>
    <div class="content">
      <h2>Order Confirmation</h2>
      <p>Dear ${params.customerName},</p>
      <p>Thank you for your order! Your order has been received and is being processed.</p>

      <h3>Order Details</h3>
      <p><strong>Order ID:</strong> ${params.orderId}</p>

      <table class="items-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Price (GYD)</th>
          </tr>
        </thead>
        <tbody>
          ${params.items
            .map(
              (item) => `
            <tr>
              <td>${item.name}</td>
              <td>${item.quantity}</td>
              <td>$${item.price.toLocaleString()}</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="text-align: right;"><strong>Total:</strong></td>
            <td class="total">$${params.total.toLocaleString()} GYD</td>
          </tr>
        </tfoot>
      </table>

      ${
        params.deliveryAddress
          ? `<h3>Delivery Address</h3><p>${params.deliveryAddress}</p>`
          : ''
      }
      ${
        params.estimatedDelivery
          ? `<h3>Estimated Delivery</h3><p>${params.estimatedDelivery}</p>`
          : ''
      }

      <p>If you have any questions, please contact us at +592 XXX-XXXX or reply to this email.</p>
    </div>
    <div class="footer">
      <p>C2 ConcreteBlock Pro</p>
      <p>Lot 6 De Buff Canal #2 Polder, West Bank Demerara, Region 3, Guyana</p>
      <p>GNBS Certified | Quality Assured</p>
    </div>
  </div>
</body>
</html>
    `,
  }),

  // Quote request received
  quoteRequest: (params: {
    customerName: string;
    quoteId: string;
    message: string;
  }) => ({
    subject: `Quote Request Received - ${params.quoteId}`,
    text: `
Dear ${params.customerName},

Thank you for your quote request from C2 ConcreteBlock Pro!

Your quote request has been received. Our team will review your requirements and get back to you within 24-48 hours with a detailed quote.

Quote ID: ${params.quoteId}

If you have any urgent questions, please contact us at +592 XXX-XXXX.

Best regards,
C2 ConcreteBlock Pro Team
    `,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #1E3A5F; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background: #f9f9f9; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 0.9em; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>C2 ConcreteBlock Pro</h1>
    </div>
    <div class="content">
      <h2>Quote Request Received</h2>
      <p>Dear ${params.customerName},</p>
      <p>Thank you for your quote request! We have received your inquiry and our team will review your requirements.</p>
      <p><strong>Quote ID:</strong> ${params.quoteId}</p>
      <p>Our team will get back to you within 24-48 hours with a detailed quote.</p>
      <p>If you have any urgent questions, please contact us at +592 XXX-XXXX.</p>
    </div>
    <div class="footer">
      <p>C2 ConcreteBlock Pro | GNBS Certified</p>
    </div>
  </div>
</body>
</html>
    `,
  }),

  // Plan submission received
  planSubmission: (params: {
    customerName: string;
    submissionId: string;
    projectDescription: string;
  }) => ({
    subject: `Plan Submission Received - ${params.submissionId}`,
    text: `
Dear ${params.customerName},

Thank you for submitting your construction plans to C2 ConcreteBlock Pro!

Your submission has been received. Our engineering team will review your plans and prepare a comprehensive material quantity survey.

Submission ID: ${params.submissionId}

Project Description:
${params.projectDescription}

We will contact you within 24-48 hours with your detailed material estimate.

Best regards,
C2 ConcreteBlock Pro Team
    `,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #1E3A5F; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background: #f9f9f9; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 0.9em; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>C2 ConcreteBlock Pro</h1>
    </div>
    <div class="content">
      <h2>Plan Submission Received</h2>
      <p>Dear ${params.customerName},</p>
      <p>Thank you for submitting your construction plans!</p>
      <p><strong>Submission ID:</strong> ${params.submissionId}</p>
      <p><strong>Project Description:</strong></p>
      <p>${params.projectDescription}</p>
      <p>Our engineering team will review your plans and prepare a comprehensive material quantity survey within 24-48 hours.</p>
    </div>
    <div class="footer">
      <p>C2 ConcreteBlock Pro | GNBS Certified</p>
    </div>
  </div>
</body>
</html>
    `,
  }),

  // Contact form submission
  contactForm: (params: {
    name: string;
    subject: string;
    message: string;
  }) => ({
    subject: `Thank you for contacting C2 ConcreteBlock Pro`,
    text: `
Dear ${params.name},

Thank you for contacting C2 ConcreteBlock Pro!

We have received your message and will respond within 24 hours.

Your message:
${params.message}

If you need immediate assistance, please call us at +592 XXX-XXXX.

Best regards,
C2 ConcreteBlock Pro Team
    `,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #1E3A5F; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background: #f9f9f9; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 0.9em; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>C2 ConcreteBlock Pro</h1>
    </div>
    <div class="content">
      <h2>Message Received</h2>
      <p>Dear ${params.name},</p>
      <p>Thank you for contacting us! We have received your message and will respond within 24 hours.</p>
      <p><strong>Your message:</strong></p>
      <p>${params.message}</p>
      <p>If you need immediate assistance, please call us at +592 XXX-XXXX.</p>
    </div>
    <div class="footer">
      <p>C2 ConcreteBlock Pro | GNBS Certified</p>
    </div>
  </div>
</body>
</html>
    `,
  }),

  // Payment confirmation
  paymentConfirmation: (params: {
    customerName: string;
    orderId: string;
    amount: number;
    paymentMethod: string;
  }) => ({
    subject: `Payment Confirmed - Order ${params.orderId}`,
    text: `
Dear ${params.customerName},

Your payment has been confirmed!

Order ID: ${params.orderId}
Amount: $${params.amount.toLocaleString()} GYD
Payment Method: ${params.paymentMethod}

Thank you for your business!

Best regards,
C2 ConcreteBlock Pro Team
    `,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #1E3A5F; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background: #f9f9f9; }
    .success-badge { background: #10B981; color: white; padding: 10px 20px; border-radius: 20px; display: inline-block; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 0.9em; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>C2 ConcreteBlock Pro</h1>
    </div>
    <div class="content" style="text-align: center;">
      <span class="success-badge">Payment Confirmed ✓</span>
      <h2>Thank you, ${params.customerName}!</h2>
      <p><strong>Order ID:</strong> ${params.orderId}</p>
      <p><strong>Amount:</strong> $${params.amount.toLocaleString()} GYD</p>
      <p><strong>Payment Method:</strong> ${params.paymentMethod}</p>
    </div>
    <div class="footer">
      <p>C2 ConcreteBlock Pro | GNBS Certified</p>
    </div>
  </div>
</body>
</html>
    `,
  }),

  // Admin notification
  adminNotification: (params: {
    type: 'order' | 'quote' | 'plan' | 'contact' | 'payment';
    details: string;
  }) => ({
    subject: `[ADMIN] New ${params.type.toUpperCase()} - C2 ConcreteBlock Pro`,
    text: `
New ${params.type} received:

${params.details}

--
C2 ConcreteBlock Pro Admin
    `,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #F97316; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background: #f9f9f9; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Admin Notification</h1>
    </div>
    <div class="content">
      <h2>New ${params.type.toUpperCase()}</h2>
      <pre style="white-space: pre-wrap;">${params.details}</pre>
    </div>
  </div>
</body>
</html>
    `,
  }),
};
