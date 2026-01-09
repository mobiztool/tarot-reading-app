import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FAQJsonLd } from '@/components/seo';

const faqs = [
  {
    question: 'ไพ่ยิปซีคืออะไร?',
    answer:
      'ไพ่ยิปซีหรือไพ่ทาโรต์ (Tarot) เป็นเครื่องมือทำนายโบราณที่มีทั้งหมด 78 ใบ ใช้สำหรับค้นหาคำตอบ คำแนะนำ และความเข้าใจในชีวิต',
  },
  {
    question: 'ดูดวงไพ่ยิปซีออนไลน์ฟรีหรือไม่?',
    answer:
      'ใช่ครับ! ดูดวงไพ่ยิปซีบนเว็บไซต์ของเราฟรีทั้งหมด ไม่มีค่าใช้จ่ายแอบแฝง ดูได้ไม่จำกัดครั้ง',
  },
  {
    question: 'การดูดวงประจำวันกับไพ่ 3 ใบต่างกันอย่างไร?',
    answer:
      'การดูดวงประจำวันใช้ไพ่ 1 ใบเพื่อให้แนวทางสำหรับวันนี้ ส่วนไพ่ 3 ใบจะแสดงอดีต-ปัจจุบัน-อนาคต ให้ภาพรวมที่ครบถ้วนกว่า',
  },
  {
    question: 'ไพ่กลับหัวหมายความว่าอย่างไร?',
    answer:
      'ไพ่กลับหัวไม่ได้หมายความว่าร้ายเสมอไป แต่อาจหมายถึงพลังงานที่ถูกกดทับ ความหมายตรงข้าม หรือการชะลอของสิ่งที่จะเกิดขึ้น',
  },
  {
    question: 'ต้องสมัครสมาชิกหรือไม่?',
    answer:
      'ไม่จำเป็นครับ! คุณสามารถดูดวงได้เลยโดยไม่ต้องสมัครสมาชิก แต่ถ้าสมัครจะสามารถบันทึกประวัติการดูดวงได้',
  },
];

