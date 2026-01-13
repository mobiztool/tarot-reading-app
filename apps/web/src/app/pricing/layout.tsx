/**
 * Pricing Page Layout with SEO Metadata
 */
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ราคาและแพ็คเกจ | ไพ่ยิปซีออนไลน์ - ดูดวงไพ่ทาโรต์',
  description: 'เลือกแพ็คเกจที่เหมาะกับคุณ เริ่มต้นเพียง ฿99/เดือน รองรับการดูดวงไพ่ทาโรต์ครบทุกแบบ ปลดล็อคพลังไพ่ยิปซี 18 รูปแบบ',
  keywords: ['ไพ่ทาโรต์ ราคา', 'แพ็คเกจดูดวง', 'ซื้อแพ็คเกจ ดูดวง', 'ไพ่ยิปซี premium', 'tarot subscription'],
  openGraph: {
    title: 'ราคาและแพ็คเกจไพ่ยิปซีออนไลน์',
    description: 'แพ็คเกจเริ่มต้น ฿99/เดือน ดูดวงไม่จำกัด ปลดล็อคไพ่ทาโรต์ทุกรูปแบบ',
    type: 'website',
    locale: 'th_TH',
    siteName: 'ไพ่ยิปซีออนไลน์',
    images: [
      {
        url: '/og-pricing.jpg',
        width: 1200,
        height: 630,
        alt: 'ราคาแพ็คเกจไพ่ยิปซีออนไลน์',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ราคาและแพ็คเกจไพ่ยิปซีออนไลน์',
    description: 'แพ็คเกจเริ่มต้น ฿99/เดือน ดูดวงไม่จำกัด',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
