'use client';

/**
 * VIP Insights Widget
 * Story 9.5: Premium User Dashboard & Statistics
 * 
 * AI-generated insights for VIP users
 */

import type { AIInsight, FavoriteCard } from '@/lib/dashboard/types';

interface VIPInsightsWidgetProps {
  insights: AIInsight[] | null;
  favoriteCards: FavoriteCard[];
}

export function VIPInsightsWidget({ insights, favoriteCards }: VIPInsightsWidgetProps) {
  if (!insights || insights.length === 0) {
    return null;
  }

  const insightIcons: Record<string, string> = {
    pattern: '🔍',
    recommendation: '💡',
    summary: '📊',
  };

  return (
    <div className="bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border border-amber-500/30 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-2xl">👑</span>
        <h3 className="text-lg font-semibold text-white">
          ข้อมูลเชิงลึก VIP
        </h3>
        <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs rounded-full">
          AI Generated
        </span>
      </div>

      {/* Favorite Cards Preview */}
      {favoriteCards.length > 0 && (
        <div className="mb-6">
          <p className="text-slate-400 text-sm mb-3">ไพ่ที่ปรากฏบ่อยที่สุด</p>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {favoriteCards.slice(0, 5).map((card, index) => (
              <div
                key={card.cardId}
                className="flex-shrink-0 text-center"
                title={card.cardNameTh}
              >
                <div className="w-12 h-16 bg-slate-700/50 rounded-lg flex items-center justify-center text-2xl mb-1">
                  {index === 0 ? '🏆' : '🃏'}
                </div>
                <p className="text-xs text-slate-400 truncate w-14">
                  {card.cardNameTh}
                </p>
                <p className="text-xs text-purple-400">{card.count}x</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Insights */}
      <div className="space-y-4">
        {insights.map((insight, index) => (
          <div
            key={index}
            className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{insightIcons[insight.type] || '✨'}</span>
              <div>
                <h4 className="font-medium text-white mb-1">{insight.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {insight.content}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Monthly Summary CTA */}
      <div className="mt-6 p-4 bg-slate-800/30 rounded-xl text-center">
        <p className="text-slate-400 text-sm mb-2">
          ต้องการวิเคราะห์เชิงลึกมากขึ้น?
        </p>
        <button className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-900 text-sm font-medium rounded-lg transition-colors">
          ดูรายงานรายเดือน →
        </button>
      </div>
    </div>
  );
}
