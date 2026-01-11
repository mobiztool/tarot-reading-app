import { describe, it, expect } from 'vitest';
import {
  canAccessSpread,
  getRequiredTier,
  getAvailableSpreads,
  getLockedSpreads,
  getUpgradeMessage,
  getUpgradeBenefits,
  getSpreadRoute,
  getSpreadByRoute,
  isProtectedRoute,
  getProtectedRoutes,
  getUserTier,
  SPREAD_ACCESS_MATRIX,
  UserTier,
  SpreadType,
} from '../../src/lib/access-control';

describe('Access Control', () => {
  describe('canAccessSpread', () => {
    describe('Guest access', () => {
      it('should allow guest to access daily reading', () => {
        expect(canAccessSpread('guest', 'daily')).toBe(true);
      });

      it('should allow guest to access three-card reading', () => {
        expect(canAccessSpread('guest', 'three_card')).toBe(true);
      });

      it('should NOT allow guest to access love reading', () => {
        expect(canAccessSpread('guest', 'love_relationships')).toBe(false);
      });

      it('should NOT allow guest to access career reading', () => {
        expect(canAccessSpread('guest', 'career_money')).toBe(false);
      });

      it('should NOT allow guest to access yes/no reading', () => {
        expect(canAccessSpread('guest', 'yes_no')).toBe(false);
      });

      it('should NOT allow guest to access premium spreads', () => {
        expect(canAccessSpread('guest', 'celtic_cross')).toBe(false);
      });
    });

    describe('Free tier access', () => {
      it('should allow free user to access all guest spreads', () => {
        expect(canAccessSpread('free', 'daily')).toBe(true);
        expect(canAccessSpread('free', 'three_card')).toBe(true);
      });

      it('should allow free user to access love reading', () => {
        expect(canAccessSpread('free', 'love_relationships')).toBe(true);
      });

      it('should allow free user to access career reading', () => {
        expect(canAccessSpread('free', 'career_money')).toBe(true);
      });

      it('should allow free user to access yes/no reading', () => {
        expect(canAccessSpread('free', 'yes_no')).toBe(true);
      });

      it('should NOT allow free user to access premium spreads', () => {
        expect(canAccessSpread('free', 'celtic_cross')).toBe(false);
      });
    });

    describe('Premium tier access', () => {
      it('should allow premium user to access all spreads', () => {
        expect(canAccessSpread('premium', 'daily')).toBe(true);
        expect(canAccessSpread('premium', 'three_card')).toBe(true);
        expect(canAccessSpread('premium', 'love_relationships')).toBe(true);
        expect(canAccessSpread('premium', 'career_money')).toBe(true);
        expect(canAccessSpread('premium', 'yes_no')).toBe(true);
      });

      // Note: Premium spreads are not yet available, so they should return false
      it('should NOT access unavailable premium spreads', () => {
        expect(canAccessSpread('premium', 'celtic_cross')).toBe(false);
      });
    });
  });

  describe('getRequiredTier', () => {
    it('should return guest for daily reading', () => {
      expect(getRequiredTier('daily')).toBe('guest');
    });

    it('should return free for love reading', () => {
      expect(getRequiredTier('love_relationships')).toBe('free');
    });

    it('should return premium for celtic cross', () => {
      expect(getRequiredTier('celtic_cross')).toBe('premium');
    });
  });

  describe('getAvailableSpreads', () => {
    it('should return 2 spreads for guest', () => {
      const spreads = getAvailableSpreads('guest');
      expect(spreads.length).toBe(2);
      expect(spreads.map((s) => s.id)).toContain('daily');
      expect(spreads.map((s) => s.id)).toContain('three_card');
    });

    it('should return 5 spreads for free user', () => {
      const spreads = getAvailableSpreads('free');
      expect(spreads.length).toBe(5);
    });
  });

  describe('getLockedSpreads', () => {
    it('should return 3 locked spreads for guest', () => {
      const spreads = getLockedSpreads('guest');
      expect(spreads.length).toBe(3);
      expect(spreads.map((s) => s.id)).toContain('love_relationships');
      expect(spreads.map((s) => s.id)).toContain('career_money');
      expect(spreads.map((s) => s.id)).toContain('yes_no');
    });

    it('should return 0 locked spreads for free user (all available are accessible)', () => {
      const spreads = getLockedSpreads('free');
      expect(spreads.length).toBe(0);
    });
  });

  describe('getUpgradeMessage', () => {
    it('should return signup message for guest trying to access free tier spread', () => {
      const message = getUpgradeMessage('guest', 'love_relationships');
      expect(message).toContain('สมัครสมาชิกฟรี');
    });

    it('should return premium upgrade message for free user trying to access premium spread', () => {
      const message = getUpgradeMessage('free', 'celtic_cross');
      expect(message).toContain('Premium');
    });

    it('should return empty string for guest accessing guest spread', () => {
      const message = getUpgradeMessage('guest', 'daily');
      expect(message).toBe('');
    });
  });

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

  describe('Route helpers', () => {
    it('getSpreadRoute should return correct route', () => {
      expect(getSpreadRoute('daily')).toBe('/reading/daily');
      expect(getSpreadRoute('love_relationships')).toBe('/reading/love');
    });

    it('getSpreadByRoute should return spread config', () => {
      const spread = getSpreadByRoute('/reading/daily');
      expect(spread?.id).toBe('daily');
    });

    it('isProtectedRoute should return true for protected routes', () => {
      expect(isProtectedRoute('/reading/love')).toBe(true);
      expect(isProtectedRoute('/reading/career')).toBe(true);
      expect(isProtectedRoute('/reading/yes-no')).toBe(true);
    });

    it('isProtectedRoute should return false for public routes', () => {
      expect(isProtectedRoute('/reading/daily')).toBe(false);
      expect(isProtectedRoute('/reading/three-card')).toBe(false);
    });

    it('getProtectedRoutes should return all protected routes', () => {
      const routes = getProtectedRoutes();
      expect(routes).toContain('/reading/love');
      expect(routes).toContain('/reading/career');
      expect(routes).toContain('/reading/yes-no');
      expect(routes).not.toContain('/reading/daily');
    });
  });

  describe('getUserTier', () => {
    it('should return guest for null user', () => {
      expect(getUserTier(null)).toBe('guest');
    });

    it('should return free for user without subscription', () => {
      expect(getUserTier({})).toBe('free');
    });

    it('should return premium for user with premium subscription', () => {
      expect(getUserTier({ subscription: 'premium' })).toBe('premium');
    });
  });

  describe('SPREAD_ACCESS_MATRIX', () => {
    it('should have all required fields for each spread', () => {
      Object.values(SPREAD_ACCESS_MATRIX).forEach((spread) => {
        expect(spread.id).toBeDefined();
        expect(spread.name).toBeDefined();
        expect(spread.nameTh).toBeDefined();
        expect(spread.description).toBeDefined();
        expect(spread.descriptionTh).toBeDefined();
        expect(spread.requiredTier).toBeDefined();
        expect(spread.icon).toBeDefined();
        expect(spread.cardCount).toBeGreaterThan(0);
        expect(spread.estimatedTime).toBeDefined();
        expect(spread.route).toBeDefined();
        expect(typeof spread.isAvailable).toBe('boolean');
      });
    });

    it('should have 8 total spreads defined', () => {
      expect(Object.keys(SPREAD_ACCESS_MATRIX).length).toBe(8);
    });

    it('should have 5 available spreads', () => {
      const available = Object.values(SPREAD_ACCESS_MATRIX).filter((s) => s.isAvailable);
      expect(available.length).toBe(5);
    });
  });
});

