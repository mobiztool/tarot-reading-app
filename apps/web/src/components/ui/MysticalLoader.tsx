'use client';

import Lottie from 'lottie-react';
import crystalBallAnimation from '../../../public/animations/crystal-ball.json';

/**
 * Mystical Loader - A beautiful loading animation for the tarot app
 * Uses Lottie crystal ball animation (static import for instant loading)
 */

interface MysticalLoaderProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

// Size configurations for the loader
const sizeConfig = {
  sm: { width: 80, height: 80, text: 'text-sm' },
  md: { width: 120, height: 120, text: 'text-base' },
  lg: { width: 180, height: 180, text: 'text-lg' },
};

export function MysticalLoader({ 
  message = 'กำลังโหลด...', 
  size = 'md' 
}: MysticalLoaderProps) {
  const config = sizeConfig[size];

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      {/* Lottie Crystal Ball Animation */}
      <div 
        className="relative"
        style={{ width: config.width, height: config.height }}
      >
        {/* Glow effect behind animation */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-amber-500/20 blur-2xl animate-pulse" />
        
        <Lottie
          animationData={crystalBallAnimation}
          loop
          autoplay
          style={{ width: config.width, height: config.height }}
        />
      </div>

      {/* Loading message */}
      {message && (
        <p className={`text-purple-300 ${config.text} animate-pulse mt-2`}>
          {message}
        </p>
      )}
    </div>
  );
}

/**
 * Full page loader wrapper
 */
export function PageLoader({ message = 'กำลังโหลด...' }: { message?: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-950/20 to-slate-900 flex items-center justify-center">
      <MysticalLoader message={message} size="lg" />
    </div>
  );
}

/**
 * Card shuffle animation loader
 */
export function ShuffleLoader({ message = 'กำลังสับไพ่...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <MysticalLoader message={message} size="md" />
    </div>
  );
}

/**
 * Inline loader for smaller spaces
 */
export function InlineLoader({ message }: { message?: string }) {
  return <MysticalLoader message={message} size="sm" />;
}
