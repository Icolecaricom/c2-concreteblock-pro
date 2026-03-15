import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession, stripe } from '@/lib/stripe';

// Get checkout session details
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID required' },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return NextResponse.json({
      success: true,
      id: session.id,
      amount_total: session.amount_total,
      customer_email: session.customer_email,
      metadata: session.metadata,
      payment_status: session.payment_status,
      status: session.status,
    });
  } catch (error) {
    console.error('Get session error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve session' },
      { status: 500 }
    );
  }
}

// Create Stripe Checkout session
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      items,
      customerEmail,
      customerName,
      customerPhone,
      orderId,
      amountGYD,
    } = body;

    if (!items || !customerEmail || !customerName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create checkout session
    const result = await createCheckoutSession({
      items: items.map((item: { name: string; description?: string; amount: number; quantity: number }) => ({
        name: item.name,
        description: item.description,
        amount: item.amount, // Price in GYD
        quantity: item.quantity,
      })),
      customerEmail,
      customerName,
      customerPhone,
      successUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://c2-concreteblock-pro.vercel.app'}/payment-success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
      cancelUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://c2-concreteblock-pro.vercel.app'}/?canceled=true`,
      metadata: {
        orderId: orderId || '',
        originalAmountGYD: amountGYD?.toString() || '',
      },
    });

    if (result.success && result.sessionUrl) {
      return NextResponse.json({
        success: true,
        sessionUrl: result.sessionUrl,
        sessionId: result.sessionId,
      });
    }

    return NextResponse.json(
      { error: result.error || 'Failed to create checkout session' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Checkout session API error:', error);
    return NextResponse.json(
      { error: 'Checkout session creation failed' },
      { status: 500 }
    );
  }
}
