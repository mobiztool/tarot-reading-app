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

// Financial Abundance 5 Position Type
type FinancialPosition =
  | 'fa_current'
  | 'fa_blocks'
  | 'fa_opportunities'
  | 'fa_action'
  | 'fa_abundance';

// Financial positions in order
const FINANCIAL_POSITIONS: FinancialPosition[] = [
  'fa_current',
  'fa_blocks',
  'fa_opportunities',
  'fa_action',
  'fa_abundance',
];

// Position information for display
const POSITION_INFO: Record<
  FinancialPosition,
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
  fa_current: {
    th: 'สถานะการเงินปัจจุบัน',
    en: 'Current State',
    emoji: '💵',
    color: 'from-green-500 to-emerald-600',
    shortTh: 'ปัจจุบัน',
    description: 'สภาพการเงินและความมั่งคั่งในปัจจุบัน',
    focusAreas: 'รายได้ • รายจ่าย • สถานะ',
  },
  fa_blocks: {
    th: 'อุปสรรคทางการเงิน',
    en: 'Financial Blocks',
    emoji: '🚫',
    color: 'from-red-500 to-rose-600',
    shortTh: 'อุปสรรค',
    description: 'สิ่งที่ขัดขวางความมั่งคั่ง',
    focusAreas: 'ความเชื่อ • นิสัย • ข้อจำกัด',
  },
  fa_opportunities: {
    th: 'โอกาสทางการเงิน',
    en: 'Opportunities',
    emoji: '🌟',
    color: 'from-yellow-500 to-amber-600',
    shortTh: 'โอกาส',
    description: 'โอกาสในการสร้างรายได้และความมั่งคั่ง',
    focusAreas: 'ช่องทาง • ลงทุน • รายได้ใหม่',
  },
  fa_action: {
    th: 'การกระทำที่ต้องทำ',
    en: 'Action Required',
    emoji: '⚡',
    color: 'from-orange-500 to-red-600',
    shortTh: 'การกระทำ',
    description: 'สิ่งที่ต้องทำเพื่อดึงดูดความมั่งคั่ง',
    focusAreas: 'ขั้นตอน • กลยุทธ์ • แผน',
  },
  fa_abundance: {
    th: 'เส้นทางสู่ความมั่งคั่ง',
    en: 'Path to Abundance',
    emoji: '💰',
    color: 'from-emerald-500 to-teal-600',
    shortTh: 'มั่งคั่ง',
    description: 'ภาพอนาคตของความมั่งคั่งและความอุดมสมบูรณ์',
    focusAreas: 'อิสรภาพการเงิน • ความมั่งคั่ง • ความสำเร็จ',
  },
};

// Sample questions
const FINANCIAL_QUESTIONS = [
  'ฉันจะมีเงินมากขึ้นได้อย่างไร?',
  'อะไรขัดขวางความมั่งคั่งของฉัน?',
  'ฉันควรลงทุนอะไรดี?',
  'การเงินของฉันในอนาคตเป็นอย่างไร?',
  'ฉันจะสร้างรายได้เสริมได้อย่างไร?',
];

