'use client';

/**
 * Quick Actions Widget
 * Story 9.5: Premium User Dashboard & Statistics
 * 
 * Provides shortcuts for common actions
 */

import Link from 'next/link';

interface QuickActionsProps {
  favoriteSpread: string | null;
}

// Spread type to URL mapping
const spreadUrls: Record<string, string> = {
  daily: '/reading/daily',
  three_card: '/reading/three-card',
  love_relationships: '/reading/love-relationships',
  career_money: '/reading/career-money',
  yes_no: '/reading/yes-no',
  celtic_cross: '/reading/celtic-cross',
  decision_making: '/reading/decision-making',
  self_discovery: '/reading/self-discovery',
  relationship_deep_dive: '/reading/relationship-deep-dive',
  shadow_work: '/reading/shadow-work',
  chakra_alignment: '/reading/chakra-alignment',
};

export function QuickActions({ favoriteSpread }: QuickActionsProps) {
  const actions = [
    {
      label: 'ดูดวงใหม่',
      icon: '🔮',
      href: '/reading',
      color: 'from-purple-600 to-pink-600',
      primary: true,
    },
    {
      label: favoriteSpread ? 'รูปแบบโปรด' : 'ไพ่ประจำวัน',
      icon: '⭐',
      href: favoriteSpread ? spreadUrls[favoriteSpread] || '/reading' : '/reading/daily',
      color: 'from-amber-600 to-orange-600',
    },
    {
      label: 'ประวัติการดู',
      icon: '📜',
      href: '/history',
      color: 'from-slate-600 to-slate-500',
    },
    {
      label: 'จัดการสมาชิก',
      icon: '💳',
      href: '/profile/billing',
      color: 'from-slate-600 to-slate-500',
    },
  ];

  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
        <span>⚡</span>
        ทางลัด
      </h3>

      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <Link
            key={index}
            href={action.href}
            className={`p-4 rounded-xl text-center transition-all hover:scale-105 ${
              action.primary
                ? `bg-gradient-to-r ${action.color} text-white shadow-lg shadow-purple-500/20`
                : 'bg-slate-700/50 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <span className="text-2xl">{action.icon}</span>
            <p className="text-sm mt-1">{action.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
