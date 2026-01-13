// useAnalytics Hook
// Convenient hook for tracking analytics events in React components

'use client';

import { useCallback } from 'react';
import { trackEvent, trackPageView, trackError } from '@/lib/analytics';
import { analyticsEvents } from '@/lib/analytics/events';
import type { ReadingType } from '@/lib/analytics/events';

// Hash user ID for privacy
function hashUserId(userId: string): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    const char = userId.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

// Calculate account age in days
function calculateAccountAgeDays(createdAt: string): number {
  const created = new Date(createdAt);
  const now = new Date();
  const diffMs = now.getTime() - created.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

export function useAnalytics() {
  // Generic event tracking
  const track = useCallback(
    (eventName: string, params?: Record<string, string | number | boolean>) => {
      trackEvent(eventName, params);
    },
    []
  );

  // Page view tracking
  const trackPage = useCallback((url: string) => {
    trackPageView(url);
  }, []);

  // Error tracking
  const trackErr = useCallback((error: Error, context?: string) => {
    trackError(error, context);
  }, []);

  // ============================================================================
  // Pre-defined event tracking functions
  // ============================================================================

  const trackReadingStarted = useCallback((readingType: ReadingType, questionProvided: boolean) => {
    const event = analyticsEvents.readingStarted(readingType, questionProvided);
    trackEvent(event.event, event);
  }, []);

  const trackCardSelected = useCallback(
    (cardName: string, position: number, isReversed: boolean) => {
      const event = analyticsEvents.cardSelected(cardName, position, isReversed);
      trackEvent(event.event, event);
    },
    []
  );

  const trackReadingCompleted = useCallback(
    (readingType: ReadingType, readingId: string, durationSeconds: number) => {
      const event = analyticsEvents.readingCompleted(readingType, readingId, durationSeconds);
      trackEvent(event.event, event);
    },
    []
  );

  const trackCtaClicked = useCallback((buttonName: string, page: string) => {
    const event = analyticsEvents.ctaClicked(buttonName, page);
    trackEvent(event.event, event);
  }, []);

  const trackShareInitiated = useCallback((readingId: string, platform: string) => {
    const event = analyticsEvents.shareInitiated(readingId, platform);
    trackEvent(event.event, event);
  }, []);

  const trackReadingSaved = useCallback((readingId: string, readingType: ReadingType) => {
    const event = analyticsEvents.readingSaved(readingId, readingType);
    trackEvent(event.event, event);
  }, []);

  const trackReadingDeleted = useCallback((readingId: string, readingType: ReadingType) => {
    const event = analyticsEvents.readingDeleted(readingId, readingType);
    trackEvent(event.event, event);
  }, []);

  const trackCardFlipped = useCallback((cardName: string, position: number) => {
    const event = analyticsEvents.cardFlipped(cardName, position);
    trackEvent(event.event, event);
  }, []);

  const trackCardDetailsViewed = useCallback((cardName: string, cardSlug: string) => {
    const event = analyticsEvents.cardDetailsViewed(cardName, cardSlug);
    trackEvent(event.event, event);
  }, []);

  // Love Spread Analytics
  const trackLoveSpreadStarted = useCallback((questionProvided: boolean) => {
    const event = analyticsEvents.loveSpreadStarted(questionProvided);
    trackEvent(event.event, event);
  }, []);

  const trackLoveSpreadCompleted = useCallback((readingId: string, durationSeconds: number) => {
    const event = analyticsEvents.loveSpreadCompleted(readingId, durationSeconds);
    trackEvent(event.event, event);
  }, []);

  const trackLoginPromptShown = useCallback((source: string) => {
    const event = analyticsEvents.loginPromptShown(source);
    trackEvent(event.event, event);
  }, []);

  const trackLoginFromGate = useCallback((source: string) => {
    const event = analyticsEvents.loginFromGate(source);
    trackEvent(event.event, event);
  }, []);

  // Career Spread Analytics
  const trackCareerSpreadStarted = useCallback((questionProvided: boolean) => {
    const event = analyticsEvents.careerSpreadStarted(questionProvided);
    trackEvent(event.event, event);
  }, []);

  const trackCareerSpreadCompleted = useCallback((readingId: string, durationSeconds: number) => {
    const event = analyticsEvents.careerSpreadCompleted(readingId, durationSeconds);
    trackEvent(event.event, event);
  }, []);

  // Set user properties for GA4
  const setUserProperties = useCallback(
    (user: {
      id: string;
      created_at: string;
      auth_provider?: string;
      readingsCount?: number;
    }) => {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('set', 'user_properties', {
          user_id_hash: hashUserId(user.id),
          signup_method: user.auth_provider || 'email',
          account_age_days: calculateAccountAgeDays(user.created_at),
          readings_count: user.readingsCount || 0,
        });
      }
    },
    []
  );

  // Track user login
  const trackLogin = useCallback((method: string) => {
    trackEvent('login', { method });
  }, []);

  // Track user signup
  const trackSignup = useCallback((method: string) => {
    trackEvent('sign_up', { method });
  }, []);

  // Track user logout
  const trackLogout = useCallback(() => {
    trackEvent('logout');
  }, []);

  // ============================================================================
  // Growth & Content Analytics (Story 3.10)
  // ============================================================================

  // Share analytics
  const trackShareCompleted = useCallback(
    (readingId: string, platform: string, success: boolean) => {
      trackEvent('share_completed', {
        reading_id: readingId,
        platform,
        success,
      });
    },
    []
  );

  // Content view tracking
  const trackContentView = useCallback(
    (contentType: 'card' | 'blog' | 'faq', contentId: string, contentTitle: string) => {
      trackEvent('content_view', {
        content_type: contentType,
        content_id: contentId,
        content_title: contentTitle,
      });
    },
    []
  );

  // Blog engagement
  const trackBlogEngagement = useCallback(
    (postSlug: string, scrollDepth: number, timeOnPage: number) => {
      trackEvent('blog_engagement', {
        post_slug: postSlug,
        scroll_depth: scrollDepth,
        time_on_page: timeOnPage,
      });
    },
    []
  );

  // Conversion funnel events
  const trackFunnelStep = useCallback(
    (step: 'content_view' | 'reading_start' | 'reading_complete' | 'signup' | 'login', source?: string) => {
      trackEvent('funnel_step', {
        step,
        source: source || 'direct',
      });
    },
    []
  );

  // UTM tracking
  const trackUtmCampaign = useCallback(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const utmSource = params.get('utm_source');
    const utmMedium = params.get('utm_medium');
    const utmCampaign = params.get('utm_campaign');
    const utmContent = params.get('utm_content');

    if (utmSource || utmMedium || utmCampaign) {
      trackEvent('campaign_attribution', {
        utm_source: utmSource || '',
        utm_medium: utmMedium || '',
        utm_campaign: utmCampaign || '',
        utm_content: utmContent || '',
      });
    }
  }, []);

  // Encyclopedia analytics
  const trackEncyclopediaSearch = useCallback((query: string, resultsCount: number) => {
    trackEvent('encyclopedia_search', {
      query,
      results_count: resultsCount,
    });
  }, []);

  const trackEncyclopediaFilter = useCallback((filterType: string, filterValue: string) => {
    trackEvent('encyclopedia_filter', {
      filter_type: filterType,
      filter_value: filterValue,
    });
  }, []);

  // Feature engagement
  const trackFeatureUsed = useCallback(
    (feature: 'notes' | 'favorite' | 'question' | 'theme' | 'tutorial', action: string) => {
      trackEvent('feature_used', {
        feature,
        action,
      });
    },
    []
  );

  // Session metrics
  const trackSessionStart = useCallback(() => {
    const sessionId = Math.random().toString(36).substring(2);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('sessionId', sessionId);
      trackEvent('session_start', {
        session_id: sessionId,
        referrer: document.referrer || 'direct',
        landing_page: window.location.pathname,
      });
    }
  }, []);

  return {
    // Generic tracking
    track,
    trackPage,
    trackError: trackErr,

    // Pre-defined tracking
    trackReadingStarted,
    trackCardSelected,
    trackReadingCompleted,
    trackCtaClicked,
    trackShareInitiated,
    trackReadingSaved,
    trackReadingDeleted,
    trackCardFlipped,
    trackCardDetailsViewed,

    // User tracking
    setUserProperties,
    trackLogin,
    trackSignup,
    trackLogout,

    // Growth & Content Analytics
    trackShareCompleted,
    trackContentView,
    trackBlogEngagement,
    trackFunnelStep,
    trackUtmCampaign,
    trackEncyclopediaSearch,
    trackEncyclopediaFilter,
    trackFeatureUsed,
    trackSessionStart,

    // Love Spread Analytics
    trackLoveSpreadStarted,
    trackLoveSpreadCompleted,
    trackLoginPromptShown,
    trackLoginFromGate,

    // Career Spread Analytics
    trackCareerSpreadStarted,
    trackCareerSpreadCompleted,
  };
}
