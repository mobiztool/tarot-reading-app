'use client';

/**
 * Premium Gate Component
 * Displays an attractive upgrade prompt when users try to access locked features
 * Story 6.3: Feature Gating by Subscription Tier (AC: 3, 4, 6)
 */

import { useRouter } from 'next/navigation';
import { SubscriptionTier } from '@/types/subscription';
import { SUBSCRIPTION_TIERS } from '@/lib/subscription/tiers';

interface PremiumGateProps {
  spreadName: string;
  spreadNameTh: string;
  spreadIcon?: string;
  requiredTier: SubscriptionTier;
  currentTier: SubscriptionTier;
  onUpgradeClick?: () => void;
}

export function PremiumGate({
  spreadName,
  spreadNameTh,
  spreadIcon = '🔒',
  requiredTier,
  currentTier,
  onUpgradeClick,
}: PremiumGateProps) {
  const router = useRouter();
  const tierInfo = SUBSCRIPTION_TIERS[requiredTier];

  const handleUpgrade = () => {
    onUpgradeClick?.();
    // Navigate to pricing with context
    router.push(`/pricing?upgrade=${requiredTier}&from=${spreadName}`);
  };

  const handleDismiss = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-900 to-indigo-950 flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        {/* Main Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-purple-500/30 shadow-2xl">
          {/* Lock Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/30">
                <span className="text-4xl">{spreadIcon}</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-white">
                <span className="text-lg">🔒</span>
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-center text-white mb-2">
            ปลดล็อก {spreadNameTh}
          </h1>
          <p className="text-center text-purple-200 mb-6">
            รูปแบบนี้พร้อมใช้งานใน{' '}
            <span className="font-semibold text-yellow-300">{tierInfo.nameTh}</span>{' '}
            หรือสูงกว่า
          </p>

          {/* Current Tier Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm">
              <span className="text-purple-300">แพ็คเกจปัจจุบัน:</span>
              <span className="font-semibold text-white">
                {SUBSCRIPTION_TIERS[currentTier].nameTh}
              </span>
            </div>
          </div>

          {/* Features */}
          <div className="bg-white/5 rounded-2xl p-6 mb-6 border border-purple-500/20">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <span className="text-yellow-400">✨</span>
              สิ่งที่คุณจะได้รับใน {tierInfo.nameTh}
            </h3>
            <ul className="space-y-3">
              {tierInfo.featuresTh.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span className="text-purple-100 text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            {/* Price */}
            <div className="mt-6 pt-4 border-t border-purple-500/20">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-white">฿{tierInfo.price}</span>
                <span className="text-purple-300">/เดือน</span>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <button
            onClick={handleUpgrade}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold text-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2 group mb-3"
          >
            <span>อัปเกรดเป็น {tierInfo.nameTh}</span>
            <svg
              className="w-5 h-5 group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>

          <button
            onClick={handleDismiss}
            className="w-full text-purple-300 py-3 rounded-xl font-medium hover:text-white hover:bg-white/5 transition-all"
          >
            กลับไปหน้าก่อน
          </button>

          {/* Trust Badge */}
          <p className="text-center text-xs text-purple-400 mt-4">
            🔒 ยกเลิกได้ทุกเมื่อ • ไม่มีสัญญาผูกมัด • ปลอดภัย 100%
          </p>
        </div>
      </div>
    </div>
  );
}
