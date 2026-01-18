/**
 * Unit Tests: Story 9.6 - Phase 4 Complete Testing & Final QA
 *
 * Comprehensive unit tests for final platform validation:
 * - Subscription tier configuration
 * - Spread access control
 * - Advanced features (AI, PDF, Patterns)
 * - Data integrity checks
 */

import { describe, it, expect, beforeAll } from 'vitest';

// Import configurations under test
import { SUBSCRIPTION_TIERS, canAccessSpread, getTierPrice, compareTiers } from '@/lib/subscription/tiers';
import { SPREAD_INFO, SPREAD_ACCESS_MATRIX, canAccessSpreadClient, getMinimumTier, type SpreadType } from '@/lib/access-control/spread-info';

// ============================================================================
// SECTION 1: SUBSCRIPTION TIER CONFIGURATION (Task 2)
// ============================================================================

describe('Story 9.6 - Subscription Tier Configuration', () => {
  describe('Tier Definitions', () => {
    it('TC-9.6-U001: should have exactly 4 subscription tiers', () => {
      const tierCount = Object.keys(SUBSCRIPTION_TIERS).length;
      expect(tierCount).toBe(4);
    });

    it('TC-9.6-U002: should have correct tier IDs', () => {
      expect(SUBSCRIPTION_TIERS.free).toBeDefined();
      expect(SUBSCRIPTION_TIERS.basic).toBeDefined();
      expect(SUBSCRIPTION_TIERS.pro).toBeDefined();
      expect(SUBSCRIPTION_TIERS.vip).toBeDefined();
    });

    it('TC-9.6-U003: FREE tier should have correct configuration', () => {
      const free = SUBSCRIPTION_TIERS.free;
      expect(free.id).toBe('free');
      expect(free.price).toBe(0);
      expect(free.spreadAccess).toContain('daily');
      expect(free.spreadAccess).toContain('three_card');
      expect(free.spreadAccess.length).toBe(2);
    });

    it('TC-9.6-U004: BASIC tier should have correct configuration', () => {
      const basic = SUBSCRIPTION_TIERS.basic;
      expect(basic.id).toBe('basic');
      expect(basic.price).toBe(99);
      expect(basic.spreadAccess).toContain('daily');
      expect(basic.spreadAccess).toContain('three_card');
      expect(basic.spreadAccess).toContain('love_relationships');
      expect(basic.spreadAccess).toContain('career_money');
      expect(basic.spreadAccess).toContain('yes_no');
      expect(basic.spreadAccess.length).toBe(5);
    });

    it('TC-9.6-U005: PRO tier should have correct configuration', () => {
      const pro = SUBSCRIPTION_TIERS.pro;
      expect(pro.id).toBe('pro');
      expect(pro.price).toBe(199);
      expect(pro.spreadAccess).toContain('celtic_cross');
      expect(pro.spreadAccess).toContain('decision_making');
      expect(pro.spreadAccess).toContain('self_discovery');
      expect(pro.spreadAccess).toContain('relationship_deep');
      expect(pro.spreadAccess).toContain('chakra');
      expect(pro.spreadAccess.length).toBe(10);
    });

    it('TC-9.6-U006: VIP tier should have access to all spreads', () => {
      const vip = SUBSCRIPTION_TIERS.vip;
      expect(vip.id).toBe('vip');
      expect(vip.price).toBe(399);
      expect(vip.spreadAccess).toContain('*'); // VIP has wildcard access
    });
  });

  describe('Tier Pricing', () => {
    it('TC-9.6-U010: should return correct prices in THB', () => {
      expect(getTierPrice('free')).toBe(0);
      expect(getTierPrice('basic')).toBe(99);
      expect(getTierPrice('pro')).toBe(199);
      expect(getTierPrice('vip')).toBe(399);
    });

    it('TC-9.6-U011: prices should be in ascending order', () => {
      const freePrice = getTierPrice('free');
      const basicPrice = getTierPrice('basic');
      const proPrice = getTierPrice('pro');
      const vipPrice = getTierPrice('vip');

      expect(freePrice).toBeLessThan(basicPrice);
      expect(basicPrice).toBeLessThan(proPrice);
      expect(proPrice).toBeLessThan(vipPrice);
    });
  });

  describe('Tier Comparison', () => {
    it('TC-9.6-U020: should correctly compare tiers', () => {
      expect(compareTiers('vip', 'free')).toBeGreaterThan(0);
      expect(compareTiers('pro', 'basic')).toBeGreaterThan(0);
      expect(compareTiers('basic', 'free')).toBeGreaterThan(0);
      expect(compareTiers('free', 'vip')).toBeLessThan(0);
      expect(compareTiers('pro', 'pro')).toBe(0);
    });
  });
});

