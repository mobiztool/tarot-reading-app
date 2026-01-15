/**
 * Unit Tests: Spread Recommendation Engine
 * Story 7.8: Spread Recommendation Engine
 * 
 * Tests keyword matching, question analysis, and recommendation logic
 */

import { describe, it, expect } from 'vitest';
import {
  analyzeQuestion,
  getSpreadRecommendations,
  getDefaultRecommendations,
  getAccessibleRecommendations,
  KEYWORD_CATEGORIES,
} from '@/lib/recommendation';

// ============================================================================
// TC-7.8-001: Question "love" → love/relationship spreads
// ============================================================================
describe('TC-7.8-001: Love keyword recommendations', () => {
  it('should recommend love spreads for English "love" keyword', () => {
    const result = getSpreadRecommendations('I want to know about love', 'free', 5);
    
    expect(result.hasMatches).toBe(true);
    expect(result.primaryCategory).toBe('love');
    
    const spreadIds = result.recommendations.map(r => r.spread.id);
    expect(spreadIds).toContain('love_relationships');
  });

  it('should recommend love spreads for English "relationship" keyword', () => {
    const result = getSpreadRecommendations('How is my relationship going?', 'free', 5);
    
    expect(result.hasMatches).toBe(true);
    expect(result.primaryCategory).toBe('love');
  });

  it('should recommend love spreads for "marriage" keyword', () => {
    // Use basic tier to access love_relationships spread
    // Avoid "will I" which matches yesno category
    const result = getSpreadRecommendations('Tell me about my marriage', 'basic', 5);
    
    expect(result.hasMatches).toBe(true);
    expect(result.primaryCategory).toBe('love');
    const spreadIds = result.recommendations.map(r => r.spread.id);
    expect(spreadIds).toContain('love_relationships');
  });
});

// ============================================================================
// TC-7.8-002: Question "career" → career spreads
// ============================================================================
describe('TC-7.8-002: Career keyword recommendations', () => {
  it('should recommend career spreads for English "career" keyword', () => {
    const result = getSpreadRecommendations('What about my career?', 'free', 5);
    
    expect(result.hasMatches).toBe(true);
    expect(result.primaryCategory).toBe('career');
    
    const spreadIds = result.recommendations.map(r => r.spread.id);
    expect(spreadIds).toContain('career_money');
  });

  it('should recommend career spreads for "job" keyword', () => {
    // Use question without "should" to avoid decision category matching
    const result = getSpreadRecommendations('How is my job going?', 'free', 5);
    
    expect(result.hasMatches).toBe(true);
    expect(result.primaryCategory).toBe('career');
  });

  it('should recommend career spreads for "money" keyword', () => {
    const result = getSpreadRecommendations('Will I have more money?', 'free', 5);
    
    expect(result.hasMatches).toBe(true);
    const spreadIds = result.recommendations.map(r => r.spread.id);
    expect(spreadIds).toContain('career_money');
  });
});

// ============================================================================
// TC-7.8-003: Question "decision" → decision making spread
// ============================================================================
describe('TC-7.8-003: Decision keyword recommendations', () => {
  it('should recommend decision spread for "decide" keyword', () => {
    const result = getSpreadRecommendations('I need to decide something', 'pro', 5);
    
    expect(result.hasMatches).toBe(true);
    expect(result.primaryCategory).toBe('decision');
    
    const spreadIds = result.recommendations.map(r => r.spread.id);
    expect(spreadIds).toContain('decision_making');
  });

  it('should recommend decision spread for "choice" keyword', () => {
    const result = getSpreadRecommendations('I have a difficult choice to make', 'pro', 5);
    
    expect(result.hasMatches).toBe(true);
    const spreadIds = result.recommendations.map(r => r.spread.id);
    expect(spreadIds).toContain('decision_making');
  });

  it('should recommend decision spread for "should" keyword', () => {
    const result = getSpreadRecommendations('Should I take this opportunity?', 'pro', 5);
    
    expect(result.hasMatches).toBe(true);
  });
});

