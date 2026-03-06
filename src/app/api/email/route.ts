import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, EmailTemplates } from '@/lib/email';

// Send email endpoint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    let emailContent;

    switch (type) {
      case 'order-confirmation':
        emailContent = EmailTemplates.orderConfirmation(data);
        break;
      case 'quote-request':
        emailContent = EmailTemplates.quoteRequest(data);
        break;
      case 'plan-submission':
        emailContent = EmailTemplates.planSubmission(data);
        break;
      case 'contact-form':
        emailContent = EmailTemplates.contactForm(data);
        break;
      case 'payment-confirmation':
        emailContent = EmailTemplates.paymentConfirmation(data);
        break;
      case 'admin-notification':
        emailContent = EmailTemplates.adminNotification(data);
        break;
      case 'custom':
        // Custom email with provided content
        emailContent = {
          subject: data.subject,
          html: data.html,
          text: data.text,
        };
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid email type' },
          { status: 400 }
        );
    }

    const result = await sendEmail({
      to: data.to || data.customerEmail,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
      attachments: data.attachments,
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        messageId: result.messageId,
      });
    }

    return NextResponse.json(
      { error: result.error },
      { status: 500 }
    );
  } catch (error) {
    console.error('Email API error:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
