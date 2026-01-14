import { NextRequest, NextResponse } from 'next/server';
import type { Reading, ReadingCard, Card, Prisma, ReadingType } from '@prisma/client';
import { withRateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

// Type for reading with cards included
type ReadingWithCards = Reading & {
  reading_cards: (ReadingCard & { card: Card })[];
};

interface SaveReadingCard {
  cardId: string;
  position: number;
  positionLabel?: string;
  isReversed: boolean;
}

interface SaveReadingRequest {
  readingType: string;
  question?: string;
  optionA?: string; // For Decision Making spread
  optionB?: string; // For Decision Making spread
  cards: SaveReadingCard[];
  userId?: string;
  sessionId?: string;
}

/**
 * POST /api/readings
 * Save a new reading to the database
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  // Rate limiting
  const rateLimitCheck = withRateLimit('reading')(request);
  if (!rateLimitCheck.success && rateLimitCheck.response) {
    return rateLimitCheck.response as unknown as NextResponse;
  }

  try {
    // Dynamic import to avoid build-time initialization
    const { prisma } = await import('@/lib/prisma');

    const body: SaveReadingRequest = await request.json();

    // Validate request
    if (!body.readingType || !body.cards || body.cards.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid request: readingType and cards are required' },
        { status: 400 }
      );
    }

    // Validate reading type matches card count
    if (body.readingType === 'daily' && body.cards.length !== 1) {
      return NextResponse.json(
        { success: false, error: 'Daily reading must have exactly 1 card' },
        { status: 400 }
      );
    }

    if (body.readingType === 'three_card' && body.cards.length !== 3) {
      return NextResponse.json(
        { success: false, error: 'Three-card reading must have exactly 3 cards' },
        { status: 400 }
      );
    }

    if (body.readingType === 'love_relationships' && body.cards.length !== 3) {
      return NextResponse.json(
        { success: false, error: 'Love relationships reading must have exactly 3 cards' },
        { status: 400 }
      );
    }

    if (body.readingType === 'career_money' && body.cards.length !== 3) {
      return NextResponse.json(
        { success: false, error: 'Career money reading must have exactly 3 cards' },
        { status: 400 }
      );
    }

    if (body.readingType === 'yes_no' && body.cards.length !== 1) {
      return NextResponse.json(
        { success: false, error: 'Yes/No reading must have exactly 1 card' },
        { status: 400 }
      );
    }

    if (body.readingType === 'celtic_cross' && body.cards.length !== 10) {
      return NextResponse.json(
        { success: false, error: 'Celtic Cross reading must have exactly 10 cards' },
        { status: 400 }
      );
    }

    if (body.readingType === 'decision_making' && body.cards.length !== 5) {
      return NextResponse.json(
        { success: false, error: 'Decision Making reading must have exactly 5 cards' },
        { status: 400 }
      );
    }

    // Create reading with cards in a transaction
    const reading = await prisma.reading.create({
      data: {
        reading_type: body.readingType,
        question: body.question || null,
        option_a: body.optionA || null, // For Decision Making spread
        option_b: body.optionB || null, // For Decision Making spread
        user_id: body.userId || null,
        session_id: body.sessionId || null,
        reading_cards: {
          create: body.cards.map((card) => ({
            card_id: card.cardId,
            position: card.position,
            position_label: card.positionLabel || null,
            is_reversed: card.isReversed,
          })),
        },
      } as Prisma.ReadingCreateInput,
      include: {
        reading_cards: {
          include: {
            card: true,
          },
          orderBy: {
            position: 'asc',
          },
        },
      },
    });

    const readingWithCards = reading as ReadingWithCards;

    return NextResponse.json({
      success: true,
      data: {
        id: readingWithCards.id,
        readingType: readingWithCards.reading_type,
        question: readingWithCards.question,
        createdAt: readingWithCards.created_at,
        cards: readingWithCards.reading_cards.map((rc: ReadingCard & { card: Card }) => ({
          position: rc.position,
          positionLabel: rc.position_label,
          isReversed: rc.is_reversed,
          card: {
            id: rc.card.id,
            name: rc.card.name,
            nameTh: rc.card.name_th,
            slug: rc.card.slug,
          },
        })),
      },
    });
  } catch (error) {
    console.error('Error saving reading:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to save reading',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/readings
 * Get reading history with pagination, filters, and search
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  // Rate limiting
  const rateLimitCheck = withRateLimit('api')(request);
  if (!rateLimitCheck.success && rateLimitCheck.response) {
    return rateLimitCheck.response as unknown as NextResponse;
  }

  try {
    // Dynamic import to avoid build-time initialization
    const { prisma } = await import('@/lib/prisma');

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    const readingType = searchParams.get('type');
    const dateRange = searchParams.get('dateRange') as '7d' | '30d' | 'all' | null;
    const search = searchParams.get('search') || '';
    const userId = searchParams.get('userId') || null;

    // Build where clause
    const where: Prisma.ReadingWhereInput = {};

    if (readingType) {
      where.reading_type = readingType as ReadingType;
    }

    if (userId) {
      where.user_id = userId;
    }

    if (search) {
      where.question = {
        contains: search,
        mode: 'insensitive',
      };
    }

    if (dateRange && dateRange !== 'all') {
      const now = new Date();
      if (dateRange === '7d') {
        where.created_at = {
          gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        };
      } else if (dateRange === '30d') {
        where.created_at = {
          gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        };
      }
    }

    // Get total count for pagination
    const total = await prisma.reading.count({ where });

    const readings = await prisma.reading.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: {
        created_at: 'desc',
      },
      include: {
        reading_cards: {
          include: {
            card: true,
          },
          orderBy: {
            position: 'asc',
          },
        },
      },
    });

    const transformedReadings = readings.map((reading: ReadingWithCards) => ({
      id: reading.id,
      readingType: reading.reading_type,
      question: reading.question,
      createdAt: reading.created_at,
      isFavorite: reading.is_favorite,
      cards: reading.reading_cards.map((rc: ReadingCard & { card: Card }) => ({
        position: rc.position,
        positionLabel: rc.position_label,
        isReversed: rc.is_reversed,
        card: {
          id: rc.card.id,
          name: rc.card.name,
          nameTh: rc.card.name_th,
          slug: rc.card.slug,
          imageUrl: rc.card.image_url,
        },
      })),
    }));

    return NextResponse.json({
      success: true,
      data: transformedReadings,
      count: transformedReadings.length,
      total,
      hasMore: offset + limit < total,
    });
  } catch (error) {
    console.error('Error fetching readings:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch readings',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
