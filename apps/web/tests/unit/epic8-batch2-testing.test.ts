/**
 * Epic 8 Batch 2 Testing - Story 8.4
 * Comprehensive testing for all Epic 8 spreads
 *
 * Story: 8.4 - Phase 4 Batch 2 Testing & QA
 * QA Engineer: Quinn (Test Architect)
 * Date: 2026-01-17
 *
 * Tests:
 * - TC-8.4-001 to TC-8.4-004: VIP Access Control
 * - TC-8.4-010 to TC-8.4-013: Regression Testing
 * - TC-8.4-020 to TC-8.4-022: Integration Testing
 */

import { describe, it, expect } from 'vitest';
import {
  canAccessSpreadClient,
  getMinimumTier,
  SPREAD_ACCESS_MATRIX,
  SPREAD_INFO,
  type SpreadType,
} from '../../src/lib/access-control/spread-info';
import {
  drawShadowWorkSpread,
  drawChakraAlignmentSpread,
  drawFriendshipSpread,
  drawCareerPathSpread,
  drawFinancialAbundanceSpread,
  createMockDeck,
  createReadingSession,
} from '../../src/lib/tarot/shuffle';

// ============================================================================
// SCENARIO 1: VIP ACCESS CONTROL FOR ALL EPIC 8 SPREADS (P0)
// ============================================================================

describe('Story 8.4: VIP Access Control for Epic 8 Spreads', () => {
  // All VIP-only spreads from Epic 8
  const vipOnlySpreads: SpreadType[] = [
    'shadow_work',
    'friendship',
    'career_path',
    'financial_abundance',
  ];

  // Pro+VIP spreads (Chakra is Pro tier)
  const proSpreads: SpreadType[] = ['chakra_alignment'];

  describe('TC-8.4-001: VIP gating for all Epic 8 spreads', () => {
    it('should mark shadow_work as VIP-only', () => {
      expect(SPREAD_ACCESS_MATRIX.shadow_work).toEqual(['vip']);
      expect(getMinimumTier('shadow_work')).toBe('vip');
    });

    it('should mark friendship as VIP-only', () => {
      expect(SPREAD_ACCESS_MATRIX.friendship).toEqual(['vip']);
      expect(getMinimumTier('friendship')).toBe('vip');
    });

    it('should mark career_path as VIP-only', () => {
      expect(SPREAD_ACCESS_MATRIX.career_path).toEqual(['vip']);
      expect(getMinimumTier('career_path')).toBe('vip');
    });

    it('should mark financial_abundance as VIP-only', () => {
      expect(SPREAD_ACCESS_MATRIX.financial_abundance).toEqual(['vip']);
      expect(getMinimumTier('financial_abundance')).toBe('vip');
    });

    it('should mark chakra_alignment as Pro tier', () => {
      expect(SPREAD_ACCESS_MATRIX.chakra_alignment).toEqual(['pro', 'vip']);
      expect(getMinimumTier('chakra_alignment')).toBe('pro');
    });
  });

  describe('TC-8.4-002: Pro users cannot access VIP spreads', () => {
    vipOnlySpreads.forEach((spread) => {
      it(`should NOT allow Pro user to access ${spread}`, () => {
        expect(canAccessSpreadClient('pro', spread)).toBe(false);
      });
    });

    it('should allow Pro user to access chakra_alignment', () => {
      expect(canAccessSpreadClient('pro', 'chakra_alignment')).toBe(true);
    });
  });

  describe('TC-8.4-003: VIP users can access all Epic 8 spreads', () => {
    const allEpic8Spreads = [...vipOnlySpreads, ...proSpreads];

    allEpic8Spreads.forEach((spread) => {
      it(`should allow VIP user to access ${spread}`, () => {
        expect(canAccessSpreadClient('vip', spread)).toBe(true);
      });
    });
  });

  describe('TC-8.4-004: Upgrade flow - Pro cannot access VIP features', () => {
    it('should have clear tier boundary between Pro and VIP', () => {
      // Pro user cannot access any VIP-only spread
      vipOnlySpreads.forEach((spread) => {
        expect(canAccessSpreadClient('pro', spread)).toBe(false);
      });

      // But can access Pro-tier spreads
      expect(canAccessSpreadClient('pro', 'chakra_alignment')).toBe(true);
      expect(canAccessSpreadClient('pro', 'celtic_cross')).toBe(true);
    });

    it('should have SPREAD_INFO with correct minimumTier for VIP spreads', () => {
      vipOnlySpreads.forEach((spread) => {
        expect(SPREAD_INFO[spread].minimumTier).toBe('vip');
      });
    });
  });
});

