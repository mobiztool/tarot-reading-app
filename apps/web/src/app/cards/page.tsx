import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CardEncyclopedia } from '@/components/encyclopedia';

export const metadata: Metadata = {
  title: 'คู่มือไพ่ยิปซี 78 ใบ - Tarot Encyclopedia',
  description:
    'เรียนรู้ความหมายของไพ่ทาโรต์ทั้ง 78 ใบ ทั้ง Major Arcana และ Minor Arcana พร้อมความหมายเมื่อไพ่ขึ้นและกลับหัว',
  keywords: [
    'ไพ่ยิปซี',
    'ความหมายไพ่ทาโรต์',
    'Major Arcana',
    'Minor Arcana',
    'ไพ่ 78 ใบ',
    'เรียนไพ่ยิปซี',
  ],
  openGraph: {
    title: 'คู่มือไพ่ยิปซี 78 ใบ - ความหมายครบทุกใบ',
    description: 'เรียนรู้ความหมายของไพ่ทาโรต์ทั้ง 78 ใบ',
    type: 'website',
  },
};

export default function CardsEncyclopediaPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-950/20 to-slate-900 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <ol className="flex items-center text-sm text-slate-400">
              <li>
                <Link href="/" className="hover:text-purple-400 transition-colors">
                  หน้าแรก
                </Link>
              </li>
              <li className="mx-2">/</li>
              <li className="text-purple-400">คู่มือไพ่ยิปซี</li>
            </ol>
          </nav>

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 bg-clip-text text-transparent mb-4">
              📚 คู่มือไพ่ยิปซี
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              เรียนรู้ความหมายของไพ่ทาโรต์ทั้ง 78 ใบ ทั้ง Major Arcana (ไพ่ใหญ่) และ Minor Arcana (ไพ่เล็ก)
              พร้อมความหมายเมื่อไพ่ขึ้นและกลับหัว
            </p>
          </div>

          {/* Encyclopedia Component */}
          <CardEncyclopedia />
        </div>
      </main>
      <Footer />
    </>
  );
}

