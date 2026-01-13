'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { TarotCard } from '@/components/cards';
import { useTarotReading, useCards, useSaveReading, useAuth, useAnalytics } from '@/lib/hooks';
import { SUIT_NAMES } from '@/types/card';
import { generateDetailedPrediction } from '@/lib/tarot/cardMeanings';
import { PageLoader } from '@/components/ui/MysticalLoader';

// Position labels สำหรับ Love Spread
const POSITION_LABELS = {
  you: { th: 'คุณ', en: 'You', emoji: '💜', color: 'from-pink-500 to-rose-600', description: 'ความรู้สึกและทัศนคติของคุณ' },
  other: { th: 'คู่ของคุณ', en: 'The Other', emoji: '💙', color: 'from-blue-500 to-indigo-600', description: 'มุมมองและความรู้สึกของอีกฝ่าย' },
  relationship_energy: { th: 'พลังความสัมพันธ์', en: 'Relationship Energy', emoji: '❤️', color: 'from-red-500 to-pink-600', description: 'พลังงานและทิศทางของความสัมพันธ์' },
};

// Example questions สำหรับ Love Spread
const LOVE_QUESTIONS = [
  'จะเจอคนที่ใช่ไหม?',
  'ความสัมพันธ์จะดีขึ้นไหม?',
  'ควรเปิดใจหรือรอดูก่อน?',
  'เขา/เธอคิดอย่างไรกับฉัน?',
  'เราจะมีอนาคตร่วมกันไหม?',
];

