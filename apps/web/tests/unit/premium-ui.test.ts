/**
 * Story 7.7: Premium UI Enhancements Tests
 * Tests for premium components and utilities
 */

import { describe, it, expect } from 'vitest';
import { 
  SUBSCRIPTION_TIERS,
  getTierConfig,
  getTierNameTh,
  compareTiers,
  isHigherTier,
  canAccessSpread,
} from '../../src/lib/subscription/tiers';
import { 
  getCardBackPath, 
  getPremiumCardBackPath 
} from '../../src/types/card';

describe('Story 7.7: Premium UI Enhancements', () => {
  
  describe('Premium Card Backs', () => {
    it('should return standard card back path for non-premium', () => {
      const path = getPremiumCardBackPath(false);
      expect(path).toBe('/cards/card-back.svg');
    });

    it('should return premium card back path for premium users', () => {
      const path = getPremiumCardBackPath(true);
      expect(path).toBe('/cards/card-back-premium.svg');
    });

    it('should have getCardBackPath return standard path', () => {
      expect(getCardBackPath()).toBe('/cards/card-back.svg');
    });
  });

  describe('Premium Tier Configuration', () => {
    describe('Tier Configs', () => {
      it('should have all 4 tiers defined', () => {
        expect(Object.keys(SUBSCRIPTION_TIERS).length).toBe(4);
        expect(SUBSCRIPTION_TIERS.free).toBeDefined();
        expect(SUBSCRIPTION_TIERS.basic).toBeDefined();
        expect(SUBSCRIPTION_TIERS.pro).toBeDefined();
        expect(SUBSCRIPTION_TIERS.vip).toBeDefined();
      });

      it('should have correct prices for each tier', () => {
        expect(SUBSCRIPTION_TIERS.free.price).toBe(0);
        expect(SUBSCRIPTION_TIERS.basic.price).toBe(99);
        expect(SUBSCRIPTION_TIERS.pro.price).toBe(199);
        expect(SUBSCRIPTION_TIERS.vip.price).toBe(399);
      });

      it('should have VIP tier marked as priority and vip', () => {
        expect(SUBSCRIPTION_TIERS.vip.priority).toBe(true);
        expect(SUBSCRIPTION_TIERS.vip.vip).toBe(true);
      });

      it('should have Pro tier marked as priority', () => {
        expect(SUBSCRIPTION_TIERS.pro.priority).toBe(true);
      });

      it('should have Thai names for all tiers', () => {
        expect(SUBSCRIPTION_TIERS.free.nameTh).toBe('ฟรี');
        expect(SUBSCRIPTION_TIERS.basic.nameTh).toBe('เบสิค');
        expect(SUBSCRIPTION_TIERS.pro.nameTh).toBe('โปร');
        expect(SUBSCRIPTION_TIERS.vip.nameTh).toBe('วีไอพี');
      });
    });

    describe('getTierConfig', () => {
      it('should return correct config for each tier', () => {
        expect(getTierConfig('free').name).toBe('Free');
        expect(getTierConfig('basic').name).toBe('Basic');
        expect(getTierConfig('pro').name).toBe('Pro');
        expect(getTierConfig('vip').name).toBe('VIP');
      });
    });

    describe('getTierNameTh', () => {
      it('should return Thai names for all tiers', () => {
        expect(getTierNameTh('free')).toBe('ฟรี');
        expect(getTierNameTh('basic')).toBe('เบสิค');
        expect(getTierNameTh('pro')).toBe('โปร');
        expect(getTierNameTh('vip')).toBe('วีไอพี');
      });
    });

    describe('compareTiers', () => {
      it('should return positive when tier1 > tier2', () => {
        expect(compareTiers('vip', 'free')).toBeGreaterThan(0);
        expect(compareTiers('pro', 'basic')).toBeGreaterThan(0);
        expect(compareTiers('basic', 'free')).toBeGreaterThan(0);
      });

      it('should return negative when tier1 < tier2', () => {
        expect(compareTiers('free', 'vip')).toBeLessThan(0);
        expect(compareTiers('basic', 'pro')).toBeLessThan(0);
      });

      it('should return 0 when tiers are equal', () => {
        expect(compareTiers('vip', 'vip')).toBe(0);
        expect(compareTiers('free', 'free')).toBe(0);
      });
    });

    describe('isHigherTier', () => {
      it('should return true when tier1 is higher', () => {
        expect(isHigherTier('vip', 'pro')).toBe(true);
        expect(isHigherTier('pro', 'basic')).toBe(true);
        expect(isHigherTier('basic', 'free')).toBe(true);
      });

      it('should return false when tier1 is lower or equal', () => {
        expect(isHigherTier('free', 'vip')).toBe(false);
        expect(isHigherTier('vip', 'vip')).toBe(false);
      });
    });
  });

  describe('Premium Spread Access', () => {
    it('should grant VIP access to all spreads (wildcard)', () => {
      expect(SUBSCRIPTION_TIERS.vip.spreadAccess).toContain('*');
    });

    it('should grant Pro access to premium spreads', () => {
      expect(SUBSCRIPTION_TIERS.pro.spreadAccess).toContain('celtic_cross');
      expect(SUBSCRIPTION_TIERS.pro.spreadAccess).toContain('decision_making');
    });

    it('should allow VIP to access any spread', () => {
      expect(canAccessSpread('vip', 'celtic_cross')).toBe(true);
      expect(canAccessSpread('vip', 'random_spread')).toBe(true);
    });

    it('should restrict free tier to basic spreads', () => {
      expect(canAccessSpread('free', 'daily')).toBe(true);
      expect(canAccessSpread('free', 'three_card')).toBe(true);
      expect(canAccessSpread('free', 'celtic_cross')).toBe(false);
    });
  });

  describe('Premium Tier Features', () => {
    it('should have unlimited readings for paid tiers', () => {
      expect(SUBSCRIPTION_TIERS.basic.maxReadingsPerDay).toBe(-1);
      expect(SUBSCRIPTION_TIERS.pro.maxReadingsPerDay).toBe(-1);
      expect(SUBSCRIPTION_TIERS.vip.maxReadingsPerDay).toBe(-1);
    });

    it('should have limited readings for free tier', () => {
      expect(SUBSCRIPTION_TIERS.free.maxReadingsPerDay).toBe(3);
    });

    it('should have features defined for all tiers', () => {
      Object.values(SUBSCRIPTION_TIERS).forEach(tier => {
        expect(tier.features.length).toBeGreaterThan(0);
        expect(tier.featuresTh.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Premium Visual Configuration', () => {
    it('should have VIP tier as highest priority', () => {
      const tierOrder = ['free', 'basic', 'pro', 'vip'];
      for (let i = 0; i < tierOrder.length - 1; i++) {
        expect(
          isHigherTier(tierOrder[i + 1] as 'free' | 'basic' | 'pro' | 'vip', 
                       tierOrder[i] as 'free' | 'basic' | 'pro' | 'vip')
        ).toBe(true);
      }
    });
  });
});
