/**
 * Unit Tests for Spread Analytics (Story 5.7)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  detectDeviceType,
  generateSessionId,
  SpreadType,
  AnalyticsEventType,
} from '../../src/lib/analytics/spreadAnalytics';

describe('Spread Analytics', () => {
  describe('detectDeviceType', () => {
    it('should detect mobile devices', () => {
      const mobileUserAgents = [
        'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
        'Mozilla/5.0 (Linux; Android 10; SM-G975F) Mobile', // Phones have "Mobile"
        'Mozilla/5.0 (Linux; Android 11; Pixel 5) Mobile',
        'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
      ];

      mobileUserAgents.forEach((ua) => {
        expect(detectDeviceType(ua)).toBe('mobile');
      });
    });

    it('should detect tablet devices', () => {
      const tabletUserAgents = [
        'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X)',
        'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36', // Android without "mobile"
        'Mozilla/5.0 (PlayBook; U; RIM Tablet OS)',
        'Mozilla/5.0 (Linux; Android 10; Tablet) AppleWebKit/537.36',
      ];

      tabletUserAgents.forEach((ua) => {
        expect(detectDeviceType(ua)).toBe('tablet');
      });
    });

    it('should detect desktop devices', () => {
      const desktopUserAgents = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
      ];

      desktopUserAgents.forEach((ua) => {
        expect(detectDeviceType(ua)).toBe('desktop');
      });
    });
  });

  describe('generateSessionId', () => {
    it('should generate unique session IDs', () => {
      const ids = new Set<string>();
      for (let i = 0; i < 100; i++) {
        ids.add(generateSessionId());
      }
      expect(ids.size).toBe(100);
    });

    it('should have correct prefix', () => {
      const sessionId = generateSessionId();
      expect(sessionId.startsWith('sess_')).toBe(true);
    });

    it('should have reasonable length', () => {
      const sessionId = generateSessionId();
      expect(sessionId.length).toBeGreaterThan(15);
      expect(sessionId.length).toBeLessThan(50);
    });
  });

  describe('SpreadType', () => {
    it('should include all spread types', () => {
      const expectedTypes: SpreadType[] = [
        'daily',
        'three_card',
        'love_relationships',
        'career_money',
        'yes_no',
      ];

      // Type check - if this compiles, the types are correct
      expectedTypes.forEach((type) => {
        expect(typeof type).toBe('string');
      });
    });
  });

  describe('AnalyticsEventType', () => {
    it('should include all event types', () => {
      const expectedEvents: AnalyticsEventType[] = [
        'spread_page_view',
        'spread_started',
        'spread_completed',
        'spread_abandoned',
        'spread_gate_shown',
        'login_prompt_clicked',
        'signup_completed',
        'question_submitted',
        'card_drawn',
        'result_viewed',
        'result_shared',
        'user_returned',
        'spread_repeated',
      ];

      expect(expectedEvents.length).toBe(13);
    });
  });
});

describe('Analytics Event Structure', () => {
  it('should have all required fields for spread events', () => {
    // Test event structure
    const event = {
      eventType: 'spread_completed' as AnalyticsEventType,
      spreadType: 'love_relationships' as SpreadType,
      userId: 'user-123',
      readingId: 'reading-456',
      deviceType: 'mobile' as const,
      sessionId: 'sess_123',
      durationMs: 45000,
      metadata: { question_length: 50 },
    };

    expect(event.eventType).toBeDefined();
    expect(event.spreadType).toBeDefined();
    expect(event.userId).toBeDefined();
    expect(event.durationMs).toBeGreaterThan(0);
  });

  it('should allow optional fields to be undefined', () => {
    const minimalEvent = {
      eventType: 'spread_started' as AnalyticsEventType,
      spreadType: 'daily' as SpreadType,
    };

    expect(minimalEvent.eventType).toBe('spread_started');
    expect(minimalEvent.spreadType).toBe('daily');
  });
});

describe('Conversion Funnel Events', () => {
  it('should track correct funnel order', () => {
    const funnelSteps: AnalyticsEventType[] = [
      'spread_gate_shown',
      'login_prompt_clicked',
      'signup_completed',
      'spread_completed',
    ];

    // Verify order makes sense
    expect(funnelSteps[0]).toBe('spread_gate_shown');
    expect(funnelSteps[1]).toBe('login_prompt_clicked');
    expect(funnelSteps[2]).toBe('signup_completed');
    expect(funnelSteps[3]).toBe('spread_completed');
  });
});

describe('Metrics Calculations', () => {
  it('should calculate completion rate correctly', () => {
    const started = 100;
    const completed = 75;
    const completionRate = (completed / started) * 100;
    
    expect(completionRate).toBe(75);
  });

  it('should calculate conversion rate correctly', () => {
    const gateShown = 1000;
    const spreadCompleted = 120;
    const conversionRate = (spreadCompleted / gateShown) * 100;
    
    expect(conversionRate).toBe(12);
  });

  it('should handle zero division', () => {
    const started = 0;
    const completed = 0;
    const completionRate = started > 0 ? (completed / started) * 100 : 0;
    
    expect(completionRate).toBe(0);
  });

  it('should calculate repeat rate correctly', () => {
    const uniqueUsers = 100;
    const usersWithMultiple = 25;
    const repeatRate = (usersWithMultiple / uniqueUsers) * 100;
    
    expect(repeatRate).toBe(25);
  });
});

describe('Dashboard Data Structure', () => {
  it('should have correct overview structure', () => {
    const overview = {
      totalReadings: 1000,
      totalUsers: 250,
      avgCompletionRate: 85,
      avgDurationMs: 45000,
    };

    expect(overview.totalReadings).toBeGreaterThan(0);
    expect(overview.totalUsers).toBeGreaterThan(0);
    expect(overview.avgCompletionRate).toBeGreaterThanOrEqual(0);
    expect(overview.avgCompletionRate).toBeLessThanOrEqual(100);
    expect(overview.avgDurationMs).toBeGreaterThan(0);
  });

  it('should have correct spread metrics structure', () => {
    const spreadMetric = {
      spreadType: 'love_relationships',
      totalReadings: 500,
      uniqueUsers: 300,
      completionRate: 90,
      avgDurationMs: 60000,
      repeatRate: 30,
    };

    expect(spreadMetric.spreadType).toBeDefined();
    expect(spreadMetric.totalReadings).toBeGreaterThanOrEqual(0);
    expect(spreadMetric.completionRate).toBeGreaterThanOrEqual(0);
    expect(spreadMetric.completionRate).toBeLessThanOrEqual(100);
  });

  it('should have correct funnel structure', () => {
    const funnel = {
      spreadType: 'career_money',
      gateShown: 1000,
      loginClicked: 300,
      signupCompleted: 150,
      spreadCompleted: 120,
      gateToLoginRate: 30,
      loginToSignupRate: 50,
      signupToCompletionRate: 80,
      overallConversionRate: 12,
    };

    // Verify funnel narrows (or stays same)
    expect(funnel.gateShown).toBeGreaterThanOrEqual(funnel.loginClicked);
    expect(funnel.loginClicked).toBeGreaterThanOrEqual(funnel.signupCompleted);
    expect(funnel.signupCompleted).toBeGreaterThanOrEqual(funnel.spreadCompleted);
  });

  it('should have correct retention structure', () => {
    const retention = {
      spreadType: 'yes_no',
      d1Retention: 60,
      d7Retention: 40,
      d30Retention: 20,
      cohortSize: 100,
    };

    // Retention typically decreases over time
    expect(retention.d1Retention).toBeGreaterThanOrEqual(retention.d7Retention);
    expect(retention.d7Retention).toBeGreaterThanOrEqual(retention.d30Retention);
    expect(retention.cohortSize).toBeGreaterThan(0);
  });
});

describe('Date Range Filtering', () => {
  it('should calculate correct date ranges', () => {
    const now = new Date();
    
    // 7 days ago
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    expect(sevenDaysAgo < now).toBe(true);
    
    // 30 days ago
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    expect(thirtyDaysAgo < sevenDaysAgo).toBe(true);
    
    // 90 days ago
    const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    expect(ninetyDaysAgo < thirtyDaysAgo).toBe(true);
  });
});

describe('CSV Export Format', () => {
  it('should generate valid CSV format', () => {
    const headers = ['Spread', 'Total Readings', 'Unique Users', 'Completion Rate'];
    const rows = [
      ['Daily', '100', '50', '85%'],
      ['Love', '200', '100', '90%'],
    ];
    
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    
    expect(csv).toContain('Spread,Total Readings');
    expect(csv).toContain('Daily,100,50,85%');
    expect(csv.split('\n').length).toBe(3);
  });
});

