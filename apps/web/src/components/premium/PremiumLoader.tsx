'use client';

/**
 * Story 7.7: Premium UI Enhancements
 * Premium Loader - Enhanced loading animation for premium users
 */

import { motion } from 'framer-motion';
import { usePremiumStatus } from '@/lib/hooks/usePremiumStatus';

interface PremiumLoaderProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeConfig = {
  sm: { orb: 40, ring: 50, text: 'text-sm' },
  md: { orb: 60, ring: 80, text: 'text-base' },
  lg: { orb: 100, ring: 130, text: 'text-lg' },
};

/**
 * Premium Loader with golden orb animation
 */
export function PremiumLoader({
  message = 'กำลังโหลด...',
  size = 'md',
}: PremiumLoaderProps) {
  const { isPremium, isVip } = usePremiumStatus();
  const config = sizeConfig[size];

  // Determine colors based on tier
  const primaryColor = isVip ? '#FBBF24' : isPremium ? '#A855F7' : '#8B5CF6';
  const secondaryColor = isVip ? '#F59E0B' : isPremium ? '#7C3AED' : '#6366F1';
  const glowColor = isVip ? 'rgba(251, 191, 36, 0.5)' : 'rgba(168, 85, 247, 0.4)';

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Animated Loader */}
      <div 
        className="relative"
        style={{ width: config.ring, height: config.ring }}
      >
        {/* Outer spinning ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            border: `3px solid transparent`,
            borderTopColor: primaryColor,
            borderRightColor: secondaryColor,
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />

        {/* Inner reverse spinning ring */}
        <motion.div
          className="absolute rounded-full"
          style={{
            inset: 8,
            border: `2px solid transparent`,
            borderBottomColor: primaryColor,
            borderLeftColor: secondaryColor,
          }}
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />

        {/* Center orb */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: config.orb,
            height: config.orb,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            background: `radial-gradient(circle at 30% 30%, ${primaryColor}, ${secondaryColor})`,
            boxShadow: `0 0 30px ${glowColor}`,
          }}
          animate={{
            scale: [1, 1.1, 1],
            boxShadow: [
              `0 0 20px ${glowColor}`,
              `0 0 40px ${glowColor}`,
              `0 0 20px ${glowColor}`,
            ],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Premium crown for VIP */}
        {isVip && (
          <motion.span
            className="absolute text-2xl"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
            animate={{
              y: [0, -3, 0],
              rotate: [-5, 5, -5],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            👑
          </motion.span>
        )}

        {/* Floating particles */}
        {isPremium && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full"
                style={{
                  background: primaryColor,
                  left: '50%',
                  top: '50%',
                }}
                animate={{
                  x: [0, Math.cos((i * Math.PI) / 3) * 30, 0],
                  y: [0, Math.sin((i * Math.PI) / 3) * 30, 0],
                  opacity: [0, 1, 0],
                  scale: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </>
        )}
      </div>

      {/* Loading message */}
      {message && (
        <motion.p
          className={`${config.text} font-medium`}
          style={{ color: primaryColor }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {message}
        </motion.p>
      )}
    </div>
  );
}

/**
 * Full page premium loader
 */
export function PremiumPageLoader({ message = 'กำลังโหลด...' }: { message?: string }) {
  const { isPremium, isVip } = usePremiumStatus();

  return (
    <div className={`
      min-h-screen flex items-center justify-center
      ${isVip 
        ? 'bg-gradient-to-b from-slate-900 via-amber-950/20 to-slate-900' 
        : isPremium
          ? 'bg-gradient-to-b from-slate-900 via-purple-950/20 to-slate-900'
          : 'bg-gradient-to-b from-slate-900 via-purple-950/10 to-slate-900'
      }
    `}>
      <PremiumLoader message={message} size="lg" />
    </div>
  );
}

export default PremiumLoader;