// ============================================================================
// SECTION 2: SPREAD ACCESS CONTROL (Task 2)
// ============================================================================

describe('Story 9.6 - Spread Access Control', () => {
  describe('Spread Count Validation', () => {
    it('TC-9.6-U100: should have exactly 24 spread types defined', () => {
      const spreadCount = Object.keys(SPREAD_INFO).length;
      expect(spreadCount).toBe(24);
    });

    it('TC-9.6-U101: should have 18 available spreads', () => {
      const availableSpreads = Object.values(SPREAD_INFO).filter((s) => s.isAvailable);
      expect(availableSpreads.length).toBe(18);
    });

    it('TC-9.6-U102: should have correct spreads per tier', () => {
      // Count spreads by minimum tier
      const freeSpreads = Object.values(SPREAD_INFO).filter(
        (s) => s.isAvailable && s.minimumTier === 'free'
      );
      const basicSpreads = Object.values(SPREAD_INFO).filter(
        (s) => s.isAvailable && s.minimumTier === 'basic'
      );
      const proSpreads = Object.values(SPREAD_INFO).filter(
        (s) => s.isAvailable && s.minimumTier === 'pro'
      );
      const vipSpreads = Object.values(SPREAD_INFO).filter(
        (s) => s.isAvailable && s.minimumTier === 'vip'
      );

      expect(freeSpreads.length).toBe(2); // daily, three_card
      expect(basicSpreads.length).toBe(3); // love, career, yes_no
      expect(proSpreads.length).toBe(5); // celtic, decision, self, relationship, chakra
      expect(vipSpreads.length).toBe(8); // shadow, friendship, career_path, financial, elemental, monthly, year, zodiac
    });
  });

  describe('Access Matrix Validation', () => {
    it('TC-9.6-U110: FREE spreads accessible by all tiers', () => {
      expect(canAccessSpreadClient('free', 'daily')).toBe(true);
      expect(canAccessSpreadClient('basic', 'daily')).toBe(true);
      expect(canAccessSpreadClient('pro', 'daily')).toBe(true);
      expect(canAccessSpreadClient('vip', 'daily')).toBe(true);
    });

    it('TC-9.6-U111: BASIC spreads not accessible by FREE tier', () => {
      expect(canAccessSpreadClient('free', 'love_relationships')).toBe(false);
      expect(canAccessSpreadClient('free', 'career_money')).toBe(false);
      expect(canAccessSpreadClient('free', 'yes_no')).toBe(false);
    });

    it('TC-9.6-U112: PRO spreads not accessible by BASIC tier', () => {
      expect(canAccessSpreadClient('basic', 'celtic_cross')).toBe(false);
      expect(canAccessSpreadClient('basic', 'decision_making')).toBe(false);
      expect(canAccessSpreadClient('basic', 'self_discovery')).toBe(false);
    });

    it('TC-9.6-U113: VIP spreads not accessible by PRO tier', () => {
      expect(canAccessSpreadClient('pro', 'shadow_work')).toBe(false);
      expect(canAccessSpreadClient('pro', 'year_ahead')).toBe(false);
      expect(canAccessSpreadClient('pro', 'zodiac_wheel')).toBe(false);
    });

    it('TC-9.6-U114: VIP tier can access all spreads', () => {
      const allSpreads = Object.keys(SPREAD_INFO) as SpreadType[];
      for (const spread of allSpreads) {
        expect(canAccessSpreadClient('vip', spread)).toBe(true);
      }
    });
  });

  describe('Minimum Tier Validation', () => {
    it('TC-9.6-U120: should return correct minimum tier for each spread', () => {
      expect(getMinimumTier('daily')).toBe('free');
      expect(getMinimumTier('three_card')).toBe('free');
      expect(getMinimumTier('love_relationships')).toBe('basic');
      expect(getMinimumTier('career_money')).toBe('basic');
      expect(getMinimumTier('celtic_cross')).toBe('pro');
      expect(getMinimumTier('shadow_work')).toBe('vip');
      expect(getMinimumTier('year_ahead')).toBe('vip');
    });
  });
});

