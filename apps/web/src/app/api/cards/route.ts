import { NextResponse } from 'next/server';
import type { Card } from '@prisma/client';

export const dynamic = 'force-dynamic';

/**
 * GET /api/cards
 * Fetch all tarot cards from database
 */
export async function GET(): Promise<NextResponse> {
  try {
    // Dynamic import to avoid build-time initialization
    const { prisma } = await import('@/lib/prisma');

    const cards = await prisma.card.findMany({
      orderBy: [{ arcana: 'asc' }, { suit: 'asc' }, { number: 'asc' }],
    });

    // Transform snake_case from Prisma to camelCase for frontend
    const transformedCards = cards.map((card: Card) => ({
      id: card.id,
      slug: card.slug,
      name: card.name,
      nameTh: card.name_th,
      number: card.number,
      suit: card.suit === 'major_arcana' ? 'major' : card.suit.toLowerCase(),
      arcana: card.arcana.toLowerCase(),
      imageUrl:
        card.image_url ||
        `/cards/${card.suit.toLowerCase()}/${card.number.toString().padStart(2, '0')}.webp`,
      keywords: card.keywords_upright,
      keywordsTh: card.keywords_upright, // Uses same keywords for now
      meaningUpright: card.meaning_upright,
      meaningReversed: card.meaning_reversed,
      advice: card.advice,
    }));

    return NextResponse.json({
      success: true,
      data: transformedCards,
      count: transformedCards.length,
    });
  } catch (error) {
    console.error('Error fetching cards:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch cards',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
