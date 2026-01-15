'use client';

/**
 * Story 7.7: Premium UI Enhancements
 * Premium Wrapper - Applies premium styling based on user tier
 */

import { ReactNode } from 'react';
import { usePremiumStatus } from '@/lib/hooks/usePremiumStatus';
import { motion } from 'framer-motion';

interface PremiumWrapperProps {
  children: ReactNode;
  className?: string;
  /** Apply gold border for premium users */
  goldBorder?: boolean;
  /** Apply glow effect for premium users */
  glow?: boolean;
  /** Apply premium background gradient */
  gradient?: boolean;
  /** Show premium indicator badge */
  showBadge?: boolean;
}

/**
 * Wraps content with premium styling if user is premium
 */
export function PremiumWrapper({
  children,
  className = '',
  goldBorder = false,
  glow = false,
  gradient = false,
  showBadge = false,
}: PremiumWrapperProps) {
  const { isPremium, isVip, tier } = usePremiumStatus();

  // Build premium classes
  const premiumClasses = [];

  if (isPremium && goldBorder) {
    premiumClasses.push(
      isVip
        ? 'border-2 border-amber-400/50'
        : 'border border-purple-400/30'
    );
  }

  if (isPremium && glow) {
    premiumClasses.push(
      isVip
        ? 'shadow-lg shadow-amber-400/20'
        : 'shadow-lg shadow-purple-400/20'
    );
  }

  if (isPremium && gradient) {
    premiumClasses.push(
      isVip
        ? 'bg-gradient-to-br from-amber-900/10 via-transparent to-amber-900/10'
        : 'bg-gradient-to-br from-purple-900/10 via-transparent to-purple-900/10'
    );
  }

  return (
    <div className={`relative ${premiumClasses.join(' ')} ${className}`}>
      {children}
      
      {/* Premium indicator badge */}
      {isPremium && showBadge && (
        <motion.div
          className="absolute -top-2 -right-2 z-10"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <span
            className={`
              inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold
              ${isVip 
                ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-900' 
                : tier === 'pro'
                  ? 'bg-gradient-to-r from-purple-400 to-violet-500 text-white'
                  : 'bg-gradient-to-r from-blue-400 to-cyan-500 text-white'
              }
            `}
          >
            {isVip ? '👑' : tier === 'pro' ? '💎' : '⭐'}
          </span>
        </motion.div>
      )}
    </div>
  );
}

/**
 * Premium Card Frame - Decorative frame with premium styling
 */
export function PremiumCardFrame({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  const { isPremium, isVip } = usePremiumStatus();

  if (!isPremium) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={`relative ${className}`}>
      {/* Premium corner decorations */}
      {isVip && (
        <>
          <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-amber-400/50 rounded-tl-lg" />
          <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-amber-400/50 rounded-tr-lg" />
          <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-amber-400/50 rounded-bl-lg" />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-amber-400/50 rounded-br-lg" />
        </>
      )}
      
      <div
        className={`
          ${isVip 
            ? 'ring-1 ring-amber-400/30' 
            : 'ring-1 ring-purple-400/20'
          }
          rounded-xl overflow-hidden
        `}
      >
        {children}
      </div>
    </div>
  );
}

export default PremiumWrapper;
