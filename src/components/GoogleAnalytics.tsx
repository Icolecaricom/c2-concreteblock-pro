'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

// Google Analytics 4 Measurement ID
// Replace with your actual GA4 Measurement ID (G-XXXXXXXXXX)
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-XXXXXXXXXX';

// Track page views
export function trackPageView(url: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
}

// Track custom events
export function trackEvent(
  action: string,
  category: string,
  label: string,
  value?: number
) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
}

// E-commerce tracking
export function trackPurchase(
  transactionId: string,
  value: number,
  currency: string,
  items: { id: string; name: string; price: number; quantity: number }[]
) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'purchase', {
      transaction_id: transactionId,
      value: value,
      currency: currency,
      items: items.map((item) => ({
        item_id: item.id,
        item_name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
    });
  }
}

// Track quote request
export function trackQuoteRequest(value: number) {
  trackEvent('generate_lead', 'engagement', 'quote_request', value);
}

// Track calculator usage
export function trackCalculatorUse(blockType: string, blocksNeeded: number) {
  trackEvent('use_calculator', 'engagement', `block_type_${blockType}`, blocksNeeded);
}

// Track file upload
export function trackPlanUpload(fileType: string) {
  trackEvent('file_upload', 'engagement', 'plan_submission', 1);
}

// Track chat interaction
export function trackChatInteraction(messageType: string) {
  trackEvent('chat_message', 'engagement', messageType, 1);
}

// Google Analytics Component
export function GoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
      trackPageView(url);
    }
  }, [pathname, searchParams]);

  // Don't render in development or if no GA ID
  if (process.env.NODE_ENV === 'development' || GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_title: document.title,
            page_location: window.location.href,
          });
        `}
      </Script>
    </>
  );
}

// Type declaration for gtag
declare global {
  interface Window {
    gtag: (
      command: string,
      action: string,
      params?: Record<string, unknown>
    ) => void;
    dataLayer: unknown[];
  }
}
