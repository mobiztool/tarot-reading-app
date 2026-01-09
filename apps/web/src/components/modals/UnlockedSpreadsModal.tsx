'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAnalytics } from '@/lib/hooks/useAnalytics';

interface UnlockedSpreadsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UNLOCKED_SPREADS = [
  {
    id: 'love',
    icon: '💕',
    name: 'ดูดวงความรัก',
    description: 'คุณ • คู่ของคุณ • พลังความสัมพันธ์',
    color: 'from-rose-500 to-pink-600',
    route: '/reading/love',
  },
  {
    id: 'career',
    icon: '💼',
    name: 'ดูดวงการงาน',
    description: 'สถานการณ์ • อุปสรรค • ผลลัพธ์',
    color: 'from-emerald-500 to-teal-600',
    route: '/reading/career',
  },
  {
    id: 'yes-no',
    icon: '🔮',
    name: 'Yes/No Question',
    description: 'คำตอบใช่หรือไม่ รวดเร็ว แม่นยำ',
    color: 'from-violet-500 to-purple-600',
    route: '/reading/yes-no',
  },
];

export function UnlockedSpreadsModal({ isOpen, onClose }: UnlockedSpreadsModalProps) {
  const { track } = useAnalytics();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      track('unlocked_spreads_modal_shown', {});
      
      // Hide confetti after animation
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, track]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Confetti Effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-20px',
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              {['🎉', '✨', '🎊', '⭐', '💫'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <div className="relative bg-gradient-to-br from-purple-900 via-slate-900 to-indigo-900 rounded-3xl border border-purple-500/30 p-8 max-w-lg w-full shadow-2xl shadow-purple-900/50 animate-modal-enter">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-4 animate-bounce">🎉</div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            ยินดีด้วย!
          </h2>
          <p className="text-purple-300">
            คุณปลดล็อค 3 รูปแบบพิเศษแล้ว
          </p>
        </div>

        {/* Unlocked Spreads */}
        <div className="space-y-3 mb-6">
          {UNLOCKED_SPREADS.map((spread, index) => (
            <Link
              key={spread.id}
              href={spread.route}
              onClick={() => {
                track('unlocked_spread_clicked', {
                  spread_id: spread.id,
                  spread_name: spread.name,
                });
                onClose();
              }}
              className="block group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r ${spread.color} bg-opacity-20 border border-white/10 hover:border-white/30 transition-all duration-300 group-hover:scale-[1.02]`}>
                <div className="text-3xl">{spread.icon}</div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold">{spread.name}</h3>
                  <p className="text-white/70 text-sm">{spread.description}</p>
                </div>
                <div className="text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all">
                  →
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Additional Benefits */}
        <div className="bg-slate-900/50 rounded-xl p-4 mb-6">
          <p className="text-purple-300 text-sm font-medium text-center mb-2">
            สิทธิประโยชน์เพิ่มเติม
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <span className="px-3 py-1 bg-purple-500/20 text-purple-200 text-xs rounded-full">
              📊 บันทึกประวัติ
            </span>
            <span className="px-3 py-1 bg-purple-500/20 text-purple-200 text-xs rounded-full">
              🔖 บันทึกไพ่โปรด
            </span>
            <span className="px-3 py-1 bg-purple-500/20 text-purple-200 text-xs rounded-full">
              📈 ดูสถิติ
            </span>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/reading"
            onClick={onClose}
            className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-xl text-center transition-all"
          >
            🃏 เริ่มดูดวงเลย
          </Link>
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-slate-700/50 hover:bg-slate-600/50 text-white font-medium rounded-xl transition-colors"
          >
            ไว้ทีหลัง
          </button>
        </div>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti linear forwards;
          font-size: 1.5rem;
        }
        @keyframes modal-enter {
          0% {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-modal-enter {
          animation: modal-enter 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default UnlockedSpreadsModal;

