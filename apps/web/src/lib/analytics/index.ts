// Unified Analytics Interface

import { config, isAnalyticsEnabled } from '@/lib/config';
import * as gtag from './gtag';
import * as metaPixel from './meta-pixel';
import * as hotjar from './hotjar';

export const trackPageView = (url: string): void => {
  if (!isAnalyticsEnabled()) {
    console.log('[Analytics Dev] Page View:', url);
    return;
  }
  const consent = getConsent();
  if (!consent) {
    console.log('[Analytics] Tracking disabled - no consent');
    return;
  }
  gtag.pageview(url);
  metaPixel.pageview();
  hotjar.stateChange(url);
};

export const trackEvent = (
  eventName: string,
  params?: Record<string, string | number | boolean>
): void => {
  if (!isAnalyticsEnabled()) {
    console.log('[Analytics Dev] Event:', eventName, params);
    return;
  }
  const consent = getConsent();
  if (!consent) {
    console.log('[Analytics] Tracking disabled - no consent');
    return;
  }
  gtag.event(eventName, params);
  if (params) {
    const metaParams: Record<string, string | number> = {};
    Object.entries(params).forEach(([key, value]) => {
      if (typeof value === 'string' || typeof value === 'number') {
        metaParams[key] = value;
      } else {
        metaParams[key] = String(value);
      }
    });
    metaPixel.event(eventName, metaParams);
  }
  hotjar.event(eventName);
};

export const trackError = (error: Error, context?: string): void => {
  if (!config.isProduction) {
    console.error('[Analytics Dev] Error:', error.message, context);
    return;
  }
  trackEvent('error_occurred', {
    error_message: error.message,
    error_context: context || 'unknown',
    error_stack: error.stack?.substring(0, 100) || '',
  });
};

export const initializeAnalytics = (): void => {
  if (!isAnalyticsEnabled()) {
    console.log('[Analytics] Disabled in development');
    return;
  }
  console.log('[Analytics] Initialized:', {
    ga4: !!config.gaMeasurementId,
    metaPixel: !!config.metaPixelId,
    hotjar: !!config.hotjarId,
  });
};

export const CONSENT_KEY = 'cookie_consent';

export const getConsent = (): boolean => {
  if (typeof window === 'undefined') return false;
  const consent = localStorage.getItem(CONSENT_KEY);
  return consent === 'accepted';
};

export const setConsent = (accepted: boolean): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CONSENT_KEY, accepted ? 'accepted' : 'declined');
};

export const hasConsentDecision = (): boolean => {
  if (typeof window === 'undefined') return false;
  const consent = localStorage.getItem(CONSENT_KEY);
  return consent === 'accepted' || consent === 'declined';
};

export const isAnalyticsLoaded = (): boolean => {
  return gtag.isGALoaded() && metaPixel.isMetaPixelLoaded() && hotjar.isHotjarLoaded();
};

export { analyticsEvents, EVENT_NAMES } from './events';
export type { ReadingType } from './events';
