'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAnalytics } from '@/lib/hooks';

interface OnboardingModalProps {
  userName?: string | null;
  onComplete: () => void;
  onSkip: () => void;
}

const BENEFITS = [
  {
    emoji: '📜',
    title: 'เก็บประวัติอัตโนมัติ',
    description: 'ดูดวงย้อนหลังได้ทุกเมื่อ',
  },
  {
    emoji: '📊',
    title: 'ติดตามพัฒนาการ',
    description: 'เห็นแพทเทิร์นและแนวโน้มชีวิต',
  },
  {
    emoji: '🔒',
    title: 'ปลอดภัย & ส่วนตัว',
    description: 'ข้อมูลของคุณถูกปกป้อง',
  },
];

export function OnboardingModal({ userName, onComplete, onSkip }: OnboardingModalProps) {
  const [step, setStep] = useState(0);
  const { track } = useAnalytics();

  useEffect(() => {
    track('onboarding_started');
  }, [track]);

  const handleComplete = () => {
    track('onboarding_completed', { step: step + 1 });
    onComplete();
  };

  const handleSkip = () => {
    track('onboarding_skipped', { step: step + 1 });
    onSkip();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4 animate-fadeIn">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-500/30 rounded-3xl p-8 max-w-md w-full shadow-2xl shadow-purple-500/20">
        {step === 0 && (
          <>
            {/* Welcome Step */}
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-500/30 to-amber-500/30 rounded-full flex items-center justify-center">
                <span className="text-5xl">🔮</span>
              </div>

              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-amber-400 mb-2">
                ยินดีต้อนรับ{userName ? ` ${userName}` : ''}!
              </h2>

              <p className="text-slate-400 mb-8">
                ตอนนี้ประวัติการดูดวงของคุณจะถูกบันทึกอัตโนมัติ
              </p>

              {/* Benefits */}
              <div className="space-y-4 mb-8">
                {BENEFITS.map((benefit, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-4 bg-slate-900/50 rounded-xl"
                  >
                    <span className="text-3xl">{benefit.emoji}</span>
                    <div className="text-left">
                      <h3 className="font-medium text-white">{benefit.title}</h3>
                      <p className="text-sm text-slate-400">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setStep(1)}
                className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium rounded-xl transition-all duration-300 mb-3"
              >
                ต่อไป →
              </button>

              <button
                onClick={handleSkip}
                className="text-slate-500 hover:text-slate-300 transition-colors text-sm"
              >
                ข้ามไปก่อน
              </button>
            </div>
          </>
        )}

        {step === 1 && (
          <>
            {/* Complete Profile Step */}
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-amber-500/30 to-purple-500/30 rounded-full flex items-center justify-center">
                <span className="text-5xl">✨</span>
              </div>

              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-purple-400 mb-2">
                พร้อมแล้ว!
              </h2>

              <p className="text-slate-400 mb-8">
                คุณสามารถเพิ่มชื่อและรูปโปรไฟล์ได้ภายหลังที่หน้าโปรไฟล์
              </p>

              <div className="space-y-3">
                <Link
                  href="/reading"
                  onClick={handleComplete}
                  className="block w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium rounded-xl transition-all duration-300"
                >
                  🔮 เริ่มดูดวงเลย
                </Link>

                <Link
                  href="/profile"
                  onClick={handleComplete}
                  className="block w-full py-3 px-6 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl transition-colors"
                >
                  👤 ไปตั้งค่าโปรไฟล์
                </Link>
              </div>
            </div>
          </>
        )}

        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {[0, 1].map((i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === step ? 'bg-purple-500' : 'bg-slate-700'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

