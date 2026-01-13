// Meta Pixel (Facebook/Instagram) helper functions
// Docs: https://developers.facebook.com/docs/meta-pixel

import { config } from '@/lib/config';

// Extend Window interface for fbq
declare global {
  interface Window {
    fbq: (...args: unknown[]) => void;
    _fbq: (...args: unknown[]) => void;
  }
}

// Initialize fbq function
export const fbq = (...args: unknown[]): void => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq(...args);
  }
};

// Track page view
export const pageview = (): void => {
  if (!config.isProduction || !config.metaPixelId) {
    console.log('[Meta Pixel Dev] PageView');
    return;
  }

  fbq('track', 'PageView');
};

// Track custom event
export const event = (eventName: string, params?: Record<string, string | number>): void => {
  if (!config.isProduction || !config.metaPixelId) {
    console.log('[Meta Pixel Dev] Event:', eventName, params);
    return;
  }

  fbq('track', eventName, params);
};

// Track standard events
export const trackViewContent = (contentName: string, contentType: string): void => {
  event('ViewContent', {
    content_name: contentName,
    content_type: contentType,
  });
};

export const trackCompleteRegistration = (): void => {
  event('CompleteRegistration', {});
};

// Check if Meta Pixel is loaded
export const isMetaPixelLoaded = (): boolean => {
  return typeof window !== 'undefined' && typeof window.fbq === 'function';
};
