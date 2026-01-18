'use client';

/**
 * Premium Dashboard Page
 * Story 9.5: Premium User Dashboard & Statistics
 * 
 * Features:
 * - Reading statistics: total readings, by spread type, frequency
 * - Favorite cards: most drawn cards
 * - Growth insights: reading trends over time
 * - Streak tracking: consecutive days with readings
 * - Milestones: badges for achievements
 * - VIP: AI-generated monthly summary
 */

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth, useAnalytics } from '@/lib/hooks';
import { usePremiumStatus } from '@/lib/hooks/usePremiumStatus';
import { Header } from '@/components/layout/Header';
import { PageLoader } from '@/components/ui/MysticalLoader';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { ReadingActivityChart } from '@/components/dashboard/ReadingActivityChart';
import { SpreadDistributionChart } from '@/components/dashboard/SpreadDistributionChart';
import { StreakWidget } from '@/components/dashboard/StreakWidget';
import { BadgesWidget } from '@/components/dashboard/BadgesWidget';
import { RecentReadingsWidget } from '@/components/dashboard/RecentReadingsWidget';
import { SubscriptionWidget } from '@/components/dashboard/SubscriptionWidget';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { VIPInsightsWidget } from '@/components/dashboard/VIPInsightsWidget';
import { ShareJourneyButton } from '@/components/dashboard/ShareJourneyButton';
import type { DashboardData } from '@/lib/dashboard/types';

export default function InsightsPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { isPro, isVip, isLoading: premiumLoading, tier } = usePremiumStatus();
  const { track } = useAnalytics();

  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  const fetchDashboardData = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/dashboard/stats?timeRange=${selectedTimeRange}`);
      
      if (!response.ok) {
        if (response.status === 403) {
          router.push('/gate/premium?spread=insights&tier=pro');
          return;
        }
        throw new Error('Failed to fetch dashboard data');
      }

      const data = await response.json();
      setDashboardData(data);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError('ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่');
    } finally {
      setIsLoading(false);
    }
  }, [user, selectedTimeRange, router]);

  // Auth check
  useEffect(() => {
    if (!authLoading && !premiumLoading) {
      if (!user) {
        router.push('/auth/login?redirectTo=/profile/insights');
        return;
      }

      // Pro/VIP access check
      if (!isPro) {
        router.push('/gate/premium?spread=insights&tier=pro');
        return;
      }

      track('dashboard_viewed', { tier });
      fetchDashboardData();
    }
  }, [user, authLoading, premiumLoading, isPro, router, track, tier, fetchDashboardData]);

  // Loading state
  if (authLoading || premiumLoading || isLoading) {
    return (
      <>
        <Header />
        <PageLoader message="กำลังโหลดแดชบอร์ด..." />
      </>
    );
  }

  // Access denied (shouldn't reach here due to redirects)
  if (!user || !isPro) {
    return null;
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-950/20 to-slate-900 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <span className="text-4xl">📊</span>
                แดชบอร์ดสถิติ
                {isVip && (
                  <span className="px-3 py-1 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 text-sm font-bold rounded-full">
                    VIP
                  </span>
                )}
              </h1>
              <p className="text-slate-400 mt-2">
                ติดตามการเดินทางไพ่ทาโรต์ของคุณ
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Time Range Selector */}
              <select
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value as typeof selectedTimeRange)}
                className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              >
                <option value="7d">7 วันล่าสุด</option>
                <option value="30d">30 วันล่าสุด</option>
                <option value="90d">90 วันล่าสุด</option>
                <option value="all">ทั้งหมด</option>
              </select>

              {/* Share Journey */}
              <ShareJourneyButton stats={dashboardData?.summary} />
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400 text-center">
              ❌ {error}
              <button
                onClick={fetchDashboardData}
                className="ml-4 underline hover:no-underline"
              >
                ลองใหม่
              </button>
            </div>
          )}

          {dashboardData && (
            <>
              {/* Stats Overview */}
              <DashboardStats stats={dashboardData.summary} />

              {/* Main Grid Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
                {/* Left Column - Charts (spans 2 columns on large screens) */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Reading Activity Chart */}
                  <ReadingActivityChart
                    data={dashboardData.activityData}
                    timeRange={selectedTimeRange}
                  />

                  {/* Spread Distribution */}
                  <SpreadDistributionChart
                    data={dashboardData.spreadDistribution}
                  />

                  {/* VIP Only: AI Insights */}
                  {isVip && (
                    <VIPInsightsWidget
                      insights={dashboardData.aiInsights}
                      favoriteCards={dashboardData.favoriteCards}
                    />
                  )}
                </div>

                {/* Right Column - Widgets */}
                <div className="space-y-6">
                  {/* Quick Actions */}
                  <QuickActions
                    favoriteSpread={dashboardData.summary.favoriteSpread}
                  />

                  {/* Subscription Status */}
                  <SubscriptionWidget
                    tier={tier}
                    subscription={dashboardData.subscription}
                    isVip={isVip}
                  />

                  {/* Streak Tracking */}
                  <StreakWidget
                    currentStreak={dashboardData.summary.currentStreak}
                    longestStreak={dashboardData.summary.longestStreak}
                  />

                  {/* Badges */}
                  <BadgesWidget
                    badges={dashboardData.badges}
                    totalReadings={dashboardData.summary.totalReadings}
                  />

                  {/* Recent Readings */}
                  <RecentReadingsWidget
                    readings={dashboardData.recentReadings}
                  />
                </div>
              </div>

              {/* Bottom Navigation */}
              <div className="mt-8 flex flex-wrap gap-4 justify-center">
                <Link
                  href="/history"
                  className="px-6 py-3 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 rounded-xl text-slate-300 transition-colors"
                >
                  📜 ดูประวัติทั้งหมด
                </Link>
                <Link
                  href="/profile/patterns"
                  className="px-6 py-3 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 rounded-xl text-slate-300 transition-colors"
                >
                  🔍 วิเคราะห์รูปแบบ
                </Link>
                <Link
                  href="/reading"
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-xl text-white font-medium transition-colors"
                >
                  🔮 ดูดวงใหม่
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
