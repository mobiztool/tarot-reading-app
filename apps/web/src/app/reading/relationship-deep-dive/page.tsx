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

// Relationship Deep Dive 7 Position Type
type RelationshipPosition =
  | 'rdd_you'
  | 'rdd_them'
  | 'rdd_connection'
  | 'rdd_your_feelings'
  | 'rdd_their_feelings'
  | 'rdd_challenges'
  | 'rdd_future_potential';

// Relationship Deep Dive 7 Position Labels
const RELATIONSHIP_POSITIONS: RelationshipPosition[] = [
  'rdd_you',
  'rdd_them',
  'rdd_connection',
  'rdd_your_feelings',
  'rdd_their_feelings',
  'rdd_challenges',
  'rdd_future_potential',
];

const POSITION_LABELS: Record<
  RelationshipPosition,
  {
    th: string;
    en: string;
    emoji: string;
    color: string;
    shortTh: string;
    description: string;
    counselingNote: string;
  }
> = {
  rdd_you: {
    th: 'สถานะของคุณ',
    en: 'You (Current State)',
    emoji: '💜',
    color: 'from-purple-500 to-violet-600',
    shortTh: 'คุณ',
    description: 'สถานะและทัศนคติของคุณในความสัมพันธ์',
    counselingNote: 'สะท้อนพลังงานและความพร้อมของคุณในความสัมพันธ์ปัจจุบัน',
  },
  rdd_them: {
    th: 'สถานะของอีกฝ่าย',
    en: 'Them (Their State)',
    emoji: '💙',
    color: 'from-blue-500 to-cyan-600',
    shortTh: 'อีกฝ่าย',
    description: 'สถานะและทัศนคติของอีกฝ่ายในความสัมพันธ์',
    counselingNote: 'เปิดเผยพลังงานและความรู้สึกของอีกฝ่ายที่มีต่อความสัมพันธ์',
  },
  rdd_connection: {
    th: 'พลังความเชื่อมโยง',
    en: 'Connection Dynamic',
    emoji: '💞',
    color: 'from-pink-500 to-rose-600',
    shortTh: 'เชื่อมโยง',
    description: 'พลังงานและไดนามิกของความสัมพันธ์',
    counselingNote: 'แสดงถึงพื้นฐานและคุณภาพของการเชื่อมโยงระหว่างกัน',
  },
  rdd_your_feelings: {
    th: 'ความรู้สึกของคุณ',
    en: 'Your Feelings',
    emoji: '❤️',
    color: 'from-red-500 to-pink-600',
    shortTh: 'รู้สึก(คุณ)',
    description: 'ความรู้สึกที่แท้จริงของคุณ',
    counselingNote: 'เปิดเผยอารมณ์และความรู้สึกที่แท้จริงในใจคุณ',
  },
  rdd_their_feelings: {
    th: 'ความรู้สึกของอีกฝ่าย',
    en: 'Their Feelings',
    emoji: '💗',
    color: 'from-rose-500 to-pink-600',
    shortTh: 'รู้สึก(เขา)',
    description: 'ความรู้สึกที่แท้จริงของอีกฝ่าย',
    counselingNote: 'สะท้อนอารมณ์และความรู้สึกที่อีกฝ่ายมีต่อคุณ',
  },
  rdd_challenges: {
    th: 'ความท้าทาย',
    en: 'Challenges',
    emoji: '⚡',
    color: 'from-amber-500 to-orange-600',
    shortTh: 'ท้าทาย',
    description: 'อุปสรรคและความท้าทายที่ต้องเผชิญ',
    counselingNote: 'ชี้ให้เห็นจุดที่ต้องการความเข้าใจและการทำงานร่วมกัน',
  },
  rdd_future_potential: {
    th: 'ศักยภาพในอนาคต',
    en: 'Future Potential',
    emoji: '🌟',
    color: 'from-cyan-500 to-blue-600',
    shortTh: 'อนาคต',
    description: 'ทิศทางและศักยภาพของความสัมพันธ์',
    counselingNote: 'บ่งบอกถึงเส้นทางและโอกาสที่รออยู่ข้างหน้า',
  },
};

// Sample relationship questions
const RELATIONSHIP_QUESTIONS = [
  'ความสัมพันธ์ของเราจะไปในทิศทางไหน?',
  'เราเข้ากันได้ดีแค่ไหน?',
  'อะไรคือสิ่งที่ต้องปรับปรุงในความสัมพันธ์?',
  'เขา/เธอรู้สึกอย่างไรกับฉันจริงๆ?',
  'เราจะผ่านพ้นความท้าทายนี้ไปได้ไหม?',
];

