'use client';

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
  ExpressCheckoutElement,
} from '@stripe/react-stripe-js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  CreditCard,
  Lock,
  Shield,
  CheckCircle,
  Loader2,
  ArrowLeft,
  Wallet,
  Building,
} from 'lucide-react';
import { toast } from 'sonner';

// Load Stripe outside of component render to avoid recreating
const stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder';
const stripePromise = loadStripe(stripePublicKey);

interface StripePaymentFormProps {
  amount: number;
  amountGYD: number;
  clientSecret: string;
  customerEmail: string;
  customerName: string;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
  onBack?: () => void;
}

function PaymentFormContent({
  amount,
  amountGYD,
  customerEmail,
  customerName,
  onSuccess,
  onError,
  onBack,
}: Omit<StripePaymentFormProps, 'clientSecret'>) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setMessage(null);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
          receipt_email: customerEmail,
          payment_method_data: {
            billing_details: {
              name: customerName,
              email: customerEmail,
            },
          },
        },
        redirect: 'if_required',
      });

      if (error) {
        setMessage(error.message || 'Payment failed');
        onError(error.message || 'Payment failed');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntent.id);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Payment failed';
      setMessage(errorMsg);
      onError(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Amount Display */}
      <div className="bg-gradient-to-r from-[#1E3A5F] to-[#2d5a8a] rounded-xl p-6 text-white">
        <p className="text-sm opacity-80">Amount to Pay</p>
        <p className="text-4xl font-bold">${amount.toLocaleString()} USD</p>
        <p className="text-sm mt-1 opacity-70">
          ≈ ${amountGYD.toLocaleString()} GYD
        </p>
      </div>

      {/* Accepted Cards */}
      <div className="flex items-center justify-center gap-3 py-3">
        <p className="text-sm text-gray-500">We accept:</p>
        <div className="flex gap-2">
          {/* Visa */}
          <div className="w-14 h-9 rounded border border-gray-200 flex items-center justify-center bg-white shadow-sm">
            <svg viewBox="0 0 48 32" className="w-10 h-5">
              <rect fill="#1A1F71" width="48" height="32" rx="4"/>
              <text x="8" y="21" fill="white" fontSize="12" fontWeight="bold" fontFamily="Arial">VISA</text>
            </svg>
          </div>
          {/* Mastercard */}
          <div className="w-14 h-9 rounded border border-gray-200 flex items-center justify-center bg-white shadow-sm">
            <svg viewBox="0 0 48 32" className="w-10 h-5">
              <rect fill="#000" width="48" height="32" rx="4"/>
              <circle cx="18" cy="16" r="10" fill="#EB001B"/>
              <circle cx="30" cy="16" r="10" fill="#F79E1B"/>
            </svg>
          </div>
          {/* Amex */}
          <div className="w-14 h-9 rounded border border-gray-200 flex items-center justify-center bg-white shadow-sm">
            <svg viewBox="0 0 48 32" className="w-10 h-5">
              <rect fill="#006FCF" width="48" height="32" rx="4"/>
              <text x="4" y="20" fill="white" fontSize="8" fontWeight="bold" fontFamily="Arial">AMEX</text>
            </svg>
          </div>
          {/* Discover */}
          <div className="w-14 h-9 rounded border border-gray-200 flex items-center justify-center bg-white shadow-sm">
            <svg viewBox="0 0 48 32" className="w-10 h-5">
              <rect fill="#FF6000" width="48" height="32" rx="4"/>
              <text x="4" y="20" fill="white" fontSize="7" fontWeight="bold" fontFamily="Arial">DISCOVER</text>
            </svg>
          </div>
        </div>
      </div>

      {/* Express Checkout (Apple Pay, Google Pay) */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-gray-700">Express Checkout</p>
        <ExpressCheckoutElement
          options={{
            buttonHeight: 48,
            buttonType: {
              googlePay: 'buy',
              applePay: 'buy',
            },
          }}
        />
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">Or pay with card</span>
          </div>
        </div>
      </div>

      {/* Payment Element */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CreditCard className="h-5 w-5 text-[#F97316]" />
            Card Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <PaymentElement
            options={{
              layout: 'tabs',
              defaultValues: {
                billingDetails: {
                  name: customerName,
                  email: customerEmail,
                },
              },
            }}
          />

          {/* Security Info */}
          <div className="bg-green-50 rounded-lg p-3 flex items-start gap-2">
            <Shield className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-green-800">
              <p className="font-medium">Secure Payment</p>
              <p className="text-green-600">Your card information is encrypted and secure. We never store your full card details.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Message */}
      {message && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {message}
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-3">
        {onBack && (
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="flex-1"
            disabled={isProcessing}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        )}
        <Button
          type="submit"
          disabled={!stripe || isProcessing}
          className="flex-1 bg-[#F97316] hover:bg-orange-600 h-14 text-lg font-semibold"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Lock className="h-5 w-5 mr-2" />
              Pay ${amount.toLocaleString()} USD
            </>
          )}
        </Button>
      </div>

      {/* Stripe Badge */}
      <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
        <svg viewBox="0 0 40 16" className="h-4">
          <text x="0" y="12" fill="#635BFF" fontSize="12" fontWeight="bold" fontFamily="Arial">stripe</text>
        </svg>
        <span>Secured by Stripe</span>
      </div>
    </form>
  );
}

