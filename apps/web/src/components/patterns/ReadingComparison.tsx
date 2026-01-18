'use client';

/**
 * Reading Comparison Component
 * Side-by-side comparison of two readings (Story 9.4)
 */

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import { Loader2, AlertCircle, ArrowRight, Check, X } from 'lucide-react';
import type { ReadingComparison as ComparisonType } from '@/lib/patterns/types';

interface ReadingComparisonProps {
  reading1Id: string | null;
  reading2Id: string | null;
  onClose?: () => void;
}

export function ReadingComparison({ 
  reading1Id, 
  reading2Id, 
  onClose 
}: ReadingComparisonProps): React.JSX.Element | null {
  const [comparison, setComparison] = useState<ComparisonType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchComparison(): Promise<void> {
      if (!reading1Id || !reading2Id) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(
          `/api/patterns/compare?reading1=${reading1Id}&reading2=${reading2Id}`
        );
        const result = await response.json();
        
        if (result.success) {
          setComparison(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        console.error('Comparison fetch error:', err);
        setError('ไม่สามารถโหลดข้อมูลได้');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchComparison();
  }, [reading1Id, reading2Id]);
  
  if (!reading1Id || !reading2Id) {
    return (
      <div className="text-center py-8 text-gray-400">
        กรุณาเลือกการดูดวง 2 รายการเพื่อเปรียบเทียบ
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-purple-500 mx-auto mb-2" />
        <p className="text-gray-400">กำลังเปรียบเทียบ...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
        <p className="text-red-400">{error}</p>
      </div>
    );
  }
  
  if (!comparison) return null;
  
  const { reading1, reading2, commonCards, differences } = comparison;
  
  return (
    <div className="bg-gray-800/50 rounded-2xl border border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h3 className="text-lg font-semibold text-white">เปรียบเทียบการดูดวง</h3>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white rounded"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      
      {/* Comparison Grid */}
      <div className="grid md:grid-cols-2 gap-4 p-4">
        {/* Reading 1 */}
        <div className="bg-gray-900/50 rounded-xl p-4">
          <div className="mb-4">
            <span className="text-xs text-purple-400 font-medium">การดูดวง 1</span>
            <h4 className="text-white font-semibold">{reading1.readingTypeTh}</h4>
            <p className="text-xs text-gray-400">
              {format(new Date(reading1.createdAt), 'd MMM yyyy HH:mm', { locale: th })}
            </p>
            {reading1.question && (
              <p className="text-sm text-gray-300 mt-2 italic">&quot;{reading1.question}&quot;</p>
            )}
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {reading1.cards.map((card) => (
              <div 
                key={card.position} 
                className={`relative ${
                  commonCards.includes(card.card.id) 
                    ? 'ring-2 ring-green-500 rounded-lg' 
                    : ''
                }`}
              >
                <div className={`relative aspect-[2/3] ${card.isReversed ? 'rotate-180' : ''}`}>
                  <Image
                    src={card.card.imageUrl}
                    alt={card.card.name}
                    fill
                    className="object-cover rounded-lg"
                    unoptimized
                  />
                </div>
                {commonCards.includes(card.card.id) && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center z-10">
                    <Check className="w-3 h-3 text-white" />
                  </span>
                )}
                <p className="text-xs text-center text-gray-400 mt-1 truncate">
                  {card.card.nameTh}
                </p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Reading 2 */}
        <div className="bg-gray-900/50 rounded-xl p-4">
          <div className="mb-4">
            <span className="text-xs text-pink-400 font-medium">การดูดวง 2</span>
            <h4 className="text-white font-semibold">{reading2.readingTypeTh}</h4>
            <p className="text-xs text-gray-400">
              {format(new Date(reading2.createdAt), 'd MMM yyyy HH:mm', { locale: th })}
            </p>
            {reading2.question && (
              <p className="text-sm text-gray-300 mt-2 italic">&quot;{reading2.question}&quot;</p>
            )}
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {reading2.cards.map((card) => (
              <div 
                key={card.position} 
                className={`relative ${
                  commonCards.includes(card.card.id) 
                    ? 'ring-2 ring-green-500 rounded-lg' 
                    : ''
                }`}
              >
                <div className={`relative aspect-[2/3] ${card.isReversed ? 'rotate-180' : ''}`}>
                  <Image
                    src={card.card.imageUrl}
                    alt={card.card.name}
                    fill
                    className="object-cover rounded-lg"
                    unoptimized
                  />
                </div>
                {commonCards.includes(card.card.id) && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center z-10">
                    <Check className="w-3 h-3 text-white" />
                  </span>
                )}
                <p className="text-xs text-center text-gray-400 mt-1 truncate">
                  {card.card.nameTh}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Differences */}
      {differences.length > 0 && (
        <div className="px-4 pb-4">
          <div className="bg-gray-900/50 rounded-xl p-4">
            <h4 className="text-sm font-medium text-white mb-2">สรุปความแตกต่าง</h4>
            <ul className="space-y-1">
              {differences.map((diff, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                  <ArrowRight className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                  {diff}
                </li>
              ))}
            </ul>
            {commonCards.length > 0 && (
              <p className="text-sm text-green-400 mt-3">
                ✨ มีไพ่ซ้ำกัน {commonCards.length} ใบ - แสดงถึงธีมที่คงที่ในชีวิตคุณ
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
