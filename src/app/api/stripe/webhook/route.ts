import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature, stripe } from '@/lib/stripe';
import { db } from '@/lib/db';
import { sendEmail, EmailTemplates } from '@/lib/email';

// Stripe webhook handler
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature') || '';
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

    // Verify webhook signature
    const verification = verifyWebhookSignature(body, signature, webhookSecret);

    if (!verification.success) {
      console.error('Webhook signature verification failed:', verification.error);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    const event = verification.event!;

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as any;
        console.log('Payment succeeded:', paymentIntent.id);

        // Get metadata
        const { customerName, customerEmail, orderId } = paymentIntent.metadata || {};

        // Update order status if orderId exists
        if (orderId) {
          try {
            await db.order.update({
              where: { id: orderId },
              data: {
                status: 'paid',
                totalAmount: paymentIntent.amount / 100, // Convert from cents
              },
            });
          } catch (e) {
            console.error('Failed to update order:', e);
          }
        }

        // Send confirmation email
        if (customerEmail) {
          await sendEmail({
            to: customerEmail,
            ...EmailTemplates.paymentConfirmation({
              customerName: customerName || 'Customer',
              orderId: orderId || paymentIntent.id,
              amount: paymentIntent.metadata?.originalAmountGYD || paymentIntent.amount / 100,
              paymentMethod: 'Card Payment',
            }),
          });
        }

        // Send admin notification
        await sendEmail({
          to: process.env.ADMIN_EMAIL || 'admin@c2concreteblockpro.com',
          ...EmailTemplates.adminNotification({
            type: 'payment',
            details: `Payment ID: ${paymentIntent.id}\nAmount: $${paymentIntent.amount / 100}\nCustomer: ${customerName}\nEmail: ${customerEmail}`,
          }),
        });

        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as any;
        console.log('Payment failed:', paymentIntent.id);

        const { customerEmail, customerName, orderId } = paymentIntent.metadata || {};

        // Update order status
        if (orderId) {
          try {
            await db.order.update({
              where: { id: orderId },
              data: { status: 'payment_failed' },
            });
          } catch (e) {
            console.error('Failed to update order:', e);
          }
        }

        break;
      }

      case 'checkout.session.completed': {
        const session = event.data.object as any;
        console.log('Checkout session completed:', session.id);

        const { customerName, customerEmail, orderId } = session.metadata || {};

        // Update order status
        if (orderId) {
          try {
            await db.order.update({
              where: { id: orderId },
              data: {
                status: 'paid',
                totalAmount: session.amount_total / 100,
              },
            });
          } catch (e) {
            console.error('Failed to update order:', e);
          }
        }

        // Send confirmation email
        if (customerEmail) {
          await sendEmail({
            to: customerEmail,
            ...EmailTemplates.paymentConfirmation({
              customerName: customerName || 'Customer',
              orderId: orderId || session.id,
              amount: session.amount_total / 100,
              paymentMethod: 'Card Payment',
            }),
          });
        }

        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as any;
        console.log('Charge refunded:', charge.id);

        // Handle refund notification
        const { customerEmail, customerName } = charge.metadata || {};

        if (customerEmail) {
          await sendEmail({
            to: customerEmail,
            subject: 'Refund Processed - C2 ConcreteBlock Pro',
            html: `
              <h2>Refund Processed</h2>
              <p>Dear ${customerName || 'Customer'},</p>
              <p>Your refund of $${charge.amount_refunded / 100} has been processed.</p>
              <p>The refund should appear in your account within 5-10 business days.</p>
            `,
            text: `Your refund of $${charge.amount_refunded / 100} has been processed.`,
          });
        }

        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
