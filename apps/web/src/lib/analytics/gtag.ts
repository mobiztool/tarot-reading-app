// Google Analytics 4 (GA4) helper functions

import { config } from '@/lib/config';

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

export const gtag = (...args: unknown[]): void => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag(...args);
  }
};

export const pageview = (url: string): void => {
  if (!config.isProduction || !config.gaMeasurementId) {
    console.log('[GA4 Dev] Pageview:', url);
    return;
  }
  gtag('config', config.gaMeasurementId, { page_path: url });
};

export const event = (action: string, params?: Record<string, string | number | boolean>): void => {
  if (!config.isProduction || !config.gaMeasurementId) {
    console.log('[GA4 Dev] Event:', action, params);
    return;
  }
  gtag('event', action, params);
};

export const isGALoaded = (): boolean => {
  return typeof window !== 'undefined' && typeof window.gtag === 'function';
};