// ============================================================================
// TC-7.8-004: Thai keywords detected (ความรัก, การงาน)
// ============================================================================
describe('TC-7.8-004: Thai keyword detection', () => {
  it('should detect Thai love keyword "ความรัก"', () => {
    const result = getSpreadRecommendations('ความรักของฉันจะเป็นอย่างไร', 'free', 5);
    
    expect(result.hasMatches).toBe(true);
    expect(result.primaryCategory).toBe('love');
    
    const spreadIds = result.recommendations.map(r => r.spread.id);
    expect(spreadIds).toContain('love_relationships');
  });

  it('should detect Thai career keyword "การงาน"', () => {
    // Use question without "ดีไหม" to avoid decision category matching
    const result = getSpreadRecommendations('การงานของฉันเป็นอย่างไร', 'free', 5);
    
    expect(result.hasMatches).toBe(true);
    expect(result.primaryCategory).toBe('career');
    
    const spreadIds = result.recommendations.map(r => r.spread.id);
    expect(spreadIds).toContain('career_money');
  });

  it('should detect Thai decision keyword "ตัดสินใจ"', () => {
    const result = getSpreadRecommendations('ฉันควรตัดสินใจอย่างไร', 'pro', 5);
    
    expect(result.hasMatches).toBe(true);
    expect(result.primaryCategory).toBe('decision');
  });

  it('should detect Thai keyword "แฟน"', () => {
    const result = getSpreadRecommendations('แฟนฉันรักฉันไหม', 'free', 5);
    
    expect(result.hasMatches).toBe(true);
    expect(result.primaryCategory).toBe('love');
  });

  it('should detect Thai keyword "เงิน"', () => {
    const result = getSpreadRecommendations('ปีนี้ฉันจะมีเงินไหม', 'free', 5);
    
    expect(result.hasMatches).toBe(true);
    expect(result.primaryCategory).toBe('career');
  });
});

// ============================================================================
// TC-7.8-005: Multiple keywords → combines suggestions
// ============================================================================
describe('TC-7.8-005: Multiple keywords combination', () => {
  it('should handle questions with multiple category keywords', () => {
    const result = getSpreadRecommendations('Should I change my career for love?', 'free', 5);
    
    expect(result.hasMatches).toBe(true);
    // Should have recommendations from both categories
    const spreadIds = result.recommendations.map(r => r.spread.id);
    
    // At least one love or career spread should be present
    const hasRelevantSpread = 
      spreadIds.includes('love_relationships') || 
      spreadIds.includes('career_money') ||
      spreadIds.includes('decision_making');
    expect(hasRelevantSpread).toBe(true);
  });

  it('should prioritize higher priority categories', () => {
    // Decision has priority 9, love/career have priority 8
    const result = getSpreadRecommendations('Should I decide about my love life?', 'pro', 5);
    
    expect(result.hasMatches).toBe(true);
    // Decision category should be prioritized
    expect(result.primaryCategory).toBe('decision');
  });
});

// ============================================================================
// TC-7.8-020 to 022: Tier Filtering
// ============================================================================
describe('TC-7.8-020: Tier filtering for recommendations', () => {
  it('TC-7.8-020: FREE user should only have free spreads as accessible', () => {
    const result = getSpreadRecommendations('Tell me about love', 'free', 5);
    
    const accessibleSpreads = result.recommendations.filter(r => r.isAccessible);
    
    // All accessible spreads should be free tier
    for (const rec of accessibleSpreads) {
      expect(rec.spread.minimumTier).toBe('free');
    }
  });

  it('TC-7.8-021: PRO user should have access to free + basic + pro spreads', () => {
    const result = getSpreadRecommendations('Help me make a decision', 'pro', 5);
    
    const accessibleSpreads = result.recommendations.filter(r => r.isAccessible);
    
    // Pro users can access free, basic, and pro
    for (const rec of accessibleSpreads) {
      expect(['free', 'basic', 'pro']).toContain(rec.spread.minimumTier);
    }
  });

  it('TC-7.8-022: VIP user should have access to all spreads', () => {
    const result = getSpreadRecommendations('Tell me about my soul purpose', 'vip', 5);
    
    // All recommendations should be accessible for VIP
    for (const rec of result.recommendations) {
      expect(rec.isAccessible).toBe(true);
    }
  });

  it('should show tier badge info for locked spreads', () => {
    const result = getSpreadRecommendations('Tell me about love', 'free', 5);
    
    const lockedSpreads = result.recommendations.filter(r => !r.isAccessible);
    
    // Locked spreads should have requiredTier set
    for (const rec of lockedSpreads) {
      expect(rec.requiredTier).toBeDefined();
      expect(['basic', 'pro', 'vip']).toContain(rec.requiredTier);
    }
  });
});

// ============================================================================
// TC-7.8-030 to 033: Recommendation Display
// ============================================================================
describe('TC-7.8-030: Recommendation display requirements', () => {
  it('TC-7.8-030: Should show 3-5 recommendations', () => {
    const result3 = getSpreadRecommendations('Tell me about love', 'free', 3);
    expect(result3.recommendations.length).toBeLessThanOrEqual(3);
    
    const result5 = getSpreadRecommendations('Tell me about love', 'free', 5);
    expect(result5.recommendations.length).toBeLessThanOrEqual(5);
    expect(result5.recommendations.length).toBeGreaterThan(0);
  });

  it('TC-7.8-031: Each recommendation should include name and description', () => {
    const result = getSpreadRecommendations('Tell me about love', 'free', 5);
    
    for (const rec of result.recommendations) {
      expect(rec.spread.name).toBeDefined();
      expect(rec.spread.name.length).toBeGreaterThan(0);
      expect(rec.spread.description).toBeDefined();
      expect(rec.spread.description.length).toBeGreaterThan(0);
      expect(rec.spread.nameTh).toBeDefined();
      expect(rec.spread.descriptionTh).toBeDefined();
    }
  });

  it('TC-7.8-032: Each recommendation should have reason text', () => {
    const result = getSpreadRecommendations('Tell me about love', 'free', 5);
    
    for (const rec of result.recommendations) {
      expect(rec.reason).toBeDefined();
      expect(rec.reason.length).toBeGreaterThan(0);
      expect(rec.reasonTh).toBeDefined();
      expect(rec.reasonTh.length).toBeGreaterThan(0);
    }
  });

  it('TC-7.8-033: Each recommendation should have route for navigation', () => {
    const result = getSpreadRecommendations('Tell me about love', 'free', 5);
    
    for (const rec of result.recommendations) {
      expect(rec.spread.route).toBeDefined();
      expect(rec.spread.route.startsWith('/reading/')).toBe(true);
    }
  });
});

