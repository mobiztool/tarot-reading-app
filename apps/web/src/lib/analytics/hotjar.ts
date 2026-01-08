// Hotjar helper functions

import { config } from '@/lib/config';

declare global {
  interface Window {
    hj: (...args: unknown[]) => void;
    _hjSettings: { hjid: number; hjsv: number };
  }
}

export const hj = (...args: unknown[]): void => {
  if (typeof window !== 'undefined' && window.hj) {
    window.hj(...args);
  }
};

export const event = (eventName: string): void => {
  if (!config.isProduction || !config.hotjarId) {
    console.log('[Hotjar Dev] Event:', eventName);
    return;
  }
  hj('event', eventName);
};

export const identify = (userId: string, attributes?: Record<string, unknown>): void => {
  if (!config.isProduction || !config.hotjarId) {
    console.log('[Hotjar Dev] Identify:', userId, attributes);
    return;
  }
  hj('identify', userId, attributes);
};

export const stateChange = (url: string): void => {
  if (!config.isProduction || !config.hotjarId) {
    console.log('[Hotjar Dev] State Change:', url);
    return;
  }
  hj('stateChange', url);
};

export const isHotjarLoaded = (): boolean => {
  return typeof window !== 'undefined' && typeof window.hj === 'function';
};
