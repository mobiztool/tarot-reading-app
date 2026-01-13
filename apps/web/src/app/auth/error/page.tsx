import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'เกิดข้อผิดพลาด - ดูดวงไพ่ยิปซี',
  description: 'เกิดข้อผิดพลาดในการยืนยันตัวตน',
};

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-950/20 to-slate-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center">
        {/* Error Icon */}
        <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-red-500/30 to-orange-500/30 rounded-full flex items-center justify-center">
          <span className="text-5xl">⚠️</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-300 to-amber-300 mb-4">
          เกิดข้อผิดพลาด
        </h1>

        {/* Description */}
        <p className="text-slate-400 mb-8">
          ไม่สามารถยืนยันตัวตนได้ ลิงก์อาจหมดอายุหรือไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง
        </p>

        {/* Actions */}
        <div className="space-y-4">
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium rounded-xl transition-all duration-300"
          >
            🔓 ไปหน้าเข้าสู่ระบบ
          </Link>

          <Link
            href="/auth/signup"
            className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl transition-colors"
          >
            ✨ สร้างบัญชีใหม่
          </Link>

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


