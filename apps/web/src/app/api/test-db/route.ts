import { NextResponse } from 'next/server';

// Mark as dynamic to skip pre-rendering during build
export const dynamic = 'force-dynamic';

export async function GET(): Promise<NextResponse> {
  try {
    // Dynamic import to avoid build-time initialization
    const { prisma } = await import('@/lib/prisma');

    // Test database connection
    const cardCount = await prisma.card.count();
    const firstCard = await prisma.card.findFirst();

    // Test reading creation
    const testReading = await prisma.reading.findFirst();

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      data: {
        totalCards: cardCount,
        expectedCards: 78,
        firstCard: firstCard
          ? {
              name: firstCard.name,
              name_th: firstCard.name_th,
              slug: firstCard.slug,
            }
          : null,
        hasReadings: testReading !== null,
      },
    });
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Database connection failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