export default function Home() {
  return (
    <>
      <Header />

      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-purple-dark/20 via-slate-900 to-slate-900" />

          {/* Decorative Elements */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
          <div className="absolute top-40 right-10 w-72 h-72 bg-gold/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-blue/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />

          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
            <div className="max-w-4xl mx-auto text-center">
              {/* Badge */}
              <div className="inline-flex items-center px-4 py-2 mb-8 bg-purple-dark/30 backdrop-blur-sm rounded-full border border-purple/30">
                <span className="text-purple-light text-sm font-medium">
                  ✨ อ่านไพ่ยิปซีออนไลน์ฟรี
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold mb-6 leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-light via-gold-light to-purple">
                  ค้นพบคำตอบ
                </span>
                <br />
                <span className="text-white">ด้วยไพ่ยิปซี</span>
              </h1>

              {/* Description */}
              <p className="text-lg sm:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                เปิดเผยความลับของจักรวาล ค้นหาคำตอบและแนวทางชีวิตผ่านไพ่ทาโรต์ 78
                ใบที่จะนำทางคุณสู่อนาคตที่สดใส
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href="/reading"
                  className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-purple to-purple-dark hover:from-purple-dark hover:to-purple rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple/50"
                >
                  <span className="mr-2">🔮</span>
                  เริ่มดูดวงเลย
                  <svg
                    className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </Link>

                <Link
                  href="/history"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-purple-light border-2 border-purple/50 hover:border-purple hover:bg-purple/10 rounded-full transition-all duration-300"
                >
                  <span className="mr-2">📜</span>
                  ประวัติการดู
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-16 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-light to-gold">
                    78
                  </div>
                  <div className="text-sm text-slate-400 mt-1">ใบไพ่</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-light to-gold">
                    100%
                  </div>
                  <div className="text-sm text-slate-400 mt-1">ฟรี</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-light to-gold">
                    24/7
                  </div>
                  <div className="text-sm text-slate-400 mt-1">พร้อมใช้งาน</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Spreads Available Section */}
        <section className="py-20 bg-gradient-to-b from-slate-900 to-purple-950/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-4 py-2 mb-4 bg-purple-600/20 backdrop-blur-sm rounded-full border border-purple-500/30">
                <span className="text-purple-300 text-sm font-medium">
                  🎴 5 รูปแบบให้เลือก
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-4">
                รูปแบบการดูดวง
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto">
                เลือกรูปแบบที่เหมาะกับคำถามของคุณ สมัครสมาชิกฟรีปลดล็อคเพิ่มอีก 3 รูปแบบ!
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
              {/* Daily - Unlocked */}
              <Link
                href="/reading/daily"
                className="group relative p-6 bg-gradient-to-br from-amber-900/30 to-slate-900/60 border border-amber-500/30 rounded-2xl hover:border-amber-400/60 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/20 hover:-translate-y-1"
              >
                <div className="text-center">
                  <div className="text-4xl mb-3">☀️</div>
                  <h3 className="text-lg font-semibold text-amber-300 mb-1">ดูดวงประจำวัน</h3>
                  <p className="text-slate-500 text-xs mb-2">1 ใบ • ~1 นาที</p>
                  <span className="inline-flex items-center gap-1 text-xs text-green-400">
                    ✓ ฟรี
                  </span>
                </div>
              </Link>

              {/* 3-Card - Unlocked */}
              <Link
                href="/reading/three-card"
                className="group relative p-6 bg-gradient-to-br from-indigo-900/30 to-slate-900/60 border border-indigo-500/30 rounded-2xl hover:border-indigo-400/60 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-1"
              >
                <div className="text-center">
                  <div className="text-4xl mb-3">🌙</div>
                  <h3 className="text-lg font-semibold text-indigo-300 mb-1">ไพ่ 3 ใบ</h3>
                  <p className="text-slate-500 text-xs mb-2">3 ใบ • ~3 นาที</p>
                  <span className="inline-flex items-center gap-1 text-xs text-green-400">
                    ✓ ฟรี
                  </span>
                </div>
              </Link>

              {/* Love - Locked */}
              <Link
                href="/reading/love"
                className="group relative p-6 bg-gradient-to-br from-rose-900/20 to-slate-900/60 border border-rose-500/20 rounded-2xl hover:border-rose-400/40 transition-all duration-300 hover:shadow-lg hover:shadow-rose-500/10"
              >
                <div className="absolute top-3 right-3">
                  <span className="text-lg">🔐</span>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-3 opacity-70">💕</div>
                  <h3 className="text-lg font-semibold text-rose-300/80 mb-1">ดูดวงความรัก</h3>
                  <p className="text-slate-500 text-xs mb-2">3 ใบ • ~3 นาที</p>
                  <span className="inline-flex items-center gap-1 text-xs text-purple-400">
                    สมัครสมาชิก
                  </span>
                </div>
              </Link>

              {/* Career - Locked */}
              <Link
                href="/reading/career"
                className="group relative p-6 bg-gradient-to-br from-emerald-900/20 to-slate-900/60 border border-emerald-500/20 rounded-2xl hover:border-emerald-400/40 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10"
              >
                <div className="absolute top-3 right-3">
                  <span className="text-lg">🔐</span>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-3 opacity-70">💼</div>
                  <h3 className="text-lg font-semibold text-emerald-300/80 mb-1">ดูดวงการงาน</h3>
                  <p className="text-slate-500 text-xs mb-2">3 ใบ • ~3 นาที</p>
                  <span className="inline-flex items-center gap-1 text-xs text-purple-400">
                    สมัครสมาชิก
                  </span>
                </div>
              </Link>

              {/* Yes/No - Locked */}
              <Link
                href="/reading/yes-no"
                className="group relative p-6 bg-gradient-to-br from-violet-900/20 to-slate-900/60 border border-violet-500/20 rounded-2xl hover:border-violet-400/40 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/10"
              >
                <div className="absolute top-3 right-3">
                  <span className="text-lg">🔐</span>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-3 opacity-70">🔮</div>
                  <h3 className="text-lg font-semibold text-violet-300/80 mb-1">Yes/No</h3>
                  <p className="text-slate-500 text-xs mb-2">1 ใบ • <30 วิ</p>
                  <span className="inline-flex items-center gap-1 text-xs text-purple-400">
                    สมัครสมาชิก
                  </span>
                </div>
              </Link>
            </div>

            {/* Signup CTA */}
            <div className="text-center mt-10">
              <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-2xl border border-purple-500/30">
                <div className="text-left">
                  <p className="text-purple-200 font-semibold mb-1">
                    ✨ ปลดล็อค 3 รูปแบบพิเศษ
                  </p>
                  <p className="text-purple-300/70 text-sm">
                    สมัครสมาชิกฟรี ไม่มีค่าใช้จ่าย!
                  </p>
                </div>
                <Link
                  href="/auth/signup"
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-full transition-all duration-300 hover:scale-105 whitespace-nowrap"
                >
                  🎉 สมัครฟรี
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-slate-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-4">
                ทำไมต้องเลือกเรา?
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto">
                เครื่องมือดูดวงไพ่ยิปซีที่ทันสมัย ง่ายต่อการใช้งาน และแม่นยำ
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Feature 1 */}
              <div className="group relative p-8 bg-gradient-to-br from-slate-800/50 to-slate-800/30 backdrop-blur-sm rounded-2xl border border-purple/20 hover:border-purple/50 transition-all duration-300 hover:transform hover:scale-105">
                <div className="text-4xl mb-4">🎴</div>
                <h3 className="text-xl font-semibold text-white mb-3">ไพ่ครบ 78 ใบ</h3>
                <p className="text-slate-400 leading-relaxed">
                  Major Arcana และ Minor Arcana ครบทั้ง 4 ชุด พร้อมคำอธิบายที่ละเอียดในแต่ละใบ
                </p>
              </div>

              {/* Feature 2 */}
              <div className="group relative p-8 bg-gradient-to-br from-slate-800/50 to-slate-800/30 backdrop-blur-sm rounded-2xl border border-purple/20 hover:border-purple/50 transition-all duration-300 hover:transform hover:scale-105">
                <div className="text-4xl mb-4">✨</div>
                <h3 className="text-xl font-semibold text-white mb-3">ฟรีไม่มีค่าใช้จ่าย</h3>
                <p className="text-slate-400 leading-relaxed">
                  ดูดวงได้ไม่จำกัดครั้ง ไม่ต้องสมัครสมาชิก ไม่มีค่าธรรมเนียมแอบแฝง
                </p>
              </div>

              {/* Feature 3 */}
              <div className="group relative p-8 bg-gradient-to-br from-slate-800/50 to-slate-800/30 backdrop-blur-sm rounded-2xl border border-purple/20 hover:border-purple/50 transition-all duration-300 hover:transform hover:scale-105">
                <div className="text-4xl mb-4">🔒</div>
                <h3 className="text-xl font-semibold text-white mb-3">ปลอดภัยและเป็นส่วนตัว</h3>
                <p className="text-slate-400 leading-relaxed">
                  ข้อมูลของคุณปลอดภัย เราไม่เก็บข้อมูลส่วนตัว ดูดวงได้อย่างสบายใจ
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-gradient-to-b from-slate-900 to-purple-950/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-4">
                วิธีใช้งานง่ายๆ 3 ขั้นตอน
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto">เริ่มดูดวงได้ทันที ไม่ต้องดาวน์โหลด</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {/* Step 1 */}
              <div className="relative text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-3xl">
                  1️⃣
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">เลือกรูปแบบการดู</h3>
                <p className="text-slate-400">เลือกดูดวงประจำวัน (1 ใบ) หรือไพ่ 3 ใบ</p>
                {/* Connector line */}
                <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-purple-500 to-transparent -translate-x-10"></div>
              </div>

              {/* Step 2 */}
              <div className="relative text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-3xl">
                  2️⃣
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">สับและจั่วไพ่</h3>
                <p className="text-slate-400">กดสับไพ่ แล้วเลือกไพ่ที่ใจเรียก</p>
                {/* Connector line */}
                <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-purple-500 to-transparent -translate-x-10"></div>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-3xl">
                  3️⃣
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">อ่านความหมาย</h3>
                <p className="text-slate-400">เปิดไพ่และอ่านคำทำนายพร้อมคำแนะนำ</p>
              </div>
            </div>

            <div className="text-center mt-12">
              <Link
                href="/reading"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-full transition-all duration-300 hover:scale-105"
              >
                🔮 ลองเลยตอนนี้
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <FAQJsonLd faqs={faqs} />
        <section className="py-20 bg-slate-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-4">
                คำถามที่พบบ่อย
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto">
                มีคำถาม? เราช่วยตอบได้
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq, index) => (
                <details
                  key={index}
                  className="group bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden"
                >
                  <summary className="flex items-center justify-between p-6 cursor-pointer list-none hover:bg-slate-700/30 transition-colors">
                    <h3 className="text-lg font-medium text-white pr-4">{faq.question}</h3>
                    <span className="text-purple-400 group-open:rotate-180 transition-transform">
                      ▼
                    </span>
                  </summary>
                  <div className="px-6 pb-6">
                    <p className="text-slate-400 leading-relaxed">{faq.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Signals Section */}
        <section className="py-12 bg-slate-800/30 border-y border-slate-700/50">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 text-slate-400">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🔒</span>
                <span>ข้อมูลปลอดภัย</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">✅</span>
                <span>PDPA Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎴</span>
                <span>78 ใบครบชุด</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">💯</span>
                <span>ฟรี 100%</span>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-purple-dark via-purple to-purple-dark relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/patterns/mystical.svg')] bg-repeat" />
          </div>

          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white mb-6">
              พร้อมที่จะเริ่มต้นแล้วหรือยัง?
            </h2>
            <p className="text-xl text-purple-light mb-10 max-w-2xl mx-auto">
              เปิดใจรับคำแนะนำจากไพ่ยิปซี ค้นหาคำตอบที่คุณกำลังมองหา
            </p>
            <Link
              href="/reading"
              className="inline-flex items-center justify-center px-10 py-5 text-xl font-bold text-purple-dark bg-white hover:bg-gold-light rounded-full transition-all duration-300 transform hover:scale-105 shadow-2xl"
            >
              <span className="mr-3">🔮</span>
              เริ่มดูดวงตอนนี้
              <svg className="ml-3 w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
