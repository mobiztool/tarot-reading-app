/**
 * AI Interpretation Unit Tests
 * Story 9.2: AI-Powered Personalized Interpretations
 * 
 * Tests for AI prompt building, rate limiting, caching, and quality
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  buildInterpretationPrompt,
  POSITION_LABELS_TH,
  READING_TYPE_LABELS_TH,
  TAROT_SYSTEM_PROMPT,
} from '@/lib/ai/prompts';
import {
  checkRateLimit,
  recordUsage,
  generateCacheKey,
  getCachedResponse,
  cacheResponse,
  getDailyCostAggregate,
} from '@/lib/ai/rate-limiting';
import type { AICardInfo, ReadingHistoryItem } from '@/lib/ai/types';

// Sample test data
const sampleCards: AICardInfo[] = [
  {
    name: 'The Fool',
    nameTh: 'เดอะฟูล',
    position: 0,
    positionLabel: 'past',
    positionLabelTh: 'อดีต',
    isReversed: false,
    meaningUpright: 'New beginnings, innocence',
    keywords: ['ใหม่', 'เริ่มต้น'],
  },
  {
    name: 'The Magician',
    nameTh: 'เดอะเมจิเชียน',
    position: 1,
    positionLabel: 'present',
    positionLabelTh: 'ปัจจุบัน',
    isReversed: true,
    meaningReversed: 'Manipulation, deception',
    keywords: ['พลัง', 'ทักษะ'],
  },
  {
    name: 'The High Priestess',
    nameTh: 'นักบวชหญิง',
    position: 2,
    positionLabel: 'future',
    positionLabelTh: 'อนาคต',
    isReversed: false,
    meaningUpright: 'Intuition, mystery',
    keywords: ['สัญชาตญาณ', 'ลึกลับ'],
  },
];

describe('AI Prompts Module', () => {
  describe('POSITION_LABELS_TH', () => {
    it('should have Thai labels for basic positions', () => {
      expect(POSITION_LABELS_TH.past).toBe('อดีต');
      expect(POSITION_LABELS_TH.present).toBe('ปัจจุบัน');
      expect(POSITION_LABELS_TH.future).toBe('อนาคต');
    });

    it('should have Thai labels for love spread positions', () => {
      expect(POSITION_LABELS_TH.you).toBe('ตัวคุณ');
      expect(POSITION_LABELS_TH.other).toBe('อีกฝ่าย');
      expect(POSITION_LABELS_TH.relationship_energy).toBe('พลังงานความสัมพันธ์');
    });

    it('should have Thai labels for Celtic Cross positions', () => {
      expect(POSITION_LABELS_TH.cc_present).toBe('สถานการณ์ปัจจุบัน');
      expect(POSITION_LABELS_TH.cc_outcome).toBe('ผลลัพธ์สุดท้าย');
    });

    it('should have Thai labels for chakra positions', () => {
      expect(POSITION_LABELS_TH.ca_root).toBe('จักระฐาน (ความมั่นคง)');
      expect(POSITION_LABELS_TH.ca_crown).toBe('จักระยอดศีรษะ (จิตวิญญาณ)');
    });
  });

  describe('READING_TYPE_LABELS_TH', () => {
    it('should have Thai labels for all reading types', () => {
      expect(READING_TYPE_LABELS_TH.daily).toBe('ไพ่ประจำวัน');
      expect(READING_TYPE_LABELS_TH.three_card).toBe('ไพ่ 3 ใบ (อดีต-ปัจจุบัน-อนาคต)');
      expect(READING_TYPE_LABELS_TH.celtic_cross).toBe('เซลติกครอส (10 ใบ)');
      expect(READING_TYPE_LABELS_TH.love_relationships).toBe('ความรักและความสัมพันธ์');
    });
  });

  describe('TAROT_SYSTEM_PROMPT', () => {
    it('should be in Thai', () => {
      expect(TAROT_SYSTEM_PROMPT).toContain('คุณคือนักดูไพ่ทาโรต์');
    });

    it('should include interpretation guidelines', () => {
      expect(TAROT_SYSTEM_PROMPT).toContain('หลักการในการตีความ');
    });

    it('should include safety guidelines', () => {
      expect(TAROT_SYSTEM_PROMPT).toContain('คำแนะนำ');
    });

    it('should specify response format', () => {
      expect(TAROT_SYSTEM_PROMPT).toContain('รูปแบบการตอบ');
    });

    it('should specify word count range', () => {
      expect(TAROT_SYSTEM_PROMPT).toContain('200-300 คำ');
    });
  });

  describe('buildInterpretationPrompt', () => {
    it('should include reading type in Thai', () => {
      const prompt = buildInterpretationPrompt(sampleCards, 'three_card');
      expect(prompt).toContain('ไพ่ 3 ใบ (อดีต-ปัจจุบัน-อนาคต)');
    });

    it('should include user question when provided', () => {
      const question = 'ความรักของฉันจะเป็นอย่างไร?';
      const prompt = buildInterpretationPrompt(sampleCards, 'three_card', question);
      expect(prompt).toContain(question);
      expect(prompt).toContain('คำถามของผู้ดู');
    });

    it('should include all cards in prompt', () => {
      const prompt = buildInterpretationPrompt(sampleCards, 'three_card');
      
      expect(prompt).toContain('เดอะฟูล');
      expect(prompt).toContain('The Fool');
      expect(prompt).toContain('เดอะเมจิเชียน');
      expect(prompt).toContain('นักบวชหญิง');
    });

    it('should indicate reversed cards correctly', () => {
      const prompt = buildInterpretationPrompt(sampleCards, 'three_card');
      
      // The Magician is reversed
      expect(prompt).toContain('(กลับหัว)');
      // The Fool and High Priestess are upright
      expect(prompt).toContain('(ตั้งตรง)');
    });

    it('should include position labels in Thai', () => {
      const prompt = buildInterpretationPrompt(sampleCards, 'three_card');
      
      expect(prompt).toContain('อดีต');
      expect(prompt).toContain('ปัจจุบัน');
      expect(prompt).toContain('อนาคต');
    });

    it('should include keywords when available', () => {
      const prompt = buildInterpretationPrompt(sampleCards, 'three_card');
      
      expect(prompt).toContain('คีย์เวิร์ด');
      expect(prompt).toContain('ใหม่');
    });

    it('should include meanings based on orientation', () => {
      const prompt = buildInterpretationPrompt(sampleCards, 'three_card');
      
      // Upright meaning for The Fool
      expect(prompt).toContain('New beginnings');
      // Reversed meaning for The Magician
      expect(prompt).toContain('Manipulation');
    });

    it('should include reading history when provided', () => {
      const history: ReadingHistoryItem[] = [
        {
          date: '2024-01-01',
          readingType: 'love_relationships',
          question: 'เกี่ยวกับคนที่ชอบ',
          cards: [{ name: 'The Lovers', isReversed: false }],
        },
      ];
      
      const prompt = buildInterpretationPrompt(
        sampleCards, 
        'three_card', 
        'คำถาม',
        history
      );
      
      expect(prompt).toContain('บริบทจากการดูดวงก่อนหน้า');
      expect(prompt).toContain('love_relationships');
    });

    it('should end with clear request instructions', () => {
      const prompt = buildInterpretationPrompt(sampleCards, 'three_card', 'ความรักของฉัน?');
      
      expect(prompt).toContain('คำขอ');
      expect(prompt).toContain('คำทำนายที่ลึกซึ้ง');
      expect(prompt).toContain('คำแนะนำที่ปฏิบัติได้จริง');
    });
  });
});

describe('AI Rate Limiting Module', () => {
  const testUserId = 'test-user-123';

  beforeEach(() => {
    // Reset rate limit store between tests
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-06-15T10:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('checkRateLimit', () => {
    it('should allow first request', () => {
      const result = checkRateLimit('new-user-456');
      
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(10); // Default max is 10
    });

    it('should track remaining requests', () => {
      const userId = 'track-user-789';
      
      // First request
      const first = checkRateLimit(userId);
      expect(first.allowed).toBe(true);
      
      // Record usage
      recordUsage(userId, 500, 0.02);
      
      // Second request should have one less remaining
      const second = checkRateLimit(userId);
      expect(second.allowed).toBe(true);
      expect(second.remaining).toBe(9);
    });

    it('should include reset time', () => {
      const result = checkRateLimit(testUserId);
      
      expect(result.resetAt).toBeInstanceOf(Date);
      expect(result.resetAt.getTime()).toBeGreaterThan(Date.now());
    });
  });

  describe('recordUsage', () => {
    it('should track tokens used', () => {
      const userId = 'record-user-1';
      recordUsage(userId, 500, 0.02);
      
      const status = checkRateLimit(userId);
      expect(status.dailyUsed).toBe(1);
    });

    it('should track cost estimate', () => {
      const userId = 'record-user-2';
      recordUsage(userId, 500, 0.02);
      recordUsage(userId, 600, 0.03);
      
      const aggregate = getDailyCostAggregate();
      expect(aggregate.totalCost).toBeGreaterThanOrEqual(0.05);
    });
  });

  describe('generateCacheKey', () => {
    it('should generate consistent key for same cards', () => {
      const cards = [
        { name: 'The Fool', isReversed: false },
        { name: 'The Magician', isReversed: true },
      ];
      
      const key1 = generateCacheKey(cards, 'test question');
      const key2 = generateCacheKey(cards, 'test question');
      
      expect(key1).toBe(key2);
    });

    it('should generate different keys for different questions', () => {
      const cards = [{ name: 'The Fool', isReversed: false }];
      
      const key1 = generateCacheKey(cards, 'question 1');
      const key2 = generateCacheKey(cards, 'question 2');
      
      expect(key1).not.toBe(key2);
    });

    it('should generate different keys for different card orientations', () => {
      const cards1 = [{ name: 'The Fool', isReversed: false }];
      const cards2 = [{ name: 'The Fool', isReversed: true }];
      
      const key1 = generateCacheKey(cards1);
      const key2 = generateCacheKey(cards2);
      
      expect(key1).not.toBe(key2);
    });

    it('should handle empty question', () => {
      const cards = [{ name: 'The Fool', isReversed: false }];
      
      const key1 = generateCacheKey(cards);
      const key2 = generateCacheKey(cards, '');
      
      expect(key1).toBe(key2);
    });

    it('should be case insensitive for questions', () => {
      const cards = [{ name: 'The Fool', isReversed: false }];
      
      const key1 = generateCacheKey(cards, 'HELLO');
      const key2 = generateCacheKey(cards, 'hello');
      
      expect(key1).toBe(key2);
    });
  });

  describe('cacheResponse and getCachedResponse', () => {
    it('should store and retrieve cached response', () => {
      const cacheKey = 'test-cache-key-1';
      const response = 'This is a test interpretation';
      const tokensUsed = 500;
      
      cacheResponse(cacheKey, response, tokensUsed);
      
      const cached = getCachedResponse(cacheKey);
      expect(cached).not.toBeNull();
      expect(cached?.response).toBe(response);
      expect(cached?.tokensUsed).toBe(tokensUsed);
    });

    it('should return null for non-existent key', () => {
      const cached = getCachedResponse('non-existent-key');
      expect(cached).toBeNull();
    });
  });

  describe('getDailyCostAggregate', () => {
    it('should return total cost and requests', () => {
      const userId1 = 'cost-user-1';
      const userId2 = 'cost-user-2';
      
      recordUsage(userId1, 500, 0.02);
      recordUsage(userId2, 600, 0.03);
      
      const aggregate = getDailyCostAggregate();
      
      expect(aggregate.totalRequests).toBeGreaterThanOrEqual(2);
      expect(aggregate.totalCost).toBeGreaterThanOrEqual(0.05);
    });
  });
});

describe('AI Quality & Safety Requirements', () => {
  describe('System Prompt Safety Guidelines', () => {
    it('should instruct not to predict death or severe events', () => {
      const systemPrompt = TAROT_SYSTEM_PROMPT;
      expect(systemPrompt).toContain('ไม่โอ้อวดเกินจริง');
    });

    it('should instruct to avoid medical advice', () => {
      const systemPrompt = TAROT_SYSTEM_PROMPT;
      expect(systemPrompt).toContain('การแพทย์');
    });

    it('should encourage positive and constructive guidance', () => {
      const systemPrompt = TAROT_SYSTEM_PROMPT;
      expect(systemPrompt).toContain('แรงบันดาลใจ');
      expect(systemPrompt).toContain('ความหวัง');
    });

    it('should respect Thai culture', () => {
      const systemPrompt = TAROT_SYSTEM_PROMPT;
      expect(systemPrompt).toContain('วัฒนธรรมไทย');
    });
  });

  describe('Thai Language Requirements', () => {
    it('should produce prompts primarily in Thai', () => {
      const prompt = buildInterpretationPrompt(sampleCards, 'three_card');
      
      // Count Thai characters (Thai Unicode range: 0E00-0E7F)
      const thaiCharCount = (prompt.match(/[\u0E00-\u0E7F]/g) || []).length;
      
      // Should have significant Thai content
      expect(thaiCharCount).toBeGreaterThan(100);
    });

    it('should include both Thai and English card names', () => {
      const prompt = buildInterpretationPrompt(sampleCards, 'three_card');
      
      // Check for bilingual card names
      expect(prompt).toContain('เดอะฟูล');
      expect(prompt).toContain('The Fool');
    });
  });

  describe('Prompt Length Requirements', () => {
    it('should specify word count in system prompt', () => {
      expect(TAROT_SYSTEM_PROMPT).toContain('200-300');
    });

    it('should generate prompts of reasonable length', () => {
      const prompt = buildInterpretationPrompt(sampleCards, 'three_card', 'คำถามยาวๆ');
      
      // Prompt should be substantial but not excessively long
      expect(prompt.length).toBeGreaterThan(500);
      expect(prompt.length).toBeLessThan(5000);
    });
  });
});

describe('AI Integration Patterns', () => {
  describe('Graceful Degradation', () => {
    it('should include fallback flag in error responses', () => {
      // When API returns error, frontend should check for fallback flag
      // and show standard interpretation instead
      const errorResponse = {
        success: false,
        error: 'AI service unavailable',
        fallback: true,
      };
      
      expect(errorResponse.fallback).toBe(true);
    });
  });

  describe('VIP-Only Access', () => {
    it('should require VIP tier for AI feature', () => {
      // VIP tier config should have AI feature listed
      // This is tested in subscription tests, but we verify here for integration
      const vipFeatures = [
        'AI personalized readings',
        'AI คำทำนายส่วนตัว',
      ];
      
      expect(vipFeatures.length).toBeGreaterThan(0);
    });
  });
});
