'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { TarotCard, CardFan } from '@/components/cards';
import { useTarotReading, useCards, useSaveReading, useAuth, useAnalytics } from '@/lib/hooks';
import { SUIT_NAMES } from '@/types/card';
import { generateDetailedPrediction } from '@/lib/tarot/cardMeanings';
import { PageLoader } from '@/components/ui/MysticalLoader';
import { PremiumGate } from '@/components/gates';
import { SPREAD_INFO } from '@/lib/access-control/spread-info';

// Monthly Forecast 4 Position Type
type MonthlyForecastPosition =
  | 'mf_overall_theme'
  | 'mf_challenges'
  | 'mf_opportunities'
  | 'mf_advice';

// Monthly Forecast 4 Position Labels
const MONTHLY_FORECAST_POSITIONS: MonthlyForecastPosition[] = [
  'mf_overall_theme',
  'mf_challenges',
  'mf_opportunities',
  'mf_advice',
];

const POSITION_LABELS: Record<
  MonthlyForecastPosition,
  {
    th: string;
    en: string;
    emoji: string;
    color: string;
    shortTh: string;
    description: string;
    guidance: string;
  }
> = {
  mf_overall_theme: {
    th: 'ธีมประจำเดือน',
    en: 'Overall Theme',
    emoji: '🌟',
    color: 'from-amber-500 to-yellow-600',
    shortTh: 'ธีม',
    description: 'พลังงานหลักที่จะส่งผลต่อเดือนนี้',
    guidance: 'บรรยากาศและพลังงานโดยรวมของเดือนนี้',
  },
  mf_challenges: {
    th: 'ความท้าทาย',
    en: 'Challenges',
    emoji: '⚔️',
    color: 'from-red-500 to-rose-600',
    shortTh: 'ท้าทาย',
    description: 'สิ่งที่ต้องระวังหรือเตรียมรับมือ',
    guidance: 'อุปสรรคที่อาจพบเจอและวิธีรับมือ',
  },
  mf_opportunities: {
    th: 'โอกาส',
    en: 'Opportunities',
    emoji: '✨',
    color: 'from-emerald-500 to-green-600',
    shortTh: 'โอกาส',
    description: 'โอกาสดีๆ ที่จะเข้ามาในเดือนนี้',
    guidance: 'สิ่งที่ควรคว้าไว้หรือเปิดรับ',
  },
  mf_advice: {
    th: 'คำแนะนำ',
    en: 'Advice',
    emoji: '💡',
    color: 'from-blue-500 to-indigo-600',
    shortTh: 'แนะนำ',
    description: 'คำแนะนำสำหรับการดำเนินชีวิตในเดือนนี้',
    guidance: 'แนวทางปฏิบัติเพื่อให้เดือนนี้ราบรื่น',
  },
};

// Sample questions for Monthly Forecast
const MONTHLY_FORECAST_QUESTIONS = [
  'เดือนนี้จะเป็นอย่างไรสำหรับฉัน?',
  'ฉันควรเตรียมตัวอย่างไรสำหรับเดือนนี้?',
  'มีอะไรที่ฉันควรรู้เกี่ยวกับเดือนนี้?',
  'เดือนนี้จะมีเรื่องดีๆ เข้ามาไหม?',
];

