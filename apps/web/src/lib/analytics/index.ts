// Unified Analytics Interface
// Single entry point for all analytics platforms

import { config, isAnalyticsEnabled } from '@/lib/config';
import * as gtag from './gtag';
import * as metaPixel from './meta-pixel';
import * as hotjar from './hotjar';

// ============================================================================
// Unified Analytics Functions
// ============================================================================

/**
 * Track page view across all platforms
 */
export const trackPageView = (url: string): void => {
  if (!isAnalyticsEnabled()) {
    console.log('[Analytics Dev] Page View:', url);
    return;
  }

  // Check cookie consent
  const consent = getConsent();
  if (!consent) {
    console.log('[Analytics] Tracking disabled - no consent');
    return;
  }

  // Track on all platforms
  gtag.pageview(url);
  metaPixel.pageview();
  hotjar.stateChange(url);
};

/**
 * Track custom event across all platforms
 */
export const trackEvent = (
  eventName: string,
  params?: Record<string, string | number | boolean>
): void => {
  if (!isAnalyticsEnabled()) {
    console.log('[Analytics Dev] Event:', eventName, params);
    return;
  }

  // Check cookie consent
  const consent = getConsent();
  if (!consent) {
    console.log('[Analytics] Tracking disabled - no consent');
    return;
  }

  // Track on GA4
  gtag.event(eventName, params);

  // Track on Meta Pixel (convert params to string/number only)
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

  // Track on Hotjar
  hotjar.event(eventName);
};

/**
 * Track error
 */
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

/**
 * Initialize all analytics platforms
 */
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

// ============================================================================
// Cookie Consent Helpers
// ============================================================================

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

// ============================================================================
// Check if analytics are loaded
// ============================================================================

export const isAnalyticsLoaded = (): boolean => {
  return gtag.isGALoaded() && metaPixel.isMetaPixelLoaded() && hotjar.isHotjarLoaded();
};

// Re-export event definitions
export { analyticsEvents, EVENT_NAMES } from './events';
export type { ReadingType } from './events';
