/**
 * Unit Tests: Access Control
 * Tests for lib/access-control/spread-info.ts (client-side functions)
 * 
 * Story: 6.3 - Feature Gating by Subscription Tier
 * Story: 7.9 - Phase 3 Testing & QA
 * 
 * NOTE: This file tests client-side access control functions only.
 * Server-side functions (that use Prisma) are tested in integration tests.
 */

import { describe, it, expect } from 'vitest';
import {
  canAccessSpreadClient,
  getMinimumTier,
  SPREAD_ACCESS_MATRIX,
  SPREAD_INFO,
  TIER_LEVELS,
  type SpreadType,
} from '../../src/lib/access-control/spread-info';
import {
  getUpgradeMessage,
  getUpgradeBenefits,
  type UserTier,
} from '../../src/lib/access-control';
import type { SubscriptionTier } from '../../src/types/subscription';

describe('Access Control - Client Side', () => {
  describe('canAccessSpreadClient', () => {
    describe('Free tier access', () => {
      it('should allow free user to access daily reading', () => {
        expect(canAccessSpreadClient('free', 'daily')).toBe(true);
      });

      it('should allow free user to access three-card reading', () => {
        expect(canAccessSpreadClient('free', 'three_card')).toBe(true);
      });

      it('should NOT allow free user to access love reading (requires basic)', () => {
        expect(canAccessSpreadClient('free', 'love_relationships')).toBe(false);
      });

      it('should NOT allow free user to access career reading (requires basic)', () => {
        expect(canAccessSpreadClient('free', 'career_money')).toBe(false);
      });

      it('should NOT allow free user to access yes/no reading (requires basic)', () => {
        expect(canAccessSpreadClient('free', 'yes_no')).toBe(false);
      });

      it('should NOT allow free user to access premium spreads (requires pro)', () => {
        expect(canAccessSpreadClient('free', 'celtic_cross')).toBe(false);
        expect(canAccessSpreadClient('free', 'decision_making')).toBe(false);
        expect(canAccessSpreadClient('free', 'self_discovery')).toBe(false);
        expect(canAccessSpreadClient('free', 'relationship_deep_dive')).toBe(false);
      });
    });

    describe('Basic tier access', () => {
      it('should allow basic user to access all free spreads', () => {
        expect(canAccessSpreadClient('basic', 'daily')).toBe(true);
        expect(canAccessSpreadClient('basic', 'three_card')).toBe(true);
      });

      it('should allow basic user to access love reading', () => {
        expect(canAccessSpreadClient('basic', 'love_relationships')).toBe(true);
      });

      it('should allow basic user to access career reading', () => {
        expect(canAccessSpreadClient('basic', 'career_money')).toBe(true);
      });

      it('should allow basic user to access yes/no reading', () => {
        expect(canAccessSpreadClient('basic', 'yes_no')).toBe(true);
      });

      it('should NOT allow basic user to access pro spreads', () => {
        expect(canAccessSpreadClient('basic', 'celtic_cross')).toBe(false);
        expect(canAccessSpreadClient('basic', 'decision_making')).toBe(false);
      });
    });

    describe('Pro tier access', () => {
      it('should allow pro user to access all basic spreads', () => {
        expect(canAccessSpreadClient('pro', 'daily')).toBe(true);
        expect(canAccessSpreadClient('pro', 'three_card')).toBe(true);
        expect(canAccessSpreadClient('pro', 'love_relationships')).toBe(true);
        expect(canAccessSpreadClient('pro', 'career_money')).toBe(true);
        expect(canAccessSpreadClient('pro', 'yes_no')).toBe(true);
      });

      it('should allow pro user to access pro spreads', () => {
        expect(canAccessSpreadClient('pro', 'celtic_cross')).toBe(true);
        expect(canAccessSpreadClient('pro', 'decision_making')).toBe(true);
        expect(canAccessSpreadClient('pro', 'self_discovery')).toBe(true);
        expect(canAccessSpreadClient('pro', 'relationship_deep_dive')).toBe(true);
      });

      it('should NOT allow pro user to access VIP spreads', () => {
        expect(canAccessSpreadClient('pro', 'shadow_work')).toBe(false);
        expect(canAccessSpreadClient('pro', 'past_life')).toBe(false);
      });
    });

    describe('VIP tier access', () => {
      it('should allow VIP user to access ALL spreads', () => {
        const allSpreads = Object.keys(SPREAD_ACCESS_MATRIX) as SpreadType[];
        allSpreads.forEach(spread => {
          expect(canAccessSpreadClient('vip', spread)).toBe(true);
        });
      });
    });

    describe('Invalid spread types', () => {
      it('should return false for unknown spread type', () => {
        expect(canAccessSpreadClient('vip', 'invalid_spread' as SpreadType)).toBe(false);
      });
    });
  });

  describe('getMinimumTier', () => {
    it('should return free for daily reading', () => {
      expect(getMinimumTier('daily')).toBe('free');
    });

    it('should return free for three_card reading', () => {
      expect(getMinimumTier('three_card')).toBe('free');
    });

    it('should return basic for love reading', () => {
      expect(getMinimumTier('love_relationships')).toBe('basic');
    });

    it('should return basic for career reading', () => {
      expect(getMinimumTier('career_money')).toBe('basic');
    });

    it('should return basic for yes/no reading', () => {
      expect(getMinimumTier('yes_no')).toBe('basic');
    });

    it('should return pro for celtic cross', () => {
      expect(getMinimumTier('celtic_cross')).toBe('pro');
    });

    it('should return pro for decision making', () => {
      expect(getMinimumTier('decision_making')).toBe('pro');
    });

    it('should return pro for self discovery', () => {
      expect(getMinimumTier('self_discovery')).toBe('pro');
    });

    it('should return pro for relationship deep dive', () => {
      expect(getMinimumTier('relationship_deep_dive')).toBe('pro');
    });

    it('should return vip for shadow work', () => {
      expect(getMinimumTier('shadow_work')).toBe('vip');
    });
  });

  describe('SPREAD_ACCESS_MATRIX', () => {
    it('should have 18 total spreads defined', () => {
      expect(Object.keys(SPREAD_ACCESS_MATRIX).length).toBe(18);
    });

    it('should have correct free tier spreads (2)', () => {
      const freeSpreads = Object.entries(SPREAD_ACCESS_MATRIX)
        .filter(([, tiers]) => tiers.includes('free'))
        .map(([spread]) => spread);
      expect(freeSpreads.length).toBe(2);
      expect(freeSpreads).toContain('daily');
      expect(freeSpreads).toContain('three_card');
    });

    it('should have correct basic tier spreads (5)', () => {
      const basicSpreads = Object.entries(SPREAD_ACCESS_MATRIX)
        .filter(([, tiers]) => tiers.includes('basic'))
        .map(([spread]) => spread);
      expect(basicSpreads.length).toBe(5);
    });

    it('should have correct pro tier spreads (10)', () => {
      const proSpreads = Object.entries(SPREAD_ACCESS_MATRIX)
        .filter(([, tiers]) => tiers.includes('pro'))
        .map(([spread]) => spread);
      expect(proSpreads.length).toBe(10);
    });

    it('should have correct VIP tier spreads (18 - all)', () => {
      const vipSpreads = Object.entries(SPREAD_ACCESS_MATRIX)
        .filter(([, tiers]) => tiers.includes('vip'))
        .map(([spread]) => spread);
      expect(vipSpreads.length).toBe(18);
    });
  });

  describe('SPREAD_INFO', () => {
    it('should have all required fields for each spread', () => {
      Object.values(SPREAD_INFO).forEach((spread) => {
        expect(spread.id).toBeDefined();
        expect(spread.name).toBeDefined();
        expect(spread.nameTh).toBeDefined();
        expect(spread.description).toBeDefined();
        expect(spread.descriptionTh).toBeDefined();
        expect(spread.minimumTier).toBeDefined();
        expect(spread.icon).toBeDefined();
        expect(spread.cardCount).toBeGreaterThan(0);
        expect(spread.estimatedTime).toBeDefined();
        expect(spread.route).toBeDefined();
        expect(typeof spread.isAvailable).toBe('boolean');
      });
    });

    it('should have 18 total spreads defined', () => {
      expect(Object.keys(SPREAD_INFO).length).toBe(18);
    });

    it('should have correct routes for free spreads', () => {
      expect(SPREAD_INFO.daily.route).toBe('/reading/daily');
      expect(SPREAD_INFO.three_card.route).toBe('/reading/three-card');
    });

    it('should have correct routes for basic spreads', () => {
      expect(SPREAD_INFO.love_relationships.route).toBe('/reading/love');
      expect(SPREAD_INFO.career_money.route).toBe('/reading/career');
      expect(SPREAD_INFO.yes_no.route).toBe('/reading/yes-no');
    });

    it('should have correct routes for pro spreads', () => {
      expect(SPREAD_INFO.celtic_cross.route).toBe('/reading/celtic-cross');
      expect(SPREAD_INFO.decision_making.route).toBe('/reading/decision');
      expect(SPREAD_INFO.self_discovery.route).toBe('/reading/self-discovery');
      expect(SPREAD_INFO.relationship_deep_dive.route).toBe('/reading/relationship-deep-dive');
    });
  });

  describe('TIER_LEVELS', () => {
    it('should have correct hierarchy', () => {
      expect(TIER_LEVELS.free).toBe(0);
      expect(TIER_LEVELS.basic).toBe(1);
      expect(TIER_LEVELS.pro).toBe(2);
      expect(TIER_LEVELS.vip).toBe(3);
    });

    it('should satisfy tier hierarchy: free < basic < pro < vip', () => {
      expect(TIER_LEVELS.free).toBeLessThan(TIER_LEVELS.basic);
      expect(TIER_LEVELS.basic).toBeLessThan(TIER_LEVELS.pro);
      expect(TIER_LEVELS.pro).toBeLessThan(TIER_LEVELS.vip);
    });
  });

  describe('Legacy Helpers', () => {
    describe('getUpgradeBenefits', () => {
      it('should return benefits for guest', () => {
        const benefits = getUpgradeBenefits('guest');
        expect(benefits.length).toBeGreaterThan(0);
        expect(benefits.some((b) => b.includes('ปลดล็อค'))).toBe(true);
      });

      it('should return premium benefits for free user', () => {
        const benefits = getUpgradeBenefits('free');
        expect(benefits.length).toBeGreaterThan(0);
        expect(benefits.some((b) => b.includes('Celtic Cross'))).toBe(true);
      });

      it('should return empty array for premium user', () => {
        const benefits = getUpgradeBenefits('premium');
        expect(benefits.length).toBe(0);
      });
    });

    describe('getUpgradeMessage', () => {
      it('should return signup message for guest trying to access basic tier spread', () => {
        const message = getUpgradeMessage('guest', 'love_relationships');
        expect(message).toContain('สมัครสมาชิกฟรี');
      });

      it('should return premium upgrade message for guest trying to access pro spread', () => {
        const message = getUpgradeMessage('guest', 'celtic_cross');
        expect(message).toContain('Premium');
      });

      it('should return premium upgrade message for free user trying to access pro spread', () => {
        const message = getUpgradeMessage('free', 'celtic_cross');
        expect(message).toContain('Premium');
      });

      it('should return empty string for free user accessing free spread', () => {
        const message = getUpgradeMessage('free', 'daily');
        expect(message).toBe('');
      });
    });
  });
});