export default function MonthlyForecastReadingPage(): React.JSX.Element | null {
  const { user, isLoading: isLoadingAuth } = useAuth();
  const { trackReadingStarted, trackReadingCompleted } = useAnalytics();
  const [question, setQuestion] = useState('');
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
  const [nextCardToReveal, setNextCardToReveal] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
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
  const { readingState, drawnCards, revealedCards, startReading, revealCard, revealAllCards, resetReading } =
    useTarotReading(cards.length > 0 ? cards : undefined);

  // Save reading hook
  const { saveReading, isSaving } = useSaveReading();

  const allRevealed = revealedCards.every((r) => r);

  // Check VIP access via API
  useEffect(() => {
    async function checkAccess(): Promise<void> {
      try {
        const response = await fetch('/api/access-check?spread=monthly_forecast');
        const result = await response.json();
        setAccessCheck({
          checked: true,
          allowed: result.allowed,
          currentTier: result.currentTier,
          requiredTier: result.requiredTier,
        });
      } catch (error) {
        console.error('Access check error:', error);
        setAccessCheck({
          checked: true,
          allowed: false,
          currentTier: 'free',
          requiredTier: 'vip',
        });
      }
    }

    if (!isLoadingAuth) {
      checkAccess();
    }
  }, [user, isLoadingAuth]);

  // Start selection mode (show card fan)
  const handleStartSelection = (): void => {
    trackReadingStarted?.('monthly_forecast', !!question);
    setStartTime(Date.now());
    setIsSelecting(true);
    setSelectionStep(0);
    setSelectedFanIndices([]);
  };

  // Handle card selection from fan
  const handleSelectFromFan = (index: number): void => {
    if (selectedFanIndices.includes(index)) return;

    const newSelectedIndices = [...selectedFanIndices, index];
    setSelectedFanIndices(newSelectedIndices);

    if (newSelectedIndices.length < 4) {
      setSelectionStep(newSelectedIndices.length);
    } else {
      // All 4 cards selected, start reading after brief delay
      setTimeout(() => {
        startReading('monthly' as Parameters<typeof startReading>[0], question || undefined);
        setIsSelecting(false);
        setSelectedCardIndex(null);
        setNextCardToReveal(0);
        setIsSaved(false);
        hasSavedRef.current = false;
      }, 800);
    }
  };

  const handleRevealCard = (index: number): void => {
    if (index === nextCardToReveal && !revealedCards[index]) {
      revealCard(index);
      setNextCardToReveal(index + 1);
    }
  };

  const handleReset = (): void => {
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
    if (allRevealed && drawnCards.length === 4 && !hasSavedRef.current && user) {
      hasSavedRef.current = true;
      saveReading(
        'monthly_forecast' as Parameters<typeof saveReading>[0],
        drawnCards,
        question || undefined,
        MONTHLY_FORECAST_POSITIONS as Parameters<typeof saveReading>[3]
      ).then((result) => {
        if (result) {
          setIsSaved(true);
          const duration = startTime ? Math.round((Date.now() - startTime) / 1000) : 0;
          trackReadingCompleted?.('monthly_forecast', result.id, duration);
        }
      });
    }
  }, [allRevealed, drawnCards, question, saveReading, user, startTime, trackReadingCompleted]);

  // Get current month name in Thai
  const getCurrentMonthThai = (): string => {
    const months = [
      'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
      'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];
    return months[new Date().getMonth()];
  };

  // Loading states
  if (isLoadingAuth || !accessCheck.checked) {
    return <PageLoader message="กำลังตรวจสอบสิทธิ์..." />;
  }

  // VIP gate - show if user doesn't have access
  if (!accessCheck.allowed) {
    const spreadInfo = SPREAD_INFO.monthly_forecast;
    return (
      <PremiumGate
        spreadName="monthly-forecast"
        spreadNameTh={spreadInfo?.nameTh || 'พยากรณ์ประจำเดือน'}
        spreadIcon={spreadInfo?.icon || '📅'}
        requiredTier="vip"
        currentTier={accessCheck.currentTier}
      />
    );
  }

  // Loading cards from database
  if (isLoadingCards) {
    return <PageLoader message="กำลังโหลดไพ่..." />;
  }

  // Selection mode - Show CardFan for 4 card selection
  if (isSelecting) {
    const currentPosition = MONTHLY_FORECAST_POSITIONS[selectionStep];
    const posInfo = POSITION_LABELS[currentPosition];

    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-amber-950/20 to-slate-950 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header with current position */}
          <div className="text-center mb-4">
            <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-300 mb-2">
              เลือกไพ่ใบที่ {selectionStep + 1}/4
            </h2>
            <div
              className={`inline-block px-6 py-2 rounded-full bg-gradient-to-r ${posInfo.color} text-white font-medium text-lg mb-2`}
            >
              {posInfo.emoji} {posInfo.th}
            </div>
            <p className="text-slate-400 text-sm">{posInfo.description}</p>
          </div>

          {/* Question reminder */}
          {question && (
            <div className="text-center mb-4">
              <p className="text-amber-400 text-sm italic">&ldquo;{question}&rdquo;</p>
            </div>
          )}

          {/* Progress Indicator */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {MONTHLY_FORECAST_POSITIONS.map((pos, idx) => {
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
                  {idx < selectionStep ? <span className="text-green-400">✓</span> : <span>{info.emoji}</span>}
                  <span className={`${idx <= selectionStep ? 'text-white' : 'text-slate-500'}`}>{info.shortTh}</span>
                </div>
              );
            })}
          </div>

          {/* Card Fan */}
          <CardFan
            cardCount={22}
            onSelectCard={handleSelectFromFan}
            selectedIndex={selectedFanIndices[selectionStep] ?? null}
            disabled={selectedFanIndices.length === 4}
          />

          {/* Selected cards preview */}
          {selectedFanIndices.length > 0 && (
            <div className="mt-6">
              <p className="text-center text-slate-500 text-sm mb-3">ไพ่ที่เลือกแล้ว: {selectedFanIndices.length}/4</p>
              <div className="flex flex-wrap justify-center gap-2">
                {MONTHLY_FORECAST_POSITIONS.map((pos, idx) => (
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
            </div>
          )}

          {/* All selected message */}
          {selectedFanIndices.length === 4 && (
            <div className="text-center mt-6 animate-pulse">
              <span className="text-amber-400 text-lg font-medium">📅 กำลังเปิดพยากรณ์เดือน {getCurrentMonthThai()}...</span>
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
              disabled={selectedFanIndices.length === 4}
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
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-amber-950/20 to-slate-950 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/20">
              <span className="text-4xl">📅</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-300 mb-4">
              Monthly Forecast
            </h1>
            <p className="text-slate-400 text-lg">พยากรณ์ประจำเดือน • 4 ไพ่ • เดือน{getCurrentMonthThai()}</p>
            <div className="mt-4 inline-block px-4 py-1 bg-gradient-to-r from-amber-600 to-yellow-600 rounded-full text-white text-sm font-medium">
              👑 VIP Exclusive
            </div>
          </div>

          {/* Description */}
          <div className="bg-slate-800/50 border border-amber-500/30 rounded-2xl p-6 mb-8">
            <h2 className="text-lg font-semibold text-amber-300 mb-3">🌙 เกี่ยวกับการพยากรณ์ประจำเดือน</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              การพยากรณ์ประจำเดือนช่วยให้คุณเห็นภาพรวมของพลังงานและแนวโน้มที่จะส่งผลต่อชีวิตในเดือนนี้
              ไพ่ 4 ใบจะเปิดเผยธีมหลัก ความท้าทาย โอกาส และคำแนะนำสำหรับเดือน{getCurrentMonthThai()}
            </p>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2 text-slate-400">
                <span>⏱️</span> ~4 นาที
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <span>🎴</span> 4 ไพ่
              </div>
            </div>
          </div>

          {/* 4 Positions Preview */}
          <div className="bg-amber-900/20 border border-amber-500/30 rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-amber-300 mb-4 flex items-center">
              <span className="mr-2">🗺️</span>
              ตำแหน่งไพ่ทั้ง 4
            </h3>
            <div className="space-y-3">
              {MONTHLY_FORECAST_POSITIONS.map((pos) => {
                const info = POSITION_LABELS[pos];
                return (
                  <div key={pos} className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-xl">
                    <span className="text-xl">{info.emoji}</span>
                    <div className="flex-1">
                      <p className="text-slate-200 font-medium">{info.th}</p>
                      <p className="text-slate-400 text-sm">{info.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Question Input */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 mb-8">
            <label htmlFor="question" className="block text-amber-300 font-medium mb-3">
              คำถามสำหรับเดือนนี้ <span className="text-slate-500">(ไม่จำเป็น)</span>
            </label>
            <textarea
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="เช่น เดือนนี้จะเป็นอย่างไรสำหรับฉัน?"
              className="w-full bg-slate-900/50 border border-slate-600/50 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 resize-none"
              rows={3}
              maxLength={500}
            />
            <p className="text-right text-slate-500 text-sm mt-2">{question.length}/500</p>
          </div>

          {/* Sample Questions */}
          <div className="mb-8">
            <p className="text-slate-500 text-sm mb-3">💡 ตัวอย่างคำถาม:</p>
            <div className="flex flex-wrap gap-2">
              {MONTHLY_FORECAST_QUESTIONS.map((sample) => (
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
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white font-semibold rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all duration-300 hover:-translate-y-1"
            >
              <span className="text-xl mr-3">📅</span>
              เริ่มพยากรณ์เดือน{getCurrentMonthThai()}
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
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-amber-950/20 to-slate-950 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="flex justify-center gap-3 mb-8 flex-wrap max-w-md">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="w-14 h-20 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-lg animate-pulse shadow-lg"
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </div>
          <h2 className="text-2xl font-bold text-amber-300 mb-2">
            {readingState === 'shuffling' ? 'กำลังสับไพ่...' : 'กำลังจั่วไพ่ 4 ใบ...'}
          </h2>
          <p className="text-slate-400">เตรียมพร้อมรับพยากรณ์เดือน{getCurrentMonthThai()}</p>
        </div>
      </div>
    );
  }

  // Revealing state - Show cards to flip sequentially
  if (readingState === 'revealing' && !allRevealed) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-amber-950/20 to-slate-950 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-amber-300 mb-2">เปิดเผยพยากรณ์ของคุณ</h2>
          <p className="text-slate-400 mb-4">คลิกที่ไพ่ใบที่ {nextCardToReveal + 1} เพื่อเปิด</p>

          {/* Skip Animation Button */}
          <button
            onClick={revealAllCards}
            className="mb-8 px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-400 hover:text-slate-200 text-sm rounded-lg transition-colors border border-slate-600/50"
          >
            ⏩ ข้ามไปผลลัพธ์
          </button>

          {/* 4 Cards Layout */}
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 mb-8">
            {drawnCards.map((drawnCard, index) => {
              const pos = MONTHLY_FORECAST_POSITIONS[index];
              const posInfo = POSITION_LABELS[pos];
              const isRevealed = revealedCards[index];
              const canReveal = index === nextCardToReveal;

              return (
                <div key={index} className="flex flex-col items-center">
                  {/* Position Label */}
                  <div
                    className={`mb-3 px-4 py-1 rounded-full bg-gradient-to-r ${posInfo.color} text-white text-sm font-medium`}
                  >
                    {posInfo.emoji} {posInfo.shortTh}
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
                        ${canReveal ? 'cursor-pointer animate-pulse ring-2 ring-amber-400 ring-offset-2 ring-offset-slate-950' : ''}
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
            })}
          </div>

          {/* Progress */}
          <div className="text-slate-500 text-sm">เปิดแล้ว {revealedCards.filter((r) => r).length} / 4 ใบ</div>
        </div>
      </div>
    );
  }

  // Complete state - Show all revealed cards and interpretation
  if ((readingState === 'revealing' || readingState === 'complete') && allRevealed) {
    const selectedCard = selectedCardIndex !== null ? drawnCards[selectedCardIndex] : null;

    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-amber-950/20 to-slate-950 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Month Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-300 mb-2">
              พยากรณ์เดือน{getCurrentMonthThai()}
            </h1>
            {question && (
              <p className="text-amber-400 text-sm italic">&ldquo;{question}&rdquo;</p>
            )}
          </div>

          {/* All 4 Cards Grid */}
          <div className="grid grid-cols-4 gap-2 md:gap-4 mb-8">
            {drawnCards.map((drawnCard, index) => {
              const pos = MONTHLY_FORECAST_POSITIONS[index];
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
                    className={`mb-2 px-2 py-0.5 rounded-full bg-gradient-to-r ${posInfo.color} text-white text-[10px] md:text-xs font-medium text-center`}
                  >
                    {posInfo.emoji} {posInfo.shortTh}
                  </div>

                  {/* Card */}
                  <TarotCard
                    frontImage={drawnCard.card.imageUrl}
                    cardName={drawnCard.card.name}
                    size="sm"
                    isReversed={drawnCard.isReversed}
                    isFlipped={true}
                    showFlipAnimation={false}
                    className={isSelected ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-slate-950' : ''}
                  />

                  {/* Card name */}
                  <p className="mt-1 text-[10px] text-center text-slate-500 max-w-[80px] truncate">
                    {drawnCard.card.nameTh}
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
                  className={`inline-block px-4 py-1 rounded-full bg-gradient-to-r ${POSITION_LABELS[MONTHLY_FORECAST_POSITIONS[selectedCardIndex]].color} text-white text-sm font-medium mb-4`}
                >
                  {POSITION_LABELS[MONTHLY_FORECAST_POSITIONS[selectedCardIndex]].emoji}{' '}
                  {POSITION_LABELS[MONTHLY_FORECAST_POSITIONS[selectedCardIndex]].th}
                </div>

                <h2 className="text-2xl md:text-3xl font-bold font-card text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-300 mb-1">
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
                  <span key={i} className="px-3 py-1 bg-amber-900/50 text-amber-300 rounded-full text-sm">
                    {keyword}
                  </span>
                ))}
              </div>

              {/* Position Interpretation */}
              <div className="bg-amber-900/20 border border-amber-500/20 rounded-xl p-4 mb-4">
                <h3 className="text-base font-bold text-amber-300 mb-2">
                  📅 ในตำแหน่ง &quot;{POSITION_LABELS[MONTHLY_FORECAST_POSITIONS[selectedCardIndex]].th}&quot;
                </h3>
                <p className="text-slate-300 text-sm italic mb-2">
                  {POSITION_LABELS[MONTHLY_FORECAST_POSITIONS[selectedCardIndex]].guidance}
                </p>
                <p className="text-slate-200 leading-relaxed">
                  {getMonthlyInterpretation(
                    selectedCard.card.nameTh,
                    selectedCard.isReversed,
                    MONTHLY_FORECAST_POSITIONS[selectedCardIndex]
                  )}
                </p>
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
                    <div className="bg-purple-900/20 border border-purple-500/20 rounded-xl p-4">
                      <h3 className="text-base font-bold text-purple-300 mb-2">🔮 ความหมายเชิงลึก</h3>
                      <p className="text-slate-200 leading-relaxed text-sm">{detailedMeaning.prediction}</p>
                    </div>

                    <div className="bg-teal-900/20 border border-teal-500/20 rounded-xl p-4">
                      <h3 className="text-base font-bold text-teal-300 mb-2">💡 คำแนะนำ</h3>
                      <p className="text-slate-200 leading-relaxed text-sm">{detailedMeaning.advice}</p>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Monthly Summary */}
          <div className="bg-gradient-to-br from-slate-800/50 to-amber-900/30 border border-amber-500/30 rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-bold text-amber-300 mb-4 flex items-center gap-2">
              <span className="text-2xl">📅</span>
              สรุปพยากรณ์เดือน{getCurrentMonthThai()}
            </h2>
            <div className="space-y-4 text-slate-300 leading-relaxed">
              <p>
                <span className="font-semibold text-amber-300">🌟 ธีมประจำเดือน:</span>{' '}
                <span className="text-slate-200">{drawnCards[0]?.card.nameTh}</span>
                {drawnCards[0]?.isReversed && ' (กลับหัว)'} — พลังงานหลักที่จะส่งผลต่อเดือนนี้
              </p>
              <p>
                <span className="font-semibold text-red-300">⚔️ ความท้าทาย:</span>{' '}
                <span className="text-slate-200">{drawnCards[1]?.card.nameTh}</span>
                {drawnCards[1]?.isReversed && ' (กลับหัว)'} — สิ่งที่ต้องระวังหรือเตรียมรับมือ
              </p>
              <p>
                <span className="font-semibold text-emerald-300">✨ โอกาส:</span>{' '}
                <span className="text-slate-200">{drawnCards[2]?.card.nameTh}</span>
                {drawnCards[2]?.isReversed && ' (กลับหัว)'} — โอกาสดีๆ ที่จะเข้ามา
              </p>
              <p className="text-lg">
                <span className="font-semibold text-blue-300">💡 คำแนะนำ:</span>{' '}
                <span className="text-slate-200 font-bold">{drawnCards[3]?.card.nameTh}</span>
                {drawnCards[3]?.isReversed && ' (กลับหัว)'} — แนวทางปฏิบัติสำหรับเดือนนี้
              </p>
            </div>
          </div>

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
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white font-medium rounded-xl transition-all duration-300"
            >
              🔄 ทำใหม่อีกครั้ง
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

// Helper function: Generate monthly forecast interpretation
function getMonthlyInterpretation(
  cardName: string,
  isReversed: boolean,
  position: MonthlyForecastPosition
): string {
  const interpretations: Record<MonthlyForecastPosition, { upright: string; reversed: string }> = {
    mf_overall_theme: {
      upright: `ไพ่ ${cardName} ในตำแหน่ง "ธีมประจำเดือน" บ่งบอกว่าพลังงานนี้จะเป็นแรงขับเคลื่อนหลักของเดือน คุณอาจพบว่าตัวเองดึงดูดสถานการณ์ที่สะท้อนพลังงานนี้`,
      reversed: `ไพ่ ${cardName} กลับหัวในตำแหน่ง "ธีมประจำเดือน" เตือนให้ระวังพลังงานที่อาจถูกปิดกั้นหรือแสดงออกในทางที่ไม่สมดุล ลองมองหาวิธีปรับสมดุลพลังงานนี้`,
    },
    mf_challenges: {
      upright: `ไพ่ ${cardName} ในตำแหน่ง "ความท้าทาย" ชี้ให้เห็นสิ่งที่ต้องเผชิญในเดือนนี้ การเตรียมพร้อมและเข้าใจธรรมชาติของความท้าทายนี้จะช่วยให้คุณผ่านพ้นไปได้`,
      reversed: `ไพ่ ${cardName} กลับหัวในตำแหน่ง "ความท้าทาย" บ่งบอกว่าความท้าทายนี้อาจมาจากภายในมากกว่าภายนอก หรืออาจเป็นปัญหาเก่าที่ยังไม่ได้รับการแก้ไข`,
    },
    mf_opportunities: {
      upright: `ไพ่ ${cardName} ในตำแหน่ง "โอกาส" เปิดเผยโอกาสดีๆ ที่รอคอยคุณอยู่ จงเปิดใจรับและไม่ปล่อยให้หลุดมือไป`,
      reversed: `ไพ่ ${cardName} กลับหัวในตำแหน่ง "โอกาส" เตือนว่าโอกาสอาจมาในรูปแบบที่ไม่คาดคิด หรือคุณอาจต้องสร้างโอกาสด้วยตัวเอง`,
    },
    mf_advice: {
      upright: `ไพ่ ${cardName} ในตำแหน่ง "คำแนะนำ" ให้แนวทางปฏิบัติสำหรับเดือนนี้ การน้อมรับคำแนะนำนี้จะช่วยให้เดือนนี้ราบรื่น`,
      reversed: `ไพ่ ${cardName} กลับหัวในตำแหน่ง "คำแนะนำ" เตือนให้หลีกเลี่ยงพฤติกรรมหรือทัศนคติบางอย่าง ลองมองว่าอะไรที่ไม่ควรทำแทน`,
    },
  };

  return isReversed ? interpretations[position].reversed : interpretations[position].upright;
}
