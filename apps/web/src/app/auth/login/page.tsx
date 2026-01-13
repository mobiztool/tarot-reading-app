'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from '@/lib/validation/auth';
import { createClient } from '@/lib/supabase/client';
import { useRateLimiter } from '@/lib/hooks';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/';

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Rate limiting: 5 attempts, 15 minute lockout
  const { isLocked, remainingAttempts, lockoutTimeRemaining, recordAttempt } = useRateLimiter(5, 15);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Format lockout time remaining
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const onSubmit = async (data: LoginFormData) => {
    if (isLocked) {
      setError(`เข้าสู่ระบบล้มเหลวหลายครั้ง กรุณารอ ${formatTime(lockoutTimeRemaining)} นาที`);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (signInError) {
        recordAttempt(false); // Record failed attempt

        if (signInError.message.includes('Invalid login credentials')) {
          const attemptsMsg = remainingAttempts > 1
            ? ` (เหลือ ${remainingAttempts - 1} ครั้ง)`
            : ' (ครั้งสุดท้าย)';
          setError(`อีเมลหรือรหัสผ่านไม่ถูกต้อง${attemptsMsg}`);
        } else if (signInError.message.includes('Email not confirmed')) {
          setError('กรุณายืนยันอีเมลของคุณก่อนเข้าสู่ระบบ');
        } else {
          setError(signInError.message);
        }
        return;
      }

      recordAttempt(true); // Record successful attempt (resets counter)

      // Redirect to intended page or home
      router.push(redirectTo);
      router.refresh();
    } catch (err) {
      recordAttempt(false);
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-950/20 to-slate-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <span className="text-4xl">🔮</span>
          </Link>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-300 to-amber-300">
            เข้าสู่ระบบ
          </h1>
          <p className="text-slate-400 mt-2">ยินดีต้อนรับกลับ</p>
        </div>

        {/* Form Card */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 shadow-xl">
          <form 
            onSubmit={handleSubmit(onSubmit)} 
            className="space-y-6"
            aria-label="ฟอร์มเข้าสู่ระบบ"
            noValidate
          >
            {/* Error Message - Screen reader announcement */}
            {error && (
              <div 
                className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400 text-sm"
                role="alert"
                aria-live="assertive"
              >
                <span className="sr-only">ข้อผิดพลาด: </span>
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                อีเมล <span className="text-red-400" aria-hidden="true">*</span>
                <span className="sr-only">(จำเป็น)</span>
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                aria-required="true"
                aria-invalid={errors.email ? 'true' : 'false'}
                aria-describedby={errors.email ? 'email-error' : undefined}
                className={`w-full px-4 py-3 bg-slate-900/50 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all min-h-[48px] ${
                  errors.email
                    ? 'border-red-500 focus:ring-red-500/50'
                    : 'border-slate-700 focus:ring-purple-500/50 focus:border-purple-500'
                }`}
                placeholder="you@example.com"
                {...register('email')}
              />
              {errors.email && (
                <p id="email-error" className="mt-1 text-sm text-red-400" role="alert">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                  รหัสผ่าน <span className="text-red-400" aria-hidden="true">*</span>
                  <span className="sr-only">(จำเป็น)</span>
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-purple-400 hover:text-purple-300 min-h-[44px] flex items-center"
                >
                  ลืมรหัสผ่าน?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  aria-required="true"
                  aria-invalid={errors.password ? 'true' : 'false'}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                  className={`w-full px-4 py-3 pr-12 bg-slate-900/50 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all min-h-[48px] ${
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label={showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
                  aria-pressed={showPassword}
                >
                  <span aria-hidden="true">{showPassword ? '🙈' : '👁️'}</span>
                </button>
              </div>
              {errors.password && (
                <p id="password-error" className="mt-1 text-sm text-red-400" role="alert">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Lockout Warning */}
            {isLocked && (
              <div className="bg-amber-500/10 border border-amber-500/50 rounded-lg p-4 text-amber-400 text-sm text-center">
                🔒 บัญชีถูกล็อคชั่วคราว
                <br />
                กรุณารอ <span className="font-mono font-bold">{formatTime(lockoutTimeRemaining)}</span> นาที
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || isLocked}
              aria-busy={isLoading}
              className="w-full py-3 px-4 min-h-[48px] bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="animate-spin">⏳</span>
                  กำลังเข้าสู่ระบบ...
                </>
              ) : isLocked ? (
                <>
                  🔒 ถูกล็อค
                </>
              ) : (
                <>
                  🔓 เข้าสู่ระบบ
                </>
              )}
            </button>
          </form>

          {/* Signup Link */}
          <div className="mt-6 text-center text-slate-400 text-sm">
            ยังไม่มีบัญชี?{' '}
            <Link href="/auth/signup" className="text-purple-400 hover:text-purple-300 font-medium">
              สร้างบัญชีใหม่
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

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-950/20 to-slate-900 flex items-center justify-center">
          <div className="animate-spin text-4xl">🔮</div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}


