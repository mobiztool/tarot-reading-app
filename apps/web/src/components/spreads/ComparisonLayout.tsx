'use client';

/**
 * Comparison Layout Component
 * Story 7.5: Premium Spread Responsive Layouts (AC: 3)
 * 
 * 2-column comparison layout for Decision Making spread
 * Displays Option A vs Option B with pros/cons and best path
 */

import { TarotCard } from '@/components/cards';
import { PositionLabel } from './PositionLabel';
import { ComparisonLayoutProps, PositionConfig } from '@/types/spread-layout';
import type { PositionLabel as PositionLabelType } from '@/types/card';

// Decision Making 5 Position Configuration
export const DECISION_MAKING_POSITIONS: PositionConfig[] = [
  {
    id: 1,
    position: 'dm_option_a_pros' as PositionLabelType,
    label: { th: 'ตัวเลือก A - ข้อดี', en: 'Option A - Pros', emoji: '✅', shortTh: 'A ข้อดี' },
    color: 'from-green-500 to-emerald-600',
  },
  {
    id: 2,
    position: 'dm_option_a_cons' as PositionLabelType,
    label: { th: 'ตัวเลือก A - ข้อเสีย', en: 'Option A - Cons', emoji: '⚠️', shortTh: 'A ข้อเสีย' },
    color: 'from-orange-500 to-red-600',
  },
  {
    id: 3,
    position: 'dm_option_b_pros' as PositionLabelType,
    label: { th: 'ตัวเลือก B - ข้อดี', en: 'Option B - Pros', emoji: '✅', shortTh: 'B ข้อดี' },
    color: 'from-green-500 to-emerald-600',
  },
  {
    id: 4,
    position: 'dm_option_b_cons' as PositionLabelType,
    label: { th: 'ตัวเลือก B - ข้อเสีย', en: 'Option B - Cons', emoji: '⚠️', shortTh: 'B ข้อเสีย' },
    color: 'from-orange-500 to-red-600',
  },
  {
    id: 5,
    position: 'dm_best_path' as PositionLabelType,
    label: { th: 'เส้นทางที่ดีที่สุด', en: 'Best Path', emoji: '🌟', shortTh: 'ทางที่ดี' },
    color: 'from-amber-500 to-yellow-500',
  },
];

export function ComparisonLayout({
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
  optionALabel = 'ตัวเลือก A',
  optionBLabel = 'ตัวเลือก B',
  variant = 'revealing',
  className = '',
}: ComparisonLayoutProps) {
  // Helper to render a card
  const renderCard = (index: number) => {
    const card = cards[index];
    const position = DECISION_MAKING_POSITIONS[index];
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
        style={{ animationDelay: `${animationDelay}ms` }}
        onClick={() => {
          if (canReveal && onRevealCard) {
            onRevealCard(index);
          } else if (isRevealed && onSelectCard) {
            onSelectCard(index);
          }
        }}
      >
        {showLabels && (
          <PositionLabel position={position} className="mb-2" />
        )}

        <div className="relative">
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

          {canReveal && !isRevealed && (
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-amber-400 text-xs animate-bounce whitespace-nowrap">
              👆 แตะเพื่อเปิด
            </div>
          )}
        </div>

        {isRevealed && variant === 'revealing' && (
          <p className="mt-2 text-xs text-slate-400 text-center">{card.card.nameTh}</p>
        )}
      </div>
    );
  };

  // Mobile: Vertical stack
  const renderMobileLayout = () => (
    <div className="md:hidden space-y-6">
      {/* Option A Section */}
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-2xl p-4">
        <h3 className="text-lg font-bold text-blue-300 mb-4 text-center">🅰️ {optionALabel}</h3>
        <div className="flex justify-center gap-4">
          {renderCard(0)}
          {renderCard(1)}
        </div>
      </div>

      {/* Option B Section */}
      <div className="bg-purple-900/20 border border-purple-500/30 rounded-2xl p-4">
        <h3 className="text-lg font-bold text-purple-300 mb-4 text-center">🅱️ {optionBLabel}</h3>
        <div className="flex justify-center gap-4">
          {renderCard(2)}
          {renderCard(3)}
        </div>
      </div>

      {/* Best Path Section */}
      <div className="bg-amber-900/20 border border-amber-500/30 rounded-2xl p-4">
        <h3 className="text-lg font-bold text-amber-300 mb-4 text-center">🌟 เส้นทางที่ดีที่สุด</h3>
        <div className="flex justify-center">
          {renderCard(4)}
        </div>
      </div>
    </div>
  );

  // Desktop: 2-column comparison layout
  const renderDesktopLayout = () => (
    <div className="hidden md:block">
      {/* Two Options Comparison */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        {/* Option A */}
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-blue-300 mb-6 text-center flex items-center justify-center gap-2">
            <span className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">A</span>
            {optionALabel}
          </h3>
          <div className="flex justify-center gap-6">
            {renderCard(0)}
            {renderCard(1)}
          </div>
        </div>

        {/* Option B */}
        <div className="bg-purple-900/20 border border-purple-500/30 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-purple-300 mb-6 text-center flex items-center justify-center gap-2">
            <span className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">B</span>
            {optionBLabel}
          </h3>
          <div className="flex justify-center gap-6">
            {renderCard(2)}
            {renderCard(3)}
          </div>
        </div>
      </div>

      {/* Best Path - Centered below */}
      <div className="flex justify-center">
        <div className="bg-gradient-to-br from-amber-900/30 to-yellow-900/30 border border-amber-500/30 rounded-2xl p-6 min-w-[200px]">
          <h3 className="text-xl font-bold text-amber-300 mb-4 text-center">
            🌟 เส้นทางที่ดีที่สุด
          </h3>
          <div className="flex justify-center">
            {renderCard(4)}
          </div>
        </div>
      </div>
    </div>
  );

  // Complete view: Row of 5 cards
  const renderCompleteLayout = () => (
    <div className="grid grid-cols-5 gap-2 md:gap-4">
      {cards.map((card, index) => {
        const position = DECISION_MAKING_POSITIONS[index];
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
        renderCompleteLayout()
      ) : (
        <>
          {renderMobileLayout()}
          {renderDesktopLayout()}
        </>
      )}
    </div>
  );
}

export default ComparisonLayout;