// ============================================================================
// SCENARIO 2: FUNCTIONAL TESTING FOR EACH SPREAD (P0)
// ============================================================================

describe('Story 8.4: Functional Testing - All 5 Epic 8 Spreads', () => {
  const mockDeck = createMockDeck();

  describe('Shadow Work Spread (7 cards)', () => {
    it('should draw exactly 7 cards', () => {
      const cards = drawShadowWorkSpread(mockDeck);
      expect(cards).toHaveLength(7);
    });

    it('should have correct position labels', () => {
      const cards = drawShadowWorkSpread(mockDeck);
      const expectedPositions = [
        'sw_conscious_self',
        'sw_shadow',
        'sw_fear',
        'sw_denied_strength',
        'sw_integration',
        'sw_healing',
        'sw_wholeness',
      ];
      const positions = cards.map((c) => c.position);
      expect(positions).toEqual(expectedPositions);
    });

    it('should create reading session with correct type', () => {
      const session = createReadingSession('shadow-work', mockDeck);
      expect(session.type).toBe('shadow-work');
      expect(session.drawnCards).toHaveLength(7);
    });
  });

  describe('Chakra Alignment Spread (7 cards)', () => {
    it('should draw exactly 7 cards', () => {
      const cards = drawChakraAlignmentSpread(mockDeck);
      expect(cards).toHaveLength(7);
    });

    it('should have correct chakra position labels', () => {
      const cards = drawChakraAlignmentSpread(mockDeck);
      const expectedPositions = [
        'ca_root',
        'ca_sacral',
        'ca_solar_plexus',
        'ca_heart',
        'ca_throat',
        'ca_third_eye',
        'ca_crown',
      ];
      const positions = cards.map((c) => c.position);
      expect(positions).toEqual(expectedPositions);
    });

    it('should create reading session with correct type', () => {
      const session = createReadingSession('chakra', mockDeck);
      expect(session.type).toBe('chakra');
      expect(session.drawnCards).toHaveLength(7);
    });
  });

  describe('Friendship Spread (4 cards)', () => {
    it('should draw exactly 4 cards', () => {
      const cards = drawFriendshipSpread(mockDeck);
      expect(cards).toHaveLength(4);
    });

    it('should have correct friendship position labels', () => {
      const cards = drawFriendshipSpread(mockDeck);
      const expectedPositions = [
        'fr_foundation',
        'fr_challenges',
        'fr_strength',
        'fr_future',
      ];
      const positions = cards.map((c) => c.position);
      expect(positions).toEqual(expectedPositions);
    });

    it('should create reading session with correct type', () => {
      const session = createReadingSession('friendship', mockDeck);
      expect(session.type).toBe('friendship');
      expect(session.drawnCards).toHaveLength(4);
    });
  });

  describe('Career Path Spread (6 cards)', () => {
    it('should draw exactly 6 cards', () => {
      const cards = drawCareerPathSpread(mockDeck);
      expect(cards).toHaveLength(6);
    });

    it('should have correct career path position labels', () => {
      const cards = drawCareerPathSpread(mockDeck);
      const expectedPositions = [
        'cp_current',
        'cp_skills',
        'cp_obstacles',
        'cp_opportunities',
        'cp_guidance',
        'cp_outcome',
      ];
      const positions = cards.map((c) => c.position);
      expect(positions).toEqual(expectedPositions);
    });

    it('should create reading session with correct type', () => {
      const session = createReadingSession('career-path', mockDeck);
      expect(session.type).toBe('career-path');
      expect(session.drawnCards).toHaveLength(6);
    });
  });

  describe('Financial Abundance Spread (5 cards)', () => {
    it('should draw exactly 5 cards', () => {
      const cards = drawFinancialAbundanceSpread(mockDeck);
      expect(cards).toHaveLength(5);
    });

    it('should have correct financial position labels', () => {
      const cards = drawFinancialAbundanceSpread(mockDeck);
      const expectedPositions = [
        'fa_current',
        'fa_blocks',
        'fa_opportunities',
        'fa_action',
        'fa_abundance',
      ];
      const positions = cards.map((c) => c.position);
      expect(positions).toEqual(expectedPositions);
    });

    it('should create reading session with correct type', () => {
      const session = createReadingSession('financial', mockDeck);
      expect(session.type).toBe('financial');
      expect(session.drawnCards).toHaveLength(5);
    });
  });

  describe('All spreads: No duplicate cards', () => {
    const spreadFunctions = [
      { name: 'Shadow Work', fn: drawShadowWorkSpread, count: 7 },
      { name: 'Chakra', fn: drawChakraAlignmentSpread, count: 7 },
      { name: 'Friendship', fn: drawFriendshipSpread, count: 4 },
      { name: 'Career Path', fn: drawCareerPathSpread, count: 6 },
      { name: 'Financial', fn: drawFinancialAbundanceSpread, count: 5 },
    ];

    spreadFunctions.forEach(({ name, fn, count }) => {
      it(`${name} should draw ${count} unique cards (no duplicates)`, () => {
        const cards = fn(mockDeck);
        const cardIds = cards.map((c) => c.card.id);
        const uniqueIds = [...new Set(cardIds)];
        expect(uniqueIds).toHaveLength(count);
      });
    });
  });

  describe('All spreads: Reversed card randomness', () => {
    it('should randomly assign reversed status across all Epic 8 spreads', () => {
      let hasReversed = false;
      let hasUpright = false;

      // Test across multiple runs to verify randomness
      for (let i = 0; i < 50; i++) {
        const cards = [
          ...drawShadowWorkSpread(mockDeck),
          ...drawChakraAlignmentSpread(mockDeck),
          ...drawFriendshipSpread(mockDeck),
          ...drawCareerPathSpread(mockDeck),
          ...drawFinancialAbundanceSpread(mockDeck),
        ];

        cards.forEach((card) => {
          if (card.isReversed) hasReversed = true;
          else hasUpright = true;
        });

        if (hasReversed && hasUpright) break;
      }

      expect(hasReversed).toBe(true);
      expect(hasUpright).toBe(true);
    });
  });
});

