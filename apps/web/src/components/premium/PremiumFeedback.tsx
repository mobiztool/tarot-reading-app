'use client';

/**
 * Premium Spread Feedback Component
 * Story 7.10: Soft Launch - Feedback Collection
 * Collects user feedback after completing a premium spread reading
 */

import { useState } from 'react';
import { useAnalytics } from '@/lib/hooks';
import { config } from '@/lib/config';

interface PremiumFeedbackProps {
  spreadType: string;
  spreadName: string;
  onClose: () => void;
}

const RATING_EMOJIS = [
  { value: 1, emoji: '😞', label: 'ไม่พอใจ' },
  { value: 2, emoji: '😐', label: 'พอใช้' },
  { value: 3, emoji: '🙂', label: 'ดี' },
  { value: 4, emoji: '😊', label: 'ดีมาก' },
  { value: 5, emoji: '🤩', label: 'ยอดเยี่ยม' },
];

export function PremiumFeedback({ spreadType, spreadName, onClose }: PremiumFeedbackProps) {
  const [rating, setRating] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { track } = useAnalytics();

  // Don't render if feedback is disabled
  if (!config.premiumSpreadsBeta.feedbackEnabled) {
    return null;
  }

  const handleSubmit = async () => {
    if (rating === null) return;

    setIsSubmitting(true);

    try {
      // Track feedback event
      track('premium_spread_feedback', {
        spread_type: spreadType,
        rating: rating,
        has_comment: feedback.length > 0,
      });

      // In production, this would send to backend API
      // For now, we just track the event
      console.log('[Beta Feedback]', {
        spreadType,
        rating,
        feedback,
        timestamp: new Date().toISOString(),
      });

      setIsSubmitted(true);

      // Auto-close after 2 seconds
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="fixed bottom-4 right-4 z-50 bg-gradient-to-br from-purple-900 to-indigo-900 border border-purple-500/50 rounded-2xl p-6 shadow-xl animate-fadeIn max-w-sm">
        <div className="text-center">
          <div className="text-4xl mb-3">✅</div>
          <h3 className="text-white font-semibold mb-2">ขอบคุณสำหรับความคิดเห็น!</h3>
          <p className="text-purple-300 text-sm">
            เราจะนำไปปรับปรุงให้ดียิ่งขึ้น
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-gradient-to-br from-slate-900 to-purple-950 border border-purple-500/50 rounded-2xl p-6 shadow-xl max-w-sm animate-slideIn">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-yellow-400">⭐</span>
            <span className="text-xs text-yellow-400 font-medium px-2 py-0.5 bg-yellow-400/20 rounded-full">
              Beta
            </span>
          </div>
          <h3 className="text-white font-semibold">ให้คะแนน {spreadName}</h3>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white transition-colors"
          aria-label="ปิด"
        >
          ✕
        </button>
      </div>

      {/* Rating */}
      <div className="mb-4">
        <p className="text-purple-300 text-sm mb-3">คุณพอใจกับการดูดวงนี้แค่ไหน?</p>
        <div className="flex justify-between gap-2">
          {RATING_EMOJIS.map(({ value, emoji, label }) => (
            <button
              key={value}
              onClick={() => setRating(value)}
              className={`flex flex-col items-center p-2 rounded-lg transition-all ${
                rating === value
                  ? 'bg-purple-600 scale-110'
                  : 'bg-slate-800 hover:bg-slate-700'
              }`}
              aria-label={label}
            >
              <span className="text-2xl">{emoji}</span>
              <span className="text-xs text-slate-400 mt-1">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Feedback Text */}
      {rating !== null && (
        <div className="mb-4 animate-fadeIn">
          <label className="text-purple-300 text-sm block mb-2">
            มีข้อเสนอแนะเพิ่มเติมไหม? (ไม่บังคับ)
          </label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="เช่น ชอบส่วนไหน, อยากให้ปรับปรุงอะไร..."
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
            rows={3}
          />
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={rating === null || isSubmitting}
        className={`w-full py-3 rounded-xl font-medium transition-all ${
          rating === null || isSubmitting
            ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500'
        }`}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            กำลังส่ง...
          </span>
        ) : (
          'ส่งความคิดเห็น'
        )}
      </button>

      {/* Skip Link */}
      <button
        onClick={onClose}
        className="w-full mt-2 py-2 text-slate-400 text-sm hover:text-white transition-colors"
      >
        ข้ามไปก่อน
      </button>
    </div>
  );
}
