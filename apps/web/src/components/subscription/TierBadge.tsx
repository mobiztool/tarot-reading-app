'use client';

/**
 * Tier Badge Component
 * Displays a styled badge for subscription tiers
 */

import { SubscriptionTier } from '@/types/subscription';
import { getTierNameTh } from '@/lib/subscription';

interface TierBadgeProps {
  tier: SubscriptionTier;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
}

export function TierBadge({ tier, size = 'md', showName = false }: TierBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const tierStyles = {
    free: 'bg-gray-200 text-gray-700',
    basic: 'bg-gradient-to-r from-blue-400 to-cyan-500 text-white',
    pro: 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white',
    vip: 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg',
  };

  const tierIcons = {
    free: '✦',
    basic: '★',
    pro: '✪',
    vip: '♛',
  };

  return (
    <span 
      className={`
        inline-flex items-center gap-1 font-semibold rounded-lg
        ${sizeClasses[size]}
        ${tierStyles[tier]}
      `}
    >
      <span>{tierIcons[tier]}</span>
      {showName ? getTierNameTh(tier) : tier.toUpperCase()}
    </span>
  );
}