// ============================================================================
// SECTION 3: SPREAD INFORMATION VALIDATION (Task 1)
// ============================================================================

describe('Story 9.6 - Spread Information Validation', () => {
  describe('All 18 Available Spreads Have Complete Data', () => {
    const availableSpreads = Object.entries(SPREAD_INFO).filter(([, info]) => info.isAvailable);

    availableSpreads.forEach(([spreadId, info]) => {
      it(`TC-9.6-U200: ${spreadId} should have complete information`, () => {
        expect(info.id).toBe(spreadId);
        expect(info.name).toBeTruthy();
        expect(info.nameTh).toBeTruthy();
        expect(info.description).toBeTruthy();
        expect(info.descriptionTh).toBeTruthy();
        expect(info.icon).toBeTruthy();
        expect(info.cardCount).toBeGreaterThan(0);
        expect(info.estimatedTime).toBeTruthy();
        expect(info.minimumTier).toBeTruthy();
        expect(info.route).toBeTruthy();
        expect(info.route.startsWith('/reading/')).toBe(true);
      });
    });
  });

  describe('Card Count Validation', () => {
    it('TC-9.6-U210: Daily reading has 1 card', () => {
      expect(SPREAD_INFO.daily.cardCount).toBe(1);
    });

    it('TC-9.6-U211: Three-card spread has 3 cards', () => {
      expect(SPREAD_INFO.three_card.cardCount).toBe(3);
    });

    it('TC-9.6-U212: Celtic Cross has 10 cards', () => {
      expect(SPREAD_INFO.celtic_cross.cardCount).toBe(10);
    });

    it('TC-9.6-U213: Year Ahead has 13 cards (most complex)', () => {
      expect(SPREAD_INFO.year_ahead.cardCount).toBe(13);
    });

    it('TC-9.6-U214: Zodiac Wheel has 12 cards', () => {
      expect(SPREAD_INFO.zodiac_wheel.cardCount).toBe(12);
    });
  });

  describe('Route Validation', () => {
    it('TC-9.6-U220: All spreads have valid routes', () => {
      const availableSpreads = Object.values(SPREAD_INFO).filter((s) => s.isAvailable);

      for (const spread of availableSpreads) {
        expect(spread.route).toMatch(/^\/reading\/[a-z-]+$/);
      }
    });

    it('TC-9.6-U221: No duplicate routes', () => {
      const routes = Object.values(SPREAD_INFO)
        .filter((s) => s.isAvailable)
        .map((s) => s.route);
      const uniqueRoutes = new Set(routes);
      expect(uniqueRoutes.size).toBe(routes.length);
    });
  });
});

// ============================================================================
// SECTION 4: DATA INTEGRITY CHECKS
// ============================================================================

