/**
 * Retention Offers Component
 * Shows special offers to retain users before cancellation
 * Story 6.11 - Cancellation & Retention Flow
 */
'use client';

import { useState } from 'react';
import { Pause, Tag, ArrowDown, Gift, Sparkles } from 'lucide-react';
import { SubscriptionTier } from '@/types/subscription';
import { getTierNameTh, TIER_PRICES } from '@/lib/subscription';

interface RetentionOffer {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  cta: string;
  action: string;
  highlight?: boolean;
}

interface RetentionOffersProps {
  reason: string;
  currentTier: SubscriptionTier;
  onAcceptOffer: (offer: RetentionOffer) => Promise<void>;
  onDecline: () => void;
  isLoading?: boolean;
}

function getRetentionOffers(reason: string, currentTier: SubscriptionTier): RetentionOffer[] {
  const offers: RetentionOffer[] = [];
  const currentPrice = TIER_PRICES[currentTier] || 0;
  const discountedPrice = Math.round(currentPrice * 0.8);
  const savings = currentPrice - discountedPrice;

  // Discount offer - especially for price-sensitive users
  if (reason === 'too_expensive' && currentTier !== 'free') {
    offers.push({
      id: 'discount',
      title: 'ส่วนลด 20% เป็นเวลา 3 เดือน',
      description: `เพียง ฿${discountedPrice}/เดือน ประหยัด ฿${savings}/เดือน`,
      icon: <Tag className="w-6 h-6 text-green-400" />,
      cta: 'รับส่วนลด',
      action: 'discount_20_3months',
      highlight: true,
    });
  }

  // Pause offer - works for most cases
  offers.push({
    id: 'pause',
    title: 'หยุดพักชั่วคราว 1-3 เดือน',
    description: 'พักการเรียกเก็บเงินโดยไม่สูญเสียข้อมูล สามารถกลับมาใช้ได้ทุกเมื่อ',
    icon: <Pause className="w-6 h-6 text-orange-400" />,
    cta: 'หยุดชั่วคราว',
    action: 'pause',
    highlight: reason === 'temporary' || reason === 'not_using',
  });

  // Downgrade offer - for over-subscribed users
  if ((currentTier === 'vip' || currentTier === 'pro') && 
      (reason === 'not_using' || reason === 'too_expensive')) {
    const downgradeTier = currentTier === 'vip' ? 'pro' : 'basic';
    const downgradePrice = TIER_PRICES[downgradeTier] || 0;
    
    offers.push({
      id: 'downgrade',
      title: `ลดระดับเป็น ${getTierNameTh(downgradeTier as SubscriptionTier)}`,
      description: `ลดค่าใช้จ่ายเหลือ ฿${downgradePrice}/เดือน แต่ยังคงเข้าถึงฟีเจอร์หลักได้`,
      icon: <ArrowDown className="w-6 h-6 text-blue-400" />,
      cta: 'ลดระดับ',
      action: `downgrade_${downgradeTier}`,
    });
  }

  // Special offer for missing features
  if (reason === 'missing_features') {
    offers.push({
      id: 'feedback',
      title: 'บอกเราว่าต้องการอะไร',
      description: 'เราอยากฟังความคิดเห็นของคุณ ฟีเจอร์ไหนที่คุณต้องการ?',
      icon: <Gift className="w-6 h-6 text-purple-400" />,
      cta: 'ให้ feedback',
      action: 'request_feature',
    });
  }

  return offers;
}

function RetentionOfferCard({ 
  offer, 
  onAccept,
  isLoading,
}: { 
  offer: RetentionOffer; 
  onAccept: () => void;
  isLoading: boolean;
}) {
  return (
    <div 
      className={`
        relative p-4 rounded-xl border-2 transition-all
        ${offer.highlight 
          ? 'border-purple-500 bg-purple-500/10' 
          : 'border-slate-600/50 bg-slate-800/50 hover:border-purple-500/50'
        }
      `}
    >
      {offer.highlight && (
        <div className="absolute -top-3 left-4 px-2 py-0.5 bg-purple-500 text-white text-xs font-medium rounded-full flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          แนะนำ
        </div>
      )}
      
      <div className="flex items-start gap-4">
        <div className="p-3 bg-slate-700/50 rounded-xl">
          {offer.icon}
        </div>
        
        <div className="flex-1">
          <h4 className="font-semibold text-white mb-1">{offer.title}</h4>
          <p className="text-sm text-slate-300 mb-3">{offer.description}</p>
          
          <button
            onClick={onAccept}
            disabled={isLoading}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-colors
              ${offer.highlight
                ? 'bg-purple-600 hover:bg-purple-500 text-white'
                : 'bg-slate-700 hover:bg-slate-600 text-white'
              }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            {offer.cta}
          </button>
        </div>
      </div>
    </div>
  );
}

export function RetentionOffers({
  reason,
  currentTier,
  onAcceptOffer,
  onDecline,
  isLoading = false,
}: RetentionOffersProps) {
  const [selectedOffer, setSelectedOffer] = useState<string | null>(null);
  const offers = getRetentionOffers(reason, currentTier);

  const handleAccept = async (offer: RetentionOffer) => {
    setSelectedOffer(offer.id);
    await onAcceptOffer(offer);
    setSelectedOffer(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="text-4xl mb-3">🙏</div>
        <h3 className="text-xl font-bold text-white mb-2">รอก่อน!</h3>
        <p className="text-purple-200">
          เราอยากเสนอข้อเสนอพิเศษให้คุณก่อนที่จะตัดสินใจ
        </p>
      </div>

      {/* Offers */}
      <div className="space-y-4">
        {offers.map((offer) => (
          <RetentionOfferCard
            key={offer.id}
            offer={offer}
            onAccept={() => handleAccept(offer)}
            isLoading={isLoading || selectedOffer === offer.id}
          />
        ))}
      </div>

      {/* Decline Button */}
      <button
        onClick={onDecline}
        disabled={isLoading}
        className="w-full py-3 text-slate-400 hover:text-white transition-colors text-sm disabled:opacity-50"
      >
        ไม่ล่ะ ขอบคุณ ยกเลิกต่อ
      </button>
    </div>
  );
}

export default RetentionOffers;
