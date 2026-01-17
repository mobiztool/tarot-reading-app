'use client';

/**
 * Story 9.3: Reading Export to PDF (Premium Feature)
 * PDF Export Button Component
 * 
 * Handles premium access check and PDF export flow.
 * Available for Pro and VIP tiers only.
 */

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { usePremiumStatus, useAnalytics } from '@/lib/hooks';
import { downloadReadingPDF } from '@/lib/pdf';
import type { PDFReadingData } from '@/lib/pdf/types';

interface PDFExportButtonProps {
  readingId: string;
  readingType: string;
  cardCount: number;
  /** Optional: If provided, skips API call and uses this data directly */
  readingData?: PDFReadingData;
  /** Button size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Show as icon-only button */
  iconOnly?: boolean;
  /** Additional CSS classes */
  className?: string;
}

export function PDFExportButton({
  readingId,
  readingType,
  cardCount,
  readingData,
  size = 'md',
  iconOnly = false,
  className = '',
}: PDFExportButtonProps) {
  const router = useRouter();
  const { isPro, isVip, tier, isLoading: tierLoading } = usePremiumStatus();
  const { track } = useAnalytics();
  
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const canExport = isPro || isVip;

  const handleExport = useCallback(async () => {
    // Check premium access
    if (!canExport) {
      setShowUpgradeModal(true);
      track('pdf_export_gate_shown', {
        readingId,
        readingType,
        currentTier: tier,
      });
      return;
    }

    setIsExporting(true);
    setError(null);
    const startTime = Date.now();

    // Track export started
    track('pdf_export_started', {
      readingId,
      readingType,
      cardCount,
    });

    try {
      let pdfData: PDFReadingData;

      // If reading data is provided directly, use it
      if (readingData) {
        pdfData = readingData;
      } else {
        // Fetch reading data from API
        const response = await fetch('/api/export/pdf', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ readingId }),
        });

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || 'Failed to fetch reading data');
        }

        pdfData = result.data;
      }

      // Generate and download PDF
      const pdfResult = await downloadReadingPDF(pdfData, {
        includeInterpretations: true,
        includeKeywords: true,
        includeAdvice: true,
        includeNotes: true,
        includeBranding: true,
      });

      const durationMs = Date.now() - startTime;

      if (pdfResult.success && pdfResult.blob) {
        // Track successful export
        track('pdf_export_completed', {
          readingId,
          readingType,
          cardCount,
          durationMs,
          fileSizeKb: Math.round(pdfResult.blob.size / 1024),
        });
      } else {
        throw new Error(pdfResult.error || 'PDF generation failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'เกิดข้อผิดพลาด';
      setError(errorMessage);
      
      // Track failed export
      track('pdf_export_failed', {
        readingId,
        readingType,
        error: errorMessage,
      });
    } finally {
      setIsExporting(false);
    }
  }, [canExport, readingId, readingType, cardCount, readingData, tier, track]);

  const handleUpgrade = useCallback(() => {
    setShowUpgradeModal(false);
    router.push('/pricing?upgrade=pro&from=pdf-export');
  }, [router]);

  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  // Loading state during tier check
  if (tierLoading) {
    return (
      <button
        disabled
        className={`inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 bg-slate-700/50 text-slate-400 cursor-not-allowed ${sizeClasses[size]} ${className}`}
      >
        <svg className={`animate-spin ${iconSizeClasses[size]}`} fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        {!iconOnly && <span>กำลังโหลด...</span>}
      </button>
    );
  }

  return (
    <>
      <button
        onClick={handleExport}
        disabled={isExporting}
        className={`
          inline-flex items-center justify-center gap-2 rounded-xl font-medium
          transition-all duration-200 relative group
          ${canExport
            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30'
            : 'bg-slate-700/80 hover:bg-slate-700 text-slate-300 border border-slate-600/50'
          }
          ${isExporting ? 'opacity-75 cursor-wait' : ''}
          ${sizeClasses[size]}
          ${className}
        `}
        title={canExport ? 'ส่งออก PDF' : 'ฟีเจอร์นี้สำหรับ Pro/VIP เท่านั้น'}
      >
        {/* PDF Icon */}
        {isExporting ? (
          <svg className={`animate-spin ${iconSizeClasses[size]}`} fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        ) : (
          <svg className={iconSizeClasses[size]} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )}

        {!iconOnly && (
          <span>
            {isExporting ? 'กำลังสร้าง PDF...' : 'ส่งออก PDF'}
          </span>
        )}

        {/* Premium badge for non-premium users */}
        {!canExport && !iconOnly && (
          <span className="inline-flex items-center px-1.5 py-0.5 bg-amber-500/20 text-amber-400 text-xs font-medium rounded-full">
            Pro
          </span>
        )}

        {/* Lock icon for non-premium users (icon-only mode) */}
        {!canExport && iconOnly && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center text-[10px]">
            🔒
          </span>
        )}
      </button>

      {/* Error message */}
      {error && (
        <div className="mt-2 text-sm text-red-400 flex items-center gap-2">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
          <button
            onClick={handleExport}
            className="text-purple-400 hover:text-purple-300 underline"
          >
            ลองอีกครั้ง
          </button>
        </div>
      )}

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-md w-full animate-fadeIn">
            {/* Header */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/30">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>

            <h3 className="text-xl font-bold text-white text-center mb-2">
              ปลดล็อกฟีเจอร์ส่งออก PDF
            </h3>
            
            <p className="text-slate-400 text-center mb-6">
              บันทึกผลการดูดวงเป็น PDF เพื่อพิมพ์หรือเก็บไว้ดูภายหลัง
            </p>

            {/* Benefits */}
            <div className="bg-slate-700/50 rounded-xl p-4 mb-6">
              <h4 className="text-sm font-semibold text-purple-300 mb-3">สิ่งที่คุณจะได้รับ:</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-slate-300">
                  <span className="text-green-400">✓</span>
                  ส่งออกการดูดวงเป็น PDF สวยงาม
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-300">
                  <span className="text-green-400">✓</span>
                  รองรับภาษาไทยสมบูรณ์
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-300">
                  <span className="text-green-400">✓</span>
                  รูปภาพไพ่คุณภาพสูง
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-300">
                  <span className="text-green-400">✓</span>
                  คำทำนายและคำแนะนำครบถ้วน
                </li>
              </ul>
            </div>

            {/* Tier info */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="text-slate-400 text-sm">แพ็คเกจปัจจุบัน:</span>
              <span className="px-2 py-1 bg-slate-700 rounded-full text-sm font-medium text-slate-300">
                {tier === 'free' ? 'ฟรี' : tier === 'basic' ? 'เบสิค' : tier}
              </span>
            </div>

            {/* Actions */}
            <button
              onClick={handleUpgrade}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg shadow-purple-500/30 mb-3"
            >
              อัปเกรดเป็น Pro - ฿199/เดือน
            </button>

            <button
              onClick={() => setShowUpgradeModal(false)}
              className="w-full text-slate-400 py-2 rounded-xl font-medium hover:text-white hover:bg-slate-700/50 transition-all"
            >
              ยกเลิก
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default PDFExportButton;
