'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAnalytics } from '@/lib/hooks';

interface SharePromptProps {
  readingId: string;
  onDismiss?: () => void;
  className?: string;
}

/**
 * SharePrompt - Non-intrusive share prompt after reading
 */
export function SharePrompt({ readingId, onDismiss, className = '' }: SharePromptProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShared, setHasShared] = useState(false);
  const [copied, setCopied] = useState(false);
  const { track } = useAnalytics();

  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/reading/${readingId}` 
    : '';

  // Show prompt after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      track('share_prompt_shown', { reading_id: readingId });
    }, 2000);

    return () => clearTimeout(timer);
  }, [readingId, track]);

  const handleDismiss = () => {
    setIsVisible(false);
    track('share_prompt_dismissed', { reading_id: readingId });
    onDismiss?.();
  };

  const handleShare = useCallback((platform: string) => {
    track('share_initiated', { reading_id: readingId, platform });

    if (platform === 'copy') {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent('🔮 ลองดูดวงไพ่ยิปซีกัน!')}`, '_blank');
    } else if (platform === 'line') {
      window.open(`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}`, '_blank');
    }

    setHasShared(true);
    track('share_prompt_completed', { reading_id: readingId, platform });
  }, [readingId, shareUrl, track]);

  if (!isVisible) return null;

  if (hasShared) {
    return (
      <div className={`bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-6 text-center animate-fadeIn ${className}`}>
        <div className="text-4xl mb-2">🎉</div>
        <h3 className="text-lg font-bold text-green-400 mb-1">ขอบคุณที่แชร์!</h3>
        <p className="text-slate-400 text-sm">
          คุณได้รับ Badge <span className="text-amber-400">🌟 ผู้แบ่งปัน</span>
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-r from-purple-500/10 to-amber-500/10 border border-purple-500/30 rounded-xl p-6 animate-fadeIn ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-white mb-1">
            ✨ ชอบผลดูดวงไหม?
          </h3>
          <p className="text-slate-400 text-sm">
            แชร์ให้เพื่อนๆ ดูด้วย!
          </p>
        </div>
        <button
          onClick={handleDismiss}
          className="text-slate-500 hover:text-slate-300 transition-colors p-1"
          aria-label="ปิด"
        >
          ✕
        </button>
      </div>

      {/* Compact Share Buttons */}
      <div className="flex gap-2 justify-center">
        <button
          onClick={() => handleShare('facebook')}
          className="p-3 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
          aria-label="แชร์บน Facebook"
        >
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        </button>
        <button
          onClick={() => handleShare('twitter')}
          className="p-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          aria-label="แชร์บน X"
        >
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </button>
        <button
          onClick={() => handleShare('line')}
          className="p-3 bg-green-500 hover:bg-green-400 rounded-lg transition-colors"
          aria-label="แชร์บน LINE"
        >
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755z" />
          </svg>
        </button>
        <button
          onClick={() => handleShare('copy')}
          className="p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
          aria-label="คัดลอกลิงก์"
        >
          {copied ? (
            <span className="text-green-400">✓</span>
          ) : (
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          )}
        </button>
      </div>

      <p className="text-slate-500 text-xs mt-3 text-center">
        🏆 แชร์เพื่อปลดล็อก Badge พิเศษ
      </p>
    </div>
  );
}

/**
 * SocialProof - Shows how many people shared today
 */
export function SocialProof({ count = 127 }: { count?: number }) {
  return (
    <div className="flex items-center gap-2 text-sm text-slate-400">
      <span className="text-amber-400">👥</span>
      <span>
        วันนี้มีคนแชร์แล้ว <strong className="text-white">{count}</strong> คน
      </span>
    </div>
  );
}

