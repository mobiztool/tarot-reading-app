'use client';

/**
 * Card Slot Component
 * Story 7.5: Premium Spread Responsive Layouts (AC: 7, 8)
 * 
 * Reusable card slot with position label, animation support, and responsive sizing
 */

import { TarotCard } from '@/components/cards';
import { PositionLabel } from './PositionLabel';
import { CardSlotProps } from '@/types/spread-layout';

export function CardSlot({
  card,
  position,
  isRevealed = false,
  canReveal = false,
  isSelected = false,
  size = 'sm',
  onReveal,
  onClick,
  showLabel = true,
  labelPosition = 'top',
  animationDelay = 0,
}: CardSlotProps) {
  const handleClick = () => {
    if (canReveal && onReveal) {
      onReveal();
    } else if (onClick) {
      onClick();
    }
  };

  // Style for animation delay
  const animationStyle = animationDelay > 0 
    ? { animationDelay: `${animationDelay}ms` }
    : undefined;

  // Placeholder when no card
  if (!card) {
    return (
      <div className="flex flex-col items-center">
        {showLabel && labelPosition === 'top' && (
          <PositionLabel position={position} className="mb-2" />
        )}
        <div
          className={`
            rounded-xl border-2 border-dashed border-slate-600 
            bg-slate-800/30 flex items-center justify-center
            ${size === 'sm' ? 'w-[80px] h-[140px]' : ''}
            ${size === 'md' ? 'w-[120px] h-[210px]' : ''}
            ${size === 'lg' ? 'w-[180px] h-[315px]' : ''}
          `}
        >
          <span className="text-slate-600 text-2xl">{position.label.emoji}</span>
        </div>
        {showLabel && labelPosition === 'bottom' && (
          <PositionLabel position={position} className="mt-2" />
        )}
      </div>
    );
  }

  return (
    <div
      className={`
        flex flex-col items-center transition-all duration-300
        ${isSelected ? 'scale-105' : ''}
        ${!isSelected && isRevealed ? 'opacity-70 hover:opacity-100' : ''}
        ${position.isOverlay ? 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' : ''}
      `}
      style={{
        ...animationStyle,
        transform: position.rotate ? `rotate(${position.rotate}deg)` : undefined,
      }}
    >
      {/* Top Label */}
      {showLabel && labelPosition === 'top' && !position.isOverlay && (
        <PositionLabel position={position} className="mb-2" />
      )}

      {/* Card with interaction states */}
      <div className="relative">
        <TarotCard
          frontImage={card.card.imageUrl}
          cardName={card.card.name}
          size={size}
          isReversed={card.isReversed}
          isFlipped={isRevealed}
          onClick={handleClick}
          className={`
            ${canReveal ? 'cursor-pointer animate-pulse ring-2 ring-amber-400 ring-offset-2 ring-offset-slate-900' : ''}
            ${isSelected ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-slate-900' : ''}
            ${!canReveal && !isRevealed ? 'opacity-50' : ''}
          `}
        />

        {/* Reveal hint */}
        {canReveal && !isRevealed && (
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-amber-400 text-xs animate-bounce whitespace-nowrap">
            👆 แตะเพื่อเปิด
          </div>
        )}
      </div>

      {/* Bottom Label */}
      {showLabel && labelPosition === 'bottom' && !position.isOverlay && (
        <PositionLabel position={position} className="mt-2" />
      )}
    </div>
  );
}

export default CardSlot;
