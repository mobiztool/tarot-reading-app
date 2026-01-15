'use client';

/**
 * Story 7.7: Premium UI Enhancements
 * Premium Badge Component - Displays premium status with gold styling
 */

import { usePremiumStatus } from '@/lib/hooks/usePremiumStatus';
import { SubscriptionTier } from '@/types/subscription';
import { motion } from 'framer-motion';

interface PremiumBadgeProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
  /** Override tier for display purposes */
  overrideTier?: SubscriptionTier;
  /** Show loading skeleton while fetching */
  showSkeleton?: boolean;
}

// Premium tier configurations with gold accents
const PREMIUM_TIER_CONFIG: Record<Exclude<SubscriptionTier, 'free'>, {
  label: string;
  labelTh: string;
  icon: string;
  gradient: string;
  glowColor: string;
  borderColor: string;
  textColor: string;
}> = {
  basic: {
    label: 'Basic',
    labelTh: 'เบสิค',
    icon: '⭐',
    gradient: 'from-blue-400 via-cyan-400 to-blue-500',
    glowColor: 'shadow-blue-400/50',
    borderColor: 'border-blue-400/50',
    textColor: 'text-white',
  },
  pro: {
    label: 'Pro',
    labelTh: 'โปร',
    icon: '💎',
    gradient: 'from-purple-400 via-violet-500 to-purple-600',
    glowColor: 'shadow-purple-400/50',
    borderColor: 'border-purple-400/50',
    textColor: 'text-white',
  },
  vip: {
    label: 'VIP',
    labelTh: 'วีไอพี',
    icon: '👑',
    gradient: 'from-amber-300 via-yellow-400 to-amber-500',
    glowColor: 'shadow-amber-400/60',
    borderColor: 'border-amber-400/50',
    textColor: 'text-amber-900',
  },
};

const SIZE_CONFIG = {
  xs: {
    badge: 'px-1.5 py-0.5 text-[10px]',
    icon: 'text-[10px]',
    skeleton: 'w-10 h-4',
  },
  sm: {
    badge: 'px-2 py-0.5 text-xs',
    icon: 'text-xs',
    skeleton: 'w-12 h-5',
  },
  md: {
    badge: 'px-3 py-1 text-sm',
    icon: 'text-sm',
    skeleton: 'w-16 h-6',
  },
  lg: {
    badge: 'px-4 py-1.5 text-base',
    icon: 'text-base',
    skeleton: 'w-20 h-8',
  },
};

export function PremiumBadge({
  size = 'sm',
  showLabel = true,
  className = '',
  overrideTier,
  showSkeleton = true,
}: PremiumBadgeProps) {
  const { tier: fetchedTier, isPremium, isLoading } = usePremiumStatus();
  
  // Use override tier if provided, otherwise use fetched tier
  const tier = overrideTier ?? fetchedTier;
  const shouldShowPremium = overrideTier ? overrideTier !== 'free' : isPremium;

  // Show skeleton while loading
  if (isLoading && showSkeleton && !overrideTier) {
    return (
      <div 
        className={`
          animate-pulse rounded-full bg-gradient-to-r from-slate-700 to-slate-600
          ${SIZE_CONFIG[size].skeleton}
          ${className}
        `}
      />
    );
  }

  // Don't show badge for free tier
  if (!shouldShowPremium || tier === 'free') {
    return null;
  }

  const config = PREMIUM_TIER_CONFIG[tier];
  const sizeConfig = SIZE_CONFIG[size];

  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`
        inline-flex items-center gap-1 font-semibold rounded-full
        bg-gradient-to-r ${config.gradient}
        border ${config.borderColor}
        shadow-lg ${config.glowColor}
        ${config.textColor}
        ${sizeConfig.badge}
        ${className}
      `}
      role="status"
      aria-label={`สมาชิก ${config.labelTh}`}
    >
      {/* Animated icon */}
      <motion.span
        className={sizeConfig.icon}
        animate={tier === 'vip' ? { 
          rotate: [0, -10, 10, -10, 0],
          scale: [1, 1.1, 1],
        } : {}}
        transition={{ 
          duration: 2, 
          repeat: Infinity, 
          repeatDelay: 3,
        }}
      >
        {config.icon}
      </motion.span>
      
      {/* Label */}
      {showLabel && (
        <span className="font-bold tracking-wide">
          {config.label}
        </span>
      )}

      {/* Premium shimmer effect for VIP */}
      {tier === 'vip' && (
        <motion.span
          className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 4,
            ease: 'easeInOut',
          }}
          style={{ position: 'absolute', pointerEvents: 'none' }}
        />
      )}
    </motion.span>
  );
}

/**
 * Premium Crown Icon - Standalone animated crown for headers
 */
export function PremiumCrown({
  size = 'md',
  className = '',
}: {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const { isVip, isPremium, isLoading } = usePremiumStatus();

  if (isLoading || !isPremium) {
    return null;
  }

  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <motion.span
      className={`${sizeClasses[size]} ${className}`}
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      whileHover={{ scale: 1.2, rotate: [-5, 5, 0] }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      title={isVip ? 'สมาชิก VIP' : 'สมาชิก Premium'}
    >
      {isVip ? '👑' : '💎'}
    </motion.span>
  );
}

export default PremiumBadge;
