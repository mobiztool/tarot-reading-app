'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { TarotCard, CardFan } from '@/components/cards';
import { useTarotReading, useCards, useSaveReading } from '@/lib/hooks';
import { SUIT_NAMES } from '@/types/card';
import { generateDetailedPrediction } from '@/lib/tarot/cardMeanings';
import { PageLoader } from '@/components/ui/MysticalLoader';

const POSITION_LABELS = {
  past: { th: 'อดีต', en: 'Past', emoji: '⏪', color: 'from-blue-500 to-indigo-600' },
  present: { th: 'ปัจจุบัน', en: 'Present', emoji: '⏺️', color: 'from-purple-500 to-pink-600' },
  future: { th: 'อนาคต', en: 'Future', emoji: '⏩', color: 'from-amber-500 to-orange-600' },
};

const POSITIONS = ['past', 'present', 'future'] as const;

export default function ThreeCardReadingPage() {
  const [question, setQuestion] = useState('');
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
  const [nextCardToReveal, setNextCardToReveal] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const hasSavedRef = useRef(false);

  // Card selection states
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStep, setSelectionStep] = useState(0); // 0, 1, 2 for three cards
  const [selectedFanIndices, setSelectedFanIndices] = useState<number[]>([]);

  // Fetch real cards from database
  const { cards, isLoading: isLoadingCards } = useCards();

  // Use tarot reading with real cards
  const { readingState, drawnCards, revealedCards, startReading, revealCard, resetReading } =
    useTarotReading(cards.length > 0 ? cards : undefined);

  // Save reading hook
  const { saveReading, isSaving } = useSaveReading();

  const allRevealed = revealedCards.every((r) => r);

  // Start selection mode (show card fan)
  const handleStartSelection = () => {
    setIsSelecting(true);
    setSelectionStep(0);
    setSelectedFanIndices([]);
  };

  // Handle card selection from fan
  const handleSelectFromFan = (index: number) => {
    // Check if this card was already selected
    if (selectedFanIndices.includes(index)) return;

    const newSelectedIndices = [...selectedFanIndices, index];
    setSelectedFanIndices(newSelectedIndices);

    if (newSelectedIndices.length < 3) {
      // Move to next selection step
      setSelectionStep(newSelectedIndices.length);
    } else {
      // All 3 cards selected, start reading after brief delay
      setTimeout(() => {
        startReading('three-card', question || undefined);
        setIsSelecting(false);
        setSelectedCardIndex(null);
        setNextCardToReveal(0);
        setIsSaved(false);
        hasSavedRef.current = false;
      }, 800);
    }
  };

  const handleRevealCard = (index: number) => {
    if (index === nextCardToReveal && !revealedCards[index]) {
      revealCard(index);
      setNextCardToReveal(index + 1);
    }
  };

  const handleReset = () => {
    resetReading();
    setIsSelecting(false);
    setSelectionStep(0);
    setSelectedFanIndices([]);
    setSelectedCardIndex(null);
    setNextCardToReveal(0);
    setIsSaved(false);
    hasSavedRef.current = false;
  };

  // Auto-select first card when all revealed
  useEffect(() => {
    if (allRevealed && selectedCardIndex === null && drawnCards.length > 0) {
      setSelectedCardIndex(0);
    }
  }, [allRevealed, selectedCardIndex, drawnCards.length]);

  // Auto-save when all cards are revealed
  useEffect(() => {
    if (allRevealed && drawnCards.length === 3 && !hasSavedRef.current) {
      hasSavedRef.current = true;
      saveReading('three_card', drawnCards, question || undefined).then((result) => {
        if (result) {
          setIsSaved(true);
        }
      });
    }
  }, [allRevealed, drawnCards, question, saveReading]);

  // Loading cards from database
  if (isLoadingCards) {
    return <PageLoader message="กำลังโหลดไพ่..." />;
  }

  // Selection mode - Show CardFan for 3 card selection (CHECK THIS BEFORE idle)
  if (isSelecting) {
    const currentPosition = POSITIONS[selectionStep];
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-950/20 to-slate-900 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header with current position */}
          <div className="text-center mb-4">
            <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-purple-300 mb-2">
              เลือกไพ่ใบที่ {selectionStep + 1}
            </h2>
            <div className={`inline-block px-6 py-2 rounded-full bg-gradient-to-r ${POSITION_LABELS[currentPosition].color} text-white font-medium text-lg mb-2`}>
              {POSITION_LABELS[currentPosition].emoji} {POSITION_LABELS[currentPosition].th}
            </div>
            <p className="text-slate-400">เลือกไพ่ที่ดึงดูดใจคุณ</p>
          </div>

          {/* Progress Indicator */}
          <div className="flex justify-center gap-3 mb-6">
            {POSITIONS.map((pos, idx) => (
              <div 
                key={pos}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                  idx < selectionStep 
                    ? 'bg-green-600/30 border border-green-500/50' 
                    : idx === selectionStep 
                      ? `bg-gradient-to-r ${POSITION_LABELS[pos].color} shadow-lg` 
                      : 'bg-slate-800/50 border border-slate-700/50'
                }`}
              >
                {idx < selectionStep ? (
                  <span className="text-green-400">✓</span>
                ) : (
                  <span>{POSITION_LABELS[pos].emoji}</span>
                )}
                <span className={`text-sm ${idx <= selectionStep ? 'text-white' : 'text-slate-500'}`}>
                  {POSITION_LABELS[pos].th}
                </span>
              </div>
            ))}
          </div>

          {/* Question reminder */}
          {question && (
            <div className="text-center mb-4">
              <p className="text-slate-500 text-sm">คำถาม: <span className="text-purple-300 italic">&ldquo;{question}&rdquo;</span></p>
            </div>
          )}

          {/* Card Fan */}
          <CardFan
            cardCount={22}
            onSelectCard={handleSelectFromFan}
            selectedIndex={selectedFanIndices[selectionStep] ?? null}
            disabled={selectedFanIndices.length === 3}
          />

          {/* Selected cards preview */}
          {selectedFanIndices.length > 0 && (
            <div className="mt-6">
              <p className="text-center text-slate-500 text-sm mb-3">ไพ่ที่เลือกแล้ว:</p>
              <div className="flex justify-center gap-4">
                {POSITIONS.map((pos, idx) => (
                  <div 
                    key={pos}
                    className={`w-12 h-16 md:w-16 md:h-24 rounded-lg flex items-center justify-center transition-all duration-300 ${
                      idx < selectedFanIndices.length 
                        ? `bg-gradient-to-br ${POSITION_LABELS[pos].color} shadow-lg` 
                        : 'bg-slate-800/50 border-2 border-dashed border-slate-600'
                    }`}
                  >
                    {idx < selectedFanIndices.length ? (
                      <span className="text-white text-lg">✓</span>
                    ) : (
                      <span className="text-slate-600">{idx + 1}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All selected message */}
          {selectedFanIndices.length === 3 && (
            <div className="text-center mt-6 animate-pulse">
              <span className="text-amber-400 text-lg font-medium">
                ✨ กำลังเตรียมไพ่ของคุณ...
              </span>
            </div>
          )}

          {/* Back button */}
          <div className="text-center mt-6">
            <button
              onClick={() => {
                setIsSelecting(false);
                setSelectionStep(0);
                setSelectedFanIndices([]);
              }}
              className="text-slate-500 hover:text-slate-300 transition-colors"
              disabled={selectedFanIndices.length === 3}
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
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/30">
              <span className="text-4xl">🔮</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 mb-4">
              ไพ่ 3 ใบ
            </h1>
            <p className="text-slate-400 text-lg">อดีต • ปัจจุบัน • อนาคต</p>
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
              placeholder="เช่น ความสัมพันธ์ของฉันจะเป็นอย่างไร? หรือ เส้นทางอาชีพของฉัน?"
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
                'ความรักของฉันจะเป็นอย่างไร?',
                'การงานในช่วงนี้?',
                'สถานการณ์ที่กังวลจะออกมาอย่างไร?',
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
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 hover:-translate-y-1"
            >
              <span className="text-xl mr-3">🔮</span>
              เริ่มเลือกไพ่ 3 ใบ
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
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-950/20 to-slate-900 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="flex justify-center gap-4 mb-8">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-16 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl animate-pulse shadow-lg"
                style={{ animationDelay: `${i * 200}ms` }}
              />
            ))}
          </div>
          <h2 className="text-2xl font-bold text-purple-300 mb-2">
            {readingState === 'shuffling' ? 'กำลังสับไพ่...' : 'กำลังจั่วไพ่ 3 ใบ...'}
          </h2>
          <p className="text-slate-400">โปรดรอสักครู่</p>
        </div>
      </div>
    );
  }

  // Revealing state - Show cards to flip sequentially
  if (readingState === 'revealing' && !allRevealed) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-950/20 to-slate-900 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-purple-300 mb-2">เปิดไพ่ทีละใบ</h2>
          <p className="text-slate-400 mb-8">คลิกที่ไพ่ใบที่ {nextCardToReveal + 1} เพื่อเปิดเผย</p>

          {/* Three Cards Layout */}
          <div className="flex justify-center items-center gap-4 md:gap-8 mb-8">
            {drawnCards.map((drawnCard, index) => {
              const positions = ['past', 'present', 'future'] as const;
              const pos = positions[index];
              const isRevealed = revealedCards[index];
              const canReveal = index === nextCardToReveal;

              return (
                <div key={index} className="flex flex-col items-center">
                  {/* Position Label */}
                  <div
                    className={`mb-4 px-4 py-2 rounded-full bg-gradient-to-r ${POSITION_LABELS[pos].color} text-white text-sm font-medium`}
                  >
                    {POSITION_LABELS[pos].emoji} {POSITION_LABELS[pos].th}
                  </div>

                  {/* Card */}
                  <div className="relative">
                    <TarotCard
                      frontImage={drawnCard.card.imageUrl}
                      cardName={drawnCard.card.name}
                      size="md"
                      isReversed={drawnCard.isReversed}
                      isFlipped={isRevealed}
                      onClick={canReveal ? () => handleRevealCard(index) : undefined}
                      className={`
                        ${canReveal ? 'cursor-pointer animate-pulse ring-2 ring-amber-400 ring-offset-2 ring-offset-slate-900' : ''}
                        ${!canReveal && !isRevealed ? 'opacity-50' : ''}
                      `}
                    />
                    {canReveal && !isRevealed && (
                      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-amber-400 text-xs animate-bounce whitespace-nowrap">
                        👆 แตะเพื่อเปิด
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Progress */}
          <div className="text-slate-500 text-sm">
            เปิดแล้ว {revealedCards.filter((r) => r).length} / 3 ใบ
          </div>
        </div>
      </div>
    );
  }

  // Complete state - Show all revealed cards and interpretation
  if ((readingState === 'revealing' || readingState === 'complete') && allRevealed) {
    const selectedCard = selectedCardIndex !== null ? drawnCards[selectedCardIndex] : null;
    const positions = ['past', 'present', 'future'] as const;

    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-950/20 to-slate-900 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Question display */}
          {question && (
            <div className="text-center mb-6">
              <p className="text-slate-500 text-sm mb-1">คำถามของคุณ:</p>
              <p className="text-purple-300 text-lg italic">&ldquo;{question}&rdquo;</p>
            </div>
          )}

          {/* Three Cards Layout */}
          <div className="flex justify-center items-start gap-3 md:gap-6 mb-8">
            {drawnCards.map((drawnCard, index) => {
              const pos = positions[index];
              const isSelected = selectedCardIndex === index;

              return (
                <div
                  key={index}
                  className={`flex flex-col items-center cursor-pointer transition-all duration-300 ${
                    isSelected ? 'scale-105' : 'opacity-70 hover:opacity-100'
                  }`}
                  onClick={() => setSelectedCardIndex(index)}
                >
                  {/* Position Label */}
                  <div
                    className={`mb-3 px-3 py-1 rounded-full bg-gradient-to-r ${POSITION_LABELS[pos].color} text-white text-xs font-medium`}
                  >
                    {POSITION_LABELS[pos].emoji} {POSITION_LABELS[pos].th}
                  </div>

                  {/* Card */}
                  <TarotCard
                    frontImage={drawnCard.card.imageUrl}
                    cardName={drawnCard.card.name}
                    size="sm"
                    isReversed={drawnCard.isReversed}
                    isFlipped={true}
                    showFlipAnimation={false}
                    className={
                      isSelected ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-slate-900' : ''
                    }
                  />

                  {/* Card Name */}
                  <p className="mt-2 text-xs text-center text-slate-400 max-w-[80px] truncate font-card">
                    {drawnCard.card.nameTh}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Selected Card Detail */}
          {selectedCard && (
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 mb-8">
              {/* Card Header */}
              <div className="text-center mb-6">
                <div
                  className={`inline-block px-4 py-1 rounded-full bg-gradient-to-r ${POSITION_LABELS[positions[selectedCardIndex!]].color} text-white text-sm font-medium mb-4`}
                >
                  {POSITION_LABELS[positions[selectedCardIndex!]].emoji}{' '}
                  {POSITION_LABELS[positions[selectedCardIndex!]].th}
                </div>

                <h2 className="text-2xl md:text-3xl font-bold font-card text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-purple-300 mb-1">
                  {selectedCard.card.nameTh}
                </h2>
                <p className="text-purple-400 font-card">{selectedCard.card.name}</p>
                <div className="flex justify-center items-center gap-3 text-sm text-slate-500 mt-2">
                  <span>{selectedCard.card.suit ? SUIT_NAMES[selectedCard.card.suit].th : 'Major Arcana'}</span>
                  <span>•</span>
                  <span className={selectedCard.isReversed ? 'text-red-400' : 'text-green-400'}>
                    {selectedCard.isReversed ? '🔄 กลับหัว' : '✨ ตั้งตรง'}
                  </span>
                </div>
              </div>

              {/* Keywords */}
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {(selectedCard.isReversed
                  ? selectedCard.card.keywordsReversed || selectedCard.card.keywordsTh || []
                  : selectedCard.card.keywordsUpright || selectedCard.card.keywordsTh || []
                ).map((keyword, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-purple-900/50 text-purple-300 rounded-full text-sm"
                  >
                    {keyword}
                  </span>
                ))}
              </div>

              {/* Enhanced Meaning */}
              {(() => {
                const detailedMeaning = generateDetailedPrediction(
                  selectedCard.card.slug,
                  selectedCard.isReversed,
                  selectedCard.card.suit,
                  selectedCard.card.number,
                  selectedCard.card.nameTh
                );
                return (
                  <div className="space-y-4">
                    <div className="bg-amber-900/20 border border-amber-500/20 rounded-xl p-4">
                      <h3 className="text-lg font-bold text-amber-300 mb-2">🔮 คำทำนาย</h3>
                      <p className="text-slate-200 leading-relaxed">
                        {detailedMeaning.prediction}
                      </p>
                    </div>

                    <div className="bg-pink-900/20 border border-pink-500/20 rounded-xl p-4">
                      <h3 className="text-base font-bold text-pink-300 mb-2">💕 ความรัก</h3>
                      <p className="text-slate-300 leading-relaxed text-sm">
                        {detailedMeaning.love}
                      </p>
                    </div>

                    <div className="bg-green-900/20 border border-green-500/20 rounded-xl p-4">
                      <h3 className="text-base font-bold text-green-300 mb-2">💼 การงาน</h3>
                      <p className="text-slate-300 leading-relaxed text-sm">
                        {detailedMeaning.career}
                      </p>
                    </div>

                    <div className="bg-purple-900/20 border border-purple-500/20 rounded-xl p-4">
                      <h3 className="text-base font-bold text-purple-300 mb-2">💡 คำแนะนำ</h3>
                      <p className="text-slate-200 leading-relaxed text-sm">
                        {detailedMeaning.advice}
                      </p>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Quick Navigation */}
          <div className="text-center mb-8">
            <p className="text-slate-500 text-sm mb-3">คลิกไพ่ด้านบนเพื่อดูรายละเอียด</p>
          </div>

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
