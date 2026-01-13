import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

describe('Database CRUD Operations', () => {
  beforeAll(async () => {
    // Ensure database is connected
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  afterEach(async () => {
    // Clean up test readings (keep cards)
    await prisma.reading.deleteMany();
  });

  describe('Card Queries', () => {
    it('should fetch all 78 cards', async () => {
      const cards = await prisma.card.findMany();
      expect(cards).toHaveLength(78);
    });

    it('should find card by slug', async () => {
      const card = await prisma.card.findUnique({
        where: { slug: 'the-fool' },
      });
      expect(card).toBeDefined();
      expect(card?.name).toBe('The Fool');
      expect(card?.name_th).toBe('คนบ้า');
    });

    it('should filter cards by suit', async () => {
      const wandsCards = await prisma.card.findMany({
        where: { suit: 'wands' },
      });
      expect(wandsCards).toHaveLength(14);
    });

    it('should filter cards by arcana', async () => {
      const majorCards = await prisma.card.findMany({
        where: { arcana: 'major' },
      });
      expect(majorCards).toHaveLength(22);
    });
  });

  describe('Reading Creation', () => {
    it('should create anonymous daily reading', async () => {
      const reading = await prisma.reading.create({
        data: {
          reading_type: 'daily',
          user_id: null,
        },
      });
      expect(reading.user_id).toBeNull();
      expect(reading.reading_type).toBe('daily');
      expect(reading.is_favorite).toBe(false);
    });

    it('should create three-card reading with cards', async () => {
      const cards = await prisma.card.findMany({ take: 3 });

      const reading = await prisma.reading.create({
        data: {
          reading_type: 'three_card',
          question: 'What does the future hold?',
          reading_cards: {
            create: cards.map((card, index) => ({
              card_id: card.id,
              position: index,
              position_label: ['past', 'present', 'future'][index] as 'past' | 'present' | 'future',
              is_reversed: Math.random() > 0.5,
            })),
          },
        },
        include: {
          reading_cards: {
            include: { card: true },
          },
        },
      });

      expect(reading.reading_cards).toHaveLength(3);
      expect(reading.question).toBe('What does the future hold?');
    });
  });

  describe('Reading Retrieval', () => {
    it('should fetch reading with cards', async () => {
      // Create a test reading first
      const cards = await prisma.card.findMany({ take: 1 });
      const created = await prisma.reading.create({
        data: {
          reading_type: 'daily',
          reading_cards: {
            create: {
              card_id: cards[0].id,
              position: 0,
              is_reversed: false,
            },
          },
        },
      });

      // Fetch it with cards included
      const reading = await prisma.reading.findUnique({
        where: { id: created.id },
        include: {
          reading_cards: {
            include: { card: true },
          },
        },
      });

      expect(reading).toBeDefined();
      expect(reading?.reading_cards).toHaveLength(1);
      expect(reading?.reading_cards[0].card).toBeDefined();
    });
  });

  describe('Update Operations', () => {
    it('should update reading is_favorite', async () => {
      const reading = await prisma.reading.create({
        data: { reading_type: 'daily' },
      });

      const updated = await prisma.reading.update({
        where: { id: reading.id },
        data: { is_favorite: true },
      });

      expect(updated.is_favorite).toBe(true);
    });

    it('should update reading notes', async () => {
      const reading = await prisma.reading.create({
        data: { reading_type: 'daily' },
      });

      const updated = await prisma.reading.update({
        where: { id: reading.id },
        data: { notes: 'This reading resonated with me' },
      });

      expect(updated.notes).toBe('This reading resonated with me');
    });
  });

  describe('Delete Operations', () => {
    it('should delete reading and cascade to reading_cards', async () => {
      const cards = await prisma.card.findMany({ take: 1 });
      const reading = await prisma.reading.create({
        data: {
          reading_type: 'daily',
          reading_cards: {
            create: {
              card_id: cards[0].id,
              position: 0,
              is_reversed: false,
            },
          },
        },
      });

      // Delete reading
      await prisma.reading.delete({
        where: { id: reading.id },
      });

      // Verify reading_cards were cascade deleted
      const readingCards = await prisma.readingCard.findMany({
        where: { reading_id: reading.id },
      });
      expect(readingCards).toHaveLength(0);
    });
  });
});
