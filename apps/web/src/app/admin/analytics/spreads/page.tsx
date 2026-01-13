'use client';

/**
 * Spread Analytics Dashboard (Story 5.7)
 * 
 * Admin-only dashboard for viewing spread usage metrics
 */

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks';
import Link from 'next/link';
import { PageLoader } from '@/components/ui/MysticalLoader';

// =============================================================================
// TYPES
// =============================================================================

interface SpreadMetric {
  spreadType: string;
  totalReadings: number;
  uniqueUsers: number;
  completionRate: number;
  avgDurationMs: number;
  repeatRate: number;
}

interface ConversionFunnel {
  spreadType: string;
  gateShown: number;
  loginClicked: number;
  signupCompleted: number;
  spreadCompleted: number;
  gateToLoginRate: number;
  loginToSignupRate: number;
  signupToCompletionRate: number;
  overallConversionRate: number;
}

interface RetentionMetric {
  spreadType: string;
  d1Retention: number;
  d7Retention: number;
  d30Retention: number;
  cohortSize: number;
}

interface OverviewMetrics {
  totalReadings: number;
  totalUsers: number;
  avgCompletionRate: number;
  avgDurationMs: number;
}

interface DashboardData {
  overview?: OverviewMetrics;
  spreadMetrics?: SpreadMetric[];
  conversionFunnels?: ConversionFunnel[];
  retentionMetrics?: RetentionMetric[];
  topSpread?: string;
  dateRange?: { start: string; end: string };
}

// =============================================================================
// HELPERS
// =============================================================================

const SPREAD_NAMES: Record<string, string> = {
  daily: 'ดูดวงประจำวัน',
  three_card: 'ไพ่ 3 ใบ',
  love_relationships: 'ความรัก',
  career_money: 'การงานและการเงิน',
  yes_no: 'ใช่/ไม่ใช่',
};

