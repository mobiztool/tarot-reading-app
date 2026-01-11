/**
 * Social Proof Component for Pricing Page
 */
'use client';

import { Users, Star, TrendingUp } from 'lucide-react';

interface SocialProofProps {
  userCount?: number;
}

export function SocialProof({ userCount = 10000 }: SocialProofProps) {
  const displayCount = userCount.toLocaleString('th-TH');
  
  return (
    <div className="text-center py-12 bg-gradient-to-r from-purple-900/50 to-indigo-900/50 rounded-2xl border border-purple-500/30">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Users className="w-8 h-8 text-purple-400" />
      </div>
      
      <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">
        เข้าร่วมกับผู้ใช้มากกว่า {displayCount}+ คน
      </h3>
      <p className="text-purple-200 mb-8">
        ที่เลือกใช้แพ็คเกจพรีเมียมของเรา
      </p>
      
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto px-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            <span className="text-2xl font-bold text-white">4.9</span>
          </div>
          <p className="text-purple-300 text-sm">คะแนนเฉลี่ย</p>
        </div>
        <div className="text-center border-x border-purple-500/30">
          <div className="text-2xl font-bold text-white mb-1">50K+</div>
          <p className="text-purple-300 text-sm">การดูดวงต่อวัน</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <span className="text-2xl font-bold text-white">95%</span>
          </div>
          <p className="text-purple-300 text-sm">ความพึงพอใจ</p>
        </div>
      </div>
    </div>
  );
}
