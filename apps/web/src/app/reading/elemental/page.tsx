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

// Elemental Balance 4 Position Type
type ElementalBalancePosition =
  | 'eb_fire'
  | 'eb_water'
  | 'eb_air'
  | 'eb_earth';

// Elemental Balance 4 Position Labels
const ELEMENTAL_BALANCE_POSITIONS: ElementalBalancePosition[] = [
  'eb_fire',
  'eb_water',
  'eb_air',
  'eb_earth',
];

const POSITION_LABELS: Record<
  ElementalBalancePosition,
  {
    th: string;
    en: string;
    emoji: string;
    color: string;
    shortTh: string;
    description: string;
    characteristics: string;
    balanceTip: string;
    zodiacSigns: string;
    tarotSuit: string;
  }
> = {
  eb_fire: {
    th: 'ธาตุไฟ',
    en: 'Fire Element',
    emoji: '🔥',
    color: 'from-red-500 to-orange-600',
    shortTh: 'ไฟ',
    description: 'พลังงาน ความกระตือรือร้น ความคิดสร้างสรรค์ การลงมือทำ',
    characteristics: 'ความหลงใหล ความมั่นใจ ความกล้าหาญ แรงบันดาลใจ',
    balanceTip: 'หากไฟมากเกินไป: พักผ่อน ทำสมาธิ / หากไฟน้อยเกินไป: ออกกำลังกาย ทำกิจกรรมที่ท้าทาย',
    zodiacSigns: 'ราศีเมษ ราศีสิงห์ ราศีธนู',
    tarotSuit: 'ชุดไม้เท้า (Wands)',
  },
  eb_water: {
    th: 'ธาตุน้ำ',
    en: 'Water Element',
    emoji: '💧',
    color: 'from-blue-500 to-cyan-600',
    shortTh: 'น้ำ',
    description: 'อารมณ์ สัญชาตญาณ ความสัมพันธ์ ความลึกซึ้ง',
    characteristics: 'ความเห็นอกเห็นใจ การรับรู้ ความอ่อนโยน การไหลตาม',
    balanceTip: 'หากน้ำมากเกินไป: ตั้งขอบเขต ใช้เหตุผล / หากน้ำน้อยเกินไป: ใกล้ชิดคนที่รัก รับรู้อารมณ์',
    zodiacSigns: 'ราศีกรกฎ ราศีพิจิก ราศีมีน',
    tarotSuit: 'ชุดถ้วย (Cups)',
  },
  eb_air: {
    th: 'ธาตุลม',
    en: 'Air Element',
    emoji: '💨',
    color: 'from-sky-400 to-blue-500',
    shortTh: 'ลม',
    description: 'ความคิด การสื่อสาร ปัญญา ความชัดเจน',
    characteristics: 'ความเฉียบแหลม การวิเคราะห์ ความยืดหยุ่น ความเป็นกลาง',
    balanceTip: 'หากลมมากเกินไป: ลงมือทำ อยู่กับปัจจุบัน / หากลมน้อยเกินไป: อ่านหนังสือ สนทนา เรียนรู้สิ่งใหม่',
    zodiacSigns: 'ราศีเมถุน ราศีตุลย์ ราศีกุมภ์',
    tarotSuit: 'ชุดดาบ (Swords)',
  },
  eb_earth: {
    th: 'ธาตุดิน',
    en: 'Earth Element',
    emoji: '🌍',
    color: 'from-green-600 to-emerald-700',
    shortTh: 'ดิน',
    description: 'ความมั่นคง การเงิน สุขภาพ ความเป็นจริง',
    characteristics: 'ความอดทน ความน่าเชื่อถือ ความปฏิบัติจริง ความยั่งยืน',
    balanceTip: 'หากดินมากเกินไป: เปิดรับการเปลี่ยนแปลง ลองสิ่งใหม่ / หากดินน้อยเกินไป: สร้างกิจวัตร ดูแลร่างกาย',
    zodiacSigns: 'ราศีพฤษภ ราศีกันย์ ราศีมังกร',
    tarotSuit: 'ชุดเหรียญ (Pentacles)',
  },
};

// Sample questions for Elemental Balance
const ELEMENTAL_BALANCE_QUESTIONS = [
  'ธาตุในตัวฉันสมดุลหรือไม่?',
  'ฉันควรเสริมพลังธาตุใด?',
  'อะไรทำให้ธาตุในตัวฉันเสียสมดุล?',
  'ฉันจะสร้างสมดุลในชีวิตได้อย่างไร?',
];

