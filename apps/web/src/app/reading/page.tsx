/**
 * Reading Selection Page
 * Displays all spread types with tier-based locking
 * Story 6.3: Feature Gating by Subscription Tier (AC: 4, 8)
 * Story 7.8: Spread Recommendation Engine
 */

import Link from 'next/link';
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { SpreadCard } from '@/components/spreads';
import { ReadingPageClient } from './ReadingPageClient';
import { 
  SPREAD_INFO, 
  getUserTier, 
  getReadingLimitInfo,
  getLimitMessage,
  type SpreadType 
} from '@/lib/access-control';
import { SUBSCRIPTION_TIERS } from '@/lib/subscription/tiers';
import { SubscriptionTier } from '@/types/subscription';

export const metadata: Metadata = {
  title: 'เลือกรูปแบบการดูดวง - ดูดวงไพ่ยิปซี',
  description:
    'เลือกรูปแบบการดูดวงไพ่ยิปซี: มีให้เลือกถึง 18 รูปแบบ ตั้งแต่ไพ่ประจำวันถึง Celtic Cross',
};

// Group spreads by tier
const SPREAD_GROUPS: { tier: SubscriptionTier; title: string; spreads: SpreadType[] }[] = [
  {
    tier: 'free',
    title: 'ฟรี',
    spreads: ['daily', 'three_card'],
  },
  {
    tier: 'basic',
    title: 'Basic',
    spreads: ['love_relationships', 'career_money', 'yes_no'],
  },
  {
    tier: 'pro',
    title: 'Pro',
    spreads: ['celtic_cross', 'decision_making', 'self_discovery', 'relationship_deep_dive', 'chakra_alignment'],
  },
  {
    tier: 'vip',
    title: 'VIP',
    spreads: ['shadow_work', 'past_life', 'dream_interpretation', 'moon_phases', 'elemental_balance', 'soul_purpose', 'karma_lessons', 'manifestation'],
  },
];

export default async function ReadingSelectionPage() {
  // Get current user
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // Get user's tier
  const currentTier: SubscriptionTier = user ? await getUserTier(user.id) : 'free';
  const tierConfig = SUBSCRIPTION_TIERS[currentTier];
  
  // Get reading limit info
  const limitInfo = await getReadingLimitInfo(user?.id || null);

  // Tier order for checking access
  const tierOrder: Record<SubscriptionTier, number> = {
    free: 0,
    basic: 1,
    pro: 2,
    vip: 3,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-900 to-indigo-950 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            เลือกรูปแบบการดูดวง
          </h1>
          <p className="text-purple-200 text-lg max-w-xl mx-auto">
            เลือกรูปแบบที่เหมาะกับคำถามของคุณ แล้วปล่อยให้ไพ่ยิปซีเผยคำตอบ
          </p>
        </div>

        {/* Story 7.8: Spread Recommendations Section */}
        <ReadingPageClient userTier={currentTier} />

        {/* User Tier & Limit Info */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {/* Current Tier */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-purple-500/30">
            <span className="text-purple-200 text-sm">แพ็คเกจ:</span>
            <span className={`font-semibold ${
              currentTier === 'vip' ? 'text-yellow-400' :
              currentTier === 'pro' ? 'text-purple-300' :
              currentTier === 'basic' ? 'text-blue-300' :
              'text-gray-300'
            }`}>
              {tierConfig.nameTh}
                </span>
              </div>

          {/* Reading Limit */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-purple-500/30">
            <span className="text-purple-200 text-sm">
              {getLimitMessage(limitInfo.remaining, limitInfo.isUnlimited)}
                </span>
              </div>

          {/* Upgrade Button for non-VIP */}
          {currentTier !== 'vip' && (
          <Link
              href="/pricing"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white text-sm font-medium hover:from-purple-600 hover:to-pink-600 transition-all"
                  >
              <span>✨</span>
              <span>อัปเกรดเพื่อปลดล็อกเพิ่ม</span>
          </Link>
          )}
            </div>

        {/* Spread Groups */}
        {SPREAD_GROUPS.map((group) => {
          const isLocked = tierOrder[currentTier] < tierOrder[group.tier];
          
          return (
            <div key={group.tier} id={group.tier} className="mb-12 scroll-mt-20">
              {/* Group Header */}
              <div className="flex items-center gap-3 mb-6">
                <h2 className={`text-xl font-semibold ${
                  group.tier === 'vip' ? 'text-yellow-400' :
                  group.tier === 'pro' ? 'text-purple-300' :
                  group.tier === 'basic' ? 'text-blue-300' :
                  'text-white'
                }`}>
                  {group.title === 'ฟรี' ? '🆓 รูปแบบฟรี' : 
                   group.title === 'Basic' ? '💎 Basic' :
                   group.title === 'Pro' ? '⭐ Pro' :
                   '👑 VIP'}
                </h2>
                
                {isLocked && (
                  <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-purple-300">
                    🔒 ต้องอัปเกรด
                </span>
                )}
                
                <div className="flex-1 h-px bg-purple-500/30"></div>

                <span className="text-purple-400 text-sm">
                  {group.spreads.length} รูปแบบ
                </span>
              </div>

              {/* Spread Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {group.spreads.map((spreadType) => {
                  const spread = SPREAD_INFO[spreadType];
                  if (!spread) return null;

                  const locked = tierOrder[currentTier] < tierOrder[spread.minimumTier];

                  return (
                    <SpreadCard
                      key={spread.id}
                      spread={spread}
                      locked={locked}
                      currentTier={currentTier}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Back link */}
        <div className="text-center mt-12">
          <Link
            href="/"
            className="text-purple-300 hover:text-white transition-colors inline-flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            กลับหน้าแรก
          </Link>
        </div>
      </div>
    </div>
  );
}
