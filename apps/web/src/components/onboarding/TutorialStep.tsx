'use client';

import { useEffect, useState, useCallback } from 'react';

export interface TutorialStepData {
  id: string;
  title: string;
  description: string;
  targetSelector?: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  emoji?: string;
}

interface TutorialStepProps {
  step: TutorialStepData;
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
  isFirst: boolean;
  isLast: boolean;
}

/**
 * Individual tutorial step with tooltip
 */
export function TutorialStep({
  step,
  currentStep,
  totalSteps,
  onNext,
  onPrev,
  onSkip,
  isFirst,
  isLast,
}: TutorialStepProps) {
  const [position, setPosition] = useState({ top: '50%', left: '50%' });

  // Position tooltip based on target element
  useEffect(() => {
    if (step.targetSelector) {
      const target = document.querySelector(step.targetSelector);
      if (target) {
        const rect = target.getBoundingClientRect();
        const padding = 20;
        
        switch (step.position) {
          case 'top':
            setPosition({
              top: `${rect.top - padding}px`,
              left: `${rect.left + rect.width / 2}px`,
            });
            break;
          case 'bottom':
            setPosition({
              top: `${rect.bottom + padding}px`,
              left: `${rect.left + rect.width / 2}px`,
            });
            break;
          case 'left':
            setPosition({
              top: `${rect.top + rect.height / 2}px`,
              left: `${rect.left - padding}px`,
            });
            break;
          case 'right':
            setPosition({
              top: `${rect.top + rect.height / 2}px`,
              left: `${rect.right + padding}px`,
            });
            break;
          default:
            setPosition({ top: '50%', left: '50%' });
        }
        
        // Highlight target element
        target.classList.add('tutorial-highlight');
        return () => target.classList.remove('tutorial-highlight');
      }
    }
  }, [step.targetSelector, step.position]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onSkip();
      if (e.key === 'ArrowRight' || e.key === 'Enter') onNext();
      if (e.key === 'ArrowLeft' && !isFirst) onPrev();
    },
    [onSkip, onNext, onPrev, isFirst]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const isCenter = step.position === 'center' || !step.targetSelector;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
        onClick={onSkip}
      />

      {/* Tooltip */}
      <div
        className={`
          fixed z-50 w-80 max-w-[90vw]
          ${isCenter ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' : '-translate-x-1/2'}
        `}
        style={isCenter ? undefined : { top: position.top, left: position.left }}
        role="dialog"
        aria-labelledby="tutorial-title"
        aria-describedby="tutorial-description"
      >
        <div className="bg-slate-800 border border-purple-500/30 rounded-2xl p-6 shadow-2xl shadow-purple-500/20 animate-fadeIn">
          {/* Emoji */}
          {step.emoji && (
            <div className="text-4xl mb-4 text-center">{step.emoji}</div>
          )}

          {/* Title */}
          <h3
            id="tutorial-title"
            className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-amber-400 mb-2 text-center"
          >
            {step.title}
          </h3>

          {/* Description */}
          <p
            id="tutorial-description"
            className="text-slate-400 text-center mb-6"
          >
            {step.description}
          </p>

          {/* Progress Dots */}
          <div className="flex justify-center gap-2 mb-6">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === currentStep
                    ? 'bg-purple-500 w-4'
                    : i < currentStep
                    ? 'bg-purple-400'
                    : 'bg-slate-600'
                }`}
              />
            ))}
          </div>

          {/* Step Counter */}
          <p className="text-center text-slate-500 text-xs mb-4">
            {currentStep + 1} / {totalSteps}
          </p>

          {/* Navigation */}
          <div className="flex gap-3">
            {!isFirst && (
              <button
                onClick={onPrev}
                className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors"
              >
                ← ย้อนกลับ
              </button>
            )}
            <button
              onClick={onNext}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg transition-all"
            >
              {isLast ? '✨ เริ่มใช้งาน' : 'ถัดไป →'}
            </button>
          </div>

          {/* Skip */}
          <button
            onClick={onSkip}
            className="w-full mt-4 text-slate-500 hover:text-slate-400 text-sm transition-colors"
          >
            ข้ามบทแนะนำ
          </button>
        </div>
      </div>
    </>
  );
}


