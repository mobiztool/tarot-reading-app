/**
 * Trust Signals Component for Pricing Page
 */
'use client';

import { Shield, Clock, RefreshCw, CreditCard } from 'lucide-react';

const TRUST_ITEMS = [
  {
    icon: Shield,
    text: 'ชำระเงินปลอดภัย',
    subtext: 'ผ่าน Stripe',
    color: 'text-green-400',
  },
  {
    icon: Clock,
    text: 'ทดลองใช้ 7 วันฟรี',
    subtext: 'สำหรับผู้ใช้ใหม่',
    color: 'text-blue-400',
  },
  {
    icon: RefreshCw,
    text: 'คืนเงิน 30 วัน',
    subtext: 'ไม่พอใจคืนเต็มจำนวน',
    color: 'text-purple-400',
  },
  {
    icon: CreditCard,
    text: 'รองรับทุกบัตร',
    subtext: 'Visa, Mastercard, JCB',
    color: 'text-orange-400',
  },
];

export function TrustSignals() {
  return (
    <div className="flex flex-wrap justify-center gap-6 md:gap-10 py-8">
      {TRUST_ITEMS.map((item, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className={`p-2 rounded-full bg-white/10 ${item.color}`}>
            <item.icon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-white font-medium text-sm">{item.text}</p>
            <p className="text-purple-300 text-xs">{item.subtext}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
