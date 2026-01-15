'use client';

/**
 * Story 7.7: Premium UI Enhancements
 * Premium Welcome Component - Celebrates new premium subscription
 */

import { motion } from 'framer-motion';
import Link from 'next/link';
import { SubscriptionTier } from '@/types/subscription';

interface PremiumWelcomeProps {
  tier: SubscriptionTier;
  userName?: string;
}

const TIER_CONFIG: Record<Exclude<SubscriptionTier, 'free'>, {
  title: string;
  titleTh: string;
  subtitle: string;
  icon: string;
  gradient: string;
  features: string[];
}> = {
  basic: {
    title: 'Basic',
    titleTh: 'เบสิค',
    subtitle: 'ยินดีต้อนรับสู่ครอบครัว!',
    icon: '⭐',
    gradient: 'from-blue-400 via-cyan-400 to-blue-500',
    features: [
      'ดูดวงความรักและการงาน',
      'ไม่มีโฆษณา',
      'บันทึกประวัติไม่จำกัด',
    ],
  },
  pro: {
    title: 'Pro',
    titleTh: 'โปร',
    subtitle: 'คุณพร้อมสำหรับประสบการณ์พิเศษ!',
    icon: '💎',
    gradient: 'from-purple-400 via-violet-500 to-purple-600',
    features: [
      'ทุกสิ่งใน Basic',
      'การ์ดพรีเมียม 5 แบบ',
      'คำทำนายเจาะลึก',
      'ส่งออก PDF',
    ],
  },
  vip: {
    title: 'VIP',
    titleTh: 'วีไอพี',
    subtitle: 'ยินดีต้อนรับสู่ประสบการณ์สุดพิเศษ!',
    icon: '👑',
    gradient: 'from-amber-300 via-yellow-400 to-amber-500',
    features: [
      'ทุกสิ่งใน Pro',
      'การ์ดทั้งหมด 18 แบบ',
      'AI คำทำนายส่วนตัว',
      'แดชบอร์ดพิเศษ',
      'ซัพพอร์ตสำคัญ',
    ],
  },
};

export function PremiumWelcome({ tier, userName }: PremiumWelcomeProps) {
  if (tier === 'free') {
    return null;
  }

  const config = TIER_CONFIG[tier];

  return (
    <motion.div
      className="max-w-2xl mx-auto text-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Celebration Background */}
      <div className="relative">
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: tier === 'vip' 
                  ? 'linear-gradient(135deg, #FBBF24, #F59E0B)'
                  : tier === 'pro'
                    ? 'linear-gradient(135deg, #A855F7, #7C3AED)'
                    : 'linear-gradient(135deg, #3B82F6, #06B6D4)',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -50, 0],
                opacity: [0, 1, 0],
                scale: [0.5, 1.5, 0.5],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Main Content */}
        <motion.div
          className="relative z-10 py-12 px-6"
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Icon with Glow */}
          <motion.div
            className="text-7xl mb-6"
            animate={{
              scale: [1, 1.1, 1],
              rotate: tier === 'vip' ? [-5, 5, -5] : 0,
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {config.icon}
          </motion.div>

          {/* Title */}
          <motion.h1
            className={`text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            🎉 ยินดีต้อนรับสู่ {config.title}!
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-xl text-slate-300 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {userName ? `สวัสดีคุณ ${userName}, ` : ''}{config.subtitle}
          </motion.p>

          {/* Features List */}
          <motion.div
            className="bg-slate-800/50 rounded-2xl p-6 mb-8 border border-slate-700/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-lg font-semibold text-white mb-4">
              สิ่งที่คุณได้รับ:
            </h2>
            <ul className="space-y-3">
              {config.features.map((feature, index) => (
                <motion.li
                  key={feature}
                  className="flex items-center gap-3 text-slate-300"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                >
                  <span className={`
                    w-6 h-6 rounded-full flex items-center justify-center text-xs
                    bg-gradient-to-r ${config.gradient} text-white
                  `}>
                    ✓
                  </span>
                  {feature}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <Link
              href="/reading"
              className={`
                px-8 py-3 rounded-xl font-semibold text-white
                bg-gradient-to-r ${config.gradient}
                hover:opacity-90 transition-opacity
                shadow-lg
              `}
            >
              เริ่มดูดวงเลย ✨
            </Link>
            <Link
              href="/profile/billing"
              className="px-8 py-3 rounded-xl font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700"
            >
              จัดการแพ็คเกจ
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default PremiumWelcome;
