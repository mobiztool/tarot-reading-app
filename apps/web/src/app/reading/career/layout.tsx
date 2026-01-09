import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ดูดวงการงานและการเงิน - Career & Money Spread | ดูดวงไพ่ยิปซี',
  description:
    'ดูดวงการงานและการเงินด้วยไพ่ยิปซี 3 ใบ เพื่อเข้าใจสถานการณ์ปัจจุบัน อุปสรรคและโอกาส และผลลัพธ์ในอนาคต รับคำแนะนำเกี่ยวกับอาชีพและการเงินของคุณ',
  keywords: [
    'ดูดวงการงาน',
    'ดูดวงการเงิน',
    'ไพ่ยิปซีการงาน',
    'tarot career reading',
    'ดูดวงเลื่อนตำแหน่ง',
    'career spread',
    'money tarot',
  ],
  openGraph: {
    title: 'ดูดวงการงานและการเงิน - Career & Money Spread',
    description: 'ดูดวงการงานและการเงินด้วยไพ่ยิปซี 3 ใบ เพื่อเข้าใจเส้นทางอาชีพของคุณ',
    type: 'website',
  },
};

export default function CareerReadingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
