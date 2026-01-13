'use client';

/**
 * Spread Card Component
 * Displays a spread with locked/unlocked state and tier badge
 * Story 6.3: Feature Gating by Subscription Tier (AC: 4, 8)
 */

import { useRouter } from 'next/navigation';
import { SubscriptionTier } from '@/types/subscription';
import { SpreadInfo } from '@/lib/access-control';
import { SUBSCRIPTION_TIERS } from '@/lib/subscription/tiers';

interface SpreadCardProps {
  spread: SpreadInfo;
  locked: boolean;
  currentTier: SubscriptionTier;
}

export function SpreadCard({ spread, locked, currentTier }: SpreadCardProps) {
  const router = useRouter();

  const handleClick = () => {
    if (locked) {
      // Navigate to gate page
      router.push(`/gate/premium?spread=${spread.id}&tier=${spread.minimumTier}`);
    } else {
      // Navigate to spread using the predefined route
      router.push(spread.route);
    }
  };

  const tierColors: Record<SubscriptionTier, string> = {
    free: 'bg-gray-500',
    basic: 'bg-blue-500',
    pro: 'bg-purple-500',
    vip: 'bg-gradient-to-r from-yellow-400 to-orange-500',
  };

  return (
    <button
      onClick={handleClick}
      className={`relative w-full text-left rounded-2xl p-6 transition-all duration-300 border
        ${locked 
          ? 'bg-white/5 border-purple-500/20 hover:bg-white/10' 
          : 'bg-white/10 border-purple-500/30 hover:bg-white/15 hover:scale-[1.02]'}
      `}
    >
      {/* Tier Badge */}
      {spread.minimumTier !== 'free' && (
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold text-white ${tierColors[spread.minimumTier]}`}>
            {SUBSCRIPTION_TIERS[spread.minimumTier].nameTh}
          </span>
        </div>
      )}

      {/* Lock Icon Overlay */}
      {locked && (
        <div className="absolute top-3 left-3">
          <div className="w-8 h-8 bg-black/50 rounded-full flex items-center justify-center">
            <span className="text-lg">🔒</span>
          </div>
        </div>
      )}

      {/* Icon */}
      <div className={`text-4xl mb-4 ${locked ? 'opacity-50' : ''}`}>
        {spread.icon}
      </div>

      {/* Title */}
      <h3 className={`text-lg font-semibold mb-1 ${locked ? 'text-purple-300' : 'text-white'}`}>
        {spread.nameTh}
      </h3>

      {/* Description */}
      <p className={`text-sm mb-3 ${locked ? 'text-purple-400' : 'text-purple-200'}`}>
        {spread.descriptionTh}
      </p>

      {/* Meta */}
      <div className="flex items-center gap-4 text-xs text-purple-300">
        <span className="flex items-center gap-1">
          <span>🎴</span>
          <span>{spread.cardCount} ใบ</span>
        </span>
        <span className="flex items-center gap-1">
          <span>⏱️</span>
          <span>{spread.estimatedTime}</span>
        </span>
      </div>

      {/* Unlock CTA for locked spreads */}
      {locked && (
        <div className="mt-4 pt-3 border-t border-purple-500/20">
          <span className="text-sm text-purple-300 flex items-center gap-2">
            <span>✨</span>
            <span>อัปเกรดเพื่อปลดล็อก</span>
          </span>
        </div>
      )}
    </button>
  );
}
