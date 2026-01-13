'use client';

/**
 * Admin Dashboard - Main Hub
 * 
 * หน้าหลักสำหรับ Admin เข้าถึง features ต่างๆ
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { PageLoader } from '@/components/ui/MysticalLoader';

// =============================================================================
// TYPES
// =============================================================================

interface AdminModule {
  id: string;
  title: string;
  description: string;
  icon: string;
  href: string;
  color: string;
  stats?: {
    label: string;
    value: string | number;
  };
}

interface QuickStats {
  totalUsers: number;
  totalReadings: number;
  todayReadings: number;
  activeUsers7d: number;
}

// =============================================================================
// ADMIN MODULES CONFIG
// =============================================================================

const ADMIN_MODULES: AdminModule[] = [
  {
    id: 'users',
    title: 'จัดการผู้ใช้',
    description: 'ดูรายชื่อผู้ใช้ทั้งหมด, สถานะการยืนยันอีเมล, และข้อมูลสมาชิก',
    icon: '👥',
    href: '/admin/users',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'subscriptions',
    title: 'Subscription Analytics',
    description: 'ดู MRR, ARR, Churn Rate, LTV, Conversion Funnel และ Retention',
    icon: '💳',
    href: '/admin/subscriptions',
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 'analytics',
    title: 'Spread Analytics',
    description: 'วิเคราะห์การใช้งาน Spread, Conversion Funnel, และ Retention',
    icon: '📊',
    href: '/admin/analytics/spreads',
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'readings',
    title: 'ประวัติการดูดวง',
    description: 'ดูสถิติและประวัติการดูดวงทั้งหมดในระบบ',
    icon: '🔮',
    href: '/admin/readings',
    color: 'from-amber-500 to-orange-500',
  },
  {
    id: 'content',
    title: 'จัดการเนื้อหา',
    description: 'แก้ไขคำทำนาย, คำแนะนำ, และเนื้อหาไพ่ทาโรต์',
    icon: '📝',
    href: '/admin/content',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    id: 'settings',
    title: 'ตั้งค่าระบบ',
    description: 'กำหนดค่าระบบ, Feature flags, และการตั้งค่าทั่วไป',
    icon: '⚙️',
    href: '/admin/settings',
    color: 'from-slate-500 to-gray-600',
  },
];

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [stats, setStats] = useState<QuickStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login?redirectTo=/admin');
      return;
    }

    if (user) {
      const isAdminRole = user.user_metadata?.role === 'admin';
      const isAdminEmail = user.email?.endsWith('@admin.tarotapp.com') ?? false;
      const isAdmin = isAdminRole || isAdminEmail;
      if (!isAdmin) {
        router.push('/');
        return;
      }

      // Fetch quick stats
      fetchStats();
    }
  }, [user, authLoading, router]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Fetch users count
      const usersRes = await fetch('/api/admin/users');
      const usersData = await usersRes.json();
      
      // Fetch analytics overview
      const today = new Date();
      const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      const metricsRes = await fetch(
        `/api/analytics/metrics?metricType=overview&startDate=${thirtyDaysAgo.toISOString()}`
      );
      const metricsData = await metricsRes.json();

      setStats({
        totalUsers: usersData.total || 0,
        totalReadings: metricsData.overview?.totalReadings || 0,
        todayReadings: metricsData.overview?.todayReadings || 0,
        activeUsers7d: metricsData.overview?.uniqueUsers || 0,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return <PageLoader message="กำลังตรวจสอบสิทธิ์..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-950/20 to-slate-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-2">
            <span className="text-5xl">🎛️</span>
            <div>
              <h1 className="text-4xl font-bold text-white">
                Admin Dashboard
              </h1>
              <p className="text-slate-400 mt-1">
                ศูนย์ควบคุมระบบ Tarot App
              </p>
            </div>
          </div>
          
          {/* Admin Info & Logout */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span>Logged in as: {user?.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              ออกจากระบบ
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <QuickStatCard
            icon="👥"
            label="ผู้ใช้ทั้งหมด"
            value={loading ? '...' : stats?.totalUsers || 0}
            color="blue"
          />
          <QuickStatCard
            icon="🔮"
            label="การดูดวงทั้งหมด"
            value={loading ? '...' : stats?.totalReadings || 0}
            color="purple"
          />
          <QuickStatCard
            icon="📅"
            label="วันนี้"
            value={loading ? '...' : stats?.todayReadings || 0}
            color="green"
          />
          <QuickStatCard
            icon="🔥"
            label="Active Users (7d)"
            value={loading ? '...' : stats?.activeUsers7d || 0}
            color="orange"
          />
        </div>

        {/* Admin Modules Grid */}
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <span>📦</span> เมนูจัดการ
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ADMIN_MODULES.map((module) => (
            <AdminModuleCard key={module.id} module={module} />
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
          <p>Tarot App Admin Dashboard v1.0</p>
          <p className="mt-1">
            Last updated: {new Date().toLocaleString('th-TH')}
          </p>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// SUB COMPONENTS
// =============================================================================

function QuickStatCard({ 
  icon, 
  label, 
  value, 
  color 
}: { 
  icon: string; 
  label: string; 
  value: string | number;
  color: 'blue' | 'purple' | 'green' | 'orange';
}) {
  const colorClasses = {
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    green: 'text-green-400 bg-green-500/10 border-green-500/20',
    orange: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  };

  return (
    <div className={`rounded-xl border p-4 ${colorClasses[color]}`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{icon}</span>
        <span className="text-xs text-slate-400">{label}</span>
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
    </div>
  );
}

function AdminModuleCard({ module }: { module: AdminModule }) {
  const isAvailable = module.id === 'users' || module.id === 'analytics' || module.id === 'subscriptions';
  
  return (
    <Link
      href={isAvailable ? module.href : '#'}
      className={`
        group relative overflow-hidden rounded-2xl border border-slate-700/50
        bg-slate-800/50 p-6 transition-all duration-300
        ${isAvailable 
          ? 'hover:border-slate-600 hover:bg-slate-800 hover:shadow-xl hover:shadow-purple-500/10 cursor-pointer' 
          : 'opacity-50 cursor-not-allowed'}
      `}
      onClick={(e) => !isAvailable && e.preventDefault()}
    >
      {/* Gradient Overlay */}
      <div className={`
        absolute inset-0 opacity-0 transition-opacity duration-300
        bg-gradient-to-br ${module.color}
        ${isAvailable ? 'group-hover:opacity-5' : ''}
      `} />
      
      {/* Content */}
      <div className="relative">
        {/* Icon & Badge */}
        <div className="flex items-start justify-between mb-4">
          <span className="text-4xl">{module.icon}</span>
          {!isAvailable && (
            <span className="px-2 py-1 text-xs bg-slate-700 text-slate-400 rounded-full">
              Coming Soon
            </span>
          )}
        </div>
        
        {/* Title */}
        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">
          {module.title}
        </h3>
        
        {/* Description */}
        <p className="text-sm text-slate-400 leading-relaxed">
          {module.description}
        </p>
        
        {/* Arrow */}
        {isAvailable && (
          <div className="mt-4 flex items-center text-purple-400 text-sm font-medium">
            เข้าใช้งาน
            <svg 
              className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        )}
      </div>
    </Link>
  );
}

