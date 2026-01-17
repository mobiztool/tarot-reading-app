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

// Friendship Reading 4 Position Type
type FriendshipPosition =
  | 'fr_foundation'
  | 'fr_challenges'
  | 'fr_strength'
  | 'fr_future';

// Friendship positions in order
const FRIENDSHIP_POSITIONS: FriendshipPosition[] = [
  'fr_foundation',
  'fr_challenges',
  'fr_strength',
  'fr_future',
];

// Position information for display
const POSITION_INFO: Record<
  FriendshipPosition,
  {
    th: string;
    en: string;
    emoji: string;
    color: string;
    shortTh: string;
    description: string;
    focusAreas: string;
  }
> = {
  fr_foundation: {
    th: 'รากฐานมิตรภาพ',
    en: 'Foundation',
    emoji: '🏠',
    color: 'from-amber-500 to-orange-600',
    shortTh: 'รากฐาน',
    description: 'พื้นฐานและจุดเริ่มต้นของมิตรภาพนี้',
    focusAreas: 'ความไว้วางใจ • ค่านิยมร่วม • จุดเชื่อมโยง',
  },
  fr_challenges: {
    th: 'ความท้าทาย',
    en: 'Challenges',
    emoji: '⚡',
    color: 'from-red-500 to-rose-600',
    shortTh: 'ท้าทาย',
    description: 'ความท้าทายและอุปสรรคในมิตรภาพ',
    focusAreas: 'ความขัดแย้ง • ความเข้าใจผิด • จุดที่ต้องปรับปรุง',
  },
  fr_strength: {
    th: 'จุดแข็ง',
    en: 'Strength',
    emoji: '💪',
    color: 'from-emerald-500 to-green-600',
    shortTh: 'จุดแข็ง',
    description: 'สิ่งที่ทำให้มิตรภาพนี้แข็งแกร่ง',
    focusAreas: 'ความเข้าใจ • การสนับสนุน • ความภักดี',
  },
  fr_future: {
    th: 'อนาคต',
    en: 'Future',
    emoji: '🌟',
    color: 'from-purple-500 to-violet-600',
    shortTh: 'อนาคต',
    description: 'ทิศทางของมิตรภาพในอนาคต',
    focusAreas: 'โอกาส • การเติบโต • ความเป็นไปได้',
  },
};

// Sample questions
const FRIENDSHIP_QUESTIONS = [
  'มิตรภาพของเรามีอนาคตเป็นอย่างไร?',
  'ฉันจะเสริมสร้างความสัมพันธ์กับเพื่อนได้อย่างไร?',
  'อะไรคืออุปสรรคในมิตรภาพของเรา?',
  'เพื่อนคนนี้เหมาะกับฉันไหม?',
  'ฉันควรทำอย่างไรกับความขัดแย้งนี้?',
];

