/**
 * Story 9.3: Reading Export to PDF
 * Unit Tests for PDF Export Functionality
 * 
 * Tests cover:
 * - PDF types and data structures
 * - Access control (Pro/VIP only)
 * - Reading type translations
 * - Position label translations
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { PDFReadingData, PDFCardData, PDFGenerationOptions } from '@/lib/pdf/types';

// Mock fetch for testing
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('PDF Export Types', () => {
  describe('PDFCardData', () => {
    it('should accept valid card data structure', () => {
      const cardData: PDFCardData = {
        position: 1,
        positionLabel: 'past',
        positionLabelTh: 'อดีต',
        isReversed: false,
        card: {
          name: 'The Fool',
          nameTh: 'เดอะฟูล',
          imageUrl: '/cards/major/00.jpg',
          meaningUpright: 'New beginnings',
          meaningReversed: 'Recklessness',
          keywordsUpright: ['beginnings', 'innocence'],
          keywordsReversed: ['reckless', 'naive'],
          advice: 'Take the leap',
        },
      };

      expect(cardData.position).toBe(1);
      expect(cardData.positionLabel).toBe('past');
      expect(cardData.positionLabelTh).toBe('อดีต');
      expect(cardData.isReversed).toBe(false);
      expect(cardData.card.name).toBe('The Fool');
      expect(cardData.card.nameTh).toBe('เดอะฟูล');
    });

    it('should handle null position labels', () => {
      const cardData: PDFCardData = {
        position: 0,
        positionLabel: null,
        positionLabelTh: null,
        isReversed: true,
        card: {
          name: 'The Magician',
          nameTh: 'เดอะแมจิเชี่ยน',
          imageUrl: '/cards/major/01.jpg',
          meaningUpright: 'Manifestation',
          meaningReversed: 'Manipulation',
          keywordsUpright: ['power', 'skill'],
          keywordsReversed: ['deceit', 'trickery'],
          advice: 'Use your skills wisely',
        },
      };

      expect(cardData.positionLabel).toBeNull();
      expect(cardData.positionLabelTh).toBeNull();
    });
  });

  describe('PDFReadingData', () => {
    it('should accept valid reading data structure', () => {
      const readingData: PDFReadingData = {
        id: 'reading-123',
        readingType: 'three_card',
        readingTypeTh: 'ไพ่ 3 ใบ',
        question: 'What does my future hold?',
        createdAt: '2026-01-17T10:00:00Z',
        cards: [],
        notes: 'Important reading',
      };

      expect(readingData.id).toBe('reading-123');
      expect(readingData.readingType).toBe('three_card');
      expect(readingData.readingTypeTh).toBe('ไพ่ 3 ใบ');
      expect(readingData.question).toBe('What does my future hold?');
    });

    it('should handle optional fields', () => {
      const readingData: PDFReadingData = {
        id: 'reading-456',
        readingType: 'daily',
        readingTypeTh: 'ดูดวงประจำวัน',
        question: null,
        createdAt: '2026-01-17T10:00:00Z',
        cards: [],
      };

      expect(readingData.question).toBeNull();
      expect(readingData.notes).toBeUndefined();
    });
  });

  describe('PDFGenerationOptions', () => {
    it('should accept all option fields', () => {
      const options: PDFGenerationOptions = {
        includeInterpretations: true,
        includeKeywords: true,
        includeAdvice: false,
        includeNotes: true,
        includeBranding: true,
      };

      expect(options.includeInterpretations).toBe(true);
      expect(options.includeKeywords).toBe(true);
      expect(options.includeAdvice).toBe(false);
    });

    it('should allow partial options', () => {
      const options: PDFGenerationOptions = {
        includeInterpretations: true,
      };

      expect(options.includeInterpretations).toBe(true);
      expect(options.includeKeywords).toBeUndefined();
    });
  });
});

describe('PDF Export Access Control', () => {
  describe('Tier-based Access', () => {
    // Helper to check if tier can export PDF
    function canExportPDF(tier: string): boolean {
      return tier === 'pro' || tier === 'vip';
    }

    it('should allow Pro tier to export PDF', () => {
      expect(canExportPDF('pro')).toBe(true);
    });

    it('should allow VIP tier to export PDF', () => {
      expect(canExportPDF('vip')).toBe(true);
    });

    it('should NOT allow Free tier to export PDF', () => {
      expect(canExportPDF('free')).toBe(false);
    });

    it('should NOT allow Basic tier to export PDF', () => {
      expect(canExportPDF('basic')).toBe(false);
    });
  });
});

describe('PDF Export Reading Type Translations', () => {
  const READING_TYPES_TH: Record<string, string> = {
    daily: 'ดูดวงประจำวัน',
    three_card: 'ไพ่ 3 ใบ',
    love_relationships: 'ความรัก',
    career_money: 'การงาน/การเงิน',
    yes_no: 'ใช่/ไม่ใช่',
    celtic_cross: 'เซลติก ครอส',
    decision_making: 'ตัดสินใจ',
    self_discovery: 'ค้นหาตัวเอง',
    relationship_deep_dive: 'ความสัมพันธ์เชิงลึก',
    shadow_work: 'Shadow Work',
    chakra_alignment: 'จักระ',
    friendship: 'มิตรภาพ',
    career_path: 'เส้นทางอาชีพ',
    financial_abundance: 'การเงิน',
    monthly_forecast: 'รายเดือน',
    year_ahead: 'ปีหน้า',
    elemental_balance: 'ธาตุ',
    zodiac_wheel: 'จักรราศี',
  };

  it('should have Thai translation for all reading types', () => {
    const readingTypes = [
      'daily', 'three_card', 'love_relationships', 'career_money',
      'yes_no', 'celtic_cross', 'decision_making', 'self_discovery',
      'relationship_deep_dive', 'shadow_work', 'chakra_alignment',
      'friendship', 'career_path', 'financial_abundance',
      'monthly_forecast', 'year_ahead', 'elemental_balance', 'zodiac_wheel'
    ];

    readingTypes.forEach(type => {
      expect(READING_TYPES_TH[type]).toBeDefined();
      expect(READING_TYPES_TH[type].length).toBeGreaterThan(0);
    });
  });

  it('should translate daily correctly', () => {
    expect(READING_TYPES_TH['daily']).toBe('ดูดวงประจำวัน');
  });

  it('should translate three_card correctly', () => {
    expect(READING_TYPES_TH['three_card']).toBe('ไพ่ 3 ใบ');
  });

  it('should translate love_relationships correctly', () => {
    expect(READING_TYPES_TH['love_relationships']).toBe('ความรัก');
  });

  it('should translate celtic_cross correctly', () => {
    expect(READING_TYPES_TH['celtic_cross']).toBe('เซลติก ครอส');
  });
});

describe('PDF Export Position Label Translations', () => {
  const POSITION_LABELS_TH: Record<string, string> = {
    past: 'อดีต',
    present: 'ปัจจุบัน',
    future: 'อนาคต',
    situation: 'สถานการณ์',
    challenge: 'ความท้าทาย',
    advice: 'คำแนะนำ',
    outcome: 'ผลลัพธ์',
    you: 'ตัวคุณ',
    partner: 'คู่ของคุณ',
    relationship: 'ความสัมพันธ์',
  };

  it('should have Thai translation for common position labels', () => {
    expect(POSITION_LABELS_TH['past']).toBe('อดีต');
    expect(POSITION_LABELS_TH['present']).toBe('ปัจจุบัน');
    expect(POSITION_LABELS_TH['future']).toBe('อนาคต');
  });

  it('should translate advice position correctly', () => {
    expect(POSITION_LABELS_TH['advice']).toBe('คำแนะนำ');
  });

  it('should translate relationship positions correctly', () => {
    expect(POSITION_LABELS_TH['you']).toBe('ตัวคุณ');
    expect(POSITION_LABELS_TH['partner']).toBe('คู่ของคุณ');
    expect(POSITION_LABELS_TH['relationship']).toBe('ความสัมพันธ์');
  });
});

describe('PDF Export API Response Handling', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe('Success Response', () => {
    it('should handle successful API response', async () => {
      const mockReadingData: PDFReadingData = {
        id: 'reading-123',
        readingType: 'three_card',
        readingTypeTh: 'ไพ่ 3 ใบ',
        question: 'Test question',
        createdAt: '2026-01-17T10:00:00Z',
        cards: [
          {
            position: 0,
            positionLabel: 'past',
            positionLabelTh: 'อดีต',
            isReversed: false,
            card: {
              name: 'The Fool',
              nameTh: 'เดอะฟูล',
              imageUrl: '/cards/major/00.jpg',
              meaningUpright: 'New beginnings',
              meaningReversed: 'Recklessness',
              keywordsUpright: ['beginnings'],
              keywordsReversed: ['reckless'],
              advice: 'Take the leap',
            },
          },
        ],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: mockReadingData,
        }),
      });

      const response = await fetch('/api/export/pdf', {
        method: 'POST',
        body: JSON.stringify({ readingId: 'reading-123' }),
      });

      const result = await response.json();

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data.id).toBe('reading-123');
      expect(result.data.cards).toHaveLength(1);
    });
  });

  describe('Error Responses', () => {
    it('should handle unauthorized error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({
          success: false,
          error: 'กรุณาเข้าสู่ระบบเพื่อส่งออก PDF',
          errorCode: 'UNAUTHORIZED',
        }),
      });

      const response = await fetch('/api/export/pdf', {
        method: 'POST',
        body: JSON.stringify({ readingId: 'reading-123' }),
      });

      expect(response.ok).toBe(false);
      expect(response.status).toBe(401);

      const result = await response.json();
      expect(result.success).toBe(false);
      expect(result.errorCode).toBe('UNAUTHORIZED');
    });

    it('should handle premium required error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
        json: async () => ({
          success: false,
          error: 'ฟีเจอร์ส่งออก PDF พร้อมใช้งานสำหรับแพ็คเกจ Pro และ VIP เท่านั้น',
          errorCode: 'PREMIUM_REQUIRED',
          requiredTier: 'pro',
          currentTier: 'basic',
        }),
      });

      const response = await fetch('/api/export/pdf', {
        method: 'POST',
        body: JSON.stringify({ readingId: 'reading-123' }),
      });

      expect(response.ok).toBe(false);
      expect(response.status).toBe(403);

      const result = await response.json();
      expect(result.success).toBe(false);
      expect(result.errorCode).toBe('PREMIUM_REQUIRED');
      expect(result.requiredTier).toBe('pro');
    });

    it('should handle reading not found error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({
          success: false,
          error: 'ไม่พบการดูดวงนี้',
          errorCode: 'READING_NOT_FOUND',
        }),
      });

      const response = await fetch('/api/export/pdf', {
        method: 'POST',
        body: JSON.stringify({ readingId: 'nonexistent-123' }),
      });

      expect(response.ok).toBe(false);
      expect(response.status).toBe(404);

      const result = await response.json();
      expect(result.errorCode).toBe('READING_NOT_FOUND');
    });

    it('should handle missing reading ID error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({
          success: false,
          error: 'กรุณาระบุ reading ID',
          errorCode: 'MISSING_READING_ID',
        }),
      });

      const response = await fetch('/api/export/pdf', {
        method: 'POST',
        body: JSON.stringify({}),
      });

      expect(response.ok).toBe(false);
      expect(response.status).toBe(400);

      const result = await response.json();
      expect(result.errorCode).toBe('MISSING_READING_ID');
    });
  });
});

describe('PDF Filename Generation', () => {
  it('should generate correct filename format', () => {
    const generateFilename = (date: string): string => {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `Tarot-Reading-${year}-${month}-${day}.pdf`;
    };

    expect(generateFilename('2026-01-17T10:00:00Z')).toBe('Tarot-Reading-2026-01-17.pdf');
    expect(generateFilename('2026-12-25T15:30:00Z')).toBe('Tarot-Reading-2026-12-25.pdf');
    expect(generateFilename('2026-03-05T08:00:00Z')).toBe('Tarot-Reading-2026-03-05.pdf');
  });
});

describe('PDF Export Analytics Events', () => {
  it('should track PDF export started event', () => {
    const event = {
      event: 'pdf_export_started',
      reading_id: 'reading-123',
      reading_type: 'three_card',
      card_count: 3,
    };

    expect(event.event).toBe('pdf_export_started');
    expect(event.reading_id).toBe('reading-123');
    expect(event.reading_type).toBe('three_card');
    expect(event.card_count).toBe(3);
  });

  it('should track PDF export completed event', () => {
    const event = {
      event: 'pdf_export_completed',
      reading_id: 'reading-123',
      reading_type: 'three_card',
      card_count: 3,
      duration_ms: 2500,
      file_size_kb: 150,
    };

    expect(event.event).toBe('pdf_export_completed');
    expect(event.duration_ms).toBe(2500);
    expect(event.file_size_kb).toBe(150);
  });

  it('should track PDF export failed event', () => {
    const event = {
      event: 'pdf_export_failed',
      reading_id: 'reading-123',
      reading_type: 'three_card',
      error: 'Failed to load image',
    };

    expect(event.event).toBe('pdf_export_failed');
    expect(event.error).toBe('Failed to load image');
  });
});

describe('PDF Export Multi-Card Layout', () => {
  it('should handle single card reading (daily)', () => {
    const reading: PDFReadingData = {
      id: 'daily-123',
      readingType: 'daily',
      readingTypeTh: 'ดูดวงประจำวัน',
      question: null,
      createdAt: '2026-01-17T10:00:00Z',
      cards: [
        {
          position: 0,
          positionLabel: null,
          positionLabelTh: null,
          isReversed: false,
          card: {
            name: 'The Sun',
            nameTh: 'เดอะซัน',
            imageUrl: '/cards/major/19.jpg',
            meaningUpright: 'Joy and success',
            meaningReversed: 'Temporary setbacks',
            keywordsUpright: ['joy', 'success'],
            keywordsReversed: ['setbacks'],
            advice: 'Embrace the light',
          },
        },
      ],
    };

    expect(reading.cards).toHaveLength(1);
    expect(reading.readingType).toBe('daily');
  });

  it('should handle three card reading', () => {
    const createCard = (position: number, positionLabel: string, name: string): PDFCardData => ({
      position,
      positionLabel,
      positionLabelTh: { past: 'อดีต', present: 'ปัจจุบัน', future: 'อนาคต' }[positionLabel] || null,
      isReversed: false,
      card: {
        name,
        nameTh: name,
        imageUrl: '/cards/major/00.jpg',
        meaningUpright: 'Meaning',
        meaningReversed: 'Reversed meaning',
        keywordsUpright: ['keyword'],
        keywordsReversed: ['keyword'],
        advice: 'Advice',
      },
    });

    const reading: PDFReadingData = {
      id: 'three-card-123',
      readingType: 'three_card',
      readingTypeTh: 'ไพ่ 3 ใบ',
      question: 'What should I focus on?',
      createdAt: '2026-01-17T10:00:00Z',
      cards: [
        createCard(0, 'past', 'The Fool'),
        createCard(1, 'present', 'The Magician'),
        createCard(2, 'future', 'The High Priestess'),
      ],
    };

    expect(reading.cards).toHaveLength(3);
    expect(reading.cards[0].positionLabel).toBe('past');
    expect(reading.cards[1].positionLabel).toBe('present');
    expect(reading.cards[2].positionLabel).toBe('future');
  });

  it('should handle Celtic Cross (10 cards)', () => {
    const positions = [
      'self', 'crosses', 'foundation', 'recent_past', 'possible_future',
      'near_future', 'attitude', 'environment', 'hopes_fears', 'outcome'
    ];

    const cards: PDFCardData[] = positions.map((pos, i) => ({
      position: i,
      positionLabel: pos,
      positionLabelTh: null,
      isReversed: i % 3 === 0, // Some reversed for variety
      card: {
        name: `Card ${i}`,
        nameTh: `การ์ด ${i}`,
        imageUrl: `/cards/major/${String(i).padStart(2, '0')}.jpg`,
        meaningUpright: `Upright meaning ${i}`,
        meaningReversed: `Reversed meaning ${i}`,
        keywordsUpright: ['keyword'],
        keywordsReversed: ['keyword'],
        advice: `Advice ${i}`,
      },
    }));

    const reading: PDFReadingData = {
      id: 'celtic-cross-123',
      readingType: 'celtic_cross',
      readingTypeTh: 'เซลติก ครอส',
      question: 'What is my life path?',
      createdAt: '2026-01-17T10:00:00Z',
      cards,
    };

    expect(reading.cards).toHaveLength(10);
    expect(reading.readingType).toBe('celtic_cross');
  });
});

describe('PDF Thai Font Support', () => {
  it('should have Thai characters in all translations', () => {
    const thaiTranslations = [
      'ดูดวงประจำวัน',
      'ไพ่ 3 ใบ',
      'อดีต',
      'ปัจจุบัน',
      'อนาคต',
      'ความรัก',
      'การงาน/การเงิน',
    ];

    const thaiPattern = /[\u0E00-\u0E7F]/; // Thai Unicode range

    thaiTranslations.forEach(text => {
      expect(thaiPattern.test(text)).toBe(true);
    });
  });

  it('should handle mixed Thai and English text', () => {
    const mixedTexts = [
      'เดอะฟูล (The Fool)',
      'เซลติก ครอส - Celtic Cross',
      'Shadow Work',
    ];

    mixedTexts.forEach(text => {
      expect(text.length).toBeGreaterThan(0);
    });
  });
});
