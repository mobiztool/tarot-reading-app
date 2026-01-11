/**
 * Billing & Subscription History Page
 * Allows users to manage their subscriptions and view billing history
 */

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { SubscriptionCard } from '@/components/subscription';
import { AutoSync } from '@/components/subscription/AutoSync';
import { getTierNameTh, SUBSCRIPTION_TIERS } from '@/lib/subscription';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import { SubscriptionTier } from '@/types/subscription';

export const metadata = {
  title: 'การเรียกเก็บเงิน - ไพ่ยิปซีออนไลน์',
  description: 'จัดการการสมัครสมาชิกและดูประวัติการชำระเงิน',
};

/**
 * Map Stripe Price ID to subscription tier
 */
function getTierFromPriceId(priceId: string): SubscriptionTier {
  const basicPriceId = process.env.STRIPE_PRICE_ID_BASIC;
  const proPriceId = process.env.STRIPE_PRICE_ID_PRO;
  const vipPriceId = process.env.STRIPE_PRICE_ID_VIP;

  if (priceId === vipPriceId) return 'vip';
  if (priceId === proPriceId) return 'pro';
  if (priceId === basicPriceId) return 'basic';
  return 'free';
}

export default async function BillingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect=/profile/billing');
  }

  // Get user's subscriptions
  const subscriptions = await prisma.subscription.findMany({
    where: { user_id: user.id },
    orderBy: { created_at: 'desc' },
  });

  // Determine current tier from active subscription
  const activeSubscription = subscriptions.find(
    s => s.status === 'active' || s.status === 'trialing' || s.status === 'past_due'
  );
  
  const currentTier: SubscriptionTier = activeSubscription 
    ? getTierFromPriceId(activeSubscription.stripe_price_id) 
    : 'free';

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-900 to-indigo-950">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Auto-sync when returning from Stripe checkout */}
        <AutoSync />
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            การเรียกเก็บเงิน
          </h1>
          <p className="text-purple-200">
            จัดการการสมัครสมาชิกและดูประวัติการชำระเงิน
          </p>
        </div>

        {/* Current Tier */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-purple-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200 text-sm mb-1">แพ็คเกจปัจจุบัน</p>
              <p className="text-2xl font-bold text-white">
                {getTierNameTh(currentTier)}
              </p>
            </div>
            <div className={`px-4 py-2 rounded-xl text-lg font-bold
              ${currentTier === 'vip' ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' : ''}
              ${currentTier === 'pro' ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white' : ''}
              ${currentTier === 'basic' ? 'bg-gradient-to-r from-blue-400 to-cyan-500 text-white' : ''}
              ${currentTier === 'free' ? 'bg-gray-600 text-white' : ''}
            `}>
              {SUBSCRIPTION_TIERS[currentTier].price === 0 
                ? 'ฟรี' 
                : `฿${SUBSCRIPTION_TIERS[currentTier].price}/เดือน`}
            </div>
          </div>
        </div>

        {/* Trial Alert */}
        {activeSubscription?.status === 'trialing' && (
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/50 rounded-2xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="text-3xl">⏰</div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">
                  คุณกำลังทดลองใช้งานฟรี
                </h3>
                <p className="text-blue-200 mb-3">
                  ทดลองใช้ฟรีจนถึง:{' '}
                  <strong className="text-white">
                    {format(new Date(activeSubscription.current_period_end), 'd MMMM yyyy', { locale: th })}
                  </strong>
                </p>
                <p className="text-blue-200 mb-4">
                  หลังจากนั้นจะเริ่มเรียกเก็บเงิน{' '}
                  <strong className="text-white">
                    ฿{SUBSCRIPTION_TIERS[getTierFromPriceId(activeSubscription.stripe_price_id)].price}/เดือน
                  </strong>
                </p>
                <div className="flex gap-3">
                  <a
                    href="/pricing"
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm font-medium"
                  >
                    ต้องการสมาชิกถาวร
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Active Subscription */}
        {activeSubscription ? (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">
              การสมัครสมาชิกที่ใช้งาน
            </h2>
            <SubscriptionCard
              subscription={{
                id: activeSubscription.id,
                tier: getTierFromPriceId(activeSubscription.stripe_price_id),
                status: activeSubscription.status,
                current_period_end: activeSubscription.current_period_end,
                cancel_at: activeSubscription.cancel_at,
                canceled_at: activeSubscription.canceled_at,
                pendingDowngrade: (activeSubscription.metadata as { pendingDowngrade?: { newTier: SubscriptionTier; effectiveDate: string } })?.pendingDowngrade || null,
              }}
            />
          </div>
        ) : (
          <div className="bg-purple-900/50 rounded-2xl p-8 text-center mb-8 border border-purple-500/20">
            <div className="text-4xl mb-4">✨</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              อัพเกรดเพื่อปลดล็อคฟีเจอร์เพิ่มเติม
            </h3>
            <p className="text-purple-200 mb-6">
              เข้าถึงการ์ดทั้งหมด คำทำนายเจาะลึก และอีกมากมาย
            </p>
            <a
              href="/pricing"
              className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-indigo-700 transition-all"
            >
              ดูแพ็คเกจทั้งหมด
            </a>
          </div>
        )}

        {/* Subscription History */}
        {subscriptions.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">
              ประวัติการสมัครสมาชิก
            </h2>
            <div className="bg-white/5 rounded-xl border border-purple-500/20 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-purple-500/20">
                    <th className="text-left text-purple-200 text-sm font-medium px-4 py-3">
                      แพ็คเกจ
                    </th>
                    <th className="text-left text-purple-200 text-sm font-medium px-4 py-3">
                      สถานะ
                    </th>
                    <th className="text-left text-purple-200 text-sm font-medium px-4 py-3">
                      วันที่เริ่ม
                    </th>
                    <th className="text-left text-purple-200 text-sm font-medium px-4 py-3">
                      วันหมดอายุ
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptions.map((sub) => (
                    <tr key={sub.id} className="border-b border-purple-500/10 last:border-0">
                      <td className="px-4 py-3 text-white font-medium">
                        {getTierNameTh(getTierFromPriceId(sub.stripe_price_id))}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                          ${sub.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                          ${sub.status === 'trialing' ? 'bg-blue-100 text-blue-800' : ''}
                          ${sub.status === 'canceled' ? 'bg-gray-100 text-gray-800' : ''}
                          ${sub.status === 'past_due' ? 'bg-yellow-100 text-yellow-800' : ''}
                          ${sub.status === 'paused' ? 'bg-orange-100 text-orange-800' : ''}
                        `}>
                          {sub.status === 'active' && 'ใช้งาน'}
                          {sub.status === 'trialing' && 'ทดลอง'}
                          {sub.status === 'canceled' && 'ยกเลิก'}
                          {sub.status === 'past_due' && 'ค้างชำระ'}
                          {sub.status === 'paused' && 'หยุดชั่วคราว'}
                          {!['active', 'trialing', 'canceled', 'past_due', 'paused'].includes(sub.status) && sub.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-purple-200 text-sm">
                        {format(new Date(sub.created_at), 'd MMM yyyy', { locale: th })}
                      </td>
                      <td className="px-4 py-3 text-purple-200 text-sm">
                        {format(new Date(sub.current_period_end), 'd MMM yyyy', { locale: th })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Invoice Link */}
        <div className="mt-8 bg-white/5 rounded-xl p-6 border border-purple-500/20">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">
                ใบแจ้งหนี้และใบเสร็จ
              </h3>
              <p className="text-purple-300 text-sm">
                ดูประวัติการชำระเงินและดาวน์โหลดใบเสร็จ
              </p>
            </div>
            <a
              href="/profile/invoices"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              ดูใบแจ้งหนี้
              <span>→</span>
            </a>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <a
            href="/profile"
            className="text-purple-300 hover:text-white transition-colors"
          >
            ← กลับไปโปรไฟล์
          </a>
        </div>
      </div>
    </div>
  );
}
