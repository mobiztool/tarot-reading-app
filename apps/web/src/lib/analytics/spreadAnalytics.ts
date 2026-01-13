/**
 * Spread Analytics Service (Story 5.7)
 * 
 * Tracks spread usage, conversion funnels, and engagement metrics
 */

// =============================================================================
// TYPES
// =============================================================================

export type SpreadType = 'daily' | 'three_card' | 'love_relationships' | 'career_money' | 'yes_no';

export type AnalyticsEventType =
  // Spread Events
  | 'spread_page_view'
  | 'spread_started'
  | 'spread_completed'
  | 'spread_abandoned'
  // Conversion Funnel
  | 'spread_gate_shown'
  | 'login_prompt_clicked'
  | 'signup_completed'
  // Engagement
  | 'question_submitted'
  | 'card_drawn'
  | 'result_viewed'
  | 'result_shared'
  // Retention
  | 'user_returned'
  | 'spread_repeated';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export interface SpreadAnalyticsEvent {
  eventType: AnalyticsEventType;
  spreadType?: SpreadType;
  userId?: string;
  readingId?: string;
  deviceType?: DeviceType;
  sessionId?: string;
  durationMs?: number;
  step?: string;
  metadata?: Record<string, unknown>;
}

export interface SpreadMetrics {
  spreadType: SpreadType;
  totalReadings: number;
  uniqueUsers: number;
  completionRate: number;
  avgDurationMs: number;
  repeatRate: number;
}

export interface ConversionFunnel {
  spreadType: SpreadType;
  gateShown: number;
  loginClicked: number;
  signupCompleted: number;
  spreadCompleted: number;
  gateToLoginRate: number;
  loginToSignupRate: number;
  signupToCompletionRate: number;
  overallConversionRate: number;
}

export interface RetentionMetrics {
  spreadType: SpreadType;
  d1Retention: number;
  d7Retention: number;
  d30Retention: number;
  cohortSize: number;
}

export interface AnalyticsDashboardData {
  dateRange: { start: Date; end: Date };
  overview: {
    totalReadings: number;
    totalUsers: number;
    avgCompletionRate: number;
    avgDurationMs: number;
  };
  spreadMetrics: SpreadMetrics[];
  conversionFunnels: ConversionFunnel[];
  retentionMetrics: RetentionMetrics[];
  topSpread: SpreadType;
  trendingSpread: SpreadType | null;
}

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Detect device type from user agent
 */
export function detectDeviceType(userAgent: string): DeviceType {
  const ua = userAgent.toLowerCase();
  
  // Check tablet first (iPad, Android tablets, etc.)
  if (/ipad|tablet|playbook|silk/i.test(ua)) {
    return 'tablet';
  }
  
  // Then check mobile (phones)
  if (/mobile|iphone|ipod|blackberry|windows phone/i.test(ua)) {
    return 'mobile';
  }
  
  // Android without "mobile" could be tablet
  if (/android/i.test(ua) && !/mobile/i.test(ua)) {
    return 'tablet';
  }
  
  // Android with mobile is a phone
  if (/android/i.test(ua)) {
    return 'mobile';
  }
  
  return 'desktop';
}

/**
 * Generate a session ID for anonymous tracking
 */
