'use client';

/**
 * Badges Widget
 * Story 9.5: Premium User Dashboard & Statistics
 * 
 * Displays earned and available badges
 */

import { useState } from 'react';
import type { Badge } from '@/lib/dashboard/types';

interface BadgesWidgetProps {
  badges: Badge[];
  totalReadings: number;
}

export function BadgesWidget({ badges, totalReadings }: BadgesWidgetProps) {
  const [showAll, setShowAll] = useState(false);
  
  const earnedBadges = badges.filter(b => b.earned);
  const unearnedBadges = badges.filter(b => !b.earned);
  
  const displayBadges = showAll ? badges : [...earnedBadges, ...unearnedBadges.slice(0, 3)];

  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <span>🏆</span>
          เหรียญรางวัล
        </h3>
        <span className="text-sm text-slate-400">
          {earnedBadges.length}/{badges.length}
        </span>
      </div>

      {/* Progress Overview */}
      <div className="mb-4">
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-yellow-500 transition-all duration-500"
            style={{ width: `${(earnedBadges.length / badges.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-3 gap-3">
        {displayBadges.map((badge) => (
          <div
            key={badge.id}
            className={`relative group text-center p-3 rounded-xl transition-all ${
              badge.earned
                ? 'bg-slate-700/50 hover:bg-slate-700'
                : 'bg-slate-800/50 opacity-50'
            }`}
            title={badge.description}
          >
            <span className={`text-3xl ${badge.earned ? '' : 'grayscale'}`}>
              {badge.emoji}
            </span>
            <p className="text-xs text-slate-300 mt-1 truncate">{badge.name}</p>
            
            {/* Progress indicator for unearned badges */}
            {!badge.earned && badge.progress !== undefined && badge.progress > 0 && (
              <div className="mt-2">
                <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500"
                    style={{ width: `${badge.progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Tooltip on hover */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
              <div className="bg-slate-900 border border-slate-700 rounded-lg p-2 shadow-xl text-left min-w-[150px]">
                <p className="text-white font-medium text-sm">{badge.name}</p>
                <p className="text-slate-400 text-xs">{badge.description}</p>
                {badge.earned && badge.earnedAt && (
                  <p className="text-green-400 text-xs mt-1">✓ ได้รับแล้ว</p>
                )}
                {!badge.earned && badge.progress !== undefined && (
                  <p className="text-slate-500 text-xs mt-1">
                    ความคืบหน้า: {badge.progress}%
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Show All Button */}
      {badges.length > 6 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full mt-4 py-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          {showAll ? 'แสดงน้อยลง' : `ดูทั้งหมด (${badges.length})`}
        </button>
      )}
    </div>
  );
}