// ============================================================================
// SCENARIO 3: REGRESSION TESTING (P0)
// ============================================================================

describe('Story 8.4: Regression Testing', () => {
  describe('TC-8.4-010: Epic 7 spreads still work', () => {
    const epic7Spreads: SpreadType[] = [
      'celtic_cross',
      'decision_making',
      'self_discovery',
      'relationship_deep_dive',
    ];

    epic7Spreads.forEach((spread) => {
      it(`${spread} should still be accessible by Pro tier`, () => {
        expect(canAccessSpreadClient('pro', spread)).toBe(true);
      });

      it(`${spread} should still be accessible by VIP tier`, () => {
        expect(canAccessSpreadClient('vip', spread)).toBe(true);
      });

      it(`${spread} should have correct SPREAD_INFO`, () => {
        expect(SPREAD_INFO[spread]).toBeDefined();
        expect(SPREAD_INFO[spread].isAvailable).toBe(true);
      });
    });
  });

  describe('TC-8.4-011: Epic 6 payment features validation', () => {
    it('should have tier hierarchy intact: free < basic < pro < vip', () => {
      const tiers = ['free', 'basic', 'pro', 'vip'] as const;
      const spreadsByTier = {
        free: ['daily', 'three_card'],
        basic: ['love_relationships', 'career_money', 'yes_no'],
        pro: ['celtic_cross', 'decision_making', 'chakra_alignment'],
        vip: ['shadow_work', 'friendship', 'career_path', 'financial_abundance'],
      };

      // Verify higher tiers can access lower tier spreads
      Object.entries(spreadsByTier).forEach(([tier, spreads]) => {
        const tierIndex = tiers.indexOf(tier as typeof tiers[number]);
        spreads.forEach((spread) => {
          // All tiers at or above this tier should have access
          for (let i = tierIndex; i < tiers.length; i++) {
            expect(canAccessSpreadClient(tiers[i], spread as SpreadType)).toBe(true);
          }
        });
      });
    });
  });

  describe('TC-8.4-012: Epic 1-5 features still work', () => {
    it('should have all free tier spreads available', () => {
      const freeSpreads: SpreadType[] = ['daily', 'three_card'];
      freeSpreads.forEach((spread) => {
        expect(SPREAD_INFO[spread].isAvailable).toBe(true);
        expect(canAccessSpreadClient('free', spread)).toBe(true);
      });
    });

    it('should have all basic tier spreads available', () => {
      const basicSpreads: SpreadType[] = ['love_relationships', 'career_money', 'yes_no'];
      basicSpreads.forEach((spread) => {
        expect(SPREAD_INFO[spread].isAvailable).toBe(true);
        expect(canAccessSpreadClient('basic', spread)).toBe(true);
      });
    });
  });

  describe('TC-8.4-013: Performance - SPREAD_INFO lookup', () => {
    it('should have O(1) access time for spread info lookup', () => {
      const start = performance.now();
      for (let i = 0; i < 10000; i++) {
        const _ = SPREAD_INFO.shadow_work;
        const __ = SPREAD_INFO.chakra_alignment;
        const ___ = SPREAD_INFO.friendship;
      }
      const end = performance.now();
      // Should complete 30000 lookups in under 50ms
      expect(end - start).toBeLessThan(50);
    });
  });

  describe('TC-8.4-014: Performance - Draw functions', () => {
    const mockDeck = createMockDeck();

    it('should draw Shadow Work spread (7 cards) quickly', () => {
      const start = performance.now();
      for (let i = 0; i < 1000; i++) {
        drawShadowWorkSpread(mockDeck);
      }
      const end = performance.now();
      // 1000 draws should complete in under 300ms
      expect(end - start).toBeLessThan(300);
    });

    it('should draw Chakra Alignment spread (7 cards) quickly', () => {
      const start = performance.now();
      for (let i = 0; i < 1000; i++) {
        drawChakraAlignmentSpread(mockDeck);
      }
      const end = performance.now();
      // 1000 draws should complete in under 300ms
      expect(end - start).toBeLessThan(300);
    });

    it('should draw Friendship spread (4 cards) quickly', () => {
      const start = performance.now();
      for (let i = 0; i < 1000; i++) {
        drawFriendshipSpread(mockDeck);
      }
      const end = performance.now();
      // Should complete 1000 draws in under 300ms
      expect(end - start).toBeLessThan(300);
    });

    it('should draw Career Path spread (6 cards) quickly', () => {
      const start = performance.now();
      for (let i = 0; i < 1000; i++) {
        drawCareerPathSpread(mockDeck);
      }
      const end = performance.now();
      // Should complete 1000 draws in under 300ms
      expect(end - start).toBeLessThan(300);
    });

    it('should draw Financial Abundance spread (5 cards) quickly', () => {
      const start = performance.now();
      for (let i = 0; i < 1000; i++) {
        drawFinancialAbundanceSpread(mockDeck);
      }
      const end = performance.now();
      // Should complete 1000 draws in under 300ms
      expect(end - start).toBeLessThan(300);
    });

    it('should create reading session quickly', () => {
      const start = performance.now();
      for (let i = 0; i < 500; i++) {
        createReadingSession('shadow-work', mockDeck);
        createReadingSession('chakra', mockDeck);
        createReadingSession('friendship', mockDeck);
        createReadingSession('career-path', mockDeck);
        createReadingSession('financial', mockDeck);
      }
      const end = performance.now();
      // 2500 session creations should complete in under 500ms
      expect(end - start).toBeLessThan(500);
    });
  });
});

