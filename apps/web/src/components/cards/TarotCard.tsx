'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { CARD_SIZES, getCardBackPath } from '@/types/card';

interface TarotCardProps {
  frontImage: string;
  cardName: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isReversed?: boolean;
  isFlipped?: boolean;
  showFlipAnimation?: boolean;
  onClick?: () => void;
  onFlipComplete?: () => void;
  className?: string;
  enableHaptic?: boolean;
}

/**
 * TarotCard component with 3D flip animation
 * Displays card back or front based on isFlipped state
 * Includes haptic feedback for mobile devices
 */
export function TarotCard({
  frontImage,
  cardName,
  size = 'md',
  isReversed = false,
  isFlipped = false,
  showFlipAnimation = true,
  onClick,
  onFlipComplete,
  className = '',
  enableHaptic = true,
}: TarotCardProps) {
  const [hasError, setHasError] = useState(false);
  const [isHapticSupported, setIsHapticSupported] = useState(false);
  const dimensions = CARD_SIZES[size];
  const backImage = getCardBackPath();

  useEffect(() => {
    setIsHapticSupported('vibrate' in navigator);
  }, []);

  const handleError = () => {
    setHasError(true);
  };

  const handleAnimationEnd = () => {
    if (isFlipped && onFlipComplete) {
      onFlipComplete();
    }
  };

  const handleClick = () => {
    // Haptic feedback on card flip
    if (enableHaptic && isHapticSupported && !isFlipped) {
      try {
        navigator.vibrate(25);
      } catch {
        // Vibration not supported
      }
    }
    onClick?.();
  };

  // Use placeholder if front image fails
  const displayFrontImage = hasError ? '/cards/placeholder.svg' : frontImage;

  return (
    <div
      className={`relative cursor-pointer perspective-1000 ${className}`}
      style={{
        width: dimensions.width,
        height: dimensions.height,
      }}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={
        isFlipped
          ? `ไพ่ ${cardName}${isReversed ? ' (กลับหัว)' : ''} - คลิกเพื่อดูรายละเอียด`
          : 'ไพ่คว่ำ - คลิกเพื่อเปิดไพ่'
      }
      aria-pressed={isFlipped}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <div
        className={`
          relative w-full h-full transition-transform preserve-3d
          ${showFlipAnimation ? 'duration-700 ease-in-out' : 'duration-0'}
          ${isFlipped ? 'rotate-y-180' : ''}
        `}
        onTransitionEnd={handleAnimationEnd}
      >
        {/* Card Back */}
        <div
          className="absolute inset-0 backface-hidden rounded-xl overflow-hidden shadow-2xl shadow-purple-900/50"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <Image
            src={backImage}
            alt="Card back"
            fill
            sizes={`${dimensions.width}px`}
            className="object-cover"
            priority
            unoptimized={backImage.endsWith('.svg')}
          />
          {/* Hover glow effect */}
          <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-purple-500/30 to-transparent" />
          {/* Shimmer overlay */}
          <div className="absolute inset-0 card-shimmer pointer-events-none" />
        </div>

        {/* Card Front */}
        <div
          className="absolute inset-0 backface-hidden rounded-xl overflow-hidden shadow-2xl rotate-y-180"
          style={{
            backfaceVisibility: 'hidden',
            transform: `rotateY(180deg) ${isReversed ? 'rotate(180deg)' : ''}`,
          }}
        >
          <Image
            src={displayFrontImage}
            alt={`${cardName} tarot card`}
            fill
            sizes={`${dimensions.width}px`}
            className="object-cover"
            onError={handleError}
            unoptimized={displayFrontImage.endsWith('.svg')}
          />
          {/* Reversed indicator */}
          {isReversed && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-purple-900/80 text-purple-200 text-xs px-2 py-1 rounded-full">
              กลับหัว
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TarotCard;

