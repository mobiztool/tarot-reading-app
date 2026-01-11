/**
 * Subscription Failed Page
 * Shows error message when payment fails
 */

'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { XCircle, RefreshCw, HelpCircle, ArrowLeft, Copy } from 'lucide-react';

const ERROR_MESSAGES: Record<string, { title: string; description: string }> = {
  card_declined: {
    title: 'บัตรถูกปฏิเสธ',
    description: 'กรุณาลองใช้บัตรใบอื่น หรือติดต่อธนาคารของคุณ',
  },
  insufficient_funds: {
    title: 'ยอดเงินไม่เพียงพอ',
    description: 'กรุณาตรวจสอบวงเงินในบัตรและลองใหม่อีกครั้ง',
  },
  expired_card: {
    title: 'บัตรหมดอายุ',
    description: 'กรุณาใช้บัตรที่ยังไม่หมดอายุ',
  },
  processing_error: {
    title: 'เกิดข้อผิดพลาด',
    description: 'ระบบไม่สามารถประมวลผลได้ กรุณาลองใหม่อีกครั้ง',
  },
  default: {
    title: 'การชำระเงินไม่สำเร็จ',
    description: 'เกิดข้อผิดพลาดในการชำระเงิน กรุณาลองใหม่อีกครั้ง',
  },
};

// Reference ID Component for Support
function ReferenceId({ sessionId }: { sessionId: string | null }) {
  if (!sessionId) return null;
  
  const shortId = sessionId.length > 20 ? `${sessionId.slice(0, 8)}...${sessionId.slice(-8)}` : sessionId;
  
  return (
    <div className="mb-6 bg-red-900/30 rounded-lg p-3 border border-red-500/30">
      <p className="text-xs text-red-300 mb-1">รหัสอ้างอิง (แจ้งเมื่อติดต่อซัพพอร์ต)</p>
      <div className="flex items-center justify-center gap-2">
        <code className="text-sm text-red-200 font-mono">{shortId}</code>
        <button
          onClick={() => navigator.clipboard.writeText(sessionId)}
          className="p-1 hover:bg-white/10 rounded transition-colors"
          title="คัดลอก"
        >
          <Copy className="w-4 h-4 text-red-400" />
        </button>
      </div>
    </div>
  );
}

function FailedContent() {
  const searchParams = useSearchParams();
  const errorCode = searchParams.get('error');
  const sessionId = searchParams.get('session_id');
  
  const error = ERROR_MESSAGES[errorCode || 'default'] || ERROR_MESSAGES.default;

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-900 to-indigo-950 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* Error Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-red-400/20 rounded-full blur-xl animate-pulse" />
            <div className="relative w-24 h-24 bg-gradient-to-br from-red-400 to-rose-500 rounded-full flex items-center justify-center shadow-lg shadow-red-500/30">
              <XCircle className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          {error.title}
        </h1>
        
        <p className="text-xl text-purple-200 mb-8">
          {error.description}
        </p>

        {/* Reference ID */}
        <ReferenceId sessionId={sessionId} />

        {/* Help Box */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-purple-500/30">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center justify-center gap-2">
            <HelpCircle className="w-5 h-5 text-purple-400" />
            สิ่งที่คุณสามารถทำได้:
          </h2>
          <ul className="space-y-3 text-left">
            <li className="flex items-start gap-3 text-purple-200">
              <span className="text-purple-400 mt-1">1.</span>
              <span>ตรวจสอบข้อมูลบัตรว่าถูกต้อง</span>
            </li>
            <li className="flex items-start gap-3 text-purple-200">
              <span className="text-purple-400 mt-1">2.</span>
              <span>ลองใช้บัตรเครดิต/เดบิตใบอื่น</span>
            </li>
            <li className="flex items-start gap-3 text-purple-200">
              <span className="text-purple-400 mt-1">3.</span>
              <span>ติดต่อธนาคารหากบัตรถูกปฏิเสธ</span>
            </li>
            <li className="flex items-start gap-3 text-purple-200">
              <span className="text-purple-400 mt-1">4.</span>
              <span>ติดต่อทีมซัพพอร์ตของเราหากยังมีปัญหา</span>
            </li>
          </ul>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-4">
          <Link
            href="/pricing"
            className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-4 px-8 rounded-xl font-bold text-lg hover:from-purple-600 hover:to-indigo-700 transition-all shadow-lg shadow-purple-500/30 hover:scale-105"
          >
            <RefreshCw className="w-5 h-5" />
            ลองใหม่อีกครั้ง
          </Link>
          
          <Link
            href="/"
            className="w-full inline-flex items-center justify-center gap-2 text-purple-300 hover:text-white transition-colors py-2"
          >
            <ArrowLeft className="w-4 h-4" />
            กลับหน้าหลัก
          </Link>
        </div>

        {/* Support Contact */}
        <div className="mt-8 p-4 bg-purple-900/50 rounded-xl border border-purple-500/30">
          <p className="text-purple-200 text-sm">
            ต้องการความช่วยเหลือ? ติดต่อ{' '}
            <a 
              href="mailto:support@tarot.app" 
              className="text-purple-400 hover:text-white underline"
            >
              support@tarot.app
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SubscriptionFailedPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-900 to-indigo-950 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      }
    >
      <FailedContent />
    </Suspense>
  );
}
