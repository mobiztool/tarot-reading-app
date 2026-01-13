'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SubscriptionTier } from '@/types/subscription';

interface SubscriptionBadgeProps {
  size?: 'sm' | 'md';
  showLink?: boolean;
  className?: string;
}

const TIER_CONFIG: Record<SubscriptionTier, {
  label: string;
  labelTh: string;
  emoji: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
}> = {
  free: {
    label: 'Free',
    labelTh: 'ฟรี',
    emoji: '',
    bgColor: 'bg-slate-600/50',
    textColor: 'text-slate-300',
    borderColor: 'border-slate-500/50',
  },
  basic: {
    label: 'Basic',
    labelTh: 'เบสิค',
    emoji: '⭐',
    bgColor: 'bg-blue-600/20',
    textColor: 'text-blue-400',
    borderColor: 'border-blue-500/50',
  },
  pro: {
    label: 'Pro',
    labelTh: 'โปร',
    emoji: '💎',
    bgColor: 'bg-purple-600/20',
    textColor: 'text-purple-400',
    borderColor: 'border-purple-500/50',
  },
  vip: {
    label: 'VIP',
    labelTh: 'วีไอพี',
    emoji: '👑',
    bgColor: 'bg-amber-600/20',
    textColor: 'text-amber-400',
    borderColor: 'border-amber-500/50',
  },
};

export function SubscriptionBadge({ 
  size = 'sm', 
  showLink = true,
  className = '' 
}: SubscriptionBadgeProps) {
  const [tier, setTier] = useState<SubscriptionTier>('free');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSubscription() {
      try {
        const response = await fetch('/api/subscriptions');
        if (response.ok) {
          const data = await response.json();
          setTier(data.currentTier || 'free');
        }
      } catch (error) {
        console.error('Failed to fetch subscription:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSubscription();
  }, []);

  if (isLoading) {
    return (
      <div className={`animate-pulse ${size === 'sm' ? 'w-12 h-5' : 'w-16 h-6'} bg-slate-700 rounded-full`} />
    );
  }

  const config = TIER_CONFIG[tier];
  const sizeClasses = size === 'sm' 
    ? 'px-2 py-0.5 text-xs' 
    : 'px-3 py-1 text-sm';

  const badge = (
    <span
      className={`
        inline-flex items-center gap-1 rounded-full border font-medium
        ${config.bgColor} ${config.textColor} ${config.borderColor}
        ${sizeClasses}
        ${showLink ? 'hover:opacity-80 transition-opacity cursor-pointer' : ''}
        ${className}
      `}
    >
      {config.emoji && <span>{config.emoji}</span>}
      <span>{config.label}</span>
    </span>
  );

  if (showLink) {
    return (
      <Link href="/profile/billing" title="จัดการแพ็คเกจ">
        {badge}
      </Link>
    );
  }

  return badge;
}

export default SubscriptionBadge;
