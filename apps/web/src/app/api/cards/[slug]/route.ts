import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * GET /api/cards/[slug]
 * Fetch a single card by slug
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
): Promise<NextResponse> {
  try {
    const { slug } = await params;

    const { prisma } = await import('@/lib/prisma');

    const card = await prisma.card.findFirst({
      where: {
        slug: slug,
      },
    });

    if (!card) {
      return NextResponse.json(
        { success: false, error: 'Card not found' },
        { status: 404 }
      );
    }

    // Transform to frontend format
    const transformedCard = {
      id: card.id,
      name: card.name,
      nameTh: card.name_th,
      slug: card.slug,
      arcana: card.arcana,
      suit: card.suit,
      number: card.number,
      element: card.element,
      imageUrl: card.image_url.startsWith('http')
        ? card.image_url
        : `/cards/${card.slug}.jpg`,
      meaningUpright: card.meaning_upright,
      meaningReversed: card.meaning_reversed,
      keywordsUpright: card.keywords_upright,
      keywordsReversed: card.keywords_reversed,
      advice: card.advice,
      symbolism: card.symbolism,
    };

    return NextResponse.json({ success: true, data: transformedCard });
  } catch (error) {
    console.error('Error fetching card:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch card',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}


