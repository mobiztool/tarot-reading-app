'use client';

/**
 * Upgrade Modal Component
 * Allows users to upgrade to a higher tier with proration
 */

import { useState } from 'react';
import { SUBSCRIPTION_TIERS, isHigherTier } from '@/lib/subscription/tiers';
import { SubscriptionTier } from '@/types/subscription';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import { ArrowUp, Check, Info, X } from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTier: SubscriptionTier;
  subscriptionId: string;
  currentPeriodEnd: Date;
  onSuccess?: () => void;
}

// Get tiers that user can upgrade to
function getUpgradeTiers(currentTier: SubscriptionTier): SubscriptionTier[] {
  const allTiers: SubscriptionTier[] = ['basic', 'pro', 'vip'];
  return allTiers.filter(tier => isHigherTier(tier, currentTier));
}

// Calculate proration explanation
function calculateProratedCharge(
  currentPrice: number,
  newPrice: number,
  daysRemaining: number,
  daysInMonth: number = 30
): { credit: number; charge: number; total: number } {
  const credit = currentPrice * (daysRemaining / daysInMonth);
  const charge = newPrice * (daysRemaining / daysInMonth);
  return {
    credit: Math.round(credit * 100) / 100,
    charge: Math.round(charge * 100) / 100,
    total: Math.round((charge - credit) * 100) / 100,
  };
}

export function UpgradeModal({
  isOpen,
  onClose,
  currentTier,
  subscriptionId,
  currentPeriodEnd,
  onSuccess,
}: UpgradeModalProps) {
  const upgradeTiers = getUpgradeTiers(currentTier);
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>(upgradeTiers[0] || 'pro');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentPrice = SUBSCRIPTION_TIERS[currentTier].price;
  const newPrice = SUBSCRIPTION_TIERS[selectedTier].price;
  const priceDiff = newPrice - currentPrice;

  // Calculate days remaining
  const now = new Date();
  const periodEnd = new Date(currentPeriodEnd);
  const daysRemaining = Math.ceil((periodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  const proration = calculateProratedCharge(currentPrice, newPrice, daysRemaining);
  const selectedTierConfig = SUBSCRIPTION_TIERS[selectedTier];

  const handleUpgrade = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Send only tier - backend will look up the price ID from env vars
      const response = await fetch(`/api/subscriptions/${subscriptionId}/upgrade`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newTier: selectedTier,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'ไม่สามารถอัปเกรดได้');
      }

      onSuccess?.();
      onClose();
      
      // Refresh the page to reflect new tier
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-gradient-to-br from-slate-900 to-purple-950 rounded-2xl max-w-lg w-full shadow-2xl border border-purple-500/30 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-purple-500/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl">
              <ArrowUp className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">อัปเกรดแพ็คเกจ</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Current Tier */}
          <div className="bg-white/5 rounded-xl p-4">
            <p className="text-purple-300 text-sm mb-1">แพ็คเกจปัจจุบัน</p>
            <p className="text-white font-semibold">
              {SUBSCRIPTION_TIERS[currentTier].nameTh} - ฿{currentPrice}/เดือน
            </p>
          </div>

          {/* Tier Selection */}
          <div className="space-y-3">
            <p className="text-purple-300 text-sm font-medium">เลือกแพ็คเกจใหม่</p>
            {upgradeTiers.map((tier) => {
              const tierConfig = SUBSCRIPTION_TIERS[tier];
              const isSelected = selectedTier === tier;
              return (
                <button
                  key={tier}
                  onClick={() => setSelectedTier(tier)}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                    isSelected
                      ? 'border-purple-400 bg-purple-500/20'
                      : 'border-purple-500/30 bg-white/5 hover:border-purple-500/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                        tier === 'vip' ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' :
                        tier === 'pro' ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white' :
                        'bg-blue-500 text-white'
                      }`}>
                        {tier.toUpperCase()}
                      </span>
                      <span className="text-white font-semibold">{tierConfig.nameTh}</span>
                    </div>
                    <span className="text-purple-200 font-bold">
                      ฿{tierConfig.price}/เดือน
                    </span>
                  </div>
                  <p className="text-purple-300 text-sm">
                    +฿{tierConfig.price - currentPrice}/เดือน จากแพ็คเกจปัจจุบัน
                  </p>
                </button>
              );
            })}
          </div>

          {/* Proration Explanation */}
          <div className="bg-blue-900/30 border border-blue-500/30 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="text-blue-200 font-semibold mb-2">การคิดเงิน (Proration)</p>
                <ul className="text-blue-300 space-y-1">
                  <li>• ราคาใหม่: <strong className="text-white">฿{newPrice}/เดือน</strong></li>
                  <li>• ค่าใช้จ่ายเพิ่มเติม: <strong className="text-white">+฿{priceDiff}/เดือน</strong></li>
                  <li>• เหลืออีก {daysRemaining} วันในรอบบิลนี้</li>
                  <li className="pt-2 border-t border-blue-500/30">
                    💳 <strong className="text-white">วันนี้จ่ายประมาณ: ฿{proration.total > 0 ? proration.total.toFixed(0) : 0}</strong>
                  </li>
                  <li>✅ เข้าถึงฟีเจอร์ใหม่ได้ทันที!</li>
                </ul>
              </div>
            </div>
          </div>

          {/* What You Get */}
          <div className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 rounded-xl p-4">
            <h4 className="font-semibold text-white mb-3">คุณจะได้รับ:</h4>
            <ul className="space-y-2">
              {selectedTierConfig.featuresTh.map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-purple-200">
                  <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-900/30 border border-red-500/30 rounded-xl p-4 text-red-300 text-sm">
              ❌ {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-purple-500/20 flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-3 text-purple-300 bg-white/5 rounded-xl hover:bg-white/10 transition-colors font-medium disabled:opacity-50"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleUpgrade}
            disabled={isLoading}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl hover:from-purple-600 hover:to-indigo-700 transition-all font-bold shadow-lg shadow-purple-500/30 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                กำลังอัปเกรด...
              </>
            ) : (
              <>
                <ArrowUp className="w-5 h-5" />
                ยืนยันอัปเกรด
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
