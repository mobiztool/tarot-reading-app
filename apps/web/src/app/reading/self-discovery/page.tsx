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

// Self Discovery 5 Position Type
type SelfDiscoveryPosition = 
  | 'sd_core_self' | 'sd_strengths' | 'sd_challenges' 
  | 'sd_hidden_potential' | 'sd_path_forward';

// Self Discovery 5 Position Labels (Psychology-focused)
const SELF_DISCOVERY_POSITIONS: SelfDiscoveryPosition[] = [
  'sd_core_self',
  'sd_strengths',
  'sd_challenges',
  'sd_hidden_potential',
  'sd_path_forward',
];

const POSITION_LABELS: Record<SelfDiscoveryPosition, { 
  th: string; 
  en: string; 
  emoji: string; 
  color: string; 
  shortTh: string;
  description: string;
  psychologyNote: string;
}> = {
  sd_core_self: { 
    th: 'ตัวตนแท้จริง', 
    en: 'Core Self', 
    emoji: '🪷', 
    color: 'from-violet-500 to-purple-600',
    shortTh: 'ตัวตน',
    description: 'ใครคือตัวตนที่แท้จริงของคุณในตอนนี้',
    psychologyNote: 'สะท้อนคุณค่าแกนกลาง ความเชื่อ และอัตลักษณ์ที่กำหนดตัวตนปัจจุบันของคุณ',
  },
  sd_strengths: { 
    th: 'จุดแข็ง', 
    en: 'Strengths', 
    emoji: '💪', 
    color: 'from-emerald-500 to-teal-600',
    shortTh: 'แข็ง',
    description: 'พลังและความสามารถที่เป็นแรงขับเคลื่อนคุณ',
    psychologyNote: 'ทรัพยากรภายในที่คุณสามารถพึ่งพาได้ในยามเผชิญความท้าทาย',
  },
  sd_challenges: { 
    th: 'ความท้าทาย', 
    en: 'Challenges', 
    emoji: '🔗', 
    color: 'from-amber-500 to-orange-600',
    shortTh: 'ท้าทาย',
    description: 'สิ่งที่อาจขัดขวางการเติบโตของคุณ',
    psychologyNote: 'รูปแบบพฤติกรรมหรือความเชื่อจำกัดที่ต้องการความตระหนักรู้',
  },
  sd_hidden_potential: { 
    th: 'ศักยภาพซ่อนเร้น', 
    en: 'Hidden Potential', 
    emoji: '✨', 
    color: 'from-pink-500 to-rose-600',
    shortTh: 'ศักยภาพ',
    description: 'พรสวรรค์และความสามารถที่ยังไม่ถูกค้นพบ',
    psychologyNote: 'ด้านของตัวตนที่รอการพัฒนาและแสดงออก',
  },
  sd_path_forward: { 
    th: 'เส้นทางข้างหน้า', 
    en: 'Path Forward', 
    emoji: '🌱', 
    color: 'from-cyan-500 to-blue-600',
    shortTh: 'เส้นทาง',
    description: 'ขั้นตอนถัดไปในการเติบโตส่วนบุคคล',
    psychologyNote: 'ทิศทางที่แนะนำสำหรับการพัฒนาตนเองและการเปลี่ยนแปลง',
  },
};

// Sample introspective questions
const SELF_DISCOVERY_QUESTIONS = [
  'ฉันต้องการเข้าใจตัวเองมากขึ้นในเรื่องใด?',
  'อะไรคือสิ่งที่ขัดขวางการเติบโตของฉัน?',
  'ฉันมีศักยภาพอะไรที่ยังไม่ได้ใช้?',
  'ทำอย่างไรให้เป็นตัวเองมากขึ้น?',
  'เป้าหมายการพัฒนาตัวเองของฉันคืออะไร?',
];

