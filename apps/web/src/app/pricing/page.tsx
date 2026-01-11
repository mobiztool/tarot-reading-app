/**
 * Pricing Page
 * Displays subscription tiers with comparison, FAQ, social proof, and trust signals
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SUBSCRIPTION_TIERS, getPaidTiers } from '@/lib/subscription';
import { SubscriptionTier } from '@/types/subscription';
import { ComparisonTable, TrustSignals, SocialProof, PricingFAQ, AnnualToggle } from '@/components/pricing';
import { Sparkles, AlertCircle, Info } from 'lucide-react';

// Analytics tracking helper
function trackEvent(eventName: string, properties?: Record<string, unknown>) {
  // Send to analytics (Mixpanel, Amplitude, etc.)
  if (typeof window !== 'undefined') {
    console.log('[Analytics]', eventName, properties);
    // TODO: Integrate with real analytics service
    // mixpanel.track(eventName, properties);
  }
}

export default function PricingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState<SubscriptionTier | null>(null);
  const [error, setError] = useState<string | null>(null);
  const pageLoadTime = useRef(Date.now());
  const scrollTracked = useRef({ 25: false, 50: false, 75: false, 100: false });

  const paidTiers = getPaidTiers();
  
  // Get context from URL params (from gate redirect or cancel)
  const recommendedTier = searchParams.get('upgrade') as SubscriptionTier | null;
  const fromSpread = searchParams.get('from');
  const canceled = searchParams.get('canceled') === 'true';

  // Track page view and scroll depth
  useEffect(() => {
    trackEvent('pricing_page_viewed', {
      referrer: document.referrer,
      from_spread: fromSpread,
      recommended_tier: recommendedTier,
      timestamp: new Date().toISOString(),
    });

    const handleScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      
      const thresholds = [25, 50, 75, 100] as const;
      thresholds.forEach((threshold) => {
        if (scrollPercent >= threshold && !scrollTracked.current[threshold]) {
          scrollTracked.current[threshold] = true;
          trackEvent(`pricing_scroll_${threshold}_percent`, {
            time_on_page: Date.now() - pageLoadTime.current,
          });
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [fromSpread, recommendedTier]);

  const handleSubscribe = async (tierId: SubscriptionTier) => {
    setLoading(tierId);
    setError(null);

    // Track tier selection
    trackEvent('pricing_tier_selected', {
      tier: tierId,
      from_spread: fromSpread,
      time_on_page: Date.now() - pageLoadTime.current,
    });

    try {
      const res = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tierId }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          router.push('/auth/login?redirect=/pricing');
          return;
        }
        throw new Error(data.error || 'เกิดข้อผิดพลาด');
      }

      if (data.checkoutUrl) {
        trackEvent('pricing_checkout_redirect', { tier: tierId });
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error('ไม่สามารถสร้าง checkout session ได้');
      }
    } catch (err) {
      trackEvent('pricing_error', { 
        tier: tierId, 
        error: err instanceof Error ? err.message : 'Unknown error' 
      });
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-900 to-indigo-950 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            เลือกแพ็คเกจที่เหมาะกับคุณ
          </h1>
          <p className="text-xl text-purple-200 max-w-2xl mx-auto">
            ปลดล็อคพลังไพ่ยิปซี เข้าถึงการดูดวงแบบพิเศษ และฟีเจอร์มากมาย
          </p>
        </div>

        {/* Canceled Alert */}
        {canceled && (
          <div className="max-w-2xl mx-auto mb-8 bg-blue-900/50 border border-blue-400/50 rounded-xl p-4 flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-white font-semibold">
                การชำระเงินถูกยกเลิก
              </p>
              <p className="text-blue-200 text-sm">
                คุณสามารถเลือกแพ็คเกจและลองใหม่ได้ทุกเมื่อที่พร้อม
              </p>
            </div>
          </div>
        )}

        {/* Context Alert (from gate redirect) */}
        {recommendedTier && fromSpread && (
          <div className="max-w-2xl mx-auto mb-8 bg-purple-800/50 border border-purple-400/50 rounded-xl p-4 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-white font-semibold">
                ปลดล็อก {fromSpread.replace(/_/g, ' ')}
              </p>
              <p className="text-purple-200 text-sm">
                อัปเกรดเป็น {SUBSCRIPTION_TIERS[recommendedTier]?.nameTh || recommendedTier} เพื่อเข้าถึงการ์ดนี้และฟีเจอร์อื่นๆ อีกมากมาย
              </p>
            </div>
          </div>
        )}

        {/* Trust Signals */}
        <TrustSignals />

        {/* Annual Toggle */}
        <AnnualToggle />

        {/* Error Message */}
        {error && (
          <div className="max-w-md mx-auto mb-8 bg-red-500/20 border border-red-500 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {/* Free Tier */}
        <div className="mb-12">
          <div className="max-w-md mx-auto bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-white">
                  {SUBSCRIPTION_TIERS.free.nameTh}
                </h3>
                <p className="text-purple-200 text-sm">
                  {SUBSCRIPTION_TIERS.free.name}
                </p>
              </div>
              <div className="text-2xl font-bold text-white">ฟรี</div>
            </div>
            <ul className="space-y-2 mb-6">
              {SUBSCRIPTION_TIERS.free.featuresTh.map((feature, i) => (
                <li key={i} className="flex items-start text-purple-200">
                  <span className="text-green-400 mr-2">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
            <p className="text-center text-purple-300 text-sm">
              คุณกำลังใช้งานแพ็คเกจนี้อยู่
            </p>
          </div>
        </div>

        {/* Paid Tiers */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {paidTiers.map((tier) => {
            const isRecommended = recommendedTier === tier.id;
            const isPopular = tier.id === 'pro';
            
            return (
              <div
                key={tier.id}
                className={`relative rounded-2xl p-6 border transition-all duration-300 hover:scale-105
                  ${isPopular || isRecommended
                    ? 'bg-gradient-to-b from-purple-800/50 to-indigo-900/50 border-purple-400 shadow-xl shadow-purple-500/20 md:scale-105' 
                    : 'bg-white/5 backdrop-blur-sm border-purple-500/20'}
                  ${tier.vip 
                    ? 'bg-gradient-to-b from-yellow-900/30 to-orange-900/30 border-yellow-500/50' 
                    : ''}
                `}
              >
                {/* Popular Badge */}
                {isPopular && !recommendedTier && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-indigo-600 px-4 py-1 rounded-full text-sm font-bold text-white">
                    🌟 ยอดนิยม
                  </div>
                )}

                {/* Recommended Badge (from gate) */}
                {isRecommended && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-1 rounded-full text-sm font-bold text-white">
                    ✨ แนะนำสำหรับคุณ
                  </div>
                )}

                {/* VIP Badge */}
                {tier.vip && !isRecommended && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 px-4 py-1 rounded-full text-sm font-bold text-white">
                    👑 VIP
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-1">
                    {tier.nameTh}
                  </h3>
                  <p className="text-purple-200 text-sm mb-4">{tier.name}</p>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-white">฿{tier.price}</span>
                    <span className="text-purple-200 ml-1">/เดือน</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {tier.featuresTh.map((feature, i) => (
                    <li key={i} className="flex items-start text-purple-200">
                      <span className="text-green-400 mr-2 flex-shrink-0">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(tier.id)}
                  disabled={loading !== null}
                  className={`w-full py-3 px-6 rounded-xl font-bold transition-all duration-200
                    ${loading === tier.id ? 'opacity-50 cursor-wait' : 'hover:transform hover:-translate-y-1'}
                    ${isPopular || isRecommended
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/30'
                      : tier.vip
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg shadow-orange-500/30'
                        : 'bg-white/10 text-white hover:bg-white/20'}
                  `}
                >
                  {loading === tier.id ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      กำลังดำเนินการ...
                    </span>
                  ) : (
                    `🎁 เริ่มทดลองใช้ฟรี`
                  )}
                </button>

                {/* Trial Info */}
                <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-center">
                  <p className="text-green-300 text-sm font-medium">
                    ✨ ทดลองใช้ฟรี 7 วัน
                  </p>
                  <p className="text-green-200/70 text-xs mt-1">
                    ฿0 วันนี้ • ยกเลิกได้ทุกเมื่อ
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Social Proof */}
        <div className="mb-16">
          <SocialProof userCount={10000} />
        </div>

        {/* Feature Comparison Table */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            เปรียบเทียบคุณสมบัติ
          </h2>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20 overflow-hidden">
            <ComparisonTable />
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            คำถามที่พบบ่อย
          </h2>
          <PricingFAQ />
        </div>

        {/* Trust Signals Bottom */}
        <div className="mb-8">
          <TrustSignals />
        </div>

        {/* Back Link */}
        <div className="text-center">
          <a 
            href="/" 
            className="text-purple-300 hover:text-white transition-colors"
          >
            ← กลับหน้าหลัก
          </a>
        </div>
      </div>
    </div>
  );
}
