/**
 * AI Interpretation Toggle Component
 * Story 9.2: AI-Powered Personalized Interpretations
 * 
 * Button to request AI-powered personalized tarot interpretation
 * Only visible for VIP users
 */

'use client';

import { useState, useEffect } from 'react';
import { usePremiumStatus } from '@/lib/hooks/usePremiumStatus';

interface AIInterpretationToggleProps {
  onRequest: () => void;
  isLoading: boolean;
  isEnabled: boolean;
  remaining?: number | null;
  error?: string | null;
  className?: string;
}

export function AIInterpretationToggle({
  onRequest,
  isLoading,
  isEnabled,
  remaining,
  error,
  className = '',
}: AIInterpretationToggleProps) {
  const { isVip, tier, isLoading: tierLoading } = usePremiumStatus();
  const [showUpgradeHint, setShowUpgradeHint] = useState(false);

  // Don't show if loading tier
  if (tierLoading) {
    return null;
  }

  // Show upgrade prompt for non-VIP users
  if (!isVip) {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={() => setShowUpgradeHint(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600/30 to-pink-600/30 border border-purple-500/40 rounded-xl text-purple-300 hover:border-purple-400/60 transition-all group"
        >
          <span className="text-lg">🔮</span>
          <span>AI คำทำนายส่วนตัว</span>
          <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-300 text-xs rounded-full ml-2">
            VIP
          </span>
        </button>

        {showUpgradeHint && (
          <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-slate-800/95 backdrop-blur border border-purple-500/30 rounded-xl shadow-xl z-50">
            <div className="flex items-start gap-3">
              <span className="text-2xl">✨</span>
              <div className="flex-1">
                <h4 className="font-semibold text-white mb-1">
                  ปลดล็อก AI คำทำนายส่วนตัว
                </h4>
                <p className="text-sm text-slate-400 mb-3">
                  อัปเกรดเป็น VIP เพื่อรับคำทำนายที่เจาะลึกและเป็นส่วนตัว สร้างโดย AI สำหรับคุณโดยเฉพาะ
                </p>
                <div className="flex gap-2">
                  <a
                    href="/pricing?upgrade=vip"
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium rounded-lg hover:from-purple-400 hover:to-pink-400 transition-all"
                  >
                    อัปเกรดเป็น VIP
                  </a>
                  <button
                    onClick={() => setShowUpgradeHint(false)}
                    className="px-4 py-2 text-slate-400 text-sm hover:text-white transition-colors"
                  >
                    ปิด
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // VIP user - show the toggle button
  return (
    <div className={className}>
      <button
        onClick={onRequest}
        disabled={isLoading || isEnabled}
        className={`
          w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all
          ${isEnabled
            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white cursor-default'
            : isLoading
              ? 'bg-purple-500/50 text-purple-200 cursor-wait'
              : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500 hover:shadow-lg hover:shadow-purple-500/30'
          }
        `}
      >
        {isLoading ? (
          <>
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>กำลังสร้างคำทำนาย AI...</span>
          </>
        ) : isEnabled ? (
          <>
            <span className="text-lg">✨</span>
            <span>AI คำทำนายถูกสร้างแล้ว</span>
          </>
        ) : (
          <>
            <span className="text-lg">🔮</span>
            <span>ขอ AI คำทำนายส่วนตัว</span>
          </>
        )}
      </button>

      {/* Remaining uses indicator */}
      {remaining !== null && remaining !== undefined && (
        <p className="text-center text-xs text-purple-400 mt-2">
          เหลือ {remaining} ครั้งวันนี้
        </p>
      )}

      {/* Error message */}
      {error && (
        <p className="text-center text-xs text-red-400 mt-2">
          {error}
        </p>
      )}
    </div>
  );
}

export default AIInterpretationToggle;