export default function SelfDiscoveryReadingPage() {
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
        const response = await fetch('/api/access-check?spread=self_discovery');
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
    trackReadingStarted?.('self_discovery', !!question);
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

    if (newSelectedIndices.length < 5) {
      setSelectionStep(newSelectedIndices.length);
    } else {
      // All 5 cards selected, start reading after brief delay
      setTimeout(() => {
        startReading('self-discovery', question || undefined);
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
    if (allRevealed && drawnCards.length === 5 && !hasSavedRef.current && user) {
      hasSavedRef.current = true;
      saveReading('self_discovery', drawnCards, question || undefined).then((result) => {
        if (result) {
          setIsSaved(true);
          // Track spread completed
          const duration = startTime ? Math.round((Date.now() - startTime) / 1000) : 0;
          trackReadingCompleted?.('self_discovery', result.id, duration);
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
    const spreadInfo = SPREAD_INFO.self_discovery;
    return (
      <PremiumGate
        spreadName="self-discovery"
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

  // Selection mode - Show CardFan for 5 card selection
  if (isSelecting) {
    const currentPosition = SELF_DISCOVERY_POSITIONS[selectionStep];
    const posInfo = POSITION_LABELS[currentPosition];

    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-violet-950/20 to-slate-900 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header with current position */}
          <div className="text-center mb-4">
            <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-purple-300 mb-2">
              เลือกไพ่ใบที่ {selectionStep + 1}/5
            </h2>
            <div className={`inline-block px-6 py-2 rounded-full bg-gradient-to-r ${posInfo.color} text-white font-medium text-lg mb-2`}>
              {posInfo.emoji} {posInfo.th}
            </div>
            <p className="text-slate-400 text-sm">{posInfo.description}</p>
          </div>

          {/* Question reminder */}
          {question && (
            <div className="text-center mb-4">
              <p className="text-violet-400 text-sm italic">&ldquo;{question}&rdquo;</p>
            </div>
          )}

          {/* Progress Indicator */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {SELF_DISCOVERY_POSITIONS.map((pos, idx) => {
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
            disabled={selectedFanIndices.length === 5}
          />

          {/* Selected cards preview */}
          {selectedFanIndices.length > 0 && (
            <div className="mt-6">
              <p className="text-center text-slate-500 text-sm mb-3">ไพ่ที่เลือกแล้ว: {selectedFanIndices.length}/5</p>
              <div className="flex flex-wrap justify-center gap-2">
                {SELF_DISCOVERY_POSITIONS.map((pos, idx) => (
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
          {selectedFanIndices.length === 5 && (
            <div className="text-center mt-6 animate-pulse">
              <span className="text-violet-400 text-lg font-medium">
                ✨ กำลังเตรียมการเดินทางสู่ตัวตนของคุณ...
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
              disabled={selectedFanIndices.length === 5}
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
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-violet-950/20 to-slate-900 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-violet-400 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-violet-500/30">
              <span className="text-4xl">🔍</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-purple-300 mb-4">
              ค้นพบตัวเอง
            </h1>
            <p className="text-slate-400 text-lg">Self Discovery Spread • 5 ไพ่ • การเดินทางสู่ภายใน</p>
            <div className="mt-4 inline-block px-4 py-1 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full text-white text-sm font-medium">
              ✨ Pro Feature
            </div>
          </div>

          {/* Psychology-focused Description */}
          <div className="bg-slate-800/50 border border-violet-500/30 rounded-2xl p-6 mb-8">
            <h2 className="text-lg font-semibold text-violet-300 mb-3">🧠 เกี่ยวกับ Self Discovery Spread</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              การอ่านไพ่แบบนี้ออกแบบมาเพื่อช่วยคุณสำรวจตัวตนภายในอย่างลึกซึ้ง 
              ผ่านกระบวนการใคร่ครวญและสะท้อนตนเอง เหมาะสำหรับผู้ที่ต้องการเข้าใจตัวเอง 
              ค้นพบศักยภาพที่ซ่อนอยู่ และวางแผนการเติบโตส่วนบุคคล
            </p>
            
            {/* Psychology concepts */}
            <div className="bg-violet-900/20 border border-violet-500/20 rounded-xl p-4 mb-4">
              <h3 className="text-sm font-medium text-violet-300 mb-2">🌱 หลักการ Self-Discovery</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="text-violet-400">•</span>
                  <span>การตระหนักรู้ตนเอง (Self-Awareness) คือพื้นฐานของการเติบโต</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-400">•</span>
                  <span>ทุกคนมีทั้งจุดแข็งและความท้าทายที่ต้องยอมรับ</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-400">•</span>
                  <span>การเปลี่ยนแปลงเริ่มต้นจากการเข้าใจสถานะปัจจุบัน</span>
                </li>
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2 text-slate-400">
                <span>⏱️</span> ~5 นาที
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <span>🎴</span> 5 ไพ่
              </div>
            </div>
          </div>

          {/* 5 Positions Preview */}
          <div className="bg-violet-900/20 border border-violet-500/30 rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-violet-300 mb-4 flex items-center">
              <span className="mr-2">🗺️</span>
              ตำแหน่งไพ่ทั้ง 5
            </h3>
            <div className="space-y-3">
              {SELF_DISCOVERY_POSITIONS.map((pos) => {
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
            <label htmlFor="question" className="block text-violet-300 font-medium mb-3">
              คำถามสำหรับการใคร่ครวญ <span className="text-slate-500">(ไม่จำเป็น)</span>
            </label>
            <textarea
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="เช่น ฉันต้องการเข้าใจตัวเองมากขึ้นในเรื่องใด?"
              className="w-full bg-slate-900/50 border border-slate-600/50 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 resize-none"
              rows={3}
              maxLength={500}
            />
            <p className="text-right text-slate-500 text-sm mt-2">{question.length}/500</p>
          </div>

          {/* Sample Questions */}
          <div className="mb-8">
            <p className="text-slate-500 text-sm mb-3">💡 ตัวอย่างคำถาม:</p>
            <div className="flex flex-wrap gap-2">
              {SELF_DISCOVERY_QUESTIONS.map((sample) => (
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
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 text-white font-semibold rounded-xl shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 transition-all duration-300 hover:-translate-y-1"
            >
              <span className="text-xl mr-3">🔍</span>
              เริ่มการเดินทางสู่ตัวเอง
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
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-violet-950/20 to-slate-900 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="flex justify-center gap-3 mb-8 flex-wrap max-w-md">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-14 h-20 bg-gradient-to-br from-violet-500 to-purple-500 rounded-lg animate-pulse shadow-lg"
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </div>
          <h2 className="text-2xl font-bold text-violet-300 mb-2">
            {readingState === 'shuffling' ? 'กำลังเตรียมการเดินทาง...' : 'กำลังจั่วไพ่ 5 ใบ...'}
          </h2>
          <p className="text-slate-400">หายใจลึกๆ และเปิดใจรับข้อความ</p>
        </div>
      </div>
    );
  }

  // Revealing state - Show cards to flip sequentially
  if (readingState === 'revealing' && !allRevealed) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-violet-950/20 to-slate-900 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-violet-300 mb-2">เปิดเผยตัวตนของคุณ</h2>
          <p className="text-slate-400 mb-4">คลิกที่ไพ่ใบที่ {nextCardToReveal + 1} เพื่อเปิด</p>
          
          {/* Skip Animation Button */}
          <button
            onClick={revealAllCards}
            className="mb-8 px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-400 hover:text-slate-200 text-sm rounded-lg transition-colors border border-slate-600/50"
          >
            ⏩ ข้ามไปผลลัพธ์
          </button>

          {/* 5 Cards Layout - Diamond/Path formation */}
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 mb-8">
            {drawnCards.map((drawnCard, index) => {
              const pos = SELF_DISCOVERY_POSITIONS[index];
              const posInfo = POSITION_LABELS[pos];
              const isRevealed = revealedCards[index];
              const canReveal = index === nextCardToReveal;

              return (
                <div key={index} className="flex flex-col items-center">
                  {/* Position Label */}
                  <div
                    className={`mb-3 px-4 py-1 rounded-full bg-gradient-to-r ${posInfo.color} text-white text-sm font-medium`}
                  >
                    {posInfo.emoji} {posInfo.th}
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
                        ${canReveal ? 'cursor-pointer animate-pulse ring-2 ring-violet-400 ring-offset-2 ring-offset-slate-900' : ''}
                        ${!canReveal && !isRevealed ? 'opacity-50' : ''}
                      `}
                    />
                    {canReveal && !isRevealed && (
                      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-violet-400 text-xs animate-bounce whitespace-nowrap">
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
            เปิดแล้ว {revealedCards.filter((r) => r).length} / 5 ใบ
          </div>
        </div>
      </div>
    );
  }

  // Complete state - Show all revealed cards and interpretation
  if ((readingState === 'revealing' || readingState === 'complete') && allRevealed) {
    const selectedCard = selectedCardIndex !== null ? drawnCards[selectedCardIndex] : null;

    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-violet-950/20 to-slate-900 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Question display */}
          {question && (
            <div className="text-center mb-6">
              <p className="text-slate-500 text-sm mb-1">คำถามใคร่ครวญ:</p>
              <p className="text-violet-300 text-lg italic">&ldquo;{question}&rdquo;</p>
            </div>
          )}

          {/* All 5 Cards Grid */}
          <div className="grid grid-cols-5 gap-2 md:gap-4 mb-8">
            {drawnCards.map((drawnCard, index) => {
              const pos = SELF_DISCOVERY_POSITIONS[index];
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
                      isSelected ? 'ring-2 ring-violet-400 ring-offset-2 ring-offset-slate-900' : ''
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
                  className={`inline-block px-4 py-1 rounded-full bg-gradient-to-r ${POSITION_LABELS[SELF_DISCOVERY_POSITIONS[selectedCardIndex]].color} text-white text-sm font-medium mb-4`}
                >
                  {POSITION_LABELS[SELF_DISCOVERY_POSITIONS[selectedCardIndex]].emoji}{' '}
                  {POSITION_LABELS[SELF_DISCOVERY_POSITIONS[selectedCardIndex]].th}
                </div>

                <h2 className="text-2xl md:text-3xl font-bold font-card text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-purple-300 mb-1">
                  {selectedCard.card.nameTh}
                </h2>
                <p className="text-violet-400 font-card">{selectedCard.card.name}</p>
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
                    className="px-3 py-1 bg-violet-900/50 text-violet-300 rounded-full text-sm"
                  >
                    {keyword}
                  </span>
                ))}
              </div>

              {/* Psychology-focused Position Interpretation */}
              <div className="bg-violet-900/20 border border-violet-500/20 rounded-xl p-4 mb-4">
                <h3 className="text-base font-bold text-violet-300 mb-2">
                  🧠 ในตำแหน่ง &quot;{POSITION_LABELS[SELF_DISCOVERY_POSITIONS[selectedCardIndex]].th}&quot;
                </h3>
                <p className="text-slate-300 text-sm italic mb-2">
                  {POSITION_LABELS[SELF_DISCOVERY_POSITIONS[selectedCardIndex]].psychologyNote}
                </p>
                <p className="text-slate-200 leading-relaxed">
                  {getIntrospectiveInterpretation(
                    selectedCard.card.nameTh, 
                    selectedCard.isReversed, 
                    SELF_DISCOVERY_POSITIONS[selectedCardIndex]
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
                      <h3 className="text-base font-bold text-purple-300 mb-2">🔮 ข้อความสำหรับคุณ</h3>
                      <p className="text-slate-200 leading-relaxed text-sm">
                        {detailedMeaning.prediction}
                      </p>
                    </div>

                    <div className="bg-teal-900/20 border border-teal-500/20 rounded-xl p-4">
                      <h3 className="text-base font-bold text-teal-300 mb-2">💡 คำแนะนำสำหรับการเติบโต</h3>
                      <p className="text-slate-200 leading-relaxed text-sm">
                        {detailedMeaning.advice}
                      </p>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Journaling Prompt Section */}
          <div className="bg-gradient-to-br from-violet-900/30 to-purple-900/30 border border-violet-500/30 rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-bold text-violet-300 mb-4 flex items-center gap-2">
              <span className="text-2xl">📝</span>
              คำถามสำหรับการจดบันทึก
            </h2>
            <p className="text-slate-400 text-sm mb-4">
              ลองใช้คำถามเหล่านี้เพื่อสะท้อนตนเองหลังการอ่านไพ่:
            </p>
            <ul className="space-y-3">
              {getJournalingPrompts(drawnCards).map((prompt, i) => (
                <li key={i} className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-xl">
                  <span className="text-violet-400 font-bold">{i + 1}.</span>
                  <span className="text-slate-200">{prompt}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Self-Discovery Summary */}
          <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-bold text-purple-300 mb-4 flex items-center gap-2">
              <span className="text-2xl">🌱</span>
              สรุปการเดินทางสู่ตัวเอง
            </h2>
            <div className="space-y-4 text-slate-300 leading-relaxed">
              <p>
                จากการอ่านไพ่ครั้งนี้ <span className="text-violet-300 font-medium">{drawnCards[0]?.card.nameTh}</span>{drawnCards[0]?.isReversed && ' (กลับหัว)'} 
                สะท้อนตัวตนแท้จริงของคุณในปัจจุบัน ในขณะที่จุดแข็งของคุณอยู่ที่พลังงานของ{' '}
                <span className="text-emerald-300 font-medium">{drawnCards[1]?.card.nameTh}</span>{drawnCards[1]?.isReversed && ' (กลับหัว)'}
              </p>
              <p>
                ความท้าทายที่คุณต้องตระหนักคือ <span className="text-amber-300 font-medium">{drawnCards[2]?.card.nameTh}</span>{drawnCards[2]?.isReversed && ' (กลับหัว)'} 
                — จงใช้เป็นโอกาสในการเรียนรู้และเติบโต
              </p>
              <p>
                ศักยภาพที่ซ่อนอยู่ใน <span className="text-pink-300 font-medium">{drawnCards[3]?.card.nameTh}</span>{drawnCards[3]?.isReversed && ' (กลับหัว)'} 
                กำลังรอให้คุณค้นพบและพัฒนา
              </p>
              <p className="text-lg">
                เส้นทางข้างหน้าของคุณมุ่งหน้าสู่ <span className="text-cyan-300 font-bold">{drawnCards[4]?.card.nameTh}</span>{drawnCards[4]?.isReversed && ' (กลับหัว)'} 
                — จงเชื่อมั่นในกระบวนการเติบโตและก้าวต่อไปด้วยความตระหนักรู้
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
                <span className="text-violet-400 text-sm animate-pulse">💾 กำลังบันทึก...</span>
              ) : isSaved ? (
                <span className="text-green-400 text-sm">✅ บันทึกแล้ว</span>
              ) : null}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={handleReset}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-medium rounded-xl transition-all duration-300"
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

// Helper function: Generate introspective interpretation for self-discovery
function getIntrospectiveInterpretation(
  cardName: string,
  isReversed: boolean,
  position: SelfDiscoveryPosition
): string {
  const interpretations: Record<SelfDiscoveryPosition, { upright: string; reversed: string }> = {
    sd_core_self: {
      upright: `ไพ่ ${cardName} ในตำแหน่ง "ตัวตนแท้จริง" สะท้อนว่าคุณกำลังเชื่อมต่อกับแก่นแท้ของตัวเองได้ดี คุณมีความชัดเจนในคุณค่าและเป้าหมายชีวิต พลังงานนี้กำลังนำทางคุณไปสู่ความเข้าใจตนเองที่ลึกซึ้งยิ่งขึ้น`,
      reversed: `ไพ่ ${cardName} กลับหัวในตำแหน่ง "ตัวตนแท้จริง" บ่งบอกว่าคุณอาจกำลังค้นหาตัวตนหรือสูญเสียการเชื่อมต่อกับแก่นแท้ของตัวเอง นี่เป็นช่วงเวลาที่ดีในการหยุดและไตร่ตรองว่าคุณต้องการเป็นใครจริงๆ`,
    },
    sd_strengths: {
      upright: `ไพ่ ${cardName} ในตำแหน่ง "จุดแข็ง" ชี้ให้เห็นทรัพยากรภายในที่ทรงพลังของคุณ คุณมีความสามารถนี้อยู่แล้ว — จงเชื่อมั่นและใช้มันเพื่อรับมือกับความท้าทาย นี่คือแสงสว่างที่นำทางคุณ`,
      reversed: `ไพ่ ${cardName} กลับหัวในตำแหน่ง "จุดแข็ง" เตือนว่าคุณอาจไม่ได้ใช้จุดแข็งนี้อย่างเต็มที่ หรืออาจใช้มันในทางที่ไม่สมดุล ลองพิจารณาว่าจะนำพลังนี้กลับมาใช้อย่างสร้างสรรค์ได้อย่างไร`,
    },
    sd_challenges: {
      upright: `ไพ่ ${cardName} ในตำแหน่ง "ความท้าทาย" ไม่ได้หมายความว่านี่คือปัญหา แต่เป็นพื้นที่ที่ต้องการความตระหนักรู้ รูปแบบหรือความเชื่อนี้กำลังขอให้คุณเติบโตผ่านมัน`,
      reversed: `ไพ่ ${cardName} กลับหัวในตำแหน่ง "ความท้าทาย" บ่งบอกว่าความท้าทายนี้อาจซ่อนอยู่ในจิตใต้สำนึกหรือถูกปฏิเสธ การยอมรับและเผชิญหน้าจะเป็นก้าวสำคัญสู่การเติบโต`,
    },
    sd_hidden_potential: {
      upright: `ไพ่ ${cardName} ในตำแหน่ง "ศักยภาพซ่อนเร้น" เปิดเผยพรสวรรค์ที่คุณอาจไม่รู้ตัว พลังงานนี้กำลังรอให้คุณค้นพบและพัฒนา ลองเปิดใจสำรวจด้านนี้ของตัวเองมากขึ้น`,
      reversed: `ไพ่ ${cardName} กลับหัวในตำแหน่ง "ศักยภาพซ่อนเร้น" เตือนว่าศักยภาพนี้อาจถูกกดทับหรือกลัวที่จะแสดงออก ความกลัวหรือความไม่มั่นใจอาจปิดกั้นอยู่ — จงกล้าที่จะเติบโต`,
    },
    sd_path_forward: {
      upright: `ไพ่ ${cardName} ในตำแหน่ง "เส้นทางข้างหน้า" ชี้ทิศทางการเติบโตที่แนะนำ พลังงานนี้จะเป็นกุญแจสำคัญในขั้นตอนต่อไปของคุณ จงก้าวเดินด้วยความมั่นใจและเปิดใจ`,
      reversed: `ไพ่ ${cardName} กลับหัวในตำแหน่ง "เส้นทางข้างหน้า" บ่งบอกว่าอาจมีอุปสรรคหรือการต่อต้านในเส้นทางนี้ แต่จงอย่าท้อแท้ — บางครั้งทางอ้อมก็นำไปสู่การเติบโตที่ลึกซึ้งกว่า`,
    },
  };

  return isReversed ? interpretations[position].reversed : interpretations[position].upright;
}

// Helper function: Generate journaling prompts based on drawn cards
function getJournalingPrompts(drawnCards: { card: { nameTh: string }; isReversed: boolean }[]): string[] {
  return [
    `ไพ่ "${drawnCards[0]?.card.nameTh}" บอกอะไรเกี่ยวกับตัวตนปัจจุบันของฉัน? ฉันรู้สึกอย่างไรกับสิ่งที่เห็น?`,
    `จุดแข็งที่ไพ่ "${drawnCards[1]?.card.nameTh}" สะท้อน ฉันใช้มันในชีวิตประจำวันอย่างไรบ้าง?`,
    `ความท้าทายจาก "${drawnCards[2]?.card.nameTh}" — ฉันจะเปลี่ยนมันเป็นโอกาสเรียนรู้ได้อย่างไร?`,
    `ศักยภาพที่ซ่อนอยู่ใน "${drawnCards[3]?.card.nameTh}" — ฉันจะเริ่มค้นหาและพัฒนามันได้อย่างไร?`,
    `เส้นทางข้างหน้าสู่ "${drawnCards[4]?.card.nameTh}" — ขั้นตอนแรกที่ฉันสามารถทำได้วันนี้คืออะไร?`,
  ];
}