export default function FriendshipReadingPage(): React.JSX.Element | null {
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
        const response = await fetch('/api/access-check?spread=friendship');
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

  // Start selection mode
  const handleStartSelection = (): void => {
    trackReadingStarted?.('friendship', !!question);
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
      setTimeout(() => {
        startReading('friendship' as Parameters<typeof startReading>[0], question || undefined);
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
      saveReading('friendship' as Parameters<typeof saveReading>[0], drawnCards, question || undefined).then((result) => {
        if (result) {
          setIsSaved(true);
          const duration = startTime ? Math.round((Date.now() - startTime) / 1000) : 0;
          trackReadingCompleted?.('friendship', result.id, duration);
        }
      });
    }
  }, [allRevealed, drawnCards, question, saveReading, user, startTime, trackReadingCompleted]);

  // Loading states
  if (isLoadingAuth || !accessCheck.checked) {
    return <PageLoader message="กำลังตรวจสอบสิทธิ์..." />;
  }

  // VIP gate
  if (!accessCheck.allowed) {
    const spreadInfo = SPREAD_INFO.friendship;
    return (
      <PremiumGate
        spreadName="friendship"
        spreadNameTh={spreadInfo.nameTh}
        spreadIcon={spreadInfo.icon}
        requiredTier="vip"
        currentTier={accessCheck.currentTier}
      />
    );
  }

  if (isLoadingCards) {
    return <PageLoader message="กำลังโหลดไพ่..." />;
  }

  // Selection mode
  if (isSelecting) {
    const currentPosition = FRIENDSHIP_POSITIONS[selectionStep];
    const posInfo = POSITION_INFO[currentPosition];

    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-amber-950/20 to-slate-950 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-4">
            <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-300 mb-2">
              เลือกไพ่ใบที่ {selectionStep + 1}/4
            </h2>
            <div className={`inline-block px-6 py-2 rounded-full bg-gradient-to-r ${posInfo.color} text-white font-medium text-lg mb-2`}>
              {posInfo.emoji} {posInfo.th}
            </div>
            <p className="text-slate-400 text-sm">{posInfo.description}</p>
          </div>

          {question && (
            <div className="text-center mb-4">
              <p className="text-amber-400 text-sm italic">&ldquo;{question}&rdquo;</p>
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {FRIENDSHIP_POSITIONS.map((pos, idx) => {
              const info = POSITION_INFO[pos];
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

          <CardFan cardCount={22} onSelectCard={handleSelectFromFan} selectedIndex={selectedFanIndices[selectionStep] ?? null} disabled={selectedFanIndices.length === 4} />

          {selectedFanIndices.length > 0 && (
            <div className="mt-6">
              <p className="text-center text-slate-500 text-sm mb-3">ไพ่ที่เลือกแล้ว: {selectedFanIndices.length}/4</p>
              <div className="flex justify-center gap-2">
                {FRIENDSHIP_POSITIONS.map((pos, idx) => (
                  <div
                    key={pos}
                    className={`w-12 h-16 rounded-lg flex items-center justify-center transition-all duration-300 ${
                      idx < selectedFanIndices.length ? `bg-gradient-to-br ${POSITION_INFO[pos].color} shadow-lg` : 'bg-slate-800/50 border-2 border-dashed border-slate-600'
                    }`}
                  >
                    {idx < selectedFanIndices.length ? <span className="text-white text-sm">✓</span> : <span className="text-slate-600 text-xs">{idx + 1}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedFanIndices.length === 4 && (
            <div className="text-center mt-6 animate-pulse">
              <span className="text-amber-400 text-lg font-medium">🤝 กำลังเปิดเผยมิตรภาพ...</span>
            </div>
          )}

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

  // Idle state
  if (readingState === 'idle') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-amber-950/20 to-slate-950 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/20">
              <span className="text-4xl">🤝</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-300 mb-4">
              ดูดวงมิตรภาพ
            </h1>
            <p className="text-slate-400 text-lg">Friendship Reading • 4 ไพ่ • ความสัมพันธ์เพื่อน</p>
            <div className="mt-4 inline-block px-4 py-1 bg-gradient-to-r from-amber-600 to-orange-600 rounded-full text-white text-sm font-medium">
              👑 VIP Exclusive
            </div>
          </div>

          <div className="bg-slate-800/50 border border-amber-500/30 rounded-2xl p-6 mb-8">
            <h2 className="text-lg font-semibold text-amber-300 mb-3">🤝 เกี่ยวกับการดูดวงมิตรภาพ</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              การดูดวงมิตรภาพช่วยให้คุณเข้าใจความสัมพันธ์กับเพื่อนอย่างลึกซึ้ง ไม่ว่าจะเป็นเพื่อนเก่าหรือเพื่อนใหม่ ไพ่จะเผยให้เห็นรากฐาน ความท้าทาย จุดแข็ง และอนาคตของมิตรภาพ
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

          <div className="bg-amber-900/20 border border-amber-500/30 rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-amber-300 mb-4 flex items-center">
              <span className="mr-2">🗺️</span>
              ตำแหน่งไพ่ทั้ง 4
            </h3>
            <div className="space-y-3">
              {FRIENDSHIP_POSITIONS.map((pos) => {
                const info = POSITION_INFO[pos];
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

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 mb-8">
            <label htmlFor="question" className="block text-amber-300 font-medium mb-3">
              คำถามเกี่ยวกับมิตรภาพ <span className="text-slate-500">(ไม่จำเป็น)</span>
            </label>
            <textarea
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="เช่น มิตรภาพของเราจะเป็นอย่างไรในอนาคต?"
              className="w-full bg-slate-900/50 border border-slate-600/50 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 resize-none"
              rows={3}
              maxLength={500}
            />
            <p className="text-right text-slate-500 text-sm mt-2">{question.length}/500</p>
          </div>

          <div className="mb-8">
            <p className="text-slate-500 text-sm mb-3">💡 ตัวอย่างคำถาม:</p>
            <div className="flex flex-wrap gap-2">
              {FRIENDSHIP_QUESTIONS.map((sample) => (
                <button key={sample} onClick={() => setQuestion(sample)} className="text-sm bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-300 px-3 py-1.5 rounded-full transition-colors">
                  {sample}
                </button>
              ))}
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={handleStartSelection}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all duration-300 hover:-translate-y-1"
            >
              <span className="text-xl mr-3">🤝</span>
              เริ่มดูดวงมิตรภาพ
            </button>
          </div>

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
          <div className="flex justify-center gap-3 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-14 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg animate-pulse shadow-lg" style={{ animationDelay: `${i * 150}ms` }} />
            ))}
          </div>
          <h2 className="text-2xl font-bold text-amber-300 mb-2">{readingState === 'shuffling' ? 'กำลังสับไพ่...' : 'กำลังจั่วไพ่ 4 ใบ...'}</h2>
          <p className="text-slate-400">นึกถึงมิตรภาพที่คุณต้องการเข้าใจ</p>
        </div>
      </div>
    );
  }

  // Revealing state
  if (readingState === 'revealing' && !allRevealed) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-amber-950/20 to-slate-950 py-8 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-amber-300 mb-2">เปิดเผยมิตรภาพของคุณ</h2>
          <p className="text-slate-400 mb-4">คลิกที่ไพ่ใบที่ {nextCardToReveal + 1} เพื่อเปิด</p>

          <button onClick={revealAllCards} className="mb-8 px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-400 hover:text-slate-200 text-sm rounded-lg transition-colors border border-slate-600/50">
            ⏩ ข้ามไปผลลัพธ์
          </button>

          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 mb-8">
            {drawnCards.map((drawnCard, index) => {
              const pos = FRIENDSHIP_POSITIONS[index];
              const posInfo = POSITION_INFO[pos];
              const isRevealed = revealedCards[index];
              const canReveal = index === nextCardToReveal;

              return (
                <div key={index} className="flex flex-col items-center">
                  <div className={`mb-3 px-4 py-1 rounded-full bg-gradient-to-r ${posInfo.color} text-white text-sm font-medium`}>
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
                      className={`${canReveal ? 'cursor-pointer animate-pulse ring-2 ring-amber-400 ring-offset-2 ring-offset-slate-950' : ''} ${!canReveal && !isRevealed ? 'opacity-50' : ''}`}
                    />
                    {canReveal && !isRevealed && (
                      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-amber-400 text-xs animate-bounce whitespace-nowrap">👆 แตะเพื่อเปิด</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-slate-500 text-sm">เปิดแล้ว {revealedCards.filter((r) => r).length} / 4 ใบ</div>
        </div>
      </div>
    );
  }

  // Complete state
  if ((readingState === 'revealing' || readingState === 'complete') && allRevealed) {
    const selectedCard = selectedCardIndex !== null ? drawnCards[selectedCardIndex] : null;

    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-amber-950/20 to-slate-950 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {question && (
            <div className="text-center mb-6">
              <p className="text-slate-500 text-sm mb-1">คำถามเกี่ยวกับมิตรภาพ:</p>
              <p className="text-amber-300 text-lg italic">&ldquo;{question}&rdquo;</p>
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {drawnCards.map((drawnCard, index) => {
              const pos = FRIENDSHIP_POSITIONS[index];
              const posInfo = POSITION_INFO[pos];
              const isSelected = selectedCardIndex === index;

              return (
                <div
                  key={index}
                  className={`flex flex-col items-center cursor-pointer transition-all duration-300 ${isSelected ? 'scale-105' : 'opacity-70 hover:opacity-100'}`}
                  onClick={() => setSelectedCardIndex(index)}
                >
                  <div className={`mb-2 px-3 py-1 rounded-full bg-gradient-to-r ${posInfo.color} text-white text-xs font-medium`}>{posInfo.emoji} {posInfo.shortTh}</div>
                  <TarotCard
                    frontImage={drawnCard.card.imageUrl}
                    cardName={drawnCard.card.name}
                    size="sm"
                    isReversed={drawnCard.isReversed}
                    isFlipped={true}
                    showFlipAnimation={false}
                    className={isSelected ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-slate-950' : ''}
                  />
                  <p className="mt-2 text-xs text-slate-400 text-center max-w-[80px] truncate">{drawnCard.card.nameTh}</p>
                </div>
              );
            })}
          </div>

          {selectedCard && selectedCardIndex !== null && (
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 mb-8">
              <div className="text-center mb-6">
                <div className={`inline-block px-4 py-1 rounded-full bg-gradient-to-r ${POSITION_INFO[FRIENDSHIP_POSITIONS[selectedCardIndex]].color} text-white text-sm font-medium mb-4`}>
                  {POSITION_INFO[FRIENDSHIP_POSITIONS[selectedCardIndex]].emoji} {POSITION_INFO[FRIENDSHIP_POSITIONS[selectedCardIndex]].th}
                </div>
                <h2 className="text-2xl md:text-3xl font-bold font-card text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-300 mb-1">{selectedCard.card.nameTh}</h2>
                <p className="text-amber-400 font-card">{selectedCard.card.name}</p>
                <div className="flex justify-center items-center gap-3 text-sm text-slate-500 mt-2">
                  <span>{selectedCard.card.suit ? SUIT_NAMES[selectedCard.card.suit].th : 'ไพ่ใหญ่'}</span>
                  <span>•</span>
                  <span className={selectedCard.isReversed ? 'text-red-400' : 'text-green-400'}>{selectedCard.isReversed ? '🔄 กลับหัว' : '✨ ตั้งตรง'}</span>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {(selectedCard.isReversed ? selectedCard.card.keywordsReversed || selectedCard.card.keywordsTh || [] : selectedCard.card.keywordsUpright || selectedCard.card.keywordsTh || []).map((keyword, i) => (
                  <span key={i} className="px-3 py-1 bg-amber-900/50 text-amber-300 rounded-full text-sm">
                    {keyword}
                  </span>
                ))}
              </div>

              <div className="bg-amber-900/20 border border-amber-500/20 rounded-xl p-4 mb-4">
                <h3 className="text-base font-bold text-amber-300 mb-2">🤝 ในตำแหน่ง &quot;{POSITION_INFO[FRIENDSHIP_POSITIONS[selectedCardIndex]].th}&quot;</h3>
                <p className="text-slate-300 text-sm italic mb-2">{POSITION_INFO[FRIENDSHIP_POSITIONS[selectedCardIndex]].focusAreas}</p>
                <p className="text-slate-200 leading-relaxed">{getFriendshipInterpretation(selectedCard.card.nameTh, selectedCard.isReversed, FRIENDSHIP_POSITIONS[selectedCardIndex])}</p>
              </div>

              {(() => {
                const detailedMeaning = generateDetailedPrediction(selectedCard.card.slug, selectedCard.isReversed, selectedCard.card.suit, selectedCard.card.number, selectedCard.card.nameTh);
                return (
                  <div className="space-y-4">
                    <div className="bg-purple-900/20 border border-purple-500/20 rounded-xl p-4">
                      <h3 className="text-base font-bold text-purple-300 mb-2">🔮 ข้อความจากไพ่</h3>
                      <p className="text-slate-200 leading-relaxed text-sm">{detailedMeaning.prediction}</p>
                    </div>
                    <div className="bg-emerald-900/20 border border-emerald-500/20 rounded-xl p-4">
                      <h3 className="text-base font-bold text-emerald-300 mb-2">💡 คำแนะนำ</h3>
                      <p className="text-slate-200 leading-relaxed text-sm">{detailedMeaning.advice}</p>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          <div className="bg-gradient-to-br from-amber-900/30 to-orange-900/30 border border-amber-500/30 rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-bold text-amber-300 mb-4 flex items-center gap-2">
              <span className="text-2xl">🤝</span>
              สรุปมิตรภาพของคุณ
            </h2>
            <div className="space-y-3 text-slate-300 leading-relaxed">
              {drawnCards.map((drawnCard, index) => {
                const pos = FRIENDSHIP_POSITIONS[index];
                const posInfo = POSITION_INFO[pos];
                return (
                  <p key={pos}>
                    <span className="font-semibold" style={{ color: index === 0 ? '#fbbf24' : index === 1 ? '#f87171' : index === 2 ? '#34d399' : '#a78bfa' }}>
                      {posInfo.emoji} {posInfo.th}:
                    </span>{' '}
                    <span className="text-slate-200">{drawnCard.card.nameTh}</span>
                    {drawnCard.isReversed && ' (กลับหัว)'}
                  </p>
                );
              })}
            </div>
          </div>

          <div className="text-center mb-8">
            <p className="text-slate-500 text-sm mb-3">คลิกไพ่ด้านบนเพื่อดูรายละเอียดแต่ละตำแหน่ง</p>
          </div>

          {(isSaving || isSaved) && (
            <div className="text-center mb-6">{isSaving ? <span className="text-amber-400 text-sm animate-pulse">💾 กำลังบันทึก...</span> : isSaved ? <span className="text-green-400 text-sm">✅ บันทึกแล้ว</span> : null}</div>
          )}

          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={handleReset} className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-medium rounded-xl transition-all duration-300">
              🔄 ทำใหม่อีกครั้ง
            </button>
            <Link href="/history" className="inline-flex items-center px-6 py-3 bg-slate-700 hover:bg-slate-600 text-slate-300 font-medium rounded-xl transition-colors">
              📜 ดูประวัติ
            </Link>
            <Link href="/" className="inline-flex items-center px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl transition-colors">
              🏠 กลับหน้าแรก
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

// Helper function for position interpretation
function getFriendshipInterpretation(cardName: string, isReversed: boolean, position: FriendshipPosition): string {
  const interpretations: Record<FriendshipPosition, { upright: string; reversed: string }> = {
    fr_foundation: {
      upright: `ไพ่ ${cardName} ในตำแหน่ง "รากฐานมิตรภาพ" บ่งบอกว่ามิตรภาพนี้มีรากฐานที่แข็งแกร่ง สร้างขึ้นจากความไว้วางใจและความเข้าใจซึ่งกันและกัน นี่คือจุดเริ่มต้นที่ดีสำหรับความสัมพันธ์ที่ยั่งยืน`,
      reversed: `ไพ่ ${cardName} กลับหัวในตำแหน่ง "รากฐานมิตรภาพ" ชี้ให้เห็นว่ารากฐานของมิตรภาพอาจต้องการการเสริมสร้าง อาจมีความเข้าใจผิดหรือค่านิยมที่แตกต่างที่ต้องพูดคุยกัน`,
    },
    fr_challenges: {
      upright: `ไพ่ ${cardName} ในตำแหน่ง "ความท้าทาย" แสดงให้เห็นความท้าทายที่มิตรภาพกำลังเผชิญ แต่เป็นความท้าทายที่สามารถก้าวข้ามได้ด้วยการสื่อสารที่ดีและความเข้าใจ`,
      reversed: `ไพ่ ${cardName} กลับหัวในตำแหน่ง "ความท้าทาย" บ่งบอกว่าอาจมีอุปสรรคที่ซ่อนอยู่หรือปัญหาที่ยังไม่ได้รับการแก้ไข ควรพูดคุยอย่างเปิดเผยเพื่อหาทางออกร่วมกัน`,
    },
    fr_strength: {
      upright: `ไพ่ ${cardName} ในตำแหน่ง "จุดแข็ง" เปิดเผยสิ่งที่ทำให้มิตรภาพนี้แข็งแกร่ง นี่คือพลังที่ควรรักษาและเสริมสร้างให้มากขึ้น เพราะมันคือหัวใจของความสัมพันธ์`,
      reversed: `ไพ่ ${cardName} กลับหัวในตำแหน่ง "จุดแข็ง" ชี้ให้เห็นว่าจุดแข็งของมิตรภาพอาจยังไม่ได้รับการใช้อย่างเต็มที่ หรืออาจถูกมองข้ามไป ลองทบทวนสิ่งดีๆ ที่มีร่วมกัน`,
    },
    fr_future: {
      upright: `ไพ่ ${cardName} ในตำแหน่ง "อนาคต" แสดงทิศทางที่มิตรภาพกำลังมุ่งไป มีศักยภาพในการเติบโตและพัฒนาไปด้วยกัน อนาคตของความสัมพันธ์นี้ดูสดใส`,
      reversed: `ไพ่ ${cardName} กลับหัวในตำแหน่ง "อนาคต" บ่งบอกว่าอนาคตของมิตรภาพอาจต้องการความพยายามเพิ่มเติม หรืออาจมีการเปลี่ยนแปลงที่ต้องปรับตัว จงเปิดใจและยืดหยุ่น`,
    },
  };

  return isReversed ? interpretations[position].reversed : interpretations[position].upright;
}
