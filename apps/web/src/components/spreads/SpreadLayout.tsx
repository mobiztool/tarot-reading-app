'use client';

/**
 * Spread Layout Component
 * Story 7.5: Premium Spread Responsive Layouts (AC: 1-10)
 * 
 * Base reusable layout component for all premium spreads
 * Supports cross, column, row, grid, and custom layout types
 */

import { SpreadLayoutProps } from '@/types/spread-layout';
import { CardSlot } from './CardSlot';

export function SpreadLayout({
  cards,
  positions,
  layoutType,
  revealedCards = [],
  selectedCardIndex = null,
  nextCardToReveal = 0,
  onRevealCard,
  onSelectCard,
  enableAnimation = true,
  staggerDelay = 300,
  mobileLayout = 'vertical',
  cardSize = 'sm',
  showLabels = true,
  className = '',
}: SpreadLayoutProps) {
  // Calculate animation delay for staggered reveals
  const getAnimationDelay = (index: number): number => {
    if (!enableAnimation) return 0;
    return index * staggerDelay;
  };

  // Render cards based on layout type
  const renderCards = () => {
    return cards.map((card, index) => {
      const position = positions[index];
      if (!position) return null;

      const isRevealed = revealedCards[index] ?? false;
      const canReveal = index === nextCardToReveal && !isRevealed;
      const isSelected = selectedCardIndex === index;

      return (
        <CardSlot
          key={position.id}
          card={card}
          position={position}
          isRevealed={isRevealed}
          canReveal={canReveal}
          isSelected={isSelected}
          size={cardSize}
          onReveal={() => onRevealCard?.(index)}
          onClick={() => onSelectCard?.(index)}
          showLabel={showLabels}
          animationDelay={getAnimationDelay(index)}
        />
      );
    });
  };

  // Layout-specific container classes
  const getLayoutClasses = (): string => {
    switch (layoutType) {
      case 'row':
        return 'flex flex-wrap justify-center items-center gap-4 md:gap-6';
      case 'column':
        return 'flex flex-col items-center gap-4';
      case 'grid':
        return 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 justify-items-center';
      case 'cross':
      case 'custom':
      case 'comparison':
        return 'relative';
      default:
        return 'flex flex-wrap justify-center gap-4';
    }
  };

  // Mobile layout adjustment
  const getMobileClasses = (): string => {
    if (layoutType === 'cross' || layoutType === 'custom') {
      return mobileLayout === 'vertical' ? 'md:hidden' : '';
    }
    return '';
  };

  // Render empty state
  if (cards.length === 0) {
    return (
      <div className={`flex justify-center items-center p-8 ${className}`}>
        <div className="text-slate-500 text-center">
          <p>ยังไม่มีไพ่</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${getLayoutClasses()} ${getMobileClasses()} ${className}`}>
      {renderCards()}
    </div>
  );
}

export default SpreadLayout;
