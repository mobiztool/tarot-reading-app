import { NextRequest, NextResponse } from 'next/server';
import { withRateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

/**
 * GET /api/readings/[id]
 * Get a specific reading by ID with all card details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const rateLimitCheck = withRateLimit('api')(request);
  if (!rateLimitCheck.success && rateLimitCheck.response) {
    return rateLimitCheck.response as unknown as NextResponse;
  }

  try {
    const { prisma } = await import('@/lib/prisma');
    const { id } = await params;

    const reading = await prisma.reading.findUnique({
      where: { id },
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

    if (!reading) {
      return NextResponse.json(
        { success: false, error: 'Reading not found' },
        { status: 404 }
      );
    }

    // Transform the response
    const transformedReading = {
      id: reading.id,
      userId: reading.user_id,
      readingType: reading.reading_type,
      question: reading.question,
      createdAt: reading.created_at,
      updatedAt: reading.updated_at,
      isFavorite: reading.is_favorite,
      notes: reading.notes,
      cards: reading.reading_cards.map((rc) => ({
        position: rc.position,
        positionLabel: rc.position_label,
        isReversed: rc.is_reversed,
        card: {
          id: rc.card.id,
          name: rc.card.name,
          nameTh: rc.card.name_th,
          slug: rc.card.slug,
          imageUrl: rc.card.image_url,
          meaningUpright: rc.card.meaning_upright,
          meaningReversed: rc.card.meaning_reversed,
          keywordsUpright: rc.card.keywords_upright,
          keywordsReversed: rc.card.keywords_reversed,
          advice: rc.card.advice,
        },
      })),
    };

    return NextResponse.json({
      success: true,
      data: transformedReading,
    });
  } catch (error) {
    console.error('Error fetching reading:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reading' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/readings/[id]
 * Update reading properties (favorite, notes, question)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const rateLimitCheck = withRateLimit('api')(request);
  if (!rateLimitCheck.success && rateLimitCheck.response) {
    return rateLimitCheck.response as unknown as NextResponse;
  }

  try {
    const { prisma } = await import('@/lib/prisma');
    const { id } = await params;
    const body = await request.json();

    // Build update data
    const updateData: {
      is_favorite?: boolean;
      notes?: string | null;
      question?: string | null;
    } = {};

    if (typeof body.isFavorite === 'boolean') {
      updateData.is_favorite = body.isFavorite;
    }
    if (body.notes !== undefined) {
      updateData.notes = body.notes;
    }
    if (body.question !== undefined) {
      updateData.question = body.question;
    }

    const reading = await prisma.reading.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      data: {
        id: reading.id,
        isFavorite: reading.is_favorite,
        notes: reading.notes,
        question: reading.question,
      },
    });
  } catch (error) {
    console.error('Error updating reading:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update reading' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/readings/[id]
 * Delete a reading
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const rateLimitCheck = withRateLimit('api')(request);
  if (!rateLimitCheck.success && rateLimitCheck.response) {
    return rateLimitCheck.response as unknown as NextResponse;
  }

  try {
    const { prisma } = await import('@/lib/prisma');
    const { id } = await params;

    // First delete related reading_cards (cascade should handle this, but just in case)
    await prisma.readingCard.deleteMany({
      where: { reading_id: id },
    });

    // Then delete the reading
    await prisma.reading.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Reading deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting reading:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete reading' },
      { status: 500 }
    );
  }
}