// ============================================================================
// SCENARIO 4: INTEGRATION TESTING (P0)
// ============================================================================

describe('Story 8.4: Integration Testing', () => {
  describe('TC-8.4-020: VIP subscription grants access to ALL premium spreads', () => {
    it('VIP should access all spreads in the system', () => {
      const allSpreads = Object.keys(SPREAD_ACCESS_MATRIX) as SpreadType[];
      allSpreads.forEach((spread) => {
        expect(canAccessSpreadClient('vip', spread)).toBe(true);
      });
    });
  });

  describe('TC-8.4-021: Reading history shows all spread types', () => {
    it('should have 21 total spread types defined', () => {
      const totalSpreads = Object.keys(SPREAD_ACCESS_MATRIX).length;
      expect(totalSpreads).toBe(21);
    });

    it('should have SPREAD_INFO for all spread types', () => {
      const allSpreads = Object.keys(SPREAD_ACCESS_MATRIX) as SpreadType[];
      allSpreads.forEach((spread) => {
        expect(SPREAD_INFO[spread]).toBeDefined();
        expect(SPREAD_INFO[spread].id).toBe(spread);
        expect(SPREAD_INFO[spread].name).toBeTruthy();
        expect(SPREAD_INFO[spread].nameTh).toBeTruthy();
        expect(SPREAD_INFO[spread].route).toBeTruthy();
      });
    });
  });

  describe('TC-8.4-022: Navigation between spreads', () => {
    it('Epic 8 spreads should have correct routes', () => {
      expect(SPREAD_INFO.shadow_work.route).toBe('/reading/shadow-work');
      expect(SPREAD_INFO.chakra_alignment.route).toBe('/reading/chakra');
      expect(SPREAD_INFO.friendship.route).toBe('/reading/friendship');
      expect(SPREAD_INFO.career_path.route).toBe('/reading/career-path');
      expect(SPREAD_INFO.financial_abundance.route).toBe('/reading/financial');
    });

    it('all spread routes should start with /reading/', () => {
      const allSpreads = Object.keys(SPREAD_INFO) as SpreadType[];
      allSpreads.forEach((spread) => {
        expect(SPREAD_INFO[spread].route).toMatch(/^\/reading\//);
      });
    });
  });
});

// ============================================================================
// SCENARIO 5: CONTENT QUALITY (Manual QA Checklist)
// ============================================================================

describe('Story 8.4: Content Quality Validation', () => {
  describe('Epic 8 Spread Content Completeness', () => {
    const epic8Spreads: SpreadType[] = [
      'shadow_work',
      'chakra_alignment',
      'friendship',
      'career_path',
      'financial_abundance',
    ];

    epic8Spreads.forEach((spread) => {
      it(`${spread} should have complete SPREAD_INFO`, () => {
        const info = SPREAD_INFO[spread];
        expect(info.name).toBeTruthy();
        expect(info.nameTh).toBeTruthy();
        expect(info.description).toBeTruthy();
        expect(info.descriptionTh).toBeTruthy();
        expect(info.icon).toBeTruthy();
        expect(info.cardCount).toBeGreaterThan(0);
        expect(info.estimatedTime).toBeTruthy();
        expect(info.minimumTier).toBeTruthy();
        expect(info.route).toBeTruthy();
      });
    });
  });

  describe('Card count validation', () => {
    it('Shadow Work should use 7 cards', () => {
      expect(SPREAD_INFO.shadow_work.cardCount).toBe(7);
    });

    it('Chakra Alignment should use 7 cards', () => {
      expect(SPREAD_INFO.chakra_alignment.cardCount).toBe(7);
    });

    it('Friendship should use 4 cards', () => {
      expect(SPREAD_INFO.friendship.cardCount).toBe(4);
    });

    it('Career Path should use 6 cards', () => {
      expect(SPREAD_INFO.career_path.cardCount).toBe(6);
    });

    it('Financial Abundance should use 5 cards', () => {
      expect(SPREAD_INFO.financial_abundance.cardCount).toBe(5);
    });
  });

  describe('isAvailable flag for Epic 8 spreads', () => {
    it('all 5 Epic 8 spreads should be marked as available', () => {
      expect(SPREAD_INFO.shadow_work.isAvailable).toBe(true);
      expect(SPREAD_INFO.chakra_alignment.isAvailable).toBe(true);
      expect(SPREAD_INFO.friendship.isAvailable).toBe(true);
      expect(SPREAD_INFO.career_path.isAvailable).toBe(true);
      expect(SPREAD_INFO.financial_abundance.isAvailable).toBe(true);
    });
  });
});