export default function FinancialAbundanceReadingPage(): React.JSX.Element | null {
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

  const { cards, isLoading: isLoadingCards } = useCards();
  const { readingState, drawnCards, revealedCards, startReading, revealCard, revealAllCards, resetReading } = useTarotReading(cards.length > 0 ? cards : undefined);
  const { saveReading, isSaving } = useSaveReading();
  const allRevealed = revealedCards.every((r) => r);

  // Check VIP access via API
  useEffect(() => {
    async function checkAccess(): Promise<void> {
      try {
        const response = await fetch('/api/access-check?spread=financial_abundance');
        const result = await response.json();
        setAccessCheck({
          checked: true,
          allowed: result.allowed,
          currentTier: result.currentTier,
          requiredTier: result.requiredTier,
        });
      } catch (error) {
        console.error('Access check error:', error);
        setAccessCheck({ checked: true, allowed: false, currentTier: 'free', requiredTier: 'vip' });
      }
    }
    if (!isLoadingAuth) checkAccess();
  }, [user, isLoadingAuth]);

  const handleStartSelection = (): void => {
    trackReadingStarted?.('financial_abundance', !!question);
    setStartTime(Date.now());
    setIsSelecting(true);
    setSelectionStep(0);
    setSelectedFanIndices([]);
  };

  const handleSelectFromFan = (index: number): void => {
    if (selectedFanIndices.includes(index)) return;
    const newSelectedIndices = [...selectedFanIndices, index];
    setSelectedFanIndices(newSelectedIndices);
    if (newSelectedIndices.length < 5) {
      setSelectionStep(newSelectedIndices.length);
    } else {
      setTimeout(() => {
        startReading('financial' as Parameters<typeof startReading>[0], question || undefined);
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

  useEffect(() => {
    if (allRevealed && selectedCardIndex === null && drawnCards.length > 0) setSelectedCardIndex(0);
  }, [allRevealed, selectedCardIndex, drawnCards.length]);

  useEffect(() => {
    if (allRevealed && drawnCards.length === 5 && !hasSavedRef.current && user) {
      hasSavedRef.current = true;
      saveReading('financial_abundance' as Parameters<typeof saveReading>[0], drawnCards, question || undefined).then((result) => {
        if (result) {
          setIsSaved(true);
          const duration = startTime ? Math.round((Date.now() - startTime) / 1000) : 0;
          trackReadingCompleted?.('financial_abundance', result.id, duration);
        }
      });
    }
  }, [allRevealed, drawnCards, question, saveReading, user, startTime, trackReadingCompleted]);

  if (isLoadingAuth || !accessCheck.checked) return <PageLoader message="กำลังตรวจสอบสิทธิ์..." />;

  if (!accessCheck.allowed) {
    const spreadInfo = SPREAD_INFO.financial_abundance;
    return <PremiumGate spreadName="financial" spreadNameTh={spreadInfo.nameTh} spreadIcon={spreadInfo.icon} requiredTier="vip" currentTier={accessCheck.currentTier} />;
  }

  if (isLoadingCards) return <PageLoader message="กำลังโหลดไพ่..." />;

  // Selection mode
  if (isSelecting) {
    const currentPosition = FINANCIAL_POSITIONS[selectionStep];
    const posInfo = POSITION_INFO[currentPosition];

    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-emerald-950/20 to-slate-950 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-4">
            <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-300 mb-2">เลือกไพ่ใบที่ {selectionStep + 1}/5</h2>
            <div className={`inline-block px-6 py-2 rounded-full bg-gradient-to-r ${posInfo.color} text-white font-medium text-lg mb-2`}>
              {posInfo.emoji} {posInfo.th}
            </div>
            <p className="text-slate-400 text-sm">{posInfo.description}</p>
          </div>

          {question && (
            <div className="text-center mb-4">
              <p className="text-emerald-400 text-sm italic">&ldquo;{question}&rdquo;</p>
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {FINANCIAL_POSITIONS.map((pos, idx) => {
              const info = POSITION_INFO[pos];
              return (
                <div
                  key={pos}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-all duration-300 text-xs ${
                    idx < selectionStep ? 'bg-green-600/30 border border-green-500/50' : idx === selectionStep ? `bg-gradient-to-r ${info.color} shadow-lg` : 'bg-slate-800/50 border border-slate-700/50'
                  }`}
                >
                  {idx < selectionStep ? <span className="text-green-400">✓</span> : <span>{info.emoji}</span>}
                  <span className={`${idx <= selectionStep ? 'text-white' : 'text-slate-500'}`}>{info.shortTh}</span>
                </div>
              );
            })}
          </div>

          <CardFan cardCount={22} onSelectCard={handleSelectFromFan} selectedIndex={selectedFanIndices[selectionStep] ?? null} disabled={selectedFanIndices.length === 5} />

          {selectedFanIndices.length > 0 && (
            <div className="mt-6">
              <p className="text-center text-slate-500 text-sm mb-3">ไพ่ที่เลือกแล้ว: {selectedFanIndices.length}/5</p>
              <div className="flex justify-center gap-2">
                {FINANCIAL_POSITIONS.map((pos, idx) => (
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

          {selectedFanIndices.length === 5 && (
            <div className="text-center mt-6 animate-pulse">
              <span className="text-emerald-400 text-lg font-medium">💰 กำลังเปิดเผยเส้นทางความมั่งคั่ง...</span>
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
              disabled={selectedFanIndices.length === 5}
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
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-emerald-950/20 to-slate-950 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <span className="text-4xl">💰</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-300 mb-4">ความมั่งคั่งทางการเงิน</h1>
            <p className="text-slate-400 text-lg">Financial Abundance • 5 ไพ่ • เส้นทางสู่ความมั่งคั่ง</p>
            <div className="mt-4 inline-block px-4 py-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full text-white text-sm font-medium">👑 VIP Exclusive</div>
          </div>

          <div className="bg-slate-800/50 border border-emerald-500/30 rounded-2xl p-6 mb-8">
            <h2 className="text-lg font-semibold text-emerald-300 mb-3">💰 เกี่ยวกับความมั่งคั่งทางการเงิน</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              การดูดวงความมั่งคั่งทางการเงินช่วยให้คุณเข้าใจสถานะการเงินปัจจุบัน อุปสรรคที่ขัดขวาง โอกาสที่รอคุณอยู่ การกระทำที่จำเป็น และเส้นทางสู่ความมั่งคั่งที่แท้จริง
            </p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2 text-slate-400">
                <span>⏱️</span> ~5 นาที
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <span>🎴</span> 5 ไพ่
              </div>
            </div>
          </div>

          <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-emerald-300 mb-4 flex items-center">
              <span className="mr-2">🗺️</span>
              ตำแหน่งไพ่ทั้ง 5
            </h3>
            <div className="space-y-3">
              {FINANCIAL_POSITIONS.map((pos) => {
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
            <label htmlFor="question" className="block text-emerald-300 font-medium mb-3">
              คำถามเกี่ยวกับการเงิน <span className="text-slate-500">(ไม่จำเป็น)</span>
            </label>
            <textarea
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="เช่น ฉันจะสร้างความมั่งคั่งได้อย่างไร?"
              className="w-full bg-slate-900/50 border border-slate-600/50 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 resize-none"
              rows={3}
              maxLength={500}
            />
            <p className="text-right text-slate-500 text-sm mt-2">{question.length}/500</p>
          </div>

          <div className="mb-8">
            <p className="text-slate-500 text-sm mb-3">💡 ตัวอย่างคำถาม:</p>
            <div className="flex flex-wrap gap-2">
              {FINANCIAL_QUESTIONS.map((sample) => (
                <button key={sample} onClick={() => setQuestion(sample)} className="text-sm bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-300 px-3 py-1.5 rounded-full transition-colors">
                  {sample}
                </button>
              ))}
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={handleStartSelection}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all duration-300 hover:-translate-y-1"
            >
              <span className="text-xl mr-3">💰</span>
              เริ่มดูดวงความมั่งคั่ง
            </button>
          </div>

          <div className="mt-8 p-4 bg-slate-800/30 border border-slate-700/50 rounded-xl">
            <p className="text-slate-500 text-xs text-center">💼 การดูดวงนี้เป็นคำแนะนำเชิงจิตวิญญาณ ไม่ใช่คำแนะนำทางการเงินจากผู้เชี่ยวชาญ</p>
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

  // Shuffling/Drawing
  if (readingState === 'shuffling' || readingState === 'drawing') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-emerald-950/20 to-slate-950 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="flex justify-center gap-2 mb-8">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-14 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg animate-pulse shadow-lg" style={{ animationDelay: `${i * 120}ms` }} />
            ))}
          </div>
          <h2 className="text-2xl font-bold text-emerald-300 mb-2">{readingState === 'shuffling' ? 'กำลังสับไพ่...' : 'กำลังจั่วไพ่ 5 ใบ...'}</h2>
          <p className="text-slate-400">นึกถึงเป้าหมายทางการเงินของคุณ</p>
        </div>
      </div>
    );
  }

  // Revealing
  if (readingState === 'revealing' && !allRevealed) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-emerald-950/20 to-slate-950 py-8 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-emerald-300 mb-2">เปิดเผยเส้นทางความมั่งคั่ง</h2>
          <p className="text-slate-400 mb-4">คลิกที่ไพ่ใบที่ {nextCardToReveal + 1} เพื่อเปิด</p>

          <button onClick={revealAllCards} className="mb-8 px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-400 hover:text-slate-200 text-sm rounded-lg transition-colors border border-slate-600/50">
            ⏩ ข้ามไปผลลัพธ์
          </button>

          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 mb-8">
            {drawnCards.map((drawnCard, index) => {
              const pos = FINANCIAL_POSITIONS[index];
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
                      className={`${canReveal ? 'cursor-pointer animate-pulse ring-2 ring-emerald-400 ring-offset-2 ring-offset-slate-950' : ''} ${!canReveal && !isRevealed ? 'opacity-50' : ''}`}
                    />
                    {canReveal && !isRevealed && <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-emerald-400 text-xs animate-bounce whitespace-nowrap">👆 แตะเพื่อเปิด</div>}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-slate-500 text-sm">เปิดแล้ว {revealedCards.filter((r) => r).length} / 5 ใบ</div>
        </div>
      </div>
    );
  }

  // Complete
  if ((readingState === 'revealing' || readingState === 'complete') && allRevealed) {
    const selectedCard = selectedCardIndex !== null ? drawnCards[selectedCardIndex] : null;

    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-emerald-950/20 to-slate-950 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {question && (
            <div className="text-center mb-6">
              <p className="text-slate-500 text-sm mb-1">คำถามเกี่ยวกับการเงิน:</p>
              <p className="text-emerald-300 text-lg italic">&ldquo;{question}&rdquo;</p>
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {drawnCards.map((drawnCard, index) => {
              const pos = FINANCIAL_POSITIONS[index];
              const posInfo = POSITION_INFO[pos];
              const isSelected = selectedCardIndex === index;

              return (
                <div key={index} className={`flex flex-col items-center cursor-pointer transition-all duration-300 ${isSelected ? 'scale-105' : 'opacity-70 hover:opacity-100'}`} onClick={() => setSelectedCardIndex(index)}>
                  <div className={`mb-2 px-3 py-1 rounded-full bg-gradient-to-r ${posInfo.color} text-white text-xs font-medium`}>{posInfo.emoji} {posInfo.shortTh}</div>
                  <TarotCard
                    frontImage={drawnCard.card.imageUrl}
                    cardName={drawnCard.card.name}
                    size="sm"
                    isReversed={drawnCard.isReversed}
                    isFlipped={true}
                    showFlipAnimation={false}
                    className={isSelected ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-slate-950' : ''}
                  />
                  <p className="mt-2 text-xs text-slate-400 text-center max-w-[80px] truncate">{drawnCard.card.nameTh}</p>
                </div>
              );
            })}
          </div>

          {selectedCard && selectedCardIndex !== null && (
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 mb-8">
              <div className="text-center mb-6">
                <div className={`inline-block px-4 py-1 rounded-full bg-gradient-to-r ${POSITION_INFO[FINANCIAL_POSITIONS[selectedCardIndex]].color} text-white text-sm font-medium mb-4`}>
                  {POSITION_INFO[FINANCIAL_POSITIONS[selectedCardIndex]].emoji} {POSITION_INFO[FINANCIAL_POSITIONS[selectedCardIndex]].th}
                </div>
                <h2 className="text-2xl md:text-3xl font-bold font-card text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-300 mb-1">{selectedCard.card.nameTh}</h2>
                <p className="text-emerald-400 font-card">{selectedCard.card.name}</p>
                <div className="flex justify-center items-center gap-3 text-sm text-slate-500 mt-2">
                  <span>{selectedCard.card.suit ? SUIT_NAMES[selectedCard.card.suit].th : 'ไพ่ใหญ่'}</span>
                  <span>•</span>
                  <span className={selectedCard.isReversed ? 'text-red-400' : 'text-green-400'}>{selectedCard.isReversed ? '🔄 กลับหัว' : '✨ ตั้งตรง'}</span>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {(selectedCard.isReversed ? selectedCard.card.keywordsReversed || selectedCard.card.keywordsTh || [] : selectedCard.card.keywordsUpright || selectedCard.card.keywordsTh || []).map((keyword, i) => (
                  <span key={i} className="px-3 py-1 bg-emerald-900/50 text-emerald-300 rounded-full text-sm">
                    {keyword}
                  </span>
                ))}
              </div>

              <div className="bg-emerald-900/20 border border-emerald-500/20 rounded-xl p-4 mb-4">
                <h3 className="text-base font-bold text-emerald-300 mb-2">💰 ในตำแหน่ง &quot;{POSITION_INFO[FINANCIAL_POSITIONS[selectedCardIndex]].th}&quot;</h3>
                <p className="text-slate-300 text-sm italic mb-2">{POSITION_INFO[FINANCIAL_POSITIONS[selectedCardIndex]].focusAreas}</p>
                <p className="text-slate-200 leading-relaxed">{getFinancialInterpretation(selectedCard.card.nameTh, selectedCard.isReversed, FINANCIAL_POSITIONS[selectedCardIndex])}</p>
              </div>

              {(() => {
                const detailedMeaning = generateDetailedPrediction(selectedCard.card.slug, selectedCard.isReversed, selectedCard.card.suit, selectedCard.card.number, selectedCard.card.nameTh);
                return (
                  <div className="space-y-4">
                    <div className="bg-purple-900/20 border border-purple-500/20 rounded-xl p-4">
                      <h3 className="text-base font-bold text-purple-300 mb-2">🔮 ข้อความจากไพ่</h3>
                      <p className="text-slate-200 leading-relaxed text-sm">{detailedMeaning.prediction}</p>
                    </div>
                    <div className="bg-yellow-900/20 border border-yellow-500/20 rounded-xl p-4">
                      <h3 className="text-base font-bold text-yellow-300 mb-2">💡 คำแนะนำทางการเงิน</h3>
                      <p className="text-slate-200 leading-relaxed text-sm">{detailedMeaning.advice}</p>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          <div className="bg-gradient-to-br from-emerald-900/30 to-teal-900/30 border border-emerald-500/30 rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-bold text-emerald-300 mb-4 flex items-center gap-2">
              <span className="text-2xl">💰</span>
              สรุปเส้นทางความมั่งคั่งของคุณ
            </h2>
            <div className="space-y-3 text-slate-300 leading-relaxed">
              {drawnCards.map((drawnCard, index) => {
                const pos = FINANCIAL_POSITIONS[index];
                const posInfo = POSITION_INFO[pos];
                return (
                  <p key={pos}>
                    <span className="font-semibold" style={{ color: posInfo.color.includes('green') || posInfo.color.includes('emerald') ? '#6ee7b7' : posInfo.color.includes('red') ? '#fca5a5' : posInfo.color.includes('yellow') ? '#fcd34d' : posInfo.color.includes('orange') ? '#fb923c' : '#5eead4' }}>
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
            <div className="text-center mb-6">{isSaving ? <span className="text-emerald-400 text-sm animate-pulse">💾 กำลังบันทึก...</span> : isSaved ? <span className="text-green-400 text-sm">✅ บันทึกแล้ว</span> : null}</div>
          )}

          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={handleReset} className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium rounded-xl transition-all duration-300">
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

// Helper function
function getFinancialInterpretation(cardName: string, isReversed: boolean, position: FinancialPosition): string {
  const interpretations: Record<FinancialPosition, { upright: string; reversed: string }> = {
    fa_current: {
      upright: `ไพ่ ${cardName} ในตำแหน่ง "สถานะการเงินปัจจุบัน" แสดงให้เห็นว่าสถานะการเงินของคุณอยู่ในจุดที่มั่นคง มีรากฐานที่ดีสำหรับการเติบโตทางการเงิน`,
      reversed: `ไพ่ ${cardName} กลับหัวในตำแหน่ง "สถานะการเงินปัจจุบัน" บ่งบอกว่าอาจมีความไม่มั่นคงทางการเงินหรือต้องระมัดระวังเรื่องการใช้จ่าย ควรทบทวนงบประมาณ`,
    },
    fa_blocks: {
      upright: `ไพ่ ${cardName} ในตำแหน่ง "อุปสรรคทางการเงิน" เปิดเผยสิ่งที่ขัดขวางความมั่งคั่ง แต่เป็นอุปสรรคที่สามารถก้าวข้ามได้ด้วยความตั้งใจ`,
      reversed: `ไพ่ ${cardName} กลับหัวในตำแหน่ง "อุปสรรคทางการเงิน" บ่งบอกว่าอุปสรรคอาจมาจากความเชื่อหรือนิสัยที่ฝังลึก ต้องทำงานกับตัวเองเพื่อเปลี่ยนแปลง`,
    },
    fa_opportunities: {
      upright: `ไพ่ ${cardName} ในตำแหน่ง "โอกาสทางการเงิน" เผยให้เห็นโอกาสในการสร้างรายได้หรือความมั่งคั่งที่กำลังเปิดรับ จงคว้าโอกาสนี้`,
      reversed: `ไพ่ ${cardName} กลับหัวในตำแหน่ง "โอกาสทางการเงิน" บ่งบอกว่าโอกาสอาจยังไม่ชัดเจนหรืออาจพลาดไปแล้ว ลองมองหาโอกาสใหม่ในมุมที่ไม่คาดคิด`,
    },
    fa_action: {
      upright: `ไพ่ ${cardName} ในตำแหน่ง "การกระทำที่ต้องทำ" ชี้แนะขั้นตอนที่ควรทำเพื่อดึงดูดความมั่งคั่ง การลงมือทำตามนี้จะนำมาซึ่งผลลัพธ์ที่ดี`,
      reversed: `ไพ่ ${cardName} กลับหัวในตำแหน่ง "การกระทำที่ต้องทำ" เตือนว่าอาจต้องทบทวนแผนหรือแนวทาง บางครั้งการหยุดพักและวางแผนใหม่อาจดีกว่าการเร่งรีบ`,
    },
    fa_abundance: {
      upright: `ไพ่ ${cardName} ในตำแหน่ง "เส้นทางสู่ความมั่งคั่ง" แสดงภาพอนาคตที่สดใส ความมั่งคั่งและความอุดมสมบูรณ์กำลังรอคุณอยู่บนเส้นทางนี้`,
      reversed: `ไพ่ ${cardName} กลับหัวในตำแหน่ง "เส้นทางสู่ความมั่งคั่ง" บ่งบอกว่าเส้นทางอาจต้องการการปรับเปลี่ยน ความมั่งคั่งอาจมาในรูปแบบที่ไม่คาดคิด จงเปิดใจ`,
    },
  };

  return isReversed ? interpretations[position].reversed : interpretations[position].upright;
}
