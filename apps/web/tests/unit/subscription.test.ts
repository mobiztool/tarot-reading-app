/**
 * Subscription Unit Tests
 * Story 7.9: Phase 3 Testing & QA - Subscription Lifecycle Testing
 * 
 * Tests for subscription tiers, helpers, and lifecycle management
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  SUBSCRIPTION_TIERS,
  TIER_PRICES,
  getTierConfig,
  getTierNameTh,
  getTierPrice,
  canAccessSpread,
  getPaidTiers,
  compareTiers,
  isHigherTier,
} from '@/lib/subscription/tiers';
import {
  getTierFromPriceId,
  isInGracePeriod,
  getDaysUntilEnd,
  getStatusDisplayTh,
  getStatusColor,
} from '@/lib/subscription/helpers';
import type { SubscriptionTier, SubscriptionStatus } from '@/types/subscription';

describe('Subscription Tiers Configuration', () => {
  describe('SUBSCRIPTION_TIERS', () => {
    it('should have exactly 4 tiers defined', () => {
      expect(Object.keys(SUBSCRIPTION_TIERS)).toHaveLength(4);
    });

    it('should have correct tier IDs', () => {
      expect(SUBSCRIPTION_TIERS.free).toBeDefined();
      expect(SUBSCRIPTION_TIERS.basic).toBeDefined();
      expect(SUBSCRIPTION_TIERS.pro).toBeDefined();
      expect(SUBSCRIPTION_TIERS.vip).toBeDefined();
    });

    it('should have correct Thai names for all tiers', () => {
      expect(SUBSCRIPTION_TIERS.free.nameTh).toBe('ฟรี');
      expect(SUBSCRIPTION_TIERS.basic.nameTh).toBe('เบสิค');
      expect(SUBSCRIPTION_TIERS.pro.nameTh).toBe('โปร');
      expect(SUBSCRIPTION_TIERS.vip.nameTh).toBe('วีไอพี');
    });

    it('should have correct prices in THB', () => {
      expect(SUBSCRIPTION_TIERS.free.price).toBe(0);
      expect(SUBSCRIPTION_TIERS.basic.price).toBe(99);
      expect(SUBSCRIPTION_TIERS.pro.price).toBe(199);
      expect(SUBSCRIPTION_TIERS.vip.price).toBe(399);
    });

    it('should have features array for each tier', () => {
      Object.values(SUBSCRIPTION_TIERS).forEach(tier => {
        expect(tier.features).toBeInstanceOf(Array);
        expect(tier.features.length).toBeGreaterThan(0);
        expect(tier.featuresTh).toBeInstanceOf(Array);
        expect(tier.featuresTh.length).toBeGreaterThan(0);
      });
    });

    it('should have spreadAccess array for each tier', () => {
      Object.values(SUBSCRIPTION_TIERS).forEach(tier => {
        expect(tier.spreadAccess).toBeInstanceOf(Array);
        expect(tier.spreadAccess.length).toBeGreaterThan(0);
      });
    });

    it('should have progressive spread access (higher tiers have more)', () => {
      // Free has 2 spreads
      expect(SUBSCRIPTION_TIERS.free.spreadAccess.length).toBe(2);
      // Basic has 5 spreads
      expect(SUBSCRIPTION_TIERS.basic.spreadAccess.length).toBe(5);
      // Pro has 10 spreads
      expect(SUBSCRIPTION_TIERS.pro.spreadAccess.length).toBe(10);
      // VIP has '*' which means all
      expect(SUBSCRIPTION_TIERS.vip.spreadAccess).toContain('*');
    });
  });

  describe('TIER_PRICES', () => {
    it('should match SUBSCRIPTION_TIERS prices', () => {
      expect(TIER_PRICES.free).toBe(SUBSCRIPTION_TIERS.free.price);
      expect(TIER_PRICES.basic).toBe(SUBSCRIPTION_TIERS.basic.price);
      expect(TIER_PRICES.pro).toBe(SUBSCRIPTION_TIERS.pro.price);
      expect(TIER_PRICES.vip).toBe(SUBSCRIPTION_TIERS.vip.price);
    });
  });
});

describe('Tier Helper Functions', () => {
  describe('getTierConfig', () => {
    it('should return correct config for each tier', () => {
      expect(getTierConfig('free').id).toBe('free');
      expect(getTierConfig('basic').id).toBe('basic');
      expect(getTierConfig('pro').id).toBe('pro');
      expect(getTierConfig('vip').id).toBe('vip');
    });
  });

  describe('getTierNameTh', () => {
    it('should return Thai names correctly', () => {
      expect(getTierNameTh('free')).toBe('ฟรี');
      expect(getTierNameTh('basic')).toBe('เบสิค');
      expect(getTierNameTh('pro')).toBe('โปร');
      expect(getTierNameTh('vip')).toBe('วีไอพี');
    });
  });

  describe('getTierPrice', () => {
    it('should return correct prices', () => {
      expect(getTierPrice('free')).toBe(0);
      expect(getTierPrice('basic')).toBe(99);
      expect(getTierPrice('pro')).toBe(199);
      expect(getTierPrice('vip')).toBe(399);
    });
  });

  describe('canAccessSpread', () => {
    it('should allow free tier access to daily and three_card', () => {
      expect(canAccessSpread('free', 'daily')).toBe(true);
      expect(canAccessSpread('free', 'three_card')).toBe(true);
    });

    it('should NOT allow free tier access to paid spreads', () => {
      expect(canAccessSpread('free', 'love_relationships')).toBe(false);
      expect(canAccessSpread('free', 'celtic_cross')).toBe(false);
    });

    it('should allow basic tier access to love, career, yes_no', () => {
      expect(canAccessSpread('basic', 'love_relationships')).toBe(true);
      expect(canAccessSpread('basic', 'career_money')).toBe(true);
      expect(canAccessSpread('basic', 'yes_no')).toBe(true);
    });

    it('should NOT allow basic tier access to pro spreads', () => {
      expect(canAccessSpread('basic', 'celtic_cross')).toBe(false);
      expect(canAccessSpread('basic', 'decision_making')).toBe(false);
    });

    it('should allow pro tier access to all pro spreads', () => {
      expect(canAccessSpread('pro', 'celtic_cross')).toBe(true);
      expect(canAccessSpread('pro', 'decision_making')).toBe(true);
      expect(canAccessSpread('pro', 'self_discovery')).toBe(true);
    });

    it('should allow VIP tier access to ALL spreads (wildcard)', () => {
      expect(canAccessSpread('vip', 'daily')).toBe(true);
      expect(canAccessSpread('vip', 'celtic_cross')).toBe(true);
      expect(canAccessSpread('vip', 'any_future_spread')).toBe(true);
    });
  });

  describe('getPaidTiers', () => {
    it('should return only paid tiers (excludes free)', () => {
      const paidTiers = getPaidTiers();
      expect(paidTiers.length).toBe(3);
      expect(paidTiers.map(t => t.id)).not.toContain('free');
      expect(paidTiers.map(t => t.id)).toContain('basic');
      expect(paidTiers.map(t => t.id)).toContain('pro');
      expect(paidTiers.map(t => t.id)).toContain('vip');
    });

    it('should have all tiers with price > 0', () => {
      const paidTiers = getPaidTiers();
      paidTiers.forEach(tier => {
        expect(tier.price).toBeGreaterThan(0);
      });
    });
  });

  describe('compareTiers', () => {
    it('should return negative when tier1 < tier2', () => {
      expect(compareTiers('free', 'basic')).toBeLessThan(0);
      expect(compareTiers('basic', 'pro')).toBeLessThan(0);
      expect(compareTiers('pro', 'vip')).toBeLessThan(0);
    });

    it('should return 0 when tiers are equal', () => {
      expect(compareTiers('free', 'free')).toBe(0);
      expect(compareTiers('pro', 'pro')).toBe(0);
    });

    it('should return positive when tier1 > tier2', () => {
      expect(compareTiers('basic', 'free')).toBeGreaterThan(0);
      expect(compareTiers('vip', 'pro')).toBeGreaterThan(0);
    });
  });

  describe('isHigherTier', () => {
    it('should return true when tier1 is higher than tier2', () => {
      expect(isHigherTier('basic', 'free')).toBe(true);
      expect(isHigherTier('pro', 'basic')).toBe(true);
      expect(isHigherTier('vip', 'pro')).toBe(true);
      expect(isHigherTier('vip', 'free')).toBe(true);
    });

    it('should return false when tier1 is lower or equal to tier2', () => {
      expect(isHigherTier('free', 'basic')).toBe(false);
      expect(isHigherTier('pro', 'vip')).toBe(false);
      expect(isHigherTier('basic', 'basic')).toBe(false);
    });
  });
});

describe('Subscription Helper Functions', () => {
  describe('getTierFromPriceId', () => {
    beforeEach(() => {
      // Mock environment variables
      vi.stubEnv('STRIPE_PRICE_ID_BASIC', 'price_basic_123');
      vi.stubEnv('STRIPE_PRICE_ID_PRO', 'price_pro_456');
      vi.stubEnv('STRIPE_PRICE_ID_VIP', 'price_vip_789');
    });

    it('should return basic tier for basic price ID', () => {
      expect(getTierFromPriceId('price_basic_123')).toBe('basic');
    });

    it('should return pro tier for pro price ID', () => {
      expect(getTierFromPriceId('price_pro_456')).toBe('pro');
    });

    it('should return vip tier for vip price ID', () => {
      expect(getTierFromPriceId('price_vip_789')).toBe('vip');
    });

    it('should return free tier for unknown price ID', () => {
      expect(getTierFromPriceId('unknown_price_id')).toBe('free');
    });
  });

  describe('isInGracePeriod', () => {
    it('should return false when cancel_at is null', () => {
      const subscription = {
        status: 'active' as SubscriptionStatus,
        cancel_at: null,
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      };
      expect(isInGracePeriod(subscription)).toBe(false);
    });

    it('should return true when in grace period (active with future cancel_at)', () => {
      const subscription = {
        status: 'active' as SubscriptionStatus,
        cancel_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        current_period_end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      };
      expect(isInGracePeriod(subscription)).toBe(true);
    });

    it('should return false when grace period has ended', () => {
      const subscription = {
        status: 'active' as SubscriptionStatus,
        cancel_at: new Date(Date.now() - 1000), // in the past
        current_period_end: new Date(Date.now() - 1000),
      };
      expect(isInGracePeriod(subscription)).toBe(false);
    });

    it('should return false when status is not active', () => {
      const subscription = {
        status: 'canceled' as SubscriptionStatus,
        cancel_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        current_period_end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      };
      expect(isInGracePeriod(subscription)).toBe(false);
    });
  });

  describe('getDaysUntilEnd', () => {
    it('should return correct days until subscription ends', () => {
      // 7 days from now
      const endDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      const days = getDaysUntilEnd(endDate);
      expect(days).toBeGreaterThanOrEqual(6);
      expect(days).toBeLessThanOrEqual(8);
    });

    it('should return 0 for past dates', () => {
      const endDate = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000);
      expect(getDaysUntilEnd(endDate)).toBe(0);
    });

    it('should return 1 for end of today', () => {
      const endDate = new Date(Date.now() + 12 * 60 * 60 * 1000); // 12 hours from now
      expect(getDaysUntilEnd(endDate)).toBe(1);
    });
  });

  describe('getStatusDisplayTh', () => {
    it('should return correct Thai status for all statuses', () => {
      expect(getStatusDisplayTh('active')).toBe('ใช้งาน');
      expect(getStatusDisplayTh('trialing')).toBe('ทดลองใช้');
      expect(getStatusDisplayTh('past_due')).toBe('ค้างชำระ');
      expect(getStatusDisplayTh('canceled')).toBe('ยกเลิกแล้ว');
      expect(getStatusDisplayTh('paused')).toBe('หยุดชั่วคราว');
      expect(getStatusDisplayTh('incomplete')).toBe('รอชำระเงิน');
      expect(getStatusDisplayTh('incomplete_expired')).toBe('หมดอายุ');
      expect(getStatusDisplayTh('unpaid')).toBe('ไม่ชำระเงิน');
    });
  });

  describe('getStatusColor', () => {
    it('should return green for active status', () => {
      expect(getStatusColor('active')).toBe('green');
    });

    it('should return blue for trialing status', () => {
      expect(getStatusColor('trialing')).toBe('blue');
    });

    it('should return yellow for past_due status', () => {
      expect(getStatusColor('past_due')).toBe('yellow');
    });

    it('should return gray for canceled status', () => {
      expect(getStatusColor('canceled')).toBe('gray');
    });

    it('should return red for unpaid and incomplete_expired statuses', () => {
      expect(getStatusColor('unpaid')).toBe('red');
      expect(getStatusColor('incomplete_expired')).toBe('red');
    });
  });
});

describe('Subscription Lifecycle Scenarios', () => {
  describe('Trial to Paid Transition', () => {
    it('should recognize trialing as active subscription status', () => {
      const trialingColor = getStatusColor('trialing');
      expect(trialingColor).toBe('blue'); // Distinct from active
    });

    it('should display trialing in Thai correctly', () => {
      expect(getStatusDisplayTh('trialing')).toBe('ทดลองใช้');
    });
  });

  describe('Cancellation Flow', () => {
    it('should correctly identify grace period after cancellation', () => {
      // User cancels but has 7 days left
      const subscription = {
        status: 'active' as SubscriptionStatus,
        cancel_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        current_period_end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      };
      
      expect(isInGracePeriod(subscription)).toBe(true);
      expect(getDaysUntilEnd(subscription.cancel_at)).toBeGreaterThanOrEqual(6);
    });

    it('should show canceled status correctly after grace period', () => {
      expect(getStatusDisplayTh('canceled')).toBe('ยกเลิกแล้ว');
      expect(getStatusColor('canceled')).toBe('gray');
    });
  });

  describe('Payment Failure Handling', () => {
    it('should identify past_due status correctly', () => {
      expect(getStatusDisplayTh('past_due')).toBe('ค้างชำระ');
      expect(getStatusColor('past_due')).toBe('yellow');
    });

    it('should identify unpaid status correctly', () => {
      expect(getStatusDisplayTh('unpaid')).toBe('ไม่ชำระเงิน');
      expect(getStatusColor('unpaid')).toBe('red');
    });
  });

  describe('Tier Upgrade/Downgrade', () => {
    it('should correctly compare tier levels for upgrade path', () => {
      // Upgrade: free → basic → pro → vip
      expect(isHigherTier('basic', 'free')).toBe(true);
      expect(isHigherTier('pro', 'basic')).toBe(true);
      expect(isHigherTier('vip', 'pro')).toBe(true);
    });

    it('should correctly identify downgrade', () => {
      expect(isHigherTier('basic', 'pro')).toBe(false);
      expect(compareTiers('basic', 'pro')).toBeLessThan(0);
    });
  });
});

describe('Reading Limits by Tier', () => {
  it('should have 3 readings per day for free tier', () => {
    expect(SUBSCRIPTION_TIERS.free.maxReadingsPerDay).toBe(3);
  });

  it('should have unlimited readings for basic tier', () => {
    expect(SUBSCRIPTION_TIERS.basic.maxReadingsPerDay).toBe(-1);
  });

  it('should have unlimited readings for pro tier', () => {
    expect(SUBSCRIPTION_TIERS.pro.maxReadingsPerDay).toBe(-1);
  });

  it('should have unlimited readings for vip tier', () => {
    expect(SUBSCRIPTION_TIERS.vip.maxReadingsPerDay).toBe(-1);
  });
});
