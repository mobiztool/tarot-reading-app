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

// Shadow Work 7 Position Type
type ShadowWorkPosition =
  | 'sw_conscious_self'
  | 'sw_shadow'
  | 'sw_fear'
  | 'sw_denied_strength'
  | 'sw_integration'
  | 'sw_healing'
  | 'sw_wholeness';

// Shadow Work 7 Position Labels (Deep Psychology-focused)
const SHADOW_WORK_POSITIONS: ShadowWorkPosition[] = [
  'sw_conscious_self',
  'sw_shadow',
  'sw_fear',
  'sw_denied_strength',
  'sw_integration',
  'sw_healing',
  'sw_wholeness',
];

const POSITION_LABELS: Record<
  ShadowWorkPosition,
  {
    th: string;
    en: string;
    emoji: string;
    color: string;
    shortTh: string;
    description: string;
    psychologyNote: string;
    journalPrompt: string;
  }
> = {
  sw_conscious_self: {
    th: 'ตัวตนที่รู้สำนึก',
    en: 'Conscious Self',
    emoji: '☀️',
    color: 'from-amber-500 to-yellow-600',
    shortTh: 'สำนึก',
    description: 'ตัวตนที่คุณรู้จักและแสดงออกในชีวิตประจำวัน',
    psychologyNote: 'Persona หรือหน้ากากที่คุณสวมให้โลกเห็น — ด้านที่คุณยอมรับและภูมิใจ',
    journalPrompt: 'ฉันแสดงตัวตนแบบไหนให้คนอื่นเห็น? สิ่งนี้สะท้อนตัวตนที่แท้จริงแค่ไหน?',
  },
  sw_shadow: {
    th: 'เงาในตัวตน',
    en: 'Shadow Self',
    emoji: '🌑',
    color: 'from-slate-700 to-slate-900',
    shortTh: 'เงา',
    description: 'ด้านที่คุณปฏิเสธหรือซ่อนจากตัวเองและผู้อื่น',
    psychologyNote: 'Shadow ตามทฤษฎี Carl Jung — ส่วนที่ถูกกดทับในจิตไร้สำนึก',
    journalPrompt: 'มีด้านไหนของตัวเองที่ฉันพยายามซ่อนหรือปฏิเสธ? ทำไมฉันจึงไม่ยอมรับมัน?',
  },
  sw_fear: {
    th: 'ความกลัวที่ซ่อนอยู่',
    en: 'Hidden Fear',
    emoji: '👁️',
    color: 'from-indigo-600 to-purple-800',
    shortTh: 'กลัว',
    description: 'ความกลัวที่ฝังลึกและขับเคลื่อนพฤติกรรมของคุณ',
    psychologyNote: 'ความกลัวที่ไม่ถูกเผชิญหน้ามักควบคุมเราจากเบื้องหลัง',
    journalPrompt: 'ความกลัวอะไรที่ฉันหลีกเลี่ยงที่จะเผชิญ? มันส่งผลต่อการตัดสินใจอย่างไร?',
  },
  sw_denied_strength: {
    th: 'พลังที่ถูกปฏิเสธ',
    en: 'Denied Strength',
    emoji: '💎',
    color: 'from-emerald-600 to-teal-700',
    shortTh: 'พลัง',
    description: 'ความสามารถที่คุณมีแต่ไม่กล้ายอมรับหรือใช้',
    psychologyNote: 'Golden Shadow — ด้านดีที่ถูกกดทับเพราะความไม่มั่นใจหรือความกลัว',
    journalPrompt: 'มีความสามารถอะไรที่คนอื่นเห็นในตัวฉัน แต่ฉันไม่กล้ายอมรับ?',
  },
  sw_integration: {
    th: 'การรวมเป็นหนึ่ง',
    en: 'Integration Path',
    emoji: '🔗',
    color: 'from-violet-500 to-purple-600',
    shortTh: 'รวม',
    description: 'วิธีการยอมรับและรวมเงาเข้ากับตัวตน',
    psychologyNote: 'กระบวนการ Integration คือการยอมรับทุกด้านของตัวเองอย่างสมบูรณ์',
    journalPrompt: 'ฉันจะยอมรับด้านที่ปฏิเสธของตัวเองได้อย่างไร? ขั้นตอนแรกคืออะไร?',
  },
  sw_healing: {
    th: 'เส้นทางการเยียวยา',
    en: 'Healing Path',
    emoji: '💚',
    color: 'from-green-500 to-emerald-600',
    shortTh: 'เยียวยา',
    description: 'สิ่งที่จะช่วยเยียวยาบาดแผลภายใน',
    psychologyNote: 'การเยียวยาเกิดขึ้นเมื่อเราเผชิญหน้าและยอมรับความเจ็บปวด',
    journalPrompt: 'อะไรที่จะช่วยเยียวยาใจฉัน? ฉันต้องให้อภัยใครหรืออะไร?',
  },
  sw_wholeness: {
    th: 'ความครบถ้วน',
    en: 'Wholeness',
    emoji: '⭐',
    color: 'from-amber-400 to-orange-500',
    shortTh: 'ครบถ้วน',
    description: 'ภาพของตัวตนที่สมบูรณ์เมื่อรวมทุกด้านเข้าด้วยกัน',
    psychologyNote: 'Individuation — กระบวนการกลายเป็นตัวเองอย่างแท้จริง',
    journalPrompt: 'เมื่อฉันยอมรับทุกด้านของตัวเอง ฉันจะเป็นคนแบบไหน?',
  },
};

