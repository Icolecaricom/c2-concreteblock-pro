import Stripe from 'stripe';

// Initialize Stripe with secret key
// In production, set STRIPE_SECRET_KEY in environment variables
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2023-10-16',
  typescript: true,
});

// Stripe configuration
export const STRIPE_CONFIG = {
  // Currency for Guyana - using USD as GYD is not supported by Stripe
  // You can display GYD prices and convert to USD for Stripe
  currency: 'usd',

  // Conversion rate: 1 USD = ~210 GYD (update based on current rate)
  gydToUsd: (gydAmount: number) => {
    const rate = 210; // GYD to USD conversion rate
    return Math.ceil(gydAmount / rate * 100) / 100; // Convert to USD
  },

  // Payment methods available for Guyana/Caribbean
  paymentMethods: ['card'] as const,

  // Product metadata
  metadata: {
    businessName: 'C2 ConcreteBlock Pro',
    businessAddress: 'Lot 6 De Buff Canal #2 Polder, West Bank Demerara, Region 3, Guyana',
  },
};

// Create a payment intent
export async function createPaymentIntent(params: {
  amount: number; // Amount in GYD
  description: string;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  metadata?: Record<string, string>;
}) {
  const amountUsd = STRIPE_CONFIG.gydToUsd(params.amount);
  const amountCents = Math.round(amountUsd * 100); // Stripe uses cents

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountCents,
      currency: STRIPE_CONFIG.currency,
      description: params.description,
      receipt_email: params.customerEmail,
      metadata: {
        customerName: params.customerName,
        customerPhone: params.customerPhone || '',
        originalAmountGYD: params.amount.toString(),
        ...params.metadata,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  } catch (error) {
    console.error('Stripe payment intent error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create payment intent',
    };
  }
}

// Create a checkout session for multiple items
export async function createCheckoutSession(params: {
  items: Array<{
    name: string;
    description?: string;
    amount: number; // Price in GYD
    quantity: number;
  }>;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
  allowPartialPayment?: boolean;
}) {
  try {
    // Convert line items to Stripe format
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = params.items.map((item) => ({
      price_data: {
        currency: STRIPE_CONFIG.currency,
        product_data: {
          name: item.name,
          description: item.description,
          metadata: {
            business: 'C2 ConcreteBlock Pro',
          },
        },
        unit_amount: Math.round(STRIPE_CONFIG.gydToUsd(item.amount) * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      customer_email: params.customerEmail,
      metadata: {
        customerName: params.customerName,
        customerPhone: params.customerPhone || '',
        ...params.metadata,
      },
      payment_intent_data: {
        description: `C2 ConcreteBlock Pro Order - ${params.customerName}`,
        receipt_email: params.customerEmail,
        metadata: {
          customerName: params.customerName,
          customerPhone: params.customerPhone || '',
        },
      },
    };

    // Add partial payment option for large orders
    if (params.allowPartialPayment) {
      sessionParams.payment_intent_data!.setup_future_usage = 'off_session';
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return {
      success: true,
      sessionId: session.id,
      sessionUrl: session.url,
    };
  } catch (error) {
    console.error('Stripe checkout session error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create checkout session',
    };
  }
}

// Retrieve payment intent status
export async function getPaymentIntent(paymentIntentId: string) {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    return {
      success: true,
      paymentIntent,
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      metadata: paymentIntent.metadata,
    };
  } catch (error) {
    console.error('Retrieve payment intent error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to retrieve payment',
    };
  }
}

// Create customer for recurring payments
export async function createCustomer(params: {
  email: string;
  name: string;
  phone?: string;
}) {
  try {
    const customer = await stripe.customers.create({
      email: params.email,
      name: params.name,
      phone: params.phone,
      metadata: {
        business: 'C2 ConcreteBlock Pro',
      },
    });

    return {
      success: true,
      customerId: customer.id,
    };
  } catch (error) {
    console.error('Create customer error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create customer',
    };
  }
}

// Issue a refund
export async function createRefund(params: {
  paymentIntentId: string;
  amount?: number; // Partial refund amount in cents (USD)
  reason?: 'duplicate' | 'fraudulent' | 'requested_by_customer';
}) {
  try {
    const refund = await stripe.refunds.create({
      payment_intent: params.paymentIntentId,
      amount: params.amount,
      reason: params.reason || 'requested_by_customer',
    });

    return {
      success: true,
      refundId: refund.id,
      status: refund.status,
    };
  } catch (error) {
    console.error('Refund error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process refund',
    };
  }
}

// Verify webhook signature
export function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string,
  secret: string
) {
  try {
    const event = stripe.webhooks.constructEvent(payload, signature, secret);
    return {
      success: true,
      event,
    };
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Invalid signature',
    };
  }
}