export function generateSessionId(): string {
  return `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Get or create session ID from storage
 */
export function getSessionId(): string {
  if (typeof window === 'undefined') {
    return generateSessionId();
  }
  
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = generateSessionId();
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
}

// =============================================================================
// CLIENT-SIDE TRACKING
// =============================================================================

/**
 * Track a spread analytics event (client-side)
 */
export async function trackSpreadEvent(event: SpreadAnalyticsEvent): Promise<void> {
  try {
    // Add session ID if not provided
    const sessionId = event.sessionId || getSessionId();
    
    // Add device type if not provided
    const deviceType = event.deviceType || 
      (typeof navigator !== 'undefined' ? detectDeviceType(navigator.userAgent) : 'desktop');
    
    const enrichedEvent = {
      ...event,
      sessionId,
      deviceType,
      timestamp: new Date().toISOString(),
    };

    // Send to API
    await fetch('/api/analytics/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(enrichedEvent),
    });

    // Also send to GA4 if available
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as unknown as { gtag: (...args: unknown[]) => void }).gtag('event', event.eventType, {
        spread_type: event.spreadType,
        user_id: event.userId,
        reading_id: event.readingId,
        duration_ms: event.durationMs,
        device_type: deviceType,
        ...event.metadata,
      });
    }
  } catch (error) {
    console.error('Failed to track spread event:', error);
  }
}

// =============================================================================
// CONVENIENCE FUNCTIONS
// =============================================================================

/**
 * Track when user views a spread selection page
 */
export function trackSpreadPageView(spreadType: SpreadType, userId?: string): void {
  trackSpreadEvent({
    eventType: 'spread_page_view',
    spreadType,
    userId,
  });
}

/**
 * Track when user starts a reading
 */
export function trackSpreadStarted(
  spreadType: SpreadType,
  userId?: string,
  metadata?: Record<string, unknown>
): void {
  trackSpreadEvent({
    eventType: 'spread_started',
    spreadType,
    userId,
    metadata,
  });
}

/**
 * Track when user completes a reading
 */
export function trackSpreadCompleted(
  spreadType: SpreadType,
  readingId: string,
  durationMs: number,
  userId?: string
): void {
  trackSpreadEvent({
    eventType: 'spread_completed',
    spreadType,
    readingId,
    durationMs,
    userId,
  });
}

/**
 * Track when user abandons a reading
 */
export function trackSpreadAbandoned(
  spreadType: SpreadType,
  step: string,
  userId?: string
): void {
  trackSpreadEvent({
    eventType: 'spread_abandoned',
    spreadType,
    step,
    userId,
  });
}

/**
 * Track when login gate is shown
 */
export function trackGateShown(spreadType: SpreadType): void {
  trackSpreadEvent({
    eventType: 'spread_gate_shown',
    spreadType,
  });
}

/**
 * Track when user clicks login from gate
 */
export function trackLoginClicked(spreadType: SpreadType): void {
  trackSpreadEvent({
    eventType: 'login_prompt_clicked',
    spreadType,
  });
}

/**
 * Track when user completes signup (with attribution)
 */
export function trackSignupCompleted(triggerSpread?: SpreadType, userId?: string): void {
  trackSpreadEvent({
    eventType: 'signup_completed',
    spreadType: triggerSpread,
    userId,
    metadata: {
      signup_trigger: triggerSpread || 'direct',
    },
  });
}

/**
 * Track when question is submitted
 */
export function trackQuestionSubmitted(
  spreadType: SpreadType,
  questionLength: number,
  userId?: string
): void {
  trackSpreadEvent({
    eventType: 'question_submitted',
    spreadType,
    userId,
    metadata: { question_length: questionLength },
  });
}

/**
 * Track when card is drawn
 */
export function trackCardDrawn(
  spreadType: SpreadType,
  cardCount: number,
  userId?: string
): void {
  trackSpreadEvent({
    eventType: 'card_drawn',
    spreadType,
    userId,
    metadata: { card_count: cardCount },
  });
}

/**
 * Track when result page is viewed
 */
export function trackResultViewed(
  spreadType: SpreadType,
  readingId: string,
  userId?: string
): void {
  trackSpreadEvent({
    eventType: 'result_viewed',
    spreadType,
    readingId,
    userId,
  });
}

/**
 * Track when result is shared
 */
export function trackResultShared(
  spreadType: SpreadType,
  readingId: string,
  shareMethod: string,
  userId?: string
): void {
  trackSpreadEvent({
    eventType: 'result_shared',
    spreadType,
    readingId,
    userId,
    metadata: { share_method: shareMethod },
  });
}

/**
 * Track when user returns
 */
export function trackUserReturned(userId: string, daysSinceLastVisit: number): void {
  trackSpreadEvent({
    eventType: 'user_returned',
    userId,
    metadata: { days_since_last_visit: daysSinceLastVisit },
  });
}

/**
 * Track when user repeats a spread type
 */
export function trackSpreadRepeated(spreadType: SpreadType, repeatCount: number, userId: string): void {
  trackSpreadEvent({
    eventType: 'spread_repeated',
    spreadType,
    userId,
    metadata: { repeat_count: repeatCount },
  });
}

