'use client';

import { useEffect } from 'react';
import { useAnalytics } from '@/lib/hooks';

/**
 * GrowthMetrics - Initializes UTM tracking and session analytics
 * Should be included in the root layout
 */
export function GrowthMetrics() {
  const { trackUtmCampaign, trackSessionStart } = useAnalytics();

  useEffect(() => {
    // Track UTM parameters on page load
    trackUtmCampaign();

    // Track session start
    const hasSessionStarted = sessionStorage.getItem('sessionStarted');
    if (!hasSessionStarted) {
      trackSessionStart();
      sessionStorage.setItem('sessionStarted', 'true');
    }
  }, [trackUtmCampaign, trackSessionStart]);

  // This component doesn't render anything visible
  return null;
}

/**
 * Metrics Summary Types
 */
export interface MetricsSummary {
  totalReadings: number;
  totalUsers: number;
  conversionRate: number;
  avgSessionDuration: number;
  topCards: { name: string; views: number }[];
  topBlogPosts: { title: string; views: number }[];
  sharesByPlatform: { platform: string; count: number }[];
}

/**
 * getGrowthMetricsConfig - Configuration for GA4 custom dimensions
 */
export function getGrowthMetricsConfig() {
  return {
    customDimensions: [
      { name: 'content_type', scope: 'EVENT' },
      { name: 'reading_type', scope: 'EVENT' },
      { name: 'share_platform', scope: 'EVENT' },
      { name: 'utm_source', scope: 'SESSION' },
      { name: 'utm_medium', scope: 'SESSION' },
      { name: 'utm_campaign', scope: 'SESSION' },
      { name: 'funnel_step', scope: 'EVENT' },
      { name: 'feature_used', scope: 'EVENT' },
    ],
    customMetrics: [
      { name: 'scroll_depth', unit: 'PERCENT' },
      { name: 'time_on_page', unit: 'SECONDS' },
      { name: 'readings_count', unit: 'COUNT' },
    ],
    conversionEvents: [
      'sign_up',
      'reading_completed',
      'share_completed',
    ],
    funnelSteps: [
      'content_view',
      'reading_start',
      'reading_complete',
      'signup',
    ],
  };
}

/**
 * Recommended GA4 Reports for Growth Dashboard
 */
export const GA4_REPORTS = {
  contentPerformance: {
    name: 'Content Performance',
    dimensions: ['content_type', 'content_id'],
    metrics: ['event_count', 'total_users'],
    orderBy: 'event_count',
  },
  shareAnalytics: {
    name: 'Share Analytics',
    dimensions: ['share_platform'],
    metrics: ['event_count', 'total_users'],
    filter: { event_name: 'share_completed' },
  },
  conversionFunnel: {
    name: 'Conversion Funnel',
    dimensions: ['funnel_step'],
    metrics: ['event_count', 'total_users'],
    orderBy: 'funnel_step',
  },
  utmTracking: {
    name: 'Campaign Attribution',
    dimensions: ['utm_source', 'utm_medium', 'utm_campaign'],
    metrics: ['sessions', 'total_users', 'conversions'],
  },
  featureUsage: {
    name: 'Feature Usage',
    dimensions: ['feature'],
    metrics: ['event_count', 'total_users'],
    filter: { event_name: 'feature_used' },
  },
};