export default function ElementalBalanceReadingPage(): React.JSX.Element | null {
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
        const response = await fetch('/api/access-check?spread=elemental_balance');
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
    trackReadingStarted?.('elemental_balance', !!question);
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
        startReading('elemental' as Parameters<typeof startReading>[0], question || undefined);
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
        'elemental_balance' as Parameters<typeof saveReading>[0],
        drawnCards,
        question || undefined,
        ELEMENTAL_BALANCE_POSITIONS as Parameters<typeof saveReading>[3]
      ).then((result) => {
        if (result) {
          setIsSaved(true);
          const duration = startTime ? Math.round((Date.now() - startTime) / 1000) : 0;
          trackReadingCompleted?.('elemental_balance', result.id, duration);
        }
      });
    }
  }, [allRevealed, drawnCards, question, saveReading, user, startTime, trackReadingCompleted]);

  // Loading states
  if (isLoadingAuth || !accessCheck.checked) {
    return <PageLoader message="กำลังตรวจสอบสิทธิ์..." />;
  }

  // VIP gate - show if user doesn't have access
  if (!accessCheck.allowed) {
    const spreadInfo = SPREAD_INFO.elemental_balance;
    return (
      <PremiumGate
        spreadName="elemental-balance"
        spreadNameTh={spreadInfo?.nameTh || 'ธาตุสมดุล'}
        spreadIcon={spreadInfo?.icon || '🔥'}
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
    const currentPosition = ELEMENTAL_BALANCE_POSITIONS[selectionStep];
    const posInfo = POSITION_LABELS[currentPosition];

    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-emerald-950/20 to-slate-950 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header with current position */}
          <div className="text-center mb-4">
            <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-300 mb-2">
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
              <p className="text-emerald-400 text-sm italic">&ldquo;{question}&rdquo;</p>
            </div>
          )}

          {/* Progress Indicator - Elements */}
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {ELEMENTAL_BALANCE_POSITIONS.map((pos, idx) => {
              const info = POSITION_LABELS[pos];
              return (
                <div
                  key={pos}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                    idx < selectionStep
                      ? 'bg-green-600/30 border border-green-500/50'
                      : idx === selectionStep
                        ? `bg-gradient-to-r ${info.color} shadow-lg scale-110`
                        : 'bg-slate-800/50 border border-slate-700/50'
                  }`}
                >
                  {idx < selectionStep ? <span className="text-green-400">✓</span> : <span className="text-xl">{info.emoji}</span>}
                  <span className={`font-medium ${idx <= selectionStep ? 'text-white' : 'text-slate-500'}`}>{info.shortTh}</span>
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
              <div className="flex flex-wrap justify-center gap-3">
                {ELEMENTAL_BALANCE_POSITIONS.map((pos, idx) => (
                  <div
                    key={pos}
                    className={`w-12 h-16 md:w-14 md:h-20 rounded-lg flex items-center justify-center transition-all duration-300 ${
                      idx < selectedFanIndices.length
                        ? `bg-gradient-to-br ${POSITION_LABELS[pos].color} shadow-lg`
                        : 'bg-slate-800/50 border-2 border-dashed border-slate-600'
                    }`}
                  >
                    {idx < selectedFanIndices.length ? (
                      <span className="text-white text-lg">✓</span>
                    ) : (
                      <span className="text-2xl">{POSITION_LABELS[pos].emoji}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All selected message */}
          {selectedFanIndices.length === 4 && (
            <div className="text-center mt-6 animate-pulse">
              <span className="text-emerald-400 text-lg font-medium">⚖️ กำลังอ่านสมดุลธาตุ...</span>
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
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-emerald-950/20 to-slate-950 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <span className="text-4xl">⚖️</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-300 mb-4">
              Elemental Balance
            </h1>
            <p className="text-slate-400 text-lg">ธาตุสมดุล • 4 ไพ่ • ไฟ น้ำ ลม ดิน</p>
            <div className="mt-4 inline-block px-4 py-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full text-white text-sm font-medium">
              👑 VIP Exclusive
            </div>
          </div>

          {/* 4 Elements Display */}
          <div className="flex justify-center gap-4 mb-8">
            {ELEMENTAL_BALANCE_POSITIONS.map((pos) => {
              const info = POSITION_LABELS[pos];
              return (
                <div
                  key={pos}
                  className={`w-16 h-16 rounded-full bg-gradient-to-br ${info.color} flex items-center justify-center shadow-lg`}
                >
                  <span className="text-2xl">{info.emoji}</span>
                </div>
              );
            })}
          </div>

          {/* Description */}
          <div className="bg-slate-800/50 border border-emerald-500/30 rounded-2xl p-6 mb-8">
            <h2 className="text-lg font-semibold text-emerald-300 mb-3">⚖️ เกี่ยวกับธาตุสมดุล</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              ธาตุทั้งสี่ (ไฟ น้ำ ลม ดิน) เป็นพลังงานพื้นฐานที่ส่งผลต่อบุคลิกภาพ อารมณ์ และการดำเนินชีวิต
              การอ่านไพ่ธาตุสมดุลจะเปิดเผยสถานะของแต่ละธาตุในตัวคุณ และแนะนำวิธีสร้างสมดุล
            </p>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2 text-slate-400">
                <span>⏱️</span> ~5 นาที
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <span>🎴</span> 4 ไพ่
              </div>
            </div>
          </div>

          {/* 4 Elements Detail */}
          <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-emerald-300 mb-4 flex items-center">
              <span className="mr-2">🌍</span>
              ธาตุทั้งสี่
            </h3>
            <div className="space-y-4">
              {ELEMENTAL_BALANCE_POSITIONS.map((pos) => {
                const info = POSITION_LABELS[pos];
                return (
                  <div key={pos} className={`p-4 bg-gradient-to-r ${info.color}/10 border border-${info.color.split(' ')[0].replace('from-', '')}/30 rounded-xl`}>
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{info.emoji}</span>
                      <div className="flex-1">
                        <p className="text-slate-200 font-medium">{info.th} ({info.en})</p>
                        <p className="text-slate-400 text-sm mt-1">{info.characteristics}</p>
                        <p className="text-slate-500 text-xs mt-1">🎴 {info.tarotSuit} | ♈ {info.zodiacSigns}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Question Input */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 mb-8">
            <label htmlFor="question" className="block text-emerald-300 font-medium mb-3">
              คำถามเกี่ยวกับสมดุลธาตุ <span className="text-slate-500">(ไม่จำเป็น)</span>
            </label>
            <textarea
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="เช่น ธาตุในตัวฉันสมดุลหรือไม่?"
              className="w-full bg-slate-900/50 border border-slate-600/50 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 resize-none"
              rows={3}
              maxLength={500}
            />
            <p className="text-right text-slate-500 text-sm mt-2">{question.length}/500</p>
          </div>

          {/* Sample Questions */}
          <div className="mb-8">
            <p className="text-slate-500 text-sm mb-3">💡 ตัวอย่างคำถาม:</p>
            <div className="flex flex-wrap gap-2">
              {ELEMENTAL_BALANCE_QUESTIONS.map((sample) => (
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
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all duration-300 hover:-translate-y-1"
            >
              <span className="text-xl mr-3">⚖️</span>
              เริ่มอ่านสมดุลธาตุ
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
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-emerald-950/20 to-slate-950 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="flex justify-center gap-4 mb-8">
            {ELEMENTAL_BALANCE_POSITIONS.map((pos, i) => {
              const info = POSITION_LABELS[pos];
              return (
                <div
                  key={pos}
                  className={`w-14 h-20 bg-gradient-to-br ${info.color} rounded-lg animate-pulse shadow-lg flex items-center justify-center`}
                  style={{ animationDelay: `${i * 150}ms` }}
                >
                  <span className="text-2xl">{info.emoji}</span>
                </div>
              );
            })}
          </div>
          <h2 className="text-2xl font-bold text-emerald-300 mb-2">
            {readingState === 'shuffling' ? 'กำลังสับไพ่...' : 'กำลังจั่วไพ่ 4 ใบ...'}
          </h2>
          <p className="text-slate-400">เตรียมพร้อมค้นพบสมดุลธาตุในตัวคุณ</p>
        </div>
      </div>
    );
  }

  // Revealing state - Show cards to flip sequentially
  if (readingState === 'revealing' && !allRevealed) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-emerald-950/20 to-slate-950 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-emerald-300 mb-2">เปิดเผยสมดุลธาตุ</h2>
          <p className="text-slate-400 mb-4">คลิกที่ไพ่ใบที่ {nextCardToReveal + 1} เพื่อเปิด</p>

          {/* Skip Animation Button */}
          <button
            onClick={revealAllCards}
            className="mb-8 px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-400 hover:text-slate-200 text-sm rounded-lg transition-colors border border-slate-600/50"
          >
            ⏩ ข้ามไปผลลัพธ์
          </button>

          {/* 4 Elements Cards Layout */}
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 mb-8">
            {drawnCards.map((drawnCard, index) => {
              const pos = ELEMENTAL_BALANCE_POSITIONS[index];
              const posInfo = POSITION_LABELS[pos];
              const isRevealed = revealedCards[index];
              const canReveal = index === nextCardToReveal;

              return (
                <div key={index} className="flex flex-col items-center">
                  {/* Element Label */}
                  <div
                    className={`mb-3 px-4 py-2 rounded-full bg-gradient-to-r ${posInfo.color} text-white font-medium flex items-center gap-2`}
                  >
                    <span className="text-xl">{posInfo.emoji}</span>
                    <span>{posInfo.shortTh}</span>
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
                        ${canReveal ? 'cursor-pointer animate-pulse ring-2 ring-emerald-400 ring-offset-2 ring-offset-slate-950' : ''}
                        ${!canReveal && !isRevealed ? 'opacity-50' : ''}
                      `}
                    />
                    {canReveal && !isRevealed && (
                      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-emerald-400 text-xs animate-bounce whitespace-nowrap">
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
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-emerald-950/20 to-slate-950 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Question display */}
          {question && (
            <div className="text-center mb-6">
              <p className="text-slate-500 text-sm mb-1">คำถามของคุณ:</p>
              <p className="text-emerald-300 text-lg italic">&ldquo;{question}&rdquo;</p>
            </div>
          )}

          {/* All 4 Elements Cards Grid */}
          <div className="grid grid-cols-4 gap-2 md:gap-4 mb-8">
            {drawnCards.map((drawnCard, index) => {
              const pos = ELEMENTAL_BALANCE_POSITIONS[index];
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
                  {/* Element Icon */}
                  <div
                    className={`mb-2 w-10 h-10 rounded-full bg-gradient-to-r ${posInfo.color} flex items-center justify-center`}
                  >
                    <span className="text-lg">{posInfo.emoji}</span>
                  </div>

                  {/* Card */}
                  <TarotCard
                    frontImage={drawnCard.card.imageUrl}
                    cardName={drawnCard.card.name}
                    size="sm"
                    isReversed={drawnCard.isReversed}
                    isFlipped={true}
                    showFlipAnimation={false}
                    className={isSelected ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-slate-950' : ''}
                  />

                  {/* Element name */}
                  <p className="mt-1 text-xs text-center text-slate-400">{posInfo.shortTh}</p>
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
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${POSITION_LABELS[ELEMENTAL_BALANCE_POSITIONS[selectedCardIndex]].color} text-white font-medium mb-4`}
                >
                  <span className="text-xl">{POSITION_LABELS[ELEMENTAL_BALANCE_POSITIONS[selectedCardIndex]].emoji}</span>
                  {POSITION_LABELS[ELEMENTAL_BALANCE_POSITIONS[selectedCardIndex]].th}
                </div>

                <h2 className="text-2xl md:text-3xl font-bold font-card text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-300 mb-1">
                  {selectedCard.card.nameTh}
                </h2>
                <p className="text-emerald-400 font-card">{selectedCard.card.name}</p>
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
                  <span key={i} className="px-3 py-1 bg-emerald-900/50 text-emerald-300 rounded-full text-sm">
                    {keyword}
                  </span>
                ))}
              </div>

              {/* Element Info */}
              <div className="bg-emerald-900/20 border border-emerald-500/20 rounded-xl p-4 mb-4">
                <h3 className="text-base font-bold text-emerald-300 mb-2">
                  {POSITION_LABELS[ELEMENTAL_BALANCE_POSITIONS[selectedCardIndex]].emoji} สถานะ{POSITION_LABELS[ELEMENTAL_BALANCE_POSITIONS[selectedCardIndex]].th}ในตัวคุณ
                </h3>
                <p className="text-slate-300 text-sm italic mb-2">
                  {POSITION_LABELS[ELEMENTAL_BALANCE_POSITIONS[selectedCardIndex]].description}
                </p>
                <p className="text-slate-200 leading-relaxed">
                  {getElementalInterpretation(
                    selectedCard.card.nameTh,
                    selectedCard.isReversed,
                    ELEMENTAL_BALANCE_POSITIONS[selectedCardIndex]
                  )}
                </p>
              </div>

              {/* Balance Tip */}
              <div className="bg-amber-900/20 border border-amber-500/20 rounded-xl p-4 mb-4">
                <h3 className="text-base font-bold text-amber-300 mb-2">⚖️ คำแนะนำเพื่อสมดุล</h3>
                <p className="text-slate-200 leading-relaxed text-sm">
                  {POSITION_LABELS[ELEMENTAL_BALANCE_POSITIONS[selectedCardIndex]].balanceTip}
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

          {/* Elemental Balance Summary */}
          <div className="bg-gradient-to-br from-slate-800/50 to-emerald-900/30 border border-emerald-500/30 rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-bold text-emerald-300 mb-4 flex items-center gap-2">
              <span className="text-2xl">⚖️</span>
              สรุปสมดุลธาตุในตัวคุณ
            </h2>
            <div className="grid grid-cols-2 gap-4 text-slate-300 leading-relaxed">
              {ELEMENTAL_BALANCE_POSITIONS.map((pos, idx) => {
                const info = POSITION_LABELS[pos];
                const card = drawnCards[idx];
                return (
                  <div key={pos} className={`p-3 bg-gradient-to-r ${info.color}/10 rounded-xl`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{info.emoji}</span>
                      <span className="font-semibold text-slate-200">{info.th}</span>
                    </div>
                    <p className="text-slate-300 text-sm">
                      {card?.card.nameTh}
                      {card?.isReversed && ' (กลับหัว)'}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="text-center mb-8">
            <p className="text-slate-500 text-sm mb-3">คลิกไพ่ด้านบนเพื่อดูรายละเอียดแต่ละธาตุ</p>
          </div>

          {/* Save Status */}
          {(isSaving || isSaved) && (
            <div className="text-center mb-6">
              {isSaving ? (
                <span className="text-emerald-400 text-sm animate-pulse">💾 กำลังบันทึก...</span>
              ) : isSaved ? (
                <span className="text-green-400 text-sm">✅ บันทึกแล้ว</span>
              ) : null}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={handleReset}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium rounded-xl transition-all duration-300"
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

// Helper function: Generate elemental balance interpretation
function getElementalInterpretation(
  cardName: string,
  isReversed: boolean,
  position: ElementalBalancePosition
): string {
  const interpretations: Record<ElementalBalancePosition, { upright: string; reversed: string }> = {
    eb_fire: {
      upright: `ไพ่ ${cardName} ในตำแหน่ง "ธาตุไฟ" บ่งบอกว่าพลังงานไฟในตัวคุณอยู่ในสถานะที่ดี คุณมีความกระตือรือร้น แรงบันดาลใจ และความกล้าหาญในการลงมือทำ`,
      reversed: `ไพ่ ${cardName} กลับหัวในตำแหน่ง "ธาตุไฟ" บ่งบอกว่าพลังงานไฟอาจไม่สมดุล อาจรู้สึกหมดไฟ ขาดแรงจูงใจ หรือในทางกลับกันอาจร้อนแรงเกินไปจนเผาตัวเอง`,
    },
    eb_water: {
      upright: `ไพ่ ${cardName} ในตำแหน่ง "ธาตุน้ำ" บ่งบอกว่าคุณเชื่อมต่อกับอารมณ์และสัญชาตญาณได้ดี ความสัมพันธ์และความเห็นอกเห็นใจเป็นจุดแข็งของคุณ`,
      reversed: `ไพ่ ${cardName} กลับหัวในตำแหน่ง "ธาตุน้ำ" บ่งบอกว่าอารมณ์อาจถูกกดทับหรือท่วมท้นเกินไป คุณอาจต้องการสร้างขอบเขตทางอารมณ์หรือเปิดใจมากขึ้น`,
    },
    eb_air: {
      upright: `ไพ่ ${cardName} ในตำแหน่ง "ธาตุลม" บ่งบอกว่าความคิดและการสื่อสารของคุณชัดเจน คุณมีความสามารถในการวิเคราะห์และมองเห็นภาพรวม`,
      reversed: `ไพ่ ${cardName} กลับหัวในตำแหน่ง "ธาตุลม" บ่งบอกว่าความคิดอาจสับสนหรือคิดมากเกินไป คุณอาจต้องลงมือทำแทนที่จะคิดอย่างเดียว หรือต้องการความชัดเจนมากขึ้น`,
    },
    eb_earth: {
      upright: `ไพ่ ${cardName} ในตำแหน่ง "ธาตุดิน" บ่งบอกว่าคุณมีพื้นฐานที่มั่นคง ความเป็นจริง สุขภาพ และการเงินอยู่ในสถานะที่ดี`,
      reversed: `ไพ่ ${cardName} กลับหัวในตำแหน่ง "ธาตุดิน" บ่งบอกว่าอาจรู้สึกไม่มั่นคงหรือติดอยู่กับที่เกินไป คุณอาจต้องสร้างรากฐานใหม่หรือเปิดรับการเปลี่ยนแปลง`,
    },
  };

  return isReversed ? interpretations[position].reversed : interpretations[position].upright;
}
