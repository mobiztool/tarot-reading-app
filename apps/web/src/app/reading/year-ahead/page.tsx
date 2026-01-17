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

// Year Ahead 13 Position Type
type YearAheadPosition =
  | 'ya_year_overview'
  | 'ya_january'
  | 'ya_february'
  | 'ya_march'
  | 'ya_april'
  | 'ya_may'
  | 'ya_june'
  | 'ya_july'
  | 'ya_august'
  | 'ya_september'
  | 'ya_october'
  | 'ya_november'
  | 'ya_december';

// Year Ahead 13 Position Labels
const YEAR_AHEAD_POSITIONS: YearAheadPosition[] = [
  'ya_year_overview',
  'ya_january',
  'ya_february',
  'ya_march',
  'ya_april',
  'ya_may',
  'ya_june',
  'ya_july',
  'ya_august',
  'ya_september',
  'ya_october',
  'ya_november',
  'ya_december',
];

const MONTH_NAMES_TH = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];

const MONTH_NAMES_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const POSITION_LABELS: Record<
  YearAheadPosition,
  {
    th: string;
    en: string;
    emoji: string;
    color: string;
    shortTh: string;
    description: string;
  }
> = {
  ya_year_overview: {
    th: 'ภาพรวมทั้งปี',
    en: 'Year Overview',
    emoji: '🌟',
    color: 'from-amber-500 to-yellow-600',
    shortTh: 'ปีนี้',
    description: 'พลังงานหลักและธีมของปีนี้',
  },
  ya_january: {
    th: 'มกราคม',
    en: 'January',
    emoji: '❄️',
    color: 'from-blue-400 to-cyan-500',
    shortTh: 'ม.ค.',
    description: 'เริ่มต้นปีใหม่ การตั้งเป้าหมาย',
  },
  ya_february: {
    th: 'กุมภาพันธ์',
    en: 'February',
    emoji: '💕',
    color: 'from-pink-400 to-rose-500',
    shortTh: 'ก.พ.',
    description: 'เดือนแห่งความรัก',
  },
  ya_march: {
    th: 'มีนาคม',
    en: 'March',
    emoji: '🌸',
    color: 'from-pink-300 to-fuchsia-400',
    shortTh: 'มี.ค.',
    description: 'การเปลี่ยนผ่าน ฤดูใบไม้ผลิ',
  },
  ya_april: {
    th: 'เมษายน',
    en: 'April',
    emoji: '🌊',
    color: 'from-cyan-400 to-blue-500',
    shortTh: 'เม.ย.',
    description: 'ปีใหม่ไทย การชำระล้าง',
  },
  ya_may: {
    th: 'พฤษภาคม',
    en: 'May',
    emoji: '🌺',
    color: 'from-green-400 to-emerald-500',
    shortTh: 'พ.ค.',
    description: 'การเติบโต ความอุดมสมบูรณ์',
  },
  ya_june: {
    th: 'มิถุนายน',
    en: 'June',
    emoji: '☀️',
    color: 'from-yellow-400 to-orange-500',
    shortTh: 'มิ.ย.',
    description: 'กลางปี การทบทวน',
  },
  ya_july: {
    th: 'กรกฎาคม',
    en: 'July',
    emoji: '🔥',
    color: 'from-orange-400 to-red-500',
    shortTh: 'ก.ค.',
    description: 'พลังงานสูง การลงมือทำ',
  },
  ya_august: {
    th: 'สิงหาคม',
    en: 'August',
    emoji: '👑',
    color: 'from-amber-400 to-yellow-500',
    shortTh: 'ส.ค.',
    description: 'ความสำเร็จ การยอมรับ',
  },
  ya_september: {
    th: 'กันยายน',
    en: 'September',
    emoji: '🍂',
    color: 'from-orange-300 to-amber-400',
    shortTh: 'ก.ย.',
    description: 'การเก็บเกี่ยว สมดุล',
  },
  ya_october: {
    th: 'ตุลาคม',
    en: 'October',
    emoji: '🎃',
    color: 'from-orange-500 to-red-600',
    shortTh: 'ต.ค.',
    description: 'การเปลี่ยนแปลง การปล่อยวาง',
  },
  ya_november: {
    th: 'พฤศจิกายน',
    en: 'November',
    emoji: '🍁',
    color: 'from-red-400 to-orange-500',
    shortTh: 'พ.ย.',
    description: 'การเตรียมตัว ความสำนึก',
  },
  ya_december: {
    th: 'ธันวาคม',
    en: 'December',
    emoji: '🎄',
    color: 'from-green-500 to-emerald-600',
    shortTh: 'ธ.ค.',
    description: 'สรุปปี การเฉลิมฉลอง',
  },
};

