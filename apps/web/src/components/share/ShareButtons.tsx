'use client';

import { useState, useCallback } from 'react';
import { useAnalytics } from '@/lib/hooks';

interface ShareButtonsProps {
  readingId: string;
  readingType: 'daily' | 'three_card';
  cards: Array<{
    name: string;
    nameTh: string;
    isReversed: boolean;
    positionLabel?: string;
    imageUrl?: string;
  }>;
  className?: string;
}

export function ShareButtons({ readingId, readingType, cards, className = '' }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const { track } = useAnalytics();

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/reading/${readingId}` : '';

  const cardNames = cards.map((c) => c.nameTh).join(', ');
  const shareText = `🔮 ไพ่ทาโรต์บอกว่า: ${cardNames} ✨ มาดูดวงกันเถอะ!`;

  // Generate OG image URL
  const getOgImageUrl = useCallback(() => {
    const cardsData = encodeURIComponent(
      JSON.stringify(
        cards.map((c) => ({
          name: c.name,
          nameTh: c.nameTh,
          isReversed: c.isReversed,
          positionLabel: c.positionLabel,
          imageUrl: c.imageUrl,
        }))
      )
    );
    return `/api/og/reading?type=${readingType}&cards=${cardsData}`;
  }, [cards, readingType]);

  // Copy link to clipboard
  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      track('share_initiated', { platform: 'copy_link', reading_id: readingId });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  }, [shareUrl, readingId, track]);

  // Download image for Instagram
  const handleDownloadImage = useCallback(async () => {
    setIsGeneratingImage(true);
    track('share_initiated', { platform: 'instagram', reading_id: readingId });

    try {
      const imageUrl = getOgImageUrl();
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tarot-reading-${readingId}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download image:', error);
    } finally {
      setIsGeneratingImage(false);
    }
  }, [getOgImageUrl, readingId, track]);

  // Share to Facebook
  const handleFacebookShare = useCallback(() => {
    track('share_initiated', { platform: 'facebook', reading_id: readingId });
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'width=600,height=400');
  }, [shareUrl, shareText, readingId, track]);

  // Share to Twitter/X
  const handleTwitterShare = useCallback(() => {
    track('share_initiated', { platform: 'twitter', reading_id: readingId });
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
  }, [shareUrl, shareText, readingId, track]);

  // Share to LINE
  const handleLineShare = useCallback(() => {
    track('share_initiated', { platform: 'line', reading_id: readingId });
    const url = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'width=600,height=400');
  }, [shareUrl, shareText, readingId, track]);

  // Native share (Web Share API)
  const handleNativeShare = useCallback(async () => {
    if (!navigator.share) return;

    track('share_initiated', { platform: 'native', reading_id: readingId });

    try {
      await navigator.share({
        title: 'ดูดวงไพ่ทาโรต์',
        text: shareText,
        url: shareUrl,
      });
      track('share_completed', { platform: 'native', reading_id: readingId });
    } catch (error) {
      // User cancelled or error
      console.error('Share failed:', error);
    }
  }, [shareUrl, shareText, readingId, track]);

  // Check if native share is available
  const hasNativeShare = typeof navigator !== 'undefined' && !!navigator.share;

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <h3 className="text-lg font-semibold text-purple-300 text-center">🔗 แชร์การดูดวง</h3>

      <div className="flex flex-wrap justify-center gap-3">
        {/* Native Share (if available) */}
        {hasNativeShare && (
          <button
            onClick={handleNativeShare}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg transition-all duration-200 shadow-lg"
          >
            <span>📤</span>
            <span>แชร์</span>
          </button>
        )}

        {/* Facebook */}
        <button
          onClick={handleFacebookShare}
          className="flex items-center gap-2 px-4 py-2 bg-[#1877F2] hover:bg-[#166FE5] text-white rounded-lg transition-all duration-200 shadow-lg"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          <span>Facebook</span>
        </button>

        {/* Twitter/X */}
        <button
          onClick={handleTwitterShare}
          className="flex items-center gap-2 px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-lg transition-all duration-200 shadow-lg"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <span>X</span>
        </button>

        {/* LINE */}
        <button
          onClick={handleLineShare}
          className="flex items-center gap-2 px-4 py-2 bg-[#00B900] hover:bg-[#00A000] text-white rounded-lg transition-all duration-200 shadow-lg"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
          </svg>
          <span>LINE</span>
        </button>

        {/* Download for Instagram */}
        <button
          onClick={handleDownloadImage}
          disabled={isGeneratingImage}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:opacity-90 text-white rounded-lg transition-all duration-200 shadow-lg disabled:opacity-50"
        >
          {isGeneratingImage ? (
            <span className="animate-spin">⏳</span>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          )}
          <span>{isGeneratingImage ? 'กำลังสร้าง...' : 'บันทึกรูป'}</span>
        </button>

        {/* Copy Link */}
        <button
          onClick={handleCopyLink}
          className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all duration-200 shadow-lg"
        >
          {copied ? (
            <>
              <span>✅</span>
              <span>คัดลอกแล้ว!</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              <span>คัดลอกลิงก์</span>
            </>
          )}
        </button>
      </div>

      {/* Image Preview */}
      <div className="mt-4 text-center">
        <p className="text-slate-400 text-sm mb-2">ตัวอย่างรูปที่จะแชร์:</p>
        <div className="relative inline-block rounded-lg overflow-hidden shadow-lg border border-slate-600">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={getOgImageUrl()}
            alt="Share preview"
            className="max-w-full h-auto max-h-[200px]"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}


