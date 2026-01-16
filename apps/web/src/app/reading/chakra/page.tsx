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

// Chakra Alignment 7 Position Type
type ChakraPosition =
  | 'ca_root'
  | 'ca_sacral'
  | 'ca_solar_plexus'
  | 'ca_heart'
  | 'ca_throat'
  | 'ca_third_eye'
  | 'ca_crown';

// Chakra positions in order (Root to Crown - bottom to top energy flow)
const CHAKRA_POSITIONS: ChakraPosition[] = [
  'ca_root',
  'ca_sacral',
  'ca_solar_plexus',
  'ca_heart',
  'ca_throat',
  'ca_third_eye',
  'ca_crown',
];

// Chakra information with colors, Sanskrit names, and energy themes
const CHAKRA_INFO: Record<
  ChakraPosition,
  {
    th: string;
    en: string;
    sanskrit: string;
    emoji: string;
    color: string;
    bgColor: string;
    textColor: string;
    shortTh: string;
    description: string;
    bodyLocation: string;
    energyTheme: string;
    balancedState: string;
    imbalancedState: string;
  }
> = {
  ca_root: {
    th: 'จักระรากฐาน',
    en: 'Root Chakra',
    sanskrit: 'Muladhara',
    emoji: '🔴',
    color: 'from-red-600 to-red-800',
    bgColor: 'bg-red-600',
    textColor: 'text-red-400',
    shortTh: 'รากฐาน',
    description: 'พื้นฐานความมั่นคง ความปลอดภัย และความอยู่รอด',
    bodyLocation: 'ฐานกระดูกสันหลัง',
    energyTheme: 'ความมั่นคง • ความปลอดภัย • การเอาตัวรอด',
    balancedState: 'รู้สึกมั่นคง ปลอดภัย และเชื่อมต่อกับโลก',
    imbalancedState: 'ความกลัว ความวิตกกังวล ปัญหาทางการเงิน',
  },
  ca_sacral: {
    th: 'จักระสัคราล',
    en: 'Sacral Chakra',
    sanskrit: 'Svadhisthana',
    emoji: '🟠',
    color: 'from-orange-500 to-orange-700',
    bgColor: 'bg-orange-500',
    textColor: 'text-orange-400',
    shortTh: 'สัคราล',
    description: 'ความคิดสร้างสรรค์ อารมณ์ และพลังทางเพศ',
    bodyLocation: 'ท้องน้อยใต้สะดือ',
    energyTheme: 'ความคิดสร้างสรรค์ • อารมณ์ • ความสัมพันธ์',
    balancedState: 'สร้างสรรค์ มีความสุข และเชื่อมต่อกับความรู้สึก',
    imbalancedState: 'ขาดความคิดสร้างสรรค์ อารมณ์ไม่มั่นคง',
  },
  ca_solar_plexus: {
    th: 'จักระท้องน้อย',
    en: 'Solar Plexus Chakra',
    sanskrit: 'Manipura',
    emoji: '🟡',
    color: 'from-yellow-500 to-amber-600',
    bgColor: 'bg-yellow-500',
    textColor: 'text-yellow-400',
    shortTh: 'ท้องน้อย',
    description: 'พลังส่วนบุคคล ความมั่นใจ และความเชื่อมั่นในตัวเอง',
    bodyLocation: 'บริเวณกระเพาะอาหาร',
    energyTheme: 'พลังส่วนบุคคล • ความมั่นใจ • การควบคุม',
    balancedState: 'มั่นใจ มีพลัง และควบคุมชีวิตได้',
    imbalancedState: 'ขาดความมั่นใจ รู้สึกไร้อำนาจ',
  },
  ca_heart: {
    th: 'จักระหัวใจ',
    en: 'Heart Chakra',
    sanskrit: 'Anahata',
    emoji: '💚',
    color: 'from-green-500 to-emerald-700',
    bgColor: 'bg-green-500',
    textColor: 'text-green-400',
    shortTh: 'หัวใจ',
    description: 'ความรัก ความเมตตา และการเยียวยา',
    bodyLocation: 'กลางอก',
    energyTheme: 'ความรัก • ความเมตตา • การให้อภัย',
    balancedState: 'รักและเมตตาทั้งต่อตนเองและผู้อื่น',
    imbalancedState: 'รู้สึกโดดเดี่ยว ขาดความรัก หัวใจแตกสลาย',
  },
  ca_throat: {
    th: 'จักระคอ',
    en: 'Throat Chakra',
    sanskrit: 'Vishuddha',
    emoji: '🔵',
    color: 'from-blue-500 to-blue-700',
    bgColor: 'bg-blue-500',
    textColor: 'text-blue-400',
    shortTh: 'คอ',
    description: 'การสื่อสาร การแสดงออก และความจริง',
    bodyLocation: 'ลำคอ',
    energyTheme: 'การสื่อสาร • การแสดงออก • ความจริง',
    balancedState: 'สื่อสารชัดเจน พูดความจริง แสดงออกอย่างแท้จริง',
    imbalancedState: 'กลัวการพูด ไม่กล้าแสดงออก โกหก',
  },
  ca_third_eye: {
    th: 'จักระตาที่สาม',
    en: 'Third Eye Chakra',
    sanskrit: 'Ajna',
    emoji: '🟣',
    color: 'from-indigo-500 to-purple-700',
    bgColor: 'bg-indigo-500',
    textColor: 'text-indigo-400',
    shortTh: 'ตาที่สาม',
    description: 'สัญชาตญาณ ปัญญา และการมองเห็นภายใน',
    bodyLocation: 'กลางหน้าผาก',
    energyTheme: 'สัญชาตญาณ • ปัญญา • การมองเห็น',
    balancedState: 'สัญชาตญาณแม่นยำ มองเห็นภาพรวมชัดเจน',
    imbalancedState: 'ขาดสัญชาตญาณ สับสน ขาดทิศทาง',
  },
  ca_crown: {
    th: 'จักระมงกุฎ',
    en: 'Crown Chakra',
    sanskrit: 'Sahasrara',
    emoji: '👑',
    color: 'from-violet-500 to-purple-800',
    bgColor: 'bg-violet-500',
    textColor: 'text-violet-400',
    shortTh: 'มงกุฎ',
    description: 'จิตวิญญาณ การตื่นรู้ และการเชื่อมต่อกับจักรวาล',
    bodyLocation: 'กลางศีรษะ',
    energyTheme: 'จิตวิญญาณ • การตื่นรู้ • การเชื่อมต่อ',
    balancedState: 'รู้สึกเชื่อมต่อกับจักรวาล สงบสุข ตื่นรู้',
    imbalancedState: 'รู้สึกขาดการเชื่อมต่อ ไร้ความหมาย',
  },
};

