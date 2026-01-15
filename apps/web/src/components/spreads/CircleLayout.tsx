'use client';

/**
 * Circle/Wheel Layout Component
 * Story 7.5: Premium Spread Responsive Layouts (AC: 4)
 * 
 * Circular/wheel layout for Zodiac spread and other circular formations
 * Responsive: mobile vertical/grid, desktop circular formation
 */

import { TarotCard } from '@/components/cards';
import { PositionLabel } from './PositionLabel';
import { CircleLayoutProps, PositionConfig } from '@/types/spread-layout';

// Generate positions in a circle
function generateCirclePositions(
  count: number, 
  radius: number = 150, 
  startAngle: number = -90 // Start from top
): { x: number; y: number; angle: number }[] {
  const positions: { x: number; y: number; angle: number }[] = [];
  const angleStep = 360 / count;

  for (let i = 0; i < count; i++) {
    const angle = startAngle + i * angleStep;
    const radians = (angle * Math.PI) / 180;
    positions.push({
      x: Math.cos(radians) * radius,
      y: Math.sin(radians) * radius,
      angle: angle,
    });
  }

  return positions;
}

export function CircleLayout({
  cards,
  positions,
  revealedCards = [],
  selectedCardIndex = null,
  nextCardToReveal = 0,
  onRevealCard,
  onSelectCard,
  enableAnimation = true,
  staggerDelay = 300,
  cardSize = 'sm',
  showLabels = true,
  cardCount = 12,
  radius = 180,
  startAngle = -90,
  variant = 'revealing',
  className = '',
}: CircleLayoutProps) {
  // Generate circle positions
  const circlePositions = generateCirclePositions(
    cards.length || cardCount, 
    radius, 
    startAngle
  );

  // Helper to render a card
  const renderCard = (index: number, circlePos?: { x: number; y: number; angle: number }) => {
    const card = cards[index];
    const position = positions[index];
    if (!card || !position) return null;

    const isRevealed = revealedCards[index] ?? false;
    const canReveal = index === nextCardToReveal && !isRevealed && variant === 'revealing';
    const isSelected = selectedCardIndex === index;
    const animationDelay = enableAnimation ? index * staggerDelay : 0;

    return (
      <div
        className={`flex flex-col items-center transition-all duration-300 ${
          isSelected ? 'scale-105 z-10' : ''
        } ${!isSelected && isRevealed && variant === 'complete' ? 'opacity-70 hover:opacity-100 cursor-pointer' : ''}`}
        style={{
          animationDelay: `${animationDelay}ms`,
          ...(circlePos && {
            position: 'absolute',
            left: `calc(50% + ${circlePos.x}px)`,
            top: `calc(50% + ${circlePos.y}px)`,
            transform: 'translate(-50%, -50%)',
          }),
        }}
        onClick={() => {
          if (canReveal && onRevealCard) {
            onRevealCard(index);
          } else if (isRevealed && onSelectCard) {
            onSelectCard(index);
          }
        }}
      >
        {showLabels && (
          <PositionLabel position={position} variant="compact" className="mb-1" />
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
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-amber-400 text-xs animate-bounce whitespace-nowrap z-10">
              👆 แตะ
            </div>
          )}
        </div>
      </div>
    );
  };

  // Mobile: Grid layout (3 columns)
  const renderMobileLayout = () => (
    <div className="md:hidden">
      <div className="grid grid-cols-3 gap-3 justify-items-center">
        {cards.map((card, index) => {
          const position = positions[index];
          if (!position) return null;

          const isRevealed = revealedCards[index] ?? false;
          const canReveal = index === nextCardToReveal && !isRevealed && variant === 'revealing';
          const isSelected = selectedCardIndex === index;

          return (
            <div
              key={index}
              className={`flex flex-col items-center ${isSelected ? 'scale-105' : ''}`}
              onClick={() => {
                if (canReveal && onRevealCard) {
                  onRevealCard(index);
                } else if (isRevealed && onSelectCard) {
                  onSelectCard(index);
                }
              }}
            >
              <PositionLabel position={position} variant="compact" className="mb-1" />
              <TarotCard
                frontImage={card.card.imageUrl}
                cardName={card.card.name}
                size="sm"
                isReversed={card.isReversed}
                isFlipped={isRevealed}
                showFlipAnimation={variant === 'revealing'}
                className={`
                  ${canReveal ? 'cursor-pointer animate-pulse ring-2 ring-amber-400' : ''}
                  ${isSelected ? 'ring-2 ring-amber-400' : ''}
                  ${!canReveal && !isRevealed ? 'opacity-50' : ''}
                `}
              />
            </div>
          );
        })}
      </div>
    </div>
  );

  // Desktop: Circular formation
  const renderDesktopLayout = () => {
    // Calculate container size based on radius
    const containerSize = radius * 2 + 200; // Extra space for cards

    return (
      <div className="hidden md:flex justify-center">
        <div 
          className="relative"
          style={{ 
            width: containerSize, 
            height: containerSize,
          }}
        >
          {/* Optional center element */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center">
            <span className="text-3xl">🔮</span>
          </div>

          {/* Cards in circle */}
          {cards.map((_, index) => renderCard(index, circlePositions[index]))}
        </div>
      </div>
    );
  };

  // Complete view: Grid layout
  const renderCompleteLayout = () => {
    // Responsive columns based on card count
    const gridCols = cards.length <= 6 ? 'grid-cols-3 md:grid-cols-6' : 
                     cards.length <= 9 ? 'grid-cols-3' : 
                     'grid-cols-4 md:grid-cols-6';

    return (
      <div className={`grid ${gridCols} gap-2 md:gap-3 justify-items-center`}>
        {cards.map((card, index) => {
          const position = positions[index];
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
  };

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

export default CircleLayout;