// Main exported component that wraps with Elements
export function StripePaymentForm({
  amount,
  amountGYD,
  clientSecret,
  customerEmail,
  customerName,
  onSuccess,
  onError,
  onBack,
}: StripePaymentFormProps) {
  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
      variables: {
        colorPrimary: '#F97316',
        colorBackground: '#ffffff',
        colorText: '#1E3A5F',
        colorDanger: '#ef4444',
        borderRadius: '8px',
        spacingUnit: '4px',
      },
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <PaymentFormContent
        amount={amount}
        amountGYD={amountGYD}
        customerEmail={customerEmail}
        customerName={customerName}
        onSuccess={onSuccess}
        onError={onError}
        onBack={onBack}
      />
    </Elements>
  );
}

// Payment Method Selection Component with improved UI
export function PaymentMethodSelector({
  selectedMethod,
  onMethodChange,
}: {
  selectedMethod: 'card' | 'stripe_checkout' | 'bank_transfer' | 'cash_on_delivery';
  onMethodChange: (method: 'card' | 'stripe_checkout' | 'bank_transfer' | 'cash_on_delivery') => void;
}) {
  const methods = [
    {
      id: 'card' as const,
      name: 'Credit/Debit Card',
      description: 'Pay securely with Visa, Mastercard, or American Express',
      icon: CreditCard,
      badge: 'Instant',
      badgeColor: 'bg-green-500',
      recommended: true,
    },
    {
      id: 'stripe_checkout' as const,
      name: 'Stripe Checkout',
      description: 'Fast checkout with saved cards and digital wallets',
      icon: Wallet,
      badge: 'Recommended',
      badgeColor: 'bg-[#635BFF]',
      recommended: false,
    },
    {
      id: 'bank_transfer' as const,
      name: 'Bank Transfer',
      description: 'Transfer directly to our bank account',
      icon: Building,
      badge: 'Manual',
      badgeColor: 'bg-blue-500',
      recommended: false,
    },
    {
      id: 'cash_on_delivery' as const,
      name: 'Cash on Delivery',
      description: 'Pay when you receive your order',
      icon: Wallet,
      badge: 'On Delivery',
      badgeColor: 'bg-gray-500',
      recommended: false,
    },
  ];

  return (
    <div className="space-y-3">
      {methods.map((method) => (
        <div
          key={method.id}
          className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
            selectedMethod === method.id
              ? 'border-[#F97316] bg-orange-50 shadow-md'
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => onMethodChange(method.id)}
        >
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              selectedMethod === method.id ? 'bg-[#F97316] text-white' : 'bg-gray-100 text-gray-500'
            }`}>
              <method.icon className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-[#1E3A5F]">{method.name}</p>
                <Badge className={`${method.badgeColor} text-white text-xs`}>
                  {method.badge}
                </Badge>
              </div>
              <p className="text-sm text-gray-500">{method.description}</p>
            </div>
            {selectedMethod === method.id && (
              <CheckCircle className="h-6 w-6 text-[#F97316]" />
            )}
          </div>

          {/* Card logos for card payment */}
          {method.id === 'card' && selectedMethod === method.id && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-orange-200">
              <span className="text-xs text-gray-500">Accepted cards:</span>
              <div className="flex gap-1">
                <div className="w-10 h-6 bg-white rounded border border-gray-200 flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-800">VISA</span>
                </div>
                <div className="w-10 h-6 bg-white rounded border border-gray-200 flex items-center justify-center">
                  <div className="flex">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500 -ml-1"></div>
                  </div>
                </div>
                <div className="w-10 h-6 bg-white rounded border border-gray-200 flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-600">AMEX</span>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
