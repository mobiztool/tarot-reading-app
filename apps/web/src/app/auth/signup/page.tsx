'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, SignupFormData } from '@/lib/validation/auth';
import { PasswordStrength } from '@/components/auth';
import { createClient } from '@/lib/supabase/client';

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      termsAccepted: false,
      pdpaConsent: false,
    },
  });

  const passwordValue = watch('password', '');

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();

      const { error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            pdpa_consent: data.pdpaConsent,
            terms_accepted: data.termsAccepted,
          },
        },
      });

      if (signUpError) {
        if (signUpError.message.includes('already registered')) {
          setError('อีเมลนี้ถูกใช้งานแล้ว');
        } else {
          setError(signUpError.message);
        }
        return;
      }

      // Redirect to verify email page
      router.push('/auth/verify-email');
    } catch (err) {
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
      console.error('Signup error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-950/20 to-slate-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-block mb-4">
            <span className="text-4xl">🔮</span>
          </Link>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-300 to-amber-300">
            สร้างบัญชีใหม่
          </h1>
          <p className="text-slate-400 mt-2">ปลดล็อค 3 รูปแบบพิเศษฟรี!</p>
        </div>

        {/* Value Proposition - Unlock Spreads */}
        <div className="mb-6 p-4 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-2xl border border-purple-500/30">
          <p className="text-purple-200 text-sm font-medium text-center mb-3">
            ✨ สมัครแล้วได้อะไรบ้าง?
          </p>
          <div className="grid grid-cols-3 gap-2">
            {/* Love Spread */}
            <div className="text-center p-2 bg-slate-900/30 rounded-xl">
              <div className="text-2xl mb-1">💕</div>
              <p className="text-rose-300 text-xs font-medium">ความรัก</p>
            </div>
            {/* Career Spread */}
            <div className="text-center p-2 bg-slate-900/30 rounded-xl">
              <div className="text-2xl mb-1">💼</div>
              <p className="text-emerald-300 text-xs font-medium">การงาน</p>
            </div>
            {/* Yes/No Spread */}
            <div className="text-center p-2 bg-slate-900/30 rounded-xl">
              <div className="text-2xl mb-1">🔮</div>
              <p className="text-violet-300 text-xs font-medium">Yes/No</p>
            </div>
          </div>
          <p className="text-purple-300/70 text-xs text-center mt-3">
            + บันทึกประวัติ • ดูสถิติ • แจ้งเตือนดวงประจำวัน
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 shadow-xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                อีเมล
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className={`w-full px-4 py-3 bg-slate-900/50 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                  errors.email
                    ? 'border-red-500 focus:ring-red-500/50'
                    : 'border-slate-700 focus:ring-purple-500/50 focus:border-purple-500'
                }`}
                placeholder="you@example.com"
                {...register('email')}
              />
              {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                รหัสผ่าน
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className={`w-full px-4 py-3 pr-12 bg-slate-900/50 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                    errors.password
                      ? 'border-red-500 focus:ring-red-500/50'
                      : 'border-slate-700 focus:ring-purple-500/50 focus:border-purple-500'
                  }`}
                  placeholder="••••••••"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
              )}
              <PasswordStrength password={passwordValue} />
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                ยืนยันรหัสผ่าน
              </label>
              <input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                className={`w-full px-4 py-3 bg-slate-900/50 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                  errors.confirmPassword
                    ? 'border-red-500 focus:ring-red-500/50'
                    : 'border-slate-700 focus:ring-purple-500/50 focus:border-purple-500'
                }`}
                placeholder="••••••••"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-400">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Terms Checkbox */}
            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-1 w-4 h-4 rounded border-slate-600 bg-slate-900/50 text-purple-500 focus:ring-purple-500/50"
                  {...register('termsAccepted')}
                />
                <span className="text-sm text-slate-400">
                  ฉันยอมรับ{' '}
                  <Link href="/terms" className="text-purple-400 hover:text-purple-300 underline">
                    ข้อกำหนดการใช้งาน
                  </Link>{' '}
                  และ{' '}
                  <Link href="/privacy" className="text-purple-400 hover:text-purple-300 underline">
                    นโยบายความเป็นส่วนตัว
                  </Link>
                </span>
              </label>
              {errors.termsAccepted && (
                <p className="text-sm text-red-400">{errors.termsAccepted.message}</p>
              )}

              {/* PDPA Checkbox */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-1 w-4 h-4 rounded border-slate-600 bg-slate-900/50 text-purple-500 focus:ring-purple-500/50"
                  {...register('pdpaConsent')}
                />
                <span className="text-sm text-slate-400">
                  ฉันยินยอมให้เก็บรวบรวมและใช้ข้อมูลส่วนบุคคลตาม{' '}
                  <Link href="/privacy" className="text-purple-400 hover:text-purple-300 underline">
                    พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA)
                  </Link>
                </span>
              </label>
              {errors.pdpaConsent && (
                <p className="text-sm text-red-400">{errors.pdpaConsent.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:from-slate-600 disabled:to-slate-600 text-white font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="animate-spin">⏳</span>
                  กำลังสร้างบัญชี...
                </>
              ) : (
                <>
                  ✨ สร้างบัญชี
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center text-slate-400 text-sm">
            มีบัญชีอยู่แล้ว?{' '}
            <Link href="/auth/login" className="text-purple-400 hover:text-purple-300 font-medium">
              เข้าสู่ระบบ
            </Link>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-slate-500 hover:text-slate-300 transition-colors inline-flex items-center gap-2 text-sm"
          >
            <span>←</span>
            กลับหน้าแรก
          </Link>
        </div>
      </div>
    </div>
  );
}


