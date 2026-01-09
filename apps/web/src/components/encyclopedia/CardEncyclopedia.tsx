'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCards } from '@/lib/hooks';

type Suit = 'all' | 'major' | 'wands' | 'cups' | 'swords' | 'pentacles';

const SUIT_TABS: { value: Suit; label: string; emoji: string; color: string }[] = [
  { value: 'all', label: 'ทั้งหมด', emoji: '🃏', color: 'from-purple-500 to-indigo-500' },
  { value: 'major', label: 'Major Arcana', emoji: '⭐', color: 'from-amber-500 to-orange-500' },
  { value: 'wands', label: 'ไม้เท้า', emoji: '🪄', color: 'from-red-500 to-orange-500' },
  { value: 'cups', label: 'ถ้วย', emoji: '🏆', color: 'from-blue-500 to-cyan-500' },
  { value: 'swords', label: 'ดาบ', emoji: '⚔️', color: 'from-slate-400 to-slate-600' },
  { value: 'pentacles', label: 'เหรียญ', emoji: '🪙', color: 'from-green-500 to-emerald-500' },
];

export function CardEncyclopedia() {
  const { cards, isLoading, error } = useCards();
  const [selectedSuit, setSelectedSuit] = useState<Suit>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter cards based on suit and search
  const filteredCards = useMemo(() => {
    if (!cards) return [];

    let filtered = [...cards];

    // Filter by suit
    if (selectedSuit !== 'all') {
      if (selectedSuit === 'major') {
        filtered = filtered.filter((card) => card.arcana === 'major');
      } else {
        filtered = filtered.filter((card) => card.suit?.toLowerCase() === selectedSuit);
      }
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (card) =>
          card.name.toLowerCase().includes(query) ||
          card.nameTh.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [cards, selectedSuit, searchQuery]);

  // Group cards by suit for display
  const groupedCards = useMemo(() => {
    if (selectedSuit !== 'all') {
      return [{ suit: selectedSuit, cards: filteredCards }];
    }

    const groups: { suit: string; cards: typeof filteredCards }[] = [];

    // Major Arcana first
    const majorCards = filteredCards.filter((c) => c.arcana === 'major');
    if (majorCards.length > 0) {
      groups.push({ suit: 'Major Arcana', cards: majorCards });
    }

    // Then Minor Arcana suits
    const suitOrder = ['wands', 'cups', 'swords', 'pentacles'];
    for (const suit of suitOrder) {
      const suitCards = filteredCards.filter((c) => c.suit?.toLowerCase() === suit);
      if (suitCards.length > 0) {
        groups.push({
          suit: SUIT_TABS.find((t) => t.value === suit)?.label || suit,
          cards: suitCards,
        });
      }
    }

    return groups;
  }, [filteredCards, selectedSuit]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          <div className="animate-spin text-5xl mb-4">🔮</div>
          <p className="text-slate-400">กำลังโหลดไพ่...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-6">😢</div>
        <h2 className="text-xl font-bold text-red-400 mb-2">เกิดข้อผิดพลาด</h2>
        <p className="text-slate-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search Input */}
        <div className="w-full md:w-80">
          <div className="relative">
            <input
              type="text"
              placeholder="🔍 ค้นหาไพ่..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Card Count */}
        <div className="text-slate-400 text-sm">
          แสดง {filteredCards.length} จาก {cards?.length || 0} ใบ
        </div>
      </div>

      {/* Suit Tabs */}
      <div className="flex flex-wrap justify-center gap-2">
        {SUIT_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setSelectedSuit(tab.value)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              selectedSuit === tab.value
                ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 hover:text-white border border-slate-700/50'
            }`}
          >
            <span>{tab.emoji}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      {filteredCards.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-medium text-slate-400 mb-2">ไม่พบไพ่</h3>
          <p className="text-slate-500">ลองค้นหาด้วยคำอื่น หรือเลือกหมวดหมู่อื่น</p>
        </div>
      ) : (
        <div className="space-y-12">
          {groupedCards.map((group) => (
            <div key={group.suit}>
              {/* Section Header */}
              {selectedSuit === 'all' && (
                <h2 className="text-2xl font-bold text-purple-400 mb-6 flex items-center gap-3">
                  {group.suit === 'Major Arcana' && <span>⭐</span>}
                  {group.suit === 'ไม้เท้า' && <span>🪄</span>}
                  {group.suit === 'ถ้วย' && <span>🏆</span>}
                  {group.suit === 'ดาบ' && <span>⚔️</span>}
                  {group.suit === 'เหรียญ' && <span>🪙</span>}
                  {group.suit}
                  <span className="text-sm text-slate-500 font-normal">({group.cards.length} ใบ)</span>
                </h2>
              )}

              {/* Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {group.cards.map((card) => (
                  <Link
                    key={card.id}
                    href={`/cards/${card.slug}`}
                    className="group bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 hover:border-purple-500/50 rounded-xl p-3 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/10"
                  >
                    {/* Card Image */}
                    <div className="relative aspect-[2/3] mb-3 rounded-lg overflow-hidden bg-slate-900/50">
                      <Image
                        src={card.imageUrl}
                        alt={card.nameTh}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                      {/* Major Arcana Badge */}
                      {card.arcana === 'major' && (
                        <div className="absolute top-2 right-2 bg-amber-500/90 text-white text-xs px-2 py-0.5 rounded-full">
                          {card.number !== null ? `#${card.number}` : ''}
                        </div>
                      )}
                    </div>

                    {/* Card Info */}
                    <div className="text-center">
                      <h3 className="font-bold text-purple-300 font-card text-sm mb-0.5 group-hover:text-purple-200 transition-colors line-clamp-1">
                        {card.nameTh}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-1">{card.name}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

