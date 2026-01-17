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

// Career Path 6 Position Type
type CareerPathPosition =
  | 'cp_current'
  | 'cp_skills'
  | 'cp_obstacles'
  | 'cp_opportunities'
  | 'cp_guidance'
  | 'cp_outcome';

// Career Path positions in order
const CAREER_PATH_POSITIONS: CareerPathPosition[] = [
  'cp_current',
  'cp_skills',
  'cp_obstacles',
  'cp_opportunities',
  'cp_guidance',
  'cp_outcome',
];

// Position information for display
const POSITION_INFO: Record<
  CareerPathPosition,
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
  cp_current: {
    th: 'สถานการณ์ปัจจุบัน',
    en: 'Current State',
    emoji: '📍',
    color: 'from-blue-500 to-cyan-600',
    shortTh: 'ปัจจุบัน',
    description: 'ตำแหน่งและสถานะอาชีพปัจจุบันของคุณ',
    focusAreas: 'ตำแหน่ง • ความพอใจ • สถานะ',
  },
  cp_skills: {
    th: 'ทักษะและจุดแข็ง',
    en: 'Skills & Strengths',
    emoji: '💎',
    color: 'from-emerald-500 to-green-600',
    shortTh: 'ทักษะ',
    description: 'ความสามารถและพรสวรรค์ที่โดดเด่น',
    focusAreas: 'ความเชี่ยวชาญ • พรสวรรค์ • ความสามารถ',
  },
  cp_obstacles: {
    th: 'อุปสรรค',
    en: 'Obstacles',
    emoji: '🚧',
    color: 'from-red-500 to-rose-600',
    shortTh: 'อุปสรรค',
    description: 'สิ่งที่ขัดขวางความก้าวหน้าในอาชีพ',
    focusAreas: 'ความท้าทาย • ข้อจำกัด • ปัญหา',
  },
  cp_opportunities: {
    th: 'โอกาส',
    en: 'Opportunities',
    emoji: '🌟',
    color: 'from-yellow-500 to-amber-600',
    shortTh: 'โอกาส',
    description: 'โอกาสที่กำลังเปิดรับหรือที่ควรคว้า',
    focusAreas: 'ความเป็นไปได้ • ทางเลือก • โอกาสใหม่',
  },
  cp_guidance: {
    th: 'คำแนะนำ',
    en: 'Guidance',
    emoji: '🧭',
    color: 'from-purple-500 to-violet-600',
    shortTh: 'แนะนำ',
    description: 'คำแนะนำสำหรับเส้นทางอาชีพ',
    focusAreas: 'ทิศทาง • กลยุทธ์ • การตัดสินใจ',
  },
  cp_outcome: {
    th: 'ผลลัพธ์',
    en: 'Outcome',
    emoji: '🎯',
    color: 'from-orange-500 to-red-600',
    shortTh: 'ผลลัพธ์',
    description: 'จุดหมายปลายทางของเส้นทางอาชีพ',
    focusAreas: 'เป้าหมาย • ความสำเร็จ • อนาคต',
  },
};

// Sample questions
const CAREER_PATH_QUESTIONS = [
  'เส้นทางอาชีพของฉันจะเป็นอย่างไร?',
  'ฉันควรเปลี่ยนงานไหม?',
  'อะไรคืออุปสรรคในการเติบโตของฉัน?',
  'ฉันจะได้เลื่อนตำแหน่งไหม?',
  'ฉันเหมาะกับสายอาชีพไหน?',
];

