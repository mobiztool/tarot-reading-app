/**
 * Subscription Success Page
 * Shows confirmation after successful payment with celebration
 */

'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Sparkles, ArrowRight, Copy } from 'lucide-react';

// CSS Confetti Animation Component
function Confetti() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      <style jsx>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .confetti {
          position: absolute;
          top: -10px;
          animation: confetti-fall 3s ease-out forwards;
        }
      `}</style>
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="confetti"
          style={{
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 10 + 5}px`,
            height: `${Math.random() * 10 + 5}px`,
            backgroundColor: ['#a855f7', '#6366f1', '#22c55e', '#eab308', '#ec4899', '#06b6d4'][Math.floor(Math.random() * 6)],
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${Math.random() * 2 + 2}s`,
            borderRadius: Math.random() > 0.5 ? '50%' : '0',
          }}
        />
      ))}
    </div>
  );
}

// Transaction ID Copy Component
function TransactionId({ sessionId }: { sessionId: string }) {
  const shortId = sessionId.length > 20 ? `${sessionId.slice(0, 8)}...${sessionId.slice(-8)}` : sessionId;
  
  return (
    <div className="bg-purple-900/50 rounded-lg p-3 border border-purple-500/30">
      <p className="text-xs text-purple-300 mb-1">รหัสธุรกรรม (สำหรับติดต่อฝ่ายสนับสนุน)</p>
      <div className="flex items-center justify-center gap-2">
        <code className="text-sm text-purple-200 font-mono">{shortId}</code>
        <button
          onClick={() => navigator.clipboard.writeText(sessionId)}
          className="p-1 hover:bg-white/10 rounded transition-colors"
          title="คัดลอก"
        >
          <Copy className="w-4 h-4 text-purple-400" />
        </button>
      </div>
    </div>
  );
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  
  // If no session ID, show redirect message
  if (!sessionId) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-900 to-indigo-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-purple-200 mb-4">กำลังพาไปหน้าราคา...</p>
          <a href="/pricing" className="text-purple-400 hover:text-white">คลิกที่นี่ถ้าไม่ redirect อัตโนมัติ</a>
        </div>
        <script dangerouslySetInnerHTML={{ __html: `window.location.href = '/pricing';` }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-900 to-indigo-950 flex items-center justify-center px-4 relative">
      {/* Confetti Animation */}
      <Confetti />
      
      <div className="max-w-lg w-full text-center relative z-10">
        {/* Success Icon with Glow */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-green-400/30 rounded-full blur-xl animate-pulse" />
            <div className="relative w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 animate-bounce">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -top-2 -right-2">
              <Sparkles className="w-8 h-8 text-yellow-400 animate-spin" style={{ animationDuration: '3s' }} />
            </div>
            <div className="absolute -bottom-1 -left-2">
              <Sparkles className="w-6 h-6 text-pink-400 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          🎉 ยินดีต้อนรับสู่ Premium!
        </h1>
        
        <p className="text-xl text-purple-200 mb-8">
          การชำระเงินสำเร็จแล้ว คุณสามารถเข้าถึงฟีเจอร์พรีเมียมได้ทันที
        </p>

        {/* Benefits */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-purple-500/30">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            สิ่งที่คุณได้รับ:
          </h2>
          <ul className="space-y-3 text-left">
            <li className="flex items-center gap-3 text-purple-200">
              <span className="text-green-400 flex-shrink-0">✓</span>
              <span>เข้าถึงการ์ดไพ่ทาโรต์ทุกรูปแบบ</span>
            </li>
            <li className="flex items-center gap-3 text-purple-200">
              <span className="text-green-400 flex-shrink-0">✓</span>
              <span>ดูดวงไม่จำกัดจำนวนครั้ง</span>
            </li>
            <li className="flex items-center gap-3 text-purple-200">
              <span className="text-green-400 flex-shrink-0">✓</span>
              <span>บันทึกประวัติการดูดวงทั้งหมด</span>
            </li>
            <li className="flex items-center gap-3 text-purple-200">
              <span className="text-green-400 flex-shrink-0">✓</span>
              <span>ไม่มีโฆษณารบกวน</span>
            </li>
          </ul>
        </div>

        {/* Transaction ID */}
        <div className="mb-6">
          <TransactionId sessionId={sessionId} />
        </div>

        {/* CTA Buttons */}
        <div className="space-y-4">
          <Link
            href="/reading"
            className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-4 px-8 rounded-xl font-bold text-lg hover:from-purple-600 hover:to-indigo-700 transition-all shadow-lg shadow-purple-500/30 hover:scale-105"
          >
            เริ่มดูดวงเลย
            <ArrowRight className="w-5 h-5" />
          </Link>
          
          <Link
            href="/profile/billing"
            className="w-full inline-block text-purple-300 hover:text-white transition-colors py-2"
          >
            จัดการการสมัครสมาชิก →
          </Link>
        </div>

        {/* Confirmation Note */}
        <p className="text-sm text-purple-400 mt-8">
          📧 เราได้ส่งอีเมลยืนยันไปยังอีเมลของคุณแล้ว
        </p>
      </div>
    </div>
  );
}

export default function SubscriptionSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-900 to-indigo-950 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
