'use client';

import { cn } from '@/lib/utils';

interface AdBannerProps {
  slot?: string;
  format?: 'horizontal' | 'vertical' | 'rectangle';
  className?: string;
}

/**
 * Google AdSense banner placeholder.
 *
 * To activate:
 * 1. Set NEXT_PUBLIC_ADSENSE_CLIENT_ID in your .env
 * 2. Add the AdSense script to layout.tsx <head>
 * 3. Replace the placeholder div below with the actual <ins> tag
 *
 * For affiliate marketing banners, replace the content of this
 * component with your affiliate partner's banner code.
 */
export function AdBanner({ format = 'horizontal', className }: AdBannerProps) {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  // Don't render empty space if no ad client configured
  if (!clientId) {
    return (
      <div
        className={cn(
          'border border-dashed border-gray-300 dark:border-gray-700 rounded-xl flex items-center justify-center text-gray-400 dark:text-gray-600 text-xs',
          format === 'horizontal' && 'h-24 w-full',
          format === 'vertical' && 'w-40 h-[600px]',
          format === 'rectangle' && 'w-[336px] h-[280px]',
          className
        )}
      >
        <span className="opacity-50">Ad Space</span>
      </div>
    );
  }

  return (
    <div className={cn('ad-container', className)}>
      {/* 
        Replace with your actual AdSense code:
        <ins className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={clientId}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      */}
    </div>
  );
}