export default function CareerPathReadingPage(): React.JSX.Element | null {
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
        const response = await fetch('/api/access-check?spread=career_path');
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
    trackReadingStarted?.('career_path', !!question);
    setStartTime(Date.now());
    setIsSelecting(true);
    setSelectionStep(0);
    setSelectedFanIndices([]);
  };

  const handleSelectFromFan = (index: number): void => {
    if (selectedFanIndices.includes(index)) return;
    const newSelectedIndices = [...selectedFanIndices, index];
    setSelectedFanIndices(newSelectedIndices);
    if (newSelectedIndices.length < 6) {
      setSelectionStep(newSelectedIndices.length);
    } else {
      setTimeout(() => {
        startReading('career-path' as Parameters<typeof startReading>[0], question || undefined);
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
    if (allRevealed && drawnCards.length === 6 && !hasSavedRef.current && user) {
      hasSavedRef.current = true;
      saveReading('career_path' as Parameters<typeof saveReading>[0], drawnCards, question || undefined).then((result) => {
        if (result) {
          setIsSaved(true);
          const duration = startTime ? Math.round((Date.now() - startTime) / 1000) : 0;
          trackReadingCompleted?.('career_path', result.id, duration);
        }
      });
    }
  }, [allRevealed, drawnCards, question, saveReading, user, startTime, trackReadingCompleted]);

  if (isLoadingAuth || !accessCheck.checked) return <PageLoader message="กำลังตรวจสอบสิทธิ์..." />;

  if (!accessCheck.allowed) {
    const spreadInfo = SPREAD_INFO.career_path;
    return <PremiumGate spreadName="career-path" spreadNameTh={spreadInfo.nameTh} spreadIcon={spreadInfo.icon} requiredTier="vip" currentTier={accessCheck.currentTier} />;
  }

  if (isLoadingCards) return <PageLoader message="กำลังโหลดไพ่..." />;

  // Selection mode
  if (isSelecting) {
    const currentPosition = CAREER_PATH_POSITIONS[selectionStep];
    const posInfo = POSITION_INFO[currentPosition];

    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950/20 to-slate-950 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-4">
            <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300 mb-2">เลือกไพ่ใบที่ {selectionStep + 1}/6</h2>
            <div className={`inline-block px-6 py-2 rounded-full bg-gradient-to-r ${posInfo.color} text-white font-medium text-lg mb-2`}>
              {posInfo.emoji} {posInfo.th}
            </div>
            <p className="text-slate-400 text-sm">{posInfo.description}</p>
          </div>

          {question && (
            <div className="text-center mb-4">
              <p className="text-blue-400 text-sm italic">&ldquo;{question}&rdquo;</p>
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {CAREER_PATH_POSITIONS.map((pos, idx) => {
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

          <CardFan cardCount={22} onSelectCard={handleSelectFromFan} selectedIndex={selectedFanIndices[selectionStep] ?? null} disabled={selectedFanIndices.length === 6} />

          {selectedFanIndices.length > 0 && (
            <div className="mt-6">
              <p className="text-center text-slate-500 text-sm mb-3">ไพ่ที่เลือกแล้ว: {selectedFanIndices.length}/6</p>
              <div className="flex justify-center gap-2">
                {CAREER_PATH_POSITIONS.map((pos, idx) => (
                  <div
                    key={pos}
                    className={`w-10 h-14 rounded-lg flex items-center justify-center transition-all duration-300 ${
                      idx < selectedFanIndices.length ? `bg-gradient-to-br ${POSITION_INFO[pos].color} shadow-lg` : 'bg-slate-800/50 border-2 border-dashed border-slate-600'
                    }`}
                  >
                    {idx < selectedFanIndices.length ? <span className="text-white text-sm">✓</span> : <span className="text-slate-600 text-xs">{idx + 1}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedFanIndices.length === 6 && (
            <div className="text-center mt-6 animate-pulse">
              <span className="text-blue-400 text-lg font-medium">🎯 กำลังเปิดเผยเส้นทางอาชีพ...</span>
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
              disabled={selectedFanIndices.length === 6}
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
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950/20 to-slate-950 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="text-4xl">🎯</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300 mb-4">เส้นทางอาชีพ</h1>
            <p className="text-slate-400 text-lg">Career Path • 6 ไพ่ • ค้นพบเส้นทางความสำเร็จ</p>
            <div className="mt-4 inline-block px-4 py-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full text-white text-sm font-medium">👑 VIP Exclusive</div>
          </div>

          <div className="bg-slate-800/50 border border-blue-500/30 rounded-2xl p-6 mb-8">
            <h2 className="text-lg font-semibold text-blue-300 mb-3">🎯 เกี่ยวกับเส้นทางอาชีพ</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              การดูดวงเส้นทางอาชีพช่วยให้คุณเห็นภาพรวมของการเดินทางในอาชีพ ตั้งแต่จุดที่คุณอยู่ ทักษะที่มี อุปสรรคที่ต้องก้าวข้าม โอกาสที่รออยู่ คำแนะนำจากจักรวาล และผลลัพธ์ที่รอคุณอยู่
            </p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2 text-slate-400">
                <span>⏱️</span> ~6 นาที
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <span>🎴</span> 6 ไพ่
              </div>
            </div>
          </div>

          <div className="bg-blue-900/20 border border-blue-500/30 rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-blue-300 mb-4 flex items-center">
              <span className="mr-2">🗺️</span>
              ตำแหน่งไพ่ทั้ง 6
            </h3>
            <div className="space-y-3">
              {CAREER_PATH_POSITIONS.map((pos) => {
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
            <label htmlFor="question" className="block text-blue-300 font-medium mb-3">
              คำถามเกี่ยวกับอาชีพ <span className="text-slate-500">(ไม่จำเป็น)</span>
            </label>
            <textarea
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="เช่น เส้นทางอาชีพของฉันจะเป็นอย่างไร?"
              className="w-full bg-slate-900/50 border border-slate-600/50 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 resize-none"
              rows={3}
              maxLength={500}
            />
            <p className="text-right text-slate-500 text-sm mt-2">{question.length}/500</p>
          </div>

          <div className="mb-8">
            <p className="text-slate-500 text-sm mb-3">💡 ตัวอย่างคำถาม:</p>
            <div className="flex flex-wrap gap-2">
              {CAREER_PATH_QUESTIONS.map((sample) => (
                <button key={sample} onClick={() => setQuestion(sample)} className="text-sm bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-300 px-3 py-1.5 rounded-full transition-colors">
                  {sample}
                </button>
              ))}
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={handleStartSelection}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-300 hover:-translate-y-1"
            >
              <span className="text-xl mr-3">🎯</span>
              เริ่มดูดวงเส้นทางอาชีพ
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

  // Shuffling/Drawing
  if (readingState === 'shuffling' || readingState === 'drawing') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950/20 to-slate-950 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="flex justify-center gap-2 mb-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-12 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg animate-pulse shadow-lg" style={{ animationDelay: `${i * 100}ms` }} />
            ))}
          </div>
          <h2 className="text-2xl font-bold text-blue-300 mb-2">{readingState === 'shuffling' ? 'กำลังสับไพ่...' : 'กำลังจั่วไพ่ 6 ใบ...'}</h2>
          <p className="text-slate-400">นึกถึงเป้าหมายอาชีพของคุณ</p>
        </div>
      </div>
    );
  }

  // Revealing
  if (readingState === 'revealing' && !allRevealed) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950/20 to-slate-950 py-8 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-300 mb-2">เปิดเผยเส้นทางอาชีพ</h2>
          <p className="text-slate-400 mb-4">คลิกที่ไพ่ใบที่ {nextCardToReveal + 1} เพื่อเปิด</p>

          <button onClick={revealAllCards} className="mb-8 px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-400 hover:text-slate-200 text-sm rounded-lg transition-colors border border-slate-600/50">
            ⏩ ข้ามไปผลลัพธ์
          </button>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-8">
            {drawnCards.map((drawnCard, index) => {
              const pos = CAREER_PATH_POSITIONS[index];
              const posInfo = POSITION_INFO[pos];
              const isRevealed = revealedCards[index];
              const canReveal = index === nextCardToReveal;

              return (
                <div key={index} className="flex flex-col items-center">
                  <div className={`mb-2 px-2 py-0.5 rounded-full bg-gradient-to-r ${posInfo.color} text-white text-[10px] font-medium`}>
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
                      className={`${canReveal ? 'cursor-pointer animate-pulse ring-2 ring-blue-400 ring-offset-2 ring-offset-slate-950' : ''} ${!canReveal && !isRevealed ? 'opacity-50' : ''}`}
                    />
                    {canReveal && !isRevealed && <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-blue-400 text-[10px] animate-bounce whitespace-nowrap">👆 แตะ</div>}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-slate-500 text-sm">เปิดแล้ว {revealedCards.filter((r) => r).length} / 6 ใบ</div>
        </div>
      </div>
    );
  }

  // Complete
  if ((readingState === 'revealing' || readingState === 'complete') && allRevealed) {
    const selectedCard = selectedCardIndex !== null ? drawnCards[selectedCardIndex] : null;

    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950/20 to-slate-950 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {question && (
            <div className="text-center mb-6">
              <p className="text-slate-500 text-sm mb-1">คำถามเกี่ยวกับอาชีพ:</p>
              <p className="text-blue-300 text-lg italic">&ldquo;{question}&rdquo;</p>
            </div>
          )}

          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3 mb-8">
            {drawnCards.map((drawnCard, index) => {
              const pos = CAREER_PATH_POSITIONS[index];
              const posInfo = POSITION_INFO[pos];
              const isSelected = selectedCardIndex === index;

              return (
                <div key={index} className={`flex flex-col items-center cursor-pointer transition-all duration-300 ${isSelected ? 'scale-105' : 'opacity-70 hover:opacity-100'}`} onClick={() => setSelectedCardIndex(index)}>
                  <div className={`mb-2 px-2 py-0.5 rounded-full bg-gradient-to-r ${posInfo.color} text-white text-[10px] font-medium`}>{posInfo.emoji}</div>
                  <TarotCard
                    frontImage={drawnCard.card.imageUrl}
                    cardName={drawnCard.card.name}
                    size="sm"
                    isReversed={drawnCard.isReversed}
                    isFlipped={true}
                    showFlipAnimation={false}
                    className={isSelected ? 'ring-2 ring-blue-400 ring-offset-2 ring-offset-slate-950' : ''}
                  />
                  <p className="mt-1 text-[10px] text-center text-slate-500 max-w-[60px] truncate">{posInfo.shortTh}</p>
                </div>
              );
            })}
          </div>

          {selectedCard && selectedCardIndex !== null && (
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 mb-8">
              <div className="text-center mb-6">
                <div className={`inline-block px-4 py-1 rounded-full bg-gradient-to-r ${POSITION_INFO[CAREER_PATH_POSITIONS[selectedCardIndex]].color} text-white text-sm font-medium mb-4`}>
                  {POSITION_INFO[CAREER_PATH_POSITIONS[selectedCardIndex]].emoji} {POSITION_INFO[CAREER_PATH_POSITIONS[selectedCardIndex]].th}
                </div>
                <h2 className="text-2xl md:text-3xl font-bold font-card text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300 mb-1">{selectedCard.card.nameTh}</h2>
                <p className="text-blue-400 font-card">{selectedCard.card.name}</p>
                <div className="flex justify-center items-center gap-3 text-sm text-slate-500 mt-2">
                  <span>{selectedCard.card.suit ? SUIT_NAMES[selectedCard.card.suit].th : 'ไพ่ใหญ่'}</span>
                  <span>•</span>
                  <span className={selectedCard.isReversed ? 'text-red-400' : 'text-green-400'}>{selectedCard.isReversed ? '🔄 กลับหัว' : '✨ ตั้งตรง'}</span>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {(selectedCard.isReversed ? selectedCard.card.keywordsReversed || selectedCard.card.keywordsTh || [] : selectedCard.card.keywordsUpright || selectedCard.card.keywordsTh || []).map((keyword, i) => (
                  <span key={i} className="px-3 py-1 bg-blue-900/50 text-blue-300 rounded-full text-sm">
                    {keyword}
                  </span>
                ))}
              </div>

              <div className="bg-blue-900/20 border border-blue-500/20 rounded-xl p-4 mb-4">
                <h3 className="text-base font-bold text-blue-300 mb-2">🎯 ในตำแหน่ง &quot;{POSITION_INFO[CAREER_PATH_POSITIONS[selectedCardIndex]].th}&quot;</h3>
                <p className="text-slate-300 text-sm italic mb-2">{POSITION_INFO[CAREER_PATH_POSITIONS[selectedCardIndex]].focusAreas}</p>
                <p className="text-slate-200 leading-relaxed">{getCareerPathInterpretation(selectedCard.card.nameTh, selectedCard.isReversed, CAREER_PATH_POSITIONS[selectedCardIndex])}</p>
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

          <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border border-blue-500/30 rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-bold text-blue-300 mb-4 flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              สรุปเส้นทางอาชีพของคุณ
            </h2>
            <div className="space-y-3 text-slate-300 leading-relaxed">
              {drawnCards.map((drawnCard, index) => {
                const pos = CAREER_PATH_POSITIONS[index];
                const posInfo = POSITION_INFO[pos];
                return (
                  <p key={pos}>
                    <span className="font-semibold" style={{ color: posInfo.color.includes('blue') ? '#93c5fd' : posInfo.color.includes('emerald') ? '#6ee7b7' : posInfo.color.includes('red') ? '#fca5a5' : posInfo.color.includes('yellow') ? '#fcd34d' : posInfo.color.includes('purple') ? '#c4b5fd' : '#fb923c' }}>
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
            <div className="text-center mb-6">{isSaving ? <span className="text-blue-400 text-sm animate-pulse">💾 กำลังบันทึก...</span> : isSaved ? <span className="text-green-400 text-sm">✅ บันทึกแล้ว</span> : null}</div>
          )}

          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={handleReset} className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-medium rounded-xl transition-all duration-300">
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
function getCareerPathInterpretation(cardName: string, isReversed: boolean, position: CareerPathPosition): string {
  const interpretations: Record<CareerPathPosition, { upright: string; reversed: string }> = {
    cp_current: {
      upright: `ไพ่ ${cardName} ในตำแหน่ง "สถานการณ์ปัจจุบัน" แสดงให้เห็นว่าคุณอยู่ในจุดที่มั่นคงและมีพื้นฐานที่ดีสำหรับการเติบโต สถานการณ์ปัจจุบันเอื้อต่อการพัฒนาอาชีพ`,
      reversed: `ไพ่ ${cardName} กลับหัวในตำแหน่ง "สถานการณ์ปัจจุบัน" บ่งบอกว่าคุณอาจรู้สึกไม่มั่นใจหรือติดอยู่กับที่ในอาชีพ อาจถึงเวลาทบทวนทิศทางที่กำลังเดินไป`,
    },
    cp_skills: {
      upright: `ไพ่ ${cardName} ในตำแหน่ง "ทักษะและจุดแข็ง" เปิดเผยความสามารถที่โดดเด่นของคุณ นี่คือพรสวรรค์ที่ควรใช้ให้เกิดประโยชน์สูงสุดในการทำงาน`,
      reversed: `ไพ่ ${cardName} กลับหัวในตำแหน่ง "ทักษะและจุดแข็ง" ชี้ให้เห็นว่าคุณอาจยังไม่ได้ใช้ศักยภาพอย่างเต็มที่ หรืออาจมีทักษะที่ต้องพัฒนาเพิ่มเติม`,
    },
    cp_obstacles: {
      upright: `ไพ่ ${cardName} ในตำแหน่ง "อุปสรรค" แสดงให้เห็นความท้าทายที่ต้องเผชิญ แต่เป็นอุปสรรคที่สามารถก้าวข้ามได้ด้วยความตั้งใจและแผนที่ชัดเจน`,
      reversed: `ไพ่ ${cardName} กลับหัวในตำแหน่ง "อุปสรรค" บ่งบอกว่าอุปสรรคอาจลึกกว่าที่คิด หรืออาจมาจากตัวคุณเอง ลองทบทวนความเชื่อและทัศนคติที่อาจขัดขวางความก้าวหน้า`,
    },
    cp_opportunities: {
      upright: `ไพ่ ${cardName} ในตำแหน่ง "โอกาส" เผยให้เห็นโอกาสที่กำลังเปิดรับ จงเปิดใจและพร้อมคว้าโอกาสเหล่านี้เมื่อมาถึง`,
      reversed: `ไพ่ ${cardName} กลับหัวในตำแหน่ง "โอกาส" บ่งบอกว่าโอกาสอาจยังไม่ชัดเจนหรืออาจพลาดไป ลองมองหาโอกาสในที่ที่ไม่คาดคิด`,
    },
    cp_guidance: {
      upright: `ไพ่ ${cardName} ในตำแหน่ง "คำแนะนำ" ชี้แนะทิศทางที่ควรเดินไป คำแนะนำนี้จะช่วยให้คุณตัดสินใจได้ดีขึ้นในเส้นทางอาชีพ`,
      reversed: `ไพ่ ${cardName} กลับหัวในตำแหน่ง "คำแนะนำ" เตือนว่าคุณอาจต้องทบทวนแผนหรือแนวทางที่ใช้อยู่ บางครั้งการหยุดพักและมองภาพรวมอาจช่วยได้`,
    },
    cp_outcome: {
      upright: `ไพ่ ${cardName} ในตำแหน่ง "ผลลัพธ์" แสดงจุดหมายปลายทางที่รอคุณอยู่ หากเดินตามเส้นทางนี้ ความสำเร็จกำลังรอคุณอยู่`,
      reversed: `ไพ่ ${cardName} กลับหัวในตำแหน่ง "ผลลัพธ์" บ่งบอกว่าผลลัพธ์อาจไม่เป็นไปตามที่คาดหวัง หรืออาจต้องปรับเปลี่ยนเป้าหมาย จงยืดหยุ่นและเปิดรับทางเลือกใหม่`,
    },
  };

  return isReversed ? interpretations[position].reversed : interpretations[position].upright;
}
