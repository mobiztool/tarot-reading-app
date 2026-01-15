'use client';

/**
 * Celtic Cross Layout Component
 * Story 7.5: Premium Spread Responsive Layouts (AC: 2)
 * 
 * Complex 10-card layout with cross formation + staff (column)
 * Responsive: mobile vertical stack, desktop cross+staff formation
 */

import { TarotCard } from '@/components/cards';
import { PositionLabel } from './PositionLabel';
import { CelticCrossLayoutProps, PositionConfig } from '@/types/spread-layout';
import type { PositionLabel as PositionLabelType } from '@/types/card';

// Celtic Cross 10 Position Configuration
export const CELTIC_CROSS_POSITIONS: PositionConfig[] = [
  {
    id: 1,
    position: 'cc_present' as PositionLabelType,
    label: { th: 'สถานการณ์ปัจจุบัน', en: 'Present Situation', emoji: '⏺️', shortTh: 'ปัจจุบัน' },
    color: 'from-purple-500 to-pink-600',
  },
  {
    id: 2,
    position: 'cc_challenge' as PositionLabelType,
    label: { th: 'อุปสรรค/ความท้าทาย', en: 'Challenge', emoji: '⚔️', shortTh: 'อุปสรรค' },
    color: 'from-red-500 to-orange-600',
    rotate: 90,
    isOverlay: true,
  },
  {
    id: 3,
    position: 'cc_past' as PositionLabelType,
    label: { th: 'รากฐาน/อดีต', en: 'Foundation/Past', emoji: '⏪', shortTh: 'อดีต' },
    color: 'from-blue-500 to-indigo-600',
  },
  {
    id: 4,
    position: 'cc_future' as PositionLabelType,
    label: { th: 'อนาคตอันใกล้', en: 'Near Future', emoji: '⏩', shortTh: 'อนาคต' },
    color: 'from-amber-500 to-orange-600',
  },
  {
    id: 5,
    position: 'cc_above' as PositionLabelType,
    label: { th: 'เป้าหมาย/ความปรารถนา', en: 'Goals/Aspirations', emoji: '⬆️', shortTh: 'เป้าหมาย' },
    color: 'from-yellow-500 to-amber-600',
  },
  {
    id: 6,
    position: 'cc_below' as PositionLabelType,
    label: { th: 'จิตใต้สำนึก', en: 'Subconscious', emoji: '⬇️', shortTh: 'จิตใจ' },
    color: 'from-teal-500 to-cyan-600',
  },
  {
    id: 7,
    position: 'cc_advice' as PositionLabelType,
    label: { th: 'คำแนะนำ', en: 'Advice', emoji: '💡', shortTh: 'แนะนำ' },
    color: 'from-green-500 to-emerald-600',
  },
  {
    id: 8,
    position: 'cc_external' as PositionLabelType,
    label: { th: 'อิทธิพลภายนอก', en: 'External Influences', emoji: '🌍', shortTh: 'ภายนอก' },
    color: 'from-sky-500 to-blue-600',
  },
  {
    id: 9,
    position: 'cc_hopes_fears' as PositionLabelType,
    label: { th: 'ความหวัง/ความกลัว', en: 'Hopes & Fears', emoji: '🌓', shortTh: 'หวัง/กลัว' },
    color: 'from-violet-500 to-purple-600',
  },
  {
    id: 10,
    position: 'cc_outcome' as PositionLabelType,
    label: { th: 'ผลลัพธ์สุดท้าย', en: 'Final Outcome', emoji: '🎯', shortTh: 'ผลลัพธ์' },
    color: 'from-rose-500 to-pink-600',
  },
];

