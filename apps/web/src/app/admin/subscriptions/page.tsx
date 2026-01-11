/**
 * Admin Subscriptions Dashboard
 * Comprehensive subscription metrics and analytics
 * Story 6.8 - Subscription Analytics & Metrics
 */

import { Suspense } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import {
  getRevenueMetrics,
  getRevenueByTier,
} from '@/lib/analytics/subscription/revenue';
import {
  getSubscriptionMetrics,
  getTierDistribution,
} from '@/lib/analytics/subscription/metrics';
import { getConversionFunnel } from '@/lib/analytics/subscription/conversion';
import { getRetentionByTier, getAverageSubscriptionLifetime } from '@/lib/analytics/subscription/retention';
import { getLTVSummary } from '@/lib/analytics/subscription/ltv';
import { SUBSCRIPTION_TIERS } from '@/lib/subscription';
import {
  TrendingUp,
  TrendingDown,
  Users,
  CreditCard,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Target,
  Heart,
  ExternalLink,
} from 'lucide-react';

export const metadata = {
  title: 'Subscription Analytics - Admin Dashboard',
  description: 'ดูข้อมูลสถิติการสมัครสมาชิกและรายได้',
};

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default async function AdminSubscriptionsPage() {
  // Auth check
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login?redirectTo=/admin/subscriptions');
  }

  // Check admin role (simple check - can be enhanced)
  const isAdmin = user.email?.endsWith('@admin.tarotapp.com') ||
    user.user_metadata?.role === 'admin';

  if (!isAdmin) {
    redirect('/');
  }

  // Fetch all metrics in parallel
  const [
    revenueMetrics,
    revenueByTier,
    subscriptionMetrics,
    tierDistribution,
    conversionFunnel,
    retentionByTier,
    avgLifetime,
    ltvSummary,
  ] = await Promise.all([
    getRevenueMetrics(),
    getRevenueByTier(),
    getSubscriptionMetrics('month'),
    getTierDistribution(),
    getConversionFunnel(),
    getRetentionByTier(),
    getAverageSubscriptionLifetime(),
    getLTVSummary(),
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-950/20 to-slate-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin"
            className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1 mb-2"
          >
            ← กลับไปหน้า Admin
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <BarChart3 className="w-8 h-8 text-purple-400" />
                Subscription Analytics
              </h1>
              <p className="text-slate-400 mt-1">
                ข้อมูลสถิติการสมัครสมาชิกและรายได้
              </p>
            </div>
            <a
              href="https://dashboard.stripe.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Stripe Dashboard
            </a>
          </div>
        </div>

        {/* Revenue Cards */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-400" />
            รายได้
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard
              title="MRR"
              value={`฿${revenueMetrics.mrr.toLocaleString()}`}
              subtitle="รายได้รายเดือน"
              icon={<CreditCard className="w-5 h-5" />}
              color="green"
            />
            <MetricCard
              title="ARR"
              value={`฿${revenueMetrics.arr.toLocaleString()}`}
              subtitle="รายได้รายปี"
              icon={<TrendingUp className="w-5 h-5" />}
              color="blue"
            />
            <MetricCard
              title="Revenue/User"
              value={`฿${revenueMetrics.revenuePerUser.toFixed(0)}`}
              subtitle="รายได้ต่อผู้ใช้"
              icon={<Users className="w-5 h-5" />}
              color="purple"
            />
            <MetricCard
              title="Growth"
              value={`${revenueMetrics.monthlyGrowth > 0 ? '+' : ''}${revenueMetrics.monthlyGrowth.toFixed(1)}%`}
              subtitle="เทียบเดือนก่อน"
              icon={revenueMetrics.monthlyGrowth >= 0 ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
              color={revenueMetrics.monthlyGrowth >= 0 ? 'green' : 'red'}
            />
          </div>
        </section>

        {/* Subscription Metrics */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-400" />
            สมาชิก (30 วันล่าสุด)
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <MetricCard
              title="Active"
              value={subscriptionMetrics.activeSubscriptions}
              subtitle="สมาชิกปัจจุบัน"
              color="green"
            />
            <MetricCard
              title="New"
              value={`+${subscriptionMetrics.newSubscriptions}`}
              subtitle="สมัครใหม่"
              color="blue"
            />
            <MetricCard
              title="Trialing"
              value={subscriptionMetrics.trialingSubscriptions}
              subtitle="ทดลองใช้"
              color="yellow"
            />
            <MetricCard
              title="Canceled"
              value={subscriptionMetrics.cancellations}
              subtitle="ยกเลิก"
              color="red"
            />
            <MetricCard
              title="Churn Rate"
              value={`${subscriptionMetrics.churnRate}%`}
              subtitle="อัตราการยกเลิก"
              color={subscriptionMetrics.churnRate > 5 ? 'red' : 'green'}
            />
          </div>
        </section>

        {/* Tier Distribution & Revenue by Tier */}
        <section className="mb-8 grid md:grid-cols-2 gap-6">
          {/* Tier Distribution */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              การกระจายตาม Tier
            </h3>
            <div className="space-y-4">
              {tierDistribution.map((tier) => (
                <div key={tier.tier} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">{tier.tierName}</span>
                    <span className="text-white font-medium">
                      {tier.count} ({tier.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${getTierColor(tier.tier)}`}
                      style={{ width: `${tier.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue by Tier */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              รายได้ตาม Tier
            </h3>
            <div className="space-y-4">
              {revenueByTier.map((tier) => (
                <div key={tier.tier} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                  <div>
                    <span className="text-white font-medium">{tier.tierName}</span>
                    <span className="text-slate-400 text-sm ml-2">
                      ({tier.activeSubscriptions} สมาชิก)
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold">
                      ฿{tier.mrr.toLocaleString()}/mo
                    </div>
                    <div className="text-slate-400 text-sm">
                      {tier.percentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Conversion Funnel */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-400" />
            Conversion Funnel
          </h2>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-center">
              <FunnelStep
                label="ผู้ใช้ทั้งหมด"
                value={conversionFunnel.totalUsers}
                isFirst
              />
              <FunnelStep
                label="ผู้ใช้ฟรี"
                value={conversionFunnel.freeUsers}
              />
              <FunnelStep
                label="สมัครแล้ว"
                value={conversionFunnel.upgradedUsers}
                highlight
              />
              <FunnelStep
                label="Basic"
                value={conversionFunnel.basicUsers}
              />
              <FunnelStep
                label="Pro"
                value={conversionFunnel.proUsers}
              />
              <FunnelStep
                label="VIP"
                value={conversionFunnel.vipUsers}
                isLast
              />
            </div>
            <div className="mt-4 pt-4 border-t border-slate-700 flex justify-center gap-8 text-center">
              <div>
                <div className="text-2xl font-bold text-green-400">
                  {conversionFunnel.conversionRate}%
                </div>
                <div className="text-slate-400 text-sm">Conversion Rate</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400">
                  {conversionFunnel.basicToProRate}%
                </div>
                <div className="text-slate-400 text-sm">Basic → Pro</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400">
                  {conversionFunnel.proToVipRate}%
                </div>
                <div className="text-slate-400 text-sm">Pro → VIP</div>
              </div>
            </div>
          </div>
        </section>

        {/* Retention & LTV */}
        <section className="mb-8 grid md:grid-cols-2 gap-6">
          {/* Retention by Tier */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-400" />
              Retention by Tier (30+ days)
            </h3>
            <div className="space-y-4">
              {retentionByTier.map((tier) => (
                <div key={tier.tier} className="p-3 bg-slate-700/30 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-medium">{tier.tierName}</span>
                    <span className={`font-bold ${tier.retentionRate >= 80 ? 'text-green-400' : tier.retentionRate >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {tier.retentionRate}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-400">
                    <span>Active: {tier.stillActive}/{tier.totalSubscriptions}</span>
                    <span>Avg: {tier.avgDaysActive} days</span>
                  </div>
                </div>
              ))}
              <div className="pt-3 border-t border-slate-700">
                <div className="text-slate-400 text-sm">
                  Average Subscription Lifetime: <span className="text-white font-medium">{avgLifetime} days</span>
                </div>
              </div>
            </div>
          </div>

          {/* LTV Summary */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-400" />
              Lifetime Value (LTV)
            </h3>
            <div className="space-y-4">
              {ltvSummary.byTier.map((tier) => (
                <div key={tier.tier} className="p-3 bg-slate-700/30 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-medium">{tier.tierName}</span>
                    <span className="text-green-400 font-bold">
                      ฿{tier.ltv.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-400">
                    <span>฿{tier.monthlyPrice}/mo × {tier.avgLifetimeMonths} months</span>
                    <span>Sample: {tier.sampleSize}</span>
                  </div>
                </div>
              ))}
              <div className="pt-3 border-t border-slate-700 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-slate-400 text-sm">Average LTV</div>
                  <div className="text-xl font-bold text-white">
                    ฿{ltvSummary.averageLTV.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 text-sm">Total Projected LTV</div>
                  <div className="text-xl font-bold text-green-400">
                    ฿{ltvSummary.totalProjectedLTV.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <QuickActionCard
              title="ดูรายละเอียดผู้ใช้"
              href="/admin/users"
              icon="👥"
            />
            <QuickActionCard
              title="Stripe Customers"
              href="https://dashboard.stripe.com/customers"
              icon="💳"
              external
            />
            <QuickActionCard
              title="Stripe Subscriptions"
              href="https://dashboard.stripe.com/subscriptions"
              icon="📊"
              external
            />
            <QuickActionCard
              title="Stripe Revenue"
              href="https://dashboard.stripe.com/reports/revenue"
              icon="💰"
              external
            />
          </div>
        </section>
      </div>
    </div>
  );
}

// ============================================================================
// Helper Components
// ============================================================================

function MetricCard({
  title,
  value,
  subtitle,
  icon,
  color = 'blue',
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: 'green' | 'blue' | 'purple' | 'yellow' | 'red';
}) {
  const colorClasses = {
    green: 'text-green-400 bg-green-500/10 border-green-500/20',
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    yellow: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
    red: 'text-red-400 bg-red-500/10 border-red-500/20',
  };

  return (
    <div className={`rounded-xl border p-4 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-slate-400">{title}</span>
        {icon && <span className={colorClasses[color].split(' ')[0]}>{icon}</span>}
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      {subtitle && <div className="text-xs text-slate-400 mt-1">{subtitle}</div>}
    </div>
  );
}

function FunnelStep({
  label,
  value,
  isFirst,
  isLast,
  highlight,
}: {
  label: string;
  value: number;
  isFirst?: boolean;
  isLast?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className={`relative ${highlight ? 'scale-105' : ''}`}>
      <div className={`p-4 rounded-lg ${highlight ? 'bg-purple-600/30 border border-purple-500' : 'bg-slate-700/50'}`}>
        <div className="text-2xl font-bold text-white">{value}</div>
        <div className="text-xs text-slate-400">{label}</div>
      </div>
      {!isLast && (
        <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2 text-slate-600">
          →
        </div>
      )}
    </div>
  );
}

function QuickActionCard({
  title,
  href,
  icon,
  external,
}: {
  title: string;
  href: string;
  icon: string;
  external?: boolean;
}) {
  const Component = external ? 'a' : Link;
  const props = external ? { target: '_blank', rel: 'noopener noreferrer' } : {};

  return (
    <Component
      href={href}
      {...props}
      className="flex items-center gap-3 p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl hover:bg-slate-700/50 hover:border-slate-600 transition-colors"
    >
      <span className="text-2xl">{icon}</span>
      <div className="flex-1">
        <span className="text-white text-sm font-medium">{title}</span>
      </div>
      {external && <ExternalLink className="w-4 h-4 text-slate-400" />}
    </Component>
  );
}

function getTierColor(tier: string): string {
  switch (tier) {
    case 'free':
      return 'bg-gray-500';
    case 'basic':
      return 'bg-blue-500';
    case 'pro':
      return 'bg-purple-500';
    case 'vip':
      return 'bg-amber-500';
    default:
      return 'bg-slate-500';
  }
}
