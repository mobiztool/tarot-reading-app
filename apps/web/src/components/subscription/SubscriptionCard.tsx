'use client';

/**
 * Subscription Card Component
 * Displays subscription status and management options
 */

import { useState } from 'react';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { 
  getTierNameTh, 
  getStatusDisplayTh, 
  getStatusColor,
  getDaysUntilEnd,
  isInGracePeriod,
} from '@/lib/subscription';
import { SubscriptionTier, SubscriptionStatus } from '@/types/subscription';
import { UpgradeModal } from './UpgradeModal';
import { DowngradeModal } from './DowngradeModal';
import { CancellationModal } from './CancellationModal';

interface SubscriptionData {
  id: string;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  current_period_end: Date;
  cancel_at: Date | null; // Changed from cancel_at_period_end boolean
  canceled_at: Date | null;
  pendingDowngrade?: {
    newTier: SubscriptionTier;
    effectiveDate: string;
  } | null;
}

interface SubscriptionCardProps {
  subscription: SubscriptionData;
  onCancel?: (id: string, immediately: boolean) => Promise<void>;
  onPause?: (id: string) => Promise<void>;
  onResume?: (id: string) => Promise<void>;
}

export function SubscriptionCard({
  subscription,
  onCancel,
  onPause,
  onResume,
}: SubscriptionCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showDowngradeModal, setShowDowngradeModal] = useState(false);

  const tierName = getTierNameTh(subscription.tier);
  const statusText = getStatusDisplayTh(subscription.status);
  const statusColor = getStatusColor(subscription.status);
  const daysLeft = getDaysUntilEnd(subscription.current_period_end);
  
  // Check if subscription is pending cancellation (has cancel_at set)
  const isPendingCancellation = !!subscription.cancel_at;
  
  const gracePeriod = isInGracePeriod({
    status: subscription.status,
    cancel_at: subscription.cancel_at,
    current_period_end: subscription.current_period_end,
  });

  const handleCancel = async (immediately: boolean) => {
    if (!onCancel) return;
    setIsLoading(true);
    try {
      await onCancel(subscription.id, immediately);
      setShowCancelModal(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePause = async () => {
    if (!onPause) return;
    setIsLoading(true);
    try {
      await onPause(subscription.id);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResume = async () => {
    if (!onResume) return;
    setIsLoading(true);
    try {
      await onResume(subscription.id);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border border-purple-200 rounded-xl p-6 bg-gradient-to-br from-purple-50 to-indigo-50">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-purple-900">{tierName}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span 
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                ${statusColor === 'green' ? 'bg-green-100 text-green-800' : ''}
                ${statusColor === 'blue' ? 'bg-blue-100 text-blue-800' : ''}
                ${statusColor === 'yellow' ? 'bg-yellow-100 text-yellow-800' : ''}
                ${statusColor === 'orange' ? 'bg-orange-100 text-orange-800' : ''}
                ${statusColor === 'red' ? 'bg-red-100 text-red-800' : ''}
                ${statusColor === 'gray' ? 'bg-gray-100 text-gray-800' : ''}
              `}
            >
              {statusText}
            </span>
          </div>
        </div>
        
        {/* Tier Badge */}
        <div className={`px-3 py-1 rounded-lg text-sm font-semibold
          ${subscription.tier === 'vip' ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' : ''}
          ${subscription.tier === 'pro' ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white' : ''}
          ${subscription.tier === 'basic' ? 'bg-gradient-to-r from-blue-400 to-cyan-500 text-white' : ''}
          ${subscription.tier === 'free' ? 'bg-gray-200 text-gray-700' : ''}
        `}>
          {subscription.tier.toUpperCase()}
        </div>
      </div>

      {/* Period Info */}
      {subscription.status === 'active' && (
        <div className="mb-4 text-sm text-gray-600">
          <p>
            ต่ออายุถัดไป:{' '}
            <span className="font-medium text-gray-900">
              {format(new Date(subscription.current_period_end), 'd MMMM yyyy', { locale: th })}
            </span>
          </p>
          {isPendingCancellation && (
            <p className="mt-1 text-orange-600">
              ⚠️ จะยกเลิกเมื่อสิ้นสุดรอบบิล (เหลืออีก {daysLeft} วัน)
            </p>
          )}
          {gracePeriod && (
            <p className="mt-1 text-blue-600">
              ✨ คุณยังใช้งานได้จนถึง{' '}
              {format(new Date(subscription.current_period_end), 'd MMMM yyyy', { locale: th })}
            </p>
          )}
        </div>
      )}

      {subscription.status === 'past_due' && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            ⚠️ การชำระเงินล้มเหลว กรุณาอัพเดทวิธีการชำระเงิน
          </p>
        </div>
      )}

      {subscription.status === 'paused' && (
        <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <p className="text-sm text-orange-800">
            ⏸️ การสมัครสมาชิกถูกหยุดชั่วคราว
          </p>
        </div>
      )}

      {/* Pending Downgrade Notice */}
      {subscription.pendingDowngrade && (
        <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <p className="text-sm text-orange-800">
            📅 การลดระดับเป็น <strong>{getTierNameTh(subscription.pendingDowngrade.newTier)}</strong> จะมีผลในวันที่{' '}
            {format(new Date(subscription.pendingDowngrade.effectiveDate), 'd MMMM yyyy', { locale: th })}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-2 mt-4">
        {/* Upgrade/Downgrade Buttons */}
        {(subscription.status === 'active' || subscription.status === 'trialing') && !isPendingCancellation && (
          <>
            {/* Upgrade Button - Show if not VIP */}
            {subscription.tier !== 'vip' && (
              <button
                onClick={() => setShowUpgradeModal(true)}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg hover:from-purple-600 hover:to-indigo-700 disabled:opacity-50 flex items-center gap-1 shadow-md shadow-purple-500/20"
              >
                <ArrowUp className="w-4 h-4" />
                อัปเกรด
              </button>
            )}
            
            {/* Downgrade Button - Show if not Free */}
            {subscription.tier !== 'free' && subscription.tier !== 'basic' && (
              <button
                onClick={() => setShowDowngradeModal(true)}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 disabled:opacity-50 flex items-center gap-1"
              >
                <ArrowDown className="w-4 h-4" />
                ลดระดับ
              </button>
            )}
          </>
        )}

        {subscription.status === 'active' && !isPendingCancellation && (
          <>
            <button
              onClick={() => setShowCancelModal(true)}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              ยกเลิก
            </button>
            {onPause && (
              <button
                onClick={handlePause}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-orange-700 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 disabled:opacity-50"
              >
                หยุดชั่วคราว
              </button>
            )}
          </>
        )}

        {subscription.status === 'paused' && onResume && (
          <button
            onClick={handleResume}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 disabled:opacity-50"
          >
            กลับมาใช้งาน
          </button>
        )}

        {isPendingCancellation && onResume && (
          <button
            onClick={handleResume}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-purple-700 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 disabled:opacity-50"
          >
            ยกเลิกการยกเลิก
          </button>
        )}
      </div>

      {/* Cancel Modal with Multi-Step Flow */}
      <CancellationModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        subscriptionId={subscription.id}
        currentTier={subscription.tier}
        currentPeriodEnd={new Date(subscription.current_period_end)}
        onCancelled={() => {
          setShowCancelModal(false);
          // Trigger parent refresh if needed
        }}
      />

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        currentTier={subscription.tier}
        subscriptionId={subscription.id}
        currentPeriodEnd={new Date(subscription.current_period_end)}
      />

      {/* Downgrade Modal */}
      <DowngradeModal
        isOpen={showDowngradeModal}
        onClose={() => setShowDowngradeModal(false)}
        currentTier={subscription.tier}
        subscriptionId={subscription.id}
        currentPeriodEnd={new Date(subscription.current_period_end)}
      />
    </div>
  );
}