export function CelticCrossLayout({
  cards,
  revealedCards = [],
  selectedCardIndex = null,
  nextCardToReveal = 0,
  onRevealCard,
  onSelectCard,
  enableAnimation = true,
  staggerDelay = 300,
  cardSize = 'sm',
  showLabels = true,
  variant = 'revealing',
  className = '',
}: CelticCrossLayoutProps) {
  // Helper to render a card at a specific index
  const renderCard = (index: number, customStyles?: React.CSSProperties) => {
    const card = cards[index];
    const position = CELTIC_CROSS_POSITIONS[index];
    if (!card || !position) return null;

    const isRevealed = revealedCards[index] ?? false;
    const canReveal = index === nextCardToReveal && !isRevealed && variant === 'revealing';
    const isSelected = selectedCardIndex === index;
    const animationDelay = enableAnimation ? index * staggerDelay : 0;

    return (
      <div
        className={`flex flex-col items-center transition-all duration-300 ${
          isSelected ? 'scale-105' : ''
        } ${!isSelected && isRevealed && variant === 'complete' ? 'opacity-70 hover:opacity-100 cursor-pointer' : ''}`}
        style={{
          animationDelay: `${animationDelay}ms`,
          ...customStyles,
        }}
        onClick={() => {
          if (canReveal && onRevealCard) {
            onRevealCard(index);
          } else if (isRevealed && onSelectCard) {
            onSelectCard(index);
          }
        }}
      >
        {/* Position Label (not for overlay card) */}
        {showLabels && !position.isOverlay && (
          <PositionLabel position={position} className="mb-2" />
        )}

        {/* Card */}
        <div className="relative" style={position.rotate ? { transform: `rotate(${position.rotate}deg)` } : undefined}>
          <TarotCard
            frontImage={card.card.imageUrl}
            cardName={card.card.name}
            size={cardSize}
            isReversed={card.isReversed}
            isFlipped={isRevealed}
            showFlipAnimation={variant === 'revealing'}
            className={`
              ${canReveal ? 'cursor-pointer animate-pulse ring-2 ring-amber-400 ring-offset-2 ring-offset-slate-900' : ''}
              ${isSelected ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-slate-900' : ''}
              ${!canReveal && !isRevealed ? 'opacity-50' : ''}
            `}
          />

          {/* Reveal hint */}
          {canReveal && !isRevealed && (
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-amber-400 text-xs animate-bounce whitespace-nowrap z-10">
              👆 แตะเพื่อเปิด
            </div>
          )}
        </div>
      </div>
    );
  };

  // Mobile: Vertical stack layout
  const renderMobileLayout = () => (
    <div className="md:hidden space-y-4">
      {cards.map((card, index) => {
        const position = CELTIC_CROSS_POSITIONS[index];
        if (!position) return null;

        const isRevealed = revealedCards[index] ?? false;
        const canReveal = index === nextCardToReveal && !isRevealed && variant === 'revealing';

        return (
          <div key={index} className="flex items-center gap-4 bg-slate-800/30 rounded-xl p-3">
            <PositionLabel position={position} variant="badge" />
            <div className="relative">
              <TarotCard
                frontImage={card.card.imageUrl}
                cardName={card.card.name}
                size="sm"
                isReversed={card.isReversed}
                isFlipped={isRevealed}
                onClick={() => {
                  if (canReveal && onRevealCard) {
                    onRevealCard(index);
                  } else if (isRevealed && onSelectCard) {
                    onSelectCard(index);
                  }
                }}
                className={`
                  ${canReveal ? 'cursor-pointer animate-pulse ring-2 ring-amber-400' : ''}
                  ${selectedCardIndex === index ? 'ring-2 ring-amber-400' : ''}
                  ${!canReveal && !isRevealed ? 'opacity-50' : ''}
                `}
              />
            </div>
            {isRevealed && (
              <span className="text-slate-300 text-sm truncate flex-1">{card.card.nameTh}</span>
            )}
          </div>
        );
      })}
    </div>
  );

  // Desktop: Celtic Cross formation (cross + staff)
  const renderDesktopLayout = () => (
    <div className="hidden md:block relative" style={{ minHeight: '500px' }}>
      {/* Main container with flex for cross and staff */}
      <div className="flex gap-8 justify-center">
        {/* Cross Formation (positions 0-5) */}
        <div className="relative" style={{ width: '320px', height: '400px' }}>
          {/* Above (position 4) - top center */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0">
            {renderCard(4)}
          </div>

          {/* Past (position 2) - left center */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2">
            {renderCard(2)}
          </div>

          {/* Center: Present (0) + Challenge overlay (1) */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              {renderCard(0)}
              {/* Challenge card (1) - rotated 90deg, overlayed */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                {renderCard(1)}
              </div>
            </div>
          </div>

          {/* Future (position 3) - right center */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2">
            {renderCard(3)}
          </div>

          {/* Below (position 5) - bottom center */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-0">
            {renderCard(5)}
          </div>
        </div>

        {/* Staff (positions 6-9) - vertical column on right, bottom to top */}
        <div className="flex flex-col-reverse gap-4">
          {[6, 7, 8, 9].map((idx) => (
            <div key={idx}>{renderCard(idx)}</div>
          ))}
        </div>
      </div>
    </div>
  );

  // Complete view: All cards visible with selection
  const renderCompleteGridLayout = () => (
    <div className="grid grid-cols-5 md:grid-cols-10 gap-2 md:gap-3">
      {cards.map((card, index) => {
        const position = CELTIC_CROSS_POSITIONS[index];
        if (!position) return null;

        const isSelected = selectedCardIndex === index;

        return (
          <div
            key={index}
            className={`flex flex-col items-center cursor-pointer transition-all duration-300 ${
              isSelected ? 'scale-105' : 'opacity-70 hover:opacity-100'
            }`}
            onClick={() => onSelectCard?.(index)}
          >
            <PositionLabel position={position} variant="compact" className="mb-1" />
            <TarotCard
              frontImage={card.card.imageUrl}
              cardName={card.card.name}
              size="sm"
              isReversed={card.isReversed}
              isFlipped={true}
              showFlipAnimation={false}
              className={isSelected ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-slate-900' : ''}
            />
            <p className="mt-1 text-[10px] text-center text-slate-500 max-w-[60px] truncate">
              {position.label.shortTh}
            </p>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className={className}>
      {variant === 'complete' ? (
        renderCompleteGridLayout()
      ) : (
        <>
          {renderMobileLayout()}
          {renderDesktopLayout()}
        </>
      )}
    </div>
  );
}

export default CelticCrossLayout;