const SPREAD_ICONS: Record<string, string> = {
  daily: '☀️',
  three_card: '🌙',
  love_relationships: '💕',
  career_money: '💼',
  yes_no: '❓',
};

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${Math.round(ms / 1000)}s`;
  return `${Math.round(ms / 60000)}m`;
}

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

// =============================================================================
// COMPONENTS
// =============================================================================

function MetricCard({ 
  title, 
  value, 
  subtitle, 
  icon 
}: { 
  title: string; 
  value: string | number; 
  subtitle?: string;
  icon?: string;
}) {
  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-slate-400 text-sm">{title}</span>
        {icon && <span className="text-2xl">{icon}</span>}
      </div>
      <div className="text-3xl font-bold text-white">{value}</div>
      {subtitle && <div className="text-slate-500 text-sm mt-1">{subtitle}</div>}
    </div>
  );
}

function SpreadComparisonChart({ metrics }: { metrics: SpreadMetric[] }) {
  const maxReadings = Math.max(...metrics.map(m => m.totalReadings), 1);
  
  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-6">📊 Spread Popularity</h3>
      <div className="space-y-4">
        {metrics.map((metric) => (
          <div key={metric.spreadType} className="flex items-center gap-4">
            <span className="text-2xl w-8">{SPREAD_ICONS[metric.spreadType]}</span>
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span className="text-slate-300 text-sm">
                  {SPREAD_NAMES[metric.spreadType]}
                </span>
                <span className="text-white font-medium">
                  {formatNumber(metric.totalReadings)}
                </span>
              </div>
              <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                  style={{ width: `${(metric.totalReadings / maxReadings) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ConversionFunnelChart({ funnel }: { funnel: ConversionFunnel }) {
  const steps = [
    { label: 'Gate Shown', value: funnel.gateShown, color: 'bg-blue-500' },
    { label: 'Login Clicked', value: funnel.loginClicked, color: 'bg-purple-500' },
    { label: 'Signup', value: funnel.signupCompleted, color: 'bg-pink-500' },
    { label: 'Completed', value: funnel.spreadCompleted, color: 'bg-green-500' },
  ];
  
  const maxValue = Math.max(...steps.map(s => s.value), 1);

  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
      <h4 className="text-md font-semibold text-white mb-4 flex items-center gap-2">
        {SPREAD_ICONS[funnel.spreadType]}
        {SPREAD_NAMES[funnel.spreadType]}
        <span className="text-sm text-slate-400 font-normal">
          ({funnel.overallConversionRate}% conversion)
        </span>
      </h4>
      <div className="space-y-3">
        {steps.map((step, index) => (
          <div key={step.label} className="relative">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-400">{step.label}</span>
              <span className="text-white">{formatNumber(step.value)}</span>
            </div>
            <div className="h-6 bg-slate-700/50 rounded overflow-hidden">
              <div 
                className={`h-full ${step.color} transition-all duration-500 flex items-center justify-end pr-2`}
                style={{ width: `${(step.value / maxValue) * 100}%` }}
              >
                {index > 0 && step.value > 0 && (
                  <span className="text-white text-xs font-medium">
                    {Math.round((step.value / steps[index - 1].value) * 100)}%
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RetentionTable({ metrics }: { metrics: RetentionMetric[] }) {
  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-6">📈 Retention by Signup Spread</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-slate-400 border-b border-slate-700">
              <th className="text-left py-3 px-2">Spread</th>
              <th className="text-center py-3 px-2">Cohort</th>
              <th className="text-center py-3 px-2">D1</th>
              <th className="text-center py-3 px-2">D7</th>
              <th className="text-center py-3 px-2">D30</th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((m) => (
              <tr key={m.spreadType} className="border-b border-slate-700/50">
                <td className="py-3 px-2">
                  <span className="mr-2">{SPREAD_ICONS[m.spreadType]}</span>
                  {SPREAD_NAMES[m.spreadType]}
                </td>
                <td className="text-center py-3 px-2 text-slate-300">
                  {formatNumber(m.cohortSize)}
                </td>
                <td className="text-center py-3 px-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    m.d1Retention >= 50 ? 'bg-green-500/20 text-green-400' :
                    m.d1Retention >= 30 ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {m.d1Retention}%
                  </span>
                </td>
                <td className="text-center py-3 px-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    m.d7Retention >= 30 ? 'bg-green-500/20 text-green-400' :
                    m.d7Retention >= 15 ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {m.d7Retention}%
                  </span>
                </td>
                <td className="text-center py-3 px-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    m.d30Retention >= 15 ? 'bg-green-500/20 text-green-400' :
                    m.d30Retention >= 8 ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {m.d30Retention}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SpreadDetailsTable({ metrics }: { metrics: SpreadMetric[] }) {
  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-6">📋 Spread Details</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-slate-400 border-b border-slate-700">
              <th className="text-left py-3 px-2">Spread</th>
              <th className="text-center py-3 px-2">Readings</th>
              <th className="text-center py-3 px-2">Users</th>
              <th className="text-center py-3 px-2">Completion</th>
              <th className="text-center py-3 px-2">Avg Time</th>
              <th className="text-center py-3 px-2">Repeat</th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((m) => (
              <tr key={m.spreadType} className="border-b border-slate-700/50 hover:bg-slate-700/20">
                <td className="py-3 px-2">
                  <span className="mr-2">{SPREAD_ICONS[m.spreadType]}</span>
                  {SPREAD_NAMES[m.spreadType]}
                </td>
                <td className="text-center py-3 px-2 text-white font-medium">
                  {formatNumber(m.totalReadings)}
                </td>
                <td className="text-center py-3 px-2 text-slate-300">
                  {formatNumber(m.uniqueUsers)}
                </td>
                <td className="text-center py-3 px-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    m.completionRate >= 80 ? 'bg-green-500/20 text-green-400' :
                    m.completionRate >= 60 ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {m.completionRate}%
                  </span>
                </td>
                <td className="text-center py-3 px-2 text-slate-300">
                  {formatDuration(m.avgDurationMs)}
                </td>
                <td className="text-center py-3 px-2 text-slate-300">
                  {m.repeatRate}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function SpreadAnalyticsDashboard() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setRefreshing(true);
      
      // Calculate date range
      let startDate: string | undefined;
      const now = new Date();
      
      if (dateRange === '7d') {
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
      } else if (dateRange === '30d') {
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
      } else if (dateRange === '90d') {
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString();
      }

      const url = new URL('/api/analytics/metrics', window.location.origin);
      url.searchParams.set('metricType', 'all');
      if (startDate) url.searchParams.set('startDate', startDate);
      
      const response = await fetch(url.toString());
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch metrics');
      }
      
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [dateRange]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login?redirectTo=/admin/analytics/spreads');
      return;
    }
    
    if (user) {
      fetchData();
    }
  }, [user, authLoading, fetchData, router]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleExportCSV = useCallback(() => {
    if (!data?.spreadMetrics) return;
    
    const headers = ['Spread', 'Total Readings', 'Unique Users', 'Completion Rate', 'Avg Duration', 'Repeat Rate'];
    const rows = data.spreadMetrics.map(m => [
      SPREAD_NAMES[m.spreadType],
      m.totalReadings,
      m.uniqueUsers,
      `${m.completionRate}%`,
      formatDuration(m.avgDurationMs),
      `${m.repeatRate}%`,
    ]);
    
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `spread-analytics-${dateRange}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [data, dateRange]);

  if (authLoading || loading) {
    return <PageLoader message="กำลังโหลด Analytics..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-950/20 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-red-400">{error}</p>
          <button 
            onClick={fetchData}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-950/20 to-slate-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Back Link */}
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          กลับไป Admin Dashboard
        </Link>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              📊 Spread Analytics Dashboard
            </h1>
            <p className="text-slate-400 mt-1">
              Track spread usage, conversions, and engagement
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Date Range Selector */}
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as typeof dateRange)}
              className="bg-slate-800 border border-slate-700 text-white px-4 py-2 rounded-lg"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="all">All time</option>
            </select>
            
            {/* Refresh Button */}
            <button
              onClick={fetchData}
              disabled={refreshing}
              className="px-4 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg hover:bg-slate-700 disabled:opacity-50"
            >
              {refreshing ? '⟳' : '🔄'}
            </button>
            
            {/* Export Button */}
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500"
            >
              📥 Export CSV
            </button>
          </div>
        </div>

        {/* Overview Cards */}
        {data?.overview && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <MetricCard 
              title="Total Readings" 
              value={formatNumber(data.overview.totalReadings)}
              icon="🔮"
            />
            <MetricCard 
              title="Unique Users" 
              value={formatNumber(data.overview.totalUsers)}
              icon="👥"
            />
            <MetricCard 
              title="Avg Completion" 
              value={`${data.overview.avgCompletionRate}%`}
              icon="✅"
            />
            <MetricCard 
              title="Avg Duration" 
              value={formatDuration(data.overview.avgDurationMs)}
              icon="⏱️"
            />
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Spread Comparison */}
          {data?.spreadMetrics && (
            <SpreadComparisonChart metrics={data.spreadMetrics} />
          )}
          
          {/* Spread Details Table */}
          {data?.spreadMetrics && (
            <SpreadDetailsTable metrics={data.spreadMetrics} />
          )}
        </div>

        {/* Conversion Funnels */}
        {data?.conversionFunnels && data.conversionFunnels.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">🔄 Conversion Funnels</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {data.conversionFunnels.map((funnel) => (
                <ConversionFunnelChart key={funnel.spreadType} funnel={funnel} />
              ))}
            </div>
          </div>
        )}

        {/* Retention Table */}
        {data?.retentionMetrics && (
          <RetentionTable metrics={data.retentionMetrics} />
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-slate-500 text-sm">
          Last updated: {new Date().toLocaleString('th-TH')} • 
          Auto-refresh every 5 minutes
        </div>
      </div>
    </div>
  );
}

