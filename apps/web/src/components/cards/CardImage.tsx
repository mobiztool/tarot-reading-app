'use client';

import Image from 'next/image';
import { useState } from 'react';
import { CARD_SIZES, getCardBackPath } from '@/types/card';

interface CardImageProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isReversed?: boolean;
  priority?: boolean;
  className?: string;
}

/**
 * Optimized Card Image component using Next.js Image
 * Handles lazy loading, fallback, and responsive sizing
 */
export function CardImage({
  src,
  alt,
  size = 'md',
  isReversed = false,
  priority = false,
  className = '',
}: CardImageProps) {
  const [hasError, setHasError] = useState(false);
  const dimensions = CARD_SIZES[size];

  const handleError = () => {
    setHasError(true);
  };

  const imageSrc = hasError ? getCardBackPath() : src;

  return (
    <div
      className={`relative overflow-hidden rounded-lg shadow-lg ${className}`}
      style={{
        width: dimensions.width,
        height: dimensions.height,
        transform: isReversed ? 'rotate(180deg)' : 'none',
      }}
    >
      <Image
        src={imageSrc}
        alt={alt}
        fill
        sizes={`${dimensions.width}px`}
        priority={priority}
        onError={handleError}
        className="object-cover"
        style={{
          objectFit: 'cover',
        }}
        unoptimized={imageSrc.endsWith('.svg')}
      />
    </div>
  );
}

export default CardImage;


