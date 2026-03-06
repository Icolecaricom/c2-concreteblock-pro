'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Gift, Percent, Truck, Clock } from 'lucide-react';

interface Banner {
  id: string;
  type: 'promo' | 'discount' | 'shipping' | 'limited';
  title: string;
  description: string;
  code?: string;
  discount?: string;
  expiryDate?: string;
  active: boolean;
}

const defaultBanners: Banner[] = [
  {
    id: '1',
    type: 'shipping',
    title: 'FREE Delivery!',
    description: 'Free delivery within 10 miles radius on all orders',
    active: true,
  },
  {
    id: '2',
    type: 'discount',
    title: 'Bulk Order Discount',
    description: 'Get up to 20% off on orders over 500 blocks. Use code:',
    code: 'BULK20',
    discount: '20%',
    active: true,
  },
  {
    id: '3',
    type: 'limited',
    title: 'New Customer Special',
    description: 'First-time customers get 10% off their first order!',
    code: 'WELCOME10',
    discount: '10%',
    active: true,
  },
];

export function PromotionalBanner() {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);

  const banners = defaultBanners.filter((b) => b.active);

  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBanner((prev) => (prev + 1) % banners.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [banners.length]);

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('banner_dismissed', 'true');
  };

  const scrollToCalculator = () => {
    const element = document.querySelector('#calculator');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (isDismissed || banners.length === 0) return null;

  const banner = banners[currentBanner];

  const getBannerStyle = (type: string) => {
    switch (type) {
      case 'promo':
        return 'bg-gradient-to-r from-purple-600 to-pink-600';
      case 'discount':
        return 'bg-gradient-to-r from-[#F97316] to-orange-500';
      case 'shipping':
        return 'bg-gradient-to-r from-green-600 to-teal-600';
      case 'limited':
        return 'bg-gradient-to-r from-[#1E3A5F] to-blue-600';
      default:
        return 'bg-gradient-to-r from-[#1E3A5F] to-[#F97316]';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'promo':
        return <Gift className="h-5 w-5" />;
      case 'discount':
        return <Percent className="h-5 w-5" />;
      case 'shipping':
        return <Truck className="h-5 w-5" />;
      case 'limited':
        return <Clock className="h-5 w-5" />;
      default:
        return <Gift className="h-5 w-5" />;
    }
  };

  return (
    <div
      className={`${getBannerStyle(banner.type)} text-white py-3 relative transition-all duration-500`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center gap-3">
            {getIcon(banner.type)}
            <div className="text-center">
              <span className="font-semibold">{banner.title}</span>
              <span className="hidden sm:inline ml-2 opacity-90">
                {banner.description}
              </span>
            </div>
            {banner.code && (
              <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-md font-mono font-bold">
                {banner.code}
              </div>
            )}
          </div>
          <Button
            size="sm"
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-[#1E3A5F] hidden sm:inline-flex"
            onClick={scrollToCalculator}
          >
            Calculate Now
          </Button>
          <button
            onClick={handleDismiss}
            className="absolute right-4 top-1/2 -translate-y-1/2 hover:bg-white/20 rounded-full p-1"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Banner Navigation Dots */}
      {banners.length > 1 && (
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
          {banners.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentBanner ? 'bg-white' : 'bg-white/40'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Coupon input component for checkout
export function CouponInput({
  onApply,
}: {
  onApply: (code: string, discount: number) => void;
}) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Valid coupon codes (in production, this would be in the database)
  const validCoupons: Record<string, { discount: number; type: string }> = {
    BULK20: { discount: 20, type: 'percentage' },
    WELCOME10: { discount: 10, type: 'percentage' },
    FREESHIP: { discount: 0, type: 'free_shipping' },
  };

  const handleApply = () => {
    const upperCode = code.toUpperCase();

    if (!code.trim()) {
      setError('Please enter a coupon code');
      setSuccess('');
      return;
    }

    const coupon = validCoupons[upperCode];

    if (coupon) {
      setSuccess(
        coupon.type === 'free_shipping'
          ? 'Free shipping applied!'
          : `${coupon.discount}% discount applied!`
      );
      setError('');
      onApply(upperCode, coupon.discount);
    } else {
      setError('Invalid coupon code');
      setSuccess('');
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Enter coupon code"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          className="flex-1 px-4 py-2 border rounded-md uppercase"
        />
        <Button
          onClick={handleApply}
          className="bg-[#1E3A5F] hover:bg-[#152d4a]"
        >
          Apply
        </Button>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {success && <p className="text-green-600 text-sm">{success}</p>}
    </div>
  );
}
