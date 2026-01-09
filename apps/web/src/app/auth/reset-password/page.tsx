'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema, ResetPasswordFormData } from '@/lib/validation/auth';
import { createClient } from '@/lib/supabase/client';
import { PasswordStrength } from '@/components/auth';
import { useAnalytics } from '@/lib/hooks';

export default function ResetPasswordPage() {
  const router = useRouter();
  const { track } = useAnalytics();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSessionValid, setIsSessionValid] = useState<boolean | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  // Watch password for strength indicator
  const watchedPassword = watch('password', '');
  useEffect(() => {
    setPassword(watchedPassword);
  }, [watchedPassword]);

  // Check if user has a valid session (from the recovery link)
  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      setIsSessionValid(!!session);
    };
    checkSession();
  }, []);

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();

      const { error: updateError } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (updateError) {
        if (updateError.message.includes('same password')) {
          setError('รหัสผ่านใหม่ต้องไม่เหมือนกับรหัสผ่านเดิม');
        } else {
          setError(updateError.message);
        }
        return;
      }

      track('password_reset_completed', { auto_login: true });
      setIsSuccess(true);

      // Redirect to profile after 2 seconds
      setTimeout(() => {
        router.push('/profile');
        router.refresh();
      }, 2000);
    } catch (err) {
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
      console.error('Reset password error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state while checking session
  if (isSessionValid === null) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-950/20 to-slate-900 flex items-center justify-center">
        <div className="animate-spin text-4xl">🔮</div>
      </div>
    );
  }

  // Invalid or expired session
  if (!isSessionValid) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-950/20 to-slate-900 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center">
          {/* Error Icon */}
          <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-red-500/30 to-orange-500/30 rounded-full flex items-center justify-center">
            <span className="text-5xl">⏰</span>
          </div>

          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-300 mb-4">
            ลิงก์หมดอายุ
          </h1>

          <p className="text-slate-400 mb-8">
            ลิงก์สำหรับรีเซ็ตรหัสผ่านหมดอายุแล้วหรือถูกใช้งานไปแล้ว กรุณาขอลิงก์ใหม่
          </p>

          <div className="space-y-4">
            <Link
              href="/auth/forgot-password"
              className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium rounded-xl transition-all duration-300"
            >
              📧 ขอลิงก์ใหม่
            </Link>

            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl transition-all duration-300"
            >
              🔓 กลับไปหน้าเข้าสู่ระบบ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-950/20 to-slate-900 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center">
          {/* Success Icon */}
          <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-green-500/30 to-emerald-500/30 rounded-full flex items-center justify-center">
            <span className="text-5xl">✅</span>
          </div>

          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300 mb-4">
            เปลี่ยนรหัสผ่านสำเร็จ!
          </h1>

          <p className="text-slate-400 mb-8">
            รหัสผ่านของคุณถูกอัพเดทแล้ว กำลังพาคุณไปยังหน้าโปรไฟล์...
          </p>

          <div className="flex items-center justify-center gap-2 text-purple-400">
            <span className="animate-spin">⏳</span>
            <span>กำลังเปลี่ยนหน้า...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-950/20 to-slate-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <span className="text-4xl">🔮</span>
          </Link>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-300 to-amber-300">
            ตั้งรหัสผ่านใหม่
          </h1>
          <p className="text-slate-400 mt-2">กรุณากำหนดรหัสผ่านใหม่ของคุณ</p>
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

            {/* New Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                รหัสผ่านใหม่
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

              {/* Password Strength */}
              {password && <PasswordStrength password={password} />}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                ยืนยันรหัสผ่านใหม่
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className={`w-full px-4 py-3 pr-12 bg-slate-900/50 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                    errors.confirmPassword
                      ? 'border-red-500 focus:ring-red-500/50'
                      : 'border-slate-700 focus:ring-purple-500/50 focus:border-purple-500'
                  }`}
                  placeholder="••••••••"
                  {...register('confirmPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                >
                  {showConfirmPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-400">{errors.confirmPassword.message}</p>
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
                  กำลังอัพเดท...
                </>
              ) : (
                <>
                  🔐 ตั้งรหัสผ่านใหม่
                </>
              )}
            </button>
          </form>
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
