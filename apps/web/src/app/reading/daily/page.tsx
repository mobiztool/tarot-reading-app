'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { TarotCard, CardFan } from '@/components/cards';
import { useTarotReading, useCards, useSaveReading } from '@/lib/hooks';
import { SUIT_NAMES } from '@/types/card';
import { generateDetailedPrediction } from '@/lib/tarot/cardMeanings';
import { PageLoader } from '@/components/ui/MysticalLoader';

export default function DailyReadingPage() {
  const [question, setQuestion] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedFanIndex, setSelectedFanIndex] = useState<number | null>(null);
  const hasSavedRef = useRef(false);

  // Fetch real cards from database
  const { cards, isLoading: isLoadingCards } = useCards();

  // Use tarot reading with real cards
  const { readingState, drawnCards, revealedCards, startReading, revealCard, resetReading } =
    useTarotReading(cards.length > 0 ? cards : undefined);

  // Save reading hook
  const { saveReading, isSaving } = useSaveReading();

  const drawnCard = drawnCards[0];
  const isRevealed = revealedCards[0];

  // Auto-save when reading is complete
  useEffect(() => {
    if (isRevealed && drawnCards.length > 0 && !hasSavedRef.current) {
      hasSavedRef.current = true;
      saveReading('daily', drawnCards, question || undefined).then((result) => {
        if (result) {
          setIsSaved(true);
        }
      });
    }
  }, [isRevealed, drawnCards, question, saveReading]);

  // Start selection mode (show card fan)
  const handleStartSelection = () => {
    setIsSelecting(true);
    setSelectedFanIndex(null);
  };

  // Handle card selection from fan
  const handleSelectFromFan = (index: number) => {
    setSelectedFanIndex(index);
    // Start reading after brief delay for visual feedback
    setTimeout(() => {
      startReading('daily', question || undefined);
      setIsSelecting(false);
      setIsSaved(false);
      hasSavedRef.current = false;
    }, 800);
  };

  const handleRevealCard = () => {
    revealCard(0);
  };

  const handleReset = () => {
    resetReading();
    setIsSelecting(false);
    setSelectedFanIndex(null);
    setIsSaved(false);
    hasSavedRef.current = false;
  };

  // Loading cards from database
  if (isLoadingCards) {
    return <PageLoader message="กำลังโหลดไพ่..." />;
  }

  // Selection mode - Show CardFan
  if (isSelecting) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-950/20 to-slate-900 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-4">
            <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-purple-300 mb-2">
              เลือกไพ่ที่เรียกหาคุณ
            </h2>
            <p className="text-slate-400">ตั้งสติ หายใจลึกๆ แล้วเลือกไพ่ที่ดึงดูดคุณที่สุด</p>
          </div>

          {/* Question reminder */}
          {question && (
            <div className="text-center mb-4">
              <p className="text-purple-400 text-sm italic">&ldquo;{question}&rdquo;</p>
            </div>
          )}

          {/* Card Fan - Realistic fan spread */}
          <CardFan
            cardCount={22}
            onSelectCard={handleSelectFromFan}
            selectedIndex={selectedFanIndex}
            disabled={selectedFanIndex !== null}
          />

          {/* Back button */}
          <div className="text-center mt-4">
            <button
              onClick={() => setIsSelecting(false)}
              className="text-slate-500 hover:text-slate-300 transition-colors"
              disabled={selectedFanIndex !== null}
            >
              ← ย้อนกลับ
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Idle state - Show question input and start button
  if (readingState === 'idle') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-950/20 to-slate-900 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30">
              <span className="text-4xl">☀️</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-purple-300 mb-4">
              ดูดวงประจำวัน
            </h1>
            <p className="text-slate-400 text-lg">จั่วไพ่ 1 ใบเพื่อรับคำแนะนำสำหรับวันนี้</p>
          </div>

          {/* Question Input */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 mb-8">
            <label htmlFor="question" className="block text-purple-300 font-medium mb-3">
              คำถามของคุณ <span className="text-slate-500">(ไม่จำเป็น)</span>
            </label>
            <textarea
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="เช่น วันนี้ฉันควรมีสติกับเรื่องอะไร? หรือ ฉันต้องการพลังงานแบบไหนวันนี้?"
              className="w-full bg-slate-900/50 border border-slate-600/50 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 resize-none"
              rows={3}
              maxLength={500}
            />
            <p className="text-right text-slate-500 text-sm mt-2">{question.length}/500</p>
          </div>

          {/* Sample Questions */}
          <div className="mb-8">
            <p className="text-slate-500 text-sm mb-3">💡 ตัวอย่างคำถาม:</p>
            <div className="flex flex-wrap gap-2">
              {[
                'วันนี้ฉันควรโฟกัสเรื่องอะไร?',
                'ฉันต้องการคำแนะนำอะไรวันนี้?',
                'พลังงานของฉันวันนี้เป็นอย่างไร?',
              ].map((sample) => (
                <button
                  key={sample}
                  onClick={() => setQuestion(sample)}
                  className="text-sm bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-300 px-3 py-1.5 rounded-full transition-colors"
                >
                  {sample}
                </button>
              ))}
            </div>
          </div>

          {/* Start Button */}
          <div className="text-center">
            <button
              onClick={handleStartSelection}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-amber-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 hover:-translate-y-1 btn-interactive"
            >
              <span className="text-xl mr-3">🔮</span>
              เริ่มเลือกไพ่
            </button>
          </div>

          {/* Back link */}
          <div className="text-center mt-8">
            <Link href="/reading" className="text-slate-500 hover:text-slate-300 transition-colors">
              ← เลือกรูปแบบอื่น
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Shuffling/Drawing state
  if (readingState === 'shuffling' || readingState === 'drawing') {
    return <PageLoader message={readingState === 'shuffling' ? 'กำลังสับไพ่...' : 'กำลังจั่วไพ่...'} />;
  }

  // Revealing state - Show card to flip
  if (readingState === 'revealing' && drawnCard && !isRevealed) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-950/20 to-slate-900 py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-purple-300 mb-4">
            ไพ่ของคุณพร้อมแล้ว
          </h2>
          <p className="text-slate-400 mb-12">คลิกที่ไพ่เพื่อเปิดเผยคำทำนาย</p>

          {/* Card to flip */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <TarotCard
                frontImage={drawnCard.card.imageUrl}
                cardName={drawnCard.card.name}
                size="xl"
                isReversed={drawnCard.isReversed}
                isFlipped={false}
                onClick={handleRevealCard}
                className="card-hover animate-float cursor-pointer"
              />
              {/* Tap hint */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-purple-400 text-sm animate-bounce">
                👆 แตะเพื่อเปิด
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Complete state - Show result
  if ((readingState === 'revealing' || readingState === 'complete') && drawnCard && isRevealed) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-950/20 to-slate-900 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Question display */}
          {question && (
            <div className="text-center mb-8">
              <p className="text-slate-500 text-sm mb-1">คำถามของคุณ:</p>
              <p className="text-purple-300 text-lg italic">&ldquo;{question}&rdquo;</p>
            </div>
          )}

          {/* Card Display */}
          <div className="flex justify-center mb-8">
            <TarotCard
              frontImage={drawnCard.card.imageUrl}
              cardName={drawnCard.card.name}
              size="lg"
              isReversed={drawnCard.isReversed}
              isFlipped={true}
              showFlipAnimation={false}
              className="sparkle-effect"
            />
          </div>

          {/* Card Info */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold font-card text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-purple-300 mb-2">
              {drawnCard.card.nameTh}
            </h1>
            <p className="text-purple-400 text-lg font-card mb-2">{drawnCard.card.name}</p>
            <div className="flex justify-center items-center gap-3 text-sm text-slate-500">
              <span>{drawnCard.card.suit ? SUIT_NAMES[drawnCard.card.suit].th : 'Major Arcana'}</span>
              <span>•</span>
              <span className={drawnCard.isReversed ? 'text-red-400' : 'text-green-400'}>
                {drawnCard.isReversed ? '🔄 กลับหัว (Reversed)' : '✨ ตั้งตรง (Upright)'}
              </span>
            </div>
          </div>

          {/* Keywords */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {(drawnCard.isReversed
              ? drawnCard.card.keywordsReversed || drawnCard.card.keywordsTh || []
              : drawnCard.card.keywordsUpright || drawnCard.card.keywordsTh || []
            ).map((keyword, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-purple-900/50 text-purple-300 rounded-full text-sm"
              >
                {keyword}
              </span>
            ))}
          </div>

          {/* Enhanced Interpretation */}
          {(() => {
            const detailedMeaning = generateDetailedPrediction(
              drawnCard.card.slug,
              drawnCard.isReversed,
              drawnCard.card.suit,
              drawnCard.card.number,
              drawnCard.card.nameTh
            );
            return (
              <div className="space-y-6 mb-8">
                {/* Main Prediction */}
                <div className="bg-gradient-to-br from-amber-900/30 to-purple-900/30 border border-amber-500/30 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-amber-300 mb-4 flex items-center gap-2">
                    🔮 คำทำนาย
                  </h3>
                  <p className="text-slate-200 leading-relaxed text-lg">
                    {detailedMeaning.prediction}
                  </p>
                </div>

                {/* Love & Relationships */}
                <div className="bg-slate-800/50 border border-pink-500/30 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-pink-300 mb-3 flex items-center gap-2">
                    💕 ความรักและความสัมพันธ์
                  </h3>
                  <p className="text-slate-300 leading-relaxed">
                    {detailedMeaning.love}
                  </p>
                </div>

                {/* Career & Finance */}
                <div className="bg-slate-800/50 border border-green-500/30 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-green-300 mb-3 flex items-center gap-2">
                    💼 การงานและการเงิน
                  </h3>
                  <p className="text-slate-300 leading-relaxed">
                    {detailedMeaning.career}
                  </p>
                </div>

                {/* Advice */}
                <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border border-purple-500/30 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-purple-300 mb-3 flex items-center gap-2">
                    💡 คำแนะนำ
                  </h3>
                  <p className="text-slate-200 leading-relaxed">
                    {detailedMeaning.advice}
                  </p>
                </div>
              </div>
            );
          })()}

          {/* Save Status */}
          {(isSaving || isSaved) && (
            <div className="text-center mb-6">
              {isSaving ? (
                <span className="text-purple-400 text-sm animate-pulse">💾 กำลังบันทึก...</span>
              ) : isSaved ? (
                <span className="text-green-400 text-sm">✅ บันทึกแล้ว</span>
              ) : null}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={handleReset}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium rounded-xl transition-all duration-300"
            >
              🔄 ดูอีกครั้ง
            </button>

            <Link
              href="/history"
              className="inline-flex items-center px-6 py-3 bg-slate-700 hover:bg-slate-600 text-slate-300 font-medium rounded-xl transition-colors"
            >
              📜 ดูประวัติ
            </Link>

            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl transition-colors"
            >
              🏠 กลับหน้าแรก
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Fallback
  return null;
}
