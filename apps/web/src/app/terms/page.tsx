import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ข้อกำหนดการใช้งาน - ดูดวงไพ่ยิปซี',
  description: 'ข้อกำหนดและเงื่อนไขการใช้งานเว็บไซต์ดูดวงไพ่ยิปซี',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-950/20 to-slate-900 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-block mb-6">
            <span className="text-4xl">🔮</span>
          </Link>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-300 to-amber-300">
            ข้อกำหนดการใช้งาน
          </h1>
          <p className="text-slate-400 mt-2">อัปเดตล่าสุด: มกราคม 2026</p>
        </div>

        {/* Content */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 shadow-xl">
          <div className="prose prose-invert prose-purple max-w-none">
            <h2 className="text-xl font-semibold text-slate-200 mb-4">1. การยอมรับข้อกำหนด</h2>
            <p className="text-slate-400 mb-6">
              โดยการใช้งานเว็บไซต์ดูดวงไพ่ยิปซี คุณตกลงที่จะปฏิบัติตามข้อกำหนดและเงื่อนไขเหล่านี้
              หากคุณไม่เห็นด้วยกับข้อกำหนดใดๆ กรุณาหยุดใช้งานเว็บไซต์
            </p>

            <h2 className="text-xl font-semibold text-slate-200 mb-4">2. ลักษณะของบริการ</h2>
            <p className="text-slate-400 mb-6">
              บริการดูดวงไพ่ยิปซีนี้มีวัตถุประสงค์เพื่อความบันเทิงเท่านั้น
              ผลการดูดวงไม่ควรนำมาใช้เป็นพื้นฐานในการตัดสินใจที่สำคัญในชีวิต
              เช่น การเงิน สุขภาพ หรือกฎหมาย
            </p>

            <h2 className="text-xl font-semibold text-slate-200 mb-4">3. บัญชีผู้ใช้</h2>
            <p className="text-slate-400 mb-6">
              คุณมีหน้าที่รักษาความลับของรหัสผ่านและข้อมูลบัญชีของคุณ
              คุณต้องรับผิดชอบต่อกิจกรรมทั้งหมดที่เกิดขึ้นภายใต้บัญชีของคุณ
            </p>

            <h2 className="text-xl font-semibold text-slate-200 mb-4">4. ทรัพย์สินทางปัญญา</h2>
            <p className="text-slate-400 mb-6">
              เนื้อหาทั้งหมดบนเว็บไซต์นี้ รวมถึงรูปภาพ ข้อความ และการออกแบบ
              เป็นทรัพย์สินของเราและได้รับการคุ้มครองโดยกฎหมายลิขสิทธิ์
            </p>

            <h2 className="text-xl font-semibold text-slate-200 mb-4">5. ข้อจำกัดความรับผิดชอบ</h2>
            <p className="text-slate-400 mb-6">
              เราไม่รับประกันความถูกต้องหรือความเหมาะสมของผลการดูดวง
              การใช้บริการนี้เป็นความเสี่ยงของคุณเอง
            </p>

            <h2 className="text-xl font-semibold text-slate-200 mb-4">6. การเปลี่ยนแปลงข้อกำหนด</h2>
            <p className="text-slate-400 mb-6">
              เราขอสงวนสิทธิ์ในการเปลี่ยนแปลงข้อกำหนดเหล่านี้ได้ตลอดเวลา
              การใช้งานต่อหลังจากการเปลี่ยนแปลงถือว่าคุณยอมรับข้อกำหนดใหม่
            </p>

            <h2 className="text-xl font-semibold text-slate-200 mb-4">7. ติดต่อเรา</h2>
            <p className="text-slate-400">
              หากคุณมีคำถามเกี่ยวกับข้อกำหนดเหล่านี้ สามารถติดต่อเราได้ทางอีเมล
            </p>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-slate-500 hover:text-slate-300 transition-colors inline-flex items-center gap-2"
          >
            <span>←</span>
            กลับหน้าแรก
          </Link>
        </div>
      </div>
    </div>
  );
}
