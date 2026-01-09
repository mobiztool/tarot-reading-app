'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useAnalytics } from '@/lib/hooks/useAnalytics';
import {
  SpreadConfig,
  getUpgradeBenefits,
  getUpgradeMessage,
} from '@/lib/access-control';

interface LoginGateProps {
  spread: SpreadConfig;
  redirectTo?: string;
}

/**
 * Login Gate Component
 * Shows an attractive gate when guests try to access protected spreads
 */
export function LoginGate({ spread, redirectTo }: LoginGateProps) {
  const { track } = useAnalytics();
  
  const loginUrl = redirectTo 
    ? `/auth/login?redirectTo=${encodeURIComponent(redirectTo)}`
    : `/auth/login?redirectTo=${encodeURIComponent(spread.route)}`;
  
  const signupUrl = redirectTo
    ? `/auth/signup?redirectTo=${encodeURIComponent(redirectTo)}`
    : `/auth/signup?redirectTo=${encodeURIComponent(spread.route)}`;

  // Track gate shown
  useEffect(() => {
    track('login_gate_shown', {
      spread_type: spread.id,
      spread_name: spread.name,
    });
  }, [track, spread.id, spread.name]);

  const upgradeMessage = getUpgradeMessage('guest', spread.id);
  const benefits = getUpgradeBenefits('guest');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950/30 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        {/* Gate Card */}
        <div className="relative bg-gradient-to-br from-purple-900/40 via-slate-900/80 to-indigo-900/40 rounded-3xl border border-purple-500/30 overflow-hidden shadow-2xl shadow-purple-900/30">
          {/* Decorative glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-purple-500/20 blur-3xl rounded-full" />
          
          <div className="relative p-8 md:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              {/* Icon */}
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-full flex items-center justify-center border border-purple-400/30 shadow-lg shadow-purple-500/20">
                <span className="text-5xl">{spread.icon}</span>
              </div>
              
              {/* Title */}
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                {spread.nameTh}
              </h1>
              <p className="text-purple-300 text-sm">
                {spread.name}
              </p>
            </div>

            {/* Lock indicator */}
            <div className="flex items-center justify-center gap-2 py-3 px-4 bg-amber-500/10 border border-amber-500/30 rounded-xl mb-6">
              <span className="text-xl">🔐</span>
              <span className="text-amber-200 font-medium">
                {upgradeMessage || 'ต้องเข้าสู่ระบบเพื่อใช้งาน'}
              </span>
            </div>

            {/* Spread info */}
            <div className="bg-slate-900/50 rounded-xl p-4 mb-6 border border-slate-700/50">
              <p className="text-slate-300 text-center mb-3">
                {spread.descriptionTh}
              </p>
              <div className="flex justify-center gap-6 text-sm">
                <span className="text-slate-400 flex items-center gap-1">
                  🃏 {spread.cardCount} ใบ
                </span>
                <span className="text-slate-400 flex items-center gap-1">
                  ⏱️ {spread.estimatedTime}
                </span>
              </div>
            </div>

            {/* Benefits */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-white mb-4 text-center">
                ✨ สิทธิประโยชน์สำหรับสมาชิก
              </h2>
              <ul className="space-y-2.5">
                {benefits.slice(0, 4).map((benefit, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-purple-200/90 text-sm"
                  >
                    <span className="flex-shrink-0">{benefit.substring(0, 2)}</span>
                    <span>{benefit.substring(2).trim()}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTAs */}
            <div className="space-y-3">
              {/* Primary CTA - Signup */}
              <Link
                href={signupUrl}
                className="block w-full py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-500 hover:via-pink-500 hover:to-purple-500 text-white font-bold text-center rounded-xl shadow-lg shadow-purple-900/40 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                onClick={() => {
                  track('signup_from_gate', {
                    spread_type: spread.id,
                    spread_name: spread.name,
                  });
                }}
              >
                🎉 สมัครฟรี - ปลดล็อคทันที
              </Link>

              {/* Secondary CTA - Login */}
              <Link
                href={loginUrl}
                className="block w-full py-3 bg-transparent border border-purple-500/50 text-purple-300 hover:text-white hover:border-purple-400 font-medium text-center rounded-xl transition-colors"
                onClick={() => {
                  track('login_from_gate', {
                    spread_type: spread.id,
                    spread_name: spread.name,
                  });
                }}
              >
                มีบัญชีแล้ว? เข้าสู่ระบบ
              </Link>
            </div>

            {/* Back link */}
            <div className="mt-6 text-center">
              <Link
                href="/reading"
                className="text-slate-500 hover:text-slate-300 text-sm transition-colors inline-flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                ดูรูปแบบอื่น
              </Link>
            </div>
          </div>
        </div>

        {/* Free spreads hint */}
        <p className="text-center text-slate-500 text-sm mt-6">
          💡 ลองใช้{' '}
          <Link href="/reading/daily" className="text-purple-400 hover:text-purple-300 underline">
            ดูดวงประจำวัน
          </Link>
          {' '}หรือ{' '}
          <Link href="/reading/three-card" className="text-purple-400 hover:text-purple-300 underline">
            ไพ่ 3 ใบ
          </Link>
          {' '}ได้โดยไม่ต้องสมัคร
        </p>
      </div>
    </div>
  );
}

export default LoginGate;

