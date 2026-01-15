/**
 * Spread Layout Types
 * Story 7.5: Premium Spread Responsive Layouts
 * 
 * Reusable type definitions for premium spread layout components
 */

import { DrawnCard, PositionLabel } from './card';

// Layout type options
export type LayoutType = 'cross' | 'column' | 'row' | 'grid' | 'custom' | 'comparison';

// Position configuration for custom layouts
export interface PositionConfig {
  id: number;
  position: PositionLabel;
  label: {
    th: string;
    en: string;
    emoji: string;
    shortTh: string;
  };
  // Positioning
  gridArea?: string;
  x?: string;
  y?: string;
  rotate?: number;
  // Styling
  color: string; // Tailwind gradient classes
  // Optional overlay (for Celtic Cross challenge card)
  isOverlay?: boolean;
}

// Card slot component props
export interface CardSlotProps {
  card?: DrawnCard;
  position: PositionConfig;
  isRevealed?: boolean;
  canReveal?: boolean;
  isSelected?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onReveal?: () => void;
  onClick?: () => void;
  showLabel?: boolean;
  labelPosition?: 'top' | 'bottom' | 'left' | 'right';
  animationDelay?: number;
}

// Base spread layout props
export interface SpreadLayoutProps {
  cards: DrawnCard[];
  positions: PositionConfig[];
  layoutType: LayoutType;
  revealedCards?: boolean[];
  selectedCardIndex?: number | null;
  nextCardToReveal?: number;
  onRevealCard?: (index: number) => void;
  onSelectCard?: (index: number) => void;
  // Animation
  enableAnimation?: boolean;
  staggerDelay?: number; // Default 0.3s
  // Responsive
  mobileLayout?: 'vertical' | 'grid' | 'horizontal';
  // Customization
  cardSize?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
  className?: string;
}

// Celtic Cross specific layout props
export interface CelticCrossLayoutProps extends Omit<SpreadLayoutProps, 'layoutType' | 'positions'> {
  variant?: 'revealing' | 'complete';
}

// Comparison layout props (for Decision Making spread)
export interface ComparisonLayoutProps extends Omit<SpreadLayoutProps, 'layoutType' | 'positions'> {
  optionALabel?: string;
  optionBLabel?: string;
  variant?: 'revealing' | 'complete';
}

// Circle layout props (for Zodiac spread)
export interface CircleLayoutProps extends Omit<SpreadLayoutProps, 'layoutType'> {
  cardCount?: number;
  radius?: number;
  startAngle?: number;
  variant?: 'revealing' | 'complete';
}

// Row layout props
export interface RowLayoutProps extends Omit<SpreadLayoutProps, 'layoutType'> {
  gap?: string;
  wrap?: boolean;
  justify?: 'start' | 'center' | 'end' | 'between';
}

// Grid layout props
export interface GridLayoutProps extends Omit<SpreadLayoutProps, 'layoutType'> {
  columns?: number;
  gap?: string;
  responsive?: {
    sm?: number;
    md?: number;
    lg?: number;
  };
}

// Animation configuration
export interface AnimationConfig {
  enabled: boolean;
  staggerDelay: number;
  flipDuration: number;
  entranceAnimation?: 'fade' | 'scale' | 'slide';
}

// Hook return type for useSpreadAnimation
export interface UseSpreadAnimationReturn {
  getAnimationDelay: (index: number) => number;
  getAnimationClass: (index: number, isRevealed: boolean) => string;
  shouldAnimate: (index: number) => boolean;
}
