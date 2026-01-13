'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, useAnalytics } from '@/lib/hooks';
import { Header } from '@/components/layout/Header';
import { ThemeSelector } from '@/components/settings';
import { useTutorial } from '@/components/onboarding';
import { SpreadAccessSection } from '@/components/settings/SpreadAccessSection';
import { PageLoader } from '@/components/ui/MysticalLoader';

interface UserPreferences {
  dailyReminder: boolean;
  weeklySummary: boolean;
  marketingEmails: boolean;
  language: 'th' | 'en';
  theme: 'dark' | 'light' | 'system';
}

export default function SettingsPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { track } = useAnalytics();
  const { startTutorial, hasSeenTutorial } = useTutorial();

  const [preferences, setPreferences] = useState<UserPreferences>({
    dailyReminder: false,
    weeklySummary: false,
    marketingEmails: false,
    language: 'th',
    theme: 'dark',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login?redirectTo=/settings');
    } else if (user) {
      track('settings_viewed');
      // Load saved preferences from localStorage
      const savedPrefs = localStorage.getItem('userPreferences');
      if (savedPrefs) {
        try {
          setPreferences(JSON.parse(savedPrefs));
        } catch (e) {
          console.error('Error parsing preferences:', e);
        }
      }
    }
  }, [user, authLoading, router, track]);

  const handleToggle = (key: keyof UserPreferences) => {
    if (key === 'dailyReminder' || key === 'weeklySummary') {
      // These are coming soon
      return;
    }
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSelectChange = (key: 'language' | 'theme', value: string) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Save to localStorage (in production, this would be saved to database)
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
      track('settings_updated', { updated: true });
      setSuccessMessage('บันทึกการตั้งค่าสำเร็จ');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Error saving preferences:', err);
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading) {
    return (
      <>
        <Header />
        <PageLoader message="กำลังโหลด..." />
      </>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-950/20 to-slate-900 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-300 to-amber-300 mb-2">
              ⚙️ ตั้งค่า
            </h1>
            <p className="text-slate-400">จัดการการตั้งค่าบัญชีของคุณ</p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 bg-green-500/10 border border-green-500/50 rounded-lg p-4 text-green-400 text-center">
              ✅ {successMessage}
            </div>
          )}

          {/* Email Preferences */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 shadow-xl mb-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              📧 การแจ้งเตือนทางอีเมล
            </h2>

            <div className="space-y-4">
              {/* Daily Reminder - Coming Soon */}
              <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg opacity-60">
                <div>
                  <p className="text-slate-300 font-medium">เตือนดูดวงประจำวัน</p>
                  <p className="text-slate-500 text-sm">รับแจ้งเตือนให้ดูดวงทุกเช้า</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-amber-400 bg-amber-500/20 px-2 py-1 rounded">
                    เร็วๆ นี้
                  </span>
                  <div className="w-12 h-6 bg-slate-600 rounded-full relative cursor-not-allowed">
                    <div className="w-5 h-5 bg-slate-400 rounded-full absolute top-0.5 left-0.5"></div>
                  </div>
                </div>
              </div>

              {/* Weekly Summary - Coming Soon */}
              <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg opacity-60">
                <div>
                  <p className="text-slate-300 font-medium">สรุปรายสัปดาห์</p>
                  <p className="text-slate-500 text-sm">รับอีเมลสรุปดวงประจำสัปดาห์</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-amber-400 bg-amber-500/20 px-2 py-1 rounded">
                    เร็วๆ นี้
                  </span>
                  <div className="w-12 h-6 bg-slate-600 rounded-full relative cursor-not-allowed">
                    <div className="w-5 h-5 bg-slate-400 rounded-full absolute top-0.5 left-0.5"></div>
                  </div>
                </div>
              </div>

              {/* Marketing Emails */}
              <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                <div>
                  <p className="text-slate-300 font-medium">อีเมลโปรโมชัน</p>
                  <p className="text-slate-500 text-sm">รับข่าวสารและโปรโมชันพิเศษ</p>
                </div>
                <button
                  onClick={() => handleToggle('marketingEmails')}
                  className={`w-12 h-6 rounded-full relative transition-colors ${
                    preferences.marketingEmails ? 'bg-purple-600' : 'bg-slate-600'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${
                      preferences.marketingEmails ? 'left-6' : 'left-0.5'
                    }`}
                  ></div>
                </button>
              </div>
            </div>
          </div>

          {/* Spread Access */}
          <SpreadAccessSection />

          {/* Display Preferences */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 shadow-xl mb-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              🌐 การแสดงผล
            </h2>

            <div className="space-y-4 mb-6">
              {/* Language */}
              <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                <div>
                  <p className="text-slate-300 font-medium">ภาษา</p>
                  <p className="text-slate-500 text-sm">เลือกภาษาที่ต้องการ</p>
                </div>
                <select
                  value={preferences.language}
                  onChange={(e) => handleSelectChange('language', e.target.value)}
                  className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                >
                  <option value="th">🇹🇭 ไทย</option>
                  <option value="en">🇬🇧 English</option>
                </select>
              </div>
            </div>

            {/* Theme Selector */}
            <ThemeSelector showPreview={true} />
          </div>

          {/* Help & Tutorial */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 shadow-xl mb-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              📚 ความช่วยเหลือ
            </h2>

            <div className="space-y-4">
              {/* Replay Tutorial */}
              <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                <div>
                  <p className="text-slate-300 font-medium">บทแนะนำการใช้งาน</p>
                  <p className="text-slate-500 text-sm">
                    {hasSeenTutorial ? 'ดูบทแนะนำอีกครั้ง' : 'ยังไม่ได้ดูบทแนะนำ'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    track('tutorial_replay_clicked');
                    startTutorial();
                  }}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors text-sm"
                >
                  🎬 เริ่มบทแนะนำ
                </button>
              </div>
            </div>
          </div>

          {/* Privacy */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 shadow-xl mb-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              🔒 ความเป็นส่วนตัว
            </h2>

            <div className="space-y-3">
              <Link
                href="/privacy"
                className="block p-4 bg-slate-700/30 hover:bg-slate-700/50 rounded-lg transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">นโยบายความเป็นส่วนตัว</span>
                  <span className="text-slate-500">→</span>
                </div>
              </Link>
              <Link
                href="/terms"
                className="block p-4 bg-slate-700/30 hover:bg-slate-700/50 rounded-lg transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">ข้อกำหนดการใช้งาน</span>
                  <span className="text-slate-500">→</span>
                </div>
              </Link>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end gap-4">
            <Link
              href="/profile"
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors"
            >
              ← กลับไปโปรไฟล์
            </Link>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:from-slate-600 disabled:to-slate-600 text-white font-medium rounded-xl transition-all duration-300"
            >
              {isSaving ? (
                <>
                  <span className="animate-spin inline-block mr-2">⏳</span>
                  กำลังบันทึก...
                </>
              ) : (
                '💾 บันทึกการตั้งค่า'
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

