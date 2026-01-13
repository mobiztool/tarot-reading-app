/**
 * Pricing FAQ Component with Accordion
 */
'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    q: 'ฉันสามารถยกเลิกได้ทุกเมื่อหรือไม่?',
    a: 'ได้ค่ะ คุณสามารถยกเลิกได้ทุกเมื่อผ่านหน้าการตั้งค่า คุณจะยังคงเข้าถึงฟีเจอร์พรีเมียมได้จนถึงวันสิ้นสุดรอบบิล ไม่มีค่าปรับหรือค่าธรรมเนียมในการยกเลิก',
  },
  {
    q: 'การทดลองใช้ฟรี 7 วันทำงานอย่างไร?',
    a: 'เมื่อสมัครครั้งแรก คุณจะได้รับการเข้าถึงฟีเจอร์ทั้งหมดของแพ็คเกจที่เลือกฟรี 7 วัน หากยกเลิกก่อนหมดเวลาทดลอง คุณจะไม่ถูกเรียกเก็บเงินใดๆ ทั้งสิ้น',
  },
  {
    q: 'ฉันสามารถเปลี่ยนแพ็คเกจได้หรือไม่?',
    a: 'ได้ค่ะ คุณสามารถอัปเกรดหรือดาวน์เกรดได้ทุกเมื่อ การอัปเกรดจะมีผลทันทีและระบบจะคำนวณส่วนต่างให้อัตโนมัติ ส่วนการดาวน์เกรดจะมีผลเมื่อสิ้นสุดรอบบิลปัจจุบัน',
  },
  {
    q: 'การชำระเงินปลอดภัยหรือไม่?',
    a: 'ใช่ค่ะ เราใช้ Stripe ซึ่งเป็นแพลตฟอร์มการชำระเงินระดับโลกที่ได้มาตรฐาน PCI DSS Level 1 เราไม่เก็บข้อมูลบัตรเครดิตของคุณในเซิร์ฟเวอร์ของเรา ข้อมูลทั้งหมดถูกเข้ารหัสอย่างปลอดภัย',
  },
  {
    q: 'มีการคืนเงินหรือไม่?',
    a: 'หากคุณไม่พอใจภายใน 30 วันแรกของการสมัครสมาชิก เราจะคืนเงินเต็มจำนวนให้คุณโดยไม่ต้องตอบคำถามใดๆ เพียงติดต่อทีมซัพพอร์ตของเรา',
  },
  {
    q: 'ฉันต้องการความช่วยเหลือ ติดต่อได้อย่างไร?',
    a: 'คุณสามารถติดต่อเราได้ผ่านอีเมล support@tarot.app หรือแชทสนับสนุนในแอป สมาชิก VIP จะได้รับการตอบกลับภายใน 24 ชั่วโมง ส่วนสมาชิกทั่วไปภายใน 48 ชั่วโมง',
  },
];

export function PricingFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-3">
      {FAQS.map((faq, i) => (
        <div
          key={i}
          className="bg-white/5 backdrop-blur-sm rounded-xl border border-purple-500/20 overflow-hidden"
        >
          <button
            onClick={() => toggleFAQ(i)}
            className="w-full p-5 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
          >
            <h3 className="font-bold text-white pr-4">{faq.q}</h3>
            <ChevronDown
              className={`w-5 h-5 text-purple-400 flex-shrink-0 transition-transform duration-200 ${
                openIndex === i ? 'rotate-180' : ''
              }`}
            />
          </button>
          <div
            className={`overflow-hidden transition-all duration-200 ${
              openIndex === i ? 'max-h-96 pb-5 px-5' : 'max-h-0'
            }`}
          >
            <p className="text-purple-200 leading-relaxed">{faq.a}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