// Sample questions for chakra reading
const CHAKRA_QUESTIONS = [
  'จักระใดของฉันต้องการความสมดุล?',
  'พลังงานในร่างกายของฉันเป็นอย่างไร?',
  'ฉันจะเสริมสร้างพลังงานภายในได้อย่างไร?',
  'สิ่งใดกำลังบล็อกพลังงานของฉัน?',
  'ฉันจะเชื่อมต่อกับจิตวิญญาณได้ดีขึ้นอย่างไร?',
];

export default function ChakraAlignmentReadingPage(): React.JSX.Element | null {
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

  // Check Pro/VIP access via API
  useEffect(() => {
    async function checkAccess(): Promise<void> {
      try {
        const response = await fetch('/api/access-check?spread=chakra_alignment');
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
  const handleStartSelection = (): void => {
    trackReadingStarted?.('chakra_alignment', !!question);
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
        startReading('chakra' as Parameters<typeof startReading>[0], question || undefined);
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
      saveReading('chakra_alignment' as Parameters<typeof saveReading>[0], drawnCards, question || undefined).then((result) => {
        if (result) {
          setIsSaved(true);
          // Track spread completed
          const duration = startTime ? Math.round((Date.now() - startTime) / 1000) : 0;
          trackReadingCompleted?.('chakra_alignment', result.id, duration);
        }
      });
    }
  }, [allRevealed, drawnCards, question, saveReading, user, startTime, trackReadingCompleted]);

  // Loading states
  if (isLoadingAuth || !accessCheck.checked) {
    return <PageLoader message="กำลังตรวจสอบสิทธิ์..." />;
  }

  // Premium gate - show if user doesn't have access (Pro/VIP feature)
  if (!accessCheck.allowed) {
    const spreadInfo = SPREAD_INFO.chakra_alignment;
    return (
      <PremiumGate
        spreadName="chakra-alignment"
        spreadNameTh={spreadInfo.nameTh}
        spreadIcon={spreadInfo.icon}
        requiredTier="pro"
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
    const currentPosition = CHAKRA_POSITIONS[selectionStep];
    const chakraInfo = CHAKRA_INFO[currentPosition];

    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/30 to-slate-950 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header with current chakra */}
          <div className="text-center mb-4">
            <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-emerald-300 mb-2">
              เลือกไพ่ใบที่ {selectionStep + 1}/7
            </h2>
            <div
              className={`inline-block px-6 py-2 rounded-full bg-gradient-to-r ${chakraInfo.color} text-white font-medium text-lg mb-2`}
            >
              {chakraInfo.emoji} {chakraInfo.th}
            </div>
            <p className="text-slate-400 text-sm">{chakraInfo.sanskrit} • {chakraInfo.bodyLocation}</p>
            <p className="text-slate-500 text-xs mt-1">{chakraInfo.energyTheme}</p>
          </div>

          {/* Question reminder */}
          {question && (
            <div className="text-center mb-4">
              <p className="text-violet-400 text-sm italic">&ldquo;{question}&rdquo;</p>
            </div>
          )}

          {/* Progress Indicator - Chakra colors */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {CHAKRA_POSITIONS.map((pos, idx) => {
              const info = CHAKRA_INFO[pos];
              return (
                <div
                  key={pos}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-all duration-300 text-xs ${
                    idx < selectionStep
                      ? `${info.bgColor}/30 border border-${info.textColor}/50`
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

          {/* Selected cards preview - Vertical chakra representation */}
          {selectedFanIndices.length > 0 && (
            <div className="mt-6">
              <p className="text-center text-slate-500 text-sm mb-3">ไพ่ที่เลือกแล้ว: {selectedFanIndices.length}/7</p>
              <div className="flex justify-center">
                <div className="flex flex-col-reverse gap-1">
                  {CHAKRA_POSITIONS.map((pos, idx) => {
                    const info = CHAKRA_INFO[pos];
                    return (
                      <div
                        key={pos}
                        className={`w-12 h-8 md:w-14 md:h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                          idx < selectedFanIndices.length
                            ? `bg-gradient-to-br ${info.color} shadow-lg`
                            : 'bg-slate-800/50 border-2 border-dashed border-slate-600'
                        }`}
                      >
                        {idx < selectedFanIndices.length ? (
                          <span className="text-white text-sm">{info.emoji}</span>
                        ) : (
                          <span className="text-slate-600 text-xs">{info.shortTh}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* All selected message */}
          {selectedFanIndices.length === 7 && (
            <div className="text-center mt-6 animate-pulse">
              <span className="text-violet-400 text-lg font-medium">🧘 กำลังปรับสมดุลจักระ...</span>
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

  // Idle state - Show question input, chakra info, and start button
  if (readingState === 'idle') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/30 to-slate-950 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-violet-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-violet-500/20">
              <span className="text-4xl">🧘</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-emerald-300 mb-4">
              จักระสมดุล
            </h1>
            <p className="text-slate-400 text-lg">Chakra Alignment • 7 ไพ่ • การปรับสมดุลพลังงาน</p>
            <div className="mt-4 inline-block px-4 py-1 bg-gradient-to-r from-purple-600 to-emerald-600 rounded-full text-white text-sm font-medium">
              ✨ Pro Feature
            </div>
          </div>

          {/* Chakra System Description */}
          <div className="bg-slate-800/50 border border-violet-500/30 rounded-2xl p-6 mb-8">
            <h2 className="text-lg font-semibold text-violet-300 mb-3">🌈 เกี่ยวกับระบบจักระ</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              จักระทั้ง 7 คือจุดพลังงานที่ไหลเวียนในร่างกายของเรา ตั้งแต่ฐานกระดูกสันหลัง (รากฐาน) ขึ้นไปถึงกลางศีรษะ (มงกุฎ)
              การอ่านไพ่นี้จะช่วยให้คุณเข้าใจสถานะพลังงานในแต่ละจักระ และวิธีการสร้างสมดุลให้กับร่างกายและจิตใจ
            </p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2 text-slate-400">
                <span>⏱️</span> ~7 นาที
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <span>🎴</span> 7 ไพ่
              </div>
            </div>
          </div>

          {/* 7 Chakras Preview - Vertical Body Alignment */}
          <div className="bg-gradient-to-b from-violet-900/20 via-emerald-900/20 to-red-900/20 border border-violet-500/30 rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-violet-300 mb-4 flex items-center">
              <span className="mr-2">🌈</span>
              จักระทั้ง 7 ในร่างกาย
            </h3>
            <div className="flex flex-col-reverse gap-2">
              {CHAKRA_POSITIONS.map((pos) => {
                const info = CHAKRA_INFO[pos];
                return (
                  <div key={pos} className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl hover:bg-slate-800/70 transition-colors">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${info.color} flex items-center justify-center shadow-lg`}>
                      <span className="text-lg">{info.emoji}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-slate-200 font-medium">{info.th}</p>
                        <span className="text-slate-500 text-xs">({info.sanskrit})</span>
                      </div>
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
              คำถามสำหรับการปรับสมดุลจักระ <span className="text-slate-500">(ไม่จำเป็น)</span>
            </label>
            <textarea
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="เช่น พลังงานใดในร่างกายของฉันต้องการความสมดุล?"
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
              {CHAKRA_QUESTIONS.map((sample) => (
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
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-violet-600 to-emerald-600 hover:from-violet-500 hover:to-emerald-500 text-white font-semibold rounded-xl shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 transition-all duration-300 hover:-translate-y-1"
            >
              <span className="text-xl mr-3">🧘</span>
              เริ่มการปรับสมดุลจักระ
            </button>
          </div>

          {/* Wellness note */}
          <div className="mt-8 p-4 bg-slate-800/30 border border-slate-700/50 rounded-xl">
            <p className="text-slate-500 text-xs text-center">
              🌿 การอ่านไพ่จักระเป็นเครื่องมือสำหรับการสำรวจตนเอง ไม่ใช่การวินิจฉัยทางการแพทย์
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
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/30 to-slate-950 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="flex justify-center gap-3 mb-8 flex-wrap max-w-md">
            {CHAKRA_POSITIONS.map((pos, i) => {
              const info = CHAKRA_INFO[pos];
              return (
                <div
                  key={pos}
                  className={`w-10 h-14 bg-gradient-to-br ${info.color} rounded-lg animate-pulse shadow-lg`}
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              );
            })}
          </div>
          <h2 className="text-2xl font-bold text-violet-300 mb-2">
            {readingState === 'shuffling' ? 'กำลังปรับพลังงาน...' : 'กำลังจั่วไพ่ 7 ใบ...'}
          </h2>
          <p className="text-slate-400">หายใจลึกๆ และรู้สึกถึงพลังงานในร่างกาย</p>
        </div>
      </div>
    );
  }

  // Revealing state - Show cards to flip sequentially (Vertical chakra layout)
  if (readingState === 'revealing' && !allRevealed) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/30 to-slate-950 py-8 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-violet-300 mb-2">เปิดเผยพลังงานจักระของคุณ</h2>
          <p className="text-slate-400 mb-4">คลิกที่ไพ่ใบที่ {nextCardToReveal + 1} เพื่อเปิด</p>

          {/* Skip Animation Button */}
          <button
            onClick={revealAllCards}
            className="mb-8 px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-400 hover:text-slate-200 text-sm rounded-lg transition-colors border border-slate-600/50"
          >
            ⏩ ข้ามไปผลลัพธ์
          </button>

          {/* 7 Cards Vertical Layout - Root at bottom, Crown at top */}
          <div className="flex flex-col-reverse items-center gap-4 mb-8">
            {drawnCards.map((drawnCard, index) => {
              const pos = CHAKRA_POSITIONS[index];
              const chakraInfo = CHAKRA_INFO[pos];
              const isRevealed = revealedCards[index];
              const canReveal = index === nextCardToReveal;

              return (
                <div key={index} className="flex items-center gap-4">
                  {/* Chakra indicator */}
                  <div
                    className={`w-20 md:w-24 px-3 py-1.5 rounded-full bg-gradient-to-r ${chakraInfo.color} text-white text-xs font-medium text-center`}
                  >
                    {chakraInfo.emoji} {chakraInfo.shortTh}
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
                        ${canReveal ? 'cursor-pointer animate-pulse ring-2 ring-violet-400 ring-offset-2 ring-offset-slate-950' : ''}
                        ${!canReveal && !isRevealed ? 'opacity-50' : ''}
                      `}
                    />
                    {canReveal && !isRevealed && (
                      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-violet-400 text-xs animate-bounce whitespace-nowrap">
                        👆 แตะเพื่อเปิด
                      </div>
                    )}
                  </div>

                  {/* Card name if revealed */}
                  <div className="w-32 text-left">
                    {isRevealed && (
                      <p className="text-slate-300 text-sm truncate">{drawnCard.card.nameTh}</p>
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
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/30 to-slate-950 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Question display */}
          {question && (
            <div className="text-center mb-6">
              <p className="text-slate-500 text-sm mb-1">คำถามสำหรับการปรับสมดุลจักระ:</p>
              <p className="text-violet-300 text-lg italic">&ldquo;{question}&rdquo;</p>
            </div>
          )}

          {/* All 7 Cards - Vertical Chakra Layout */}
          <div className="flex flex-col-reverse items-center gap-2 md:gap-3 mb-8">
            {drawnCards.map((drawnCard, index) => {
              const pos = CHAKRA_POSITIONS[index];
              const chakraInfo = CHAKRA_INFO[pos];
              const isSelected = selectedCardIndex === index;

              return (
                <div
                  key={index}
                  className={`flex items-center gap-3 md:gap-4 cursor-pointer transition-all duration-300 p-2 rounded-xl ${
                    isSelected ? 'bg-slate-800/50 scale-105' : 'opacity-70 hover:opacity-100'
                  }`}
                  onClick={() => setSelectedCardIndex(index)}
                >
                  {/* Chakra color indicator */}
                  <div
                    className={`w-16 md:w-20 px-2 py-1 rounded-full bg-gradient-to-r ${chakraInfo.color} text-white text-[10px] md:text-xs font-medium text-center`}
                  >
                    {chakraInfo.emoji} {chakraInfo.shortTh}
                  </div>

                  {/* Card */}
                  <TarotCard
                    frontImage={drawnCard.card.imageUrl}
                    cardName={drawnCard.card.name}
                    size="sm"
                    isReversed={drawnCard.isReversed}
                    isFlipped={true}
                    showFlipAnimation={false}
                    className={isSelected ? 'ring-2 ring-violet-400 ring-offset-2 ring-offset-slate-950' : ''}
                  />

                  {/* Card name */}
                  <div className="w-24 md:w-32">
                    <p className="text-[10px] md:text-sm text-slate-300 truncate">{drawnCard.card.nameTh}</p>
                    <p className={`text-[8px] md:text-xs ${drawnCard.isReversed ? 'text-red-400' : 'text-green-400'}`}>
                      {drawnCard.isReversed ? 'กลับหัว' : 'ตั้งตรง'}
                    </p>
                  </div>
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
                  className={`inline-block px-4 py-1 rounded-full bg-gradient-to-r ${CHAKRA_INFO[CHAKRA_POSITIONS[selectedCardIndex]].color} text-white text-sm font-medium mb-4`}
                >
                  {CHAKRA_INFO[CHAKRA_POSITIONS[selectedCardIndex]].emoji}{' '}
                  {CHAKRA_INFO[CHAKRA_POSITIONS[selectedCardIndex]].th}
                  <span className="ml-2 opacity-75">({CHAKRA_INFO[CHAKRA_POSITIONS[selectedCardIndex]].sanskrit})</span>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold font-card text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-emerald-300 mb-1">
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
                  <span key={i} className="px-3 py-1 bg-violet-900/50 text-violet-300 rounded-full text-sm">
                    {keyword}
                  </span>
                ))}
              </div>

              {/* Chakra-specific Interpretation */}
              <div className={`bg-gradient-to-r ${CHAKRA_INFO[CHAKRA_POSITIONS[selectedCardIndex]].color}/20 border border-${CHAKRA_INFO[CHAKRA_POSITIONS[selectedCardIndex]].textColor}/30 rounded-xl p-4 mb-4`}>
                <h3 className="text-base font-bold text-violet-300 mb-2">
                  🧘 ในตำแหน่ง &quot;{CHAKRA_INFO[CHAKRA_POSITIONS[selectedCardIndex]].th}&quot;
                </h3>
                <p className="text-slate-400 text-sm italic mb-2">
                  {CHAKRA_INFO[CHAKRA_POSITIONS[selectedCardIndex]].energyTheme}
                </p>
                <p className="text-slate-200 leading-relaxed">
                  {getChakraInterpretation(
                    selectedCard.card.nameTh,
                    selectedCard.isReversed,
                    CHAKRA_POSITIONS[selectedCardIndex]
                  )}
                </p>
              </div>

              {/* Balance State Info */}
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="bg-green-900/20 border border-green-500/20 rounded-xl p-4">
                  <h3 className="text-sm font-bold text-green-300 mb-2">✅ สมดุล</h3>
                  <p className="text-slate-300 text-sm">
                    {CHAKRA_INFO[CHAKRA_POSITIONS[selectedCardIndex]].balancedState}
                  </p>
                </div>
                <div className="bg-red-900/20 border border-red-500/20 rounded-xl p-4">
                  <h3 className="text-sm font-bold text-red-300 mb-2">⚠️ ไม่สมดุล</h3>
                  <p className="text-slate-300 text-sm">
                    {CHAKRA_INFO[CHAKRA_POSITIONS[selectedCardIndex]].imbalancedState}
                  </p>
                </div>
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
                      <h3 className="text-base font-bold text-purple-300 mb-2">🔮 ข้อความจากพลังงาน</h3>
                      <p className="text-slate-200 leading-relaxed text-sm">{detailedMeaning.prediction}</p>
                    </div>

                    <div className="bg-emerald-900/20 border border-emerald-500/20 rounded-xl p-4">
                      <h3 className="text-base font-bold text-emerald-300 mb-2">💡 คำแนะนำสำหรับการสร้างสมดุล</h3>
                      <p className="text-slate-200 leading-relaxed text-sm">{detailedMeaning.advice}</p>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Chakra Balance Summary */}
          <div className="bg-gradient-to-br from-violet-900/30 to-emerald-900/30 border border-violet-500/30 rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-bold text-violet-300 mb-4 flex items-center gap-2">
              <span className="text-2xl">🌈</span>
              สรุปสมดุลจักระของคุณ
            </h2>
            <div className="space-y-3 text-slate-300 leading-relaxed">
              {drawnCards.map((drawnCard, index) => {
                const pos = CHAKRA_POSITIONS[index];
                const chakraInfo = CHAKRA_INFO[pos];
                return (
                  <div key={pos} className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-xl">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${chakraInfo.color} flex items-center justify-center flex-shrink-0`}>
                      <span className="text-sm">{chakraInfo.emoji}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`font-medium ${chakraInfo.textColor}`}>{chakraInfo.th}:</span>
                        <span className="text-slate-200">{drawnCard.card.nameTh}</span>
                        {drawnCard.isReversed && <span className="text-red-400 text-xs">(กลับหัว)</span>}
                      </div>
                      <p className="text-slate-500 text-xs mt-0.5">
                        {drawnCard.isReversed 
                          ? `พลังงานที่ต้องการความสมดุลในด้าน${chakraInfo.description}`
                          : `พลังงานไหลเวียนดีในด้าน${chakraInfo.description}`
                        }
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Overall Balance Assessment */}
            <div className="mt-4 p-4 bg-slate-800/50 rounded-xl">
              <h3 className="text-lg font-bold text-violet-300 mb-2">⚖️ การประเมินสมดุลโดยรวม</h3>
              <p className="text-slate-200 leading-relaxed">
                {getOverallBalanceAssessment(drawnCards)}
              </p>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="text-center mb-8">
            <p className="text-slate-500 text-sm mb-3">คลิกไพ่ด้านบนเพื่อดูรายละเอียดแต่ละจักระ</p>
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
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-violet-600 to-emerald-600 hover:from-violet-500 hover:to-emerald-500 text-white font-medium rounded-xl transition-all duration-300"
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

// Helper function: Generate chakra-specific interpretation
function getChakraInterpretation(
  cardName: string,
  isReversed: boolean,
  position: ChakraPosition
): string {
  const interpretations: Record<ChakraPosition, { upright: string; reversed: string }> = {
    ca_root: {
      upright: `ไพ่ ${cardName} ในตำแหน่ง "จักระรากฐาน" บ่งบอกว่าพลังงานพื้นฐานของคุณมีความมั่นคง คุณรู้สึกปลอดภัยและมีรากฐานที่แข็งแรง ความมั่นคงทางการเงินและความปลอดภัยในชีวิตกำลังได้รับการสนับสนุน`,
      reversed: `ไพ่ ${cardName} กลับหัวในตำแหน่ง "จักระรากฐาน" ชี้ให้เห็นว่าคุณอาจรู้สึกไม่มั่นคงหรือกังวลเรื่องความปลอดภัย ลองฝึกการ grounding และเชื่อมต่อกับโลกรอบตัว`,
    },
    ca_sacral: {
      upright: `ไพ่ ${cardName} ในตำแหน่ง "จักระสัคราล" แสดงว่าความคิดสร้างสรรค์และอารมณ์ของคุณไหลเวียนดี คุณเปิดรับความสุขและมีความสัมพันธ์ที่ดีกับอารมณ์ความรู้สึก`,
      reversed: `ไพ่ ${cardName} กลับหัวในตำแหน่ง "จักระสัคราล" บ่งบอกว่าอาจมีการอุดตันในด้านความคิดสร้างสรรค์หรืออารมณ์ ลองทำกิจกรรมที่ช่วยปลดปล่อยความรู้สึกภายใน`,
    },
    ca_solar_plexus: {
      upright: `ไพ่ ${cardName} ในตำแหน่ง "จักระท้องน้อย" บ่งบอกว่าพลังส่วนบุคคลของคุณแข็งแกร่ง คุณมีความมั่นใจและสามารถควบคุมชีวิตของตัวเองได้ดี`,
      reversed: `ไพ่ ${cardName} กลับหัวในตำแหน่ง "จักระท้องน้อย" ชี้ให้เห็นว่าคุณอาจขาดความมั่นใจหรือรู้สึกไร้อำนาจ ลองทำสิ่งที่ช่วยเสริมสร้างความเชื่อมั่นในตัวเอง`,
    },
    ca_heart: {
      upright: `ไพ่ ${cardName} ในตำแหน่ง "จักระหัวใจ" แสดงว่าหัวใจของคุณเปิดกว้างสำหรับความรักและความเมตตา คุณสามารถรักตัวเองและผู้อื่นได้อย่างไม่มีเงื่อนไข`,
      reversed: `ไพ่ ${cardName} กลับหัวในตำแหน่ง "จักระหัวใจ" บ่งบอกว่าอาจมีความเจ็บปวดทางอารมณ์หรือหัวใจที่ปิดกั้น ลองฝึกการให้อภัยและเปิดใจรับความรักอีกครั้ง`,
    },
    ca_throat: {
      upright: `ไพ่ ${cardName} ในตำแหน่ง "จักระคอ" บ่งบอกว่าคุณสามารถสื่อสารได้อย่างชัดเจนและแท้จริง คุณกล้าพูดความจริงและแสดงออกอย่างแท้จริง`,
      reversed: `ไพ่ ${cardName} กลับหัวในตำแหน่ง "จักระคอ" ชี้ให้เห็นว่าคุณอาจกลัวการแสดงออกหรือพูดความจริง ลองฝึกการสื่อสารอย่างเปิดเผยและซื่อสัตย์`,
    },
    ca_third_eye: {
      upright: `ไพ่ ${cardName} ในตำแหน่ง "จักระตาที่สาม" แสดงว่าสัญชาตญาณของคุณแม่นยำ คุณสามารถมองเห็นภาพรวมและเข้าใจสถานการณ์อย่างลึกซึ้ง`,
      reversed: `ไพ่ ${cardName} กลับหัวในตำแหน่ง "จักระตาที่สาม" บ่งบอกว่าสัญชาตญาณอาจถูกปิดกั้น ลองฝึกสมาธิและการมองเห็นภายในเพื่อเสริมสร้างปัญญา`,
    },
    ca_crown: {
      upright: `ไพ่ ${cardName} ในตำแหน่ง "จักระมงกุฎ" บ่งบอกว่าคุณมีการเชื่อมต่อกับจิตวิญญาณที่สูงขึ้น รู้สึกสงบสุขและเป็นหนึ่งเดียวกับจักรวาล`,
      reversed: `ไพ่ ${cardName} กลับหัวในตำแหน่ง "จักระมงกุฎ" ชี้ให้เห็นว่าคุณอาจรู้สึกขาดการเชื่อมต่อทางจิตวิญญาณ ลองฝึกการทำสมาธิหรือกิจกรรมที่ช่วยให้รู้สึกเชื่อมต่อกับสิ่งที่ยิ่งใหญ่กว่า`,
    },
  };

  return isReversed ? interpretations[position].reversed : interpretations[position].upright;
}

// Helper function: Generate overall balance assessment
function getOverallBalanceAssessment(drawnCards: Array<{ card: { nameTh: string }; isReversed: boolean }>): string {
  const reversedCount = drawnCards.filter(c => c.isReversed).length;
  const uprightCount = drawnCards.length - reversedCount;

  if (reversedCount === 0) {
    return 'พลังงานจักระทั้ง 7 ของคุณไหลเวียนดีมาก! นี่คือช่วงเวลาที่ดีสำหรับการเติบโตทางจิตวิญญาณและการสร้างสรรค์สิ่งใหม่ๆ จงใช้พลังงานนี้อย่างเต็มที่';
  } else if (reversedCount <= 2) {
    return `พลังงานส่วนใหญ่ของคุณสมดุลดี มีบางจักระที่ต้องการความใส่ใจเพิ่มเติม (${reversedCount} จากทั้งหมด 7) ลองโฟกัสที่การเยียวยาจุดที่ต้องการความสมดุลเหล่านั้น`;
  } else if (reversedCount <= 4) {
    return `มีจักระหลายจุดที่ต้องการการปรับสมดุล (${reversedCount} จากทั้งหมด 7) นี่อาจเป็นช่วงเวลาของการเปลี่ยนแปลงและการเติบโต ลองฝึกสมาธิและดูแลตัวเองมากขึ้น`;
  } else {
    return `พลังงานของคุณกำลังผ่านช่วงเปลี่ยนผ่านครั้งใหญ่ (${reversedCount} จักระต้องการความสมดุล) จงอ่อนโยนกับตัวเองและใช้เวลาในการเยียวยา การทำสมาธิและการพักผ่อนจะช่วยได้มาก`;
  }
}