// Shadow work reflection questions
const SHADOW_WORK_QUESTIONS = [
  'ฉันต้องการเข้าใจด้านมืดของตัวเองอย่างไร?',
  'อะไรคือสิ่งที่ฉันปฏิเสธเกี่ยวกับตัวเอง?',
  'ทำไมฉันจึงรู้สึกไม่สมบูรณ์?',
  'บาดแผลอะไรที่ฉันต้องเยียวยา?',
  'ฉันจะกลายเป็นตัวเองที่แท้จริงได้อย่างไร?',
];

export default function ShadowWorkReadingPage(): React.JSX.Element | null {
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
        const response = await fetch('/api/access-check?spread=shadow_work');
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
    trackReadingStarted?.('shadow_work', !!question);
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

    if (newSelectedIndices.length < 7) {
      setSelectionStep(newSelectedIndices.length);
    } else {
      // All 7 cards selected, start reading after brief delay
      setTimeout(() => {
        startReading('shadow-work' as Parameters<typeof startReading>[0], question || undefined);
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
    if (allRevealed && drawnCards.length === 7 && !hasSavedRef.current && user) {
      hasSavedRef.current = true;
      saveReading('shadow_work' as Parameters<typeof saveReading>[0], drawnCards, question || undefined).then((result) => {
        if (result) {
          setIsSaved(true);
          // Track spread completed
          const duration = startTime ? Math.round((Date.now() - startTime) / 1000) : 0;
          trackReadingCompleted?.('shadow_work', result.id, duration);
        }
      });
    }
  }, [allRevealed, drawnCards, question, saveReading, user, startTime, trackReadingCompleted]);

  // Loading states
  if (isLoadingAuth || !accessCheck.checked) {
    return <PageLoader message="กำลังตรวจสอบสิทธิ์..." />;
  }

  // VIP gate - show if user doesn't have access (VIP-only feature)
  if (!accessCheck.allowed) {
    const spreadInfo = SPREAD_INFO.shadow_work;
    return (
      <PremiumGate
        spreadName="shadow-work"
        spreadNameTh={spreadInfo.nameTh}
        spreadIcon={spreadInfo.icon}
        requiredTier="vip"
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
    const currentPosition = SHADOW_WORK_POSITIONS[selectionStep];
    const posInfo = POSITION_LABELS[currentPosition];

    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950/30 to-slate-950 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header with current position */}
          <div className="text-center mb-4">
            <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-300 to-indigo-300 mb-2">
              เลือกไพ่ใบที่ {selectionStep + 1}/7
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

          {/* Progress Indicator */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {SHADOW_WORK_POSITIONS.map((pos, idx) => {
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
                  {idx < selectionStep ? <span className="text-green-400">✓</span> : <span>{info.emoji}</span>}
                  <span className={`${idx <= selectionStep ? 'text-white' : 'text-slate-500'}`}>{info.shortTh}</span>
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
                {SHADOW_WORK_POSITIONS.map((pos, idx) => (
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
              <span className="text-indigo-400 text-lg font-medium">🌑 กำลังเข้าสู่โลกแห่งเงา...</span>
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

  // Idle state - Show question input, trigger warning, and start button
  if (readingState === 'idle') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950/30 to-slate-950 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-slate-600 to-indigo-800 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="text-4xl">🌑</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-300 to-indigo-300 mb-4">
              Shadow Work
            </h1>
            <p className="text-slate-400 text-lg">งานเงา • 7 ไพ่ • การสำรวจจิตใต้สำนึก</p>
            <div className="mt-4 inline-block px-4 py-1 bg-gradient-to-r from-indigo-600 to-purple-700 rounded-full text-white text-sm font-medium">
              👑 VIP Exclusive
            </div>
          </div>

          {/* Trigger Warning */}
          <div className="bg-amber-900/30 border border-amber-500/40 rounded-2xl p-6 mb-8">
            <h2 className="text-lg font-semibold text-amber-300 mb-3 flex items-center gap-2">
              <span>⚠️</span>
              คำเตือนก่อนเริ่ม
            </h2>
            <p className="text-amber-100/80 leading-relaxed text-sm mb-3">
              การทำ Shadow Work เป็นกระบวนการสำรวจตัวตนที่ลึกซึ้ง ซึ่งอาจทำให้เกิดอารมณ์รุนแรงหรือความรู้สึกไม่สบายใจ
              หากคุณกำลังประสบปัญหาสุขภาพจิตหรืออยู่ในช่วงที่ไม่มั่นคงทางอารมณ์
              แนะนำให้ปรึกษาผู้เชี่ยวชาญก่อนดำเนินการ
            </p>
            <p className="text-amber-200/60 text-xs">
              💡 หากรู้สึกไม่สบายใจระหว่างทำ สามารถหยุดพักได้ตลอดเวลา
            </p>
          </div>

          {/* Psychology-focused Description */}
          <div className="bg-slate-800/50 border border-indigo-500/30 rounded-2xl p-6 mb-8">
            <h2 className="text-lg font-semibold text-indigo-300 mb-3">🧠 เกี่ยวกับ Shadow Work</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              Shadow Work มีพื้นฐานจากทฤษฎีของ Carl Jung นักจิตวิทยาชาวสวิส
              ผู้เชื่อว่ามนุษย์ทุกคนมี &ldquo;เงา&rdquo; หรือด้านของตัวเองที่ถูกกดทับในจิตไร้สำนึก
              การยอมรับและรวมเงาเข้ากับตัวตน คือเส้นทางสู่ความสมบูรณ์แบบ (Individuation)
            </p>

            {/* Jung Psychology concepts */}
            <div className="bg-indigo-900/20 border border-indigo-500/20 rounded-xl p-4 mb-4">
              <h3 className="text-sm font-medium text-indigo-300 mb-2">🌓 แนวคิด Jungian Psychology</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="text-indigo-400">•</span>
                  <span>
                    <strong className="text-slate-300">Shadow</strong> — ด้านที่ถูกปฏิเสธและกดทับลงไปในจิตไร้สำนึก
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-400">•</span>
                  <span>
                    <strong className="text-slate-300">Persona</strong> — หน้ากากที่เราสวมให้โลกเห็น
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-400">•</span>
                  <span>
                    <strong className="text-slate-300">Integration</strong> — การยอมรับทุกด้านของตัวเองอย่างสมบูรณ์
                  </span>
                </li>
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2 text-slate-400">
                <span>⏱️</span> ~10 นาที
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <span>🎴</span> 7 ไพ่
              </div>
            </div>
          </div>

          {/* 7 Positions Preview */}
          <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-indigo-300 mb-4 flex items-center">
              <span className="mr-2">🗺️</span>
              ตำแหน่งไพ่ทั้ง 7
            </h3>
            <div className="space-y-3">
              {SHADOW_WORK_POSITIONS.map((pos) => {
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
            <label htmlFor="question" className="block text-indigo-300 font-medium mb-3">
              คำถามสำหรับการสำรวจเงา <span className="text-slate-500">(ไม่จำเป็น)</span>
            </label>
            <textarea
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="เช่น ฉันต้องการเข้าใจด้านมืดของตัวเองอย่างไร?"
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
              {SHADOW_WORK_QUESTIONS.map((sample) => (
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
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-slate-700 to-indigo-700 hover:from-slate-600 hover:to-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all duration-300 hover:-translate-y-1"
            >
              <span className="text-xl mr-3">🌑</span>
              เริ่มการสำรวจเงา
            </button>
          </div>

          {/* Professional help note */}
          <div className="mt-8 p-4 bg-slate-800/30 border border-slate-700/50 rounded-xl">
            <p className="text-slate-500 text-xs text-center">
              🩺 หากพบว่าประสบปัญหาทางจิตใจที่รุนแรง แนะนำให้ปรึกษานักจิตวิทยาหรือจิตแพทย์
            </p>
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
          <div className="flex justify-center gap-3 mb-8 flex-wrap max-w-md">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className="w-14 h-20 bg-gradient-to-br from-slate-600 to-indigo-700 rounded-lg animate-pulse shadow-lg"
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </div>
          <h2 className="text-2xl font-bold text-indigo-300 mb-2">
            {readingState === 'shuffling' ? 'กำลังเปิดประตูสู่เงา...' : 'กำลังจั่วไพ่ 7 ใบ...'}
          </h2>
          <p className="text-slate-400">หายใจลึกๆ และเตรียมพบกับตัวตนที่ซ่อนอยู่</p>
        </div>
      </div>
    );
  }

  // Revealing state - Show cards to flip sequentially
  if (readingState === 'revealing' && !allRevealed) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950/30 to-slate-950 py-8 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-indigo-300 mb-2">เปิดเผยเงาของคุณ</h2>
          <p className="text-slate-400 mb-4">คลิกที่ไพ่ใบที่ {nextCardToReveal + 1} เพื่อเปิด</p>

          {/* Skip Animation Button */}
          <button
            onClick={revealAllCards}
            className="mb-8 px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-400 hover:text-slate-200 text-sm rounded-lg transition-colors border border-slate-600/50"
          >
            ⏩ ข้ามไปผลลัพธ์
          </button>

          {/* 7 Cards Layout */}
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 mb-8">
            {drawnCards.map((drawnCard, index) => {
              const pos = SHADOW_WORK_POSITIONS[index];
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
                        ${canReveal ? 'cursor-pointer animate-pulse ring-2 ring-indigo-400 ring-offset-2 ring-offset-slate-950' : ''}
                        ${!canReveal && !isRevealed ? 'opacity-50' : ''}
                      `}
                    />
                    {canReveal && !isRevealed && (
                      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-indigo-400 text-xs animate-bounce whitespace-nowrap">
                        👆 แตะเพื่อเปิด
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Progress */}
          <div className="text-slate-500 text-sm">เปิดแล้ว {revealedCards.filter((r) => r).length} / 7 ใบ</div>
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
          {/* Question display */}
          {question && (
            <div className="text-center mb-6">
              <p className="text-slate-500 text-sm mb-1">คำถามสำหรับการสำรวจเงา:</p>
              <p className="text-indigo-300 text-lg italic">&ldquo;{question}&rdquo;</p>
            </div>
          )}

          {/* All 7 Cards Grid */}
          <div className="grid grid-cols-7 gap-2 md:gap-3 mb-8">
            {drawnCards.map((drawnCard, index) => {
              const pos = SHADOW_WORK_POSITIONS[index];
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
                    className={isSelected ? 'ring-2 ring-indigo-400 ring-offset-2 ring-offset-slate-950' : ''}
                  />

                  {/* Position name */}
                  <p className="mt-1 text-[10px] text-center text-slate-500 max-w-[60px] truncate">{posInfo.shortTh}</p>
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
                  className={`inline-block px-4 py-1 rounded-full bg-gradient-to-r ${POSITION_LABELS[SHADOW_WORK_POSITIONS[selectedCardIndex]].color} text-white text-sm font-medium mb-4`}
                >
                  {POSITION_LABELS[SHADOW_WORK_POSITIONS[selectedCardIndex]].emoji}{' '}
                  {POSITION_LABELS[SHADOW_WORK_POSITIONS[selectedCardIndex]].th}
                </div>

                <h2 className="text-2xl md:text-3xl font-bold font-card text-transparent bg-clip-text bg-gradient-to-r from-slate-300 to-indigo-300 mb-1">
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

              {/* Psychology-focused Position Interpretation */}
              <div className="bg-indigo-900/20 border border-indigo-500/20 rounded-xl p-4 mb-4">
                <h3 className="text-base font-bold text-indigo-300 mb-2">
                  🌓 ในตำแหน่ง &quot;{POSITION_LABELS[SHADOW_WORK_POSITIONS[selectedCardIndex]].th}&quot;
                </h3>
                <p className="text-slate-300 text-sm italic mb-2">
                  {POSITION_LABELS[SHADOW_WORK_POSITIONS[selectedCardIndex]].psychologyNote}
                </p>
                <p className="text-slate-200 leading-relaxed">
                  {getShadowWorkInterpretation(
                    selectedCard.card.nameTh,
                    selectedCard.isReversed,
                    SHADOW_WORK_POSITIONS[selectedCardIndex]
                  )}
                </p>
              </div>

              {/* Journaling Prompt for this position */}
              <div className="bg-amber-900/20 border border-amber-500/20 rounded-xl p-4 mb-4">
                <h3 className="text-base font-bold text-amber-300 mb-2">📝 คำถามสำหรับจดบันทึก</h3>
                <p className="text-slate-200 leading-relaxed text-sm">
                  {POSITION_LABELS[SHADOW_WORK_POSITIONS[selectedCardIndex]].journalPrompt}
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
                      <h3 className="text-base font-bold text-purple-300 mb-2">🔮 ข้อความจากเงา</h3>
                      <p className="text-slate-200 leading-relaxed text-sm">{detailedMeaning.prediction}</p>
                    </div>

                    <div className="bg-teal-900/20 border border-teal-500/20 rounded-xl p-4">
                      <h3 className="text-base font-bold text-teal-300 mb-2">💡 คำแนะนำสำหรับการรวมเป็นหนึ่ง</h3>
                      <p className="text-slate-200 leading-relaxed text-sm">{detailedMeaning.advice}</p>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Shadow Work Summary */}
          <div className="bg-gradient-to-br from-slate-800/50 to-indigo-900/30 border border-indigo-500/30 rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-bold text-indigo-300 mb-4 flex items-center gap-2">
              <span className="text-2xl">🌓</span>
              สรุปการสำรวจเงา
            </h2>
            <div className="space-y-4 text-slate-300 leading-relaxed">
              <p>
                <span className="font-semibold text-amber-300">ตัวตนที่รู้สำนึก (Persona):</span>{' '}
                <span className="text-slate-200">{drawnCards[0]?.card.nameTh}</span>
                {drawnCards[0]?.isReversed && ' (กลับหัว)'} — หน้ากากที่คุณสวมให้โลกเห็น
              </p>
              <p>
                <span className="font-semibold text-slate-400">เงาในตัวตน (Shadow):</span>{' '}
                <span className="text-slate-200">{drawnCards[1]?.card.nameTh}</span>
                {drawnCards[1]?.isReversed && ' (กลับหัว)'} — ด้านที่ถูกซ่อนในจิตไร้สำนึก
              </p>
              <p>
                <span className="font-semibold text-indigo-300">ความกลัวที่ซ่อนอยู่:</span>{' '}
                <span className="text-slate-200">{drawnCards[2]?.card.nameTh}</span>
                {drawnCards[2]?.isReversed && ' (กลับหัว)'} — สิ่งที่ขับเคลื่อนพฤติกรรมจากเบื้องหลัง
              </p>
              <p>
                <span className="font-semibold text-emerald-300">พลังที่ถูกปฏิเสธ (Golden Shadow):</span>{' '}
                <span className="text-slate-200">{drawnCards[3]?.card.nameTh}</span>
                {drawnCards[3]?.isReversed && ' (กลับหัว)'} — ความสามารถที่คุณมีแต่ไม่กล้ายอมรับ
              </p>
              <p>
                <span className="font-semibold text-violet-300">เส้นทางการรวมเป็นหนึ่ง:</span>{' '}
                <span className="text-slate-200">{drawnCards[4]?.card.nameTh}</span>
                {drawnCards[4]?.isReversed && ' (กลับหัว)'} — วิธีการยอมรับเงาเข้ากับตัวตน
              </p>
              <p>
                <span className="font-semibold text-green-300">เส้นทางการเยียวยา:</span>{' '}
                <span className="text-slate-200">{drawnCards[5]?.card.nameTh}</span>
                {drawnCards[5]?.isReversed && ' (กลับหัว)'} — สิ่งที่จะช่วยเยียวยาบาดแผลภายใน
              </p>
              <p className="text-lg">
                <span className="font-semibold text-amber-400">ความครบถ้วน (Wholeness):</span>{' '}
                <span className="text-slate-200 font-bold">{drawnCards[6]?.card.nameTh}</span>
                {drawnCards[6]?.isReversed && ' (กลับหัว)'} — ภาพของตัวตนที่สมบูรณ์เมื่อรวมทุกด้านเข้าด้วยกัน
              </p>
            </div>
          </div>

          {/* Complete Journaling Prompts Section */}
          <div className="bg-gradient-to-br from-amber-900/20 to-orange-900/20 border border-amber-500/30 rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-bold text-amber-300 mb-4 flex items-center gap-2">
              <span className="text-2xl">📝</span>
              คำถามสำหรับการจดบันทึก
            </h2>
            <p className="text-slate-400 text-sm mb-4">ลองใช้คำถามเหล่านี้เพื่อสำรวจตัวเองหลังการอ่านไพ่:</p>
            <ul className="space-y-3">
              {SHADOW_WORK_POSITIONS.map((pos, i) => {
                const info = POSITION_LABELS[pos];
                return (
                  <li key={pos} className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-xl">
                    <span className="text-lg">{info.emoji}</span>
                    <div>
                      <p className="text-amber-200 font-medium text-sm mb-1">{info.th}</p>
                      <p className="text-slate-300 text-sm">{info.journalPrompt}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Professional Help Reminder */}
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4 mb-8">
            <p className="text-slate-400 text-sm text-center">
              💚 จำไว้ว่าการทำ Shadow Work เป็นกระบวนการที่ต้องใช้เวลา
              หากพบว่าประสบปัญหาทางจิตใจที่รุนแรง แนะนำให้ปรึกษานักจิตวิทยาหรือจิตแพทย์
            </p>
          </div>

          {/* Quick Navigation */}
          <div className="text-center mb-8">
            <p className="text-slate-500 text-sm mb-3">คลิกไพ่ด้านบนเพื่อดูรายละเอียดแต่ละตำแหน่ง</p>
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
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-slate-700 to-indigo-700 hover:from-slate-600 hover:to-indigo-600 text-white font-medium rounded-xl transition-all duration-300"
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

// Helper function: Generate shadow work interpretation
function getShadowWorkInterpretation(
  cardName: string,
  isReversed: boolean,
  position: ShadowWorkPosition
): string {
  const interpretations: Record<ShadowWorkPosition, { upright: string; reversed: string }> = {
    sw_conscious_self: {
      upright: `ไพ่ ${cardName} ในตำแหน่ง "ตัวตนที่รู้สำนึก" สะท้อน Persona หรือหน้ากากที่คุณสวมให้โลกเห็น พลังงานนี้คือสิ่งที่คุณยอมรับและภูมิใจในตัวเอง เป็นภาพลักษณ์ที่คุณต้องการให้ผู้อื่นมองเห็น`,
      reversed: `ไพ่ ${cardName} กลับหัวในตำแหน่ง "ตัวตนที่รู้สำนึก" บ่งบอกว่าหน้ากากที่คุณสวมอาจไม่สอดคล้องกับตัวตนที่แท้จริง หรือคุณอาจกำลังตั้งคำถามกับภาพลักษณ์ที่แสดงออก`,
    },
    sw_shadow: {
      upright: `ไพ่ ${cardName} ในตำแหน่ง "เงาในตัวตน" เปิดเผยด้านที่คุณปฏิเสธหรือซ่อนจากตัวเองและผู้อื่น พลังงานนี้ถูกกดทับลงในจิตไร้สำนึก แต่ยังคงส่งผลต่อพฤติกรรมและอารมณ์ของคุณ`,
      reversed: `ไพ่ ${cardName} กลับหัวในตำแหน่ง "เงาในตัวตน" บ่งบอกว่าเงานี้ถูกกดทับลึกมาก หรือคุณกำลังต่อต้านการเผชิญหน้ากับมัน การยอมรับเป็นขั้นตอนแรกสู่การเยียวยา`,
    },
    sw_fear: {
      upright: `ไพ่ ${cardName} ในตำแหน่ง "ความกลัวที่ซ่อนอยู่" ชี้ให้เห็นความกลัวที่ฝังลึกและขับเคลื่อนพฤติกรรมของคุณโดยไม่รู้ตัว ความกลัวนี้อาจทำให้คุณหลีกเลี่ยงสถานการณ์บางอย่างหรือตัดสินใจในทางที่ไม่เป็นประโยชน์`,
      reversed: `ไพ่ ${cardName} กลับหัวในตำแหน่ง "ความกลัวที่ซ่อนอยู่" บ่งบอกว่าความกลัวนี้อาจถูกปฏิเสธอย่างรุนแรง หรือคุณกำลังเริ่มเผชิญหน้ากับมัน — ทั้งสองกรณีต้องการความใส่ใจ`,
    },
    sw_denied_strength: {
      upright: `ไพ่ ${cardName} ในตำแหน่ง "พลังที่ถูกปฏิเสธ" เปิดเผย Golden Shadow — ด้านดีของตัวเองที่คุณไม่กล้ายอมรับ คุณมีความสามารถนี้อยู่แล้ว แต่ความไม่มั่นใจหรือความกลัวทำให้ไม่กล้าแสดงออก`,
      reversed: `ไพ่ ${cardName} กลับหัวในตำแหน่ง "พลังที่ถูกปฏิเสธ" บ่งบอกว่าพลังนี้ถูกกดทับมานาน หรือคุณมีความเชื่อผิดๆ ว่าตัวเองไม่มีความสามารถนี้ ลองมองตัวเองผ่านสายตาของคนที่รักคุณ`,
    },
    sw_integration: {
      upright: `ไพ่ ${cardName} ในตำแหน่ง "การรวมเป็นหนึ่ง" ชี้แนะวิธีการยอมรับและรวมเงาเข้ากับตัวตน พลังงานนี้จะช่วยให้คุณก้าวข้ามความแบ่งแยกภายในและเป็นตัวเองอย่างสมบูรณ์`,
      reversed: `ไพ่ ${cardName} กลับหัวในตำแหน่ง "การรวมเป็นหนึ่ง" เตือนว่ากระบวนการนี้อาจไม่ง่าย อาจต้องใช้เวลาและความอดทนมากกว่าที่คาด แต่จงอย่าท้อถอย`,
    },
    sw_healing: {
      upright: `ไพ่ ${cardName} ในตำแหน่ง "เส้นทางการเยียวยา" บ่งบอกถึงสิ่งที่จะช่วยเยียวยาบาดแผลภายใน พลังงานนี้คือกุญแจสำคัญในการปลดปล่อยตัวเองจากความเจ็บปวดในอดีต`,
      reversed: `ไพ่ ${cardName} กลับหัวในตำแหน่ง "เส้นทางการเยียวยา" เตือนว่าการเยียวยาต้องการความจริงใจต่อตัวเอง อาจต้องเผชิญหน้ากับความเจ็บปวดก่อนที่จะหาย`,
    },
    sw_wholeness: {
      upright: `ไพ่ ${cardName} ในตำแหน่ง "ความครบถ้วน" แสดงภาพของตัวตนที่สมบูรณ์เมื่อรวมทุกด้านเข้าด้วยกัน นี่คือศักยภาพสูงสุดของคุณ — Individuation ตามทฤษฎีของ Jung`,
      reversed: `ไพ่ ${cardName} กลับหัวในตำแหน่ง "ความครบถ้วน" บ่งบอกว่าเส้นทางสู่ความสมบูรณ์ยังมีอุปสรรค แต่จงจำไว้ว่ากระบวนการนี้คือการเดินทาง ไม่ใช่จุดหมาย`,
    },
  };

  return isReversed ? interpretations[position].reversed : interpretations[position].upright;
}
