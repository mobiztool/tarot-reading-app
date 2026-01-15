'use client';

/**
 * Story 7.7: Premium UI Enhancements
 * Premium Visual Effects - Shimmer, Glow, Particles for premium users
 */

import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode, useMemo } from 'react';
import { usePremiumStatus } from '@/lib/hooks/usePremiumStatus';

/**
 * Premium Shimmer Effect - Adds a sweeping shimmer overlay
 */
export function PremiumShimmer({
  children,
  className = '',
  enabled = true,
  duration = 3,
  delay = 2,
}: {
  children: ReactNode;
  className?: string;
  enabled?: boolean;
  duration?: number;
  delay?: number;
}) {
  const { isPremium } = usePremiumStatus();

  if (!enabled || !isPremium) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {children}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ x: '-100%', opacity: 0 }}
        animate={{ x: '100%', opacity: [0, 0.5, 0] }}
        transition={{
          duration,
          repeat: Infinity,
          repeatDelay: delay,
          ease: 'easeInOut',
        }}
      >
        <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-amber-400/30 to-transparent transform skew-x-[-20deg]" />
      </motion.div>
    </div>
  );
}

/**
 * Premium Glow Effect - Adds pulsing golden glow
 */
export function PremiumGlow({
  children,
  className = '',
  enabled = true,
  intensity = 'medium',
}: {
  children: ReactNode;
  className?: string;
  enabled?: boolean;
  intensity?: 'subtle' | 'medium' | 'strong';
}) {
  const { isPremium, isVip } = usePremiumStatus();

  const glowConfig = {
    subtle: {
      boxShadow: [
        '0 0 10px rgba(251, 191, 36, 0.1)',
        '0 0 20px rgba(251, 191, 36, 0.2)',
        '0 0 10px rgba(251, 191, 36, 0.1)',
      ],
    },
    medium: {
      boxShadow: [
        '0 0 15px rgba(251, 191, 36, 0.2)',
        '0 0 30px rgba(251, 191, 36, 0.3)',
        '0 0 15px rgba(251, 191, 36, 0.2)',
      ],
    },
    strong: {
      boxShadow: [
        '0 0 20px rgba(251, 191, 36, 0.3)',
        '0 0 40px rgba(251, 191, 36, 0.5)',
        '0 0 20px rgba(251, 191, 36, 0.3)',
      ],
    },
  };

  if (!enabled || !isPremium) {
    return <div className={className}>{children}</div>;
  }

  // VIP gets stronger glow
  const effectiveIntensity = isVip ? 'strong' : intensity;

  return (
    <motion.div
      className={`${className}`}
      animate={glowConfig[effectiveIntensity]}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Premium Sparkle Particles - Floating sparkle particles
 */
export function PremiumSparkles({
  count = 6,
  className = '',
  enabled = true,
}: {
  count?: number;
  className?: string;
  enabled?: boolean;
}) {
  const { isPremium, isVip } = usePremiumStatus();

  // Generate random particles
  const particles = useMemo(() => {
    return Array.from({ length: isVip ? count * 1.5 : count }, (_, i) => ({
      id: i,
      size: Math.random() * 4 + 2,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: Math.random() * 3 + 2,
    }));
  }, [count, isVip]);

  if (!enabled || !isPremium) {
    return null;
  }

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            background: isVip 
              ? 'radial-gradient(circle, rgba(251,191,36,0.9) 0%, rgba(251,191,36,0) 70%)'
              : 'radial-gradient(circle, rgba(168,85,247,0.9) 0%, rgba(168,85,247,0) 70%)',
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0.5, 1, 0.5],
            y: [0, -20, -40],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            repeatDelay: Math.random() * 3,
          }}
        />
      ))}
    </div>
  );
}

/**
 * Premium Card Reveal Animation - Enhanced card flip for premium users
 */
export function PremiumCardReveal({
  children,
  isRevealed,
  className = '',
  enabled = true,
}: {
  children: ReactNode;
  isRevealed: boolean;
  className?: string;
  enabled?: boolean;
}) {
  const { isPremium, isVip } = usePremiumStatus();

  // Standard animation for non-premium
  if (!enabled || !isPremium) {
    return (
      <motion.div
        className={className}
        initial={{ rotateY: 0 }}
        animate={{ rotateY: isRevealed ? 180 : 0 }}
        transition={{ duration: 0.6 }}
      >
        {children}
      </motion.div>
    );
  }

  // Premium animation with extra flair
  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ rotateY: 0, scale: 1 }}
      animate={{ 
        rotateY: isRevealed ? 180 : 0,
        scale: isRevealed ? [1, 1.05, 1] : 1,
      }}
      transition={{ 
        duration: 0.8,
        type: 'spring',
        stiffness: 100,
        damping: 15,
      }}
    >
      {children}
      
      {/* Golden burst effect on reveal */}
      <AnimatePresence>
        {isRevealed && isVip && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: [0, 0.8, 0], scale: [0.8, 1.5, 2] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-400/50 via-yellow-300/50 to-amber-400/50 blur-xl" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/**
 * Premium Entrance Animation - Staggered entrance for lists
 */
export function PremiumEntranceList({
  children,
  className = '',
  staggerDelay = 0.1,
}: {
  children: ReactNode[];
  className?: string;
  staggerDelay?: number;
}) {
  const { isPremium } = usePremiumStatus();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: isPremium ? staggerDelay : staggerDelay * 2,
      },
    },
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: isPremium ? 20 : 10,
      scale: isPremium ? 0.95 : 1,
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: isPremium ? 'spring' : 'tween',
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {children.map((child, index) => (
        <motion.div key={index} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

/**
 * Premium Hover Effect - Enhanced hover state for premium
 */
export function PremiumHover({
  children,
  className = '',
  enabled = true,
}: {
  children: ReactNode;
  className?: string;
  enabled?: boolean;
}) {
  const { isPremium, isVip } = usePremiumStatus();

  if (!enabled || !isPremium) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      whileHover={{
        scale: 1.02,
        boxShadow: isVip
          ? '0 10px 40px -10px rgba(251, 191, 36, 0.4)'
          : '0 10px 40px -10px rgba(168, 85, 247, 0.3)',
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {children}
    </motion.div>
  );
}

export default {
  PremiumShimmer,
  PremiumGlow,
  PremiumSparkles,
  PremiumCardReveal,
  PremiumEntranceList,
  PremiumHover,
};