export default function LoveReadingPage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading, isAuthenticated } = useAuth();
  const { trackLoveSpreadStarted, trackLoveSpreadCompleted, trackLoginPromptShown } = useAnalytics();
  const [question, setQuestion] = useState('');
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
  const [nextCardToReveal, setNextCardToReveal] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const hasSavedRef = useRef(false);
  const hasTrackedLoginPromptRef = useRef(false);

  // Fetch real cards from database
  const { cards, isLoading: isLoadingCards } = useCards();

  // Use tarot reading with real cards
  const { readingState, drawnCards, revealedCards, startReading, revealCard, resetReading } =
    useTarotReading(cards.length > 0 ? cards : undefined);

  // Save reading hook
  const { saveReading, isSaving } = useSaveReading();

  const allRevealed = revealedCards.every((r) => r);

  // Track login prompt shown
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated && !hasTrackedLoginPromptRef.current) {
      trackLoginPromptShown('love_spread');
      hasTrackedLoginPromptRef.current = true;
    }
  }, [isAuthLoading, isAuthenticated, trackLoginPromptShown]);

  // Redirect if not authenticated (after loading)
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push('/auth/login?redirectTo=/reading/love');
    }
  }, [isAuthLoading, isAuthenticated, router]);

  const handleStartReading = () => {
    // Track love spread started
    trackLoveSpreadStarted(!!question);
    setStartTime(Date.now());
    
    startReading('love', question || undefined);
    setSelectedCardIndex(null);
    setNextCardToReveal(0);
    setIsSaved(false);
    hasSavedRef.current = false;
  };

  const handleRevealCard = (index: number) => {
    if (index === nextCardToReveal && !revealedCards[index]) {
      revealCard(index);
      setNextCardToReveal(index + 1);
    }
  };

  const handleReset = () => {
    resetReading();
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
    if (allRevealed && drawnCards.length === 3 && !hasSavedRef.current && user) {
      hasSavedRef.current = true;
      saveReading('love_relationships', drawnCards, question || undefined).then((result) => {
        if (result) {
          setIsSaved(true);
          // Track love spread completed
          const duration = startTime ? Math.round((Date.now() - startTime) / 1000) : 0;
          trackLoveSpreadCompleted(result.id, duration);
        }
      });
    }
  }, [allRevealed, drawnCards, question, saveReading, user, startTime, trackLoveSpreadCompleted]);

  // Loading auth
  if (isAuthLoading) {
    return <PageLoader message="กำลังตรวจสอบ..." />;
  }

  // Not authenticated - show login gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-rose-950/20 to-slate-900 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-pink-400 to-rose-600 rounded-full flex items-center justify-center shadow-lg shadow-pink-500/30">
            <span className="text-5xl">💕</span>
          </div>
          <h2 className="text-2xl font-bold text-pink-300 mb-4">กรุณาเข้าสู่ระบบ</h2>
          <p className="text-slate-400 mb-8">
            การดูดวงความรักต้องลงชื่อเข้าใช้เพื่อบันทึกประวัติการดูดวงของคุณ
          </p>
          <Link
            href="/auth/login?redirectTo=/reading/love"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white font-semibold rounded-xl shadow-lg shadow-pink-500/30 transition-all duration-300 hover:-translate-y-1"
          >
            <span className="text-xl mr-3">🔐</span>
            เข้าสู่ระบบ
          </Link>
          <div className="mt-6">
            <Link href="/reading" className="text-slate-500 hover:text-slate-300 transition-colors">
              ← เลือกรูปแบบอื่น
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Loading cards from database
  if (isLoadingCards) {
    return <PageLoader message="กำลังโหลดไพ่..." />;
  }

  // Idle state - Show question input and start button
  if (readingState === 'idle') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-rose-950/20 to-slate-900 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-pink-400 to-rose-600 rounded-full flex items-center justify-center shadow-lg shadow-pink-500/30">
              <span className="text-4xl">💕</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-rose-300 mb-4">
              ดูดวงความรัก
            </h1>
            <p className="text-slate-400 text-lg">Love & Relationships Spread</p>
          </div>

          {/* Position Preview */}
          <div className="flex justify-center gap-4 mb-8">
            {(['you', 'other', 'relationship_energy'] as const).map((pos) => (
              <div key={pos} className="text-center">
                <div
                  className={`w-16 h-24 md:w-20 md:h-28 rounded-xl bg-gradient-to-br ${POSITION_LABELS[pos].color} opacity-30 flex items-center justify-center mb-2`}
                >
                  <span className="text-2xl">{POSITION_LABELS[pos].emoji}</span>
                </div>
                <p className="text-sm text-slate-400">{POSITION_LABELS[pos].th}</p>
              </div>
            ))}
          </div>

          {/* Spread Explanation */}
          <div className="bg-rose-900/20 border border-rose-500/30 rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-rose-300 mb-4 flex items-center">
              <span className="mr-2">💡</span>
              ความหมายของตำแหน่งไพ่
            </h3>
            <div className="space-y-3">
              {(['you', 'other', 'relationship_energy'] as const).map((pos) => (
                <div key={pos} className="flex items-start gap-3">
                  <span className="text-xl">{POSITION_LABELS[pos].emoji}</span>
                  <div>
                    <p className="text-slate-200 font-medium">{POSITION_LABELS[pos].th}</p>
                    <p className="text-slate-400 text-sm">{POSITION_LABELS[pos].description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Question Input */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 mb-8">
            <label htmlFor="question" className="block text-pink-300 font-medium mb-3">
              คำถามเกี่ยวกับความรักของคุณ <span className="text-slate-500">(ไม่จำเป็น)</span>
            </label>
            <textarea
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="เช่น ความสัมพันธ์ของเราจะเป็นอย่างไร? เขา/เธอคิดอย่างไรกับฉัน?"
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
              {LOVE_QUESTIONS.map((sample) => (
                <button
                  key={sample}
                  onClick={() => setQuestion(sample)}
                  className="text-sm bg-rose-900/30 hover:bg-rose-800/40 text-rose-300 hover:text-rose-200 px-3 py-1.5 rounded-full transition-colors border border-rose-500/30"
                >
                  {sample}
                </button>
              ))}
            </div>
          </div>

          {/* Start Button */}
          <div className="text-center">
            <button
              onClick={handleStartReading}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white font-semibold rounded-xl shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 transition-all duration-300 hover:-translate-y-1"
            >
              <span className="text-xl mr-3">💕</span>
              เริ่มดูดวงความรัก
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
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-rose-950/20 to-slate-900 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="flex justify-center gap-4 mb-8">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-16 h-24 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl animate-pulse shadow-lg"
                style={{ animationDelay: `${i * 200}ms` }}
              />
            ))}
          </div>
          <h2 className="text-2xl font-bold text-pink-300 mb-2">
            {readingState === 'shuffling' ? 'กำลังสับไพ่...' : 'กำลังจั่วไพ่ 3 ใบ...'}
          </h2>
          <p className="text-slate-400">โปรดรอสักครู่</p>
        </div>
      </div>
    );
  }

  // Revealing state - Show cards to flip sequentially
  if (readingState === 'revealing' && !allRevealed) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-rose-950/20 to-slate-900 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-pink-300 mb-2">เปิดไพ่ทีละใบ</h2>
          <p className="text-slate-400 mb-8">คลิกที่ไพ่ใบที่ {nextCardToReveal + 1} เพื่อเปิดเผย</p>

          {/* Three Cards Layout */}
          <div className="flex justify-center items-center gap-4 md:gap-8 mb-8 flex-wrap">
            {drawnCards.map((drawnCard, index) => {
              const positions = ['you', 'other', 'relationship_energy'] as const;
              const pos = positions[index];
              const isRevealed = revealedCards[index];
              const canReveal = index === nextCardToReveal;

              return (
                <div key={index} className="flex flex-col items-center">
                  {/* Position Label */}
                  <div
                    className={`mb-4 px-4 py-2 rounded-full bg-gradient-to-r ${POSITION_LABELS[pos].color} text-white text-sm font-medium`}
                  >
                    {POSITION_LABELS[pos].emoji} {POSITION_LABELS[pos].th}
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
                        ${canReveal ? 'cursor-pointer animate-pulse ring-2 ring-pink-400 ring-offset-2 ring-offset-slate-900' : ''}
                        ${!canReveal && !isRevealed ? 'opacity-50' : ''}
                      `}
                    />
                    {canReveal && !isRevealed && (
                      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-pink-400 text-xs animate-bounce whitespace-nowrap">
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
            เปิดแล้ว {revealedCards.filter((r) => r).length} / 3 ใบ
          </div>
        </div>
      </div>
    );
  }

  // Complete state - Show all revealed cards and interpretation
  if ((readingState === 'revealing' || readingState === 'complete') && allRevealed) {
    const selectedCard = selectedCardIndex !== null ? drawnCards[selectedCardIndex] : null;
    const positions = ['you', 'other', 'relationship_energy'] as const;

    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-rose-950/20 to-slate-900 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Question display */}
          {question && (
            <div className="text-center mb-6">
              <p className="text-slate-500 text-sm mb-1">คำถามของคุณ:</p>
              <p className="text-pink-300 text-lg italic">&ldquo;{question}&rdquo;</p>
            </div>
          )}

          {/* Three Cards Layout */}
          <div className="flex justify-center items-start gap-3 md:gap-6 mb-8 flex-wrap">
            {drawnCards.map((drawnCard, index) => {
              const pos = positions[index];
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
                    className={`mb-3 px-3 py-1 rounded-full bg-gradient-to-r ${POSITION_LABELS[pos].color} text-white text-xs font-medium`}
                  >
                    {POSITION_LABELS[pos].emoji} {POSITION_LABELS[pos].th}
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
                      isSelected ? 'ring-2 ring-pink-400 ring-offset-2 ring-offset-slate-900' : ''
                    }
                  />

                  {/* Card Name */}
                  <p className="mt-2 text-xs text-center text-slate-400 max-w-[80px] truncate font-card">
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
                  className={`inline-block px-4 py-1 rounded-full bg-gradient-to-r ${POSITION_LABELS[positions[selectedCardIndex]].color} text-white text-sm font-medium mb-4`}
                >
                  {POSITION_LABELS[positions[selectedCardIndex]].emoji}{' '}
                  {POSITION_LABELS[positions[selectedCardIndex]].th}
                </div>

                <h2 className="text-2xl md:text-3xl font-bold font-card text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-rose-300 mb-1">
                  {selectedCard.card.nameTh}
                </h2>
                <p className="text-pink-400 font-card">{selectedCard.card.name}</p>
                <div className="flex justify-center items-center gap-3 text-sm text-slate-500 mt-2">
                  <span>{selectedCard.card.suit ? SUIT_NAMES[selectedCard.card.suit].th : 'Major Arcana'}</span>
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
                    className="px-3 py-1 bg-pink-900/50 text-pink-300 rounded-full text-sm"
                  >
                    {keyword}
                  </span>
                ))}
              </div>

              {/* Position-Specific Interpretation */}
              <div className="bg-rose-900/20 border border-rose-500/20 rounded-xl p-4 mb-4">
                <h3 className="text-lg font-bold text-rose-300 mb-2">
                  {POSITION_LABELS[positions[selectedCardIndex]].emoji} ในตำแหน่ง &quot;{POSITION_LABELS[positions[selectedCardIndex]].th}&quot;
                </h3>
                <p className="text-slate-200 leading-relaxed">
                  {getPositionInterpretation(selectedCard.card.nameTh, selectedCard.isReversed, positions[selectedCardIndex])}
                </p>
              </div>

              {/* Enhanced Meaning (Love Focus) */}
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
                    <div className="bg-pink-900/20 border border-pink-500/20 rounded-xl p-4">
                      <h3 className="text-base font-bold text-pink-300 mb-2">💕 ความหมายด้านความรัก</h3>
                      <p className="text-slate-300 leading-relaxed text-sm">
                        {detailedMeaning.love}
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

          {/* Relationship Advice Section */}
          <div className="bg-gradient-to-br from-rose-900/30 to-pink-900/20 border border-rose-500/30 rounded-2xl p-6 mb-8">
            <h3 className="text-xl font-bold text-rose-300 mb-4 flex items-center">
              <span className="mr-2">💝</span>
              คำแนะนำสำหรับความสัมพันธ์
            </h3>
            <p className="text-slate-200 leading-relaxed">
              {generateRelationshipAdvice(drawnCards)}
            </p>
          </div>

          {/* Quick Navigation */}
          <div className="text-center mb-8">
            <p className="text-slate-500 text-sm mb-3">คลิกไพ่ด้านบนเพื่อดูรายละเอียด</p>
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
              🔄 ดูอีกครั้ง
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

// Helper function: Generate position-specific interpretation
function getPositionInterpretation(
  cardName: string,
  isReversed: boolean,
  position: 'you' | 'other' | 'relationship_energy'
): string {
  const positionContext = {
    you: {
      upright: `ไพ่ ${cardName} ในตำแหน่ง "คุณ" บ่งบอกว่าคุณกำลังอยู่ในช่วงที่ พลังงานของไพ่ใบนี้กำลังส่งผลต่อความรู้สึกและทัศนคติของคุณในเรื่องความรัก คุณควรใช้พลังงานเชิงบวกนี้เพื่อเปิดใจและสร้างความสัมพันธ์ที่ดี`,
      reversed: `ไพ่ ${cardName} กลับหัวในตำแหน่ง "คุณ" แสดงว่าคุณอาจกำลังเผชิญกับความขัดแย้งภายในใจ หรือมีสิ่งที่ยังไม่ได้รับการแก้ไข ลองมองเข้าไปในตัวเองและยอมรับความรู้สึกที่แท้จริง`,
    },
    other: {
      upright: `ไพ่ ${cardName} ในตำแหน่ง "คู่ของคุณ" สะท้อนถึงพลังงานและมุมมองของอีกฝ่าย พวกเขาอาจกำลังรู้สึกหรือแสดงออกในทิศทางที่ไพ่ใบนี้บ่งบอก การเข้าใจมุมมองนี้จะช่วยให้ความสัมพันธ์ราบรื่นขึ้น`,
      reversed: `ไพ่ ${cardName} กลับหัวในตำแหน่ง "คู่ของคุณ" อาจหมายความว่าอีกฝ่ายกำลังมีความสับสนหรือไม่แน่ใจในความรู้สึก ควรให้เวลาและพื้นที่แก่กันและกัน`,
    },
    relationship_energy: {
      upright: `ไพ่ ${cardName} ในตำแหน่ง "พลังความสัมพันธ์" แสดงถึงพลังงานโดยรวมที่กำลังไหลเวียนในความสัมพันธ์ของคุณ นี่เป็นสัญญาณที่ดีที่บ่งบอกถึงทิศทางและศักยภาพของความสัมพันธ์`,
      reversed: `ไพ่ ${cardName} กลับหัวในตำแหน่ง "พลังความสัมพันธ์" บ่งบอกว่าอาจมีอุปสรรคหรือความท้าทายในความสัมพันธ์ แต่นี่ก็เป็นโอกาสที่จะเติบโตและเรียนรู้ร่วมกัน`,
    },
  };

  return isReversed ? positionContext[position].reversed : positionContext[position].upright;
}

// Helper function: Generate combined relationship advice
function generateRelationshipAdvice(drawnCards: { card: { nameTh: string }; isReversed: boolean }[]): string {
  const cardCount = drawnCards.length;
  const reversedCount = drawnCards.filter(c => c.isReversed).length;

  if (reversedCount === 0) {
    return `ไพ่ทั้ง ${cardCount} ใบตั้งตรงทั้งหมด นี่เป็นสัญญาณที่ดีมากสำหรับความสัมพันธ์ของคุณ พลังงานเชิงบวกกำลังไหลเวียนและช่วยเสริมสร้างความรักของคุณ จงเปิดใจและไว้วางใจในกระบวนการของความรัก`;
  } else if (reversedCount === cardCount) {
    return `ไพ่ทั้ง ${cardCount} ใบกลับหัว นี่อาจเป็นช่วงเวลาแห่งการทบทวนและเรียนรู้ ลองมองเข้าไปในตัวเองและความสัมพันธ์ว่ามีอะไรที่ต้องปรับปรุงหรือแก้ไข การเผชิญหน้ากับความจริงจะนำไปสู่การเติบโต`;
  } else {
    return `มีทั้งไพ่ตั้งตรงและกลับหัว แสดงถึงความสมดุลระหว่างความท้าทายและโอกาส จงใช้พลังงานเชิงบวกจากไพ่ตั้งตรงเพื่อเอาชนะอุปสรรค และเรียนรู้จากบทเรียนที่ไพ่กลับหัวมอบให้ ความสัมพันธ์ทุกความสัมพันธ์ต้องอาศัยความพยายามและความเข้าใจซึ่งกันและกัน`;
  }
}

