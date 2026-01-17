/**
 * Reading Comparison API Route
 * VIP-only endpoint for comparing two readings (Story 9.4)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { getUserTier } from '@/lib/subscription/helpers';
import type { ComparisonResponse, ReadingComparison, ComparisonReading } from '@/lib/patterns/types';

const SPREAD_NAMES_TH: Record<string, string> = {
  daily: 'ไพ่รายวัน',
  three_card: 'ไพ่ 3 ใบ',
  love_relationships: 'ความรัก',
  career_money: 'การงาน-การเงิน',
  yes_no: 'ใช่/ไม่ใช่',
  celtic_cross: 'Celtic Cross',
  decision_making: 'การตัดสินใจ',
  self_discovery: 'ค้นหาตัวเอง',
  relationship_deep_dive: 'ความสัมพันธ์เชิงลึก',
  chakra_alignment: 'จักระ',
  shadow_work: 'Shadow Work',
  friendship: 'มิตรภาพ',
  career_path: 'เส้นทางอาชีพ',
  financial_abundance: 'ความมั่งคั่ง',
  past_life: 'ชาติก่อน',
  dream_interpretation: 'ทำนายฝัน',
  moon_phases: 'ข้างขึ้น-ข้างแรม',
  elemental_balance: 'ธาตุสมดุล',
  soul_purpose: 'จุดประสงค์ชีวิต',
  karma_lessons: 'บทเรียนกรรม',
};

export async function GET(request: NextRequest): Promise<NextResponse<ComparisonResponse>> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const reading1Id = searchParams.get('reading1');
    const reading2Id = searchParams.get('reading2');
    
    if (!reading1Id || !reading2Id) {
      return NextResponse.json({
        success: false,
        error: 'กรุณาเลือก 2 การ์ดเพื่อเปรียบเทียบ',
      }, { status: 400 });
    }
    
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
    
    // Fetch both readings
    const [reading1, reading2] = await Promise.all([
      prisma.reading.findFirst({
        where: { id: reading1Id, user_id: user.id },
        include: {
          reading_cards: {
            include: {
              card: true,
            },
            orderBy: { position: 'asc' },
          },
        },
      }),
      prisma.reading.findFirst({
        where: { id: reading2Id, user_id: user.id },
        include: {
          reading_cards: {
            include: {
              card: true,
            },
            orderBy: { position: 'asc' },
          },
        },
      }),
    ]);
    
    if (!reading1 || !reading2) {
      return NextResponse.json({
        success: false,
        error: 'ไม่พบการดูดวงที่เลือก',
      }, { status: 404 });
    }
    
    // Transform readings
    const transformReading = (r: NonNullable<typeof reading1>): ComparisonReading => ({
      id: r.id,
      createdAt: r.created_at.toISOString(),
      readingType: r.reading_type,
      readingTypeTh: SPREAD_NAMES_TH[r.reading_type] || r.reading_type,
      question: r.question,
      cards: r.reading_cards.map(c => ({
        position: c.position,
        positionLabel: c.position_label,
        isReversed: c.is_reversed,
        card: {
          id: c.card.id,
          name: c.card.name,
          nameTh: c.card.name_th,
          imageUrl: c.card.image_url,
        },
      })),
    });
    
    const r1 = transformReading(reading1);
    const r2 = transformReading(reading2);
    
    // Find common cards
    const cardIds1 = new Set(reading1.reading_cards.map(c => c.card.id));
    const commonCards = reading2.reading_cards
      .filter(c => cardIds1.has(c.card.id))
      .map(c => c.card.id);
    
    // Generate differences
    const differences: string[] = [];
    
    if (reading1.reading_type !== reading2.reading_type) {
      differences.push(`รูปแบบต่างกัน: ${SPREAD_NAMES_TH[reading1.reading_type] || reading1.reading_type} vs ${SPREAD_NAMES_TH[reading2.reading_type] || reading2.reading_type}`);
    }
    
    if (reading1.reading_cards.length !== reading2.reading_cards.length) {
      differences.push(`จำนวนไพ่ต่างกัน: ${reading1.reading_cards.length} vs ${reading2.reading_cards.length}`);
    }
    
    if (commonCards.length > 0) {
      const commonCardNames = reading1.reading_cards
        .filter(c => commonCards.includes(c.card.id))
        .map(c => c.card.name_th);
      differences.push(`ไพ่ที่ซ้ำกัน: ${commonCardNames.join(', ')}`);
    }
    
    const comparison: ReadingComparison = {
      reading1: r1,
      reading2: r2,
      commonCards,
      differences,
    };
    
    return NextResponse.json({
      success: true,
      data: comparison,
    });
    
  } catch (error) {
    console.error('Comparison error:', error);
    return NextResponse.json({
      success: false,
      error: 'เกิดข้อผิดพลาด',
    }, { status: 500 });
  }
}
