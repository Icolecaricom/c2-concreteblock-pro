'use client';

import { useState } from 'react';
import { useCartStore } from '@/store/cart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Package,
  ArrowRight,
  Loader2,
  CheckCircle,
  CreditCard,
} from 'lucide-react';
import { toast } from 'sonner';
import { CheckoutFlow } from './CheckoutFlow';

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
  } = useCartStore();

  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [quoteForm, setQuoteForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
  });

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...quoteForm,
          items: items.map((item) => ({
            productId: item.productId,
            name: item.name,
            quantity: item.quantity,
            priceMin: item.priceMin,
            priceMax: item.priceMax,
          })),
          projectType: 'Quote from Cart',
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        toast.success('Quote request submitted successfully!');
        clearCart();
      } else {
        toast.error('Failed to submit quote request.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToContact = () => {
    closeCart();
    const element = document.querySelector('#contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
        <SheetContent className="w-full sm:max-w-lg flex flex-col">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2 text-[#1E3A5F]">
              <ShoppingCart className="h-5 w-5" />
              Shopping Cart
              {totalItems > 0 && (
                <Badge className="bg-[#F97316]">{totalItems} items</Badge>
              )}
            </SheetTitle>
            <SheetDescription>
              Review your items and request a quote for your order.
            </SheetDescription>
          </SheetHeader>

          {/* Cart Items */}
          <div className="flex-1 overflow-auto py-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Package className="h-16 w-16 text-gray-300 mb-4" />
                <p className="text-gray-500 mb-4">Your cart is empty</p>
                <Button
                  onClick={scrollToContact}
                  variant="outline"
                  className="border-[#F97316] text-[#F97316]"
                >
                  Browse Products
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex gap-4 p-4 bg-gray-50 rounded-lg"
                  >
                    {/* Product Image */}
                    <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-[#1E3A5F] truncate">
                        {item.name}
                      </h4>
                      <p className="text-sm text-gray-500 mb-2">
                        ${item.priceMin} - ${item.priceMax} GYD/block
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1)
                          }
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-10 text-center font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1)
                          }
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => removeItem(item.productId)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Summary & Actions */}
          {items.length > 0 && (
            <>
              {/* Summary */}
              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Items:</span>
                  <span className="font-medium">{totalItems} blocks</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Estimated Cost:</span>
                  <span className="font-medium text-[#1E3A5F]">
                    ${totalPrice.min.toLocaleString()} - ${totalPrice.max.toLocaleString()} GYD
                  </span>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-700">
                  <p>
                    <strong>Note:</strong> Final pricing is determined by quantity
                    tiers. Request a quote for exact pricing.
                  </p>
                </div>
              </div>

              {/* Actions */}
              <SheetFooter className="flex-col gap-2 mt-4">
                <Button
                  onClick={() => {
                    closeCart();
                    setShowCheckout(true);
                  }}
                  className="w-full bg-[#1E3A5F] hover:bg-[#152d4a]"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Proceed to Checkout
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
                <Button
                  onClick={() => setShowQuoteForm(true)}
                  variant="outline"
                  className="w-full border-[#F97316] text-[#F97316] hover:bg-orange-50"
                >
                  Request Quote Only
                </Button>
                <Button
                  onClick={clearCart}
                  variant="ghost"
                  className="w-full text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Cart
                </Button>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Quote Form Dialog */}
      <Dialog open={showQuoteForm} onOpenChange={setShowQuoteForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#1E3A5F]">
              Request a Quote
            </DialogTitle>
            <DialogDescription>
              Fill out the form below and we&apos;ll get back to you with a detailed quote.
            </DialogDescription>
          </DialogHeader>

          {isSubmitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-[#1E3A5F] mb-2">
                Quote Request Sent!
              </h3>
              <p className="text-gray-600 mb-4">
                We&apos;ll review your request and get back to you within 24 hours.
              </p>
              <Button
                onClick={() => {
                  setShowQuoteForm(false);
                  setIsSubmitted(false);
                  setQuoteForm({
                    name: '',
                    email: '',
                    phone: '',
                    company: '',
                    message: '',
                  });
                }}
                className="bg-[#F97316] hover:bg-orange-600"
              >
                Done
              </Button>
            </div>
          ) : (
            <form onSubmit={handleQuoteSubmit} className="space-y-4">
              <div>
                <Label htmlFor="quote-name">Full Name *</Label>
                <Input
                  id="quote-name"
                  value={quoteForm.name}
                  onChange={(e) =>
                    setQuoteForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quote-email">Email *</Label>
                  <Input
                    id="quote-email"
                    type="email"
                    value={quoteForm.email}
                    onChange={(e) =>
                      setQuoteForm((prev) => ({ ...prev, email: e.target.value }))
                    }
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="quote-phone">Phone</Label>
                  <Input
                    id="quote-phone"
                    value={quoteForm.phone}
                    onChange={(e) =>
                      setQuoteForm((prev) => ({ ...prev, phone: e.target.value }))
                    }
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="quote-company">Company (Optional)</Label>
                <Input
                  id="quote-company"
                  value={quoteForm.company}
                  onChange={(e) =>
                    setQuoteForm((prev) => ({ ...prev, company: e.target.value }))
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="quote-message">Additional Notes</Label>
                <Textarea
                  id="quote-message"
                  value={quoteForm.message}
                  onChange={(e) =>
                    setQuoteForm((prev) => ({ ...prev, message: e.target.value }))
                  }
                  placeholder="Delivery preferences, project timeline, etc."
                  rows={3}
                  className="mt-1"
                />
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-[#1E3A5F] mb-2">Order Summary</h4>
                <div className="space-y-1 text-sm">
                  {items.map((item) => (
                    <div key={item.productId} className="flex justify-between">
                      <span>
                        {item.name} × {item.quantity}
                      </span>
                      <span className="text-gray-500">
                        ${item.priceMin * item.quantity} - $
                        {item.priceMax * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t mt-2 pt-2 flex justify-between font-medium">
                  <span>Estimated Total:</span>
                  <span className="text-[#F97316]">
                    ${totalPrice.min.toLocaleString()} - $
                    {totalPrice.max.toLocaleString()} GYD
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowQuoteForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-[#F97316] hover:bg-orange-600"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Request'
                  )}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Checkout Flow */}
      <CheckoutFlow
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
      />
    </>
  );
}