describe('Premium Spread Access Matrix (Story 7.9)', () => {
  describe('Scenario 1: Premium Spread Access for Each Tier', () => {
    const premiumSpreads: SpreadType[] = [
      'celtic_cross',
      'decision_making',
      'self_discovery',
      'relationship_deep_dive',
    ];

    it('should NOT allow FREE tier access to any premium spread', () => {
      premiumSpreads.forEach(spread => {
        expect(canAccessSpreadClient('free', spread)).toBe(false);
      });
    });

    it('should NOT allow BASIC tier access to any premium spread', () => {
      premiumSpreads.forEach(spread => {
        expect(canAccessSpreadClient('basic', spread)).toBe(false);
      });
    });

    it('should allow PRO tier access to all 4 premium spreads', () => {
      premiumSpreads.forEach(spread => {
        expect(canAccessSpreadClient('pro', spread)).toBe(true);
      });
    });

    it('should allow VIP tier access to all 4 premium spreads', () => {
      premiumSpreads.forEach(spread => {
        expect(canAccessSpreadClient('vip', spread)).toBe(true);
      });
    });
  });

  describe('Premium Gates Display Correctly', () => {
    it('should return correct minimum tier for each premium spread', () => {
      expect(getMinimumTier('celtic_cross')).toBe('pro');
      expect(getMinimumTier('decision_making')).toBe('pro');
      expect(getMinimumTier('self_discovery')).toBe('pro');
      expect(getMinimumTier('relationship_deep_dive')).toBe('pro');
    });
  });

  describe('No Bypass Possible', () => {
    it('should not have any tier gaps in access matrix', () => {
      Object.entries(SPREAD_ACCESS_MATRIX).forEach(([spread, tiers]) => {
        // If VIP has access, all lower tiers in the list should be consecutive
        const tierOrder: SubscriptionTier[] = ['free', 'basic', 'pro', 'vip'];
        const tierIndices = tiers.map(t => tierOrder.indexOf(t)).sort((a, b) => a - b);
        
        // Check for consecutive indices (no gaps)
        for (let i = 1; i < tierIndices.length; i++) {
          expect(tierIndices[i] - tierIndices[i - 1]).toBe(1);
        }
      });
    });

    it('should ensure higher tiers always have access to lower tier spreads', () => {
      const tierHierarchy: SubscriptionTier[] = ['free', 'basic', 'pro', 'vip'];
      
      Object.entries(SPREAD_ACCESS_MATRIX).forEach(([spread, tiers]) => {
        const minTierIndex = Math.min(...tiers.map(t => tierHierarchy.indexOf(t)));
        
        // All tiers >= minTier should have access
        for (let i = minTierIndex; i < tierHierarchy.length; i++) {
          expect(tiers).toContain(tierHierarchy[i]);
        }
      });
    });
  });
});
