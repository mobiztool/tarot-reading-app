/**
 * Trial Banner Component
 * Shows trial countdown for users on trial subscription
 * Story 6.9 - Free Trial Implementation
 */
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Clock, Sparkles, X } from 'lucide-react';

interface TrialBannerProps {
  trialEndDate: Date;
  tierName: string;
  price: number;
  onDismiss?: () => void;
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('th-TH', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function getDaysLeft(endDate: Date): number {
  const now = new Date();
  const diffTime = endDate.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function TrialBanner({
  trialEndDate,
  tierName,
  price,
  onDismiss,
}: TrialBannerProps) {
  const [daysLeft, setDaysLeft] = useState(getDaysLeft(trialEndDate));
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Update days left every hour
    const interval = setInterval(() => {
      setDaysLeft(getDaysLeft(trialEndDate));
    }, 1000 * 60 * 60);

    return () => clearInterval(interval);
  }, [trialEndDate]);

  if (dismissed || daysLeft <= 0) return null;

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  const isUrgent = daysLeft <= 2;

  return (
    <div
      className={`relative py-3 px-4 text-center ${
        isUrgent
          ? 'bg-gradient-to-r from-orange-500 to-red-500'
          : 'bg-gradient-to-r from-blue-500 to-purple-600'
      }`}
    >
      {onDismiss && (
        <button
          onClick={handleDismiss}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/20 rounded-full transition-colors"
          aria-label="ปิด"
        >
          <X className="w-4 h-4 text-white" />
        </button>
      )}

      <div className="flex items-center justify-center gap-2 text-white">
        {isUrgent ? (
          <Sparkles className="w-5 h-5 animate-pulse" />
        ) : (
          <Clock className="w-5 h-5" />
        )}
        <span className="font-semibold">
          {isUrgent
            ? `⚡ เหลืออีก ${daysLeft} วันสุดท้าย!`
            : `ทดลองใช้ฟรีเหลืออีก ${daysLeft} วัน`}
        </span>
      </div>

      <p className="text-sm mt-1 text-white/90">
        คุณจะถูกเรียกเก็บเงิน ฿{price} สำหรับแพ็คเกจ{tierName} เมื่อวันที่{' '}
        {formatDate(trialEndDate)}
      </p>

      <Link
        href="/profile/billing"
        className="inline-block mt-2 px-4 py-1.5 bg-white/20 hover:bg-white/30 rounded-full text-sm text-white font-medium transition-colors"
      >
        จัดการสมาชิก
      </Link>
    </div>
  );
}

/**
 * Trial Banner Wrapper - fetches trial data from API
 */
export function TrialBannerWrapper() {
  const [trialData, setTrialData] = useState<{
    isTrialing: boolean;
    trialEndDate: Date | null;
    tierName: string;
    price: number;
  } | null>(null);

  useEffect(() => {
    async function fetchTrialStatus() {
      try {
        const res = await fetch('/api/subscriptions');
        if (!res.ok) return;

        const data = await res.json();
        const activeSubscription = data.subscriptions?.find(
          (s: { status: string }) => s.status === 'trialing'
        );

        if (activeSubscription && activeSubscription.current_period_end) {
          // Map tier from price ID
          const priceId = activeSubscription.stripe_price_id;
          let tierName = 'Basic';
          let price = 99;

          if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_VIP) {
            tierName = 'VIP';
            price = 399;
          } else if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO) {
            tierName = 'Pro';
            price = 199;
          }

          setTrialData({
            isTrialing: true,
            trialEndDate: new Date(activeSubscription.current_period_end),
            tierName,
            price,
          });
        }
      } catch (error) {
        console.error('Failed to fetch trial status:', error);
      }
    }

    fetchTrialStatus();
  }, []);

  if (!trialData?.isTrialing || !trialData.trialEndDate) {
    return null;
  }

  return (
    <TrialBanner
      trialEndDate={trialData.trialEndDate}
      tierName={trialData.tierName}
      price={trialData.price}
    />
  );
}

export default TrialBanner;
