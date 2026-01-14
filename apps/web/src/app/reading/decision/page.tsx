'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { TarotCard, CardFan } from '@/components/cards';
import { useTarotReading, useCards, useSaveReading, useAuth } from '@/lib/hooks';
import { SUIT_NAMES } from '@/types/card';
import { generateDetailedPrediction } from '@/lib/tarot/cardMeanings';
import { PageLoader } from '@/components/ui/MysticalLoader';
import { PremiumGate } from '@/components/gates';
import { SPREAD_INFO } from '@/lib/access-control/spread-info';

// Decision Making specific position type
type DecisionPosition = 
  | 'dm_option_a_pros' | 'dm_option_a_cons' 
  | 'dm_option_b_pros' | 'dm_option_b_cons' | 'dm_best_path';

// Decision Making 5 Position Labels
const DECISION_POSITIONS: DecisionPosition[] = [
  'dm_option_a_pros',
  'dm_option_a_cons',
  'dm_option_b_pros',
  'dm_option_b_cons',
  'dm_best_path',
];

const POSITION_LABELS: Record<DecisionPosition, { th: string; en: string; emoji: string; color: string; type: 'pros' | 'cons' | 'path' }> = {
  dm_option_a_pros: { th: 'ข้อดีของตัวเลือก A', en: 'Option A Pros', emoji: '✅', color: 'from-green-500 to-emerald-600', type: 'pros' },
  dm_option_a_cons: { th: 'ข้อเสียของตัวเลือก A', en: 'Option A Cons', emoji: '⚠️', color: 'from-orange-500 to-red-600', type: 'cons' },
  dm_option_b_pros: { th: 'ข้อดีของตัวเลือก B', en: 'Option B Pros', emoji: '✅', color: 'from-green-500 to-emerald-600', type: 'pros' },
  dm_option_b_cons: { th: 'ข้อเสียของตัวเลือก B', en: 'Option B Cons', emoji: '⚠️', color: 'from-orange-500 to-red-600', type: 'cons' },
  dm_best_path: { th: 'เส้นทางที่ดีที่สุด', en: 'Best Path', emoji: '🎯', color: 'from-purple-500 to-pink-600', type: 'path' },
};

