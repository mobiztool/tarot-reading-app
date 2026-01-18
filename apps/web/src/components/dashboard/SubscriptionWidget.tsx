'use client';

/**
 * Subscription Widget
 * Story 9.5: Premium User Dashboard & Statistics
 * 
 * Displays subscription status and tier info
 */

import Link from 'next/link';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import type { SubscriptionInfo } from '@/lib/dashboard/types';
import type { SubscriptionTier } from '@/types/subscription';

interface SubscriptionWidgetProps {
  tier: SubscriptionTier;
  subscription: SubscriptionInfo | null;
  isVip: boolean;
}

export function SubscriptionWidget({ tier, subscription, isVip }: SubscriptionWidgetProps) {
  const tierConfig = {
    free: { name: 'ฟรี', color: 'from-slate-600 to-slate-500', icon: '🌙' },
    basic: { name: 'เบสิค', color: 'from-blue-600 to-blue-500', icon: '⭐' },
    pro: { name: 'โปร', color: 'from-purple-600 to-purple-500', icon: '💫' },
    vip: { name: 'วีไอพี', color: 'from-amber-500 to-yellow-500', icon: '👑' },
  };

  const config = tierConfig[tier];

  const statusLabels: Record<string, { label: string; color: string }> = {
    active: { label: 'ใช้งานอยู่', color: 'text-green-400' },
    trialing: { label: 'ทดลองใช้', color: 'text-blue-400' },
    past_due: { label: 'ค้างชำระ', color: 'text-red-400' },
    canceled: { label: 'ยกเลิก', color: 'text-slate-400' },
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
        <span>💳</span>
        สถานะสมาชิก
      </h3>

      {/* Tier Badge */}
      <div className={`bg-gradient-to-r ${config.color} rounded-xl p-4 text-center mb-4`}>
        <span className="text-4xl">{config.icon}</span>
        <p className="text-2xl font-bold text-white mt-2">{config.name}</p>
        {subscription && (
          <p className={`text-sm mt-1 ${statusLabels[subscription.status]?.color || 'text-slate-300'}`}>
            {statusLabels[subscription.status]?.label || subscription.status}
          </p>
        )}
      </div>

      {/* Subscription Details */}
      {subscription && (
        <div className="space-y-3 mb-4">
          {subscription.currentPeriodEnd && (
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">ต่ออายุ</span>
              <span className="text-white">
                {format(new Date(subscription.currentPeriodEnd), 'd MMM yyyy', { locale: th })}
              </span>
            </div>
          )}
          
          {subscription.isTrialing && subscription.currentPeriodEnd && (
            <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg text-center">
              <p className="text-blue-400 text-sm">
                ทดลองใช้ฟรี หมดอายุ{' '}
                {format(new Date(subscription.currentPeriodEnd), 'd MMM yyyy', { locale: th })}
              </p>
            </div>
          )}

          {subscription.cancelAt && (
            <div className="p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg text-center">
              <p className="text-orange-400 text-sm">
                จะยกเลิกวันที่{' '}
                {format(new Date(subscription.cancelAt), 'd MMM yyyy', { locale: th })}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-2">
        <Link
          href="/profile/billing"
          className="block w-full py-2 text-center bg-slate-700/50 hover:bg-slate-700 text-slate-300 text-sm rounded-lg transition-colors"
        >
          จัดการสมาชิก
        </Link>
        
        {!isVip && tier !== 'free' && (
          <Link
            href="/pricing"
            className="block w-full py-2 text-center bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-900 text-sm font-medium rounded-lg transition-colors"
          >
            อัพเกรดเป็น VIP 👑
          </Link>
        )}
      </div>
    </div>
  );
}
