import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ดูดวงความรัก - Love & Relationships Spread | ดูดวงไพ่ยิปซี',
  description:
    'ดูดวงความรักด้วยไพ่ยิปซี 3 ใบ เพื่อเข้าใจความรู้สึกของตัวเอง คู่ของคุณ และพลังความสัมพันธ์ รับคำแนะนำเกี่ยวกับชีวิตรักของคุณ',
  keywords: [
    'ดูดวงความรัก',
    'ไพ่ยิปซีความรัก',
    'tarot love reading',
    'ดูดวงคู่รัก',
    'ความสัมพันธ์',
    'love spread',
  ],
  openGraph: {
    title: 'ดูดวงความรัก - Love & Relationships Spread',
    description: 'ดูดวงความรักด้วยไพ่ยิปซี 3 ใบ เพื่อเข้าใจความสัมพันธ์ของคุณ',
    type: 'website',
  },
};

export default function LoveReadingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

