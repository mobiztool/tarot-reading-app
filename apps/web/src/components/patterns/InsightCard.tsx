'use client';

/**
 * Insight Card Component
 * Displays personalized insights (Story 9.4)
 */

import type { Insight } from '@/lib/patterns/types';

interface InsightCardProps {
  insight: Insight;
}

export function InsightCard({ insight }: InsightCardProps): React.JSX.Element {
  return (
    <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 hover:border-purple-500/50 transition-colors">
      <div className="flex items-start gap-3">
        <span className="text-2xl">{insight.icon}</span>
        <div className="flex-1">
          <h4 className="font-semibold text-white">{insight.titleTh}</h4>
          <p className="text-sm text-gray-400 mt-1">{insight.descriptionTh}</p>
          
          {insight.actionable && insight.suggestionTh && (
            <p className="text-sm text-purple-400 mt-2 flex items-center gap-1">
              <span>💡</span>
              {insight.suggestionTh}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

interface InsightsListProps {
  insights: Insight[];
}

export function InsightsList({ insights }: InsightsListProps): React.JSX.Element {
  return (
    <div className="space-y-3">
      {insights.map((insight, index) => (
        <InsightCard key={index} insight={insight} />
      ))}
    </div>
  );
}
