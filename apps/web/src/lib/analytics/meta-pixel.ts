// Meta Pixel (Facebook/Instagram) helper functions

import { config } from '@/lib/config';

declare global {
  interface Window {
    fbq: (...args: unknown[]) => void;
    _fbq: (...args: unknown[]) => void;
  }
}

export const fbq = (...args: unknown[]): void => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq(...args);
  }
};

export const pageview = (): void => {
  if (!config.isProduction || !config.metaPixelId) {
    console.log('[Meta Pixel Dev] PageView');
    return;
  }
  fbq('track', 'PageView');
};

export const event = (eventName: string, params?: Record<string, string | number>): void => {
  if (!config.isProduction || !config.metaPixelId) {
    console.log('[Meta Pixel Dev] Event:', eventName, params);
    return;
  }
  fbq('track', eventName, params);
};

export const trackViewContent = (contentName: string, contentType: string): void => {
  event('ViewContent', { content_name: contentName, content_type: contentType });
};

export const trackCompleteRegistration = (): void => {
  event('CompleteRegistration', {});
};

export const isMetaPixelLoaded = (): boolean => {
  return typeof window !== 'undefined' && typeof window.fbq === 'function';
};
