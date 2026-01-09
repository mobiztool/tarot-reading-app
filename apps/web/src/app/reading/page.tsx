import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'เลือกรูปแบบการดูดวง - ดูดวงไพ่ยิปซี',
  description:
    'เลือกรูปแบบการดูดวงไพ่ยิปซี: ดูดวงประจำวัน ไพ่ 3 ใบ หรือดูดวงความรัก',
};

export default function ReadingSelectionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-950/20 to-slate-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-300 to-amber-300 mb-4">
            เลือกรูปแบบการดูดวง
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            เลือกรูปแบบที่เหมาะกับคำถามของคุณ แล้วปล่อยให้ไพ่ยิปซีเผยคำตอบ
          </p>
        </div>

        {/* Reading Type Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {/* Daily Reading */}
          <Link
            href="/reading/daily"
            className="group relative bg-gradient-to-br from-purple-900/40 to-slate-900/60 border border-purple-500/30 rounded-2xl p-8 hover:border-purple-400/60 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20 hover:-translate-y-1"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative">
              {/* Icon */}
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30">
                <span className="text-4xl">☀️</span>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-amber-300 mb-3 text-center">ดูดวงประจำวัน</h2>
              <p className="text-purple-200 font-medium text-center mb-4">Daily Reading</p>

              {/* Description */}
              <p className="text-slate-400 text-center mb-6">
                จั่วไพ่ 1 ใบเพื่อรับคำแนะนำสำหรับวันนี้
                เหมาะสำหรับการเริ่มต้นวันใหม่หรือต้องการแรงบันดาลใจ
              </p>

              {/* Details */}
              <div className="flex justify-center gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <span>🃏</span> 1 ใบ
                </span>
                <span className="flex items-center gap-1">
                  <span>⏱️</span> ~1 นาที
                </span>
              </div>

              {/* CTA */}
              <div className="mt-6 text-center">
                <span className="inline-flex items-center text-purple-300 group-hover:text-purple-200 transition-colors">
                  เริ่มดูดวง
                  <svg
                    className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </Link>

          {/* 3-Card Spread */}
          <Link
            href="/reading/three-card"
            className="group relative bg-gradient-to-br from-indigo-900/40 to-slate-900/60 border border-indigo-500/30 rounded-2xl p-8 hover:border-indigo-400/60 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/20 hover:-translate-y-1"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative">
              {/* Icon */}
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <span className="text-4xl">🌙</span>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-indigo-300 mb-3 text-center">ไพ่ 3 ใบ</h2>
              <p className="text-indigo-200 font-medium text-center mb-4">3-Card Spread</p>

              {/* Description */}
              <p className="text-slate-400 text-center mb-6">
                อดีต • ปัจจุบัน • อนาคต
                เหมาะสำหรับเข้าใจสถานการณ์อย่างลึกซึ้งและมองเห็นทิศทางข้างหน้า
              </p>

              {/* Details */}
              <div className="flex justify-center gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <span>🃏</span> 3 ใบ
                </span>
                <span className="flex items-center gap-1">
                  <span>⏱️</span> ~3 นาที
                </span>
              </div>

              {/* CTA */}
              <div className="mt-6 text-center">
                <span className="inline-flex items-center text-indigo-300 group-hover:text-indigo-200 transition-colors">
                  เริ่มดูดวง
                  <svg
                    className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </Link>

          {/* Love Spread */}
          <Link
            href="/reading/love"
            className="group relative bg-gradient-to-br from-rose-900/40 to-slate-900/60 border border-rose-500/30 rounded-2xl p-8 hover:border-rose-400/60 transition-all duration-300 hover:shadow-xl hover:shadow-rose-500/20 hover:-translate-y-1"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* Login required badge */}
            <div className="absolute top-4 right-4 bg-rose-500/20 text-rose-300 text-xs px-2 py-1 rounded-full border border-rose-500/30">
              🔐 ต้องเข้าสู่ระบบ
            </div>

            <div className="relative">
              {/* Icon */}
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-pink-400 to-rose-600 rounded-full flex items-center justify-center shadow-lg shadow-rose-500/30">
                <span className="text-4xl">💕</span>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-rose-300 mb-3 text-center">ดูดวงความรัก</h2>
              <p className="text-rose-200 font-medium text-center mb-4">Love & Relationships</p>

              {/* Description */}
              <p className="text-slate-400 text-center mb-6">
                คุณ • คู่ของคุณ • พลังความสัมพันธ์
                เหมาะสำหรับเข้าใจความรักและความสัมพันธ์ของคุณ
              </p>

              {/* Details */}
              <div className="flex justify-center gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <span>🃏</span> 3 ใบ
                </span>
                <span className="flex items-center gap-1">
                  <span>⏱️</span> ~3 นาที
                </span>
              </div>

              {/* CTA */}
              <div className="mt-6 text-center">
                <span className="inline-flex items-center text-rose-300 group-hover:text-rose-200 transition-colors">
                  เริ่มดูดวง
                  <svg
                    className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </Link>

          {/* Career Spread */}
          <Link
            href="/reading/career"
            className="group relative bg-gradient-to-br from-emerald-900/40 to-slate-900/60 border border-emerald-500/30 rounded-2xl p-8 hover:border-emerald-400/60 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/20 hover:-translate-y-1"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* Login required badge */}
            <div className="absolute top-4 right-4 bg-emerald-500/20 text-emerald-300 text-xs px-2 py-1 rounded-full border border-emerald-500/30">
              🔐 ต้องเข้าสู่ระบบ
            </div>

            <div className="relative">
              {/* Icon */}
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <span className="text-4xl">💼</span>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-emerald-300 mb-3 text-center">ดูดวงการงาน</h2>
              <p className="text-emerald-200 font-medium text-center mb-4">Career & Money</p>

              {/* Description */}
              <p className="text-slate-400 text-center mb-6">
                สถานการณ์ • อุปสรรค • ผลลัพธ์
                เหมาะสำหรับตัดสินใจเรื่องการงานและการเงิน
              </p>

              {/* Details */}
              <div className="flex justify-center gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <span>🃏</span> 3 ใบ
                </span>
                <span className="flex items-center gap-1">
                  <span>⏱️</span> ~3 นาที
                </span>
              </div>

              {/* CTA */}
              <div className="mt-6 text-center">
                <span className="inline-flex items-center text-emerald-300 group-hover:text-emerald-200 transition-colors">
                  เริ่มดูดวง
                  <svg
                    className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </Link>

          {/* Yes/No Spread */}
          <Link
            href="/reading/yes-no"
            className="group relative bg-gradient-to-br from-violet-900/40 to-slate-900/60 border border-violet-500/30 rounded-2xl p-8 hover:border-violet-400/60 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/20 hover:-translate-y-1"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* Login required badge */}
            <div className="absolute top-4 right-4 bg-violet-500/20 text-violet-300 text-xs px-2 py-1 rounded-full border border-violet-500/30">
              🔐 ต้องเข้าสู่ระบบ
            </div>

            <div className="relative">
              {/* Icon */}
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-violet-400 to-pink-600 rounded-full flex items-center justify-center shadow-lg shadow-violet-500/30">
                <span className="text-4xl">🔮</span>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-violet-300 mb-3 text-center">Yes/No Question</h2>
              <p className="text-violet-200 font-medium text-center mb-4">คำถามใช่หรือไม่</p>

              {/* Description */}
              <p className="text-slate-400 text-center mb-6">
                ถามคำถามที่ต้องการคำตอบ ใช่ หรือ ไม่
                รับคำตอบชัดเจนพร้อมระดับความมั่นใจ
              </p>

              {/* Details */}
              <div className="flex justify-center gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <span>🃏</span> 1 ใบ
                </span>
                <span className="flex items-center gap-1">
                  <span>⏱️</span> &lt;30 วิ
                </span>
              </div>

              {/* CTA */}
              <div className="mt-6 text-center">
                <span className="inline-flex items-center text-violet-300 group-hover:text-violet-200 transition-colors">
                  เริ่มดูดวง
                  <svg
                    className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Back link */}
        <div className="text-center mt-12">
          <Link
            href="/"
            className="text-slate-500 hover:text-slate-300 transition-colors inline-flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            กลับหน้าแรก
          </Link>
        </div>
      </div>
    </div>
  );
}
