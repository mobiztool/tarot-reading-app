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

// Zodiac Wheel 12 Position Type (12 Astrological Houses)
type ZodiacWheelPosition =
  | 'zw_house_1'
  | 'zw_house_2'
  | 'zw_house_3'
  | 'zw_house_4'
  | 'zw_house_5'
  | 'zw_house_6'
  | 'zw_house_7'
  | 'zw_house_8'
  | 'zw_house_9'
  | 'zw_house_10'
  | 'zw_house_11'
  | 'zw_house_12';

// Zodiac Wheel 12 Position Labels
const ZODIAC_WHEEL_POSITIONS: ZodiacWheelPosition[] = [
  'zw_house_1',
  'zw_house_2',
  'zw_house_3',
  'zw_house_4',
  'zw_house_5',
  'zw_house_6',
  'zw_house_7',
  'zw_house_8',
  'zw_house_9',
  'zw_house_10',
  'zw_house_11',
  'zw_house_12',
];

const POSITION_LABELS: Record<
  ZodiacWheelPosition,
  {
    th: string;
    en: string;
    emoji: string;
    color: string;
    shortTh: string;
    zodiacSign: string;
    zodiacSignTh: string;
    ruling: string;
    rulingTh: string;
    description: string;
    lifeArea: string;
  }
> = {
  zw_house_1: {
    th: 'เรือนที่ 1',
    en: '1st House',
    emoji: '♈',
    color: 'from-red-500 to-rose-600',
    shortTh: 'เรือน 1',
    zodiacSign: 'Aries',
    zodiacSignTh: 'ราศีเมษ',
    ruling: 'Mars',
    rulingTh: 'ดาวอังคาร',
    description: 'ตัวตน บุคลิกภาพ รูปลักษณ์ภายนอก',
    lifeArea: 'Self & Identity',
  },
  zw_house_2: {
    th: 'เรือนที่ 2',
    en: '2nd House',
    emoji: '♉',
    color: 'from-green-500 to-emerald-600',
    shortTh: 'เรือน 2',
    zodiacSign: 'Taurus',
    zodiacSignTh: 'ราศีพฤษภ',
    ruling: 'Venus',
    rulingTh: 'ดาวศุกร์',
    description: 'การเงิน ทรัพย์สิน คุณค่า',
    lifeArea: 'Money & Possessions',
  },
  zw_house_3: {
    th: 'เรือนที่ 3',
    en: '3rd House',
    emoji: '♊',
    color: 'from-yellow-400 to-amber-500',
    shortTh: 'เรือน 3',
    zodiacSign: 'Gemini',
    zodiacSignTh: 'ราศีเมถุน',
    ruling: 'Mercury',
    rulingTh: 'ดาวพุธ',
    description: 'การสื่อสาร การเรียนรู้ พี่น้อง',
    lifeArea: 'Communication & Learning',
  },
  zw_house_4: {
    th: 'เรือนที่ 4',
    en: '4th House',
    emoji: '♋',
    color: 'from-slate-400 to-slate-500',
    shortTh: 'เรือน 4',
    zodiacSign: 'Cancer',
    zodiacSignTh: 'ราศีกรกฎ',
    ruling: 'Moon',
    rulingTh: 'ดวงจันทร์',
    description: 'บ้าน ครอบครัว รากเหง้า',
    lifeArea: 'Home & Family',
  },
  zw_house_5: {
    th: 'เรือนที่ 5',
    en: '5th House',
    emoji: '♌',
    color: 'from-orange-500 to-amber-600',
    shortTh: 'เรือน 5',
    zodiacSign: 'Leo',
    zodiacSignTh: 'ราศีสิงห์',
    ruling: 'Sun',
    rulingTh: 'ดวงอาทิตย์',
    description: 'ความคิดสร้างสรรค์ ความรัก ความสนุก',
    lifeArea: 'Creativity & Romance',
  },
  zw_house_6: {
    th: 'เรือนที่ 6',
    en: '6th House',
    emoji: '♍',
    color: 'from-amber-600 to-yellow-700',
    shortTh: 'เรือน 6',
    zodiacSign: 'Virgo',
    zodiacSignTh: 'ราศีกันย์',
    ruling: 'Mercury',
    rulingTh: 'ดาวพุธ',
    description: 'สุขภาพ การทำงาน กิจวัตร',
    lifeArea: 'Health & Daily Work',
  },
  zw_house_7: {
    th: 'เรือนที่ 7',
    en: '7th House',
    emoji: '♎',
    color: 'from-pink-400 to-rose-500',
    shortTh: 'เรือน 7',
    zodiacSign: 'Libra',
    zodiacSignTh: 'ราศีตุลย์',
    ruling: 'Venus',
    rulingTh: 'ดาวศุกร์',
    description: 'คู่ครอง หุ้นส่วน ความสัมพันธ์',
    lifeArea: 'Partnerships & Marriage',
  },
  zw_house_8: {
    th: 'เรือนที่ 8',
    en: '8th House',
    emoji: '♏',
    color: 'from-purple-600 to-violet-700',
    shortTh: 'เรือน 8',
    zodiacSign: 'Scorpio',
    zodiacSignTh: 'ราศีพิจิก',
    ruling: 'Pluto',
    rulingTh: 'ดาวพลูโต',
    description: 'การเปลี่ยนแปลง มรดก ความลึกซึ้ง',
    lifeArea: 'Transformation & Shared Resources',
  },
  zw_house_9: {
    th: 'เรือนที่ 9',
    en: '9th House',
    emoji: '♐',
    color: 'from-blue-500 to-indigo-600',
    shortTh: 'เรือน 9',
    zodiacSign: 'Sagittarius',
    zodiacSignTh: 'ราศีธนู',
    ruling: 'Jupiter',
    rulingTh: 'ดาวพฤหัส',
    description: 'การเดินทาง ปรัชญา การศึกษาสูง',
    lifeArea: 'Travel & Higher Learning',
  },
  zw_house_10: {
    th: 'เรือนที่ 10',
    en: '10th House',
    emoji: '♑',
    color: 'from-slate-600 to-slate-700',
    shortTh: 'เรือน 10',
    zodiacSign: 'Capricorn',
    zodiacSignTh: 'ราศีมังกร',
    ruling: 'Saturn',
    rulingTh: 'ดาวเสาร์',
    description: 'อาชีพ ชื่อเสียง ความสำเร็จ',
    lifeArea: 'Career & Public Image',
  },
  zw_house_11: {
    th: 'เรือนที่ 11',
    en: '11th House',
    emoji: '♒',
    color: 'from-cyan-500 to-blue-600',
    shortTh: 'เรือน 11',
    zodiacSign: 'Aquarius',
    zodiacSignTh: 'ราศีกุมภ์',
    ruling: 'Uranus',
    rulingTh: 'ดาวยูเรนัส',
    description: 'มิตรภาพ เครือข่าย ความหวัง',
    lifeArea: 'Friends & Aspirations',
  },
  zw_house_12: {
    th: 'เรือนที่ 12',
    en: '12th House',
    emoji: '♓',
    color: 'from-indigo-500 to-purple-600',
    shortTh: 'เรือน 12',
    zodiacSign: 'Pisces',
    zodiacSignTh: 'ราศีมีน',
    ruling: 'Neptune',
    rulingTh: 'ดาวเนปจูน',
    description: 'จิตวิญญาณ จิตใต้สำนึก การปลดปล่อย',
    lifeArea: 'Spirituality & Subconscious',
  },
};

