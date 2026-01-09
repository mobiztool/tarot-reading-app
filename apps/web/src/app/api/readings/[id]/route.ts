import { NextRequest, NextResponse } from 'next/server';
import type { Reading, ReadingCard, Card } from '@prisma/client';

export const dynamic = 'force-dynamic';

// Type for reading with cards included
type ReadingWithCards = Reading & {
  reading_cards: (ReadingCard & { card: Card })[];
};

/**
 * GET /api/readings/[id]
 * Get a single reading by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
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

    const typedReading = reading as ReadingWithCards;

    const transformedReading = {
      id: typedReading.id,
      userId: typedReading.user_id,
      readingType: typedReading.reading_type,
      question: typedReading.question,
      createdAt: typedReading.created_at,
      updatedAt: typedReading.updated_at,
      isFavorite: typedReading.is_favorite,
      notes: typedReading.notes,
      cards: typedReading.reading_cards.map((rc) => ({
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
      {
        success: false,
        error: 'Failed to fetch reading',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/readings/[id]
 * Update a reading (notes, is_favorite)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { prisma } = await import('@/lib/prisma');
    const { id } = await params;
    const body = await request.json();

    // Check if reading exists and belongs to user
    const reading = await prisma.reading.findUnique({
      where: { id },
    });

    if (!reading) {
      return NextResponse.json(
        { success: false, error: 'Reading not found' },
        { status: 404 }
      );
    }

    if (reading.user_id !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Build update data
    const updateData: { notes?: string; is_favorite?: boolean; question?: string } = {};

    if (typeof body.notes === 'string') {
      updateData.notes = body.notes.slice(0, 2000); // Limit to 2000 chars
    }

    if (typeof body.is_favorite === 'boolean') {
      updateData.is_favorite = body.is_favorite;
    }

    if (typeof body.question === 'string') {
      updateData.question = body.question.slice(0, 500); // Limit to 500 chars
    }

    // Update reading
    const updatedReading = await prisma.reading.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      data: {
        id: updatedReading.id,
        notes: updatedReading.notes,
        question: updatedReading.question,
        isFavorite: updatedReading.is_favorite,
        updatedAt: updatedReading.updated_at,
      },
    });
  } catch (error) {
    console.error('Error updating reading:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update reading',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/readings/[id]
 * Delete a reading by ID
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { prisma } = await import('@/lib/prisma');
    const { id } = await params;

    // Check if reading exists
    const reading = await prisma.reading.findUnique({
      where: { id },
    });

    if (!reading) {
      return NextResponse.json(
        { success: false, error: 'Reading not found' },
        { status: 404 }
      );
    }

    // Delete the reading (reading_cards will cascade delete)
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
      {
        success: false,
        error: 'Failed to delete reading',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
