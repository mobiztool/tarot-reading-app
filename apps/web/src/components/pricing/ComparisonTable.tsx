/**
 * Feature Comparison Table for Pricing Page
 */
'use client';

import { Check, X } from 'lucide-react';

const FEATURES = [
  { name: 'การ์ดไพ่ทาโรต์', free: '2 แบบ', basic: '5 แบบ', pro: '10 แบบ', vip: '18 แบบ' },
  { name: 'จำนวนการดูดวงต่อวัน', free: '3 ครั้ง', basic: 'ไม่จำกัด', pro: 'ไม่จำกัด', vip: 'ไม่จำกัด' },
  { name: 'บันทึกประวัติการดูดวง', free: false, basic: true, pro: true, vip: true },
  { name: 'ไม่มีโฆษณา', free: false, basic: true, pro: true, vip: true },
  { name: 'คำทำนายเจาะลึก', free: false, basic: false, pro: true, vip: true },
  { name: 'แนะนำการ์ดที่เหมาะสม', free: false, basic: false, pro: true, vip: true },
  { name: 'ส่งออก PDF', free: false, basic: false, pro: true, vip: true },
  { name: 'AI คำทำนายส่วนตัว', free: false, basic: false, pro: false, vip: true },
  { name: 'วิเคราะห์รูปแบบ', free: false, basic: false, pro: false, vip: true },
  { name: 'แดชบอร์ดพิเศษ', free: false, basic: false, pro: false, vip: true },
  { name: 'ซัพพอร์ตลำดับความสำคัญ', free: false, basic: false, pro: false, vip: true },
];

function renderValue(value: boolean | string) {
  if (typeof value === 'string') {
    return <span className="text-purple-200">{value}</span>;
  }
  return value ? (
    <Check className="w-5 h-5 text-green-400 mx-auto" />
  ) : (
    <X className="w-5 h-5 text-gray-500 mx-auto" />
  );
}

export function ComparisonTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-purple-500/30">
            <th className="text-left p-4 text-purple-200 font-semibold">คุณสมบัติ</th>
            <th className="text-center p-4 text-purple-200 font-semibold">ฟรี</th>
            <th className="text-center p-4 text-purple-200 font-semibold">Basic</th>
            <th className="text-center p-4 text-white font-semibold bg-purple-600/30 rounded-t-lg">Pro</th>
            <th className="text-center p-4 text-yellow-300 font-semibold">VIP</th>
          </tr>
        </thead>
        <tbody>
          {FEATURES.map((feature, i) => (
            <tr 
              key={i} 
              className="border-b border-purple-500/20 hover:bg-white/5 transition-colors"
            >
              <td className="p-4 text-white">{feature.name}</td>
              <td className="text-center p-4">{renderValue(feature.free)}</td>
              <td className="text-center p-4">{renderValue(feature.basic)}</td>
              <td className="text-center p-4 bg-purple-600/20">{renderValue(feature.pro)}</td>
              <td className="text-center p-4">{renderValue(feature.vip)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td className="p-4"></td>
            <td className="text-center p-4 text-purple-200">฿0</td>
            <td className="text-center p-4 text-purple-200">฿99/เดือน</td>
            <td className="text-center p-4 bg-purple-600/20 text-white font-bold">฿199/เดือน</td>
            <td className="text-center p-4 text-yellow-300 font-bold">฿399/เดือน</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
