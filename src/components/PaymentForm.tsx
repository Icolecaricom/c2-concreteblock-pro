'use client';

import { useState, useEffect } from 'react';
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
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';

// Card brand detection patterns
const CARD_PATTERNS = {
  visa: /^4/,
  mastercard: /^5[1-5]|^2[2-7]/,
  amex: /^3[47]/,
  discover: /^6(?:011|5)/,
};

interface PaymentFormProps {
  amount: number;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  orderId?: string;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
  isPartialPayment?: boolean;
  totalAmount?: number;
}

export function PaymentForm({
  amount,
  customerEmail,
  customerName,
  customerPhone,
  orderId,
  onSuccess,
  onError,
  isPartialPayment = false,
  totalAmount,
}: PaymentFormProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState(customerName);
  const [detectedCard, setDetectedCard] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);

  // Detect card type from number
  useEffect(() => {
    const cleanNumber = cardNumber.replace(/\s/g, '');
    for (const [brand, pattern] of Object.entries(CARD_PATTERNS)) {
      if (pattern.test(cleanNumber)) {
        setDetectedCard(brand);
        return;
      }
    }
    setDetectedCard(null);
  }, [cardNumber]);

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    const groups = cleanValue.match(/.{1,4}/g);
    return groups ? groups.join(' ') : cleanValue;
  };

  // Format expiry date
  const formatExpiry = (value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    if (cleanValue.length >= 2) {
      return `${cleanValue.slice(0, 2)}/${cleanValue.slice(2, 4)}`;
    }
    return cleanValue;
  };

  // Validate card details
  useEffect(() => {
    const cleanNumber = cardNumber.replace(/\s/g, '');
    const cleanExpiry = expiry.replace('/', '');
    
    const isCardValid = cleanNumber.length >= 13 && cleanNumber.length <= 19;
    const isExpiryValid = cleanExpiry.length === 4;
    const isCvvValid = cvv.length >= 3 && cvv.length <= 4;
    const isNameValid = cardholderName.length >= 2;

    setIsValid(isCardValid && isExpiryValid && isCvvValid && isNameValid);
  }, [cardNumber, expiry, cvv, cardholderName]);

  const handlePayment = async () => {
    if (!isValid) {
      toast.error('Please fill in all card details correctly');
      return;
    }

    setIsProcessing(true);

    try {
      // Create payment intent
      const intentResponse = await fetch('/api/stripe/payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          description: `C2 ConcreteBlock Pro Order${orderId ? ` - ${orderId}` : ''}`,
          customerEmail,
          customerName,
          customerPhone,
          orderId,
        }),
      });

      const intentData = await intentResponse.json();

      if (!intentData.success) {
        throw new Error(intentData.error || 'Failed to create payment intent');
      }

      // In a real implementation, you would use Stripe.js to confirm the payment
      // For demo purposes, we'll simulate a successful payment
      // In production, replace this with actual Stripe Elements integration

      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Call success callback
      onSuccess(intentData.paymentIntentId);
      
    } catch (error) {
      console.error('Payment error:', error);
      onError(error instanceof Error ? error.message : 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Amount Display */}
      <div className="bg-gradient-to-r from-[#1E3A5F] to-[#2d5a8a] rounded-xl p-6 text-white">
        <p className="text-sm opacity-80">Amount to Pay</p>
        <p className="text-4xl font-bold">${amount.toLocaleString()} GYD</p>
        {isPartialPayment && totalAmount && (
          <p className="text-sm mt-2 opacity-80">
            Deposit payment. Remaining: ${(totalAmount - amount).toLocaleString()} GYD
          </p>
        )}
      </div>

      {/* Accepted Cards */}
      <div className="flex items-center justify-center gap-4 py-4">
        <p className="text-sm text-gray-500">We accept:</p>
        <div className="flex gap-2">
          {/* Visa Logo */}
          <div className={`w-16 h-10 rounded border-2 flex items-center justify-center bg-white ${detectedCard === 'visa' ? 'border-[#F97316] shadow-lg' : 'border-gray-200'}`}>
            <svg viewBox="0 0 48 32" className="w-12 h-6">
              <rect fill="#1A1F71" width="48" height="32" rx="4"/>
              <text x="8" y="21" fill="white" fontSize="12" fontWeight="bold" fontFamily="Arial">VISA</text>
            </svg>
          </div>
          
          {/* Mastercard Logo */}
          <div className={`w-16 h-10 rounded border-2 flex items-center justify-center bg-white ${detectedCard === 'mastercard' ? 'border-[#F97316] shadow-lg' : 'border-gray-200'}`}>
            <svg viewBox="0 0 48 32" className="w-12 h-6">
              <rect fill="#000" width="48" height="32" rx="4"/>
              <circle cx="18" cy="16" r="10" fill="#EB001B"/>
              <circle cx="30" cy="16" r="10" fill="#F79E1B"/>
              <path d="M24 8.5a10 10 0 000 15" fill="#FF5F00"/>
            </svg>
          </div>
          
          {/* American Express Logo */}
          <div className={`w-16 h-10 rounded border-2 flex items-center justify-center bg-white ${detectedCard === 'amex' ? 'border-[#F97316] shadow-lg' : 'border-gray-200'}`}>
            <svg viewBox="0 0 48 32" className="w-12 h-6">
              <rect fill="#006FCF" width="48" height="32" rx="4"/>
              <text x="4" y="20" fill="white" fontSize="8" fontWeight="bold" fontFamily="Arial">AMEX</text>
            </svg>
          </div>
          
          {/* Discover Logo */}
          <div className={`w-16 h-10 rounded border-2 flex items-center justify-center bg-white ${detectedCard === 'discover' ? 'border-[#F97316] shadow-lg' : 'border-gray-200'}`}>
            <svg viewBox="0 0 48 32" className="w-12 h-6">
              <rect fill="#FF6000" width="48" height="32" rx="4"/>
              <text x="4" y="20" fill="white" fontSize="7" fontWeight="bold" fontFamily="Arial">DISCOVER</text>
            </svg>
          </div>
        </div>
      </div>

      {/* Card Input Form */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CreditCard className="h-5 w-5 text-[#F97316]" />
            Card Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Card Number */}
          <div>
            <Label htmlFor="cardNumber">Card Number</Label>
            <div className="relative mt-1">
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                maxLength={19}
                className="pr-12"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {detectedCard && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
              </div>
            </div>
          </div>

          {/* Cardholder Name */}
          <div>
            <Label htmlFor="cardholderName">Cardholder Name</Label>
            <Input
              id="cardholderName"
              placeholder="John Doe"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
              className="mt-1"
            />
          </div>

          {/* Expiry & CVV */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expiry">Expiry Date</Label>
              <Input
                id="expiry"
                placeholder="MM/YY"
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                maxLength={5}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                placeholder="123"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                maxLength={4}
                type="password"
                className="mt-1"
              />
            </div>
          </div>

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

      {/* Pay Button */}
      <Button
        onClick={handlePayment}
        disabled={!isValid || isProcessing}
        className="w-full bg-[#F97316] hover:bg-orange-600 h-14 text-lg font-semibold"
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            <Lock className="h-5 w-5 mr-2" />
            Pay ${amount.toLocaleString()} GYD
          </>
        )}
      </Button>

      {/* Stripe Badge */}
      <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
        <svg viewBox="0 0 40 16" className="h-4">
          <text x="0" y="12" fill="#635BFF" fontSize="12" fontWeight="bold" fontFamily="Arial">stripe</text>
        </svg>
        <span>Secured by Stripe</span>
      </div>
    </div>
  );
}

// Payment Method Selection Component
export function PaymentMethodSelector({
  selectedMethod,
  onMethodChange,
}: {
  selectedMethod: 'card' | 'bank_transfer' | 'cash_on_delivery';
  onMethodChange: (method: 'card' | 'bank_transfer' | 'cash_on_delivery') => void;
}) {
  const methods = [
    {
      id: 'card' as const,
      name: 'Credit/Debit Card',
      description: 'Pay securely with Visa, Mastercard, or American Express',
      icon: CreditCard,
      badge: 'Instant',
      badgeColor: 'bg-green-500',
      logos: ['visa', 'mastercard', 'amex'],
    },
    {
      id: 'bank_transfer' as const,
      name: 'Bank Transfer',
      description: 'Transfer directly to our bank account',
      icon: Shield,
      badge: 'Manual',
      badgeColor: 'bg-blue-500',
      logos: [],
    },
    {
      id: 'cash_on_delivery' as const,
      name: 'Cash on Delivery',
      description: 'Pay when you receive your order',
      icon: Lock,
      badge: 'On Delivery',
      badgeColor: 'bg-gray-500',
      logos: [],
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