export default function DecisionMakingReadingPage() {
  const { user, isLoading: isLoadingAuth } = useAuth();
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
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

  // Check premium access via API
  useEffect(() => {
    async function checkAccess() {
      try {
        const response = await fetch('/api/access-check?spread=decision_making');
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

  // Start selection mode
  const handleStartSelection = () => {
    if (!optionA.trim() || !optionB.trim()) {
      return; // Need both options
    }
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
      // All 5 cards selected
      setTimeout(() => {
        const questionText = `ตัวเลือก A: ${optionA} | ตัวเลือก B: ${optionB}`;
        startReading('decision' as Parameters<typeof startReading>[0], questionText);
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
      setSelectedCardIndex(4); // Start with Best Path card
    }
  }, [allRevealed, selectedCardIndex, drawnCards.length]);

  // Auto-save when all cards are revealed
  useEffect(() => {
    if (allRevealed && drawnCards.length === 5 && !hasSavedRef.current) {
      hasSavedRef.current = true;
      const questionText = `ตัวเลือก A: ${optionA} | ตัวเลือก B: ${optionB}`;
      saveReading('decision_making' as Parameters<typeof saveReading>[0], drawnCards, questionText).then((result) => {
        if (result) {
          setIsSaved(true);
        }
      });
    }
  }, [allRevealed, drawnCards, optionA, optionB, saveReading]);

  // Calculate recommendation based on cards
  const getRecommendation = () => {
    if (!allRevealed || drawnCards.length !== 5) return null;

    // Simple scoring: pros cards upright = +1, reversed = -0.5
    // Cons cards upright = -1, reversed = +0.5
    let scoreA = 0;
    let scoreB = 0;

    // Option A Pros (index 0)
    scoreA += drawnCards[0].isReversed ? -0.5 : 1;
    // Option A Cons (index 1)
    scoreA += drawnCards[1].isReversed ? 0.5 : -1;
    // Option B Pros (index 2)
    scoreB += drawnCards[2].isReversed ? -0.5 : 1;
    // Option B Cons (index 3)
    scoreB += drawnCards[3].isReversed ? 0.5 : -1;

    // Best Path card influence
    const bestPath = drawnCards[4];
    const bestPathPositive = !bestPath.isReversed;

    if (scoreA > scoreB) {
      return {
        recommendation: 'A',
        optionName: optionA,
        confidence: bestPathPositive ? 'สูง' : 'ปานกลาง',
        message: bestPathPositive 
          ? `ไพ่บ่งชี้ว่า "${optionA}" เป็นทางเลือกที่ดีกว่าอย่างชัดเจน`
          : `"${optionA}" ดูเหมือนจะดีกว่า แต่ยังมีความไม่แน่นอนบางอย่าง`,
      };
    } else if (scoreB > scoreA) {
      return {
        recommendation: 'B',
        optionName: optionB,
        confidence: bestPathPositive ? 'สูง' : 'ปานกลาง',
        message: bestPathPositive 
          ? `ไพ่บ่งชี้ว่า "${optionB}" เป็นทางเลือกที่ดีกว่าอย่างชัดเจน`
          : `"${optionB}" ดูเหมือนจะดีกว่า แต่ยังมีความไม่แน่นอนบางอย่าง`,
      };
    } else {
      return {
        recommendation: 'ทั้งสอง',
        optionName: 'ทั้งสองตัวเลือก',
        confidence: 'ต้องพิจารณาเพิ่มเติม',
        message: 'ไพ่แสดงว่าทั้งสองตัวเลือกมีน้ำหนักเท่าๆ กัน คุณอาจต้องพิจารณาปัจจัยอื่นๆ ร่วมด้วย',
      };
    }
  };

  // Loading states
  if (isLoadingAuth || !accessCheck.checked) {
    return <PageLoader message="กำลังตรวจสอบสิทธิ์..." />;
  }

  // Premium gate
  if (!accessCheck.allowed) {
    const spreadInfo = SPREAD_INFO.decision_making;
    return (
      <PremiumGate
        spreadName="decision-making"
        spreadNameTh={spreadInfo.nameTh}
        spreadIcon={spreadInfo.icon}
        requiredTier={accessCheck.requiredTier || 'pro'}
        currentTier={accessCheck.currentTier}
      />
    );
  }

  // Loading cards
  if (isLoadingCards) {
    return <PageLoader message="กำลังโหลดไพ่..." />;
  }

  // Selection mode
  if (isSelecting) {
    const currentPosition = DECISION_POSITIONS[selectionStep];
    const posInfo = POSITION_LABELS[currentPosition];
    const isOptionA = selectionStep < 2;

    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-950/20 to-slate-900 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-4">
            <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300 mb-2">
              เลือกไพ่ใบที่ {selectionStep + 1}/5
            </h2>
            <div className={`inline-block px-6 py-2 rounded-full bg-gradient-to-r ${posInfo.color} text-white font-medium text-lg mb-2`}>
              {posInfo.emoji} {posInfo.th}
            </div>
            {selectionStep < 4 && (
              <p className="text-slate-400">
                สำหรับ: <span className={isOptionA ? 'text-cyan-400' : 'text-pink-400'}>
                  {isOptionA ? optionA : optionB}
                </span>
              </p>
            )}
          </div>

          {/* Progress */}
          <div className="flex justify-center gap-2 mb-6">
            {DECISION_POSITIONS.map((pos, idx) => {
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
                </div>
              );
            })}
          </div>

          {/* Options reminder */}
          <div className="flex justify-center gap-4 mb-6">
            <div className={`px-4 py-2 rounded-lg ${selectionStep < 2 ? 'bg-cyan-600/30 border border-cyan-500' : 'bg-slate-800/50'}`}>
              <span className="text-cyan-400 font-medium">A:</span> {optionA}
            </div>
            <div className={`px-4 py-2 rounded-lg ${selectionStep >= 2 && selectionStep < 4 ? 'bg-pink-600/30 border border-pink-500' : 'bg-slate-800/50'}`}>
              <span className="text-pink-400 font-medium">B:</span> {optionB}
            </div>
          </div>

          {/* Card Fan */}
          <CardFan
            cardCount={22}
            onSelectCard={handleSelectFromFan}
            selectedIndex={selectedFanIndices[selectionStep] ?? null}
            disabled={selectedFanIndices.length === 5}
          />

          {/* Selected preview */}
          {selectedFanIndices.length > 0 && (
            <div className="mt-6">
              <p className="text-center text-slate-500 text-sm mb-3">ไพ่ที่เลือกแล้ว: {selectedFanIndices.length}/5</p>
            </div>
          )}

          {/* All selected message */}
          {selectedFanIndices.length === 5 && (
            <div className="text-center mt-6 animate-pulse">
              <span className="text-cyan-400 text-lg font-medium">
                ⚖️ กำลังวิเคราะห์ตัวเลือกของคุณ...
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

  // Idle state - Show option inputs
  if (readingState === 'idle') {
    const canStart = optionA.trim().length > 0 && optionB.trim().length > 0;

    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-950/20 to-slate-900 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/30">
              <span className="text-4xl">⚖️</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300 mb-4">
              ไพ่ตัดสินใจ
            </h1>
            <p className="text-slate-400 text-lg">Decision Making • 5 ไพ่ • เปรียบเทียบ 2 ตัวเลือก</p>
            <div className="mt-4 inline-block px-4 py-1 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-full text-white text-sm font-medium">
              ✨ Pro Feature
            </div>
          </div>

          {/* Description */}
          <div className="bg-slate-800/50 border border-cyan-500/30 rounded-2xl p-6 mb-8">
            <h2 className="text-lg font-semibold text-cyan-300 mb-3">⚖️ วิธีการใช้งาน</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              กรอกตัวเลือก 2 ตัวที่คุณกำลังตัดสินใจ ไพ่จะเผยข้อดีและข้อเสียของแต่ละตัวเลือก 
              พร้อมคำแนะนำเส้นทางที่ดีที่สุด
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <span className="text-green-400">✅</span> ข้อดี
              </div>
              <div className="flex items-center gap-2">
                <span className="text-orange-400">⚠️</span> ข้อเสีย
              </div>
              <div className="flex items-center gap-2">
                <span className="text-purple-400">🎯</span> เส้นทางที่ดีที่สุด
              </div>
              <div className="flex items-center gap-2">
                <span>⏱️</span> ~5 นาที
              </div>
            </div>
          </div>

          {/* Option Inputs */}
          <div className="space-y-6 mb-8">
            {/* Option A */}
            <div className="bg-slate-800/50 border border-cyan-500/30 rounded-2xl p-6">
              <label htmlFor="optionA" className="block text-cyan-300 font-medium mb-3">
                ตัวเลือก A <span className="text-red-400">*</span>
              </label>
              <input
                id="optionA"
                type="text"
                value={optionA}
                onChange={(e) => setOptionA(e.target.value)}
                placeholder="เช่น รับงานใหม่ที่เงินเดือนสูงกว่า"
                className="w-full bg-slate-900/50 border border-slate-600/50 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50"
                maxLength={100}
              />
            </div>

            {/* Option B */}
            <div className="bg-slate-800/50 border border-pink-500/30 rounded-2xl p-6">
              <label htmlFor="optionB" className="block text-pink-300 font-medium mb-3">
                ตัวเลือก B <span className="text-red-400">*</span>
              </label>
              <input
                id="optionB"
                type="text"
                value={optionB}
                onChange={(e) => setOptionB(e.target.value)}
                placeholder="เช่น อยู่งานเดิมที่มั่นคงกว่า"
                className="w-full bg-slate-900/50 border border-slate-600/50 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/50"
                maxLength={100}
              />
            </div>
          </div>

          {/* Sample Options */}
          <div className="mb-8">
            <p className="text-slate-500 text-sm mb-3">💡 ตัวอย่างการตัดสินใจ:</p>
            <div className="flex flex-wrap gap-2">
              {[
                { a: 'ย้ายเมือง', b: 'อยู่ที่เดิม' },
                { a: 'เรียนต่อ', b: 'ทำงานเลย' },
                { a: 'บอกความรู้สึก', b: 'รอเวลาที่เหมาะสม' },
              ].map((sample, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setOptionA(sample.a);
                    setOptionB(sample.b);
                  }}
                  className="text-sm bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-300 px-3 py-1.5 rounded-full transition-colors"
                >
                  {sample.a} vs {sample.b}
                </button>
              ))}
            </div>
          </div>

          {/* Start Button */}
          <div className="text-center">
            <button
              onClick={handleStartSelection}
              disabled={!canStart}
              className={`inline-flex items-center px-8 py-4 font-semibold rounded-xl shadow-lg transition-all duration-300 ${
                canStart
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white shadow-purple-500/30 hover:shadow-purple-500/50 hover:-translate-y-1'
                  : 'bg-slate-700 text-slate-500 cursor-not-allowed'
              }`}
            >
              <span className="text-xl mr-3">⚖️</span>
              {canStart ? 'เริ่มเปรียบเทียบตัวเลือก' : 'กรุณากรอกทั้ง 2 ตัวเลือก'}
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
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-950/20 to-slate-900 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="flex justify-center gap-3 mb-8">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-14 h-20 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-lg animate-pulse shadow-lg"
                style={{ animationDelay: `${i * 100}ms` }}
              />
            ))}
          </div>
          <h2 className="text-2xl font-bold text-cyan-300 mb-2">
            {readingState === 'shuffling' ? 'กำลังสับไพ่...' : 'กำลังจั่วไพ่ 5 ใบ...'}
          </h2>
          <p className="text-slate-400">โปรดรอสักครู่</p>
        </div>
      </div>
    );
  }

  // Revealing state
  if (readingState === 'revealing' && !allRevealed) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-950/20 to-slate-900 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-cyan-300 mb-2">เปิดไพ่ทีละใบ</h2>
          <p className="text-slate-400 mb-4">คลิกที่ไพ่ใบที่ {nextCardToReveal + 1} เพื่อเปิดเผย</p>

          {/* Options reminder */}
          <div className="flex justify-center gap-4 mb-8">
            <div className="px-4 py-2 rounded-lg bg-cyan-600/20 border border-cyan-500/50">
              <span className="text-cyan-400 font-medium">A:</span> {optionA}
            </div>
            <div className="px-4 py-2 rounded-lg bg-pink-600/20 border border-pink-500/50">
              <span className="text-pink-400 font-medium">B:</span> {optionB}
            </div>
          </div>

          {/* 5-Card Layout: 2 columns + center */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {/* Option A column */}
            <div className="md:col-span-2 space-y-4">
              <h3 className="text-cyan-400 font-medium mb-2">ตัวเลือก A: {optionA}</h3>
              {[0, 1].map((idx) => renderCard(idx))}
            </div>

            {/* Best Path center (mobile: full width at bottom) */}
            <div className="col-span-2 md:col-span-1 order-last md:order-none flex flex-col items-center justify-center">
              <h3 className="text-purple-400 font-medium mb-2">เส้นทางที่ดีที่สุด</h3>
              {renderCard(4)}
            </div>

            {/* Option B column */}
            <div className="md:col-span-2 space-y-4">
              <h3 className="text-pink-400 font-medium mb-2">ตัวเลือก B: {optionB}</h3>
              {[2, 3].map((idx) => renderCard(idx))}
            </div>
          </div>

          {/* Progress */}
          <div className="text-slate-500 text-sm">
            เปิดแล้ว {revealedCards.filter((r) => r).length} / 5 ใบ
          </div>
        </div>
      </div>
    );

    function renderCard(index: number) {
      const drawnCard = drawnCards[index];
      if (!drawnCard) return null;

      const pos = DECISION_POSITIONS[index];
      const posInfo = POSITION_LABELS[pos];
      const isRevealed = revealedCards[index];
      const canReveal = index === nextCardToReveal;

      return (
        <div key={index} className="flex flex-col items-center">
          <div className={`mb-2 px-3 py-1 rounded-full bg-gradient-to-r ${posInfo.color} text-white text-xs font-medium`}>
            {posInfo.emoji} {posInfo.th}
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
                ${canReveal ? 'cursor-pointer animate-pulse ring-2 ring-cyan-400 ring-offset-2 ring-offset-slate-900' : ''}
                ${!canReveal && !isRevealed ? 'opacity-50' : ''}
              `}
            />
            {canReveal && !isRevealed && (
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-cyan-400 text-xs animate-bounce whitespace-nowrap">
                👆 แตะเพื่อเปิด
              </div>
            )}
          </div>
        </div>
      );
    }
  }

  // Complete state - Show recommendation
  if ((readingState === 'revealing' || readingState === 'complete') && allRevealed) {
    const selectedCard = selectedCardIndex !== null ? drawnCards[selectedCardIndex] : null;
    const recommendation = getRecommendation();

    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-950/20 to-slate-900 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Options Header */}
          <div className="flex justify-center gap-4 mb-6">
            <div className="px-4 py-2 rounded-lg bg-cyan-600/20 border border-cyan-500/50">
              <span className="text-cyan-400 font-medium">A:</span> {optionA}
            </div>
            <div className="px-4 py-2 rounded-lg bg-pink-600/20 border border-pink-500/50">
              <span className="text-pink-400 font-medium">B:</span> {optionB}
            </div>
          </div>

          {/* Recommendation Banner */}
          {recommendation && (
            <div className="bg-gradient-to-r from-purple-600/30 to-pink-600/30 border border-purple-500/50 rounded-2xl p-6 mb-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-2">
                🎯 คำแนะนำ: {recommendation.recommendation === 'ทั้งสอง' ? 'พิจารณาเพิ่มเติม' : `ตัวเลือก ${recommendation.recommendation}`}
              </h2>
              <p className="text-slate-300 mb-3">{recommendation.message}</p>
              <div className="inline-block px-4 py-1 bg-purple-600/50 rounded-full text-purple-200 text-sm">
                ความมั่นใจ: {recommendation.confidence}
              </div>
            </div>
          )}

          {/* Cards Grid: Comparison Layout */}
          <div className="grid md:grid-cols-5 gap-4 mb-8">
            {/* Option A Cards */}
            <div className="md:col-span-2 space-y-4">
              <h3 className="text-center text-cyan-400 font-bold text-lg border-b border-cyan-500/30 pb-2">
                ตัวเลือก A: {optionA}
              </h3>
              {[0, 1].map((idx) => {
                const card = drawnCards[idx];
                const pos = DECISION_POSITIONS[idx];
                const posInfo = POSITION_LABELS[pos];
                const isSelected = selectedCardIndex === idx;

                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedCardIndex(idx)}
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                      isSelected ? 'bg-cyan-600/20 ring-2 ring-cyan-500' : 'bg-slate-800/50 hover:bg-slate-700/50'
                    }`}
                  >
                    <TarotCard
                      frontImage={card.card.imageUrl}
                      cardName={card.card.name}
                      size="sm"
                      isReversed={card.isReversed}
                      isFlipped={true}
                      showFlipAnimation={false}
                    />
                    <div className="flex-1">
                      <div className={`inline-block px-2 py-0.5 rounded-full bg-gradient-to-r ${posInfo.color} text-white text-xs font-medium mb-1`}>
                        {posInfo.emoji} {posInfo.th}
                      </div>
                      <p className="text-white font-medium text-sm">{card.card.nameTh}</p>
                      <p className={`text-xs ${card.isReversed ? 'text-red-400' : 'text-green-400'}`}>
                        {card.isReversed ? '🔄 กลับหัว' : '✨ ตั้งตรง'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Best Path - Center */}
            <div className="md:col-span-1 flex flex-col items-center">
              <h3 className="text-center text-purple-400 font-bold text-lg border-b border-purple-500/30 pb-2 mb-4 w-full">
                🎯 เส้นทาง
              </h3>
              <div
                onClick={() => setSelectedCardIndex(4)}
                className={`p-3 rounded-xl cursor-pointer transition-all ${
                  selectedCardIndex === 4 ? 'bg-purple-600/20 ring-2 ring-purple-500' : 'bg-slate-800/50 hover:bg-slate-700/50'
                }`}
              >
                <TarotCard
                  frontImage={drawnCards[4].card.imageUrl}
                  cardName={drawnCards[4].card.name}
                  size="sm"
                  isReversed={drawnCards[4].isReversed}
                  isFlipped={true}
                  showFlipAnimation={false}
                />
                <p className="text-center text-white font-medium text-sm mt-2">{drawnCards[4].card.nameTh}</p>
              </div>
            </div>

            {/* Option B Cards */}
            <div className="md:col-span-2 space-y-4">
              <h3 className="text-center text-pink-400 font-bold text-lg border-b border-pink-500/30 pb-2">
                ตัวเลือก B: {optionB}
              </h3>
              {[2, 3].map((idx) => {
                const card = drawnCards[idx];
                const pos = DECISION_POSITIONS[idx];
                const posInfo = POSITION_LABELS[pos];
                const isSelected = selectedCardIndex === idx;

                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedCardIndex(idx)}
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                      isSelected ? 'bg-pink-600/20 ring-2 ring-pink-500' : 'bg-slate-800/50 hover:bg-slate-700/50'
                    }`}
                  >
                    <TarotCard
                      frontImage={card.card.imageUrl}
                      cardName={card.card.name}
                      size="sm"
                      isReversed={card.isReversed}
                      isFlipped={true}
                      showFlipAnimation={false}
                    />
                    <div className="flex-1">
                      <div className={`inline-block px-2 py-0.5 rounded-full bg-gradient-to-r ${posInfo.color} text-white text-xs font-medium mb-1`}>
                        {posInfo.emoji} {posInfo.th}
                      </div>
                      <p className="text-white font-medium text-sm">{card.card.nameTh}</p>
                      <p className={`text-xs ${card.isReversed ? 'text-red-400' : 'text-green-400'}`}>
                        {card.isReversed ? '🔄 กลับหัว' : '✨ ตั้งตรง'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Card Detail */}
          {selectedCard && selectedCardIndex !== null && (
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 mb-8">
              <div className="text-center mb-6">
                <div className={`inline-block px-4 py-1 rounded-full bg-gradient-to-r ${POSITION_LABELS[DECISION_POSITIONS[selectedCardIndex]].color} text-white text-sm font-medium mb-4`}>
                  {POSITION_LABELS[DECISION_POSITIONS[selectedCardIndex]].emoji}{' '}
                  {POSITION_LABELS[DECISION_POSITIONS[selectedCardIndex]].th}
                </div>

                <h2 className="text-2xl md:text-3xl font-bold font-card text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300 mb-1">
                  {selectedCard.card.nameTh}
                </h2>
                <p className="text-cyan-400 font-card">{selectedCard.card.name}</p>
                <div className="flex justify-center items-center gap-3 text-sm text-slate-500 mt-2">
                  <span>{selectedCard.card.suit ? SUIT_NAMES[selectedCard.card.suit].th : 'ไพ่ใหญ่'}</span>
                  <span>•</span>
                  <span className={selectedCard.isReversed ? 'text-red-400' : 'text-green-400'}>
                    {selectedCard.isReversed ? '🔄 กลับหัว' : '✨ ตั้งตรง'}
                  </span>
                </div>
              </div>

              {/* Meaning */}
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
                    <div className="bg-cyan-900/20 border border-cyan-500/20 rounded-xl p-4">
                      <h3 className="text-lg font-bold text-cyan-300 mb-2">🔮 ความหมาย</h3>
                      <p className="text-slate-200 leading-relaxed">
                        {detailedMeaning.prediction}
                      </p>
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

          {/* Save Status */}
          {(isSaving || isSaved) && (
            <div className="text-center mb-6">
              {isSaving ? (
                <span className="text-cyan-400 text-sm animate-pulse">💾 กำลังบันทึก...</span>
              ) : isSaved ? (
                <span className="text-green-400 text-sm">✅ บันทึกแล้ว</span>
              ) : null}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={handleReset}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-medium rounded-xl transition-all duration-300"
            >
              🔄 ตัดสินใจใหม่
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

  return null;
}
