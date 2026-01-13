// Google Analytics 4 (GA4) helper functions
// Docs: https://developers.google.com/analytics/devguides/collection/ga4

import { config } from '@/lib/config';

// Extend Window interface for gtag
declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

// Initialize gtag function
export const gtag = (...args: unknown[]): void => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag(...args);
  }
};

// Track page view
export const pageview = (url: string): void => {
  if (!config.isProduction || !config.gaMeasurementId) {
    console.log('[GA4 Dev] Pageview:', url);
    return;
  }

  gtag('config', config.gaMeasurementId, {
    page_path: url,
  });
};

// Track custom event
export const event = (action: string, params?: Record<string, string | number | boolean>): void => {
  if (!config.isProduction || !config.gaMeasurementId) {
    console.log('[GA4 Dev] Event:', action, params);
    return;
  }

  gtag('event', action, params);
};

// Check if GA4 is loaded
export const isGALoaded = (): boolean => {
  return typeof window !== 'undefined' && typeof window.gtag === 'function';
};
