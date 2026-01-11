'use client';

import { useState, useCallback } from 'react';
import { useAuth, useAnalytics } from '@/lib/hooks';

interface FavoriteButtonProps {
  readingId: string;
  initialFavorite?: boolean;
  onToggle?: (isFavorite: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const sizeClasses = {
  sm: 'w-8 h-8 text-lg',
  md: 'w-10 h-10 text-xl',
  lg: 'w-12 h-12 text-2xl',
};

export function FavoriteButton({
  readingId,
  initialFavorite = false,
  onToggle,
  size = 'md',
  showText = true,
}: FavoriteButtonProps) {
  const { isAuthenticated } = useAuth();
  const { track } = useAnalytics();
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = useCallback(async () => {
    if (!isAuthenticated) {
      // Redirect to login
      window.location.href = '/auth/login?redirect=' + encodeURIComponent(window.location.pathname);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/readings/${readingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_favorite: !isFavorite }),
      });

      const data = await response.json();

      if (data.success) {
        const newFavorite = !isFavorite;
        setIsFavorite(newFavorite);
        onToggle?.(newFavorite);
        track(newFavorite ? 'reading_favorited' : 'reading_unfavorited', { readingId });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsLoading(false);
    }
  }, [readingId, isFavorite, isAuthenticated, onToggle, track]);

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`
        inline-flex items-center gap-2 rounded-xl transition-all duration-300 
        ${isFavorite 
          ? 'text-pink-500 hover:text-pink-400' 
          : 'text-slate-400 hover:text-pink-400'
        }
        ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}
      `}
      title={isFavorite ? 'ยกเลิกรายการโปรด' : 'เพิ่มในรายการโปรด'}
    >
      <span
        className={`
          ${sizeClasses[size]} 
          flex items-center justify-center rounded-full 
          ${isFavorite ? 'bg-pink-500/20' : 'bg-slate-800/50 hover:bg-pink-500/10'}
          transition-all duration-300
        `}
      >
        {isLoading ? '⏳' : isFavorite ? '❤️' : '🤍'}
      </span>
      {showText && (
        <span className="text-sm font-medium">
          {isFavorite ? 'โปรดแล้ว' : 'เพิ่มโปรด'}
        </span>
      )}
    </button>
  );
}


