'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { TutorialStep, TutorialStepData } from './TutorialStep';
import { useAnalytics } from '@/lib/hooks';

// Tutorial steps data
const TUTORIAL_STEPS: TutorialStepData[] = [
  {
    id: 'welcome',
    title: 'ยินดีต้อนรับสู่ไพ่ยิปซี! 🔮',
    description: 'ค้นพบคำตอบและแนวทางชีวิตด้วยศาสตร์แห่งไพ่ทาโรต์ มาเริ่มต้นกันเลย!',
    emoji: '✨',
    position: 'center',
  },
  {
    id: 'choose-type',
    title: 'เลือกรูปแบบการดูดวง',
    description: 'เลือกระหว่าง "ดูดวงประจำวัน" สำหรับคำแนะนำรายวัน หรือ "ไพ่ 3 ใบ" สำหรับดูอดีต ปัจจุบัน อนาคต',
    emoji: '🃏',
    position: 'center',
  },
  {
    id: 'select-cards',
    title: 'เลือกไพ่ที่เรียกหาคุณ',
    description: 'ตั้งสติ หายใจลึกๆ และเลือกไพ่ที่คุณรู้สึกดึงดูดที่สุด ไม่มีถูกผิด เชื่อสัญชาตญาณของคุณ',
    emoji: '💫',
    position: 'center',
  },
  {
    id: 'discover',
    title: 'เปิดเผยความหมาย',
    description: 'แตะไพ่เพื่อเปิดเผยและอ่านความหมาย พร้อมคำแนะนำสำหรับชีวิตของคุณ',
    emoji: '🌟',
    position: 'center',
  },
  {
    id: 'save-share',
    title: 'บันทึกและแชร์',
    description: 'ลงทะเบียนเพื่อบันทึกประวัติการดู เพิ่มบันทึกส่วนตัว และแชร์ผลลัพธ์กับเพื่อนๆ',
    emoji: '💾',
    position: 'center',
  },
];

interface TutorialContextType {
  showTutorial: boolean;
  currentStep: number;
  startTutorial: () => void;
  endTutorial: () => void;
  hasSeenTutorial: boolean;
}

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

export function useTutorial() {
  const context = useContext(TutorialContext);
  if (!context) {
    throw new Error('useTutorial must be used within TutorialProvider');
  }
  return context;
}

interface TutorialProviderProps {
  children: ReactNode;
}

/**
 * Tutorial Provider - Manages tutorial state and provides context
 */
export function TutorialProvider({ children }: TutorialProviderProps) {
  const [showTutorial, setShowTutorial] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasSeenTutorial, setHasSeenTutorial] = useState(true);
  const { track } = useAnalytics();

  // Check if user has seen tutorial
  useEffect(() => {
    const seen = localStorage.getItem('hasSeenTutorial');
    if (!seen) {
      setHasSeenTutorial(false);
      // Auto-start tutorial for new users after a short delay
      const timer = setTimeout(() => {
        setShowTutorial(true);
        track('tutorial_started', { source: 'auto' });
      }, 1500);
      return () => clearTimeout(timer);
    }
    setHasSeenTutorial(true);
  }, [track]);

  const startTutorial = useCallback(() => {
    setCurrentStep(0);
    setShowTutorial(true);
    track('tutorial_started', { source: 'manual' });
  }, [track]);

  const endTutorial = useCallback((completed = false) => {
    setShowTutorial(false);
    setCurrentStep(0);
    localStorage.setItem('hasSeenTutorial', 'true');
    setHasSeenTutorial(true);
    
    if (completed) {
      track('tutorial_completed', { steps_completed: TUTORIAL_STEPS.length });
    } else {
      track('tutorial_skipped', { step_skipped_at: currentStep + 1 });
    }
  }, [track, currentStep]);

  const handleNext = useCallback(() => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      endTutorial(true);
    }
  }, [currentStep, endTutorial]);

  const handlePrev = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const handleSkip = useCallback(() => {
    endTutorial(false);
  }, [endTutorial]);

  return (
    <TutorialContext.Provider
      value={{
        showTutorial,
        currentStep,
        startTutorial,
        endTutorial,
        hasSeenTutorial,
      }}
    >
      {children}

      {/* Tutorial Overlay */}
      {showTutorial && (
        <TutorialStep
          step={TUTORIAL_STEPS[currentStep]}
          currentStep={currentStep}
          totalSteps={TUTORIAL_STEPS.length}
          onNext={handleNext}
          onPrev={handlePrev}
          onSkip={handleSkip}
          isFirst={currentStep === 0}
          isLast={currentStep === TUTORIAL_STEPS.length - 1}
        />
      )}
    </TutorialContext.Provider>
  );
}

/**
 * Completion message modal
 */
export function TutorialComplete({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4 backdrop-blur-sm">
      <div className="bg-slate-800 border border-purple-500/30 rounded-2xl p-8 max-w-md w-full shadow-2xl shadow-purple-500/20 animate-fadeIn text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-amber-400 mb-4">
          พร้อมแล้ว!
        </h2>
        <p className="text-slate-400 mb-6">
          คุณพร้อมเริ่มต้นการดูดวงแล้ว ขอให้ไพ่นำทางคุณสู่คำตอบที่ต้องการ
        </p>
        <button
          onClick={onClose}
          className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium rounded-xl transition-all"
        >
          🔮 เริ่มดูดวง
        </button>
      </div>
    </div>
  );
}

