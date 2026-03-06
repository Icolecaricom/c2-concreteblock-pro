import { NextRequest, NextResponse } from 'next/server';
import {
  createPaymentIntent,
  getPaymentIntent,
  createRefund,
} from '@/lib/stripe';
import { db } from '@/lib/db';

// Create payment intent for direct payment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, description, customerEmail, customerName, customerPhone, orderId } = body;

    if (!amount || !customerEmail || !customerName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await createPaymentIntent({
      amount,
      description: description || `C2 ConcreteBlock Pro Order`,
      customerEmail,
      customerName,
      customerPhone,
      metadata: { orderId: orderId || '' },
    });

    if (result.success) {
      // Update order with payment intent ID if orderId provided
      if (orderId) {
        try {
          await db.order.update({
            where: { id: orderId },
            data: {
              notes: `Payment Intent: ${result.paymentIntentId}`,
            },
          });
        } catch (e) {
          console.log('Could not update order notes:', e);
        }
      }

      return NextResponse.json({
        success: true,
        clientSecret: result.clientSecret,
        paymentIntentId: result.paymentIntentId,
      });
    }

    return NextResponse.json(
      { error: result.error },
      { status: 400 }
    );
  } catch (error) {
    console.error('Payment API error:', error);
    return NextResponse.json(
      { error: 'Payment processing failed' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const paymentIntentId = searchParams.get('paymentIntentId');

  if (!paymentIntentId) {
    return NextResponse.json(
      { error: 'Payment intent ID required' },
      { status: 400 }
    );
  }

  const result = await getPaymentIntent(paymentIntentId);

  if (result.success) {
    return NextResponse.json({
      success: true,
      status: result.status,
      amount: result.amount,
      metadata: result.metadata,
    });
  }

  return NextResponse.json(
    { error: result.error },
    { status: 400 }
  );
}
