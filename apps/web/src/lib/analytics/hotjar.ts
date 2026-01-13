// Hotjar helper functions
// Docs: https://help.hotjar.com/hc/en-us/articles/115011639927

import { config } from '@/lib/config';

// Extend Window interface for Hotjar
declare global {
  interface Window {
    hj: (...args: unknown[]) => void;
    _hjSettings: { hjid: number; hjsv: number };
  }
}

// Initialize hj function
export const hj = (...args: unknown[]): void => {
  if (typeof window !== 'undefined' && window.hj) {
    window.hj(...args);
  }
};

// Trigger a Hotjar event
export const event = (eventName: string): void => {
  if (!config.isProduction || !config.hotjarId) {
    console.log('[Hotjar Dev] Event:', eventName);
    return;
  }

  hj('event', eventName);
};

// Identify user (for future use with auth)
export const identify = (userId: string, attributes?: Record<string, unknown>): void => {
  if (!config.isProduction || !config.hotjarId) {
    console.log('[Hotjar Dev] Identify:', userId, attributes);
    return;
  }

  hj('identify', userId, attributes);
};

// Trigger state change (for SPAs)
export const stateChange = (url: string): void => {
  if (!config.isProduction || !config.hotjarId) {
    console.log('[Hotjar Dev] State Change:', url);
    return;
  }

  hj('stateChange', url);
};

// Check if Hotjar is loaded
export const isHotjarLoaded = (): boolean => {
  return typeof window !== 'undefined' && typeof window.hj === 'function';
};
