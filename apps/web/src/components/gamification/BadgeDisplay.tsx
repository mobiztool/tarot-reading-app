'use client';

import { useState } from 'react';
import { BADGES, type Badge, type UserStats } from '@/lib/gamification/badges';

interface BadgeDisplayProps {
  earnedBadges: string[];
  showAll?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * BadgeDisplay - Shows user's earned badges
 */
export function BadgeDisplay({
  earnedBadges,
  showAll = false,
  size = 'md',
}: BadgeDisplayProps) {
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  const earnedSet = new Set(earnedBadges);
  const badges = showAll ? BADGES : BADGES.filter((b) => earnedSet.has(b.id));

  const sizeClasses = {
    sm: 'w-8 h-8 text-lg',
    md: 'w-12 h-12 text-2xl',
    lg: 'w-16 h-16 text-3xl',
  };

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {badges.map((badge) => {
          const isEarned = earnedSet.has(badge.id);
          return (
            <button
              key={badge.id}
              onClick={() => setSelectedBadge(badge)}
              className={`
                ${sizeClasses[size]} rounded-full flex items-center justify-center
                transition-all duration-200 hover:scale-110
                ${
                  isEarned
                    ? 'bg-gradient-to-br from-amber-500/30 to-purple-500/30 border-2 border-amber-500/50 shadow-lg shadow-amber-500/20'
                    : 'bg-slate-800 border border-slate-700 opacity-40 grayscale'
                }
              `}
              aria-label={`${badge.name}: ${badge.description}`}
            >
              {badge.emoji}
            </button>
          );
        })}
      </div>

      {/* Badge Detail Modal */}
      {selectedBadge && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4 backdrop-blur-sm"
          onClick={() => setSelectedBadge(null)}
        >
          <div
            className="bg-slate-800 border border-purple-500/30 rounded-2xl p-6 max-w-sm w-full shadow-2xl shadow-purple-500/20 animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div
                className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center text-4xl
                  ${
                    earnedSet.has(selectedBadge.id)
                      ? 'bg-gradient-to-br from-amber-500/30 to-purple-500/30 border-2 border-amber-500/50'
                      : 'bg-slate-700 border border-slate-600 grayscale'
                  }
                `}
              >
                {selectedBadge.emoji}
              </div>

              <h3 className="text-xl font-bold text-white mb-1">{selectedBadge.name}</h3>
              <p className="text-slate-400 mb-4">{selectedBadge.description}</p>

              {earnedSet.has(selectedBadge.id) ? (
                <p className="text-green-400 text-sm">✅ ปลดล็อกแล้ว!</p>
              ) : (
                <p className="text-slate-500 text-sm">🔒 ยังไม่ปลดล็อก</p>
              )}
            </div>

            <button
              onClick={() => setSelectedBadge(null)}
              className="w-full mt-6 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              ปิด
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/**
 * BadgeUnlockNotification - Animated notification when badge is earned
 */
export function BadgeUnlockNotification({
  badge,
  onClose,
}: {
  badge: Badge;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4 backdrop-blur-sm animate-fadeIn">
      <div className="bg-gradient-to-br from-amber-900/50 to-purple-900/50 border border-amber-500/50 rounded-2xl p-8 max-w-sm w-full shadow-2xl shadow-amber-500/30 text-center">
        {/* Celebration animation */}
        <div className="text-6xl mb-4 animate-bounce">{badge.emoji}</div>

        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-purple-300 mb-2">
          🎉 ปลดล็อก Badge!
        </h2>

        <h3 className="text-xl font-bold text-white mb-2">{badge.name}</h3>
        <p className="text-slate-300 mb-6">{badge.description}</p>

        <button
          onClick={onClose}
          className="w-full px-6 py-3 bg-gradient-to-r from-amber-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-white font-medium rounded-xl transition-all"
        >
          ยอดเยี่ยม! 🌟
        </button>
      </div>
    </div>
  );
}

/**
 * UserStatsDisplay - Shows user's gamification stats
 */
export function UserStatsDisplay({ stats }: { stats: UserStats }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-slate-800/50 rounded-xl p-4 text-center">
        <div className="text-2xl font-bold text-purple-400">{stats.totalReadings}</div>
        <div className="text-slate-500 text-sm">ครั้งดูดวง</div>
      </div>
      <div className="bg-slate-800/50 rounded-xl p-4 text-center">
        <div className="text-2xl font-bold text-amber-400">{stats.totalShares}</div>
        <div className="text-slate-500 text-sm">ครั้งแชร์</div>
      </div>
      <div className="bg-slate-800/50 rounded-xl p-4 text-center">
        <div className="text-2xl font-bold text-green-400">{stats.currentStreak}</div>
        <div className="text-slate-500 text-sm">วัน Streak</div>
      </div>
      <div className="bg-slate-800/50 rounded-xl p-4 text-center">
        <div className="text-2xl font-bold text-pink-400">{stats.earnedBadges.length}</div>
        <div className="text-slate-500 text-sm">Badges</div>
      </div>
    </div>
  );
}


