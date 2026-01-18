'use client';

/**
 * Share Journey Button
 * Story 9.5: Premium User Dashboard & Statistics
 * 
 * Allows users to share their tarot journey stats
 */

import { useState } from 'react';
import type { DashboardSummary } from '@/lib/dashboard/types';

interface ShareJourneyButtonProps {
  stats: DashboardSummary | undefined;
}

export function ShareJourneyButton({ stats }: ShareJourneyButtonProps) {
  const [isSharing, setIsSharing] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  if (!stats) return null;

  const shareText = `🔮 การเดินทางไพ่ทาโรต์ของฉัน
📊 ดูดวงแล้ว ${stats.totalReadings} ครั้ง
🔥 Streak ${stats.currentStreak} วัน
⭐ ไพ่ที่ชอบ: ${stats.mostCommonCardTh || 'หลากหลาย'}

#DuangThai #Tarot #ไพ่ทาโรต์`;

  const handleShare = async (platform: 'native' | 'twitter' | 'facebook' | 'copy') => {
    setIsSharing(true);

    try {
      if (platform === 'native' && navigator.share) {
        await navigator.share({
          title: 'การเดินทางไพ่ทาโรต์ของฉัน',
          text: shareText,
          url: window.location.href,
        });
      } else if (platform === 'twitter') {
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
          '_blank'
        );
      } else if (platform === 'facebook') {
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(shareText)}`,
          '_blank'
        );
      } else if (platform === 'copy') {
        await navigator.clipboard.writeText(shareText);
        alert('คัดลอกแล้ว!');
      }
    } catch (err) {
      console.error('Share error:', err);
    } finally {
      setIsSharing(false);
      setShowShareMenu(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowShareMenu(!showShareMenu)}
        disabled={isSharing}
        className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 rounded-lg text-slate-300 text-sm transition-colors"
      >
        <span>📤</span>
        <span className="hidden sm:inline">แชร์</span>
      </button>

      {/* Share Menu Dropdown */}
      {showShareMenu && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowShareMenu(false)}
          />
          
          {/* Menu */}
          <div className="absolute right-0 top-full mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-20 overflow-hidden">
            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <button
                onClick={() => handleShare('native')}
                className="w-full px-4 py-3 text-left text-slate-300 hover:bg-slate-700 transition-colors flex items-center gap-3"
              >
                <span>📱</span>
                แชร์
              </button>
            )}
            <button
              onClick={() => handleShare('twitter')}
              className="w-full px-4 py-3 text-left text-slate-300 hover:bg-slate-700 transition-colors flex items-center gap-3"
            >
              <span>𝕏</span>
              Twitter/X
            </button>
            <button
              onClick={() => handleShare('facebook')}
              className="w-full px-4 py-3 text-left text-slate-300 hover:bg-slate-700 transition-colors flex items-center gap-3"
            >
              <span>📘</span>
              Facebook
            </button>
            <button
              onClick={() => handleShare('copy')}
              className="w-full px-4 py-3 text-left text-slate-300 hover:bg-slate-700 transition-colors flex items-center gap-3 border-t border-slate-700"
            >
              <span>📋</span>
              คัดลอกข้อความ
            </button>
          </div>
        </>
      )}
    </div>
  );
}
