'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks';
import { SubscriptionBadge } from '@/components/subscription';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, isLoading, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    setIsUserMenuOpen(false);
    router.push('/');
    router.refresh();
  };

  return (
    <header 
      className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-purple/20"
      role="banner"
    >
      <nav 
        id="main-nav"
        className="container mx-auto px-4 sm:px-6 lg:px-8"
        aria-label="เมนูหลัก"
      >
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 text-xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-light to-gold hover:from-purple to-gold-dark transition-all"
            aria-label="ดูดวงไพ่ยิปซี - กลับหน้าหลัก"
          >
            <svg 
              width="28" 
              height="28" 
              viewBox="0 0 36 36" 
              className="inline-block"
              aria-hidden="true"
            >
              {/* Crystal Ball Base */}
              <ellipse fill="#C1694F" cx="18" cy="32" rx="10" ry="4"/>
              <ellipse fill="#FFCC4D" cx="18" cy="31" rx="8" ry="3"/>
              {/* Crystal Ball */}
              <circle fill="#AA8ED6" cx="18" cy="16" r="14"/>
              <circle fill="#9266CC" cx="18" cy="16" r="12"/>
              {/* Shine effects */}
              <circle fill="#E1C8EE" cx="12" cy="10" r="3"/>
              <circle fill="#E1C8EE" cx="16" cy="7" r="1.5"/>
            </svg>
            <span>ดูดวงไพ่ยิปซี</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/reading"
              className="text-slate-300 hover:text-purple-light transition-colors font-medium"
            >
              ดูดวง
            </Link>
            <Link
              href="/reading#pro"
              className="text-slate-300 hover:text-purple-light transition-colors font-medium flex items-center gap-1"
            >
              <span className="text-yellow-400">⭐</span>
              <span>Premium</span>
            </Link>
            <Link
              href="/cards"
              className="text-slate-300 hover:text-purple-light transition-colors font-medium"
            >
              คู่มือไพ่
            </Link>
            <Link
              href="/history"
              className="text-slate-300 hover:text-purple-light transition-colors font-medium"
            >
              ประวัติ
            </Link>

            {/* Auth Section */}
            {isLoading ? (
              <div className="w-8 h-8 rounded-full bg-slate-700 animate-pulse" />
            ) : user ? (
              <div className="relative">
                <div className="flex items-center gap-2">
                  <SubscriptionBadge size="sm" showLink={true} />
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 text-slate-300 hover:text-purple-light hover:bg-slate-800 rounded-lg transition-colors min-h-[44px]"
                    aria-expanded={isUserMenuOpen}
                    aria-haspopup="menu"
                    aria-label="เมนูผู้ใช้"
                  >
                    <span className="text-xl" aria-hidden="true">👤</span>
                    <span className="text-sm max-w-[120px] truncate">{user.email}</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* User Dropdown */}
                {isUserMenuOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl py-1 z-50"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                  >
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-slate-300 hover:text-purple-light hover:bg-slate-700 transition-colors min-h-[44px] flex items-center"
                      onClick={() => setIsUserMenuOpen(false)}
                      role="menuitem"
                    >
                      <span aria-hidden="true">👤</span>
                      <span className="ml-2">โปรไฟล์</span>
                    </Link>
                    <Link
                      href="/history"
                      className="block px-4 py-2 text-sm text-slate-300 hover:text-purple-light hover:bg-slate-700 transition-colors min-h-[44px] flex items-center"
                      onClick={() => setIsUserMenuOpen(false)}
                      role="menuitem"
                    >
                      <span aria-hidden="true">📜</span>
                      <span className="ml-2">ประวัติการดู</span>
                    </Link>
                    <Link
                      href="/profile/billing"
                      className="block px-4 py-2 text-sm text-slate-300 hover:text-purple-light hover:bg-slate-700 transition-colors min-h-[44px] flex items-center"
                      onClick={() => setIsUserMenuOpen(false)}
                      role="menuitem"
                    >
                      <span aria-hidden="true">💳</span>
                      <span className="ml-2">การเรียกเก็บเงิน</span>
                    </Link>
                    <hr className="my-1 border-slate-700" aria-hidden="true" />
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-slate-700 transition-colors min-h-[44px] flex items-center"
                      role="menuitem"
                    >
                      <span aria-hidden="true">🚪</span>
                      <span className="ml-2">ออกจากระบบ</span>
                    </button>
                  </div>
                )}
                </div>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-lg transition-all"
              >
                เข้าสู่ระบบ
              </Link>
            )}
          </div>

          {/* Mobile: Subscription Badge + Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            {user && <SubscriptionBadge size="sm" showLink={true} />}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-purple-light hover:bg-slate-800 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label={isMenuOpen ? 'ปิดเมนู' : 'เปิดเมนู'}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
            {isMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div 
            id="mobile-menu"
            className="md:hidden py-4 space-y-2 border-t border-purple/20"
            role="navigation"
            aria-label="เมนูมือถือ"
          >
            <Link
              href="/reading"
              className="block px-4 py-3 text-slate-300 hover:text-purple-light hover:bg-slate-800 rounded-lg transition-colors min-h-[44px]"
              onClick={() => setIsMenuOpen(false)}
            >
              ดูดวง
            </Link>
            <Link
              href="/reading#pro"
              className="block px-4 py-3 text-slate-300 hover:text-purple-light hover:bg-slate-800 rounded-lg transition-colors min-h-[44px] flex items-center gap-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="text-yellow-400">⭐</span>
              <span>Premium Spreads</span>
            </Link>
            <Link
              href="/cards"
              className="block px-4 py-3 text-slate-300 hover:text-purple-light hover:bg-slate-800 rounded-lg transition-colors min-h-[44px]"
              onClick={() => setIsMenuOpen(false)}
            >
              คู่มือไพ่
            </Link>
            <Link
              href="/history"
              className="block px-4 py-3 text-slate-300 hover:text-purple-light hover:bg-slate-800 rounded-lg transition-colors min-h-[44px]"
              onClick={() => setIsMenuOpen(false)}
            >
              ประวัติ
            </Link>

            {/* Mobile Auth */}
            <hr className="border-purple/20" />
            {isLoading ? (
              <div className="px-4 py-2">
                <div className="w-full h-10 rounded-lg bg-slate-700 animate-pulse" />
              </div>
            ) : user ? (
              <>
                <div className="px-4 py-2 text-sm text-slate-400 flex items-center justify-between">
                  <span>👤 {user.email}</span>
                  <SubscriptionBadge size="sm" showLink={false} />
                </div>
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-slate-300 hover:text-purple-light hover:bg-slate-800 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  👤 โปรไฟล์
                </Link>
                <Link
                  href="/profile/billing"
                  className="block px-4 py-2 text-slate-300 hover:text-purple-light hover:bg-slate-800 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  💳 การเรียกเก็บเงิน
                </Link>
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-red-400 hover:text-red-300 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  🚪 ออกจากระบบ
                </button>
              </>
            ) : (
              <div className="px-4 py-2 space-y-2">
                <Link
                  href="/auth/login"
                  className="block w-full text-center py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-lg transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  เข้าสู่ระบบ
                </Link>
                <Link
                  href="/auth/signup"
                  className="block w-full text-center py-2 text-sm font-medium text-purple-400 border border-purple-500/50 hover:bg-purple-500/10 rounded-lg transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  สร้างบัญชี
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
