'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2, ShoppingBag, ArrowRight, Download, Mail } from 'lucide-react';
import Link from 'next/link';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState<{
    orderId: string;
    sessionId?: string;
    amount?: number;
    customerEmail?: string;
  } | null>(null);

  const sessionId = searchParams.get('session_id');
  const orderId = searchParams.get('order_id');
  const paymentIntent = searchParams.get('payment_intent');

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        if (sessionId) {
          // Fetch session details from Stripe
          const response = await fetch(`/api/stripe/checkout-session?sessionId=${sessionId}`);
          if (response.ok) {
            const data = await response.json();
            setPaymentDetails({
              orderId: orderId || data.metadata?.orderId || 'Unknown',
              sessionId,
              amount: data.amount_total,
              customerEmail: data.customer_email,
            });
          }
        } else if (paymentIntent) {
          const response = await fetch(`/api/stripe/payment-intent?paymentIntentId=${paymentIntent}`);
          if (response.ok) {
            const data = await response.json();
            setPaymentDetails({
              orderId: orderId || data.metadata?.orderId || 'Unknown',
              amount: data.amount,
              customerEmail: data.metadata?.customerEmail,
            });
          }
        } else if (orderId) {
          setPaymentDetails({
            orderId,
          });
        }
      } catch (error) {
        console.error('Error fetching payment details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [sessionId, orderId, paymentIntent]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#F97316] mx-auto mb-4" />
          <p className="text-gray-600">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
      <Card className="max-w-lg w-full shadow-xl">
        <CardContent className="pt-8 pb-8 px-6 text-center">
          {/* Success Icon */}
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-14 w-14 text-green-600" />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-[#1E3A5F] mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-600 mb-6">
            Thank you for your order. Your payment has been processed successfully.
          </p>

          {/* Order Details */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Order Number:</span>
                <span className="font-bold text-[#F97316]">
                  #{paymentDetails?.orderId?.slice(-8).toUpperCase() || 'N/A'}
                </span>
              </div>
              {paymentDetails?.amount && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Amount Paid:</span>
                  <span className="font-bold">
                    ${(paymentDetails.amount / 100).toLocaleString()} USD
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">Status:</span>
                <span className="inline-flex items-center gap-1 text-green-600 font-medium">
                  <CheckCircle className="h-4 w-4" />
                  Confirmed
                </span>
              </div>
            </div>
          </div>

          {/* Email Notice */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6 flex items-start gap-3">
            <Mail className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-800 text-left">
              A confirmation email has been sent to {paymentDetails?.customerEmail || 'your email address'}. 
              Please check your inbox for order details and tracking information.
            </p>
          </div>

          {/* What's Next */}
          <div className="text-left mb-6">
            <h3 className="font-semibold text-[#1E3A5F] mb-3">What happens next?</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Order confirmation email sent</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Our team will process your order within 24 hours</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>You&apos;ll receive delivery/pickup instructions</span>
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              asChild
              className="w-full bg-[#F97316] hover:bg-orange-600 h-12"
            >
              <Link href="/">
                <ShoppingBag className="h-5 w-5 mr-2" />
                Continue Shopping
              </Link>
            </Button>
            {paymentDetails?.orderId && (
              <Button
                variant="outline"
                asChild
                className="w-full h-12"
              >
                <a href={`/api/invoice?orderId=${paymentDetails.orderId}`} target="_blank" rel="noopener noreferrer">
                  <Download className="h-5 w-5 mr-2" />
                  Download Invoice
                </a>
              </Button>
            )}
          </div>

          {/* Contact Info */}
          <p className="text-sm text-gray-500 mt-6">
            Questions about your order? Contact us at{' '}
            <a href="tel:+592-XXX-XXXX" className="text-[#F97316] hover:underline">
              +592-XXX-XXXX
            </a>
            {' '}or{' '}
            <a href="mailto:orders@c2concreteblockpro.com" className="text-[#F97316] hover:underline">
              orders@c2concreteblockpro.com
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-[#F97316]" />
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
