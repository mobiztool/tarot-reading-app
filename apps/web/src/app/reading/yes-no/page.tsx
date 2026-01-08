'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { useSaveReading } from '@/lib/hooks/useSaveReading';
import { useAnalytics } from '@/lib/hooks/useAnalytics';
import { useCards } from '@/lib/hooks/useCards';
import { DrawnCard } from '@/types/card';
import { TarotCard } from '@/components/cards/TarotCard';
import {
  interpretCardAsYesNo,
  YesNoResult,
  CONFIDENCE_LABELS,
  ANSWER_LABELS,
  ConfidenceLevel,
  drawYesNoCard,
} from '@/lib/tarot/yesNoInterpretation';

// Example questions
const EXAMPLE_QUESTIONS = [
  'ควรเปลี่ยนงานตอนนี้ไหม?',
  'เขาสนใจฉันจริงไหม?',
  'โอกาสนี้เหมาะกับฉันไหม?',
  'ควรลงทุนตอนนี้หรือยัง?',
  'จะได้เลื่อนตำแหน่งไหม?',
];

// Reading states
type ReadingState = 'initial' | 'shuffling' | 'drawn' | 'revealed' | 'complete';

// Minimum question length
const MIN_QUESTION_LENGTH = 10;

export default function YesNoSpreadPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { saveReading, isSaving } = useSaveReading();
  const { track } = useAnalytics();
  const { cards: deck, isLoading: cardsLoading } = useCards();

  // State
  const [question, setQuestion] = useState('');
  const [questionError, setQuestionError] = useState<string | null>(null);
  const [readingState, setReadingState] = useState<ReadingState>('initial');
  const [drawnCard, setDrawnCard] = useState<DrawnCard | null>(null);
  const [yesNoResult, setYesNoResult] = useState<YesNoResult | null>(null);
  const [savedReadingId, setSavedReadingId] = useState<string | null>(null);
  const [showFullMeaning, setShowFullMeaning] = useState(false);

  // Refs
  const startTimeRef = useRef<Date | null>(null);

  // Validate question
  const validateQuestion = useCallback((q: string): boolean => {
    if (!q.trim()) {
      setQuestionError('กรุณาพิมพ์คำถามของคุณ');
      return false;
    }
    if (q.trim().length < MIN_QUESTION_LENGTH) {
      setQuestionError(`คำถามต้องมีอย่างน้อย ${MIN_QUESTION_LENGTH} ตัวอักษร`);
      return false;
    }
    setQuestionError(null);
    return true;
  }, []);

  // Handle question change
  const handleQuestionChange = useCallback((value: string) => {
    setQuestion(value);
    if (questionError) {
      validateQuestion(value);
    }
  }, [questionError, validateQuestion]);

  // Use example question
  const handleExampleQuestion = useCallback((exampleQuestion: string) => {
    setQuestion(exampleQuestion);
    setQuestionError(null);
  }, []);

  // Start reading
  const handleStartReading = useCallback(async () => {
    if (!validateQuestion(question)) {
      return;
    }

    startTimeRef.current = new Date();
    setReadingState('shuffling');

    // Track start event
    track('yes_no_started', {
      question_length: question.length,
    });

    // Simulate shuffling delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Draw card
    const { card, isReversed } = drawYesNoCard(deck);

    const drawn: DrawnCard = {
      card,
      isReversed,
    };

    setDrawnCard(drawn);
    setReadingState('drawn');
  }, [question, validateQuestion, track]);

  // Reveal card and interpret
  const handleRevealCard = useCallback(async () => {
    if (!drawnCard) return;

    setReadingState('revealed');

    // Interpret the card
    const result = interpretCardAsYesNo(drawnCard.card, drawnCard.isReversed);
    setYesNoResult(result);

    // Track answer distribution
    track('yes_no_answer_distribution', {
      answer: result.answer,
      confidence: result.confidence,
    });

    // Short delay before showing complete state
    await new Promise((resolve) => setTimeout(resolve, 500));
    setReadingState('complete');

    // Save reading
    const saved = await saveReading('yes_no', [drawnCard], question);
    if (saved) {
      setSavedReadingId(saved.id);

      // Track completion
      const durationSeconds = startTimeRef.current
        ? Math.round((new Date().getTime() - startTimeRef.current.getTime()) / 1000)
        : 0;

      track('yes_no_completed', {
        reading_id: saved.id,
        answer: result.answer,
        duration_seconds: durationSeconds,
      });
    }
  }, [drawnCard, question, saveReading, track]);

  // Reset reading
  const handleReset = useCallback(() => {
    setQuestion('');
    setQuestionError(null);
    setReadingState('initial');
    setDrawnCard(null);
    setYesNoResult(null);
    setSavedReadingId(null);
    setShowFullMeaning(false);
    startTimeRef.current = null;
  }, []);

  // Loading state
  if (authLoading || cardsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-950 via-indigo-900 to-slate-900">
        <div className="animate-pulse text-violet-300">กำลังโหลด...</div>
      </div>
    );
  }

  // Get confidence bar width
  const confidencePercentage = yesNoResult
    ? CONFIDENCE_LABELS[yesNoResult.confidence].percentage
    : 0;

  return (
    <main className="min-h-screen bg-gradient-to-br from-violet-950 via-indigo-900 to-slate-900 text-white py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <Link
            href="/reading"
            className="inline-flex items-center text-violet-300 hover:text-violet-100 mb-4 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            กลับไปเลือกรูปแบบการดู
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-200 via-pink-200 to-amber-200 bg-clip-text text-transparent">
            🔮 Yes/No Question
          </h1>
          <p className="text-violet-300 mt-2">
            ถามคำถามใช่หรือไม่ รับคำตอบจากไพ่ 1 ใบ
          </p>
        </header>

        {/* Initial State - Question Input */}
        {readingState === 'initial' && (
          <div className="space-y-6">
            {/* Explanation */}
            <div className="bg-violet-900/40 rounded-xl p-6 border border-violet-700/50">
              <h2 className="text-lg font-semibold text-violet-100 mb-3 flex items-center gap-2">
                <span className="text-2xl">❓</span>
                วิธีถามคำถาม Yes/No
              </h2>
              <ul className="space-y-2 text-violet-300 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  ถามคำถามที่ตอบได้ว่า &quot;ใช่&quot; หรือ &quot;ไม่&quot;
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  ควรลงท้ายด้วยคำว่า &quot;ไหม?&quot; หรือ &quot;หรือเปล่า?&quot;
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  คำถามควรชัดเจนและเฉพาะเจาะจง
                </li>
              </ul>
            </div>

            {/* Question Input */}
            <div className="space-y-3">
              <label className="block text-violet-200 font-medium">
                คำถามของคุณ <span className="text-pink-400">*</span>
              </label>
              <textarea
                value={question}
                onChange={(e) => handleQuestionChange(e.target.value)}
                placeholder="พิมพ์คำถาม Yes/No ของคุณที่นี่..."
                rows={3}
                className={`w-full px-4 py-3 bg-violet-900/50 border rounded-xl text-white placeholder-violet-400 focus:outline-none focus:ring-2 transition-all resize-none ${
                  questionError
                    ? 'border-red-500 focus:ring-red-500/50'
                    : 'border-violet-600 focus:ring-violet-500/50'
                }`}
              />
              {questionError && (
                <p className="text-red-400 text-sm flex items-center gap-1">
                  <span>⚠️</span> {questionError}
                </p>
              )}
              <p className="text-violet-400 text-xs">
                {question.length}/{MIN_QUESTION_LENGTH}+ ตัวอักษร
              </p>
            </div>

            {/* Example Questions */}
            <div className="space-y-3">
              <p className="text-violet-300 text-sm">หรือเลือกตัวอย่างคำถาม:</p>
              <div className="flex flex-wrap gap-2">
                {EXAMPLE_QUESTIONS.map((example) => (
                  <button
                    key={example}
                    onClick={() => handleExampleQuestion(example)}
                    className="px-3 py-1.5 bg-violet-800/50 hover:bg-violet-700/50 border border-violet-600/50 rounded-full text-sm text-violet-200 transition-colors"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={handleStartReading}
              className="w-full py-4 bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 rounded-xl font-semibold text-lg shadow-lg shadow-violet-900/50 transition-all transform hover:scale-[1.02]"
            >
              🎴 จั่วไพ่รับคำตอบ
            </button>
          </div>
        )}

        {/* Shuffling State */}
        {readingState === 'shuffling' && (
          <div className="text-center py-16 space-y-6">
            <div className="text-6xl animate-bounce">🔮</div>
            <p className="text-violet-200 text-xl">กำลังสับไพ่...</p>
            <p className="text-violet-400 text-sm">&quot;{question}&quot;</p>
          </div>
        )}

        {/* Card Drawn - Ready to Reveal */}
        {readingState === 'drawn' && drawnCard && (
          <div className="text-center space-y-6">
            <p className="text-violet-300 mb-4">&quot;{question}&quot;</p>
            <p className="text-violet-200 text-lg mb-6">คลิกที่ไพ่เพื่อเปิดดูคำตอบ</p>

            <div className="flex justify-center">
              <div
                onClick={handleRevealCard}
                className="cursor-pointer transform transition-all hover:scale-105"
              >
                <TarotCard
                  frontImage={drawnCard.card.imageUrl}
                  cardName={drawnCard.card.name}
                  isReversed={drawnCard.isReversed}
                  isFlipped={false}
                  size="lg"
                />
              </div>
            </div>
          </div>
        )}

        {/* Result State */}
        {(readingState === 'revealed' || readingState === 'complete') &&
          drawnCard &&
          yesNoResult && (
            <div className="space-y-6">
              {/* Question */}
              <div className="text-center">
                <p className="text-violet-400 text-sm">คำถามของคุณ:</p>
                <p className="text-violet-100 text-lg font-medium">
                  &quot;{question}&quot;
                </p>
              </div>

              {/* Big Answer Badge */}
              <div className="flex justify-center">
                <div
                  className={`px-12 py-6 rounded-2xl bg-gradient-to-r ${ANSWER_LABELS[yesNoResult.answer].color} shadow-2xl transform animate-pulse`}
                >
                  <div className="text-center">
                    <div className="text-5xl mb-2">
                      {ANSWER_LABELS[yesNoResult.answer].emoji}
                    </div>
                    <div className="text-4xl font-bold">
                      {ANSWER_LABELS[yesNoResult.answer].th}
                    </div>
                    <div className="text-lg opacity-80">
                      {ANSWER_LABELS[yesNoResult.answer].en}
                    </div>
                  </div>
                </div>
              </div>

              {/* Confidence Level */}
              <div className="bg-violet-900/40 rounded-xl p-4 border border-violet-700/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-violet-300 text-sm">ระดับความมั่นใจ:</span>
                  <span className="text-violet-100 font-medium flex items-center gap-1">
                    {CONFIDENCE_LABELS[yesNoResult.confidence].emoji}
                    {CONFIDENCE_LABELS[yesNoResult.confidence].th}
                  </span>
                </div>
                {/* Confidence Bar */}
                <div className="w-full bg-violet-950/50 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${CONFIDENCE_LABELS[yesNoResult.confidence].color} transition-all duration-1000`}
                    style={{ width: `${confidencePercentage}%` }}
                  />
                </div>
                <p className="text-violet-400 text-xs text-right mt-1">
                  {confidencePercentage}%
                </p>
              </div>

              {/* Card Display */}
              <div className="flex justify-center">
                <TarotCard
                  frontImage={drawnCard.card.imageUrl}
                  cardName={drawnCard.card.name}
                  isReversed={drawnCard.isReversed}
                  isFlipped={true}
                  size="lg"
                />
              </div>

              {/* Card Info */}
              <div className="text-center">
                <h3 className="text-xl font-semibold text-violet-100">
                  {drawnCard.card.nameTh || drawnCard.card.name}
                  {drawnCard.isReversed && (
                    <span className="text-pink-400 ml-2">(กลับหัว)</span>
                  )}
                </h3>
              </div>

              {/* Short Explanation */}
              <div className="bg-violet-900/40 rounded-xl p-5 border border-violet-700/50">
                <p className="text-violet-100 text-center leading-relaxed">
                  {yesNoResult.shortExplanation}
                </p>
              </div>

              {/* Full Explanation (Expandable) */}
              <div className="bg-violet-900/30 rounded-xl border border-violet-700/30 overflow-hidden">
                <button
                  onClick={() => setShowFullMeaning(!showFullMeaning)}
                  className="w-full px-5 py-4 flex items-center justify-between text-violet-200 hover:bg-violet-800/20 transition-colors"
                >
                  <span className="font-medium">📖 คำอธิบายเพิ่มเติม</span>
                  <svg
                    className={`w-5 h-5 transition-transform ${showFullMeaning ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {showFullMeaning && (
                  <div className="px-5 pb-5 space-y-4">
                    <p className="text-violet-300 leading-relaxed">
                      {yesNoResult.explanation}
                    </p>

                    {/* Card Meaning */}
                    <div className="pt-4 border-t border-violet-700/30 space-y-3">
                      <div>
                        <h4 className="text-violet-200 font-medium mb-1">
                          {drawnCard.isReversed
                            ? '✦ ความหมายกลับหัว:'
                            : '✦ ความหมายหงายหน้า:'}
                        </h4>
                        <p className="text-violet-400 text-sm">
                          {drawnCard.isReversed
                            ? drawnCard.card.meaningReversed
                            : drawnCard.card.meaningUpright}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-violet-200 font-medium mb-1">
                          💡 คำแนะนำ:
                        </h4>
                        <p className="text-violet-400 text-sm">{drawnCard.card.advice}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Saving Status */}
              {isSaving && (
                <p className="text-center text-violet-400 text-sm animate-pulse">
                  กำลังบันทึก...
                </p>
              )}

              {savedReadingId && (
                <p className="text-center text-green-400 text-sm">
                  ✓ บันทึกเรียบร้อยแล้ว
                </p>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  onClick={handleReset}
                  className="flex-1 py-3 bg-violet-700/50 hover:bg-violet-600/50 border border-violet-600 rounded-xl font-medium transition-colors"
                >
                  🔄 ถามคำถามใหม่
                </button>
                <Link
                  href="/reading"
                  className="flex-1 py-3 bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 rounded-xl font-medium text-center transition-colors"
                >
                  🎴 ลองรูปแบบอื่น
                </Link>
              </div>
            </div>
          )}
      </div>
    </main>
  );
}
