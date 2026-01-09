// Cookie Consent Banner Component
// PDPA Compliance - Simple version for MVP

'use client';

import { useState, useEffect } from 'react';
import {
  CONSENT_KEY,
  getConsent,
  setConsent,
  hasConsentDecision,
  initializeAnalytics,
} from '@/lib/analytics';

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already made a decision
    const hasDecision = hasConsentDecision();

    if (!hasDecision) {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (getConsent()) {
      // User previously accepted - initialize analytics
      initializeAnalytics();
    }
  }, []);

  const handleAccept = () => {
    setConsent(true);
    setShowBanner(false);
    initializeAnalytics();

    // Reload scripts by triggering a soft navigation
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('analytics-consent-changed'));
    }
  };

  const handleDecline = () => {
    setConsent(false);
    setShowBanner(false);
    console.log('[Analytics] User declined tracking');
  };

  if (!showBanner) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity" />

      {/* Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
        <div className="bg-gradient-to-r from-purple-dark to-blue-dark shadow-2xl border-t-2 border-gold">
          <div className="container mx-auto px-4 py-6 max-w-5xl">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Message */}
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-white font-semibold text-lg mb-2">
                  🍪 เราใช้คุกกี้เพื่อปรับปรุงประสบการณ์ของคุณ
                </h3>
                <p className="text-slate-200 text-sm leading-relaxed">
                  เราใช้คุกกี้และเทคโนโลยีที่คล้ายกันเพื่อปรับปรุงประสบการณ์การใช้งาน
                  วิเคราะห์การเข้าชมเว็บไซต์ และช่วยในการตลาดของเรา การคลิก
                  &quot;ยอมรับทั้งหมด&quot; หมายความว่าคุณยินยอมให้เราใช้คุกกี้ทั้งหมด
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 shrink-0">
                <button
                  onClick={handleDecline}
                  className="px-6 py-3 rounded-lg border-2 border-white/30 text-white hover:bg-white/10 transition-all duration-200 font-medium text-sm whitespace-nowrap"
                >
                  ปฏิเสธ
                </button>
                <button
                  onClick={handleAccept}
                  className="px-6 py-3 rounded-lg bg-gold hover:bg-gold-dark text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm whitespace-nowrap"
                >
                  ✓ ยอมรับทั้งหมด
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