// ============================================================================
// Default Recommendations
// ============================================================================
describe('Default recommendations when no keywords match', () => {
  it('should return popular spreads when no keywords match', () => {
    const result = getSpreadRecommendations('xyz123 random text', 'free', 5);
    
    expect(result.hasMatches).toBe(false);
    expect(result.recommendations.length).toBeGreaterThan(0);
    expect(result.primaryCategory).toBeNull();
  });

  it('should return default recommendations for empty question', () => {
    const result = getDefaultRecommendations('free', 5);
    
    expect(result.hasMatches).toBe(false);
    expect(result.recommendations.length).toBeGreaterThan(0);
  });

  it('should prioritize accessible spreads first', () => {
    const result = getSpreadRecommendations('Tell me about love', 'free', 5);
    
    // First recommendations should be accessible
    const firstAccessible = result.recommendations.findIndex(r => r.isAccessible);
    const firstLocked = result.recommendations.findIndex(r => !r.isAccessible);
    
    if (firstAccessible !== -1 && firstLocked !== -1) {
      expect(firstAccessible).toBeLessThan(firstLocked);
    }
  });
});

// ============================================================================
// analyzeQuestion function
// ============================================================================
describe('analyzeQuestion function', () => {
  it('should return matched categories with keywords', () => {
    const { matchedCategories } = analyzeQuestion('I need help with my love life');
    
    expect(matchedCategories.length).toBeGreaterThan(0);
    expect(matchedCategories[0].matchedKeywords.length).toBeGreaterThan(0);
  });

  it('should handle case-insensitive matching', () => {
    const result1 = analyzeQuestion('LOVE');
    const result2 = analyzeQuestion('love');
    const result3 = analyzeQuestion('Love');
    
    expect(result1.matchedCategories.length).toBeGreaterThan(0);
    expect(result2.matchedCategories.length).toBeGreaterThan(0);
    expect(result3.matchedCategories.length).toBeGreaterThan(0);
  });

  it('should return empty array for unrecognized text', () => {
    const { matchedCategories } = analyzeQuestion('xyz123 no keywords here');
    
    expect(matchedCategories.length).toBe(0);
  });
});

// ============================================================================
// getAccessibleRecommendations function
// ============================================================================
describe('getAccessibleRecommendations function', () => {
  it('should return only accessible spreads', () => {
    const recommendations = getAccessibleRecommendations('Tell me about love', 'free', 3);
    
    for (const rec of recommendations) {
      expect(rec.isAccessible).toBe(true);
    }
  });

  it('should respect maxRecommendations limit', () => {
    const recommendations = getAccessibleRecommendations('Tell me about love', 'vip', 2);
    
    expect(recommendations.length).toBeLessThanOrEqual(2);
  });
});

// ============================================================================
// Keyword Categories Validation
// ============================================================================
describe('KEYWORD_CATEGORIES validation', () => {
  it('should have valid structure for all categories', () => {
    for (const category of KEYWORD_CATEGORIES) {
      expect(category.id).toBeDefined();
      expect(category.keywords.th.length).toBeGreaterThan(0);
      expect(category.keywords.en.length).toBeGreaterThan(0);
      expect(category.recommendedSpreads.length).toBeGreaterThan(0);
      expect(category.priority).toBeGreaterThan(0);
    }
  });

  it('should have love category with Thai keywords', () => {
    const loveCategory = KEYWORD_CATEGORIES.find(c => c.id === 'love');
    
    expect(loveCategory).toBeDefined();
    expect(loveCategory?.keywords.th).toContain('ความรัก');
    expect(loveCategory?.keywords.en).toContain('love');
  });

  it('should have career category with Thai keywords', () => {
    const careerCategory = KEYWORD_CATEGORIES.find(c => c.id === 'career');
    
    expect(careerCategory).toBeDefined();
    expect(careerCategory?.keywords.th).toContain('การงาน');
    expect(careerCategory?.keywords.en).toContain('career');
  });
});