// Sample questions for Zodiac Wheel
const ZODIAC_WHEEL_QUESTIONS = [
  'พลังงานจักรราศีส่งผลต่อชีวิตฉันอย่างไร?',
  'ฉันควรโฟกัสที่ด้านใดของชีวิต?',
  'จักรราศีบอกอะไรเกี่ยวกับช่วงนี้?',
  'ด้านใดของชีวิตที่ต้องการความสนใจ?',
];

export default function ZodiacWheelReadingPage(): React.JSX.Element | null {
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
        const response = await fetch('/api/access-check?spread=zodiac_wheel');
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
    trackReadingStarted?.('zodiac_wheel', !!question);
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

    if (newSelectedIndices.length < 12) {
      setSelectionStep(newSelectedIndices.length);
    } else {
      // All 12 cards selected, start reading after brief delay
      setTimeout(() => {
        startReading('zodiac' as Parameters<typeof startReading>[0], question || undefined);
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
    if (allRevealed && drawnCards.length === 12 && !hasSavedRef.current && user) {
      hasSavedRef.current = true;
      saveReading(
        'zodiac_wheel' as Parameters<typeof saveReading>[0],
        drawnCards,
        question || undefined,
        ZODIAC_WHEEL_POSITIONS as Parameters<typeof saveReading>[3]
      ).then((result) => {
        if (result) {
          setIsSaved(true);
          const duration = startTime ? Math.round((Date.now() - startTime) / 1000) : 0;
          trackReadingCompleted?.('zodiac_wheel', result.id, duration);
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
    const spreadInfo = SPREAD_INFO.zodiac_wheel;
    return (
      <PremiumGate
        spreadName="zodiac-wheel"
        spreadNameTh={spreadInfo?.nameTh || 'วงล้อจักรราศี'}
        spreadIcon={spreadInfo?.icon || '♈'}
        requiredTier="vip"
        currentTier={accessCheck.currentTier}
      />
    );
  }

  // Loading cards from database
  if (isLoadingCards) {
    return <PageLoader message="กำลังโหลดไพ่..." />;
  }

  // Selection mode - Show CardFan for 12 card selection
  if (isSelecting) {
    const currentPosition = ZODIAC_WHEEL_POSITIONS[selectionStep];
    const posInfo = POSITION_LABELS[currentPosition];

    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/30 to-slate-950 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header with current position */}
          <div className="text-center mb-4">
            <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 mb-2">
              เลือกไพ่ใบที่ {selectionStep + 1}/12
            </h2>
            <div
              className={`inline-block px-6 py-2 rounded-full bg-gradient-to-r ${posInfo.color} text-white font-medium text-lg mb-2`}
            >
              {posInfo.emoji} {posInfo.th} — {posInfo.zodiacSignTh}
            </div>
            <p className="text-slate-400 text-sm">{posInfo.description}</p>
          </div>

          {/* Question reminder */}
          {question && (
            <div className="text-center mb-4">
              <p className="text-purple-400 text-sm italic">&ldquo;{question}&rdquo;</p>
            </div>
          )}

          {/* Progress Indicator - Zodiac Signs Circle */}
          <div className="flex flex-wrap justify-center gap-1 mb-6">
            {ZODIAC_WHEEL_POSITIONS.map((pos, idx) => {
              const info = POSITION_LABELS[pos];
              return (
                <div
                  key={pos}
                  className={`flex items-center gap-0.5 px-2 py-1 rounded-full transition-all duration-300 text-xs ${
                    idx < selectionStep
                      ? 'bg-green-600/30 border border-green-500/50'
                      : idx === selectionStep
                        ? `bg-gradient-to-r ${info.color} shadow-lg`
                        : 'bg-slate-800/50 border border-slate-700/50'
                  }`}
                >
                  {idx < selectionStep ? <span className="text-green-400">✓</span> : <span>{info.emoji}</span>}
                </div>
              );
            })}
          </div>

          {/* Card Fan */}
          <CardFan
            cardCount={22}
            onSelectCard={handleSelectFromFan}
            selectedIndex={selectedFanIndices[selectionStep] ?? null}
            disabled={selectedFanIndices.length === 12}
          />

          {/* Selected cards preview */}
          {selectedFanIndices.length > 0 && (
            <div className="mt-6">
              <p className="text-center text-slate-500 text-sm mb-3">ไพ่ที่เลือกแล้ว: {selectedFanIndices.length}/12</p>
              <div className="flex flex-wrap justify-center gap-1">
                {ZODIAC_WHEEL_POSITIONS.map((pos, idx) => {
                  const info = POSITION_LABELS[pos];
                  return (
                    <div
                      key={pos}
                      className={`w-8 h-10 rounded flex items-center justify-center transition-all duration-300 ${
                        idx < selectedFanIndices.length
                          ? `bg-gradient-to-br ${info.color} shadow-lg`
                          : 'bg-slate-800/50 border border-dashed border-slate-600'
                      }`}
                    >
                      {idx < selectedFanIndices.length ? (
                        <span className="text-white text-[10px]">✓</span>
                      ) : (
                        <span className="text-[12px]">{info.emoji}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* All selected message */}
          {selectedFanIndices.length === 12 && (
            <div className="text-center mt-6 animate-pulse">
              <span className="text-purple-400 text-lg font-medium">♈ กำลังเปิดวงล้อจักรราศี...</span>
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
              disabled={selectedFanIndices.length === 12}
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
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/30 to-slate-950 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/20">
              <span className="text-4xl">♈</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 mb-4">
              Zodiac Wheel
            </h1>
            <p className="text-slate-400 text-lg">วงล้อจักรราศี • 12 ไพ่ • 12 เรือนจักรราศี</p>
            <div className="mt-4 inline-block px-4 py-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white text-sm font-medium">
              👑 VIP Exclusive • Astrology + Tarot
            </div>
          </div>

          {/* Zodiac Signs Circle Preview */}
          <div className="flex justify-center gap-2 flex-wrap mb-8">
            {ZODIAC_WHEEL_POSITIONS.map((pos) => {
              const info = POSITION_LABELS[pos];
              return (
                <div
                  key={pos}
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${info.color} flex items-center justify-center shadow-lg`}
                  title={`${info.zodiacSignTh} - ${info.description}`}
                >
                  <span className="text-lg">{info.emoji}</span>
                </div>
              );
            })}
          </div>

          {/* Description */}
          <div className="bg-slate-800/50 border border-purple-500/30 rounded-2xl p-6 mb-8">
            <h2 className="text-lg font-semibold text-purple-300 mb-3">♈ เกี่ยวกับวงล้อจักรราศี</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              Zodiac Wheel ผสมผสานโหราศาสตร์และไพ่ทาโรต์เข้าด้วยกัน 
              ไพ่ 12 ใบจะถูกวางในตำแหน่งของ 12 เรือนจักรราศี 
              เพื่อเปิดเผยพลังงานที่ส่งผลต่อแต่ละด้านของชีวิต
            </p>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2 text-slate-400">
                <span>⏱️</span> ~12 นาที
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <span>🎴</span> 12 ไพ่
              </div>
            </div>
          </div>

          {/* 12 Houses Preview */}
          <div className="bg-purple-900/20 border border-purple-500/30 rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-purple-300 mb-4 flex items-center">
              <span className="mr-2">🏛️</span>
              12 เรือนจักรราศี
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {ZODIAC_WHEEL_POSITIONS.map((pos) => {
                const info = POSITION_LABELS[pos];
                return (
                  <div key={pos} className="flex items-center gap-2 p-2 bg-slate-800/50 rounded-lg">
                    <span className="text-lg">{info.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-200 text-xs font-medium">{info.th}</p>
                      <p className="text-slate-500 text-[10px] truncate">{info.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Question Input */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 mb-8">
            <label htmlFor="question" className="block text-purple-300 font-medium mb-3">
              คำถามสำหรับวงล้อจักรราศี <span className="text-slate-500">(ไม่จำเป็น)</span>
            </label>
            <textarea
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="เช่น พลังงานจักรราศีส่งผลต่อชีวิตฉันอย่างไร?"
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
              {ZODIAC_WHEEL_QUESTIONS.map((sample) => (
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
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300 hover:-translate-y-1"
            >
              <span className="text-xl mr-3">♈</span>
              เริ่มอ่านวงล้อจักรราศี
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
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/30 to-slate-950 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="flex justify-center gap-2 mb-8 flex-wrap max-w-md">
            {ZODIAC_WHEEL_POSITIONS.map((pos, i) => {
              const info = POSITION_LABELS[pos];
              return (
                <div
                  key={pos}
                  className={`w-10 h-14 bg-gradient-to-br ${info.color} rounded-lg animate-pulse shadow-lg flex items-center justify-center`}
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <span className="text-lg">{info.emoji}</span>
                </div>
              );
            })}
          </div>
          <h2 className="text-2xl font-bold text-purple-300 mb-2">
            {readingState === 'shuffling' ? 'กำลังสับไพ่...' : 'กำลังจั่วไพ่ 12 ใบ...'}
          </h2>
          <p className="text-slate-400">เตรียมพร้อมเปิดวงล้อจักรราศี</p>
        </div>
      </div>
    );
  }

  // Revealing state - Show cards to flip sequentially
  if (readingState === 'revealing' && !allRevealed) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/30 to-slate-950 py-8 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-purple-300 mb-2">เปิดเผยวงล้อจักรราศี</h2>
          <p className="text-slate-400 mb-4">คลิกที่ไพ่ใบที่ {nextCardToReveal + 1} เพื่อเปิด</p>

          {/* Skip Animation Button */}
          <button
            onClick={revealAllCards}
            className="mb-8 px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-400 hover:text-slate-200 text-sm rounded-lg transition-colors border border-slate-600/50"
          >
            ⏩ ข้ามไปผลลัพธ์
          </button>

          {/* 12 Cards Grid - Wheel-like arrangement */}
          <div className="grid grid-cols-4 md:grid-cols-6 gap-2 md:gap-3 mb-8">
            {drawnCards.map((drawnCard, index) => {
              const pos = ZODIAC_WHEEL_POSITIONS[index];
              const posInfo = POSITION_LABELS[pos];
              const isRevealed = revealedCards[index];
              const canReveal = index === nextCardToReveal;

              return (
                <div key={index} className="flex flex-col items-center">
                  {/* Zodiac Label */}
                  <div
                    className={`mb-2 px-2 py-0.5 rounded-full bg-gradient-to-r ${posInfo.color} text-white text-[10px] font-medium flex items-center gap-1`}
                  >
                    <span>{posInfo.emoji}</span>
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
                        ${canReveal ? 'cursor-pointer animate-pulse ring-2 ring-purple-400 ring-offset-1 ring-offset-slate-950' : ''}
                        ${!canReveal && !isRevealed ? 'opacity-50' : ''}
                      `}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Progress */}
          <div className="text-slate-500 text-sm">เปิดแล้ว {revealedCards.filter((r) => r).length} / 12 ใบ</div>
        </div>
      </div>
    );
  }

  // Complete state - Show all revealed cards and interpretation
  if ((readingState === 'revealing' || readingState === 'complete') && allRevealed) {
    const selectedCard = selectedCardIndex !== null ? drawnCards[selectedCardIndex] : null;

    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/30 to-slate-950 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Question display */}
          {question && (
            <div className="text-center mb-6">
              <p className="text-slate-500 text-sm mb-1">คำถามของคุณ:</p>
              <p className="text-purple-300 text-lg italic">&ldquo;{question}&rdquo;</p>
            </div>
          )}

          {/* Zodiac Wheel Grid - Desktop: Circular feel, Mobile: Grid */}
          <div className="mb-8">
            {/* Desktop Circular Layout */}
            <div className="hidden md:flex justify-center">
              <div className="relative w-[500px] h-[500px]">
                {drawnCards.map((drawnCard, index) => {
                  const pos = ZODIAC_WHEEL_POSITIONS[index];
                  const posInfo = POSITION_LABELS[pos];
                  const isSelected = selectedCardIndex === index;
                  
                  // Calculate position in a circle (start from 9 o'clock, go clockwise)
                  const angle = ((index * 30) - 90) * (Math.PI / 180); // 30 degrees per house
                  const radius = 200;
                  const x = 250 + radius * Math.cos(angle);
                  const y = 250 + radius * Math.sin(angle);

                  return (
                    <div
                      key={index}
                      className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 ${
                        isSelected ? 'scale-125 z-10' : 'opacity-80 hover:opacity-100 hover:scale-110'
                      }`}
                      style={{ left: `${x}px`, top: `${y}px` }}
                      onClick={() => setSelectedCardIndex(index)}
                    >
                      <div className="flex flex-col items-center">
                        <div
                          className={`mb-1 w-6 h-6 rounded-full bg-gradient-to-r ${posInfo.color} flex items-center justify-center text-xs`}
                        >
                          {posInfo.emoji}
                        </div>
                        <TarotCard
                          frontImage={drawnCard.card.imageUrl}
                          cardName={drawnCard.card.name}
                          size="xs"
                          isReversed={drawnCard.isReversed}
                          isFlipped={true}
                          showFlipAnimation={false}
                          className={isSelected ? 'ring-2 ring-purple-400 ring-offset-1 ring-offset-slate-950' : ''}
                        />
                      </div>
                    </div>
                  );
                })}
                {/* Center decoration */}
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-gradient-to-br from-purple-600/30 to-pink-600/30 border border-purple-500/50 flex items-center justify-center">
                  <span className="text-3xl">☉</span>
                </div>
              </div>
            </div>

            {/* Mobile Grid Layout */}
            <div className="md:hidden grid grid-cols-4 gap-2">
              {drawnCards.map((drawnCard, index) => {
                const pos = ZODIAC_WHEEL_POSITIONS[index];
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
                    <div
                      className={`mb-1 w-6 h-6 rounded-full bg-gradient-to-r ${posInfo.color} flex items-center justify-center text-xs`}
                    >
                      {posInfo.emoji}
                    </div>
                    <TarotCard
                      frontImage={drawnCard.card.imageUrl}
                      cardName={drawnCard.card.name}
                      size="xs"
                      isReversed={drawnCard.isReversed}
                      isFlipped={true}
                      showFlipAnimation={false}
                      className={isSelected ? 'ring-2 ring-purple-400 ring-offset-1 ring-offset-slate-950' : ''}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Card Detail */}
          {selectedCard && selectedCardIndex !== null && (
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 mb-8">
              {/* Card Header */}
              <div className="text-center mb-6">
                <div
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${POSITION_LABELS[ZODIAC_WHEEL_POSITIONS[selectedCardIndex]].color} text-white font-medium mb-4`}
                >
                  <span className="text-xl">{POSITION_LABELS[ZODIAC_WHEEL_POSITIONS[selectedCardIndex]].emoji}</span>
                  {POSITION_LABELS[ZODIAC_WHEEL_POSITIONS[selectedCardIndex]].th} — {POSITION_LABELS[ZODIAC_WHEEL_POSITIONS[selectedCardIndex]].zodiacSignTh}
                </div>

                <h2 className="text-2xl md:text-3xl font-bold font-card text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 mb-1">
                  {selectedCard.card.nameTh}
                </h2>
                <p className="text-purple-400 font-card">{selectedCard.card.name}</p>
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
                  <span key={i} className="px-3 py-1 bg-purple-900/50 text-purple-300 rounded-full text-sm">
                    {keyword}
                  </span>
                ))}
              </div>

              {/* House Info */}
              <div className="bg-purple-900/20 border border-purple-500/20 rounded-xl p-4 mb-4">
                <h3 className="text-base font-bold text-purple-300 mb-2">
                  🏛️ {POSITION_LABELS[ZODIAC_WHEEL_POSITIONS[selectedCardIndex]].th}: {POSITION_LABELS[ZODIAC_WHEEL_POSITIONS[selectedCardIndex]].lifeArea}
                </h3>
                <p className="text-slate-300 text-sm mb-2">
                  <span className="text-purple-400">ราศี:</span> {POSITION_LABELS[ZODIAC_WHEEL_POSITIONS[selectedCardIndex]].zodiacSignTh} | 
                  <span className="text-purple-400 ml-2">ดาวปกครอง:</span> {POSITION_LABELS[ZODIAC_WHEEL_POSITIONS[selectedCardIndex]].rulingTh}
                </p>
                <p className="text-slate-200 leading-relaxed">
                  {getZodiacInterpretation(
                    selectedCard.card.nameTh,
                    selectedCard.isReversed,
                    ZODIAC_WHEEL_POSITIONS[selectedCardIndex]
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
                    <div className="bg-indigo-900/20 border border-indigo-500/20 rounded-xl p-4">
                      <h3 className="text-base font-bold text-indigo-300 mb-2">🔮 ความหมายเชิงลึก</h3>
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

          {/* Zodiac Wheel Summary */}
          <div className="bg-gradient-to-br from-slate-800/50 to-purple-900/30 border border-purple-500/30 rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-bold text-purple-300 mb-4 flex items-center gap-2">
              <span className="text-2xl">♈</span>
              สรุปวงล้อจักรราศี
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-slate-300 leading-relaxed text-sm">
              {ZODIAC_WHEEL_POSITIONS.map((pos, idx) => {
                const info = POSITION_LABELS[pos];
                const card = drawnCards[idx];
                return (
                  <div key={pos} className={`p-2 bg-gradient-to-r ${info.color}/10 rounded-lg`}>
                    <div className="flex items-center gap-1 mb-1">
                      <span>{info.emoji}</span>
                      <span className="font-medium text-slate-200 text-xs">{info.th}</span>
                    </div>
                    <p className="text-slate-400 text-[10px]">{info.description}</p>
                    <p className="text-slate-200 text-xs mt-1 truncate">
                      {card?.card.nameTh}
                      {card?.isReversed && ' ↺'}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="text-center mb-8">
            <p className="text-slate-500 text-sm mb-3">คลิกไพ่บนวงล้อเพื่อดูรายละเอียดแต่ละเรือน</p>
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
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium rounded-xl transition-all duration-300"
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

// Helper function: Generate zodiac wheel interpretation
function getZodiacInterpretation(
  cardName: string,
  isReversed: boolean,
  position: ZodiacWheelPosition
): string {
  const info = POSITION_LABELS[position];
  
  return isReversed
    ? `ไพ่ ${cardName} กลับหัวใน${info.th} (${info.zodiacSignTh}) บ่งบอกว่าด้าน${info.description}อาจต้องการความใส่ใจเป็นพิเศษ พลังงานในส่วนนี้อาจถูกปิดกั้นหรือไม่สมดุล ลองทบทวนและปรับสมดุลในเรื่องที่เกี่ยวข้องกับ${info.lifeArea}`
    : `ไพ่ ${cardName} ใน${info.th} (${info.zodiacSignTh}) เปิดเผยพลังงานที่ส่งผลต่อ${info.description}ของคุณ ดาว${info.rulingTh}ส่งเสริมให้คุณใช้พลังงานนี้ในเรื่อง${info.lifeArea}`;
}
