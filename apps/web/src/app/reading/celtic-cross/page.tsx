'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { TarotCard, CardFan } from '@/components/cards';
import { useTarotReading, useCards, useSaveReading, useAuth } from '@/lib/hooks';
import { SUIT_NAMES, PositionLabel } from '@/types/card';
import { generateDetailedPrediction } from '@/lib/tarot/cardMeanings';
import { PageLoader } from '@/components/ui/MysticalLoader';
import { PremiumGate } from '@/components/gates';
import { canAccessSpread, SPREAD_INFO } from '@/lib/access-control/spreads';

// Celtic Cross 10 Position Labels
const CELTIC_CROSS_POSITIONS: PositionLabel[] = [
  'cc_present',
  'cc_challenge',
  'cc_past',
  'cc_future',
  'cc_above',
  'cc_below',
  'cc_advice',
  'cc_external',
  'cc_hopes_fears',
  'cc_outcome',
];

const POSITION_LABELS = {
  cc_present: { th: 'สถานการณ์ปัจจุบัน', en: 'Present Situation', emoji: '⏺️', color: 'from-purple-500 to-pink-600', shortTh: 'ปัจจุบัน' },
  cc_challenge: { th: 'อุปสรรค/ความท้าทาย', en: 'Challenge', emoji: '⚔️', color: 'from-red-500 to-orange-600', shortTh: 'อุปสรรค' },
  cc_past: { th: 'รากฐาน/อดีต', en: 'Foundation/Past', emoji: '⏪', color: 'from-blue-500 to-indigo-600', shortTh: 'อดีต' },
  cc_future: { th: 'อนาคตอันใกล้', en: 'Near Future', emoji: '⏩', color: 'from-amber-500 to-orange-600', shortTh: 'อนาคต' },
  cc_above: { th: 'เป้าหมาย/ความปรารถนา', en: 'Goals/Aspirations', emoji: '⬆️', color: 'from-yellow-500 to-amber-600', shortTh: 'เป้าหมาย' },
  cc_below: { th: 'จิตใต้สำนึก', en: 'Subconscious', emoji: '⬇️', color: 'from-teal-500 to-cyan-600', shortTh: 'จิตใจ' },
  cc_advice: { th: 'คำแนะนำ', en: 'Advice', emoji: '💡', color: 'from-green-500 to-emerald-600', shortTh: 'แนะนำ' },
  cc_external: { th: 'อิทธิพลภายนอก', en: 'External Influences', emoji: '🌍', color: 'from-sky-500 to-blue-600', shortTh: 'ภายนอก' },
  cc_hopes_fears: { th: 'ความหวัง/ความกลัว', en: 'Hopes & Fears', emoji: '🌓', color: 'from-violet-500 to-purple-600', shortTh: 'หวัง/กลัว' },
  cc_outcome: { th: 'ผลลัพธ์สุดท้าย', en: 'Final Outcome', emoji: '🎯', color: 'from-rose-500 to-pink-600', shortTh: 'ผลลัพธ์' },
};

