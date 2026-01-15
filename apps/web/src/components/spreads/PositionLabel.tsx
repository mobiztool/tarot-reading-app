'use client';

/**
 * Position Label Component
 * Story 7.5: Premium Spread Responsive Layouts (AC: 7)
 * 
 * Displays position labels with Thai/English support and customizable styling
 */

import { PositionConfig } from '@/types/spread-layout';

interface PositionLabelProps {
  position: PositionConfig;
  variant?: 'badge' | 'text' | 'compact';
  showEmoji?: boolean;
  showEnglish?: boolean;
  className?: string;
}

export function PositionLabel({
  position,
  variant = 'badge',
  showEmoji = true,
  showEnglish = false,
  className = '',
}: PositionLabelProps) {
  const { label, color } = position;

  if (variant === 'text') {
    return (
      <div className={`text-center ${className}`}>
        {showEmoji && <span className="mr-1">{label.emoji}</span>}
        <span className="text-slate-300 font-medium">{label.th}</span>
        {showEnglish && (
          <span className="text-slate-500 text-xs ml-1">({label.en})</span>
        )}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div
        className={`px-2 py-0.5 rounded-full bg-gradient-to-r ${color} text-white text-[10px] font-medium whitespace-nowrap ${className}`}
      >
        {showEmoji && <span>{label.emoji}</span>}
      </div>
    );
  }

  // Default: badge variant
  return (
    <div
      className={`px-3 py-1 rounded-full bg-gradient-to-r ${color} text-white text-xs font-medium whitespace-nowrap ${className}`}
    >
      {showEmoji && <span className="mr-1">{label.emoji}</span>}
      <span>{label.shortTh}</span>
      {showEnglish && (
        <span className="text-white/70 text-[10px] ml-1">{label.en}</span>
      )}
    </div>
  );
}

export default PositionLabel;
