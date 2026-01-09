import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'นโยบายความเป็นส่วนตัว - ดูดวงไพ่ยิปซี',
  description: 'นโยบายความเป็นส่วนตัวและการคุ้มครองข้อมูลส่วนบุคคล (PDPA)',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-950/20 to-slate-900 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-block mb-6">
            <span className="text-4xl">🔮</span>
          </Link>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-300 to-amber-300">
            นโยบายความเป็นส่วนตัว
          </h1>
          <p className="text-slate-400 mt-2">อัปเดตล่าสุด: มกราคม 2026</p>
        </div>

        {/* PDPA Badge */}
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-8 text-center">
          <p className="text-green-300 text-sm">
            ✅ เว็บไซต์นี้ปฏิบัติตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA)
          </p>
        </div>

        {/* Content */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 shadow-xl">
          <div className="prose prose-invert prose-purple max-w-none">
            <h2 className="text-xl font-semibold text-slate-200 mb-4">1. ข้อมูลที่เราเก็บรวบรวม</h2>
            <p className="text-slate-400 mb-4">เราอาจเก็บรวบรวมข้อมูลดังต่อไปนี้:</p>
            <ul className="list-disc list-inside text-slate-400 mb-6 space-y-1">
              <li>อีเมลและข้อมูลบัญชี (เมื่อลงทะเบียน)</li>
              <li>ประวัติการดูดวงและผลการดูดวง</li>
              <li>ข้อมูลการใช้งานเว็บไซต์ (ผ่าน cookies และ analytics)</li>
              <li>ข้อมูลอุปกรณ์และเบราว์เซอร์</li>
            </ul>

            <h2 className="text-xl font-semibold text-slate-200 mb-4">2. วัตถุประสงค์ในการใช้ข้อมูล</h2>
            <p className="text-slate-400 mb-4">เราใช้ข้อมูลของคุณเพื่อ:</p>
            <ul className="list-disc list-inside text-slate-400 mb-6 space-y-1">
              <li>ให้บริการดูดวงและจัดเก็บประวัติการดูดวง</li>
              <li>ปรับปรุงและพัฒนาบริการ</li>
              <li>วิเคราะห์การใช้งานเว็บไซต์</li>
              <li>ติดต่อสื่อสารกับคุณ (หากจำเป็น)</li>
            </ul>

            <h2 className="text-xl font-semibold text-slate-200 mb-4">3. การแบ่งปันข้อมูล</h2>
            <p className="text-slate-400 mb-6">
              เราจะไม่ขายหรือแบ่งปันข้อมูลส่วนบุคคลของคุณกับบุคคลภายนอก
              ยกเว้นในกรณีที่กฎหมายกำหนด หรือเพื่อให้บริการของเรา (เช่น ผู้ให้บริการคลาวด์)
            </p>

            <h2 className="text-xl font-semibold text-slate-200 mb-4">4. คุกกี้ (Cookies)</h2>
            <p className="text-slate-400 mb-6">
              เราใช้คุกกี้เพื่อจดจำการตั้งค่าของคุณและวิเคราะห์การใช้งานเว็บไซต์
              คุณสามารถปิดการใช้งานคุกกี้ได้ผ่านการตั้งค่าเบราว์เซอร์
            </p>

            <h2 className="text-xl font-semibold text-slate-200 mb-4">5. สิทธิของเจ้าของข้อมูล (PDPA)</h2>
            <p className="text-slate-400 mb-4">ภายใต้ พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล คุณมีสิทธิ:</p>
            <ul className="list-disc list-inside text-slate-400 mb-6 space-y-1">
              <li>เข้าถึงข้อมูลส่วนบุคคลของคุณ</li>
              <li>แก้ไขข้อมูลให้ถูกต้อง</li>
              <li>ลบข้อมูลส่วนบุคคล</li>
              <li>ระงับการใช้ข้อมูล</li>
              <li>ถอนความยินยอม</li>
              <li>โอนย้ายข้อมูล</li>
              <li>ร้องเรียนต่อหน่วยงานที่เกี่ยวข้อง</li>
            </ul>

            <h2 className="text-xl font-semibold text-slate-200 mb-4">6. ความปลอดภัยของข้อมูล</h2>
            <p className="text-slate-400 mb-6">
              เราใช้มาตรการรักษาความปลอดภัยที่เหมาะสมเพื่อปกป้องข้อมูลของคุณ
              รวมถึงการเข้ารหัสและการควบคุมการเข้าถึง
            </p>

            <h2 className="text-xl font-semibold text-slate-200 mb-4">7. การเก็บรักษาข้อมูล</h2>
            <p className="text-slate-400 mb-6">
              เราจะเก็บรักษาข้อมูลของคุณไว้ตราบเท่าที่จำเป็นตามวัตถุประสงค์ที่ระบุไว้
              หรือตามที่กฎหมายกำหนด
            </p>

            <h2 className="text-xl font-semibold text-slate-200 mb-4">8. การเปลี่ยนแปลงนโยบาย</h2>
            <p className="text-slate-400 mb-6">
              เราอาจปรับปรุงนโยบายนี้เป็นครั้งคราว
              การเปลี่ยนแปลงจะมีผลเมื่อเผยแพร่บนเว็บไซต์
            </p>

            <h2 className="text-xl font-semibold text-slate-200 mb-4">9. ติดต่อเรา</h2>
            <p className="text-slate-400">
              หากคุณมีคำถามเกี่ยวกับนโยบายความเป็นส่วนตัว หรือต้องการใช้สิทธิตาม PDPA
              สามารถติดต่อเราได้ทางอีเมล
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