export default function RelationshipDeepDiveReadingPage() {
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

  // Check premium access via API
  useEffect(() => {
    async function checkAccess() {
      try {
        const response = await fetch('/api/access-check?spread=relationship_deep_dive');
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
          requiredTier: 'pro',
        });
      }
    }

    if (!isLoadingAuth) {
      checkAccess();
    }
  }, [user, isLoadingAuth]);

  // Start selection mode (show card fan)
  const handleStartSelection = () => {
    trackReadingStarted?.('relationship_deep_dive', !!question);
    setStartTime(Date.now());
    setIsSelecting(true);
    setSelectionStep(0);
    setSelectedFanIndices([]);
  };

  // Handle card selection from fan
  const handleSelectFromFan = (index: number) => {
    if (selectedFanIndices.includes(index)) return;

    const newSelectedIndices = [...selectedFanIndices, index];
    setSelectedFanIndices(newSelectedIndices);

    if (newSelectedIndices.length < 7) {
      setSelectionStep(newSelectedIndices.length);
    } else {
      // All 7 cards selected, start reading after brief delay
      setTimeout(() => {
        startReading('relationship-deep-dive', question || undefined);
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
    if (allRevealed && drawnCards.length === 7 && !hasSavedRef.current && user) {
      hasSavedRef.current = true;
      saveReading('relationship_deep_dive', drawnCards, question || undefined).then((result) => {
        if (result) {
          setIsSaved(true);
          // Track spread completed
          const duration = startTime ? Math.round((Date.now() - startTime) / 1000) : 0;
          trackReadingCompleted?.('relationship_deep_dive', result.id, duration);
        }
      });
    }
  }, [allRevealed, drawnCards, question, saveReading, user, startTime, trackReadingCompleted]);

  // Loading states
  if (isLoadingAuth || !accessCheck.checked) {
    return <PageLoader message="กำลังตรวจสอบสิทธิ์..." />;
  }

  // Premium gate - show if user doesn't have access
  if (!accessCheck.allowed) {
    const spreadInfo = SPREAD_INFO.relationship_deep_dive;
    return (
      <PremiumGate
        spreadName="relationship-deep-dive"
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

  // Selection mode - Show CardFan for 7 card selection
  if (isSelecting) {
    const currentPosition = RELATIONSHIP_POSITIONS[selectionStep];
    const posInfo = POSITION_LABELS[currentPosition];

    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-pink-950/20 to-slate-900 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header with current position */}
          <div className="text-center mb-4">
            <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-rose-300 mb-2">
              เลือกไพ่ใบที่ {selectionStep + 1}/7
            </h2>
            <div className={`inline-block px-6 py-2 rounded-full bg-gradient-to-r ${posInfo.color} text-white font-medium text-lg mb-2`}>
              {posInfo.emoji} {posInfo.th}
            </div>
            <p className="text-slate-400 text-sm">{posInfo.description}</p>
          </div>

          {/* Question reminder */}
          {question && (
            <div className="text-center mb-4">
              <p className="text-pink-400 text-sm italic">&ldquo;{question}&rdquo;</p>
            </div>
          )}

          {/* Progress Indicator */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {RELATIONSHIP_POSITIONS.map((pos, idx) => {
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

          {/* Card Fan */}
          <CardFan
            cardCount={22}
            onSelectCard={handleSelectFromFan}
            selectedIndex={selectedFanIndices[selectionStep] ?? null}
            disabled={selectedFanIndices.length === 7}
          />

          {/* Selected cards preview */}
          {selectedFanIndices.length > 0 && (
            <div className="mt-6">
              <p className="text-center text-slate-500 text-sm mb-3">ไพ่ที่เลือกแล้ว: {selectedFanIndices.length}/7</p>
              <div className="flex flex-wrap justify-center gap-2">
                {RELATIONSHIP_POSITIONS.map((pos, idx) => (
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
          {selectedFanIndices.length === 7 && (
            <div className="text-center mt-6 animate-pulse">
              <span className="text-pink-400 text-lg font-medium">
                ✨ กำลังเตรียมวิเคราะห์ความสัมพันธ์ของคุณ...
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
              disabled={selectedFanIndices.length === 7}
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
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-pink-950/20 to-slate-900 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-pink-400 to-rose-600 rounded-full flex items-center justify-center shadow-lg shadow-pink-500/30">
              <span className="text-4xl">💞</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-rose-300 mb-4">
              วิเคราะห์ความสัมพันธ์
            </h1>
            <p className="text-slate-400 text-lg">Relationship Deep Dive • 7 ไพ่ • การวิเคราะห์แบบลึกซึ้ง</p>
            <div className="mt-4 inline-block px-4 py-1 bg-gradient-to-r from-pink-600 to-rose-600 rounded-full text-white text-sm font-medium">
              ✨ Pro Feature
            </div>
          </div>

          {/* Relationship-focused Description */}
          <div className="bg-slate-800/50 border border-pink-500/30 rounded-2xl p-6 mb-8">
            <h2 className="text-lg font-semibold text-pink-300 mb-3">💕 เกี่ยวกับการวิเคราะห์ความสัมพันธ์</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              การอ่านไพ่แบบนี้ออกแบบมาเพื่อวิเคราะห์ความสัมพันธ์อย่างลึกซึ้ง
              ผ่านการทำความเข้าใจทั้งสองฝ่าย พลังเชื่อมโยง และทิศทางของความสัมพันธ์
              เหมาะสำหรับผู้ที่ต้องการเข้าใจความสัมพันธ์ในมิติที่ลึกกว่าและซับซ้อนกว่าการดูดวงความรักทั่วไป
            </p>

            {/* Counseling concepts */}
            <div className="bg-pink-900/20 border border-pink-500/20 rounded-xl p-4 mb-4">
              <h3 className="text-sm font-medium text-pink-300 mb-2">💖 หลักการวิเคราะห์ความสัมพันธ์</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="text-pink-400">•</span>
                  <span>ความสัมพันธ์ที่ดีต้องอาศัยการเข้าใจทั้งสองฝ่าย</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-400">•</span>
                  <span>ความท้าทายคือโอกาสในการเติบโตร่วมกัน</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-400">•</span>
                  <span>การสื่อสารที่ดีเริ่มจากความเข้าใจที่แท้จริง</span>
                </li>
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2 text-slate-400">
                <span>⏱️</span> ~7 นาที
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <span>🎴</span> 7 ไพ่
              </div>
            </div>
          </div>

          {/* 7 Positions Preview */}
          <div className="bg-pink-900/20 border border-pink-500/30 rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-pink-300 mb-4 flex items-center">
              <span className="mr-2">🗺️</span>
              ตำแหน่งไพ่ทั้ง 7
            </h3>
            <div className="space-y-3">
              {RELATIONSHIP_POSITIONS.map((pos) => {
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
            <label htmlFor="question" className="block text-pink-300 font-medium mb-3">
              คำถามเกี่ยวกับความสัมพันธ์ <span className="text-slate-500">(ไม่จำเป็น)</span>
            </label>
            <textarea
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="เช่น ความสัมพันธ์ของเราจะไปในทิศทางไหน?"
              className="w-full bg-slate-900/50 border border-slate-600/50 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/50 resize-none"
              rows={3}
              maxLength={500}
            />
            <p className="text-right text-slate-500 text-sm mt-2">{question.length}/500</p>
          </div>

          {/* Sample Questions */}
          <div className="mb-8">
            <p className="text-slate-500 text-sm mb-3">💡 ตัวอย่างคำถาม:</p>
            <div className="flex flex-wrap gap-2">
              {RELATIONSHIP_QUESTIONS.map((sample) => (
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
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white font-semibold rounded-xl shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 transition-all duration-300 hover:-translate-y-1"
            >
              <span className="text-xl mr-3">💞</span>
              เริ่มวิเคราะห์ความสัมพันธ์
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
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-pink-950/20 to-slate-900 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="flex justify-center gap-3 mb-8 flex-wrap max-w-md">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className="w-14 h-20 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg animate-pulse shadow-lg"
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </div>
          <h2 className="text-2xl font-bold text-pink-300 mb-2">
            {readingState === 'shuffling' ? 'กำลังเตรียมวิเคราะห์...' : 'กำลังจั่วไพ่ 7 ใบ...'}
          </h2>
          <p className="text-slate-400">หายใจลึกๆ และเปิดใจรับข้อความ</p>
        </div>
      </div>
    );
  }

  // Revealing state - Show cards to flip sequentially
  if (readingState === 'revealing' && !allRevealed) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-pink-950/20 to-slate-900 py-8 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-pink-300 mb-2">เปิดเผยความสัมพันธ์ของคุณ</h2>
          <p className="text-slate-400 mb-4">คลิกที่ไพ่ใบที่ {nextCardToReveal + 1} เพื่อเปิด</p>

          {/* Skip Animation Button */}
          <button
            onClick={revealAllCards}
            className="mb-8 px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-400 hover:text-slate-200 text-sm rounded-lg transition-colors border border-slate-600/50"
          >
            ⏩ ข้ามไปผลลัพธ์
          </button>

          {/* 7 Cards Layout - You vs Them with Connection in center */}
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 mb-8">
            {drawnCards.map((drawnCard, index) => {
              const pos = RELATIONSHIP_POSITIONS[index];
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
                      size="sm"
                      isReversed={drawnCard.isReversed}
                      isFlipped={isRevealed}
                      onClick={canReveal ? () => handleRevealCard(index) : undefined}
                      className={`
                        ${canReveal ? 'cursor-pointer animate-pulse ring-2 ring-pink-400 ring-offset-2 ring-offset-slate-900' : ''}
                        ${!canReveal && !isRevealed ? 'opacity-50' : ''}
                      `}
                    />
                    {canReveal && !isRevealed && (
                      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-pink-400 text-xs animate-bounce whitespace-nowrap">
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
            เปิดแล้ว {revealedCards.filter((r) => r).length} / 7 ใบ
          </div>
        </div>
      </div>
    );
  }

  // Complete state - Show all revealed cards and interpretation
  if ((readingState === 'revealing' || readingState === 'complete') && allRevealed) {
    const selectedCard = selectedCardIndex !== null ? drawnCards[selectedCardIndex] : null;

    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-pink-950/20 to-slate-900 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Question display */}
          {question && (
            <div className="text-center mb-6">
              <p className="text-slate-500 text-sm mb-1">คำถามเกี่ยวกับความสัมพันธ์:</p>
              <p className="text-pink-300 text-lg italic">&ldquo;{question}&rdquo;</p>
            </div>
          )}

          {/* All 7 Cards Grid */}
          <div className="grid grid-cols-7 gap-2 md:gap-3 mb-8">
            {drawnCards.map((drawnCard, index) => {
              const pos = RELATIONSHIP_POSITIONS[index];
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
                    className={`mb-2 px-2 py-0.5 rounded-full bg-gradient-to-r ${posInfo.color} text-white text-[10px] font-medium text-center`}
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
                    className={isSelected ? 'ring-2 ring-pink-400 ring-offset-2 ring-offset-slate-900' : ''}
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
                  className={`inline-block px-4 py-1 rounded-full bg-gradient-to-r ${POSITION_LABELS[RELATIONSHIP_POSITIONS[selectedCardIndex]].color} text-white text-sm font-medium mb-4`}
                >
                  {POSITION_LABELS[RELATIONSHIP_POSITIONS[selectedCardIndex]].emoji}{' '}
                  {POSITION_LABELS[RELATIONSHIP_POSITIONS[selectedCardIndex]].th}
                </div>

                <h2 className="text-2xl md:text-3xl font-bold font-card text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-rose-300 mb-1">
                  {selectedCard.card.nameTh}
                </h2>
                <p className="text-pink-400 font-card">{selectedCard.card.name}</p>
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
                  <span key={i} className="px-3 py-1 bg-pink-900/50 text-pink-300 rounded-full text-sm">
                    {keyword}
                  </span>
                ))}
              </div>

              {/* Counseling-focused Position Interpretation */}
              <div className="bg-pink-900/20 border border-pink-500/20 rounded-xl p-4 mb-4">
                <h3 className="text-base font-bold text-pink-300 mb-2">
                  💕 ในตำแหน่ง &quot;{POSITION_LABELS[RELATIONSHIP_POSITIONS[selectedCardIndex]].th}&quot;
                </h3>
                <p className="text-slate-300 text-sm italic mb-2">
                  {POSITION_LABELS[RELATIONSHIP_POSITIONS[selectedCardIndex]].counselingNote}
                </p>
                <p className="text-slate-200 leading-relaxed">
                  {getRelationshipInterpretation(
                    selectedCard.card.nameTh,
                    selectedCard.isReversed,
                    RELATIONSHIP_POSITIONS[selectedCardIndex]
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
                    <div className="bg-rose-900/20 border border-rose-500/20 rounded-xl p-4">
                      <h3 className="text-base font-bold text-rose-300 mb-2">💖 ความหมายด้านความสัมพันธ์</h3>
                      <p className="text-slate-200 leading-relaxed text-sm">{detailedMeaning.love}</p>
                    </div>

                    <div className="bg-purple-900/20 border border-purple-500/20 rounded-xl p-4">
                      <h3 className="text-base font-bold text-purple-300 mb-2">💡 คำแนะนำ</h3>
                      <p className="text-slate-200 leading-relaxed text-sm">{detailedMeaning.advice}</p>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Relationship Summary */}
          <div className="bg-gradient-to-br from-pink-900/30 to-rose-900/30 border border-pink-500/30 rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-bold text-pink-300 mb-4 flex items-center gap-2">
              <span className="text-2xl">💞</span>
              สรุปการวิเคราะห์ความสัมพันธ์
            </h2>
            <div className="space-y-4 text-slate-300 leading-relaxed">
              <p>
                <span className="font-semibold text-purple-300">สถานะของคุณ:</span>{' '}
                <span className="text-slate-200">{drawnCards[0]?.card.nameTh}</span>
                {drawnCards[0]?.isReversed && ' (กลับหัว)'} สะท้อนถึงพลังงานและความพร้อมของคุณในความสัมพันธ์
              </p>
              <p>
                <span className="font-semibold text-blue-300">สถานะของอีกฝ่าย:</span>{' '}
                <span className="text-slate-200">{drawnCards[1]?.card.nameTh}</span>
                {drawnCards[1]?.isReversed && ' (กลับหัว)'} บ่งบอกถึงความรู้สึกและทัศนคติของพวกเขา
              </p>
              <p>
                <span className="font-semibold text-pink-300">พลังเชื่อมโยง:</span>{' '}
                <span className="text-slate-200">{drawnCards[2]?.card.nameTh}</span>
                {drawnCards[2]?.isReversed && ' (กลับหัว)'} คือพื้นฐานของความสัมพันธ์ระหว่างคุณทั้งสอง
              </p>
              <p>
                <span className="font-semibold text-amber-300">ความท้าทาย:</span>{' '}
                <span className="text-slate-200">{drawnCards[5]?.card.nameTh}</span>
                {drawnCards[5]?.isReversed && ' (กลับหัว)'} คือสิ่งที่ต้องการความเข้าใจและการทำงานร่วมกัน
              </p>
              <p className="text-lg">
                <span className="font-semibold text-cyan-300">อนาคต:</span>{' '}
                <span className="text-slate-200 font-bold">{drawnCards[6]?.card.nameTh}</span>
                {drawnCards[6]?.isReversed && ' (กลับหัว)'} ชี้ให้เห็นทิศทางและศักยภาพของความสัมพันธ์
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
                <span className="text-pink-400 text-sm animate-pulse">💾 กำลังบันทึก...</span>
              ) : isSaved ? (
                <span className="text-green-400 text-sm">✅ บันทึกแล้ว</span>
              ) : null}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={handleReset}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-medium rounded-xl transition-all duration-300"
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

// Helper function: Generate relationship-focused interpretation
function getRelationshipInterpretation(
  cardName: string,
  isReversed: boolean,
  position: RelationshipPosition
): string {
  const interpretations: Record<RelationshipPosition, { upright: string; reversed: string }> = {
    rdd_you: {
      upright: `ไพ่ ${cardName} ในตำแหน่ง "สถานะของคุณ" สะท้อนว่าคุณกำลังอยู่ในสภาวะที่พร้อมและมีพลังงานเชิงบวกสำหรับความสัมพันธ์ คุณมีความชัดเจนในสิ่งที่ต้องการและพร้อมที่จะมีส่วนร่วมอย่างแท้จริง`,
      reversed: `ไพ่ ${cardName} กลับหัวในตำแหน่ง "สถานะของคุณ" บ่งบอกว่าคุณอาจกำลังมีความสับสนหรือไม่แน่ใจในความรู้สึกของตัวเอง อาจต้องใช้เวลาในการทำความเข้าใจตัวเองก่อนที่จะก้าวต่อไป`,
    },
    rdd_them: {
      upright: `ไพ่ ${cardName} ในตำแหน่ง "สถานะของอีกฝ่าย" แสดงว่าพวกเขากำลังอยู่ในช่วงที่มีพลังงานและทัศนคติที่ดีต่อความสัมพันธ์ พวกเขาเปิดใจและพร้อมที่จะลงทุนในความสัมพันธ์`,
      reversed: `ไพ่ ${cardName} กลับหัวในตำแหน่ง "สถานะของอีกฝ่าย" บ่งบอกว่าพวกเขาอาจกำลังเผชิญกับความท้าทายภายในหรือไม่แน่ใจในทิศทางของความสัมพันธ์ ควรให้เวลาและความเข้าใจแก่กัน`,
    },
    rdd_connection: {
      upright: `ไพ่ ${cardName} ในตำแหน่ง "พลังเชื่อมโยง" สะท้อนถึงพื้นฐานที่แข็งแกร่งและมีคุณภาพของความสัมพันธ์ การเชื่อมโยงระหว่างคุณทั้งสองมีพลังงานเชิงบวกที่สนับสนุนการเติบโตร่วมกัน`,
      reversed: `ไพ่ ${cardName} กลับหัวในตำแหน่ง "พลังเชื่อมโยง" บ่งบอกว่าอาจมีอุปสรรคหรือความไม่เข้าใจกันในพื้นฐานของความสัมพันธ์ การสื่อสารที่ดีขึ้นจะช่วยแก้ไขปัญหานี้ได้`,
    },
    rdd_your_feelings: {
      upright: `ไพ่ ${cardName} ในตำแหน่ง "ความรู้สึกของคุณ" เปิดเผยอารมณ์และความรู้สึกที่แท้จริงในใจคุณ คุณมีความรู้สึกที่ชัดเจนและสมดุล ซึ่งเป็นพื้นฐานที่ดีสำหรับความสัมพันธ์`,
      reversed: `ไพ่ ${cardName} กลับหัวในตำแหน่ง "ความรู้สึกของคุณ" บ่งบอกว่าคุณอาจกำลังกดทับหรือปฏิเสธความรู้สึกบางอย่าง การยอมรับและเผชิญหน้ากับความรู้สึกที่แท้จริงจะช่วยให้ความสัมพันธ์ดีขึ้น`,
    },
    rdd_their_feelings: {
      upright: `ไพ่ ${cardName} ในตำแหน่ง "ความรู้สึกของอีกฝ่าย" สะท้อนว่าพวกเขามีความรู้สึกที่เปิดเผยและจริงใจต่อคุณ ความรู้สึกนี้เป็นพื้นฐานที่ดีสำหรับการพัฒนาความสัมพันธ์`,
      reversed: `ไพ่ ${cardName} กลับหัวในตำแหน่ง "ความรู้สึกของอีกฝ่าย" อาจหมายความว่าพวกเขากำลังมีความสับสนหรือไม่แน่ใจในความรู้สึกของตัวเอง การให้พื้นที่และเวลาแก่กันจะช่วยได้`,
    },
    rdd_challenges: {
      upright: `ไพ่ ${cardName} ในตำแหน่ง "ความท้าทาย" ชี้ให้เห็นพื้นที่ที่ต้องการความเข้าใจและการทำงานร่วมกัน ความท้าทายนี้เป็นโอกาสในการเติบโตและเรียนรู้ร่วมกัน`,
      reversed: `ไพ่ ${cardName} กลับหัวในตำแหน่ง "ความท้าทาย" บ่งบอกว่าความท้าทายนี้อาจซับซ้อนหรือซ่อนอยู่ใต้ผิวเผิน การสื่อสารอย่างเปิดเผยและจริงใจจะช่วยแก้ไขปัญหา`,
    },
    rdd_future_potential: {
      upright: `ไพ่ ${cardName} ในตำแหน่ง "ศักยภาพในอนาคต" ชี้ให้เห็นทิศทางที่สดใสและมีศักยภาพของความสัมพันธ์ หากคุณทั้งสองพร้อมลงทุนและเติบโตร่วมกัน อนาคตมีความหวังมาก`,
      reversed: `ไพ่ ${cardName} กลับหัวในตำแหน่ง "ศักยภาพในอนาคต" บ่งบอกว่าอาจมีอุปสรรคหรือความไม่แน่นอนในอนาคต แต่ไม่ได้หมายความว่าไม่มีหวัง — จงเผชิญหน้ากับความท้าทายด้วยกัน`,
    },
  };

  return isReversed ? interpretations[position].reversed : interpretations[position].upright;
}