describe('Story 9.6 - Data Integrity Checks', () => {
  describe('Tier-Spread Consistency', () => {
    it('TC-9.6-U300: SPREAD_ACCESS_MATRIX matches SPREAD_INFO minimumTier', () => {
      const availableSpreads = Object.entries(SPREAD_INFO).filter(
        ([, info]) => info.isAvailable
      ) as [SpreadType, typeof SPREAD_INFO[SpreadType]][];

      for (const [spreadId, info] of availableSpreads) {
        const accessMatrix = SPREAD_ACCESS_MATRIX[spreadId];
        const minTier = getMinimumTier(spreadId);

        expect(minTier).toBe(info.minimumTier);
        expect(accessMatrix).toContain(info.minimumTier);
      }
    });
  });

  describe('Thai Language Support', () => {
    it('TC-9.6-U310: All tiers have Thai names', () => {
      for (const tier of Object.values(SUBSCRIPTION_TIERS)) {
        expect(tier.nameTh).toBeTruthy();
        expect(tier.nameTh.length).toBeGreaterThan(0);
      }
    });

    it('TC-9.6-U311: All spreads have Thai names and descriptions', () => {
      const availableSpreads = Object.values(SPREAD_INFO).filter((s) => s.isAvailable);

      for (const spread of availableSpreads) {
        expect(spread.nameTh).toBeTruthy();
        expect(spread.descriptionTh).toBeTruthy();
      }
    });
  });
});

// ============================================================================
// SECTION 5: REGRESSION TEST - EXISTING FUNCTIONALITY
// ============================================================================

describe('Story 9.6 - Regression Tests', () => {
  describe('canAccessSpread Function', () => {
    it('TC-9.6-U400: should handle valid tier/spread combinations', () => {
      expect(canAccessSpread('free', 'daily')).toBe(true);
      expect(canAccessSpread('vip', 'year_ahead')).toBe(true);
    });

    it('TC-9.6-U401: should handle invalid spread types gracefully', () => {
      // TypeScript would catch this, but runtime check
      expect(canAccessSpread('free', 'nonexistent' as SpreadType)).toBe(false);
    });
  });

  describe('Tier Feature Lists', () => {
    it('TC-9.6-U410: All tiers have feature lists', () => {
      for (const tier of Object.values(SUBSCRIPTION_TIERS)) {
        expect(tier.features).toBeDefined();
        expect(tier.featuresTh).toBeDefined();
        expect(tier.features.length).toBeGreaterThan(0);
        expect(tier.featuresTh.length).toBeGreaterThan(0);
      }
    });

    it('TC-9.6-U411: Feature lists have matching English/Thai count', () => {
      for (const tier of Object.values(SUBSCRIPTION_TIERS)) {
        expect(tier.features.length).toBe(tier.featuresTh.length);
      }
    });
  });
});

// ============================================================================
// SECTION 6: FINAL VALIDATION SUMMARY
// ============================================================================

describe('Story 9.6 - Final Validation Summary', () => {
  it('TC-9.6-U900: Platform configuration is complete', () => {
    // Tier validation
    expect(Object.keys(SUBSCRIPTION_TIERS).length).toBe(4);

    // Spread validation
    const availableSpreads = Object.values(SPREAD_INFO).filter((s) => s.isAvailable);
    expect(availableSpreads.length).toBe(18);

    // All available spreads have access matrix entries
    for (const spread of availableSpreads) {
      expect(SPREAD_ACCESS_MATRIX[spread.id]).toBeDefined();
    }
  });

  it('TC-9.6-U901: All tier progressions are valid', () => {
    // Free < Basic < Pro < VIP
    expect(compareTiers('basic', 'free')).toBeGreaterThan(0);
    expect(compareTiers('pro', 'basic')).toBeGreaterThan(0);
    expect(compareTiers('vip', 'pro')).toBeGreaterThan(0);
  });

  it('TC-9.6-U902: Spread access is properly tiered', () => {
    // Higher tiers can access everything lower tiers can
    const basicSpreads = SUBSCRIPTION_TIERS.basic.spreadAccess;
    const proSpreads = SUBSCRIPTION_TIERS.pro.spreadAccess;

    // Pro should include all basic spreads
    for (const spread of basicSpreads) {
      expect(proSpreads).toContain(spread);
    }

    // VIP has wildcard, so it can access everything
    expect(SUBSCRIPTION_TIERS.vip.spreadAccess).toContain('*');
  });
});
