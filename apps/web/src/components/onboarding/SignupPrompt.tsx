'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAnalytics } from '@/lib/hooks';

interface SignupPromptProps {
  readingsCount: number;
  onDismiss: () => void;
}

const STORAGE_KEY = 'signupPromptLastShown';
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export function SignupPrompt({ readingsCount, onDismiss }: SignupPromptProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { track } = useAnalytics();

  useEffect(() => {
    // Check if we should show the prompt
    const lastShown = localStorage.getItem(STORAGE_KEY);
    const now = Date.now();

    // Don't show if shown within last 24 hours
    if (lastShown && now - parseInt(lastShown, 10) < ONE_DAY_MS) {
      return;
    }

    // Show after 2nd reading
    if (readingsCount >= 2) {
      setIsVisible(true);
      localStorage.setItem(STORAGE_KEY, now.toString());
      track('signup_prompt_shown', { readingsCount });
    }
  }, [readingsCount, track]);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss();
  };

  const handleSignup = () => {
    track('signup_from_prompt', { readingsCount });
    // Navigation will happen via Link
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-4 animate-slideUp">
      <div className="max-w-md mx-auto bg-gradient-to-br from-purple-900 to-indigo-900 border border-purple-500/30 rounded-2xl p-6 shadow-2xl shadow-purple-500/20">
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-slate-400 hover:text-white transition-colors"
        >
          ✕
        </button>

        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-purple-500/30 to-amber-500/30 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">💫</span>
          </div>

          <div className="flex-1">
            <h3 className="font-bold text-white mb-1">บันทึกประวัติการดูดวงของคุณ!</h3>
            <p className="text-sm text-slate-300 mb-4">
              คุณดูดวงไปแล้ว {readingsCount} ครั้ง สมัครสมาชิกฟรีเพื่อบันทึกประวัติและดูย้อนหลังได้ทุกเมื่อ
            </p>

            <div className="flex gap-3">
              <Link
                href="/auth/signup"
                onClick={handleSignup}
                className="flex-1 py-2 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-medium rounded-xl text-center transition-all"
              >
                สมัครเลย
              </Link>
              <button
                onClick={handleDismiss}
                className="py-2 px-4 text-slate-400 hover:text-white text-sm transition-colors"
              >
                ไว้ทีหลัง
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

