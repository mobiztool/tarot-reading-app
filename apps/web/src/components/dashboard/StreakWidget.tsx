'use client';

/**
 * Streak Widget
 * Story 9.5: Premium User Dashboard & Statistics
 * 
 * Displays current streak and longest streak
 */

interface StreakWidgetProps {
  currentStreak: number;
  longestStreak: number;
}

export function StreakWidget({ currentStreak, longestStreak }: StreakWidgetProps) {
  const streakLevel = currentStreak >= 30 ? 'legendary' : currentStreak >= 14 ? 'epic' : currentStreak >= 7 ? 'rare' : 'common';
  
  const streakColors = {
    legendary: 'from-amber-500 to-yellow-500',
    epic: 'from-purple-500 to-pink-500',
    rare: 'from-blue-500 to-cyan-500',
    common: 'from-slate-600 to-slate-500',
  };

  const streakEmojis = {
    legendary: '🔥👑',
    epic: '🔥💫',
    rare: '🔥✨',
    common: '🔥',
  };

  const nextMilestone = currentStreak < 7 ? 7 : currentStreak < 14 ? 14 : currentStreak < 30 ? 30 : currentStreak < 100 ? 100 : null;
  const progress = nextMilestone ? Math.min(100, (currentStreak / nextMilestone) * 100) : 100;

  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
        <span>🔥</span>
        Streak การดูดวง
      </h3>

      {/* Current Streak */}
      <div className={`bg-gradient-to-r ${streakColors[streakLevel]} rounded-xl p-4 text-center mb-4`}>
        <p className="text-5xl font-bold text-white drop-shadow-lg">
          {currentStreak}
        </p>
        <p className="text-white/80 text-sm mt-1">
          {streakEmojis[streakLevel]} วันติดต่อกัน
        </p>
      </div>

      {/* Progress to next milestone */}
      {nextMilestone && currentStreak > 0 && (
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-400">ถึง {nextMilestone} วัน</span>
            <span className="text-slate-300">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${streakColors[streakLevel]} transition-all duration-500`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-3 bg-slate-700/30 rounded-lg">
          <p className="text-2xl font-bold text-white">{currentStreak}</p>
          <p className="text-slate-400 text-xs">ปัจจุบัน</p>
        </div>
        <div className="text-center p-3 bg-slate-700/30 rounded-lg">
          <p className="text-2xl font-bold text-amber-400">{longestStreak}</p>
          <p className="text-slate-400 text-xs">สูงสุด</p>
        </div>
      </div>

      {/* Motivation */}
      {currentStreak === 0 && (
        <p className="text-slate-400 text-sm text-center mt-4">
          ดูดวงวันนี้เพื่อเริ่มต้น Streak!
        </p>
      )}
    </div>
  );
}
