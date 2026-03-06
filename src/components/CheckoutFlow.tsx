'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  CreditCard,
  Truck,
  MapPin,
  Clock,
  Phone,
  Mail,
  User,
  Building,
  Loader2,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Lock,
  Shield,
} from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { CouponInput } from '@/components/PromotionalBanner';
import { toast } from 'sonner';

interface CheckoutProps {
  isOpen: boolean;
  onClose: () => void;
}

type CheckoutStep = 'details' | 'delivery' | 'payment' | 'confirmation';

interface CheckoutFormData {
  // Customer Details
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;

  // Delivery
  address: string;
  city: string;
  region: string;
  deliveryInstructions: string;
  deliveryMethod: 'delivery' | 'pickup';

  // Payment
  paymentMethod: 'card' | 'bank_transfer' | 'cash_on_delivery';
  depositAmount: number; // For partial payments
  isPartialPayment: boolean;
}

const REGIONS = [
  { value: 'region-3', label: 'Region 3 (West Bank Demerara)', deliveryFree: true },
  { value: 'region-4', label: 'Region 4 (Demerara-Mahaica)', deliveryFree: false },
  { value: 'other', label: 'Other Regions (Contact for Quote)', deliveryFree: false },
];

const PRICING = {
  deliveryFee: 0, // Free within 10 miles
  deliveryFeeOutsideZone: 5000, // GYD for outside free zone
};

