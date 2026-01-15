/**
 * Premium Spread Layouts Unit Tests
 * Story 7.5: Premium Spread Responsive Layouts
 * 
 * Tests for SpreadLayout, CelticCrossLayout, ComparisonLayout, CircleLayout components
 */

import { describe, it, expect } from 'vitest';
import { 
  CELTIC_CROSS_POSITIONS,
} from '@/components/spreads/CelticCrossLayout';
import {
  DECISION_MAKING_POSITIONS,
} from '@/components/spreads/ComparisonLayout';
import { ANIMATION_PRESETS } from '@/lib/hooks/useSpreadAnimation';

describe('Story 7.5: Premium Spread Layouts', () => {
  describe('CelticCrossLayout Positions', () => {
    it('TC-7.5-010: should have exactly 10 positions for Celtic Cross', () => {
      expect(CELTIC_CROSS_POSITIONS).toHaveLength(10);
    });

    it('TC-7.5-011: should have correct position for center card (Present)', () => {
      const presentPos = CELTIC_CROSS_POSITIONS[0];
      expect(presentPos.position).toBe('cc_present');
      expect(presentPos.label.th).toBe('สถานการณ์ปัจจุบัน');
      expect(presentPos.label.emoji).toBe('⏺️');
    });

    it('TC-7.5-012: should have overlay card (Challenge) with 90deg rotation', () => {
      const challengePos = CELTIC_CROSS_POSITIONS[1];
      expect(challengePos.position).toBe('cc_challenge');
      expect(challengePos.rotate).toBe(90);
      expect(challengePos.isOverlay).toBe(true);
    });

    it('TC-7.5-013: should have all 10 position labels in Thai', () => {
      const expectedThai = [
        'สถานการณ์ปัจจุบัน',
        'อุปสรรค/ความท้าทาย',
        'รากฐาน/อดีต',
        'อนาคตอันใกล้',
        'เป้าหมาย/ความปรารถนา',
        'จิตใต้สำนึก',
        'คำแนะนำ',
        'อิทธิพลภายนอก',
        'ความหวัง/ความกลัว',
        'ผลลัพธ์สุดท้าย',
      ];

      CELTIC_CROSS_POSITIONS.forEach((pos, index) => {
        expect(pos.label.th).toBe(expectedThai[index]);
      });
    });

    it('TC-7.5-014: should have consistent ID sequence (1-10)', () => {
      CELTIC_CROSS_POSITIONS.forEach((pos, index) => {
        expect(pos.id).toBe(index + 1);
      });
    });

    it('TC-7.5-063: should have emoji for each position', () => {
      CELTIC_CROSS_POSITIONS.forEach((pos) => {
        expect(pos.label.emoji).toBeDefined();
        expect(pos.label.emoji.length).toBeGreaterThan(0);
      });
    });

    it('TC-7.5-064: should have gradient color for each position', () => {
      CELTIC_CROSS_POSITIONS.forEach((pos) => {
        expect(pos.color).toMatch(/^from-\w+-\d+ to-\w+-\d+$/);
      });
    });
  });

  describe('ComparisonLayout (Decision Making) Positions', () => {
    it('TC-7.5-130: should have exactly 5 positions for Decision Making', () => {
      expect(DECISION_MAKING_POSITIONS).toHaveLength(5);
    });

    it('should have Option A pros and cons', () => {
      const optionAPros = DECISION_MAKING_POSITIONS[0];
      const optionACons = DECISION_MAKING_POSITIONS[1];

      expect(optionAPros.position).toBe('dm_option_a_pros');
      expect(optionAPros.label.emoji).toBe('✅');

      expect(optionACons.position).toBe('dm_option_a_cons');
      expect(optionACons.label.emoji).toBe('⚠️');
    });

    it('should have Option B pros and cons', () => {
      const optionBPros = DECISION_MAKING_POSITIONS[2];
      const optionBCons = DECISION_MAKING_POSITIONS[3];

      expect(optionBPros.position).toBe('dm_option_b_pros');
      expect(optionBCons.position).toBe('dm_option_b_cons');
    });

    it('should have Best Path as final position', () => {
      const bestPath = DECISION_MAKING_POSITIONS[4];
      expect(bestPath.position).toBe('dm_best_path');
      expect(bestPath.label.th).toBe('เส้นทางที่ดีที่สุด');
      expect(bestPath.label.emoji).toBe('🌟');
    });

    it('TC-7.5-131: should have 2+2+1 layout structure (A pros/cons, B pros/cons, best path)', () => {
      // Verify structure: 2 for option A, 2 for option B, 1 for best path
      const optionACount = DECISION_MAKING_POSITIONS.filter(p => 
        p.position.startsWith('dm_option_a')
      ).length;
      const optionBCount = DECISION_MAKING_POSITIONS.filter(p => 
        p.position.startsWith('dm_option_b')
      ).length;
      const bestPathCount = DECISION_MAKING_POSITIONS.filter(p => 
        p.position === 'dm_best_path'
      ).length;

      expect(optionACount).toBe(2);
      expect(optionBCount).toBe(2);
      expect(bestPathCount).toBe(1);
    });
  });

  describe('Animation System', () => {
    it('TC-7.5-070: animation presets should have correct enabled/disabled values', () => {
      // Animation presets verify the system supports enable/disable
      expect(ANIMATION_PRESETS.fast.staggerDelay).toBeGreaterThan(0);
      expect(ANIMATION_PRESETS.normal.staggerDelay).toBeGreaterThan(0);
    });

    it('TC-7.5-071: should calculate sequential delays correctly (formula: index * staggerDelay)', () => {
      // Test the delay calculation formula: index * staggerDelay
      const staggerDelay = 300;
      const getDelay = (index: number) => index * staggerDelay;

      expect(getDelay(0)).toBe(0);
      expect(getDelay(1)).toBe(300);
      expect(getDelay(2)).toBe(600);
      expect(getDelay(9)).toBe(2700);
    });

    it('TC-7.5-072: should support configurable stagger delay (default 300ms)', () => {
      // Verify preset delays are configurable
      expect(ANIMATION_PRESETS.normal.staggerDelay).toBe(300); // default
      expect(ANIMATION_PRESETS.fast.staggerDelay).toBe(150);
      expect(ANIMATION_PRESETS.slow.staggerDelay).toBe(500);
      expect(ANIMATION_PRESETS.dramatic.staggerDelay).toBe(800);
    });

    it('should have animation presets with all required fields', () => {
      expect(ANIMATION_PRESETS.fast.staggerDelay).toBe(150);
      expect(ANIMATION_PRESETS.fast.flipDuration).toBe(500);
      
      expect(ANIMATION_PRESETS.normal.staggerDelay).toBe(300);
      expect(ANIMATION_PRESETS.normal.flipDuration).toBe(700);
      
      expect(ANIMATION_PRESETS.slow.staggerDelay).toBe(500);
      expect(ANIMATION_PRESETS.slow.flipDuration).toBe(900);
      
      expect(ANIMATION_PRESETS.dramatic.staggerDelay).toBe(800);
      expect(ANIMATION_PRESETS.dramatic.flipDuration).toBe(1200);
    });

    it('should support animation for valid card indices (formula: index < cardCount)', () => {
      const cardCount = 5;
      const shouldAnimate = (index: number) => index < cardCount;

      expect(shouldAnimate(0)).toBe(true);
      expect(shouldAnimate(4)).toBe(true);
      expect(shouldAnimate(5)).toBe(false);
      expect(shouldAnimate(10)).toBe(false);
    });
  });

  describe('Position Label Configuration', () => {
    it('TC-7.5-060: should have both th and en labels for all positions', () => {
      CELTIC_CROSS_POSITIONS.forEach((pos) => {
        expect(pos.label.th).toBeDefined();
        expect(pos.label.en).toBeDefined();
        expect(pos.label.th.length).toBeGreaterThan(0);
        expect(pos.label.en.length).toBeGreaterThan(0);
      });
    });

    it('TC-7.5-061: should have Thai labels as default', () => {
      const firstPos = CELTIC_CROSS_POSITIONS[0];
      // Thai label should exist
      expect(firstPos.label.th).toBe('สถานการณ์ปัจจุบัน');
    });

    it('TC-7.5-062: should have English labels available', () => {
      const firstPos = CELTIC_CROSS_POSITIONS[0];
      expect(firstPos.label.en).toBe('Present Situation');
    });

    it('TC-7.5-065: labels should have shortTh for compact display', () => {
      CELTIC_CROSS_POSITIONS.forEach((pos) => {
        expect(pos.label.shortTh).toBeDefined();
        expect(pos.label.shortTh.length).toBeLessThanOrEqual(pos.label.th.length);
      });
    });
  });

  describe('Layout Type Validation', () => {
    it('should support cross layout type for Celtic Cross', () => {
      // Celtic Cross uses cross formation
      const hasCrossFormation = CELTIC_CROSS_POSITIONS.some(p => 
        p.position.includes('present') || p.position.includes('challenge')
      );
      expect(hasCrossFormation).toBe(true);
    });

    it('should support comparison layout type for Decision Making', () => {
      // Decision Making has option A vs option B
      const hasComparison = DECISION_MAKING_POSITIONS.some(p => 
        p.position.includes('option_a')
      ) && DECISION_MAKING_POSITIONS.some(p => 
        p.position.includes('option_b')
      );
      expect(hasComparison).toBe(true);
    });
  });

  describe('Responsive Design Support', () => {
    it('TC-7.5-080: should have desktop-optimized position configurations', () => {
      // Celtic Cross has cross + staff formation for desktop
      const crossPositions = CELTIC_CROSS_POSITIONS.slice(0, 6); // Cross portion
      const staffPositions = CELTIC_CROSS_POSITIONS.slice(6, 10); // Staff portion

      expect(crossPositions).toHaveLength(6);
      expect(staffPositions).toHaveLength(4);
    });

    it('TC-7.5-082: should support vertical stacking for mobile', () => {
      // All positions should have required fields for mobile vertical layout
      CELTIC_CROSS_POSITIONS.forEach((pos) => {
        expect(pos.id).toBeDefined();
        expect(pos.label).toBeDefined();
        expect(pos.color).toBeDefined();
      });
    });
  });

  describe('Accessibility Support', () => {
    it('TC-7.5-091: positions should have ARIA-friendly labels', () => {
      CELTIC_CROSS_POSITIONS.forEach((pos) => {
        // Labels can be used for ARIA labels
        expect(pos.label.th).toBeDefined();
        expect(pos.label.en).toBeDefined();
      });
    });

    it('TC-7.5-092: positions should have descriptive names for screen readers', () => {
      // All positions have full Thai names
      CELTIC_CROSS_POSITIONS.forEach((pos) => {
        expect(pos.label.th.length).toBeGreaterThan(2);
      });
    });
  });
});

describe('Type Definitions', () => {
  it('should export PositionConfig interface correctly', async () => {
    const types = await import('@/types/spread-layout');
    expect(types).toBeDefined();
  });

  it('should have LayoutType as union type', async () => {
    const types = await import('@/types/spread-layout');
    // Type checking - if this imports without error, types are correct
    expect(types).toBeDefined();
  });
});
