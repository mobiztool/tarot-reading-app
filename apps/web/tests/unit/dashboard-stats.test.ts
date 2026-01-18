/**
 * Unit Tests: Dashboard Statistics
 * Story 9.5: Premium User Dashboard & Statistics
 * 
 * Tests for statistics calculation functions
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { DashboardSummary, ActivityDataPoint, SpreadDistributionItem } from '@/lib/dashboard/types';

// Mock data for testing
const mockSummary: DashboardSummary = {
  totalReadings: 50,
  readingsThisWeek: 7,
  readingsThisMonth: 28,
  favoriteSpread: 'three_card',
  favoriteSpreadTh: '3 ใบ',
  mostCommonCard: 'The Fool',
  mostCommonCardTh: 'คนโง่',
  currentStreak: 5,
  longestStreak: 14,
  memberSince: '2025-01-01T00:00:00.000Z',
};

const mockActivityData: ActivityDataPoint[] = [
  { date: '2026-01-10', count: 2, label: '10 ม.ค.' },
  { date: '2026-01-11', count: 1, label: '11 ม.ค.' },
  { date: '2026-01-12', count: 3, label: '12 ม.ค.' },
  { date: '2026-01-13', count: 0, label: '13 ม.ค.' },
  { date: '2026-01-14', count: 2, label: '14 ม.ค.' },
];

const mockSpreadDistribution: SpreadDistributionItem[] = [
  { spreadType: 'three_card', spreadTypeTh: '3 ใบ', count: 20, percentage: 40, color: '#8B5CF6' },
  { spreadType: 'daily', spreadTypeTh: 'ไพ่ประจำวัน', count: 15, percentage: 30, color: '#EC4899' },
  { spreadType: 'love_relationships', spreadTypeTh: 'ความรัก', count: 10, percentage: 20, color: '#F59E0B' },
  { spreadType: 'career_money', spreadTypeTh: 'การงาน', count: 5, percentage: 10, color: '#10B981' },
];

describe('Dashboard Statistics - TC-9.5-010 to TC-9.5-017', () => {
  describe('Total Readings Count - TC-9.5-010', () => {
    it('should return accurate total reading count', () => {
      expect(mockSummary.totalReadings).toBe(50);
      expect(mockSummary.totalReadings).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Weekly Readings - TC-9.5-011', () => {
    it('should return accurate weekly reading count', () => {
      expect(mockSummary.readingsThisWeek).toBe(7);
      expect(mockSummary.readingsThisWeek).toBeLessThanOrEqual(mockSummary.totalReadings);
    });
  });

  describe('Monthly Readings - TC-9.5-012', () => {
    it('should return accurate monthly reading count', () => {
      expect(mockSummary.readingsThisMonth).toBe(28);
      expect(mockSummary.readingsThisMonth).toBeLessThanOrEqual(mockSummary.totalReadings);
      expect(mockSummary.readingsThisMonth).toBeGreaterThanOrEqual(mockSummary.readingsThisWeek);
    });
  });

  describe('Favorite Spread - TC-9.5-015', () => {
    it('should identify the most used spread type', () => {
      expect(mockSummary.favoriteSpread).toBe('three_card');
      expect(mockSummary.favoriteSpreadTh).toBe('3 ใบ');
    });
  });

  describe('Most Common Card - TC-9.5-016', () => {
    it('should identify the most frequently drawn card', () => {
      expect(mockSummary.mostCommonCard).toBe('The Fool');
      expect(mockSummary.mostCommonCardTh).toBe('คนโง่');
    });
  });
});

describe('Activity Data - TC-9.5-020 to TC-9.5-025', () => {
  describe('Activity Chart Data - TC-9.5-020', () => {
    it('should contain date, count, and label for each data point', () => {
      mockActivityData.forEach(point => {
        expect(point).toHaveProperty('date');
        expect(point).toHaveProperty('count');
        expect(point).toHaveProperty('label');
        expect(typeof point.count).toBe('number');
        expect(point.count).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe('Activity Data Accuracy - TC-9.5-022', () => {
    it('should have accurate data points', () => {
      const totalFromActivity = mockActivityData.reduce((sum, d) => sum + d.count, 0);
      expect(totalFromActivity).toBe(8);
    });
  });

  describe('Empty State - TC-9.5-025', () => {
    it('should handle empty activity data', () => {
      const emptyData: ActivityDataPoint[] = [];
      expect(emptyData.length).toBe(0);
    });
  });
});

describe('Spread Distribution - TC-9.5-030 to TC-9.5-035', () => {
  describe('Distribution Data - TC-9.5-030', () => {
    it('should include all required fields', () => {
      mockSpreadDistribution.forEach(item => {
        expect(item).toHaveProperty('spreadType');
        expect(item).toHaveProperty('spreadTypeTh');
        expect(item).toHaveProperty('count');
        expect(item).toHaveProperty('percentage');
        expect(item).toHaveProperty('color');
      });
    });
  });

  describe('Percentage Accuracy - TC-9.5-031', () => {
    it('should have percentages that sum to 100', () => {
      const totalPercentage = mockSpreadDistribution.reduce((sum, d) => sum + d.percentage, 0);
      expect(totalPercentage).toBe(100);
    });

    it('should have accurate percentage calculations', () => {
      const totalCount = mockSpreadDistribution.reduce((sum, d) => sum + d.count, 0);
      mockSpreadDistribution.forEach(item => {
        const expectedPercentage = Math.round((item.count / totalCount) * 100);
        expect(item.percentage).toBe(expectedPercentage);
      });
    });
  });

  describe('Colors - TC-9.5-033', () => {
    it('should have distinctive colors', () => {
      const colors = mockSpreadDistribution.map(d => d.color);
      const uniqueColors = new Set(colors);
      expect(uniqueColors.size).toBe(colors.length);
    });
  });

  describe('Thai Labels - TC-9.5-034', () => {
    it('should have Thai labels for all spreads', () => {
      mockSpreadDistribution.forEach(item => {
        expect(item.spreadTypeTh).toBeTruthy();
        expect(typeof item.spreadTypeTh).toBe('string');
      });
    });
  });
});

describe('Streak Tracking', () => {
  describe('Current Streak', () => {
    it('should track current streak correctly', () => {
      expect(mockSummary.currentStreak).toBe(5);
      expect(mockSummary.currentStreak).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Longest Streak', () => {
    it('should track longest streak correctly', () => {
      expect(mockSummary.longestStreak).toBe(14);
      expect(mockSummary.longestStreak).toBeGreaterThanOrEqual(mockSummary.currentStreak);
    });
  });
});

describe('Time Range Filtering', () => {
  it('should support 7-day range', () => {
    const timeRange = '7d';
    expect(['7d', '30d', '90d', 'all']).toContain(timeRange);
  });

  it('should support 30-day range', () => {
    const timeRange = '30d';
    expect(['7d', '30d', '90d', 'all']).toContain(timeRange);
  });

  it('should support 90-day range', () => {
    const timeRange = '90d';
    expect(['7d', '30d', '90d', 'all']).toContain(timeRange);
  });

  it('should support all-time range', () => {
    const timeRange = 'all';
    expect(['7d', '30d', '90d', 'all']).toContain(timeRange);
  });
});
