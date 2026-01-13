'use client';

import { useState } from 'react';
import { TarotCard } from '@/components/cards';

export default function CardDemoPage() {
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  const toggleFlip = (cardId: string) => {
    setFlippedCards((prev) => ({
      ...prev,
      [cardId]: !prev[cardId],
    }));
  };

  const demoCards = [
    { id: 'fool', name: 'The Fool', nameTh: 'คนโง่', isReversed: false },
    { id: 'magician', name: 'The Magician', nameTh: 'นักมายากล', isReversed: false },
    { id: 'priestess', name: 'The High Priestess', nameTh: 'นักบวชหญิง', isReversed: true },
  ];

  return (
    <div className="min-h-screen bg-slate-900 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-300 to-amber-300 mb-4">
            🎴 Card Component Demo
          </h1>
          <p className="text-slate-400 text-lg">คลิกที่ไพ่เพื่อพลิกดู • Click cards to flip them</p>
        </div>

        {/* Card Size Demos */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-purple-300 mb-6 text-center">
            ขนาดไพ่ต่างๆ (Card Sizes)
          </h2>
          <div className="flex flex-wrap justify-center items-end gap-8">
            {(['sm', 'md', 'lg', 'xl'] as const).map((size) => (
              <div key={size} className="text-center">
                <TarotCard
                  frontImage="/cards/placeholder.svg"
                  cardName="The Fool"
                  size={size}
                  isFlipped={flippedCards[`size-${size}`]}
                  onClick={() => toggleFlip(`size-${size}`)}
                  className="card-hover"
                />
                <p className="text-slate-400 mt-3 text-sm uppercase tracking-wider">{size}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Interactive Cards */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-purple-300 mb-6 text-center">
            ไพ่แบบ Interactive (Flip Animation)
          </h2>
          <div className="flex flex-wrap justify-center gap-8">
            {demoCards.map((card) => (
              <div key={card.id} className="text-center">
                <TarotCard
                  frontImage="/cards/placeholder.svg"
                  cardName={card.name}
                  size="lg"
                  isReversed={card.isReversed}
                  isFlipped={flippedCards[card.id]}
                  onClick={() => toggleFlip(card.id)}
                  className="card-hover"
                />
                <div className="mt-4">
                  <p className="text-amber-300 font-card text-lg">{card.name}</p>
                  <p className="text-slate-400 font-card">{card.nameTh}</p>
                  {card.isReversed && (
                    <span className="inline-block mt-2 text-xs text-purple-300 bg-purple-900/50 px-2 py-1 rounded-full">
                      กลับหัว (Reversed)
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Card Back Preview */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-purple-300 mb-6 text-center">
            ด้านหลังไพ่ (Card Back Design)
          </h2>
          <div className="flex justify-center gap-8">
            <div className="text-center">
              <div className="animate-float">
                <TarotCard
                  frontImage="/cards/placeholder.svg"
                  cardName="Card Back"
                  size="lg"
                  isFlipped={false}
                  className="animate-card-glow"
                />
              </div>
              <p className="text-slate-400 mt-4">Mystical Design with Animation</p>
            </div>
          </div>
        </section>

        {/* Animation Effects */}
        <section>
          <h2 className="text-2xl font-semibold text-purple-300 mb-6 text-center">
            Animation Effects
          </h2>
          <div className="flex flex-wrap justify-center gap-12">
            <div className="text-center">
              <div className="card-shimmer relative">
                <TarotCard
                  frontImage="/cards/placeholder.svg"
                  cardName="Shimmer Effect"
                  size="md"
                  isFlipped={false}
                />
              </div>
              <p className="text-slate-400 mt-3">Shimmer</p>
            </div>
            <div className="text-center">
              <div className="animate-float">
                <TarotCard
                  frontImage="/cards/placeholder.svg"
                  cardName="Float Effect"
                  size="md"
                  isFlipped={false}
                />
              </div>
              <p className="text-slate-400 mt-3">Float</p>
            </div>
            <div className="text-center">
              <TarotCard
                frontImage="/cards/placeholder.svg"
                cardName="Glow Effect"
                size="md"
                isFlipped={false}
                className="animate-card-glow"
              />
              <p className="text-slate-400 mt-3">Glow</p>
            </div>
          </div>
        </section>

        {/* Instructions */}
        <div className="mt-16 text-center text-slate-500 text-sm">
          <p>
            📁 Card images will be stored in:{' '}
            <code className="text-purple-400">/public/cards/</code>
          </p>
          <p className="mt-1">
            🎨 Folder structure: <code className="text-purple-400">major/</code>,{' '}
            <code className="text-purple-400">wands/</code>,{' '}
            <code className="text-purple-400">cups/</code>,{' '}
            <code className="text-purple-400">swords/</code>,{' '}
            <code className="text-purple-400">pentacles/</code>
          </p>
        </div>
      </div>
    </div>
  );
}

