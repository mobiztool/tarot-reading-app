/**
 * Story 9.3: Reading Export to PDF (Premium Feature)
 * POST /api/export/pdf
 * 
 * Validates premium access and returns reading data formatted for PDF generation.
 * Actual PDF generation happens client-side for performance.
 * 
 * Access: Pro and VIP tiers only
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { SubscriptionTier } from '@/types/subscription';
import { withRateLimit } from '@/lib/rate-limit';
import type { PDFReadingData, PDFCardData } from '@/lib/pdf/types';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Reading type Thai translations
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

// Position label Thai translations
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
  self: 'ตัวคุณ',
  crosses: 'อุปสรรค',
  foundation: 'รากฐาน',
  recent_past: 'อดีตใกล้',
  possible_future: 'อนาคตที่เป็นไปได้',
  hopes_fears: 'ความหวัง/ความกลัว',
};

/**
 * Get user's current subscription tier
 */
async function getUserTier(userId: string): Promise<SubscriptionTier> {
  const subscription = await prisma.subscription.findFirst({
    where: {
      user_id: userId,
      status: { in: ['active', 'trialing'] },
    },
    orderBy: { created_at: 'desc' },
  });

  if (!subscription) {
    return 'free';
  }

  const priceId = subscription.stripe_price_id;
  if (priceId === process.env.STRIPE_PRICE_ID_VIP) {
    return 'vip';
  } else if (priceId === process.env.STRIPE_PRICE_ID_PRO) {
    return 'pro';
  } else if (priceId === process.env.STRIPE_PRICE_ID_BASIC) {
    return 'basic';
  }

  return 'free';
}

/**
 * Check if tier has PDF export access
 * Only Pro and VIP tiers can export PDFs
 */
function canExportPDF(tier: SubscriptionTier): boolean {
  return tier === 'pro' || tier === 'vip';
}

/**
 * POST /api/export/pdf
 * Request body: { readingId: string }
 * Returns: PDFReadingData or error
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  // Rate limiting
  const rateLimitCheck = withRateLimit('api')(request);
  if (!rateLimitCheck.success && rateLimitCheck.response) {
    return rateLimitCheck.response as unknown as NextResponse;
  }

  try {
    // Authenticate user
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'กรุณาเข้าสู่ระบบเพื่อส่งออก PDF',
          errorCode: 'UNAUTHORIZED',
        },
        { status: 401 }
      );
    }

    // Check subscription tier
    const userTier = await getUserTier(user.id);
    
    if (!canExportPDF(userTier)) {
      return NextResponse.json(
        {
          success: false,
          error: 'ฟีเจอร์ส่งออก PDF พร้อมใช้งานสำหรับแพ็คเกจ Pro และ VIP เท่านั้น',
          errorCode: 'PREMIUM_REQUIRED',
          requiredTier: 'pro',
          currentTier: userTier,
        },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { readingId } = body as { readingId: string };

    if (!readingId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'กรุณาระบุ reading ID',
          errorCode: 'MISSING_READING_ID',
        },
        { status: 400 }
      );
    }

    // Fetch reading with cards
    const reading = await prisma.reading.findUnique({
      where: { id: readingId },
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
        { 
          success: false, 
          error: 'ไม่พบการดูดวงนี้',
          errorCode: 'READING_NOT_FOUND',
        },
        { status: 404 }
      );
    }

    // Check ownership (user can only export their own readings)
    if (reading.user_id !== user.id) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'คุณไม่มีสิทธิ์ส่งออกการดูดวงนี้',
          errorCode: 'FORBIDDEN',
        },
        { status: 403 }
      );
    }

    // Transform reading data for PDF generation
    const pdfCards: PDFCardData[] = reading.reading_cards.map((rc) => ({
      position: rc.position,
      positionLabel: rc.position_label,
      positionLabelTh: rc.position_label ? POSITION_LABELS_TH[rc.position_label] || rc.position_label : null,
      isReversed: rc.is_reversed,
      card: {
        name: rc.card.name,
        nameTh: rc.card.name_th,
        imageUrl: rc.card.image_url,
        meaningUpright: rc.card.meaning_upright,
        meaningReversed: rc.card.meaning_reversed,
        keywordsUpright: rc.card.keywords_upright as string[],
        keywordsReversed: rc.card.keywords_reversed as string[],
        advice: rc.card.advice,
      },
    }));

    const pdfReadingData: PDFReadingData = {
      id: reading.id,
      readingType: reading.reading_type,
      readingTypeTh: READING_TYPES_TH[reading.reading_type] || reading.reading_type,
      question: reading.question,
      createdAt: reading.created_at.toISOString(),
      cards: pdfCards,
      notes: reading.notes,
    };

    // Log export event for analytics (server-side tracking)
    console.log('[PDF Export] Export requested:', {
      userId: user.id,
      readingId: reading.id,
      readingType: reading.reading_type,
      cardCount: reading.reading_cards.length,
      tier: userTier,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      data: pdfReadingData,
    });
  } catch (error) {
    console.error('[PDF Export API] Error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'เกิดข้อผิดพลาดในการเตรียมข้อมูล PDF',
        errorCode: 'INTERNAL_ERROR',
      },
      { status: 500 }
    );
  }
}
