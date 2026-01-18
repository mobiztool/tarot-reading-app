'use client';

/**
 * Dashboard Stats Overview
 * Story 9.5: Premium User Dashboard & Statistics
 * 
 * Displays key metrics in card format
 */

import type { DashboardSummary } from '@/lib/dashboard/types';

interface DashboardStatsProps {
  stats: DashboardSummary;
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const statCards = [
    {
      label: 'การดูดวงทั้งหมด',
      value: stats.totalReadings.toLocaleString(),
      icon: '🔮',
      color: 'from-purple-500/20 to-purple-600/20',
      borderColor: 'border-purple-500/30',
    },
    {
      label: 'สัปดาห์นี้',
      value: stats.readingsThisWeek.toLocaleString(),
      icon: '📅',
      color: 'from-blue-500/20 to-blue-600/20',
      borderColor: 'border-blue-500/30',
    },
    {
      label: 'เดือนนี้',
      value: stats.readingsThisMonth.toLocaleString(),
      icon: '📊',
      color: 'from-green-500/20 to-green-600/20',
      borderColor: 'border-green-500/30',
    },
    {
      label: 'Streak ปัจจุบัน',
      value: `${stats.currentStreak} วัน`,
      icon: '🔥',
      color: 'from-orange-500/20 to-orange-600/20',
      borderColor: 'border-orange-500/30',
      highlight: stats.currentStreak > 0,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className={`relative overflow-hidden bg-gradient-to-br ${stat.color} border ${stat.borderColor} rounded-2xl p-6 ${stat.highlight ? 'ring-2 ring-orange-500/50' : ''}`}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-400 text-sm mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </div>
            <span className="text-3xl">{stat.icon}</span>
          </div>
          
          {/* Decorative element */}
          <div className="absolute -bottom-4 -right-4 text-6xl opacity-10">
            {stat.icon}
          </div>
        </div>
      ))}
    </div>
  );
}
