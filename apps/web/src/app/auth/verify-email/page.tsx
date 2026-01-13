import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ยืนยันอีเมล - ดูดวงไพ่ยิปซี',
  description: 'กรุณาตรวจสอบอีเมลของคุณเพื่อยืนยันบัญชี',
};

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-950/20 to-slate-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center">
        {/* Email Icon */}
        <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-purple-500/30 to-indigo-500/30 rounded-full flex items-center justify-center">
          <span className="text-5xl">📧</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-300 to-amber-300 mb-4">
          ตรวจสอบอีเมลของคุณ
        </h1>

        {/* Description */}
        <p className="text-slate-400 mb-8">
          เราได้ส่งลิงก์ยืนยันไปยังอีเมลของคุณแล้ว กรุณาคลิกลิงก์ในอีเมลเพื่อยืนยันบัญชีของคุณ
        </p>

        {/* Instructions Card */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 mb-8 text-left">
          <h2 className="text-lg font-medium text-slate-200 mb-4">ขั้นตอนถัดไป:</h2>
          <ol className="space-y-3 text-slate-400 text-sm">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-purple-500/20 text-purple-300 rounded-full flex items-center justify-center text-xs font-bold">
                1
              </span>
              เปิดอีเมลของคุณ
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-purple-500/20 text-purple-300 rounded-full flex items-center justify-center text-xs font-bold">
                2
              </span>
              ค้นหาอีเมลจาก &quot;ดูดวงไพ่ยิปซี&quot;
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-purple-500/20 text-purple-300 rounded-full flex items-center justify-center text-xs font-bold">
                3
              </span>
              คลิกลิงก์ &quot;ยืนยันอีเมล&quot; ในอีเมล
            </li>
          </ol>
        </div>

        {/* Tips */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-8 text-left">
          <p className="text-amber-300 text-sm">
            💡 <strong>เคล็ดลับ:</strong> หากไม่พบอีเมล ให้ตรวจสอบโฟลเดอร์สแปมหรือจดหมายขยะ
          </p>
        </div>

        {/* Links */}
        <div className="space-y-4">
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium rounded-xl transition-all duration-300"
          >
            🔓 ไปหน้าเข้าสู่ระบบ
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