export default function CelticCrossReadingPage() {
  const { user, isLoading: isLoadingAuth } = useAuth();
  const [question, setQuestion] = useState('');
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
  const [nextCardToReveal, setNextCardToReveal] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const hasSavedRef = useRef(false);

  // Access control state
  const [accessCheck, setAccessCheck] = useState<{
    checked: boolean;
    allowed: boolean;
    currentTier: 'free' | 'basic' | 'pro' | 'vip';
    requiredTier?: 'free' | 'basic' | 'pro' | 'vip';
  }>({ checked: false, allowed: false, currentTier: 'free' });

  // Card selection states
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStep, setSelectionStep] = useState(0);
  const [selectedFanIndices, setSelectedFanIndices] = useState<number[]>([]);

  // Fetch real cards from database
  const { cards, isLoading: isLoadingCards } = useCards();

  // Use tarot reading with real cards
  const { readingState, drawnCards, revealedCards, startReading, revealCard, resetReading } =
    useTarotReading(cards.length > 0 ? cards : undefined);

  // Save reading hook
  const { saveReading, isSaving } = useSaveReading();

  const allRevealed = revealedCards.every((r) => r);

  // Check premium access
  useEffect(() => {
    async function checkAccess() {
      const result = await canAccessSpread(user?.id || null, 'celtic_cross');
      setAccessCheck({
        checked: true,
        allowed: result.allowed,
        currentTier: result.currentTier,
        requiredTier: result.requiredTier,
      });
    }
    
    if (!isLoadingAuth) {
      checkAccess();
    }
  }, [user, isLoadingAuth]);

  // Start selection mode (show card fan)
  const handleStartSelection = () => {
    setIsSelecting(true);
    setSelectionStep(0);
    setSelectedFanIndices([]);
  };

  // Handle card selection from fan
  const handleSelectFromFan = (index: number) => {
    if (selectedFanIndices.includes(index)) return;

    const newSelectedIndices = [...selectedFanIndices, index];
    setSelectedFanIndices(newSelectedIndices);

    if (newSelectedIndices.length < 10) {
      setSelectionStep(newSelectedIndices.length);
    } else {
      // All 10 cards selected, start reading after brief delay
      setTimeout(() => {
        startReading('celtic-cross' as Parameters<typeof startReading>[0], question || undefined);
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
    if (allRevealed && drawnCards.length === 10 && !hasSavedRef.current) {
      hasSavedRef.current = true;
      saveReading('celtic_cross' as Parameters<typeof saveReading>[0], drawnCards, question || undefined).then((result) => {
        if (result) {
          setIsSaved(true);
        }
      });
    }
  }, [allRevealed, drawnCards, question, saveReading]);

  // Loading states
  if (isLoadingAuth || !accessCheck.checked) {
    return <PageLoader message="กำลังตรวจสอบสิทธิ์..." />;
  }

  // Premium gate - show if user doesn't have access
  if (!accessCheck.allowed) {
    const spreadInfo = SPREAD_INFO.celtic_cross;
    return (
      <PremiumGate
        spreadName="celtic-cross"
        spreadNameTh={spreadInfo.nameTh}
        spreadIcon={spreadInfo.icon}
        requiredTier={accessCheck.requiredTier || 'pro'}
        currentTier={accessCheck.currentTier}
      />
    );
  }

  // Loading cards from database
  if (isLoadingCards) {
    return <PageLoader message="กำลังโหลดไพ่..." />;
  }

  // Selection mode - Show CardFan for 10 card selection
  if (isSelecting) {
    const currentPosition = CELTIC_CROSS_POSITIONS[selectionStep];
    const posInfo = POSITION_LABELS[currentPosition];

    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-950/20 to-slate-900 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header with current position */}
          <div className="text-center mb-4">
            <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-purple-300 mb-2">
              เลือกไพ่ใบที่ {selectionStep + 1}/10
            </h2>
            <div className={`inline-block px-6 py-2 rounded-full bg-gradient-to-r ${posInfo.color} text-white font-medium text-lg mb-2`}>
              {posInfo.emoji} {posInfo.th}
            </div>
            <p className="text-slate-400">เลือกไพ่ที่ดึงดูดใจคุณ</p>
          </div>

          {/* Progress Indicator - 2 rows for 10 cards */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {CELTIC_CROSS_POSITIONS.map((pos, idx) => {
              const info = POSITION_LABELS[pos];
              return (
                <div
                  key={pos}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-all duration-300 text-xs ${
                    idx < selectionStep
                      ? 'bg-green-600/30 border border-green-500/50'
                      : idx === selectionStep
                        ? `bg-gradient-to-r ${info.color} shadow-lg`
                        : 'bg-slate-800/50 border border-slate-700/50'
                  }`}
                >
                  {idx < selectionStep ? (
                    <span className="text-green-400">✓</span>
                  ) : (
                    <span>{info.emoji}</span>
                  )}
                  <span className={`${idx <= selectionStep ? 'text-white' : 'text-slate-500'}`}>
                    {info.shortTh}
                  </span>
                </div>
              );
            })}
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
            disabled={selectedFanIndices.length === 10}
          />

          {/* Selected cards preview */}
          {selectedFanIndices.length > 0 && (
            <div className="mt-6">
              <p className="text-center text-slate-500 text-sm mb-3">ไพ่ที่เลือกแล้ว: {selectedFanIndices.length}/10</p>
              <div className="flex flex-wrap justify-center gap-2">
                {CELTIC_CROSS_POSITIONS.slice(0, 5).map((pos, idx) => (
                  <div
                    key={pos}
                    className={`w-10 h-14 md:w-12 md:h-16 rounded-lg flex items-center justify-center transition-all duration-300 ${
                      idx < selectedFanIndices.length
                        ? `bg-gradient-to-br ${POSITION_LABELS[pos].color} shadow-lg`
                        : 'bg-slate-800/50 border-2 border-dashed border-slate-600'
                    }`}
                  >
                    {idx < selectedFanIndices.length ? (
                      <span className="text-white text-sm">✓</span>
                    ) : (
                      <span className="text-slate-600 text-xs">{idx + 1}</span>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                {CELTIC_CROSS_POSITIONS.slice(5).map((pos, idx) => (
                  <div
                    key={pos}
                    className={`w-10 h-14 md:w-12 md:h-16 rounded-lg flex items-center justify-center transition-all duration-300 ${
                      idx + 5 < selectedFanIndices.length
                        ? `bg-gradient-to-br ${POSITION_LABELS[pos].color} shadow-lg`
                        : 'bg-slate-800/50 border-2 border-dashed border-slate-600'
                    }`}
                  >
                    {idx + 5 < selectedFanIndices.length ? (
                      <span className="text-white text-sm">✓</span>
                    ) : (
                      <span className="text-slate-600 text-xs">{idx + 6}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All selected message */}
          {selectedFanIndices.length === 10 && (
            <div className="text-center mt-6 animate-pulse">
              <span className="text-amber-400 text-lg font-medium">
                ✨ กำลังเตรียมไพ่ 10 ใบของคุณ...
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
              disabled={selectedFanIndices.length === 10}
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
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-amber-400 to-rose-600 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30">
              <span className="text-4xl">✨</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-rose-300 mb-4">
              กากบาทเซลติก
            </h1>
            <p className="text-slate-400 text-lg">Celtic Cross • 10 ไพ่ • การอ่านเชิงลึกครบถ้วน</p>
            <div className="mt-4 inline-block px-4 py-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white text-sm font-medium">
              ✨ Pro Feature
            </div>
          </div>

          {/* Spread Description */}
          <div className="bg-slate-800/50 border border-amber-500/30 rounded-2xl p-6 mb-8">
            <h2 className="text-lg font-semibold text-amber-300 mb-3">🔮 เกี่ยวกับ Celtic Cross</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              Celtic Cross เป็นรูปแบบการอ่านไพ่ทาโรต์ที่ครบถ้วนและละเอียดที่สุด ใช้ไพ่ 10 ใบเพื่อให้ภาพรวมชีวิตอย่างครอบคลุม 
              ตั้งแต่สถานการณ์ปัจจุบัน อดีต อนาคต อุปสรรค ไปจนถึงผลลัพธ์สุดท้าย
            </p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2 text-slate-400">
                <span>⏱️</span> ~10 นาที
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <span>🎴</span> 10 ไพ่
              </div>
            </div>
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
              placeholder="เช่น ภาพรวมชีวิตของฉันในช่วง 6 เดือนข้างหน้า?"
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
                'ภาพรวมชีวิตของฉันจะเป็นอย่างไร?',
                'ทิศทางความสัมพันธ์และอาชีพ?',
                'สิ่งที่ควรโฟกัสในปีนี้?',
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
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white font-semibold rounded-xl shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-all duration-300 hover:-translate-y-1"
            >
              <span className="text-xl mr-3">✨</span>
              เริ่มเลือกไพ่ 10 ใบ
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
          <div className="flex justify-center gap-2 mb-8 flex-wrap max-w-md">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="w-12 h-18 bg-gradient-to-br from-amber-500 to-rose-500 rounded-lg animate-pulse shadow-lg"
                style={{ animationDelay: `${i * 100}ms` }}
              />
            ))}
          </div>
          <h2 className="text-2xl font-bold text-amber-300 mb-2">
            {readingState === 'shuffling' ? 'กำลังสับไพ่...' : 'กำลังจั่วไพ่ 10 ใบ...'}
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
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-amber-300 mb-2">เปิดไพ่ทีละใบ</h2>
          <p className="text-slate-400 mb-8">คลิกที่ไพ่ใบที่ {nextCardToReveal + 1} เพื่อเปิดเผย</p>

          {/* Celtic Cross Layout */}
          <div className="relative mx-auto" style={{ maxWidth: '800px' }}>
            {/* Mobile: Vertical stack */}
            <div className="md:hidden space-y-4">
              {drawnCards.map((drawnCard, index) => {
                const pos = CELTIC_CROSS_POSITIONS[index];
                const posInfo = POSITION_LABELS[pos];
                const isRevealed = revealedCards[index];
                const canReveal = index === nextCardToReveal;

                return (
                  <div key={index} className="flex items-center gap-4 bg-slate-800/30 rounded-xl p-3">
                    <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${posInfo.color} text-white text-xs font-medium whitespace-nowrap`}>
                      {posInfo.emoji} {posInfo.shortTh}
                    </div>
                    <div className="relative">
                      <TarotCard
                        frontImage={drawnCard.card.imageUrl}
                        cardName={drawnCard.card.name}
                        size="sm"
                        isReversed={drawnCard.isReversed}
                        isFlipped={isRevealed}
                        onClick={canReveal ? () => handleRevealCard(index) : undefined}
                        className={`
                          ${canReveal ? 'cursor-pointer animate-pulse ring-2 ring-amber-400' : ''}
                          ${!canReveal && !isRevealed ? 'opacity-50' : ''}
                        `}
                      />
                    </div>
                    {isRevealed && (
                      <span className="text-slate-300 text-sm truncate flex-1">{drawnCard.card.nameTh}</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Desktop: Celtic Cross formation */}
            <div className="hidden md:block">
              {/* Cross Formation (positions 0-5) */}
              <div className="grid grid-cols-5 gap-4 mb-8" style={{ gridTemplateRows: 'repeat(3, auto)' }}>
                {/* Row 1: Above (position 4) */}
                <div className="col-start-3 flex flex-col items-center">
                  {renderCard(4)}
                </div>
                
                {/* Row 2: Past, Present+Challenge, Future */}
                <div className="col-start-2 flex flex-col items-center">
                  {renderCard(2)}
                </div>
                <div className="col-start-3 relative flex flex-col items-center">
                  {/* Present (0) */}
                  {renderCard(0)}
                  {/* Challenge (1) - overlaid */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90">
                    {renderCard(1, true)}
                  </div>
                </div>
                <div className="col-start-4 flex flex-col items-center">
                  {renderCard(3)}
                </div>
                
                {/* Row 3: Below (position 5) */}
                <div className="col-start-3 flex flex-col items-center">
                  {renderCard(5)}
                </div>
              </div>

              {/* Staff (positions 6-9) - right side */}
              <div className="absolute right-0 top-0 flex flex-col gap-4">
                {[9, 8, 7, 6].map((idx) => (
                  <div key={idx}>{renderCard(idx)}</div>
                ))}
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="text-slate-500 text-sm mt-8">
            เปิดแล้ว {revealedCards.filter((r) => r).length} / 10 ใบ
          </div>
        </div>
      </div>
    );

    function renderCard(index: number, isChallenge = false) {
      const drawnCard = drawnCards[index];
      if (!drawnCard) return null;
      
      const pos = CELTIC_CROSS_POSITIONS[index];
      const posInfo = POSITION_LABELS[pos];
      const isRevealed = revealedCards[index];
      const canReveal = index === nextCardToReveal;

      return (
        <div className={`flex flex-col items-center ${isChallenge ? '' : ''}`}>
          {!isChallenge && (
            <div className={`mb-2 px-3 py-1 rounded-full bg-gradient-to-r ${posInfo.color} text-white text-xs font-medium`}>
              {posInfo.emoji} {posInfo.shortTh}
            </div>
          )}
          <div className="relative">
            <TarotCard
              frontImage={drawnCard.card.imageUrl}
              cardName={drawnCard.card.name}
              size="sm"
              isReversed={drawnCard.isReversed}
              isFlipped={isRevealed}
              onClick={canReveal ? () => handleRevealCard(index) : undefined}
              className={`
                ${canReveal ? 'cursor-pointer animate-pulse ring-2 ring-amber-400 ring-offset-2 ring-offset-slate-900' : ''}
                ${!canReveal && !isRevealed ? 'opacity-50' : ''}
              `}
            />
            {canReveal && !isRevealed && (
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-amber-400 text-xs animate-bounce whitespace-nowrap">
                👆 แตะเพื่อเปิด
              </div>
            )}
          </div>
        </div>
      );
    }
  }

  // Complete state - Show all revealed cards and interpretation
  if ((readingState === 'revealing' || readingState === 'complete') && allRevealed) {
    const selectedCard = selectedCardIndex !== null ? drawnCards[selectedCardIndex] : null;

    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-950/20 to-slate-900 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Question display */}
          {question && (
            <div className="text-center mb-6">
              <p className="text-slate-500 text-sm mb-1">คำถามของคุณ:</p>
              <p className="text-amber-300 text-lg italic">&ldquo;{question}&rdquo;</p>
            </div>
          )}

          {/* All 10 Cards Grid */}
          <div className="grid grid-cols-5 md:grid-cols-10 gap-2 md:gap-3 mb-8">
            {drawnCards.map((drawnCard, index) => {
              const pos = CELTIC_CROSS_POSITIONS[index];
              const posInfo = POSITION_LABELS[pos];
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
                    className={`mb-2 px-2 py-0.5 rounded-full bg-gradient-to-r ${posInfo.color} text-white text-[10px] font-medium whitespace-nowrap`}
                  >
                    {posInfo.emoji}
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

                  {/* Position name */}
                  <p className="mt-1 text-[10px] text-center text-slate-500 max-w-[60px] truncate">
                    {posInfo.shortTh}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Selected Card Detail */}
          {selectedCard && selectedCardIndex !== null && (
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 mb-8">
              {/* Card Header */}
              <div className="text-center mb-6">
                <div
                  className={`inline-block px-4 py-1 rounded-full bg-gradient-to-r ${POSITION_LABELS[CELTIC_CROSS_POSITIONS[selectedCardIndex]].color} text-white text-sm font-medium mb-4`}
                >
                  {POSITION_LABELS[CELTIC_CROSS_POSITIONS[selectedCardIndex]].emoji}{' '}
                  {POSITION_LABELS[CELTIC_CROSS_POSITIONS[selectedCardIndex]].th}
                </div>

                <h2 className="text-2xl md:text-3xl font-bold font-card text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-rose-300 mb-1">
                  {selectedCard.card.nameTh}
                </h2>
                <p className="text-amber-400 font-card">{selectedCard.card.name}</p>
                <div className="flex justify-center items-center gap-3 text-sm text-slate-500 mt-2">
                  <span>{selectedCard.card.suit ? SUIT_NAMES[selectedCard.card.suit].th : 'ไพ่ใหญ่'}</span>
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
                    className="px-3 py-1 bg-amber-900/50 text-amber-300 rounded-full text-sm"
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

                    <div className="grid md:grid-cols-2 gap-4">
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
            <p className="text-slate-500 text-sm mb-3">คลิกไพ่ด้านบนเพื่อดูรายละเอียดแต่ละตำแหน่ง</p>
          </div>

          {/* Save Status */}
          {(isSaving || isSaved) && (
            <div className="text-center mb-6">
              {isSaving ? (
                <span className="text-amber-400 text-sm animate-pulse">💾 กำลังบันทึก...</span>
              ) : isSaved ? (
                <span className="text-green-400 text-sm">✅ บันทึกแล้ว</span>
              ) : null}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={handleReset}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white font-medium rounded-xl transition-all duration-300"
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
