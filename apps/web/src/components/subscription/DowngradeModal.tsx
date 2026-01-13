'use client';

/**
 * Downgrade Modal Component
 * Allows users to downgrade to a lower tier (takes effect at period end)
 */

import { useState } from 'react';
import { SUBSCRIPTION_TIERS, isHigherTier } from '@/lib/subscription/tiers';
import { SubscriptionTier } from '@/types/subscription';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import { ArrowDown, AlertTriangle, X, Check } from 'lucide-react';

interface DowngradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTier: SubscriptionTier;
  subscriptionId: string;
  currentPeriodEnd: Date;
  onSuccess?: () => void;
}

// Get tiers that user can downgrade to
function getDowngradeTiers(currentTier: SubscriptionTier): SubscriptionTier[] {
  const allTiers: SubscriptionTier[] = ['free', 'basic', 'pro'];
  return allTiers.filter(tier => isHigherTier(currentTier, tier));
}

// Get features user will lose
function getFeaturesToLose(
  currentTier: SubscriptionTier,
  newTier: SubscriptionTier
): string[] {
  const currentFeatures = SUBSCRIPTION_TIERS[currentTier].featuresTh;
  const newFeatures = SUBSCRIPTION_TIERS[newTier].featuresTh;
  
  // Simple difference - features in current but not in new
  return currentFeatures.filter(f => !newFeatures.includes(f));
}

export function DowngradeModal({
  isOpen,
  onClose,
  currentTier,
  subscriptionId,
  currentPeriodEnd,
  onSuccess,
}: DowngradeModalProps) {
  const downgradeTiers = getDowngradeTiers(currentTier);
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>(
    downgradeTiers.includes('basic') ? 'basic' : downgradeTiers[0] || 'free'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentPrice = SUBSCRIPTION_TIERS[currentTier].price;
  const newPrice = SUBSCRIPTION_TIERS[selectedTier].price;
  const featuresToLose = getFeaturesToLose(currentTier, selectedTier);
  const selectedTierConfig = SUBSCRIPTION_TIERS[selectedTier];
  const periodEndFormatted = format(new Date(currentPeriodEnd), 'd MMMM yyyy', { locale: th });

  const handleDowngrade = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Free tier means cancel subscription
      if (selectedTier === 'free') {
        const response = await fetch(`/api/subscriptions/${subscriptionId}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ immediately: false }), // Cancel at period end
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'ไม่สามารถยกเลิกได้');
        }
      } else {
        // Downgrade to lower paid tier
        const response = await fetch(`/api/subscriptions/${subscriptionId}/downgrade`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            newTier: selectedTier,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'ไม่สามารถลดระดับได้');
        }
      }

      onSuccess?.();
      onClose();
      
      // Refresh the page to reflect changes
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-gradient-to-br from-slate-900 to-orange-950 rounded-2xl max-w-lg w-full shadow-2xl border border-orange-500/30 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-orange-500/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl">
              <ArrowDown className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">ลดระดับแพ็คเกจ</h2>
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
          {/* Warning */}
          <div className="bg-orange-900/30 border border-orange-500/30 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="text-orange-200 font-semibold mb-2">สิ่งที่ควรทราบ</p>
                <ul className="text-orange-300 space-y-1">
                  <li>• การลดระดับจะมีผลในวันที่ <strong className="text-white">{periodEndFormatted}</strong></li>
                  <li>• คุณจะยังคงเข้าถึงฟีเจอร์ปัจจุบันจนถึงวันนั้น</li>
                  <li>• <strong className="text-orange-200">ไม่มีการคืนเงิน</strong> (มาตรฐานอุตสาหกรรม)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Current Tier */}
          <div className="bg-white/5 rounded-xl p-4">
            <p className="text-orange-300 text-sm mb-1">แพ็คเกจปัจจุบัน</p>
            <p className="text-white font-semibold">
              {SUBSCRIPTION_TIERS[currentTier].nameTh} - ฿{currentPrice}/เดือน
            </p>
          </div>

          {/* Tier Selection */}
          <div className="space-y-3">
            <p className="text-orange-300 text-sm font-medium">เลือกแพ็คเกจใหม่</p>
            {downgradeTiers.map((tier) => {
              const tierConfig = SUBSCRIPTION_TIERS[tier];
              const isSelected = selectedTier === tier;
              return (
                <button
                  key={tier}
                  onClick={() => setSelectedTier(tier)}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                    isSelected
                      ? 'border-orange-400 bg-orange-500/20'
                      : 'border-orange-500/30 bg-white/5 hover:border-orange-500/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                        tier === 'pro' ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white' :
                        tier === 'basic' ? 'bg-blue-500 text-white' :
                        'bg-gray-500 text-white'
                      }`}>
                        {tier.toUpperCase()}
                      </span>
                      <span className="text-white font-semibold">{tierConfig.nameTh}</span>
                    </div>
                    <span className="text-orange-200 font-bold">
                      {tierConfig.price === 0 ? 'ฟรี' : `฿${tierConfig.price}/เดือน`}
                    </span>
                  </div>
                  <p className="text-orange-300 text-sm">
                    ประหยัด ฿{currentPrice - tierConfig.price}/เดือน
                  </p>
                </button>
              );
            })}
          </div>

          {/* Features You'll Lose */}
          {featuresToLose.length > 0 && (
            <div className="bg-red-900/30 border border-red-500/30 rounded-xl p-4">
              <h4 className="font-semibold text-red-200 mb-3">คุณจะสูญเสียการเข้าถึง:</h4>
              <ul className="space-y-2">
                {featuresToLose.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-red-300">
                    <X className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* What You'll Keep */}
          <div className="bg-green-900/30 border border-green-500/30 rounded-xl p-4">
            <h4 className="font-semibold text-green-200 mb-3">ยังคงได้รับ:</h4>
            <ul className="space-y-2">
              {selectedTierConfig.featuresTh.map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-green-300">
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
        <div className="p-6 border-t border-orange-500/20 flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-3 text-orange-300 bg-white/5 rounded-xl hover:bg-white/10 transition-colors font-medium disabled:opacity-50"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleDowngrade}
            disabled={isLoading}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl hover:from-orange-600 hover:to-red-700 transition-all font-bold shadow-lg shadow-orange-500/30 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                กำลังดำเนินการ...
              </>
            ) : (
              <>
                <ArrowDown className="w-5 h-5" />
                ยืนยันลดระดับ
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