export function CheckoutFlow({ isOpen, onClose }: CheckoutProps) {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('details');
  const [isLoading, setIsLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [paymentClientSecret, setPaymentClientSecret] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);

  const [formData, setFormData] = useState<CheckoutFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    city: '',
    region: '',
    deliveryInstructions: '',
    deliveryMethod: 'delivery',
    paymentMethod: 'card',
    depositAmount: 0,
    isPartialPayment: false,
  });

  const totalPrice = getTotalPrice();
  const subtotal = totalPrice.min;
  const estimatedTotal = subtotal + (formData.deliveryMethod === 'delivery' && formData.region !== 'region-3' ? PRICING.deliveryFeeOutsideZone : 0);
  const finalTotal = estimatedTotal - discount;

  // Calculate deposit (50% minimum for partial payments)
  const minDeposit = Math.ceil(finalTotal * 0.5);
  const depositAmount = formData.isPartialPayment ? formData.depositAmount || minDeposit : finalTotal;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (currentStep === 'details') {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
        toast.error('Please fill in all required fields');
        return;
      }
      setCurrentStep('delivery');
    } else if (currentStep === 'delivery') {
      if (formData.deliveryMethod === 'delivery' && (!formData.address || !formData.region)) {
        toast.error('Please fill in delivery address');
        return;
      }
      setCurrentStep('payment');
    }
  };

  const handleBack = () => {
    if (currentStep === 'delivery') setCurrentStep('details');
    else if (currentStep === 'payment') setCurrentStep('delivery');
  };

  const handleSubmitOrder = async () => {
    setIsLoading(true);

    try {
      // Create order in database
      const orderResponse = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: `${formData.firstName} ${formData.lastName}`,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          company: formData.company || null,
          deliveryAddress: formData.deliveryMethod === 'delivery'
            ? `${formData.address}, ${formData.city}, ${formData.region}`
            : 'Pickup at facility',
          deliveryMethod: formData.deliveryMethod,
          deliveryInstructions: formData.deliveryInstructions || null,
          paymentMethod: formData.paymentMethod,
          isPartialPayment: formData.isPartialPayment,
          depositAmount: formData.isPartialPayment ? depositAmount : finalTotal,
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.priceMin,
          })),
          totalAmount: finalTotal,
          notes: formData.isPartialPayment
            ? `Partial payment: $${depositAmount} GYD. Remaining: $${finalTotal - depositAmount} GYD`
            : '',
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderData.success) {
        throw new Error(orderData.error || 'Failed to create order');
      }

      setOrderId(orderData.order.id);

      // Handle different payment methods
      if (formData.paymentMethod === 'card') {
        // Create Stripe payment intent
        const paymentResponse = await fetch('/api/stripe/payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: depositAmount,
            description: `C2 ConcreteBlock Pro Order - ${orderData.order.id}`,
            customerEmail: formData.email,
            customerName: `${formData.firstName} ${formData.lastName}`,
            customerPhone: formData.phone,
            orderId: orderData.order.id,
          }),
        });

        const paymentData = await paymentResponse.json();

        if (paymentData.success) {
          setPaymentClientSecret(paymentData.clientSecret);
          // In production, you would redirect to Stripe Checkout
          // For now, we'll show the confirmation
          setCurrentStep('confirmation');
          clearCart();
        } else {
          throw new Error(paymentData.error || 'Payment failed');
        }
      } else {
        // Bank transfer or COD - just confirm
        setCurrentStep('confirmation');
        clearCart();
      }

      toast.success('Order submitted successfully!');
    } catch (error) {
      console.error('Order submission error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to submit order');
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { id: 'details', label: 'Your Details', icon: User },
    { id: 'delivery', label: 'Delivery', icon: Truck },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'confirmation', label: 'Confirmation', icon: CheckCircle },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  if (items.length === 0 && currentStep !== 'confirmation') {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Your cart is empty</DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Add some products to your cart to checkout</p>
            <Button onClick={onClose} className="bg-[#F97316] hover:bg-orange-600">
              Continue Shopping
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[#1E3A5F]">Checkout</DialogTitle>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8 px-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  index <= currentStepIndex
                    ? 'bg-[#F97316] text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                {index < currentStepIndex ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <step.icon className="h-5 w-5" />
                )}
              </div>
              <span
                className={`ml-2 text-sm hidden sm:inline ${
                  index <= currentStepIndex ? 'text-[#1E3A5F] font-medium' : 'text-gray-400'
                }`}
              >
                {step.label}
              </span>
              {index < steps.length - 1 && (
                <div
                  className={`w-12 sm:w-24 h-1 mx-2 ${
                    index < currentStepIndex ? 'bg-[#F97316]' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2">
            {/* Step 1: Customer Details */}
            {currentStep === 'details' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Your Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="John"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Doe"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+592 XXX-XXXX"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="company">Company (Optional)</Label>
                    <Input
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="Your Company Name"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Delivery */}
            {currentStep === 'delivery' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Delivery Options
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Delivery Method */}
                  <div className="grid grid-cols-2 gap-4">
                    <div
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.deliveryMethod === 'delivery'
                          ? 'border-[#F97316] bg-orange-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setFormData((prev) => ({ ...prev, deliveryMethod: 'delivery' }))}
                    >
                      <div className="flex items-center gap-3">
                        <Truck className="h-6 w-6 text-[#F97316]" />
                        <div>
                          <p className="font-semibold">Delivery</p>
                          <p className="text-sm text-gray-500">Free within 10 miles</p>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.deliveryMethod === 'pickup'
                          ? 'border-[#F97316] bg-orange-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setFormData((prev) => ({ ...prev, deliveryMethod: 'pickup' }))}
                    >
                      <div className="flex items-center gap-3">
                        <MapPin className="h-6 w-6 text-[#F97316]" />
                        <div>
                          <p className="font-semibold">Pickup</p>
                          <p className="text-sm text-gray-500">From our facility</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {formData.deliveryMethod === 'delivery' && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="address">Delivery Address *</Label>
                        <Input
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="Street address"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="city">City/Town</Label>
                          <Input
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            placeholder="City"
                          />
                        </div>
                        <div>
                          <Label htmlFor="region">Region *</Label>
                          <Select
                            value={formData.region}
                            onValueChange={(value) => setFormData((prev) => ({ ...prev, region: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select region" />
                            </SelectTrigger>
                            <SelectContent>
                              {REGIONS.map((region) => (
                                <SelectItem key={region.value} value={region.value}>
                                  {region.label}
                                  {region.deliveryFree && ' (Free Delivery)'}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="deliveryInstructions">Delivery Instructions</Label>
                        <Textarea
                          id="deliveryInstructions"
                          name="deliveryInstructions"
                          value={formData.deliveryInstructions}
                          onChange={handleInputChange}
                          placeholder="Any special instructions for delivery..."
                          rows={3}
                        />
                      </div>

                      {formData.region && formData.region !== 'region-3' && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <p className="text-sm text-yellow-800">
                            <AlertCircle className="h-4 w-4 inline mr-2" />
                            Delivery fee of ${PRICING.deliveryFeeOutsideZone.toLocaleString()} GYD applies outside the free delivery zone.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {formData.deliveryMethod === 'pickup' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-[#1E3A5F] mb-2">Pickup Location</h4>
                      <p className="text-gray-600">
                        Lot 6 De Buff Canal #2 Polder, West Bank Demerara, Region 3, Guyana
                      </p>
                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          Mon-Fri: 8AM-5PM
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          Sat: 8AM-12PM
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Step 3: Payment */}
            {currentStep === 'payment' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Payment Options */}
                  <div className="space-y-3">
                    <div
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.paymentMethod === 'card'
                          ? 'border-[#F97316] bg-orange-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setFormData((prev) => ({ ...prev, paymentMethod: 'card' }))}
                    >
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-6 w-6 text-[#F97316]" />
                        <div className="flex-1">
                          <p className="font-semibold">Card Payment</p>
                          <p className="text-sm text-gray-500">Pay securely with credit/debit card</p>
                        </div>
                        <Badge className="bg-green-500">Instant</Badge>
                      </div>
                    </div>

                    <div
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.paymentMethod === 'bank_transfer'
                          ? 'border-[#F97316] bg-orange-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setFormData((prev) => ({ ...prev, paymentMethod: 'bank_transfer' }))}
                    >
                      <div className="flex items-center gap-3">
                        <Building className="h-6 w-6 text-[#F97316]" />
                        <div className="flex-1">
                          <p className="font-semibold">Bank Transfer</p>
                          <p className="text-sm text-gray-500">Transfer directly to our bank account</p>
                        </div>
                        <Badge variant="outline">Manual</Badge>
                      </div>
                    </div>

                    <div
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.paymentMethod === 'cash_on_delivery'
                          ? 'border-[#F97316] bg-orange-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setFormData((prev) => ({ ...prev, paymentMethod: 'cash_on_delivery' }))}
                    >
                      <div className="flex items-center gap-3">
                        <Shield className="h-6 w-6 text-[#F97316]" />
                        <div className="flex-1">
                          <p className="font-semibold">Cash on Delivery / Pickup</p>
                          <p className="text-sm text-gray-500">Pay when you receive your order</p>
                        </div>
                        <Badge variant="outline">On Delivery</Badge>
                      </div>
                    </div>
                  </div>

                  {/* Partial Payment Option */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <input
                        type="checkbox"
                        id="partialPayment"
                        checked={formData.isPartialPayment}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            isPartialPayment: e.target.checked,
                            depositAmount: e.target.checked ? minDeposit : 0,
                          }))
                        }
                        className="h-4 w-4"
                      />
                      <Label htmlFor="partialPayment" className="font-medium">
                        Pay Deposit (50% minimum)
                      </Label>
                    </div>
                    {formData.isPartialPayment && (
                      <div>
                        <Label>Deposit Amount (GYD)</Label>
                        <Input
                          type="number"
                          value={formData.depositAmount}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              depositAmount: Math.max(minDeposit, Number(e.target.value)),
                            }))
                          }
                          min={minDeposit}
                          max={finalTotal}
                        />
                        <p className="text-sm text-gray-500 mt-1">
                          Minimum deposit: ${minDeposit.toLocaleString()} GYD
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Coupon Code */}
                  <div>
                    <Label>Have a coupon code?</Label>
                    <CouponInput
                      onApply={(code, discountPercent) => {
                        setDiscount(Math.round(finalTotal * (discountPercent / 100)));
                        toast.success(`Coupon ${code} applied! ${discountPercent}% off`);
                      }}
                    />
                  </div>

                  {/* Security Badge */}
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Lock className="h-4 w-4" />
                    <span>Secure payment powered by Stripe</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 4: Confirmation */}
            {currentStep === 'confirmation' && (
              <Card>
                <CardContent className="text-center py-12">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-[#1E3A5F] mb-2">Order Confirmed!</h2>
                  <p className="text-gray-600 mb-6">
                    Thank you for your order. We&apos;ll send you a confirmation email shortly.
                  </p>

                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <p className="text-sm text-gray-500">Order Number</p>
                    <p className="text-xl font-bold text-[#F97316]">
                      #{orderId?.slice(-8).toUpperCase()}
                    </p>
                  </div>

                  {formData.paymentMethod === 'bank_transfer' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left mb-6">
                      <h4 className="font-semibold text-[#1E3A5F] mb-2">Bank Transfer Details</h4>
                      <p className="text-sm text-gray-600">
                        Please transfer the amount to:
                      </p>
                      <div className="mt-2 text-sm">
                        <p><strong>Bank:</strong> [Your Bank Name]</p>
                        <p><strong>Account:</strong> C2 ConcreteBlock Pro</p>
                        <p><strong>Account #:</strong> [Account Number]</p>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4 justify-center">
                    <Button onClick={onClose} className="bg-[#F97316] hover:bg-orange-600">
                      Continue Shopping
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => window.open(`/api/invoice?orderId=${orderId}`, '_blank')}
                    >
                      View Invoice
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Navigation Buttons */}
            {currentStep !== 'confirmation' && (
              <div className="flex justify-between mt-6">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 'details'}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </Button>

                {currentStep === 'payment' ? (
                  <Button
                    onClick={handleSubmitOrder}
                    disabled={isLoading}
                    className="bg-[#F97316] hover:bg-orange-600 flex items-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4" />
                        Place Order - ${formData.isPartialPayment ? depositAmount.toLocaleString() : finalTotal.toLocaleString()} GYD
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    className="bg-[#F97316] hover:bg-orange-600 flex items-center gap-2"
                  >
                    Continue
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="md:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Items */}
                <div className="space-y-3 mb-4">
                  {items.map((item) => (
                    <div key={item.productId} className="flex justify-between text-sm">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium">
                        ${((item.priceMin + item.priceMax) / 2 * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span>${subtotal.toLocaleString()} GYD</span>
                  </div>

                  {formData.deliveryMethod === 'delivery' && formData.region !== 'region-3' && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Delivery</span>
                      <span>${PRICING.deliveryFeeOutsideZone.toLocaleString()} GYD</span>
                    </div>
                  )}

                  {formData.deliveryMethod === 'delivery' && formData.region === 'region-3' && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Delivery</span>
                      <span className="text-green-600">FREE</span>
                    </div>
                  )}

                  {discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Discount</span>
                      <span className="text-green-600">-${discount.toLocaleString()} GYD</span>
                    </div>
                  )}

                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span className="text-[#F97316]">${finalTotal.toLocaleString()} GYD</span>
                  </div>

                  {formData.isPartialPayment && (
                    <div className="bg-orange-50 rounded-lg p-3 mt-3">
                      <p className="text-sm font-medium text-[#F97316]">Deposit Amount</p>
                      <p className="text-lg font-bold">${depositAmount.toLocaleString()} GYD</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Remaining: ${(finalTotal - depositAmount).toLocaleString()} GYD (due on delivery)
                      </p>
                    </div>
                  )}
                </div>

                {/* Delivery Info */}
                {currentStep !== 'details' && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-medium text-sm mb-2">Delivery</h4>
                    <p className="text-sm text-gray-500">
                      {formData.deliveryMethod === 'pickup'
                        ? 'Pickup at our facility'
                        : formData.address || 'Address not set'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
