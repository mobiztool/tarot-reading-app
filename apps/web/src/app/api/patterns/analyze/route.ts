/**
 * Pattern Analysis API Route
 * VIP-only endpoint for reading pattern analysis (Story 9.4)
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { getUserTier } from '@/lib/subscription/helpers';
import { analyzePatterns, MINIMUM_READINGS } from '@/lib/patterns/analyzer';
import type { PatternAnalysisResponse } from '@/lib/patterns/types';

export async function GET(): Promise<NextResponse<PatternAnalysisResponse>> {
  try {
    // Check authentication
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({
        success: false,
        error: 'กรุณาเข้าสู่ระบบ',
      }, { status: 401 });
    }
    
    // Check VIP tier
    const tier = await getUserTier(user.id);
    if (tier !== 'vip') {
      return NextResponse.json({
        success: false,
        error: 'ฟีเจอร์นี้สำหรับสมาชิก VIP เท่านั้น',
      }, { status: 403 });
    }
    
    // Fetch user's readings with cards
    const readings = await prisma.reading.findMany({
      where: {
        user_id: user.id,
      },
      include: {
        reading_cards: {
          include: {
            card: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });
    
    // Check minimum readings
    if (readings.length < MINIMUM_READINGS) {
      return NextResponse.json({
        success: true,
        data: {
          userId: user.id,
          analyzedAt: new Date().toISOString(),
          readingCount: readings.length,
          sufficientData: false,
          minimumReadingsRequired: MINIMUM_READINGS,
          frequentCards: [],
          themes: [],
          timePatterns: [],
          dayPatterns: [],
          monthlyReadings: [],
          spreadUsage: [],
          insights: [],
        },
      });
    }
    
    // Transform readings for analysis
    const readingsData = readings.map(r => ({
      id: r.id,
      createdAt: new Date(r.created_at),
      readingType: r.reading_type,
      question: r.question,
      cards: r.reading_cards.map(c => ({
        cardId: c.card_id,
        isReversed: c.is_reversed,
        card: {
          id: c.card.id,
          name: c.card.name,
          nameTh: c.card.name_th,
          imageUrl: c.card.image_url,
        },
      })),
    })) as {
      id: string;
      createdAt: Date;
      readingType: string;
      question: string | null;
      cards: {
        cardId: string;
        isReversed: boolean;
        card: {
          id: string;
          name: string;
          nameTh: string;
          imageUrl: string;
        };
      }[];
    }[];
    
    // Analyze patterns
    const analysis = analyzePatterns(user.id, readingsData);
    
    return NextResponse.json({
      success: true,
      data: analysis,
    });
    
  } catch (error) {
    console.error('Pattern analysis error:', error);
    return NextResponse.json({
      success: false,
      error: 'เกิดข้อผิดพลาดในการวิเคราะห์',
    }, { status: 500 });
  }
}