// Sample questions for Year Ahead
const YEAR_AHEAD_QUESTIONS = [
  'ปีนี้จะเป็นอย่างไรสำหรับฉัน?',
  'ฉันควรโฟกัสที่อะไรในปีนี้?',
  'มีบทเรียนอะไรรอฉันอยู่ในปีนี้?',
  'ฉันจะเติบโตอย่างไรในปีนี้?',
];

export default function YearAheadReadingPage(): React.JSX.Element | null {
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

  // Get current year
  const currentYear = new Date().getFullYear();

  // Check VIP access via API
  useEffect(() => {
    async function checkAccess(): Promise<void> {
      try {
        const response = await fetch('/api/access-check?spread=year_ahead');
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
    trackReadingStarted?.('year_ahead', !!question);
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

    if (newSelectedIndices.length < 13) {
      setSelectionStep(newSelectedIndices.length);
    } else {
      // All 13 cards selected, start reading after brief delay
      setTimeout(() => {
        startReading('year-ahead' as Parameters<typeof startReading>[0], question || undefined);
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
    if (allRevealed && drawnCards.length === 13 && !hasSavedRef.current && user) {
      hasSavedRef.current = true;
      saveReading(
        'year_ahead' as Parameters<typeof saveReading>[0],
        drawnCards,
        question || undefined,
        YEAR_AHEAD_POSITIONS as Parameters<typeof saveReading>[3]
      ).then((result) => {
        if (result) {
          setIsSaved(true);
          const duration = startTime ? Math.round((Date.now() - startTime) / 1000) : 0;
          trackReadingCompleted?.('year_ahead', result.id, duration);
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
    const spreadInfo = SPREAD_INFO.year_ahead;
    return (
      <PremiumGate
        spreadName="year-ahead"
        spreadNameTh={spreadInfo?.nameTh || 'พยากรณ์ทั้งปี'}
        spreadIcon={spreadInfo?.icon || '📆'}
        requiredTier="vip"
        currentTier={accessCheck.currentTier}
      />
    );
  }

  // Loading cards from database
  if (isLoadingCards) {
    return <PageLoader message="กำลังโหลดไพ่..." />;
  }

  // Selection mode - Show CardFan for 13 card selection
  if (isSelecting) {
    const currentPosition = YEAR_AHEAD_POSITIONS[selectionStep];
    const posInfo = POSITION_LABELS[currentPosition];

    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950/30 to-slate-950 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header with current position */}
          <div className="text-center mb-4">
            <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300 mb-2">
              เลือกไพ่ใบที่ {selectionStep + 1}/13
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
              <p className="text-indigo-400 text-sm italic">&ldquo;{question}&rdquo;</p>
            </div>
          )}

          {/* Progress Indicator - Compact for 13 positions */}
          <div className="flex flex-wrap justify-center gap-1 mb-6">
            {YEAR_AHEAD_POSITIONS.map((pos, idx) => {
              const info = POSITION_LABELS[pos];
              const isOverview = idx === 0;
              return (
                <div
                  key={pos}
                  className={`flex items-center gap-0.5 px-2 py-1 rounded-full transition-all duration-300 text-[10px] ${
                    idx < selectionStep
                      ? 'bg-green-600/30 border border-green-500/50'
                      : idx === selectionStep
                        ? `bg-gradient-to-r ${info.color} shadow-lg`
                        : 'bg-slate-800/50 border border-slate-700/50'
                  }`}
                >
                  {idx < selectionStep ? <span className="text-green-400">✓</span> : <span>{info.emoji}</span>}
                  <span className={`${idx <= selectionStep ? 'text-white' : 'text-slate-500'}`}>
                    {isOverview ? '🌟' : info.shortTh}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Card Fan */}
          <CardFan
            cardCount={22}
            onSelectCard={handleSelectFromFan}
            selectedIndex={selectedFanIndices[selectionStep] ?? null}
            disabled={selectedFanIndices.length === 13}
          />

          {/* Selected cards preview */}
          {selectedFanIndices.length > 0 && (
            <div className="mt-6">
              <p className="text-center text-slate-500 text-sm mb-3">ไพ่ที่เลือกแล้ว: {selectedFanIndices.length}/13</p>
              <div className="flex flex-wrap justify-center gap-1">
                {YEAR_AHEAD_POSITIONS.map((pos, idx) => (
                  <div
                    key={pos}
                    className={`w-8 h-10 md:w-9 md:h-12 rounded flex items-center justify-center transition-all duration-300 ${
                      idx < selectedFanIndices.length
                        ? `bg-gradient-to-br ${POSITION_LABELS[pos].color} shadow-lg`
                        : 'bg-slate-800/50 border border-dashed border-slate-600'
                    }`}
                  >
                    {idx < selectedFanIndices.length ? (
                      <span className="text-white text-[10px]">✓</span>
                    ) : (
                      <span className="text-slate-600 text-[10px]">{idx === 0 ? '🌟' : POSITION_LABELS[pos].shortTh}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All selected message */}
          {selectedFanIndices.length === 13 && (
            <div className="text-center mt-6 animate-pulse">
              <span className="text-indigo-400 text-lg font-medium">📆 กำลังเปิดพยากรณ์ปี {currentYear}...</span>
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
              disabled={selectedFanIndices.length === 13}
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
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950/30 to-slate-950 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="text-4xl">📆</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300 mb-4">
              Year Ahead
            </h1>
            <p className="text-slate-400 text-lg">พยากรณ์ทั้งปี • 13 ไพ่ • ปี {currentYear}</p>
            <div className="mt-4 inline-block px-4 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full text-white text-sm font-medium">
              👑 VIP Exclusive • Most Complex Spread
            </div>
          </div>

          {/* Important Notice */}
          <div className="bg-indigo-900/30 border border-indigo-500/40 rounded-2xl p-6 mb-8">
            <h2 className="text-lg font-semibold text-indigo-300 mb-3 flex items-center gap-2">
              <span>✨</span>
              การพยากรณ์ที่ครอบคลุมที่สุด
            </h2>
            <p className="text-slate-300 leading-relaxed text-sm">
              Year Ahead เป็นการอ่านไพ่ที่ครอบคลุมที่สุดในแอป ประกอบด้วย 13 ไพ่ 
              — 1 ไพ่สำหรับภาพรวมทั้งปี และ 12 ไพ่สำหรับแต่ละเดือน 
              ช่วยให้คุณวางแผนและเตรียมพร้อมสำหรับปีข้างหน้าได้อย่างรอบด้าน
            </p>
          </div>

          {/* Description */}
          <div className="bg-slate-800/50 border border-indigo-500/30 rounded-2xl p-6 mb-8">
            <h2 className="text-lg font-semibold text-indigo-300 mb-3">📆 เกี่ยวกับการพยากรณ์ทั้งปี</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              การพยากรณ์ทั้งปีจะเปิดเผยพลังงานและแนวโน้มของแต่ละเดือนในปี {currentYear} 
              คุณจะได้เห็นภาพรวมของปี ความท้าทาย และโอกาสที่รอคอยอยู่ในแต่ละช่วงเวลา
            </p>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2 text-slate-400">
                <span>⏱️</span> ~15 นาที
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <span>🎴</span> 13 ไพ่
              </div>
            </div>
          </div>

          {/* 13 Positions Preview */}
          <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-indigo-300 mb-4 flex items-center">
              <span className="mr-2">🗓️</span>
              ตำแหน่งไพ่ทั้ง 13
            </h3>
            
            {/* Year Overview */}
            <div className="mb-4 p-3 bg-gradient-to-r from-amber-500/20 to-yellow-600/20 border border-amber-500/30 rounded-xl">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🌟</span>
                <div>
                  <p className="text-amber-200 font-medium">ภาพรวมทั้งปี</p>
                  <p className="text-slate-400 text-sm">ธีมหลักและพลังงานของปี {currentYear}</p>
                </div>
              </div>
            </div>

            {/* Months Grid */}
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
              {YEAR_AHEAD_POSITIONS.slice(1).map((pos) => {
                const info = POSITION_LABELS[pos];
                return (
                  <div key={pos} className="flex items-center gap-2 p-2 bg-slate-800/50 rounded-lg">
                    <span className="text-lg">{info.emoji}</span>
                    <div>
                      <p className="text-slate-200 text-sm font-medium">{info.th}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Question Input */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 mb-8">
            <label htmlFor="question" className="block text-indigo-300 font-medium mb-3">
              คำถามสำหรับปีนี้ <span className="text-slate-500">(ไม่จำเป็น)</span>
            </label>
            <textarea
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="เช่น ปีนี้จะเป็นอย่างไรสำหรับฉัน?"
              className="w-full bg-slate-900/50 border border-slate-600/50 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 resize-none"
              rows={3}
              maxLength={500}
            />
            <p className="text-right text-slate-500 text-sm mt-2">{question.length}/500</p>
          </div>

          {/* Sample Questions */}
          <div className="mb-8">
            <p className="text-slate-500 text-sm mb-3">💡 ตัวอย่างคำถาม:</p>
            <div className="flex flex-wrap gap-2">
              {YEAR_AHEAD_QUESTIONS.map((sample) => (
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
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all duration-300 hover:-translate-y-1"
            >
              <span className="text-xl mr-3">📆</span>
              เริ่มพยากรณ์ปี {currentYear}
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
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950/30 to-slate-950 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="flex justify-center gap-2 mb-8 flex-wrap max-w-lg">
            {[...Array(13)].map((_, i) => (
              <div
                key={i}
                className="w-10 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg animate-pulse shadow-lg"
                style={{ animationDelay: `${i * 100}ms` }}
              />
            ))}
          </div>
          <h2 className="text-2xl font-bold text-indigo-300 mb-2">
            {readingState === 'shuffling' ? 'กำลังสับไพ่...' : 'กำลังจั่วไพ่ 13 ใบ...'}
          </h2>
          <p className="text-slate-400">เตรียมพร้อมรับพยากรณ์ปี {currentYear}</p>
        </div>
      </div>
    );
  }

  // Revealing state - Show cards to flip sequentially
  if (readingState === 'revealing' && !allRevealed) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950/30 to-slate-950 py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-indigo-300 mb-2">เปิดเผยพยากรณ์ปี {currentYear}</h2>
          <p className="text-slate-400 mb-4">คลิกที่ไพ่ใบที่ {nextCardToReveal + 1} เพื่อเปิด</p>

          {/* Skip Animation Button */}
          <button
            onClick={revealAllCards}
            className="mb-8 px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-400 hover:text-slate-200 text-sm rounded-lg transition-colors border border-slate-600/50"
          >
            ⏩ ข้ามไปผลลัพธ์
          </button>

          {/* Year Overview Card */}
          {drawnCards.length > 0 && (
            <div className="mb-6">
              <div className="text-center mb-3">
                <span className="px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-600 text-white text-sm font-medium">
                  🌟 ภาพรวมทั้งปี
                </span>
              </div>
              <div className="flex justify-center">
                <div className="relative">
                  <TarotCard
                    frontImage={drawnCards[0].card.imageUrl}
                    cardName={drawnCards[0].card.name}
                    size="md"
                    isReversed={drawnCards[0].isReversed}
                    isFlipped={revealedCards[0]}
                    onClick={nextCardToReveal === 0 ? () => handleRevealCard(0) : undefined}
                    className={`
                      ${nextCardToReveal === 0 ? 'cursor-pointer animate-pulse ring-2 ring-amber-400 ring-offset-2 ring-offset-slate-950' : ''}
                      ${nextCardToReveal !== 0 && !revealedCards[0] ? 'opacity-50' : ''}
                    `}
                  />
                  {nextCardToReveal === 0 && !revealedCards[0] && (
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-amber-400 text-xs animate-bounce whitespace-nowrap">
                      👆 แตะเพื่อเปิด
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Monthly Cards Grid */}
          <div className="grid grid-cols-4 md:grid-cols-6 gap-2 md:gap-3 mb-8">
            {drawnCards.slice(1).map((drawnCard, idx) => {
              const index = idx + 1;
              const pos = YEAR_AHEAD_POSITIONS[index];
              const posInfo = POSITION_LABELS[pos];
              const isRevealed = revealedCards[index];
              const canReveal = index === nextCardToReveal;

              return (
                <div key={index} className="flex flex-col items-center">
                  {/* Month Label */}
                  <div
                    className={`mb-2 px-2 py-0.5 rounded-full bg-gradient-to-r ${posInfo.color} text-white text-[10px] font-medium`}
                  >
                    {posInfo.emoji} {posInfo.shortTh}
                  </div>

                  {/* Card */}
                  <div className="relative">
                    <TarotCard
                      frontImage={drawnCard.card.imageUrl}
                      cardName={drawnCard.card.name}
                      size="xs"
                      isReversed={drawnCard.isReversed}
                      isFlipped={isRevealed}
                      onClick={canReveal ? () => handleRevealCard(index) : undefined}
                      className={`
                        ${canReveal ? 'cursor-pointer animate-pulse ring-2 ring-indigo-400 ring-offset-1 ring-offset-slate-950' : ''}
                        ${!canReveal && !isRevealed ? 'opacity-50' : ''}
                      `}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Progress */}
          <div className="text-slate-500 text-sm">เปิดแล้ว {revealedCards.filter((r) => r).length} / 13 ใบ</div>
        </div>
      </div>
    );
  }

  // Complete state - Show all revealed cards and interpretation
  if ((readingState === 'revealing' || readingState === 'complete') && allRevealed) {
    const selectedCard = selectedCardIndex !== null ? drawnCards[selectedCardIndex] : null;

    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950/30 to-slate-950 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Year Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300 mb-2">
              พยากรณ์ปี {currentYear}
            </h1>
            {question && (
              <p className="text-indigo-400 text-sm italic">&ldquo;{question}&rdquo;</p>
            )}
          </div>

          {/* Year Overview Card (Large) */}
          <div className="mb-8">
            <div className="text-center mb-3">
              <span className="px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-600 text-white text-sm font-medium">
                🌟 ภาพรวมทั้งปี
              </span>
            </div>
            <div
              className={`flex justify-center cursor-pointer transition-all duration-300 ${
                selectedCardIndex === 0 ? 'scale-105' : 'opacity-80 hover:opacity-100'
              }`}
              onClick={() => setSelectedCardIndex(0)}
            >
              <TarotCard
                frontImage={drawnCards[0]?.card.imageUrl}
                cardName={drawnCards[0]?.card.name}
                size="md"
                isReversed={drawnCards[0]?.isReversed}
                isFlipped={true}
                showFlipAnimation={false}
                className={selectedCardIndex === 0 ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-slate-950' : ''}
              />
            </div>
            <p className="text-center text-slate-400 text-sm mt-2">{drawnCards[0]?.card.nameTh}</p>
          </div>

          {/* Monthly Cards Grid */}
          <div className="grid grid-cols-4 md:grid-cols-6 gap-2 md:gap-3 mb-8">
            {drawnCards.slice(1).map((drawnCard, idx) => {
              const index = idx + 1;
              const pos = YEAR_AHEAD_POSITIONS[index];
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
                  {/* Month Label */}
                  <div
                    className={`mb-1 px-2 py-0.5 rounded-full bg-gradient-to-r ${posInfo.color} text-white text-[10px] font-medium`}
                  >
                    {posInfo.emoji} {posInfo.shortTh}
                  </div>

                  {/* Card */}
                  <TarotCard
                    frontImage={drawnCard.card.imageUrl}
                    cardName={drawnCard.card.name}
                    size="xs"
                    isReversed={drawnCard.isReversed}
                    isFlipped={true}
                    showFlipAnimation={false}
                    className={isSelected ? 'ring-2 ring-indigo-400 ring-offset-1 ring-offset-slate-950' : ''}
                  />
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
                  className={`inline-block px-4 py-1 rounded-full bg-gradient-to-r ${POSITION_LABELS[YEAR_AHEAD_POSITIONS[selectedCardIndex]].color} text-white text-sm font-medium mb-4`}
                >
                  {POSITION_LABELS[YEAR_AHEAD_POSITIONS[selectedCardIndex]].emoji}{' '}
                  {POSITION_LABELS[YEAR_AHEAD_POSITIONS[selectedCardIndex]].th}
                  {selectedCardIndex > 0 && ` ${currentYear}`}
                </div>

                <h2 className="text-2xl md:text-3xl font-bold font-card text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300 mb-1">
                  {selectedCard.card.nameTh}
                </h2>
                <p className="text-indigo-400 font-card">{selectedCard.card.name}</p>
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
                  <span key={i} className="px-3 py-1 bg-indigo-900/50 text-indigo-300 rounded-full text-sm">
                    {keyword}
                  </span>
                ))}
              </div>

              {/* Position Interpretation */}
              <div className="bg-indigo-900/20 border border-indigo-500/20 rounded-xl p-4 mb-4">
                <h3 className="text-base font-bold text-indigo-300 mb-2">
                  📆 {selectedCardIndex === 0 ? 'ภาพรวมปี' : POSITION_LABELS[YEAR_AHEAD_POSITIONS[selectedCardIndex]].th} {selectedCardIndex > 0 ? currentYear : ''}
                </h3>
                <p className="text-slate-300 text-sm italic mb-2">
                  {POSITION_LABELS[YEAR_AHEAD_POSITIONS[selectedCardIndex]].description}
                </p>
                <p className="text-slate-200 leading-relaxed">
                  {getYearAheadInterpretation(
                    selectedCard.card.nameTh,
                    selectedCard.isReversed,
                    YEAR_AHEAD_POSITIONS[selectedCardIndex],
                    selectedCardIndex
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

          {/* Year Summary */}
          <div className="bg-gradient-to-br from-slate-800/50 to-indigo-900/30 border border-indigo-500/30 rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-bold text-indigo-300 mb-4 flex items-center gap-2">
              <span className="text-2xl">📆</span>
              สรุปพยากรณ์ปี {currentYear}
            </h2>
            <div className="space-y-3 text-slate-300 leading-relaxed text-sm">
              <p className="text-base">
                <span className="font-semibold text-amber-300">🌟 ธีมประจำปี:</span>{' '}
                <span className="text-slate-200 font-bold">{drawnCards[0]?.card.nameTh}</span>
                {drawnCards[0]?.isReversed && ' (กลับหัว)'}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
                {drawnCards.slice(1).map((card, idx) => {
                  const pos = YEAR_AHEAD_POSITIONS[idx + 1];
                  const info = POSITION_LABELS[pos];
                  return (
                    <div key={pos} className="flex items-center gap-2 p-2 bg-slate-800/50 rounded-lg">
                      <span>{info.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-slate-400 text-xs">{info.shortTh}</p>
                        <p className="text-slate-200 text-xs truncate">{card.card.nameTh}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="text-center mb-8">
            <p className="text-slate-500 text-sm mb-3">คลิกไพ่ด้านบนเพื่อดูรายละเอียดแต่ละเดือน</p>
          </div>

          {/* Save Status */}
          {(isSaving || isSaved) && (
            <div className="text-center mb-6">
              {isSaving ? (
                <span className="text-indigo-400 text-sm animate-pulse">💾 กำลังบันทึก...</span>
              ) : isSaved ? (
                <span className="text-green-400 text-sm">✅ บันทึกแล้ว</span>
              ) : null}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={handleReset}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium rounded-xl transition-all duration-300"
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

// Helper function: Generate year ahead interpretation
function getYearAheadInterpretation(
  cardName: string,
  isReversed: boolean,
  position: YearAheadPosition,
  monthIndex: number
): string {
  if (position === 'ya_year_overview') {
    return isReversed
      ? `ไพ่ ${cardName} กลับหัวในตำแหน่ง "ภาพรวมทั้งปี" บ่งบอกว่าปีนี้อาจมีความท้าทายที่ต้องเผชิญ พลังงานนี้อาจแสดงออกในทางที่ไม่สมดุล ลองหาทางปรับสมดุลและเตรียมพร้อมรับมือกับอุปสรรค`
      : `ไพ่ ${cardName} ในตำแหน่ง "ภาพรวมทั้งปี" เผยให้เห็นธีมหลักของปีนี้ พลังงานนี้จะเป็นแรงขับเคลื่อนตลอดทั้งปี คุณอาจพบว่าตัวเองดึงดูดสถานการณ์ที่สะท้อนพลังงานนี้`;
  }

  const monthName = MONTH_NAMES_TH[monthIndex - 1];
  return isReversed
    ? `ไพ่ ${cardName} กลับหัวในเดือน${monthName} เตือนให้ระวังพลังงานที่อาจถูกปิดกั้นหรือแสดงออกในทางที่ไม่สมดุลในช่วงนี้ นี่อาจเป็นช่วงที่ต้องทบทวนและปรับตัว`
    : `ไพ่ ${cardName} ในเดือน${monthName} บ่งบอกว่าพลังงานนี้จะเด่นชัดในช่วงนี้ คุณอาจพบโอกาส ความท้าทาย หรือบทเรียนที่เกี่ยวข้องกับพลังงานของไพ่ใบนี้`;
}
