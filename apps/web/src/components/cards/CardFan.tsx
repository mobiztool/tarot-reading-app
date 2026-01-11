'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { getCardBackPath } from '@/types/card';

interface CardFanProps {
  cardCount?: number;
  onSelectCard: (index: number) => void;
  selectedIndex?: number | null;
  disabled?: boolean;
}

/**
 * CardFan - Interactive card selection with realistic fan spread
 * Cards fan out from a central pivot point like a physical deck
 */
export function CardFan({
  cardCount = 22,
  onSelectCard,
  selectedIndex = null,
  disabled = false,
}: CardFanProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [showGuide, setShowGuide] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const backImage = getCardBackPath();

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Hide guide after first interaction
  useEffect(() => {
    if (hoveredIndex !== null || selectedIndex !== null) {
      setShowGuide(false);
    }
  }, [hoveredIndex, selectedIndex]);

  const handleCardClick = useCallback(
    (index: number) => {
      if (disabled) return;
      
      // Haptic feedback
      if ('vibrate' in navigator) {
        try {
          navigator.vibrate(25);
        } catch {
          // Ignore
        }
      }
      
      onSelectCard(index);
    },
    [disabled, onSelectCard]
  );

  // Calculate card positions for realistic fan spread
  const cardPositions = useMemo(() => {
    const positions = [];
    
    // Responsive card dimensions (+40% total for better usability)
    const cardWidth = isMobile ? 65 : 94;
    const cardHeight = isMobile ? 101 : 144;
    
    // Fan spread configuration - full semicircle (180°)
    const totalSpreadAngle = 180; // Full semicircle for both desktop and mobile
    const startAngle = -totalSpreadAngle / 2; // Start from -90° (left)
    const angleStep = totalSpreadAngle / (cardCount - 1);
    
    for (let i = 0; i < cardCount; i++) {
      const rotation = startAngle + (i * angleStep);
      
      positions.push({
        rotation,
        cardWidth,
        cardHeight,
        index: i,
      });
    }
    return positions;
  }, [cardCount, isMobile]);

  // Container height based on card size (+40% total for larger cards)
  const containerHeight = isMobile ? 280 : 400;
  const pivotOffset = isMobile ? 85 : 130; // Distance from bottom to pivot point

  return (
    <div className="relative w-full overflow-visible py-8">
      {/* Guided Tooltip */}
      {showGuide && !disabled && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm px-6 py-3 rounded-full shadow-lg shadow-purple-500/30 whitespace-nowrap">
            ✨ เลือกไพ่ที่ดึงดูดใจคุณ
          </div>
          <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-purple-600 mx-auto" />
        </div>
      )}

      {/* Mystical Background Glow */}
      <div className="absolute inset-0 flex items-end justify-center pointer-events-none overflow-visible">
        <div 
          className="w-full max-w-lg h-40 bg-gradient-to-t from-purple-500/30 via-purple-500/10 to-transparent blur-2xl rounded-t-full"
          style={{ marginBottom: '-20px' }}
        />
      </div>

      {/* Fan Container - Cards pivot from bottom center */}
      <div 
        className="relative mx-auto flex items-end justify-center"
        style={{ 
          height: `${containerHeight}px`,
          width: '100%',
        }}
      >
        {/* Pivot point glow */}
        <div 
          className="absolute left-1/2 -translate-x-1/2 w-8 h-8 bg-amber-500/30 rounded-full blur-lg"
          style={{ bottom: `${pivotOffset - 20}px` }}
        />
        
        {cardPositions.map((pos, index) => {
          const isHovered = hoveredIndex === index;
          const isSelected = selectedIndex === index;
          
          // Z-index: hovered/selected on top, otherwise left-to-right stacking
          const baseZIndex = index;

          return (
            <div
              key={index}
              className={`
                absolute cursor-pointer
                transition-all duration-200 ease-out
                ${disabled ? 'cursor-not-allowed opacity-50' : ''}
              `}
              style={{
                // Position at center bottom with pivot point
                left: '50%',
                bottom: `${pivotOffset}px`,
                // Card dimensions
                width: `${pos.cardWidth}px`,
                height: `${pos.cardHeight}px`,
                // Transform from bottom center (pivot point)
                transformOrigin: 'bottom center',
                transform: `
                  translateX(-50%)
                  rotate(${pos.rotation}deg)
                  ${isHovered ? 'translateY(-30px) scale(1.15)' : ''}
                  ${isSelected && !isHovered ? 'translateY(-20px) scale(1.1)' : ''}
                `,
                zIndex: isHovered ? 100 : isSelected ? 99 : baseZIndex,
              }}
              onMouseEnter={() => !disabled && setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onTouchStart={() => !disabled && setHoveredIndex(index)}
              onTouchEnd={() => setHoveredIndex(null)}
              onClick={() => handleCardClick(index)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCardClick(index);
                }
              }}
              role="button"
              tabIndex={disabled ? -1 : 0}
              aria-label={`เลือกไพ่ใบที่ ${index + 1}`}
              aria-pressed={isSelected}
            >
              {/* Card */}
              <div
                className={`
                  relative w-full h-full rounded-lg overflow-hidden
                  border-2 transition-all duration-200
                  ${isHovered ? 'border-purple-400 shadow-2xl shadow-purple-500/60' : 'border-slate-700/50 shadow-lg shadow-black/40'}
                  ${isSelected ? 'border-amber-400 shadow-2xl shadow-amber-400/60' : ''}
                `}
              >
                <Image
                  src={backImage}
                  alt="Tarot card"
                  fill
                  sizes={`${pos.cardWidth}px`}
                  className="object-cover"
                  priority={index < 12}
                  unoptimized={backImage.endsWith('.svg')}
                />

                {/* Hover Glow Overlay */}
                {isHovered && !isSelected && (
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-500/40 via-purple-400/20 to-transparent pointer-events-none" />
                )}

                {/* Selection Glow Overlay */}
                {isSelected && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-t from-amber-500/40 via-amber-400/20 to-transparent pointer-events-none" />
                    <div className="absolute inset-0 animate-pulse bg-amber-400/20 pointer-events-none" />
                  </>
                )}

                {/* Shimmer on hover */}
                {isHovered && (
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div 
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      style={{
                        animation: 'shimmer 1s ease-in-out infinite',
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selection indicator below fan */}
      {selectedIndex !== null && (
        <div className="text-center mt-4">
          <span className="inline-flex items-center gap-2 text-amber-400 text-sm font-medium animate-pulse">
            ✨ ไพ่ที่เลือกแล้ว ✨
          </span>
        </div>
      )}

      {/* Selection hint */}
      {!disabled && selectedIndex === null && (
        <p className="text-center text-slate-400 text-sm mt-4 animate-pulse">
          แตะไพ่ที่คุณรู้สึกดึงดูด
        </p>
      )}

      {/* Card count */}
      <div className="text-center text-slate-500 text-xs mt-2">
        ไพ่ {cardCount} ใบ
      </div>
    </div>
  );
}

/**
 * CardDeck - Stacked deck for shuffle animation
 */
export function CardDeck({ isShuffling = false }: { isShuffling?: boolean }) {
  const backImage = getCardBackPath();

  return (
    <div className="relative w-32 h-48 mx-auto">
      {/* Stacked cards */}
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className={`
            absolute w-full h-full rounded-xl overflow-hidden shadow-lg
            transition-transform duration-300
            ${isShuffling ? 'animate-shuffle-card' : ''}
          `}
          style={{
            transform: `translateY(${i * -2}px) translateX(${i * 1}px)`,
            zIndex: 5 - i,
            animationDelay: isShuffling ? `${i * 0.1}s` : '0s',
          }}
        >
          <Image
            src={backImage}
            alt="Card deck"
            fill
            sizes="128px"
            className="object-cover"
            unoptimized={backImage.endsWith('.svg')}
          />
        </div>
      ))}

      {/* Glow effect */}
      <div className="absolute -inset-4 bg-gradient-to-br from-purple-500/30 to-amber-500/30 blur-xl -z-10" />
    </div>
  );
}
